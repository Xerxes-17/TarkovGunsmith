using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using WishGranter.Concerns.StatsMath;
using WishGranter.Statics;

namespace WishGranterTests
{
    [TestClass]
    public class ArmorModulesTests
    {
        [TestMethod]
        public void Test_GetThoraxAramidsClass3()
        {
            var result = ArmorModules.GetThoraxAramidsClass3();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_GetThoraxAramidsClass2()
        {
            var result = ArmorModules.GetThoraxAramidsClass2();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_GetUniqueBluntValuesFromList_Class2()
        {
            var result = ArmorModules.GetDurabilityValuesFromList(ArmorModules.GetThoraxAramidsClass2());

            Console.WriteLine("Values:");
            result.ForEach(x => Console.WriteLine(x));

            Console.WriteLine($"\nMean: {result.Average()}");
            Console.WriteLine($"Median: {StatsMath.FindMedian(result)}");
        }

        [TestMethod]
        public void Test_GetUniqueBluntValuesFromList_Class3()
        {
            var result = ArmorModules.GetBluntValuesFromList(ArmorModules.GetThoraxAramidsClass3());

            Console.WriteLine("Values:");
            result.ForEach(x => Console.WriteLine(x));

            Console.WriteLine($"\nMean: {result.Average()}");
            Console.WriteLine($"Median: {StatsMath.FindMedian(result)}");
        }

        [TestMethod]
        public void Test_GetDurabilityValuesFromList_Class2()
        {
            var result = ArmorModules.GetDurabilityValuesFromList(ArmorModules.GetThoraxAramidsClass2());

            Console.WriteLine("Values:");
            result.ForEach(x => Console.WriteLine(x));

            Console.WriteLine($"\nMean: {result.Average()}");
            Console.WriteLine($"Median: {StatsMath.FindMedian(result)}");
        }

        [TestMethod]
        public void Test_GetDurabilityValuesFromList_Class3()
        {
            var result = ArmorModules.GetDurabilityValuesFromList(ArmorModules.GetThoraxAramidsClass3());

            Console.WriteLine("Values:");
            result.ForEach(x => Console.WriteLine(x));

            Console.WriteLine($"\nMean: {result.Average()}");
            Console.WriteLine($"Median: {StatsMath.FindMedian(result)}");
        }

    }
}