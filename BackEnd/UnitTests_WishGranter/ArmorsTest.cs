using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranter;

namespace WishGranterTests
{
    [TestClass]
    public class ArmorsTest
    {
        [TestMethod]
        public void Test_ConvertHelmetsToArmorTableRows()
        {
            var result = Armors.ConvertHelmetsToArmorTableRows();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_GetAssembledHelmets()
        {
            var result = Armors.GetAssembledHelmets();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_GetAssembledArmorsAndRigs()
        {
            var result = Armors.GetAssembledArmorsAndRigs();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_ConvertAssembledArmorsAndRigsToTableRows()
        {
            var result = Armors.ConvertAssembledArmorsAndRigsToTableRows();

            Console.WriteLine(result.Count);
        }
    }
}