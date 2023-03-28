using KellermanSoftware.CompareNetObjects;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RatStash;

namespace WishGranter
{
    public class AmmoInformationAuthority
    {
        //! Properties
        public SortedDictionary<string, AmmoReccord> AmmoReccords { get; set; } = new();

        //! Default Con
        public AmmoInformationAuthority() { }

        //! Methods
        public void InitializeInstance()
        {
            bool fromFileSuccess = LoadDataFromFile();
            if (!fromFileSuccess)
            {
                var ammoList = CreateSanitizedAmmoListFromDB();

                foreach (Ammo ammo in ammoList)
                {
                    AmmoReccord ammoReccord = new AmmoReccord(ammo);

                    AmmoReccords.Add(ammoReccord.details.Id, ammoReccord);
                    Console.WriteLine($"AmmoAuthority updated AmmoReccord: {ammo.Name}");
                }
                //Write the info to file for next time
                WriteAmmoInfoToFile();
            }
            else
            {
                Console.WriteLine("Loaded from file successfully.");

                Console.WriteLine("Checking saved results against current database.");
                var changes = invalidateCurrentReccords();
                Console.WriteLine($"Check complete, {changes} reccords updated.");
            }
        }

        public bool LoadDataFromFile()
        {
            // deserialize JSON directly from a file
            if (File.Exists("AmmoInfoAuthority.json"))
            {
                using (StreamReader file = File.OpenText("AmmoInfoAuthority.json"))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    AmmoInformationAuthority Authority_FromFile = (AmmoInformationAuthority)serializer.Deserialize(file, typeof(AmmoInformationAuthority));

                    if (Authority_FromFile != null)
                    {
                        // Add in a check invaalidation with database step here
                        AmmoReccords = Authority_FromFile.AmmoReccords;
                        return true;
                    }
                    return false;
                }
            }
            return false;
        }
        private static List<Ammo> CreateSanitizedAmmoListFromDB()
        {
            List<string> prohibited = new();
            prohibited.Add("5cde8864d7f00c0010373be1");
            prohibited.Add("5d2f2ab648f03550091993ca");
            prohibited.Add("5e85aac65505fa48730d8af2");
            prohibited.Add("5943d9c186f7745a13413ac9");
            prohibited.Add("5996f6fc86f7745e585b4de3");
            prohibited.Add("5996f6d686f77467977ba6cc");
            prohibited.Add("63b35f281745dd52341e5da7");
            prohibited.Add("6241c316234b593b5676b637");
            prohibited.Add("5e85a9f4add9fe03027d9bf1");
            prohibited.Add("5f647fd3f6e4ab66c82faed6");

            // Fleres
            prohibited.Add("62389ba9a63f32501b1b4451");
            prohibited.Add("62389bc9423ed1685422dc57");
            prohibited.Add("62389be94d5d474bf712e709");
            prohibited.Add("635267f063651329f75a4ee8");
            prohibited.Add("624c0570c9b794431568f5d5");
            prohibited.Add("624c09cfbc2e27219346d955");
            prohibited.Add("624c09da2cec124eb67c1046");
            prohibited.Add("624c09e49b98e019a3315b66");
            prohibited.Add("62389aaba63f32501b1b444f");

            //Grenade Stuff
            prohibited.Add("5ede47641cf3836a88318df1");
            prohibited.Add("5996f6cb86f774678763a6ca");
            prohibited.Add("5ede47641cf3836a88318df1");
            prohibited.Add("5ede475339ee016e8c534742");
            prohibited.Add("5ede47405b097655935d7d16");
            prohibited.Add("5f0c892565703e5c461894e9");
            prohibited.Add("5ede475b549eed7c6d5c18fb");
            prohibited.Add("5ede474b0c226a66f5402622");
            prohibited.Add("5d70e500a4b9364de70d38ce");
            prohibited.Add("5656eb674bdc2d35148b457c");
            prohibited.Add("5ede4739e0350d05467f73e8");

            List<Ammo> ammoList = RatStashSingleton.Instance.DB().GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();

            ammoList = ammoList.Where(x => !prohibited.Contains(x.Id)).ToList();

            return ammoList;
        }
        public AmmoReccord GetAmmoReccordById(string id)
        {
            return AmmoReccords.FirstOrDefault(x => x.Key.Equals(id)).Value;
        }

        public List<KeyValuePair<string, AmmoReccord>> GetAllAmmoReccordsWithDistance(int distance)
        {
            var result = AmmoReccords.Where(x => x.Value.rangeIntervals.Contains(distance)).ToList();
            return result;
        }

        public int invalidateCurrentReccords()
        {
            int counter = 0;
            // Get all of the ammo
            var ammoList = CreateSanitizedAmmoListFromDB();

            CompareLogic compareLogic = new CompareLogic();

            foreach (var reccord in AmmoReccords)
            {
                // Match a reccord with each ammo
                var temp = ammoList.FirstOrDefault(x=>x.Id == reccord.Key);
                if (temp != null)
                {
                    ComparisonResult comparision = compareLogic.Compare(temp, reccord.Value.details);

                    if (!comparision.AreEqual)
                    {
                        Console.WriteLine(comparision.DifferencesString);
                        //If there is a match, run the update check
                        var result2 = reccord.Value.UpdateAmmoReccord(temp);
                        if(result2 == true)
                            counter++;
                    }
                }
            }
            // At the end, save the new changes to file.
            WriteAmmoInfoToFile();

            return counter;
        }
        public void WriteAmmoInfoToFile()
        {
            //todo Need to rename this file to something more appropriate.
            using StreamWriter writetext = new("AmmoInfoAuthority.json");
            writetext.Write(JToken.Parse(JsonConvert.SerializeObject(this)));
        }
    }
}

