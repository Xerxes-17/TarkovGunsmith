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
    public class NewMarketTests
    {
        [TestMethod]
        public async Task Test_GetTraders()
        {
            var result = await NewMarket.GetTraders();

            Assert.IsNotNull(result);
        }
    }
}
