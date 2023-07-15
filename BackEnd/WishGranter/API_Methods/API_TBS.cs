using RatStash;
using System.Diagnostics;
using WishGranter.Statics;

namespace WishGranter.API_Methods
{
    public class NewArmorTestResult
    {
        public string? TestName { get; set; }
        public BallisticTest? BallisticTest { get; set; }
    }

    public class API_TBS
    {
        //todo Add the BD-ratings in so that a given test can be compared against the AC average.
        public static NewArmorTestResult CalculateArmorVsBulletSeries(ActivitySource myActivitySource, string armorID, string bulletID, float startingDuraPerc, float distance = 10)
        {

            var armorItem = ArmorItemStats.GetArmorItemStatsByID(armorID);
            var ballisticDetails = BallisticDetails.GetBallisticDetailsByIdDistance(bulletID,distance);
            var Bullet = Ammos.GetAmmoById(bulletID);

            using var myActivity = myActivitySource.StartActivity("Request for TBS_Presets");
            myActivity?.SetTag("armorID", armorID);
            myActivity?.SetTag("bulletID", bulletID);
            myActivity?.SetTag("startingDuraPerc", startingDuraPerc);
            myActivity?.SetTag("bulletName", Bullet.ShortName);
            myActivity?.SetTag("armorName", armorItem.Name);
            myActivity?.SetTag("distance", distance);

            var result = Ballistics.SimulateHitSeries_Presets(armorItem, startingDuraPerc, ballisticDetails);

            var responseContent = new NewArmorTestResult();
            responseContent.TestName = $"{Armors.Cleaned.First(x=>x.Id == armorID).ShortName} @{startingDuraPerc.ToString("0")}% vs {Bullet.Name} @{distance.ToString("0")}m";
            responseContent.BallisticTest = result;

            return responseContent;
        }

        public static CustomSimulationResult CalculateArmorVsBulletSeries_Custom(
            ActivitySource myActivitySource,
            int ac, 
            float maxDurability, 
            float startingDurabilityPerc,
            float bluntThroughput,
            string material, 
            float penetration, 
            int armorDamagePerc, 
            float damage,
            string targetZone
            )
        {

            using var myActivity = myActivitySource.StartActivity("Request for TBS_Custom");
            myActivity?.SetTag("ac", ac);
            myActivity?.SetTag("maxDurability", maxDurability);
            myActivity?.SetTag("startingDurabilityPerc", startingDurabilityPerc);
            myActivity?.SetTag("material", material);
            myActivity?.SetTag("penetration", penetration);
            myActivity?.SetTag("armorDamagePerc", armorDamagePerc);
            myActivity?.SetTag("damage", damage);
            myActivity?.SetTag("targetZone", targetZone);


            SimulationParameters parameters = new SimulationParameters
            {
                ArmorClass = ac,
                MaxDurability = maxDurability,
                StartingDurabilityPerc = startingDurabilityPerc,
                BluntThroughput = bluntThroughput,
                ArmorMaterial = (ArmorMaterial)Enum.Parse(typeof(ArmorMaterial), material),
                TargetZone = (TargetZone)Enum.Parse(typeof(TargetZone),targetZone),
                Penetration = penetration,
                Damage = damage,
                ArmorDamagePerc = armorDamagePerc
            };


            return Ballistics.SimulateHitSeries_Custom(parameters);
        }
    }
}
