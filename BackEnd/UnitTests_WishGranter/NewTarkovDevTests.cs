using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishGranter.Concerns.API;
using WishGranter.Concerns.MarketData;
using WishGranter.Statics;

namespace WishGranterTests
{
    [TestClass]
    public class NewTarkovDevApiTests
    {
        [TestMethod]
        public async Task Test_RobustGetTraderBaseInfoAsync()
        {
            var result = await NewTarkovDevApi.RobustGetTraderBaseInfo();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_RobustGetTraderCashOffersAsync()
        {
            var result = await NewTarkovDevApi.RobustGetTraderCashOffers();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_RobustGetTraderBarterOffers()
        {
            var result = await NewTarkovDevApi.RobustGetTraderBarterOffers();

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async Task Test_RobustGetFleaMarketOffers()
        {
            var result = await NewTarkovDevApi.RobustGetFleaMarketOffers();

            Assert.IsNotNull(result);
        }
    }
}
