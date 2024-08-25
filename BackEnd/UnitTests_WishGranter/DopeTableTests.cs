using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishGranter.Statics;

namespace WishGranterTests
{
    [TestClass]
    public class DopeTableTests
    {
        [TestMethod]
        public void Test_constructDopeOptions()
        {
            var result = DopeTable.constructDopeOptions();

            Assert.IsNotNull(result);
        }
    }
}
