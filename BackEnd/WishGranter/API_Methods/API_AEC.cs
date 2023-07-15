using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json;
using WishGranter.AmmoEffectivenessChart;
using WishGranter.Statics;
using WishGranterProto.ExtensionMethods;

namespace WishGranter.API_Methods
{
    public static class API_AEC
    {
        // todo Make the AEC a static class and move these fields there??
        static AEC AmmoEffectivenessChart = new AEC();
        static JsonSerializerOptions jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true
        };
        static string jsonAmmoEffectivenessChart = JsonSerializer.Serialize(AmmoEffectivenessChart, jsonOptions);

        public static long GetTimestampAEC()
        {
            return AmmoEffectivenessChart.GenerationTimeStamp;
        }

        public static string GetAmmoEffectivenessChart(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for Ammo Effectiveness Chart");
            return jsonAmmoEffectivenessChart;
        }

        public static void UpdateRatingsAEC(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request to update ratings for AEC");
            BallisticRating.BurnAndReplaceAllRatings();
            AmmoEffectivenessChart = new AEC();
            jsonAmmoEffectivenessChart = JsonSerializer.Serialize(AmmoEffectivenessChart, jsonOptions);
        }

        //todo Add the specific CoK for rows, add the pen and damage at the range, add range so it can be chosen
        public static List<EffectivenessDataRow> GetArmorVsArmmo(ActivitySource myActivitySource, string armorID)
        {
            using var myActivity = myActivitySource.StartActivity("Request for Armor vs Ammo Data");
            myActivity?.SetTag("armorID", armorID);

            var db = new Monolit();

            var armorItem = db.ArmorItems.First(x => x.Id == armorID);

            List<BallisticTest> filteredTests;
            using (var monolit = new Monolit())
            {
                filteredTests = monolit.BallisticTests.Include(bt => bt.Hits).Include(bt => bt.Details)
                    .Where(x =>
                        x.ArmorId == armorID &&
                        x.Details.Distance == 10
                    ).ToList();
            }

            List<EffectivenessDataRow> dataSheet = new();
            foreach (var test in filteredTests)
            {
                var ammo = Ammos.GetAmmoById(test.Details.AmmoId);

                EffectivenessDataRow effectivenssDataRow = new EffectivenessDataRow();
                effectivenssDataRow.ArmorId = test.ArmorId;
                effectivenssDataRow.ArmorName = armorItem.Name;
                effectivenssDataRow.ArmorType = armorItem.Type;
                effectivenssDataRow.ArmorClass = armorItem.ArmorClass;

                effectivenssDataRow.AmmoId = ammo.Id;
                effectivenssDataRow.AmmoName = ammo.Name;

                effectivenssDataRow.FirstShot_PenChance = test.Hits[0].PenetrationChance;
                effectivenssDataRow.FirstShot_PenDamage = test.Hits[0].PenetrationDamage;
                effectivenssDataRow.FirstShot_BluntDamage = test.Hits[0].BluntDamage;
                effectivenssDataRow.FirstShot_ArmorDamage = test.Hits[0].DurabilityDamageTotalAfterHit;

                effectivenssDataRow.ExpectedShotsToKill = test.ProbableKillShot;
                effectivenssDataRow.ExpectedKillShotConfidence = test.Hits[test.ProbableKillShot - 1].CumulativeChanceOfKill;

                dataSheet.Add(effectivenssDataRow);
            }

            return dataSheet;
        }
        //todo Add the specific CoK for rows, add the pen and damage at the range, add range so it can be chosen
        public static List<EffectivenessDataRow> GetAmmoVsArmor(ActivitySource myActivitySource, string ammoID)
        {
            using var myActivity = myActivitySource.StartActivity("Request for Ammo vs Armor Data");
            myActivity?.SetTag("ammoID", ammoID);

            var db = new Monolit();

            var ammo = Ammos.GetAmmoById(ammoID);

            List<BallisticTest> filteredTests;
            using (var monolit = new Monolit())
            {
                filteredTests = monolit.BallisticTests.Include(bt => bt.Hits).Include(bt => bt.Details)
                    .Where(x =>
                        x.Details.AmmoId == ammoID &&
                        x.Details.Distance == 10
                    ).ToList();
            }

            List<EffectivenessDataRow> dataSheet = new();
            foreach (var test in filteredTests)
            {
                var armorItem = db.ArmorItems.First(x => x.Id == test.ArmorId);

                EffectivenessDataRow effectivenssDataRow = new EffectivenessDataRow();
                effectivenssDataRow.ArmorId = test.ArmorId;
                effectivenssDataRow.ArmorName = armorItem.Name;
                effectivenssDataRow.ArmorType = armorItem.Type;
                effectivenssDataRow.ArmorClass = armorItem.ArmorClass;

                effectivenssDataRow.AmmoId = ammo.Id;
                effectivenssDataRow.AmmoName = ammo.Name;

                effectivenssDataRow.FirstShot_PenChance = test.Hits[0].PenetrationChance;
                effectivenssDataRow.FirstShot_PenDamage = test.Hits[0].PenetrationDamage;
                effectivenssDataRow.FirstShot_BluntDamage = test.Hits[0].BluntDamage;
                effectivenssDataRow.FirstShot_ArmorDamage = test.Hits[0].DurabilityDamageTotalAfterHit;

                effectivenssDataRow.ExpectedShotsToKill = test.ProbableKillShot;
                effectivenssDataRow.ExpectedKillShotConfidence = test.Hits[test.ProbableKillShot - 1].CumulativeChanceOfKill;

                dataSheet.Add(effectivenssDataRow);
            }

            return dataSheet;
        }
    }
}
