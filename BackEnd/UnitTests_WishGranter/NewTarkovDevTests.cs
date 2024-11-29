using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.IO;
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

        [TestMethod]
        public async Task Test_TryQueryLocalBackup_RobustGetTraderBaseInfoAsync()
        {
            string queryName = "traderBaseInfo";

            // Use a relative path assuming the application starts in the project root
            string relativePath = "TarkovDev_jsons\\" + queryName + ".json";

            // Full path for logging purposes
            string fullPath = Path.GetFullPath(relativePath);

            var result = await NewTarkovDevApi.TryQueryLocalBackup(fullPath, relativePath);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.HasValues);
        }

        [TestMethod]
        public async Task Test_TryQueryLocalBackup_returnsEmptyOnFail()
        {
            string queryName = "mustBeEmpty";

            // Use a relative path assuming the application starts in the project root
            string relativePath = "TarkovDev_jsons\\" + queryName + ".json";

            // Full path for logging purposes
            string fullPath = Path.GetFullPath(relativePath);

            var result = await NewTarkovDevApi.TryQueryLocalBackup(fullPath, relativePath);

            Assert.IsNotNull(result);
            Assert.IsFalse(result.HasValues);
        }
    }
}
