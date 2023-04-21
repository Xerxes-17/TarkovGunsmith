using RatStash;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Force.DeepCloner;

namespace WishGranter.Statics
{
    public enum TargetZone
    {
        Thorax,
        Head
    }
    // This is used purely for passing in the details of a calculation to the engine.
    public record struct SimulationParameters
    {
        public int ArmorClass { get; init; }
        public float MaxDurability { get; init; }
        public float StartingDurabilityPerc { get; init; }
        public float BluntThroughput { get; init; }
        public ArmorMaterial ArmorMaterial { get; init; }
        public TargetZone TargetZone { get; init; }

        public float Penetration { get; init; }
        public float Damage { get; init; }
        public int ArmorDamagePerc { get; init; }
    };

    // This is used purely for passing in the details of a calculation to the engine.
    public record struct CustomSimulationResult
    {
        public SimulationParameters SimulationParameters { get; init; }
        public List<BallisticHit> Hits { get; init; }
        public int ProbableKillShot { get; set; }
    };

    public class Ballistics
    {
        // A Special thanks to goon "Night Shade" for providing this function, you will need:
        // Dictionary<int, float> initialHpProbabilities = new() { [850] = 1 }; for a thorax calculation
        // to use this.
        public static Dictionary<int, float> NightShade_CalculateNextHpProbabilities(Dictionary<int, float> currentHpProbabilities, double blockDamage, double penDamage, float penChance)
        {
            const int FACTOR = 100; // double to fixed multiplication factor

            int blockDamageFixed = (int)(blockDamage * FACTOR);
            int penDamageFixed = (int)(penDamage * FACTOR);

            var nextProbabilities = new Dictionary<int, float>();

            var blockChance = 1 - penChance;

            foreach (var item in currentHpProbabilities)
            {
                var hp = item.Key;
                var probability = item.Value;

                var nextBlockHp = Math.Max(hp - blockDamageFixed, 0);
                nextProbabilities[nextBlockHp] = nextProbabilities.GetValueOrDefault(nextBlockHp, 0) + (probability * blockChance);

                if (penChance != 0)
                {
                    var nextPenHp = Math.Max(hp - penDamageFixed, 0);
                    nextProbabilities[nextPenHp] = nextProbabilities.GetValueOrDefault(nextPenHp, 0) + (probability * penChance);
                }
            }

            return nextProbabilities;
        }


        // This will be ~the one~ method for working out what happens when you hit a target, so I don't have to maintain two different functions between custom and preset
        // Assumptions:
        // 1 - Damage and Penetration will be provided as appropriate for a given distance, so no ballstic adjustment is needed here
        // 2 - We only need to be saving calcs done with preset items, custom calcs are just done live and not stored
        //? Might be an idea to add a "Hit Zero" in each series which is the details at the start of the simulation?
        private static List<BallisticHit> SimulateHitSeries_Engine(SimulationParameters parameters)
        {
            List<BallisticHit> hits = new ();

            float currentDurabilityDamageTotal = 0;
            float startingDurability = parameters.MaxDurability * parameters.StartingDurabilityPerc / 100;

            // probability setup
            Dictionary<int, float> currentHpProbabilities = new() { [8500] = 1 };
            Dictionary<int, float> previousHpProbabilities = new() { [8500] = 1 };

            double HitPoints = 85;
            if (parameters.TargetZone == TargetZone.Head)
            {
                HitPoints = 35;
                currentHpProbabilities = new() { [3500] = 1 };
            }

            int hitNumber = 1;

            while (currentDurabilityDamageTotal < startingDurability || HitPoints > 0)
            {
                // Get the current durability and pen chance
                float currentDurability = startingDurability - currentDurabilityDamageTotal;
                float penetrationChance = PenetrationChance(parameters.ArmorClass, parameters.Penetration, currentDurability);

                // Calc Potential damages:
                float shotBlunt = (float) BluntDamage(currentDurability, parameters.ArmorClass, parameters.BluntThroughput, parameters.Damage, parameters.Penetration);
                float shotPenetrating = (float) PenetrationDamage(currentDurability, parameters.ArmorClass, parameters.Damage, parameters.Penetration);

                // Calc Average Damage and apply it to HP pool
                var AverageDamage = (shotBlunt * (1 - penetrationChance)) + (shotPenetrating * penetrationChance);
               
                if (parameters.Damage <= 0)
                {
                     //! Exception for when the armor is at zero durability
                    HitPoints = HitPoints - parameters.Damage;
                }
                else
                {
                    HitPoints = HitPoints - AverageDamage;
                }

                // Calc the probabilities
                currentHpProbabilities = NightShade_CalculateNextHpProbabilities(currentHpProbabilities, shotBlunt, shotPenetrating, penetrationChance);

                // Package details into new BallisticHit object
                BallisticHit thisHit = new BallisticHit
                {
                    TestId = null,
                    HitNum = hitNumber,
                    DurabilityBeforeHit = currentDurability,
                    DurabilityDamageTotalAfterHit = currentDurabilityDamageTotal,
                    PenetrationChance = penetrationChance,
                    BluntDamage = shotBlunt,
                    PenetrationDamage = shotPenetrating,
                    AverageRemainingHitPoints = HitPoints,
                    CumulativeChanceOfKill = 0,
                    SpecificChanceOfKill = 0
                };

                //! Catch for when a shot is made against zero'd armor
                if (currentDurability <= 0)
                {
                    thisHit.PenetrationChance = 1;
                    thisHit.DurabilityBeforeHit = 0;
                    thisHit.PenetrationDamage = parameters.Damage;
                    thisHit.DurabilityDamageTotalAfterHit = startingDurability;
                }

                // Update the hit to have the correct chances
                if (currentHpProbabilities.ContainsKey(0))
                {
                    thisHit.CumulativeChanceOfKill = currentHpProbabilities[0] * 100;
                    if (previousHpProbabilities.ContainsKey(0))
                    {
                        thisHit.SpecificChanceOfKill = (currentHpProbabilities[0] - previousHpProbabilities[0]) * 100;
                    }
                    else
                    {
                        thisHit.SpecificChanceOfKill = currentHpProbabilities[0] * 100;
                    }
                }

                hits.Add(thisHit);

                // Update the previousHpProbabilities so that the next loop can use it and increase the hit counter.
                previousHpProbabilities = currentHpProbabilities.DeepClone();
                hitNumber++;
            }

            return hits;
        }

        public static BallisticTest SimulateHitSeries_Presets(ArmorItemStats armorItemStats, float startingDurabilityPerc, BallisticDetails ballisticDetails)
        {
            SimulationParameters parameters = new SimulationParameters
            {
                ArmorClass = armorItemStats.ArmorClass,
                MaxDurability = armorItemStats.MaxDurability,
                StartingDurabilityPerc = startingDurabilityPerc,
                BluntThroughput = armorItemStats.BluntThroughput,
                ArmorMaterial = armorItemStats.ArmorMaterial,
                TargetZone = armorItemStats.TargetZone,
                Penetration = ballisticDetails.Penetration,
                Damage = ballisticDetails.Damage,
                ArmorDamagePerc = ballisticDetails.Ammo.ArmorDamage
            };

            List<BallisticHit> theHits = SimulateHitSeries_Engine(parameters);

            // Let's get the shot that should kill
            var index = theHits.FindIndex(x => x.CumulativeChanceOfKill > 50);
            if (index == -1)
            {
                index = theHits.Count;
            }
            else
            {
                index = index + 1;
            }

            BallisticTest thisTest = new BallisticTest
            {
                Id = null,
                ArmorId = armorItemStats.Id,
                DetailsId = (int)ballisticDetails.Id,
                Details = ballisticDetails,
                StartingDurabilityPerc = startingDurabilityPerc,
                ProbableKillShot = index,
                Hits = theHits
            };

            return thisTest;
        }

        public static CustomSimulationResult SimulateHitSeries_Custom(SimulationParameters parameters)
        {
            List<BallisticHit> theHits = SimulateHitSeries_Engine(parameters);
            // Let's get the shot that should kill
            var index = theHits.FindIndex(x => x.CumulativeChanceOfKill > 50);
            if (index == -1)
            {
                index = theHits.Count;
            }
            else
            {
                index = index + 1;
            }

            return new CustomSimulationResult { SimulationParameters = parameters, Hits = theHits, ProbableKillShot = index };
        }

        // Helper for calculating FactorA which is used in a bunch of ballistic calculations
        private static double CalculateFactor_A(double armorDurability, int armorClass)
        {
            return (121 - 5000 / (45 + (armorDurability * 2))) * armorClass * 0.1;
        }

        // This function provides the effective durability of an armor item for a given max durability and armor material.
        public static int GetEffectiveDurability(int maxDurability, ArmorMaterial armorMaterial)
        {
            double armor_destructability = GetDestructabilityFromMaterial(armorMaterial);

            return (int)(maxDurability / armor_destructability);
        }

        public static double GetDestructabilityFromMaterial(ArmorMaterial armor_material)
        {
            double armor_destructability = -1;

            if (armor_material == ArmorMaterial.Aramid)
                armor_destructability = .25;
            else if (armor_material == ArmorMaterial.UHMWPE)
                armor_destructability = .45;
            else if (armor_material == ArmorMaterial.Combined)
                armor_destructability = .5;
            else if (armor_material == ArmorMaterial.Titan)
                armor_destructability = .55;
            else if (armor_material == ArmorMaterial.Aluminium)
                armor_destructability = .6;
            else if (armor_material == ArmorMaterial.ArmoredSteel)
                armor_destructability = .7;
            else if (armor_material == ArmorMaterial.Ceramic)
                armor_destructability = .8;
            else if (armor_material == ArmorMaterial.Glass)
                armor_destructability = .8;

            return armor_destructability;
        }
        public static float PenetrationChance(int armorClass, float bulletPen, float armorDurability)
        {
            /**  
             * The goal of this is to work out the value with a given set of inputs.
             * Equations taken and modified from https://www.desmos.com/calculator/m8cmsfokkl.
             */
            double factor_a = CalculateFactor_A(armorDurability, armorClass);

            double result = 0;

            if (factor_a <= bulletPen)
            {
                result = (100 + (bulletPen / (.9 * factor_a - bulletPen))) / 100;
            }
            else if (factor_a - 15 < bulletPen && bulletPen < factor_a)
            {
                result = .4 * Math.Pow(factor_a - bulletPen - 15, 2) / 100;
            }

            return result;
        }

        //! This function was gleaned from reverse regression analysis of a big data set of test results from in-game.
        public static double DamageToArmorBlock(int armor_class, ArmorMaterial armor_material, double bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
        {
            double armor_destructability = GetDestructabilityFromMaterial(armor_material);
            double armorDamagePercentage_dbl = bullet_armorDamagePercentage / 100d;

            double A_Factor = CalculateFactor_A(armorDurability, armor_class);

            //! 1.1 max is shown in test result of 5.45 BT vs Usec Trooper. .6 min is shown in rest results of 5.45 T vs a Korund and a Slick plate.
            double result = bullet_penetration * armorDamagePercentage_dbl * armor_destructability * Math.Clamp(bullet_penetration / A_Factor, .6d, 1.1d);

            //! CZTL's minimum dura damage as per buckshot vs a slick plate
            result = Math.Max(result, 1);

            return result;
        }
        //! This function was gleaned from reverse regression analysis of a big data set of test results from in-game.
        public static double DamageToArmorPenetration(int armor_class, ArmorMaterial armor_material, double bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
        {
            double armor_destructability = GetDestructabilityFromMaterial(armor_material);
            double armorDamagePercentage_dbl = bullet_armorDamagePercentage / 100d;

            double A_Factor = CalculateFactor_A(armorDurability, armor_class);

            //! .9 max is shown in test result of ignolnik vs PACA, Zhuk-3, etc. .5 min is shown in rest results of 5.45 T vs pretty much everything lmao.
            double result = bullet_penetration * armorDamagePercentage_dbl * armor_destructability * Math.Clamp(bullet_penetration / A_Factor, .5d, .9d);

            //! CZTL's minimum dura damage as per buckshot vs a slick plate
            result = Math.Max(result, 1);

            return result;
        }
        public static double GetExpectedArmorDamage(int armor_class, ArmorMaterial armor_material, double bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
        {
            var blocked = DamageToArmorBlock(armor_class, armor_material, bullet_penetration, bullet_armorDamagePercentage, armorDurability);
            var penned = DamageToArmorPenetration(armor_class, armor_material, bullet_penetration, bullet_armorDamagePercentage, armorDurability);
            double probabilityOfPenetration = PenetrationChance(armor_class, bullet_penetration, armorDurability);

            return (probabilityOfPenetration * penned) + ((1 - probabilityOfPenetration) * blocked);
        }
        // This Function provides the blunt damage that a character will receive after a bullet is stopped by armor.
        public static double BluntDamage(double armorDurability, int armorClass, double bluntThroughput, double bulletDamage, double bulletPenetration)
        {
            double median(double a, double b, double c)
            {
                double[] arr = new double[] { a, b, c };
                Array.Sort(arr);
                return arr[1];
            }

            var factor_a = CalculateFactor_A(armorDurability, armorClass);

            double medianResult = median(0.2, 1 - (0.03 * (factor_a - bulletPenetration)), 1);

            double finalResult = medianResult * bluntThroughput * bulletDamage;

            return finalResult;
        }
        // This function provides the damage that a character will receive after a bullet penetrates armor, accounting for the damage mitigation, if any.
        public static double PenetrationDamage(double armorDurability, int armorClass, double bulletDamage, double bulletPenetration)
        {
            double median(double a, double b, double c)
            {
                double[] arr = new double[] { a, b, c };
                Array.Sort(arr);
                return arr[1];
            }

            var factor_a = CalculateFactor_A(armorDurability, armorClass);

            double medianResult = median(0.6, bulletPenetration / (factor_a + 12), 1);
            double finalResult = medianResult * bulletDamage;

            return finalResult;
        }
    }
}
