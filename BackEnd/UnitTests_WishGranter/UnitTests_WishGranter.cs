using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranterProto;
using WishGranterProto.ExtensionMethods;
using System.Linq;
using RatStash;
using System.Collections.Generic;
using Force.DeepCloner;
using Newtonsoft.Json.Linq;
using System.IO;
using WishGranter;
using Newtonsoft.Json;
using WishGranter.TerminalBallisticsSimulation;
using WishGranter.Statics;
using WishGranter.AmmoEffectivenessChart;
using System.Text.Json;

namespace WishGranterTests
{
    [TestClass]
    public class FittingThingTests
    {
        [TestMethod]
        public void Test_GetAllPossibleChildrenIdsForCI()
        {
            var result = ModsWeaponsPresets.GetAllPossibleChildrenIdsForCI("60db29ce99594040e04c4a27");
        }


        [TestMethod]
        public void Test_FittingBundle_Many_Many()
        {
            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            List<FittingBundle> bundles = new List<FittingBundle>();

            foreach (var preset in ModsWeaponsPresets.BasePresets.Where(x=>x.PurchaseOffer.OfferType == OfferType.Cash).ToList())
            {
                for (int i = preset.PurchaseOffer.ReqPlayerLevel; i <= 40; i++)
                {
                    var param = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Loud, i, false);
                    FittingBundle fittingBundle = new(preset, param);
                    bundles.Add(fittingBundle);
                }
            }

            Console.WriteLine($"bundles.Count: {bundles.Count}");

            //var jsonOptions = new JsonSerializerOptions
            //{
            //    WriteIndented = true
            //};
            //string temp = System.Text.Json.JsonSerializer.Serialize(bundles, jsonOptions);

            //// Save the result as a local JSON
            //using StreamWriter writetext = new("TESTING_WeaponBundles.json"); // This is here as a debug/verify
            //writetext.Write(temp);
            //writetext.Close();
        }

        [TestMethod]
        public void Test_Hydrate_DB_Fittings_CashOnly()
        {
            var result = Fitting.Hydrate_DB_WithBasicFittings();
            Console.WriteLine($"Changes: {result}");
        }


        [TestMethod]
        public void Test_Hydrate_DB_GunsmithParameters()
        {
            var result = GunsmithParameters.Hydrate_DB_GunsmithParameters();
            Console.WriteLine($"Changes: {result}");
        }

        [TestMethod]
        public void Test_Hydrate_DB_WithPresets()
        {
            var result = BasePreset.Hydrate_DB_BasePreset();
            Console.WriteLine($"Changes: {result}");
        }

        [TestMethod]
        public void Test_Hydrate_DB_WithWeapons()
        {
            var result = Weapon_SQL.Hydrate_DB_WithWeapons();
            Console.WriteLine($"Changes: {result}");
        }


        //[TestMethod]
        //public void Test_FittingBundle_Many()
        //{

        //    var preset = ModsWeaponsPresets.BasePresets[0];
        //    List<FittingBundle> bundles = new List<FittingBundle>();

        //    using var db = new Monolit();
        //    Console.WriteLine($"Database path: {db.DbPath}.");

        //    for (int i = preset.PurchaseOffer.ReqPlayerLevel; i <= 40; i++)
        //    {
        //        var param = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Loud, i, true);
        //        FittingBundle fittingBundle = new(preset, param);
        //        bundles.Add(fittingBundle);
        //    }
        //    db.AddRange(bundles);
        //    db.SaveChanges();

        //    Console.WriteLine($"bundles.Count: {bundles.Count}");
        //}

        [TestMethod]
        public void Test_FittingBundle_1()
        {
            var preset = ModsWeaponsPresets.BasePresets[0];
            var param = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Loud, 25, true);

            FittingBundle fittingBundle = new(preset, param);
            Console.WriteLine("Fin.");
        }



        [TestMethod]
        public void Test_GetBestAmmo()
        {
            var preset = ModsWeaponsPresets.BasePresets[0];
            var param = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Loud, 15, true);
            PurchasedAmmo.GetBestPurchasedAmmo(preset, param);
        }
    }

    [TestClass]
    public class AECTests
    {
        [TestMethod]
        public void Test_Constructor()
        {
            AEC AEC = new();

            Console.WriteLine($"AEC.Rows.Count: {AEC.Rows.Count}");
        }

        [TestMethod]
        public void Test_BallsiticThing()
        {
            SimulationParameters parameters = new SimulationParameters
            {
                ArmorClass = 4,
                MaxDurability = 38,
                StartingDurabilityPerc = 100,
                BluntThroughput = .156f,
                ArmorMaterial = ArmorMaterial.Aramid,
                TargetZone = TargetZone.Head,
                Penetration = 47.593f,
                Damage = 37.715f,
                ArmorDamagePerc = 58
            };

            var result = Ballistics.SimulateHitSeries_Engine(parameters);

            Console.WriteLine($"result.Count: {result.Count}");
            Console.WriteLine($"result[0].PenetrationDamage: {result[0].PenetrationDamage}");
            Console.WriteLine($"result[0].BluntDamage: {result[0].BluntDamage}");
        }
        [TestMethod]
        public void Test_BallsiticThing2()
        {
            var result = Ballistics.PenetrationDamage(100, 4, 35.425 , 44.702);

            Console.WriteLine($"result: {result}");
        }

    }

    [TestClass]
    public class MonolitTests
    {
        [TestMethod]
        public void Test_MonolitRebuild()
        {
            Ammo_SQL.Dev_Generate_Save_All_Ammo();
            BallisticDetails.Dev_Generate_Save_All_BallisticDetails();
            ArmorItemStats.Dev_Generate_Save_All_ArmorItems();
            BallisticTest.Dev_Generate_Save_All_BallisticTests();
            BallisticRating.Dev_Generate_Save_All_BallisticRatings();
        }

        [TestMethod]
        public void Test_UpdateEverthingFromRatStashOrigin()
        {
            Ammo_SQL.UpdateEverthingFromRatStashOrigin();
        }

        [TestMethod]
        public void Test_BallisticRatingsTable_Generation()
        {
            BallisticRating.Dev_Generate_Save_All_BallisticRatings();
        }

        [TestMethod]
        public void Test_BallisticTestsTable_Generation()
        {
            BallisticTest.Dev_Generate_Save_All_BallisticTests();
        }

        [TestMethod]
        public void Test_ArmorItemsTable_Generation()
        {
            ArmorItemStats.Dev_Generate_Save_All_ArmorItems();
        }

        [TestMethod]
        public void Test_BallisticDetailsTable_Generation()
        {
            BallisticDetails.Dev_Generate_Save_All_BallisticDetails();
        }
        
        [TestMethod]
        public void Test_AmmoTable_Generation()
        {
            Ammo_SQL.Dev_Generate_Save_All_Ammo();
        }
    }
    [TestClass]
    public class ModsWeaponsPresetsTests
    {
        //[TestMethod]
        //public void Test_VerifyBasePresets_Count()
        //{
        //    var result = ModsWeaponsPresets.BasePresets;
        //    Console.WriteLine($"Count: {result.Count}");
        //    foreach (var preset in result)
        //    {
        //        Console.WriteLine($"{preset.Name}, {preset.Id},[{preset.Ergonomics}, {preset.Recoil_Vertical}, {preset.Weight}] {preset.PurchaseOffer.OfferType}");
        //    }
        //}

        [TestMethod]
        public void Test_GetShortListOfModsForCompundItemWithParams_AK74_Loud_40_noFLea()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74 5.45")).Id;
            List<WeaponMod> result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(weapon_id, MuzzleType.Loud, 40, false);
            Console.WriteLine($"Count: {result.Count}");
            foreach(WeaponMod mod in result)
            {
                Console.WriteLine($"{mod.Name}, {mod.Id}");
            }
        }
        [TestMethod]
        public void Test_GetShortListOfModsForCompundItemWithParams_AK74_Silent_40_noFLea()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74 5.45")).Id;
            List<WeaponMod> result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(weapon_id, MuzzleType.Quiet, 40, false);
            Console.WriteLine($"Count: {result.Count}");
            foreach (WeaponMod mod in result)
            {
                Console.WriteLine($"{mod.Name}, {mod.Id}");
            }
        }
        [TestMethod]
        public void Test_GetShortListOfModsForCompundItemWithParams_AK74_Any_40_noFLea()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74 5.45")).Id;
            List<WeaponMod> result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(weapon_id, MuzzleType.Any, 40, false);
            Console.WriteLine($"Count: {result.Count}");
            foreach (WeaponMod mod in result)
            {
                Console.WriteLine($"{mod.Name}, {mod.Id}");
            }
        }
    }

    [TestClass]
    public class GunsmithTests
    {
        static string AK_74M_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74M")).Id;
        static string M4A1_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Colt M4A1 5.56x45 ass")).Id;
        static string AK_74N_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74N")).Id;

        [TestMethod]
        public void Test_FitWeapon_AK74N_Loud_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74N_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Loud, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_AK74N_Quiet_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74N_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Quiet, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_AK74N_Any_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74N_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Any, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_M4A1_Loud_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(M4A1_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Loud, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_M4A1_Silent_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(M4A1_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Quiet, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_M4A1_Any_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(M4A1_id);
            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Any, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_74M_Loud_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74M_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Loud, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_74M_Silent_MetaRecoil()
        {
            var weapon = (Weapon) StaticRatStash.DB.GetItem(AK_74M_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Quiet, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_74M_Any_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74M_id);
            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Any, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
    }


    [TestClass]
    public class SingletonTests
    {
        [TestMethod]
        public void Test_GetSomeIDs_Init()
        {
            var adar = StaticRatStash.DB.GetItem(x => x.Name.Contains("AR-15 ADAR 2-15 wooden stock"));
            var r43_val = StaticRatStash.DB.GetItem(x => x.Name.Contains("AS VAL Rotor 43 pistol grip & buffer tube"));
            var cqr = StaticRatStash.DB.GetItem(x => x.Name.Contains("AR-15 Hera Arms CQR pistol grip/buttstock"));
            var cqr47 = StaticRatStash.DB.GetItem(x => x.Name.Contains("AKM/AK-74 Hera Arms CQR47 pistol grip/buttstock"));
        }

        [TestMethod]
        public void Test_RatStashSingleton_Init()
        {
            var result = RatStashSingleton.Instance.DB().GetItems();
            Console.WriteLine($"Count of Items in RatstashSingleton: {result.Count()}");
        }

        [TestMethod]
        public void Test_TBS_datastore_Init()
        {
            var result = TBS_datastore.Instance.CalculateAllCombinations();
            Console.WriteLine($"Count: {result}");
        }

        [TestMethod]
        public void Test_TBS_datastore_AA_Bodge()
        {
            TBS_datastore.Instance.Bodge_Armor_Ammo_DB();
        }

        [TestMethod]
        public void Test_StaticRatStash_Count()
        {
            int result = StaticRatStash.DB.GetItems().Count();
            Console.WriteLine($"Ratstash.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticArmors_CleanedCount()
        {
            var result = Armors.Cleaned.Count;
            Console.WriteLine($"Armors.Cleaned.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticAmmos_CleanedCount()
        {
            var result = Ammos.Cleaned.Count;
            Console.WriteLine($"Ammos.Cleaned.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticModsWeapons_Count()
        {
            var result = ModsWeaponsPresets.CleanedWeapons.Count;
            var result2 = ModsWeaponsPresets.CleanedMods.Count;

            Console.WriteLine($"AllWeapons.Count: {result}");
            Console.WriteLine($"AllMods.Count: {result2}");
        }

        [TestMethod]
        public void Test_WeaponsStatsAPIPatch()
        {
            var result = ModsWeaponsPresets.CleanedWeapons.Find(x=>x.Name.Contains("OP-SKS"));
            Console.WriteLine($"OP-SKS vertical Recoil: {result.RecoilForceUp}");
            Console.WriteLine($"FirstWeapon: {result}");
        }

        [TestMethod]
        public void Test_StaticModsWeapons_Silencers()
        {
            var result = ModsWeaponsPresets.GetListWithQuietMuzzles().Count;
            Console.WriteLine($"CleanedMods.Silencers.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticModsWeapons_LoudMuzzles()
        {
            var result = ModsWeaponsPresets.GetListWithLoudMuzzles().Count;
            Console.WriteLine($"CleanedMods.LoudMuzzles.Count: {result}");
        }

        [TestMethod]
        public void Test_TarkovDevApi_GetFleaMarketData()
        {
            var result = TarkovDevAPI.GetFleaMarketData();
            Console.WriteLine($"GetAllFlea.Result: {result}");
        }

        [TestMethod]
        public void Test_TarkovDevApi_GetAllMarketData()
        {
            var result = TarkovDevAPI.GetAllMarketData();
            Console.WriteLine($"GetAllFlea.Result: {result}");
        }

        [TestMethod]
        public void Test_GetAllPossibleChildrenIdsForCI()
        {
            CompoundItem input = (CompoundItem) StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74M 5.45x39 assault rifle"));

            var result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(input.Id, MuzzleType.Loud, 40, false);
            Console.WriteLine($"GetShortListOfModsForCompundItemWithParams.Result.Count: {result.Count}");
        }

        [TestMethod]
        public void Test_StaticTest()
        {
            var loadDict = Market.LoyaltyLevelsByPlayerLevel;

            Console.WriteLine($"wtf: {loadDict.Count}");
            Console.WriteLine($"wtf: {loadDict}");
        }

    }


    [TestClass]
    public class BallisticTests
    {
        static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

        [TestMethod]
        public void Test_AmmoAuthority_Init()
        {
            AmmoInformationAuthority result = new();
            
            using StreamWriter writetext = new("RangeTables.json");
            writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_GetDamageAndPenetrationAtSpeed_545BT_001m()
        {
            var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(866.9968f, 880f, 42, 42);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_GetDamageAndPenetrationAtSpeed_545BT_010m()
        {
            var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(854.3049f, 880f, 42, 42);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_GetDamageAndPenetrationAtSpeed_545BT_050m()
        {
            var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(806.42944f, 880f, 42, 42);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_GetDamageAndPenetrationAtSpeed_545BT_100m()
        {
            var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(731.42474f, 880f, 42, 42);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_GetBulletSpeedAtDistance_545BT_100m()
        {
            var result = WG_Ballistics.GetBulletSpeedAtDistance(100, 3.02f, 5.62f, .209f, 880);
            Console.WriteLine(result);

            Assert.IsTrue(731.42474 - result < .00005);
        }
        [TestMethod]
        public void Test_GetBulletSpeedAtDistance_545BT_400m()
        {
            var result = WG_Ballistics.GetBulletSpeedAtDistance(400, 3.02f, 5.62f, .209f, 880);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_BulletRangeTableData_invalidateCurrentData_545BT()
        {
            BulletRangeTableData instance = new();
            instance.bulletID = "56dff061d2720bb5668b4567";
            instance.bulletName = "5.45x39mm BT gs";

            bulletStatsPOCO bulletStatsPOCO = new bulletStatsPOCO();
            bulletStatsPOCO.penetration = 42;
            bulletStatsPOCO.damage = 42;
            bulletStatsPOCO.massGrams = 3.02f;
            bulletStatsPOCO.diameterMillimeters = 5.62f;
            bulletStatsPOCO.ballisticCoefficient = .209f;
            bulletStatsPOCO.initialSpeed = 880;

            var result = instance.invalidateCurrentData(bulletStatsPOCO, RatStashDB);
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void Test_BulletRangeTablesAuthority_All()
        {

            List<Ammo> Ammo = RatStashDB.GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
            Ammo = Ammo.Where(x => x.Name.Contains("12/70")).ToList();
            OLD_AmmoInformationAuthority bulletRangeTablesAuthority = new OLD_AmmoInformationAuthority(Ammo, RatStashDB);

            using StreamWriter writetext = new("RangeTables.json");
            writetext.Write(JToken.Parse(JsonConvert.SerializeObject(bulletRangeTablesAuthority)));

            Console.WriteLine($"Number of entries: {bulletRangeTablesAuthority.RangeTables_Ammo.Count}");
        }
    }

    [TestClass]
    public class CalculationTests
    {
        static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

        [TestMethod]
        public void test()
        {
            List<Ammo> Ammo = RatStashDB.GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
            Console.WriteLine("blah");
        }

        [TestMethod]
        public void Test_Korund_Penetration_545_BT()
        {
            ArmorItem armorItem = WG_Calculation.GetArmorItemFromRatstashByIdString("5f5f41476bdad616ad46d631", RatStashDB);
            var Bullet = (Ammo) RatStashDB.GetItem("56dff061d2720bb5668b4567");
            var result = WG_Calculation.DamageToArmorPenetration(armorItem.ArmorClass, armorItem.ArmorMaterial, Bullet.PenetrationPower, Bullet.ArmorDamage, 100);
            Console.WriteLine(result);


        }
        [TestMethod]
        public void Test_Korund_Block_545_BT()
        {
            ArmorItem armorItem = WG_Calculation.GetArmorItemFromRatstashByIdString("5f5f41476bdad616ad46d631", RatStashDB);
            var Bullet = (Ammo)RatStashDB.GetItem("56dff061d2720bb5668b4567");
            var result = WG_Calculation.DamageToArmorBlock(armorItem.ArmorClass, armorItem.ArmorMaterial, Bullet.PenetrationPower, Bullet.ArmorDamage, 100);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_Korund_Block_7mmBuckshot()
        {
            ArmorItem armorItem = WG_Calculation.GetArmorItemFromRatstashByIdString("5f5f41476bdad616ad46d631", RatStashDB);
            var Bullet = (Ammo)RatStashDB.GetItem("560d5e524bdc2d25448b4571");
            var result = WG_Calculation.DamageToArmorBlock(armorItem.ArmorClass, armorItem.ArmorMaterial, Bullet.PenetrationPower, Bullet.ArmorDamage, 100);
            Console.WriteLine(result);
        }
    }
    [TestClass]
    public class DataScienceTests
    {
        static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

        [TestMethod]
        public void Test_TagillaMask()
        {
            var result = RatStashDB.GetItems(x => x.Name.Contains("Tagilla's welding mask"));
        }


        [TestMethod]
        public void Test_CompileArmorTable()
        {
            var result = WG_DataScience.CompileArmorTable(RatStashDB);

            Console.WriteLine(result.Count);
            Assert.AreEqual(107, result.Count);
        }

        [TestMethod]
        public void Test_CompileAmmoTable()
        {
            var result = WG_DataScience.CompileAmmoTable(RatStashDB);

            Console.WriteLine(result.Count);
            Assert.AreEqual(166, result.Count);
        }

        [TestMethod]
        public void Test_CalculateArmorEffectivenessData_RatRig()
        {
            ArmorItem ratrig = new ArmorItem();
            ratrig.ArmorMaterial = ArmorMaterial.Titan;
            ratrig.BluntThroughput = .36;
            ratrig.MaxDurability = 40;
            ratrig.ArmorClass = 4;
            ratrig.Name = "RatRig dummy";

            var result = WG_DataScience.CalculateArmorEffectivenessData(ratrig, RatStashDB);

            Console.WriteLine(result.Count);
        }

    }

    [TestClass]
    public class FittingTests
    {
        static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
        static List<WeaponMod> AllAvailibleWeaponMods = RatStashDB.GetItems(x => x is WeaponMod).Cast<WeaponMod>().ToList();

        static int filterMode = 1;

        [TestMethod]
        public void getAltynFS()
        {
            var altynFS = RatStashDB.GetItem("5aa7e373e5b5b000137b76f0");

            Console.WriteLine(altynFS.GetType().Name);

            var armoredEquipment = RatStashDB.GetItems(x => x.GetType() == typeof(ArmoredEquipment)).Cast<ArmoredEquipment>().ToList();
            armoredEquipment = armoredEquipment.Where(x => x.ArmorClass > 1).ToList();

            Console.WriteLine(armoredEquipment.Count);

            //todo Add this to the armorSelection List method and so on.
        }

        [TestMethod]
        public void SMFS_Wrapper_AKS_74UB()
        {
            var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);

            Weapon Weapon = (Weapon)RatStashDB.GetItem("5839a40f24597726f856b511");
            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(Weapon, filtered);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();
            HashSet<string> CommonBlackListIDs = new();


            var Meta_Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            var Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "recoil", CommonBlackListIDs);
            var Meta_Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
            var Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "ergo", CommonBlackListIDs);

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Recoil : {Recoil.Name}");
            var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Recoil);
            Console.WriteLine($"The stats:     e{Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Ergo);
            Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            Console.WriteLine("");

            Console.WriteLine($"Ergo : {Ergo.Name}");
            var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Ergo);
            Console.WriteLine($"The stats:     e{Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            Console.WriteLine("");
        }

        [TestMethod]
        public void SelectModForSlot_AK_74M()
        {
            var Weapon = (Weapon)RatStashDB.GetItem("5ac4cd105acfc40016339859");
            HashSet<string> CommonBlackListIDs = new();

            var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, 3);
            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(Weapon, filtered);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

            var Meta_Recoil = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            var Recoil = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
            var Meta_Ergo = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
            var Ergo = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Recoil : {Recoil.Name}");
            var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
            Console.WriteLine($"The stats:     e{Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
            Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            Console.WriteLine("");

            Console.WriteLine($"Ergo : {Ergo.Name}");
            var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
            Console.WriteLine($"The stats:     e{Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            Console.WriteLine("");
        }


        [TestMethod]
        public void SMFS_Wrapper_AK_74M()
        {
            var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);
            HashSet<string> CommonBlackListIDs = new();

            Weapon Weapon = (Weapon)RatStashDB.GetItem("5ac4cd105acfc40016339859");
            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(Weapon, filtered);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();


            var Meta_Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            //var Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "recoil");
            //var Meta_Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Ergonomics");
            //var Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "ergo");

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            //Console.WriteLine($"Recoil : {Recoil.Name}");
            //var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Recoil);
            //Console.WriteLine($"The stats:     e{Recoil_Result}r");
            //WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            //Console.WriteLine("");

            //Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            //var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Ergo);
            //Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            //WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            //Console.WriteLine("");

            //Console.WriteLine($"Ergo : {Ergo.Name}");
            //var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Ergo);
            //Console.WriteLine($"The stats:     e{Ergo_Result}r");
            //WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            //Console.WriteLine("");
            Console.WriteLine("Items on CBL:");
            foreach (var id in CommonBlackListIDs)
            {
                Console.WriteLine($"{RatStashDB.GetItem(id).Name}");
            }
        }

        [TestMethod]
        public void SMFS_Wrapper_ADAR()
        {
            var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);
            HashSet<string> CommonBlackListIDs = new();

            Weapon ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, filtered);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();


            var Meta_Recoil = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            //var Recoil = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "recoil");
            //var Meta_Ergo = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "Meta Ergonomics");
            //var Ergo = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "ergo");

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            //Console.WriteLine($"Recoil : {Recoil.Name}");
            //var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Recoil);
            //Console.WriteLine($"The stats:     e{Recoil_Result}r");
            //WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            //Console.WriteLine("");

            //Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            //var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Ergo);
            //Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            //WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            //Console.WriteLine("");

            //Console.WriteLine($"Ergo : {Ergo.Name}");
            //var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Ergo);
            //Console.WriteLine($"The stats:     e{Ergo_Result}r");
            //WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            //Console.WriteLine("");
        }

        [TestMethod]
        public void SelectModForSlot_ADAR_PG()
        {
            var ADAR = (Weapon) RatStashDB.GetItem("5c07c60e0db834002330051f");
            HashSet<string> CommonBlackListIDs = new();

            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, AllAvailibleWeaponMods);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

            var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
            var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
            var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Recoil : {Recoil.Name}");
            var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
            Console.WriteLine($"The stats:     e{Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
            Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            Console.WriteLine("");

            Console.WriteLine($"Ergo : {Ergo.Name}");
            var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
            Console.WriteLine($"The stats:     e{Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            Console.WriteLine("");
        }

        [TestMethod]
        public void SelectModForSlot_ADAR_Upper() //Something isn't right with the way uppers are done
        {
            var filtered =  WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);

            var ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
            HashSet<string> CommonBlackListIDs = new();

            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, filtered);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

            ShortList_WeaponMods = WG_Compilation.CompileFilteredModList(ShortList_WeaponMods, 3); // 3 is any mode

            var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
            var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
            var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Recoil : {Recoil.Name}");
            var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
            Console.WriteLine($"The stats:     e{Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
            Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            Console.WriteLine("");

            Console.WriteLine($"Ergo : {Ergo.Name}");
            var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
            Console.WriteLine($"The stats:     e{Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            Console.WriteLine("");
        }

        [TestMethod]
        public void SelectModForSlot_ADAR_BufferTube()
        {
            var ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
            HashSet<string> CommonBlackListIDs = new();

            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, AllAvailibleWeaponMods);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

            var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
            var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
            var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Recoil : {Recoil.Name}");
            var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
            Console.WriteLine($"The stats:     e{Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
            Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            Console.WriteLine("");

            Console.WriteLine($"Ergo : {Ergo.Name}");
            var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
            Console.WriteLine($"The stats:     e{Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            Console.WriteLine("");
        }

        [TestMethod]
        public void SelectModForSlot_ADAR_ChrgHndl()
        {
            var ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
            HashSet<string> CommonBlackListIDs = new();

            List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, AllAvailibleWeaponMods);
            List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

            var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
            var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
            var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
            var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

            Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
            var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
            Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Recoil : {Recoil.Name}");
            var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
            Console.WriteLine($"The stats:     e{Recoil_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
            Console.WriteLine("");

            Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
            var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
            Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
            Console.WriteLine("");

            Console.WriteLine($"Ergo : {Ergo.Name}");
            var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
            Console.WriteLine($"The stats:     e{Ergo_Result}r");
            WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
            Console.WriteLine("");
        }
    }

    
    [TestClass]
    public class MarketTests
    {
        static JObject? MarketDataJSON;
        static List<MarketEntry>? MarketData; 

        [TestInitialize]
        public void test_Init()
        {
            MarketDataJSON = WG_TarkovDevAPICalls.GetAllArmorAmmoMods();
            MarketData = WG_Market.CompileMarketDataList(MarketDataJSON);
        }
        
        [TestMethod]
        public void test_GetBestSaleOfferByItemId_Zabralo()
        {
            var result = WG_Market.GetBestSaleOfferByItemId("545cdb794bdc2d3a198b456a");
            Console.WriteLine($"Zabralo sell value is: {result}");
            Assert.IsTrue(result == 238680);
        }

        [TestMethod]
        public void test_GetItemTraderLevelByItemId_M855A1()
        {
            var result = WG_Market.GetItemTraderLevelByItemId("54527ac44bdc2d36668b4567");
            Console.WriteLine($"M855A1 trader level is: {result}");
            Assert.IsTrue(result == 4);
        }
    }


    [TestClass]
    public class ClonerUnitTests
    {
        [TestMethod]
        public void DeepCloneTest_Weapon()
        {
            Weapon testObject = new Weapon();

            testObject.Name = "Test Ligma";

            var result = testObject.DeepClone();

            Console.WriteLine(result.Name);

            result.Name = "Just Ligma";

            Console.WriteLine(result.Name);
            Console.WriteLine(testObject.Name);

            Assert.IsTrue(testObject.Name.Equals("Test Ligma"));
            Assert.IsTrue(result.Name.Equals("Just Ligma"));
        }
    }
}