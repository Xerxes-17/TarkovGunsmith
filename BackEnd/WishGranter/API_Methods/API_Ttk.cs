using System.Diagnostics;
using WishGranter.Statics;

namespace WishGranter.API_Methods
{
    public record struct TtkMatrixParameters
    {
        public int initialHitPoints { get; init; }
        public string targetZone { get; init; }
        public ArmorLayer[] armorLayers { get; init; }
        public float distance { get; init; }
        public int maxHits { get; init; }
    };

    public record struct TtkAmmoResult
    {
        public string ammoId { get; init; }
        public string ammoName { get; init; }
        public string ammoShortName { get; init; }
        public string caliber { get; init; }

        // Penetration and damage after range falloff has been applied.
        public float penetration { get; init; }
        public float damage { get; init; }

        public float originalPenetration { get; init; }
        public float originalDamage { get; init; }

        public int armorDamagePerc { get; init; }
        public int projectileCount { get; init; }

        // Chance the first shot penetrates every armor layer, before any durability has been worn down.
        public float firstShotPenChance { get; init; }

        public List<SimpleHitSummary> hitSummaries { get; set; }
    };

    public record struct TtkWeaponEntry
    {
        public string weaponId { get; init; }
        public string weaponName { get; init; }
        public string shortName { get; init; }
        public string caliber { get; init; }

        public int bFirerate { get; init; }
        public int singleFireRate { get; init; }
        public string[] fireModes { get; init; }
    };

    public record struct TtkMatrixResult
    {
        public TtkMatrixParameters inputs { get; set; }
        public List<TtkAmmoResult> ammo { get; set; }
        public List<TtkWeaponEntry> weapons { get; set; }
    };

    public class API_Ttk
    {
        public static TtkMatrixResult GetTtkMatrix(ActivitySource myActivitySource, TtkMatrixParameters simParams)
        {
            using var myActivity = myActivitySource.StartActivity("Request for TTK matrix");
            myActivity?.SetTag("HitPoints", simParams.initialHitPoints);
            myActivity?.SetTag("targetZone", simParams.targetZone);
            myActivity?.SetTag("distance", simParams.distance);
            myActivity?.SetTag("maxHits", simParams.maxHits);

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

            return Ballistics.GenerateTtkMatrix(simParams);
        }
    }
}
