using RatStash;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Report
    {

        public static int FindTraderLevelFromFile(string searchId)
        {
            var TraderOffersJSON = JsonConvert.DeserializeObject<JObject>(File.ReadAllText("TarkovDev_jsons\\TraderOffers.json"));
            int result = -1;
            string[] traderNames =
            {
                "Prapor", "Therapist", "Fence", "Skier", "Peacekeeper","Mechanic", "Ragman", "Jaeger"
            };

            foreach (string traderName in traderNames)
            {
                for (int i = 1; i <= 4; i++)
                {
                    string searchJSONpath = $"$.data.traders.[?(@.name=='{traderName}')].levels.[?(@.level=={i})].cashOffers.[*].item.id";
                    var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();

                    filtering.ForEach(x =>
                    {
                        if (x.ToString() == searchId)
                        {
                            result = i;
                            i = 4;
                        }

                    });
                }
            }
            return result;
        }

        private static int FindTraderLevel(string searchId, JObject TraderOffersJSON)
        {
            int result = -1;
            string[] traderNames =
            {
                "Prapor", "Therapist", "Fence", "Skier", "Peacekeeper","Mechanic", "Ragman", "Jaeger"
            };

            foreach (string traderName in traderNames)
            {
                for (int i = 1; i <= 4; i++)
                {
                    string searchJSONpath = $"$.data.traders.[?(@.name=='{traderName}')].levels.[?(@.level=={i})].cashOffers.[*].item.id";
                    var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();

                    filtering.ForEach(x =>
                    {
                        if (x.ToString() == searchId)
                        {
                            result = i;
                            i = 4;
                        }
                            
                    });
                }
            }
            return result;
        }

        public static void ChestRigReport(List<ChestRig> ChestRigs, string filename, JObject TraderOffersJSON)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,ArmorClass,ArmorMaterial,MaxDurability,BluntThroughput,TraderLevel");
                sw.Close();
            }

            foreach (ChestRig rig in ChestRigs)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{rig.Name},");
                    sw.Write($"{rig.ArmorClass},");
                    sw.Write($"{rig.ArmorMaterial},");
                    sw.Write($"{rig.MaxDurability},");
                    sw.Write($"{rig.BluntThroughput},");

                    sw.Write($"{FindTraderLevel(rig.Id, TraderOffersJSON)}\n");

                    sw.Close();
                }
            }
        }

        public static void ArmorReport(List<Armor> Armors, string filename, JObject TraderOffersJSON)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,ArmorClass,ArmorMaterial,MaxDurability,BluntThroughput,Indestructibility,TraderLevel");
                sw.Close();
            }

            foreach (Armor armor in Armors)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{armor.Name},");
                    sw.Write($"{armor.ArmorClass},");
                    sw.Write($"{armor.ArmorMaterial},");
                    sw.Write($"{armor.MaxDurability},");
                    sw.Write($"{armor.BluntThroughput},");
                    sw.Write($"{armor.Indestructibility},");

                    sw.Write($"{FindTraderLevel(armor.Id, TraderOffersJSON)}\n");

                    sw.Close();
                }
            }
        }

        public static void AmmoReport(List<Ammo> Ammo, string filename, JObject TraderOffersJSON)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";
            
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,Caliber,Damage,PenetrationPower,PenetrationPowerDiviation,ArmorDamage%,Accuracy,Recoil,FragChance,LBC,HBC,Speed,Tracer,TraderLevel");
                sw.Close();
            }

            foreach (Ammo bullet in Ammo)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{bullet.Name},");
                    sw.Write($"{bullet.Caliber},");
                    sw.Write($"{bullet.Damage},");
                    sw.Write($"{bullet.PenetrationPower},");
                    sw.Write($"{bullet.PenetrationPowerDiviation},");
                    sw.Write($"{bullet.ArmorDamage},");
                    sw.Write($"{bullet.AmmoAccuracy},");
                    sw.Write($"{bullet.AmmoRec},");
                    if (bullet.PenetrationPower > 19)
                        sw.Write($"{bullet.FragmentationChance},");
                    else
                        sw.Write("0,");
                    sw.Write($"{bullet.LightBleedingDelta},");
                    sw.Write($"{bullet.HeavyBleedingDelta},");
                    sw.Write($"{bullet.InitialSpeed},");
                    sw.Write($"{bullet.Tracer},");
                    sw.Write($"{FindTraderLevel(bullet.Id, TraderOffersJSON)}\n");

                    sw.Close();
                }
            }
        }

        public static void WeaponReport(List<Weapon> Weapons, string filename, JObject TraderOffersJSON)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,Caliber,RoF,SS_RoF," +
                    "Ergonomics,RecoilForceUp,RecoilDispersion,Convergence,RecoilAngle,CameraRecoil,DeviationCurve," +
                    "HipAccuracyRestorationDelay,HipAccuracyRestorationSpeed,HipInnaccuracyGain," +
                    "DurabilityBurnRatio,HeatFactorGun,CoolFactorGun,AllowOverheat,HeatFactorByShot,CoolFactorGunMods," +
                    "BaseMalfunctionChance,AllowJam,AllowFeed,AllowMisfire,AllowSlide," +
                    "TraderLevel");
                sw.Close();
            }

            foreach (Weapon item in Weapons)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{item.Name},");
                    sw.Write($"{item.AmmoCaliber},");
                    sw.Write($"{item.BFirerate},");
                    sw.Write($"{item.SingleFireRate},");

                    sw.Write($"{item.Ergonomics},");
                    sw.Write($"{item.RecoilForceUp},");
                    sw.Write($"{item.RecoilDispersion},");
                    sw.Write($"{item.Convergence},");
                    sw.Write($"{item.RecoilAngle},");
                    sw.Write($"{item.CameraRecoil},");
                    sw.Write($"{item.DeviationCurve },");

                    sw.Write($"{item.HipAccuracyRestorationDelay},");
                    sw.Write($"{item.HipAccuracyRestorationSpeed},");
                    sw.Write($"{item.HipInaccuracyGain},");

                    sw.Write($"{item.DurabilityBurnRatio},");
                    sw.Write($"{item.HeatFactorGun},");
                    sw.Write($"{item.CoolFactorGun},");
                    sw.Write($"{item.AllowOverheat},");
                    sw.Write($"{item.HeatFactorByShot},");
                    sw.Write($"{item.CoolFactorGunMods},");

                    sw.Write($"{item.BaseMalfunctionChance},");
                    sw.Write($"{item.AllowJam},");
                    sw.Write($"{item.AllowFeed},");
                    sw.Write($"{item.AllowMisfire},");
                    sw.Write($"{item.AllowSlide},");

                    sw.Write($"{FindTraderLevel(item.Id, TraderOffersJSON)}\n");

                    sw.Close();
                }
            }
        }
    }
}
