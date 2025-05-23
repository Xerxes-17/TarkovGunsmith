using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranter.Statics;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

            Console.WriteLine($"result: {result.Count}");
        }
    }
}