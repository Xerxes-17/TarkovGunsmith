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
    public class GunsmithMk3Tests
    {
        [TestMethod]
        public void Test_GunsmithMk3()
        {
            var result = Gunsmith.GetWeaponModsRecursively("583990e32459771419544dd2");

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void Test_GunsmithMk3_TurnHashSetIdsIntoItems()
        {
            var ids = Gunsmith.GetWeaponModsRecursively("583990e32459771419544dd2");

            var result = Gunsmith.TurnHashSetIdsIntoItems(ids);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void Test_GunsmithMk3_FilterOutSights()
        {
            var ids = Gunsmith.GetWeaponModsRecursively("583990e32459771419544dd2");

            var mods = Gunsmith.TurnHashSetIdsIntoItems(ids);

            var result = Gunsmith.FilterOutSights(mods);


            Assert.IsNotNull(result);
        }
    }
}
