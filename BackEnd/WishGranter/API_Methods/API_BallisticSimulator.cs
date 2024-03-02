using RatStash;
using System.Diagnostics;
using WishGranter.Statics;

namespace WishGranter.API_Methods
{

    public record struct ArmorLayer
    {
        public bool isPlate { get; set; }
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
            for(int i = 0; i < simParams.armorLayers.Length; i++)
            {
                myActivity?.SetTag($"isPlate.{i}", simParams.armorLayers[i].isPlate);
                myActivity?.SetTag($"ArmorClass.{i}", simParams.armorLayers[i].armorClass);
                myActivity?.SetTag($"BluntDamageThroughput.{i}", simParams.armorLayers[i].bluntDamageThroughput);
                myActivity?.SetTag($"Durability.{i}", simParams.armorLayers[i].durability);
                myActivity?.SetTag($"MaxDurability.{i}", simParams.armorLayers[i].maxDurability);
                myActivity?.SetTag($"material.{i}", simParams.armorLayers[i].armorMaterial);
            }
            

            return Ballistics.CalculateSingleShot(simParams);
        }
    }
}
