using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranter;
using WishGranter.Statics;


namespace WishGranterTests
{
    [TestClass]
    public class AmmosTests
    {
        [TestMethod]
        public void Test_CleanedIsNotNull()
        {
            var result = Ammos.Cleaned;

            Assert.IsNotNull(result);
            Console.WriteLine(result.Count);
        }
    }
}