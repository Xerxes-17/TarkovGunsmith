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

namespace WishGranterTests
{
    [TestClass]
    public class SingletonTests
    {
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
            var result = StaticArmors.Cleaned.Count;
            Console.WriteLine($"Armors.Cleaned.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticAmmos_CleanedCount()
        {
            var result = StaticAmmos.Cleaned.Count;
            Console.WriteLine($"Ammos.Cleaned.Count: {result}");
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
        public void testInit()
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