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

namespace WishGranterTests
{
    [TestClass]
    public class FittingTests
    {
        static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
        static List<WeaponMod> AllAvailibleWeaponMods = RatStashDB.GetItems(x => x is WeaponMod).Cast<WeaponMod>().ToList();

        static int filterMode = 1;

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
        [TestMethod]
        public void test_GetAllCashOffers()
        {
            var result = WG_Market.GetAllCashOffers();
            Console.WriteLine(result.Count);
            Assert.IsTrue(result.Count > 1597);
        }

        [TestMethod]
        public void test_FilterTraderCashOffersByPlayerLevel()
        {
            var result = WG_Market.FilterTraderCashOffersByPlayerLevel(15);
            Console.WriteLine(result.Count);
            Assert.IsTrue(result.Count > 705);
        }

        [TestMethod]
        public void test_GetTraderCashOffersByItemId()
        {
            var result = WG_Market.GetTraderCashOffersByItemId("5447a9cd4bdc2dbd208b4567"); //M4A1
            foreach (var c in result)
            {
                Console.WriteLine(c.TraderName + " " + c.PriceInRUB);
            }

            Assert.IsTrue(result.Count == 2);
        }

        [TestMethod]
        public void test_GetCheapestCashOfferForItemWithPlayerLevel()
        {
            var result = WG_Market.GetCheapestCashOfferForItemWithPlayerLevel("5447a9cd4bdc2dbd208b4567", 30); //M4A1
            Console.WriteLine(result);
            Assert.IsTrue(result == 67809);
        }

        [TestMethod]
        public void test_GetCheapestCashOfferForItem()
        {
            var result = WG_Market.GetCheapestCashOfferForItem("5447a9cd4bdc2dbd208b4567"); //M4A1
            Console.WriteLine(result);
            Assert.IsTrue(result == 67809);
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

            var result = testObject.DeepClone<Weapon>();

            Console.WriteLine(result.Name);

            result.Name = "Just Ligma";

            Console.WriteLine(result.Name);
            Console.WriteLine(testObject.Name);
        }
    }

    [TestClass]
    public class UnitTests_WishGranter
    {
        static Database RatStashDB = Database.FromFile("ratstash_jsons\\items.json", false, "ratstash_jsons\\en.json");
        static JObject ImageLinksJSON = JObject.Parse(File.ReadAllText("TarkovDev_jsons\\ImageLinks.json"));

        IEnumerable<Item> All_Ammo = RatStashDB.GetItems(m => m is Ammo);
        IEnumerable<Item> All_Armor = RatStashDB.GetItems(m => m is Armor);
        IEnumerable<Item> All_Rigs = RatStashDB.GetItems(m => m is ChestRig);

        //[TestMethod]
        //public void _WriteArmorList()
        //{
        //    WG_Output.WriteArmorList(RatStashDB);
        //}

        //[TestMethod]
        //public void _WriteAmmoList()
        //{
        //    WG_Output.WriteAmmoList(RatStashDB);
        //}


        //[TestMethod]
        //public void _ViewAllArmor()
        //{
        //    foreach (var armor in All_Armor)
        //    {
        //        Console.WriteLine(armor.Name);
        //        Console.WriteLine(armor.Id + "\n");
        //    }
        //}

        //[TestMethod]
        //public void _ViewAllRigs()
        //{
        //    foreach (var rig in All_Rigs)
        //    {
        //        Console.WriteLine(rig.Name);
        //        Console.WriteLine(rig.Id+"\n");
        //    }
        //}

        //[TestMethod]
        //public void _ViewAllAmmo()
        //{
        //    foreach (var ammo in All_Ammo)
        //    {
        //        Console.WriteLine(ammo.Name);
        //        Console.WriteLine(ammo.Id + "\n");
        //    }
        //}

        [TestMethod]
        public void PenetrationChance_Custom()
        {
            var result = WG_Calculation.PenetrationChance(5, 41, 87D);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Output_Runner()
        {
            WG_Output.WriteArmorList(RatStashDB);
            WG_Output.WriteAmmoList(RatStashDB);
        }
    }
}