using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RatStash;
using System.Diagnostics;
using System.IO.Compression;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using WishGranterProto.ExtensionMethods;

namespace WishGranter.TerminalBallisticsSimulation
{
    /*
     * What be in this class? It will:
     * 1 - calculate the results of all triplet combinations of Ammo, Armor and Distance
     * 2 - store these results in a local JSON file so that they can be quickly loaded on boot
     *   2a - Each triplet should be stored in a CompoundKey-Value pair, where the CompoundKey == {ArmorID-ArmorID-Distance}
     *   2b - Contract: you will never make a request for a CompKey that doesn't exist due to limits put in the FE.
     * 3 - Provide the means to update this data when there are changes to Ammo or Armor in a selective fashion
     * 4 - Provide the means for accesssing a given triplet of data, a subset, or the whole set of data.
     */
    public record struct TBS_CompoundKey
    (
        string armorId,
        int armorDuraPerc,
        string ammoId,
        int distance
    );

    public class FloatFormatConverter : System.Text.Json.Serialization.JsonConverter<double>
    {
        public override double Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TryGetDouble(out var value))
            {
                return value;
            }
            throw new InvalidDataException();
        }

        public override void Write(Utf8JsonWriter writer, double value, JsonSerializerOptions options)
        {
            writer.WriteRawValue(value.ToString("0.###"));
        }
    }

    public class TBS_datastore
    {
        private static TBS_datastore? _instance = null;

        public Dictionary<TBS_CompoundKey, TransmissionArmorTestResult> TBS_Data { get; set; } = new();

        private static readonly object lockObj = new object();
         
        private TBS_datastore()
        {

        }
        public static TBS_datastore Instance
        {
            get
            {
                lock (lockObj)
                {
                    if (_instance == null)
                    {
                        _instance = new TBS_datastore();
                    }
                }
                return _instance;
            }
        }

        public bool LoadDataFromFile()
        {
            // deserialize JSON directly from a file
            if (File.Exists("TBS_data.json"))
            {
                using (StreamReader file = File.OpenText("TBS_data.json"))
                {
                    Newtonsoft.Json.JsonSerializer serializer = new();
                    Dictionary<TBS_CompoundKey, TransmissionArmorTestResult> data_FromFile = (Dictionary<TBS_CompoundKey, TransmissionArmorTestResult>)serializer.Deserialize(file, typeof(Dictionary<TBS_CompoundKey, TransmissionArmorTestResult>));

                    if (data_FromFile != null)
                    {
                        // Add in a check invaalidation with database step here
                        TBS_Data = data_FromFile;
                        return true;
                    }
                    return false;
                }
            }
            return false;
        }


        public static byte[] Compress(string json)
        {
            var data = Encoding.UTF8.GetBytes(json);
            using var compressedStream = new MemoryStream();
            using var zipStream = new GZipStream(compressedStream, CompressionMode.Compress);
            zipStream.Write(data, 0, data.Length);
            zipStream.Close();
            return compressedStream.ToArray();
        }

        public static string Decompress(byte[] data)
        {
            using var compressedStream = new MemoryStream(data);
            using var zipStream = new GZipStream(compressedStream, CompressionMode.Decompress);
            using var resultStream = new MemoryStream();
            zipStream.CopyTo(resultStream);
            var bytes = resultStream.ToArray();
            return Encoding.UTF8.GetString(bytes);
        }

        public void WriteDataToDB()
        {
            using var db = new MonolitDB();
            Console.WriteLine($"Database path: {db.DbPath}.");

            foreach(var item in TBS_Data)
            {
                db.Add(new SQL_TBS_Result
                {
                    ArmorId = item.Key.armorId,
                    DurabilityPerc = item.Key.armorDuraPerc,
                    AmmoId = item.Key.ammoId,
                    Distance = item.Key.distance,
                    Killshot = item.Value.KillShot,
                    Shots = item.Value.Shots
                });
            }
            db.SaveChanges();
        }

        public void WriteDataToFile()
        {
            //var options = new JsonSerializerOptions()
            //{
            //    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            //};
            //options.Converters.Add(new FloatFormatConverter());


            //var shortened_doubles = System.Text.Json.JsonSerializer.Serialize(TBS_Data, options);

            //var turks_compress_and_byte_tourture = Compress(shortened_doubles);

            ////todo Need to rename this file to something more appropriate.
            //using StreamWriter writetext = new("TBS_data2.txt");
            //writetext.Write(turks_compress_and_byte_tourture);

            var temp = JToken.Parse(JsonConvert.SerializeObject(TBS_Data));
            var bytes = Compress(temp.ToString());
            //todo Need to rename this file to something more appropriate.
            using StreamWriter writetext = new("TBS_data2.txt");
            writetext.Write(bytes);
        }

        public void Bodge_Armor_Ammo_DB()
        {
            var AllArmorOptions = WG_Output.WriteArmorList(RatStashSingleton.Instance.DB());

            var AllAmmoRecords = AmmoInfoAuthoritySingleton.Instance.info.GetAllReccordsAsList();

            using var db = new MonolitDB();
            Console.WriteLine($"Database path: {db.DbPath}.");

            foreach (var item in AllAmmoRecords)
            {
                var check = db.Ammos.Any(x=> x.Id == item.details.Id);
                if (check == false)
                {
                    db.Add(new SQL_Ammo { Id = item.details.Id, Name = item.details.Name });
                }
                
            }

            foreach (var item in AllArmorOptions)
            {
                var check = db.Armors.Any(x => x.Id == item.Value);
                if (check == false)
                {
                    db.Add(new SQL_Armor { Id = item.Value, Name = item.Label });
                }
            }
            db.SaveChanges();
        }

        // As doing this only takes 5seconds on the dev machine, It is currnetly fine to do this as a part of the app start-up
        public int CalculateAllCombinations()
        {
            Dictionary<TBS_CompoundKey, TransmissionArmorTestResult> New_TBS_Data = new();

            var AllAmmoRecords = AmmoInfoAuthoritySingleton.Instance.info.GetAllReccordsAsList();

            //? Probably need to spin this off into an Armor Info Singleton too...
            var AllArmorOptions = WG_Output.WriteArmorList(RatStashSingleton.Instance.DB());
            List<ArmorItem> AllArmorRecords = new();
            foreach (var item in AllArmorOptions)
            {
                ArmorItem armorItem = WG_Calculation.GetArmorItemFromRatstashByIdString(item.Value, RatStashSingleton.Instance.DB());
                AllArmorRecords.Add(armorItem);
            }

            // For development, let's limit it to 5.45 for now.
            //AllAmmoRecords = AllAmmoRecords.Where(x => x.details.Name.Contains("5.45")).ToList();

            foreach (var armor in AllArmorRecords)
            {
                var watch = new Stopwatch();
                watch.Start();

                foreach (var bullet in AllAmmoRecords)
                {
                    var ammo = RatStashSingleton.Instance.DB().GetItem(bullet.details.Id);

                    foreach (var distance in bullet.rangeTable)
                    {
                        //? Might expand to do this once the SQL system is in place
                        //for (int i = 100; i >= 1; i--)
                        //{
                        //    // We will sidestep the combination explosion problem by only pre-calculating armor at 100% durability
                        //    var CalculationResult = WG_Calculation.FindPenetrationChanceSeries(armor, (Ammo)ammo, i, bullet.ballisticStats.penetration, bullet.ballisticStats.damage);
                        //    var entryCompKey = new TBS_CompoundKey(armor.Id, i, ammo.Id, distance.Key);

                        //    New_TBS_Data.Add(entryCompKey, CalculationResult);
                        //}

                        // We will sidestep the combination explosion problem by only pre-calculating armor at 100% durability
                        var CalculationResult = WG_Calculation.FindPenetrationChanceSeries(armor, (Ammo)ammo, 100, bullet.ballisticStats.penetration, bullet.ballisticStats.damage);
                        var entryCompKey = new TBS_CompoundKey(armor.Id, 100, ammo.Id, distance.Key);

                        New_TBS_Data.Add(entryCompKey, CalculationResult);

                    }
                }
                Console.WriteLine($"Finished {armor.Name} in {watch.ElapsedMilliseconds}ms.");
            }

            TBS_Data = New_TBS_Data;
            WriteDataToDB();

            return TBS_Data.Count;
        }


    }
}
