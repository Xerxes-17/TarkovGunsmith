using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Threading.Tasks;
using WishGranter.Concerns.MarketData;

namespace WishGranterTests
{
    [TestClass]
    public class NewMarketTests
    {
        [TestMethod]
        public async Task Test_GetTraders()
        {
            var result = await NewMarket.GetTraders();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_GetFleaMarketOffers()
        {
            var result = await NewMarket.GetFleaMarketOffers();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_GetCashOffers()
        {
            var result = await NewMarket.GetCashOffers();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_GetBarterOffers()
        {
            var result = await NewMarket.GetBarterOffers();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_GetBuyBackOffers()
        {
            var result = await NewMarket.GetBuyBackOffers();
            Console.WriteLine($"BuyBackOffers.Count: {result.Count}");

            Assert.IsNotNull(result);
        }
    }
}
