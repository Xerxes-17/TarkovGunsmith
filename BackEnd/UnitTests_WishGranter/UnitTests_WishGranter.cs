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

namespace TestProject1
{
    [TestClass]
    public class MarketTests
    {
        [TestMethod]
        public void test_GetAllCashOffers()
        {
            var result = WG_Market.GetAllCashOffers();
            Console.WriteLine(result.Count);
            Assert.IsTrue(result.Count == 1605);
        }

        [TestMethod]
        public void test_FilterTraderCashOffersByPlayerLevel()
        {
            var result = WG_Market.FilterTraderCashOffersByPlayerLevel(15);
            Console.WriteLine(result.Count);
            Assert.IsTrue(result.Count == 707);
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
        public void MysteriousCloner_Generic_Test_WeaponMod()
        {
            WeaponMod test_weaponMod = new WeaponMod();
            test_weaponMod.Name = "Test Ligma";

            var result = WG_Compilation.MysteriousCloner_Generic<WeaponMod>(test_weaponMod);
            Console.WriteLine(result.Name);

            result.Name = "Just Ligma";

            Console.WriteLine(result.Name);
            Console.WriteLine(test_weaponMod.Name);
        }

        [TestMethod]
        public void MysteriousCloner_Generic_Test_WeaponMod_In_List()
        {
            List<WeaponMod> theList = new();
            WeaponMod test_weaponMod = new WeaponMod();
            test_weaponMod.Name = "Test Ligma";
            theList.Add(test_weaponMod);


            var result = WG_Compilation.MysteriousCloner_Generic<WeaponMod>(theList[0]);
            Console.WriteLine(result.Name);

            result.Name = "Just Ligma";

            Console.WriteLine(result.Name);
            Console.WriteLine(theList[0].Name);
        }

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

        [TestMethod]
        public void _WriteArmorList()
        {
            WG_Output.WriteArmorList(RatStashDB);
        }

        [TestMethod]
        public void _WriteAmmoList()
        {
            WG_Output.WriteAmmoList(RatStashDB);
        }


        [TestMethod]
        public void _ViewAllArmor()
        {
            foreach (var armor in All_Armor)
            {
                Console.WriteLine(armor.Name);
                Console.WriteLine(armor.Id + "\n");
            }
        }

        [TestMethod]
        public void _ViewAllRigs()
        {
            foreach (var rig in All_Rigs)
            {
                Console.WriteLine(rig.Name);
                Console.WriteLine(rig.Id+"\n");
            }
        }

        [TestMethod]
        public void _ViewAllAmmo()
        {
            foreach (var ammo in All_Ammo)
            {
                Console.WriteLine(ammo.Name);
                Console.WriteLine(ammo.Id + "\n");
            }
        }

        [TestMethod]
        public void PenetrationChance_Custom()
        {
            var result = WG_Calculation.PenetrationChance(5, 41, 87D);
            Console.WriteLine(result);
        }
    }
}