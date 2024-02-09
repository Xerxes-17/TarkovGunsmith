using RatStash;
using System.Diagnostics;
using WishGranter.Statics;

namespace WishGranter.API_Methods
{

    public record struct ArmorLayer
    {
        public int armorClass { get; init; }
        public float bluntDamageThroughput { get; init; }
        public float durability { get; init; }
        public float maxDurability { get; init; }
        public ArmorMaterial armorMaterial { get; init; }
    };

    public record struct BallisticSimParameters
    {
        public float penetration { get; init; }
        public float damage { get; init; }
        public int armorDamagePerc { get; init; }

        public int hitPoints { get; init; }

        public ArmorLayer[] armorLayers { get; init; }

    };

    public record struct BallisticSimResult
    {
        public float PenetrationChance { get; init; }
        public float PenetrationDamage { get; init; }
        public float MitigatedDamage { get; init; }
        public float BluntDamage { get; init; }
        public float AverageDamage { get; init; }

        public float PenetrationArmorDamage { get; init; }
        public float BlockArmorDamage { get; init; }
        public float AverageArmorDamage { get; init; }
        public float PostHitArmorDurability { get; init; }

        public float ReductionFactor { get; init; }
        public float PostArmorPenetration { get; init; }

    };

    public class API_BallisticSimulator
    {
        public static List<BallisticSimResult> SingleShotSimulation(ActivitySource myActivitySource, BallisticSimParameters simParams)
        {
            using var myActivity = myActivitySource.StartActivity("Request for BallisticSim");
            myActivity?.SetTag("penetration", simParams.penetration);
            myActivity?.SetTag("damage", simParams.damage);
            myActivity?.SetTag("armorDamagePerc", simParams.armorDamagePerc);
            myActivity?.SetTag("HitPoints", simParams.hitPoints);

            myActivity?.SetTag("ArmorLayers", simParams.armorLayers.Length);
            myActivity?.SetTag("ArmorClass", simParams.armorLayers[0].armorClass);
            myActivity?.SetTag("BluntDamageThroughput", simParams.armorLayers[0].bluntDamageThroughput);
            myActivity?.SetTag("Durability", simParams.armorLayers[0].durability);
            myActivity?.SetTag("MaxDurability", simParams.armorLayers[0].maxDurability);
            myActivity?.SetTag("material", simParams.armorLayers[0].armorMaterial);

            return Ballistics.CalculateSingleShot(simParams);
        }
    }
}
