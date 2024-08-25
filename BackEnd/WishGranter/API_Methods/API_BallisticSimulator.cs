using Private_Ballistic_Engine;
using RatStash;
using System.Diagnostics;
using WishGranter.Statics;
using static WishGranter.Statics.BallisticComputah;

namespace WishGranter.API_Methods
{

    public record struct ArmorLayer
    {
        public bool isPlate { get; set; }
        public int armorClass { get; init; }
        public float bluntDamageThroughput { get; init; }
        public float durability { get; set; }
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
    
    public record struct ArmorLayersV2
    {
        //? Won't need this one I think
        public List<bool> isPlate { get; set; }
        public List<int> armorClass { get; init; }
        public List<float> bluntDamageThroughput { get; init; }
        public List<float> durability { get; init; }
        public List<float> maxDurability { get; init; }
        public List<ArmorMaterial> armorMaterial { get; init; }
    };
    public record struct BallisticSimParametersV2
    {
        public float penetration { get; init; }
        public float damage { get; init; }
        public int armorDamagePerc { get; init; }
        public int initialHitPoints { get; init; }
        public string targetZone { get; init; }
        public ArmorLayer[] armorLayers { get; init; }

    };

    public record struct LayerSummaryResult
    {
        public bool isPlate { get; init; }
        public float prPen { get; init; }
        public float bluntThroughput { get; init; }
        public float damageBlock { get; init; }
        public float damagePen { get; init; }
        public float damageMitigated { get; init; }
        public float averageRemainingDP { get; init; }
    }

    public record struct LayerHitResultDetails
    {
        public float prBlock { get; init; }
        public float damageBlock { get; init; }
        public float damageMitigated { get; init; }
        public float averageRemainingDurability { get; init; }
    }


    public record struct PrDamagePair
    {
        public float probability { get; init; }
        public int damageFixed { get; init; }
    }

    public record struct BallisticSimHitSummary
    {
        public int hitNum { get; init; }
        public float specificChanceOfKill { get; init; }
        public float cumulativeChanceOfKill { get; init; }
        public float averageRemainingHP { get; init; }
        public float prPenetration { get; init; }
        public float damagePenetration { get; init; }
        public List<LayerHitResultDetails> layerHitResultDetails { get; init; }

    }
    public record struct BallisticSimResultV2
    {
        public BallisticSimParametersV2 Inputs { get; set; }

        public List<BallisticSimHitSummary> hitSummaries { get; set; }

    };

    public class API_BallisticSimulator
    {
        public static List<SimulationToCalibrationDistancePair> BallisticCalculation(ActivitySource myActivitySource, BallisticComputahInput input)
        {
            using var myActivity = myActivitySource.StartActivity("Request for BallisticCalculation");
            myActivity?.SetTag("ammoId", input.defaultAmmoInput.AmmoId);
            myActivity?.SetTag("penetration", input.defaultAmmoInput.Penetration);
            myActivity?.SetTag("damage", input.defaultAmmoInput.Damage);
            return CreateDropTable(input);
        }

        public static List<BallisticSimResult> SingleShotSimulation(ActivitySource myActivitySource, BallisticSimParameters simParams)
        {
            using var myActivity = myActivitySource.StartActivity("Request for BallisticSim-SingleShot");
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

        public static BallisticSimResultV2 MultiShotSimulation(ActivitySource myActivitySource, BallisticSimParametersV2 simParams)
        {
            using var myActivity = myActivitySource.StartActivity("Request for BallisticSim-MultiShot");
            myActivity?.SetTag("penetration", simParams.penetration);
            myActivity?.SetTag("damage", simParams.damage);
            myActivity?.SetTag("armorDamagePerc", simParams.armorDamagePerc);
            myActivity?.SetTag("HitPoints", simParams.initialHitPoints);

            myActivity?.SetTag("ArmorLayers", simParams.armorLayers.Length);
            for (int i = 0; i < simParams.armorLayers.Length; i++)
            {
                myActivity?.SetTag($"isPlate.{i}", simParams.armorLayers[i].isPlate);
                myActivity?.SetTag($"ArmorClass.{i}", simParams.armorLayers[i].armorClass);
                myActivity?.SetTag($"BluntDamageThroughput.{i}", simParams.armorLayers[i].bluntDamageThroughput);
                myActivity?.SetTag($"Durability.{i}", simParams.armorLayers[i].durability);
                myActivity?.SetTag($"MaxDurability.{i}", simParams.armorLayers[i].maxDurability);
                myActivity?.SetTag($"material.{i}", simParams.armorLayers[i].armorMaterial);
            }


            return Ballistics.CalculateMultiShotSeries(simParams);
        }
    }
}
