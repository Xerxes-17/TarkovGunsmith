using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranter.Statics;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RatStash;
using WishGranter;

namespace WishGranterTests
{
    [TestClass]
    public class AECTests
    {
        [TestMethod]
        public void Test_GenerateAECdata()
        {
            Console.WriteLine($"start time: {DateTime.Now.ToLocalTime()}");

            var result = Ballistics.GenerateAECdata();

            Console.WriteLine($"end time: {DateTime.Now.ToLocalTime()}");

            using StreamWriter writetext = new("NewAECdata.json");
            writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));

            Console.WriteLine($"result: {result.AecAmmoAndPlateList.Count}");
        }

        [TestMethod]
        public void Test_GetDamageAndPenetrationAtDistance()
        {

            Ammo ammo = (Ammo)StaticRatStash.DB.GetItem("668fe62ac62660a5d8071446");
            var result = RangeSimulation.GetDamageAndPenetrationAtDistance(15, ammo);

            Console.WriteLine("done");
        }
    }
}