using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranter.Statics;

namespace WishGranterTests
{
    [TestClass]
    public class ArmorModulesTests
    {
        [TestMethod]
        public void Test_FetchTrooperThoraxInsert()
        {
            var result = ArmorModules.FetchTrooperThoraxInsert();

            Assert.IsNotNull(result);
            Console.WriteLine(result.Name);
            Console.WriteLine(result.UsedInNames[0]);
        }

        [TestMethod]
        public void Test_FetchAllFrontPlates()
        {
            var result = ArmorModules.FetchAllFrontPlates();
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Count >= 27); // patch 16.0.0 number of plates or greater, can't imagine them removing any
            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_FetchAllLegacyArmorThoraxInserts()
        {
            var result = ArmorModules.FetchAllLegacyArmorThoraxInserts();
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Count == 9); // patch 16.0.0 number of legacy inserts, can't imagine them adding any
            Console.WriteLine(result.Count);
        }

    }
}