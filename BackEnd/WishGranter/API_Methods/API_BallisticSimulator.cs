using RatStash;
using System.Diagnostics;
using WishGranter.Statics;

namespace WishGranter.API_Methods
{
    public record struct BallisticSimParameters
    {
        public float penetration { get; init; }
        public float damage { get; init; }
        public int armorDamagePerc { get; init; }

        public int hitPoints { get; init; }

        public int armorClass { get; init; }
        public float bluntDamageThroughput { get; init; }
        public float durability { get; init; }
        public float maxDurability { get; init; }
        public ArmorMaterial armorMaterial { get; init; }

    };

    public record struct BallisticSimResult
    {
        public float PenetrationChance { get; init; }
        public float PenetrationDamage { get; init; }
        public float MitigatedDamage { get; init; }
        public float BluntdDamage { get; init; }
        public float AverageDamage { get; init; }

        public float PenetrationArmorDamage { get; init; }
        public float BlockArmorDamage { get; init; }
        public float AverageArmorDamage { get; init; }
        public float PostHitArmorDurability { get; init; }
    };

    public class API_BallisticSimulator
    {
        public static BallisticSimResult SingleShotSimulation(ActivitySource myActivitySource, BallisticSimParameters simParams)
        {
            using var myActivity = myActivitySource.StartActivity("Request for BallisticSim");
            myActivity?.SetTag("penetration", simParams.penetration);
            myActivity?.SetTag("damage", simParams.damage);
            myActivity?.SetTag("armorDamagePerc", simParams.armorDamagePerc);
            myActivity?.SetTag("HitPoints", simParams.hitPoints);

            myActivity?.SetTag("ArmorClass", simParams.armorClass);
            myActivity?.SetTag("BluntDamageThroughput", simParams.bluntDamageThroughput);
            myActivity?.SetTag("Durability", simParams.durability);
            myActivity?.SetTag("MaxDurability", simParams.maxDurability);
            myActivity?.SetTag("material", simParams.armorMaterial);


            return Ballistics.CalculateSingleShot(simParams);
        }
    }
}
