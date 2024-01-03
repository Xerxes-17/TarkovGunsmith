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
    public record class MultiLayerBallisticHit
    {
        public int? TestId { get; set; }
        public int HitNum { get; set; }

        // Plate
        public double PenetrationChance_Plate { get; set; }
        public double DurabilityBeforeHit_Plate { get; set; }
        public double DurabilityDamageTotalAfterHit_Plate { get; set; }

        // Soft
        public double PenetrationPower_PostPlate { get; set; }
        public double Damage_PostPlate { get; set; }
        public double PenetrationChance_Soft { get; set; }
        public double DurabilityBeforeHit_Soft { get; set; }
        public double DurabilityDamageTotalAfterHit_Soft { get; set; }

        // Damage
        public double BluntDamage { get; set; }
        public double PenetrationDamage { get; set; }

        // Hitpoints and COK
        public double AverageRemainingHitPoints { get; set; }
        public float CumulativeChanceOfKill { get; set; }
        public float SpecificChanceOfKill { get; set; }

        //todo add the SQL entity stuff
    }

    public record struct MultiLayerSimulationParameters
    {
        public TargetZone TargetZone { get; init; }

        public int PlateArmorClass { get; init; }
        public float PlateMaxDurability { get; init; }
        public float PlateStartingDurabilityPerc { get; init; }
        public float PlateBluntThroughput { get; init; }
        public ArmorMaterial PlateArmorMaterial { get; init; }

        public int SoftArmorClass { get; init; }
        public float SoftMaxDurability { get; init; }
        public float SoftStartingDurabilityPerc { get; init; }
        public float SoftBluntThroughput { get; init; }
        public ArmorMaterial SoftArmorMaterial { get; init; }

        public float Penetration { get; init; }
        public float Damage { get; init; }
        public int ArmorDamagePerc { get; init; }
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

    // POCO for encapsulating a custom Simulation Result.
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

        public static Dictionary<int, float> NightShade_CalculateNextHpProbabilities_MultiLayer(Dictionary<int, float> currentHpProbabilities, double softBlockDamage, double softPenDamage, float softPenChance, float platePenChance)
        {
            const int FACTOR = 100; // double to fixed multiplication factor

            int blockDamageFixed = (int)(softBlockDamage * FACTOR);
            int penDamageFixed = (int)(softPenDamage * FACTOR);

            var nextProbabilities = new Dictionary<int, float>();

            var softBlockChance = 1 - softPenChance;

            foreach (var item in currentHpProbabilities)
            {
                var hp = item.Key;
                var probability = item.Value;

                // If the plate no-sells the hit entirely
                if (platePenChance != 1)
                {
                    nextProbabilities[item.Key] = nextProbabilities.GetValueOrDefault(item.Key, 0) + item.Value * (1 - platePenChance);
                }

                // If the plate gets penned, but the soft blocks
                if (platePenChance != 0)
                {
                    var nextBlockHp = Math.Max(hp - blockDamageFixed, 0);
                    nextProbabilities[nextBlockHp] = nextProbabilities.GetValueOrDefault(nextBlockHp, 0) + (probability * softBlockChance * platePenChance);
                }

                // If the plate and soft both get penned
                if (platePenChance != 0 && softPenChance != 0)
                {
                    var nextPenHp = Math.Max(hp - penDamageFixed, 0);
                    nextProbabilities[nextPenHp] = nextProbabilities.GetValueOrDefault(nextPenHp, 0) + (probability * softPenChance * platePenChance);
                }
            }
            return nextProbabilities;
        }


        // This will be ~the one~ method for working out what happens when you hit a target, so I don't have to maintain two different functions between custom and preset
        // Assumptions:
        // 1 - Damage and Penetration will be provided as appropriate for a given distance, so no ballstic adjustment is needed here
        // 2 - We only need to be saving calcs done with preset items, custom calcs are just done live and not stored
        //? Might be an idea to add a "Hit Zero" in each series which is the details at the start of the simulation?
        public static List<BallisticHit> SimulateHitSeries_Engine(SimulationParameters parameters)
        {
            List<BallisticHit> hits = new ();

            float currentDurabilityDamageTotal = 0;
            float startingDurability = parameters.MaxDurability * (parameters.StartingDurabilityPerc / 100);

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
            float CumulativeChanceOfKillMemory = 0;

            while (CumulativeChanceOfKillMemory < 99.99999999)
            {
                // Get the current durability and pen chance
                float currentDurability = startingDurability - currentDurabilityDamageTotal;

                if(currentDurability < 0)
                {
                    currentDurability = 0;
                }

                float armorDurabilityPercentage = (currentDurability / parameters.MaxDurability) * 100;
                float penetrationChance = (float) PenetrationChance(parameters.ArmorClass, parameters.Penetration, armorDurabilityPercentage);

                // Calc Potential damages:
                float shotBlunt = (float) BluntDamage(armorDurabilityPercentage, parameters.ArmorClass, parameters.BluntThroughput, parameters.Damage, parameters.Penetration);
                float shotPenetrating = (float) PenetrationDamage(armorDurabilityPercentage, parameters.ArmorClass, parameters.Damage, parameters.Penetration);

                // Calc Average Damage and apply it to HP pool
                var AverageDamage = (shotBlunt * (1 - penetrationChance)) + (shotPenetrating * penetrationChance);
               
                if (currentDurability <= 0)
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
                    CumulativeChanceOfKillMemory = thisHit.CumulativeChanceOfKill;
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

                // Add the damage of the current shot so it can be used in the next loop
                var durabilityPerc = currentDurability / parameters.MaxDurability;
                currentDurabilityDamageTotal = (float)(currentDurabilityDamageTotal + GetExpectedArmorDamage(parameters.ArmorClass, parameters.ArmorMaterial, parameters.Penetration, parameters.ArmorDamagePerc, durabilityPerc));

                // Update the previousHpProbabilities so that the next loop can use it and increase the hit counter.
                previousHpProbabilities = currentHpProbabilities.DeepClone();
                hitNumber++;
            }

            return hits;
        }

        public static BallisticTest SimulateHitSeries_Presets(ArmorItemStats armorItemStats, float startingDurabilityPerc, BallisticDetails ballisticDetails)
        {
            ballisticDetails.LoadAmmo();
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
        public static List<MultiLayerBallisticHit> MultiLayerSimulation_EngineV2(MultiLayerSimulationParameters parameters)
        {
            float PlateStartingDurability = parameters.PlateMaxDurability * (parameters.PlateStartingDurabilityPerc / 100);
            float SoftStartingDurability = parameters.SoftMaxDurability * (parameters.SoftStartingDurabilityPerc / 100);

            float PlateCurrentDurabilityDamageTotal = 0;
            float SoftCurrentDurabilityDamageTotal = 0;

            float PlateCurrentDurability = PlateStartingDurability;
            float SoftCurrentDurability = SoftStartingDurability;

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
            float CumulativeChanceOfKillMemory = 0;
            List<MultiLayerBallisticHit> hits = new();

            while (CumulativeChanceOfKillMemory < 99.99)
            {
                var durabilityBeforeHit_Plate = PlateCurrentDurability;
                var durabilityBeforeHit_Soft = SoftCurrentDurability;

                var currentBulletDamage = parameters.Damage;
                var currentBulletPenetration = parameters.Penetration;

                float platePenetrationChance = 0;
                float postPlatePenetration = parameters.Penetration;
                float postPlateDamage = parameters.Damage;

                float shotBluntSoft = 0;
                float shotPenetratingSoft = 0;
                float softPenetrationChance = 0;

                if (PlateCurrentDurability > 0)
                {
                    float plateArmorDurabilityPercentage = (PlateCurrentDurability / parameters.PlateMaxDurability) * 100;
                    platePenetrationChance = (float)PenetrationChance(parameters.PlateArmorClass, currentBulletPenetration, plateArmorDurabilityPercentage);

                    float expectedPlateDurabilityDamage = (float)GetExpectedArmorDamage(parameters.PlateArmorClass, parameters.PlateArmorMaterial, currentBulletPenetration, parameters.ArmorDamagePerc, plateArmorDurabilityPercentage);
                    float plateReductionFactor = (float)CalculateReductionFactor(currentBulletPenetration, plateArmorDurabilityPercentage, parameters.PlateArmorClass);

                    float shotPenetratingPlate = (float)PenetrationDamage(plateArmorDurabilityPercentage, parameters.PlateArmorClass, currentBulletDamage, currentBulletPenetration);

                    //! plates seem to have 0 blunt damage
                    //float shotBlockedOnPlate = (float)BluntDamage(plateArmorDurabilityPercentage, parameters.PlateArmorClass, parameters.PlateBluntThroughput, currentBulletDamage, currentBulletPenetration);

                    //PlateCurrentDurability -= expectedPlateDurabilityDamage;
                    PlateCurrentDurability = PlateCurrentDurability - expectedPlateDurabilityDamage > 0 ? PlateCurrentDurability - expectedPlateDurabilityDamage : 0;

                    PlateCurrentDurabilityDamageTotal = PlateCurrentDurability - expectedPlateDurabilityDamage > 0 ? PlateCurrentDurabilityDamageTotal + expectedPlateDurabilityDamage : PlateStartingDurability;

                    currentBulletDamage = (shotPenetratingPlate * plateReductionFactor); //! So a plate will get zero blunt damage on a block
                    currentBulletPenetration = (currentBulletPenetration * plateReductionFactor); //! If the shot is blocked, it is a zero, and you can't multiply that

                    postPlatePenetration = currentBulletPenetration;
                    postPlateDamage = currentBulletDamage;
                }
                else
                {
                    platePenetrationChance = 1;
                }
                //if(platePenetrationChance < .01f)
                //{
                //    // If there is less than a 1 in a 1000 chance to pen the plate, we will discard any "quantumn damage" the soft will accure 
                //    softPenetrationChance = 0;
                //}
                //else if(platePenetrationChance >= .01f && SoftCurrentDurability > 0)
                if (SoftCurrentDurability > 0)
                {
                    float softDurabilityPercentage = (SoftCurrentDurability / parameters.SoftMaxDurability) * 100;
                    softPenetrationChance = (float)PenetrationChance(parameters.SoftArmorClass, currentBulletPenetration, softDurabilityPercentage);

                    float expectedSoftDurabilityDamage = (float)GetExpectedArmorDamage(parameters.SoftArmorClass, parameters.SoftArmorMaterial, currentBulletPenetration, parameters.ArmorDamagePerc, softDurabilityPercentage);

                    expectedSoftDurabilityDamage *= platePenetrationChance;

                    float softReductionFactor = (float)CalculateReductionFactor(currentBulletPenetration, softDurabilityPercentage, parameters.SoftArmorClass);

                    shotBluntSoft = (float)BluntDamage(softDurabilityPercentage, parameters.SoftArmorClass, parameters.SoftBluntThroughput, currentBulletDamage, currentBulletPenetration);
                    //shotBluntSoft = currentBulletDamage * parameters.SoftBluntThroughput;
                    shotPenetratingSoft = (float)PenetrationDamage(softDurabilityPercentage, parameters.SoftArmorClass, currentBulletDamage, currentBulletPenetration);

                    if (expectedSoftDurabilityDamage < .01f)
                    {
                        expectedSoftDurabilityDamage = 0;
                        shotBluntSoft = 0;
                        shotPenetratingSoft = 0;
                    }

                    SoftCurrentDurability = SoftCurrentDurability - expectedSoftDurabilityDamage > 0 ? SoftCurrentDurability - expectedSoftDurabilityDamage : 0;
                    SoftCurrentDurabilityDamageTotal = SoftCurrentDurability - expectedSoftDurabilityDamage > 0 ? SoftCurrentDurabilityDamageTotal + expectedSoftDurabilityDamage : SoftStartingDurability;
                }
                else
                {
                    softPenetrationChance = 1;
                    shotPenetratingSoft = currentBulletDamage;
                }

                // Calc Average Damage and apply it to HP pool
                // Question: will you need to calculate a 4 set or a 2 set? as we now have 4 branching possibilities instead of 2
                var averageDamage = platePenetrationChance * ((shotBluntSoft * (1 - softPenetrationChance)) + (shotPenetratingSoft * softPenetrationChance));
                //var AverageDamage = (shotBlunt * (1 - penetrationChance)) + (shotPenetrating * penetrationChance);

                HitPoints -= averageDamage;

                currentHpProbabilities = NightShade_CalculateNextHpProbabilities_MultiLayer(currentHpProbabilities, shotBluntSoft, shotPenetratingSoft, softPenetrationChance, platePenetrationChance);

                float thisCumulativeChanceOfKill = 0;
                float thisSpecificChanceOfKill = 0;
                // Update the hit to have the correct chances
                if (currentHpProbabilities.ContainsKey(0))
                {
                    thisCumulativeChanceOfKill = currentHpProbabilities[0] * 100;
                    CumulativeChanceOfKillMemory = thisCumulativeChanceOfKill;
                    if (previousHpProbabilities.ContainsKey(0))
                    {
                        thisSpecificChanceOfKill = (currentHpProbabilities[0] - previousHpProbabilities[0]) * 100;
                    }
                    else
                    {
                        thisSpecificChanceOfKill = currentHpProbabilities[0] * 100;
                    }
                }

                MultiLayerBallisticHit thisHit = new MultiLayerBallisticHit
                {
                    HitNum = hitNumber,

                    PenetrationChance_Plate = platePenetrationChance,
                    DurabilityBeforeHit_Plate = durabilityBeforeHit_Plate,
                    DurabilityDamageTotalAfterHit_Plate = PlateCurrentDurabilityDamageTotal,

                    PenetrationPower_PostPlate = postPlatePenetration,
                    Damage_PostPlate = postPlateDamage,

                    PenetrationChance_Soft = softPenetrationChance,
                    DurabilityBeforeHit_Soft = durabilityBeforeHit_Soft,
                    DurabilityDamageTotalAfterHit_Soft = SoftCurrentDurabilityDamageTotal,

                    BluntDamage = shotBluntSoft,
                    PenetrationDamage = shotPenetratingSoft,

                    AverageRemainingHitPoints = HitPoints,
                    CumulativeChanceOfKill = thisCumulativeChanceOfKill,
                    SpecificChanceOfKill = thisSpecificChanceOfKill
                };

                hits.Add(thisHit);

                previousHpProbabilities = currentHpProbabilities.DeepClone();
                hitNumber++;
            }

            return hits;
        }

        public static List<BallisticHit> MultiLayerSimulation_Engine(MultiLayerSimulationParameters parameters)
        {

            // Plate Stop: -plateDurability(stop)

            //? need to track the reduction of penetration and damage through the plate
            // Plate Pen, Soft Stop: [-plateDurability(pen), -bulletDamage(plate), -bulletPenetration(plate)], [-softDurability(stop), -playerHealth(blunt)] 

            //? need to track the reduction of penetration and damage through the plate + soft
            // Plate Pen, Soft Pen: [-plateDurability(pen), -bulletDamage(plate), -bulletPenetration(plate)], [-softDurability(stop), -bulletDamage(soft), -bulletPenetration(soft)], -playerHealth(pen)

            List<BallisticHit> hits = new();

            float PlateStartingDurability = parameters.PlateMaxDurability * (parameters.PlateStartingDurabilityPerc / 100);
            float SoftStartingDurability = parameters.SoftMaxDurability * (parameters.SoftStartingDurabilityPerc / 100);

            float PlateCurrentDurabilityDamageTotal = 0;
            float SoftCurrentDurabilityDamageTotal = 0;

            float PlateCurrentDurability = PlateStartingDurability;
            float SoftCurrentDurability = SoftStartingDurability;

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
            float CumulativeChanceOfKillMemory = 0;

            Console.WriteLine($"Penetration: {parameters.Penetration}");
            Console.WriteLine($"Damage: {parameters.Damage}\n");

            //while (CumulativeChanceOfKillMemory < 99.99999999)
            while (hitNumber < 20)
            {
                //todo restructure with guard clauses

                //! no armor remaining
                if(PlateCurrentDurability == 0 && SoftCurrentDurability == 0)
                {
                    //currentHpProbabilities = NightShade_CalculateNextHpProbabilities(currentHpProbabilities, parameters.Damage, parameters.Damage, 100); //todo check if 100 or 1

                    //// Update the hit to have the correct chances
                    //if (currentHpProbabilities.ContainsKey(0))
                    //{
                    //    var CumulativeChanceOfKill = currentHpProbabilities[0] * 100;

                    //    CumulativeChanceOfKillMemory = CumulativeChanceOfKill;



                    //    if (previousHpProbabilities.ContainsKey(0))
                    //    {
                    //        var SpecificChanceOfKill = (currentHpProbabilities[0] - previousHpProbabilities[0]) * 100;
                    //    }
                    //    else
                    //    {
                    //        var SpecificChanceOfKill = currentHpProbabilities[0] * 100;
                    //    }
                    //}


                    //previousHpProbabilities = currentHpProbabilities.DeepClone();
                    Console.WriteLine($"Hit: {hitNumber}");
                    Console.WriteLine("No more armor\n");
                    hitNumber++;
                    continue;
                }

                //! only soft armor remaining
                if(PlateCurrentDurability == 0 && SoftCurrentDurability > 0)
                {
                    float softDurabilityPercentage = (SoftCurrentDurability / parameters.PlateMaxDurability) * 100;
                    float softPenetrationChance = (float)PenetrationChance(parameters.SoftArmorClass, parameters.Penetration, softDurabilityPercentage);

                    float expectedSoftDurabilityDamage = (float)GetExpectedArmorDamage(parameters.SoftArmorClass, parameters.SoftArmorMaterial, parameters.Penetration, parameters.ArmorDamagePerc, softDurabilityPercentage);

                    // Calc Potential damages:
                    //! Remember no need for the reduction factor, as these methods already do it
                    float shotBlunt = (float)BluntDamage(softDurabilityPercentage, parameters.SoftArmorClass, parameters.SoftBluntThroughput, parameters.Damage, parameters.Penetration);
                    float shotPenetrating = (float)PenetrationDamage(softDurabilityPercentage, parameters.SoftArmorClass, parameters.Damage, parameters.Penetration);
                    var AverageDamage = (shotBlunt * (1 - softPenetrationChance)) + (shotPenetrating * softPenetrationChance);

                    SoftCurrentDurability = SoftCurrentDurability - expectedSoftDurabilityDamage > 0 ? SoftCurrentDurability - expectedSoftDurabilityDamage : 0;

                    Console.WriteLine($"\nHit: {hitNumber} on Soft");
                    Console.WriteLine($"Plate Dura: {PlateCurrentDurability}");
                    Console.WriteLine($"Soft Dura: {SoftCurrentDurability}");
                    Console.WriteLine($"expectedSoftDurabilityDamage: {expectedSoftDurabilityDamage}");
                    Console.WriteLine($"postSoft_DamagePenetrating: {shotPenetrating}");
                    Console.WriteLine($"postSoft_DamageBlunt: {shotBlunt}");

                    hitNumber++;
                    continue;
                }

                //! plate + soft armor remaining
                if (PlateCurrentDurability > 0)
                {
                    Console.WriteLine($"\nHit: {hitNumber} on Plate");
                    Console.WriteLine($"Plate Dura: {PlateCurrentDurability}");
                    Console.WriteLine($"Soft Dura: {SoftCurrentDurability}");

                    float plateArmorDurabilityPercentage = (PlateCurrentDurability / parameters.PlateMaxDurability) * 100;
                    float platePenetrationChance = (float)PenetrationChance(parameters.PlateArmorClass, parameters.Penetration, plateArmorDurabilityPercentage);

                    float expectedPlateDurabilityDamage = (float)GetExpectedArmorDamage(parameters.PlateArmorClass, parameters.PlateArmorMaterial, parameters.Penetration, parameters.ArmorDamagePerc, plateArmorDurabilityPercentage);
                    Console.WriteLine($"expectedPlateDurabilityDamage: {expectedPlateDurabilityDamage}");

                    float plateReductionFactor = (float)CalculateReductionFactor(parameters.Penetration, plateArmorDurabilityPercentage, parameters.PlateArmorClass);

                    PlateCurrentDurability = PlateCurrentDurability - expectedPlateDurabilityDamage > 0 ? PlateCurrentDurability - expectedPlateDurabilityDamage : 0;

                    Console.WriteLine($"platePenetrationChance: {platePenetrationChance*100}%");

                    if (platePenetrationChance > 0.01 && SoftCurrentDurability > 0)
                    {
                        float postPlatePenetrationPower = parameters.Penetration * plateReductionFactor;
                        float postPlateDamage = parameters.Damage * plateReductionFactor;

                        Console.WriteLine($"postPlatePenetrationPower: {postPlatePenetrationPower}");
                        Console.WriteLine($"postPlateDamage: {postPlateDamage}");

                        float softDurabilityPercentage = (SoftCurrentDurability / parameters.PlateMaxDurability) * 100;
                        float softPenetrationChance = (float)PenetrationChance(parameters.SoftArmorClass, postPlatePenetrationPower, softDurabilityPercentage);

                        float expectedSoftDurabilityDamage = (float)GetExpectedArmorDamage(parameters.SoftArmorClass, parameters.SoftArmorMaterial, postPlatePenetrationPower, parameters.ArmorDamagePerc, softDurabilityPercentage);
                        Console.WriteLine($"expectedSoftDurabilityDamage: {expectedSoftDurabilityDamage}");

                        // Calc Potential damages:
                        //! Remember no need for the reduction factor, as these methods already do it
                        float shotBlunt = (float)BluntDamage(softDurabilityPercentage, parameters.SoftArmorClass, parameters.SoftBluntThroughput, postPlateDamage, postPlatePenetrationPower);

                        float shotPenetrating = (float)PenetrationDamage(softDurabilityPercentage, parameters.SoftArmorClass, postPlateDamage, postPlatePenetrationPower);
                        var AverageDamage = (shotBlunt * (1 - softPenetrationChance)) + (shotPenetrating * softPenetrationChance);

                        Console.WriteLine($"postPlate_softPenetrationChance: {softPenetrationChance*100}%");
                        Console.WriteLine($"postPlateAndSoft_DamagePenetrating: {shotPenetrating}");
                        Console.WriteLine($"postPlateAndSoft_DamageBlunt: {shotBlunt}");

                        if(platePenetrationChance > 0.01)
                        {
                            SoftCurrentDurability = SoftCurrentDurability - expectedSoftDurabilityDamage > 0 ? SoftCurrentDurability - expectedSoftDurabilityDamage : 0;
                        }

                        
                    }




                    hitNumber++;
                    continue;
                }
                //if(PlateCurrentDurability > 0)
                //{
                //    float plateArmorDurabilityPercentage = (PlateCurrentDurability / parameters.PlateMaxDurability) * 100;
                //    float platePenetrationChance = (float)PenetrationChance(parameters.PlateArmorClass, parameters.Penetration, plateArmorDurabilityPercentage);

                //    float expectedPlateDurabilityDamage = (float) GetExpectedArmorDamage(parameters.PlateArmorClass, parameters.PlateArmorMaterial, parameters.Penetration, parameters.ArmorDamagePerc, plateArmorDurabilityPercentage);

                //    float plateReductionFactor = (float) CalculateReductionFactor(parameters.Penetration, plateArmorDurabilityPercentage, parameters.PlateArmorClass);

                //    if (platePenetrationChance > 0.1 && SoftCurrentDurability > 0)
                //    {
                //        float postPlatePenetrationPower = parameters.Penetration * plateReductionFactor;
                //        float postPlateDamage = parameters.Damage * plateReductionFactor ;

                //        float softDurabilityPercentage = (SoftCurrentDurability / parameters.PlateMaxDurability) * 100;
                //        float softPenetrationChance = (float)PenetrationChance(parameters.SoftArmorClass, postPlatePenetrationPower, softDurabilityPercentage);

                //        float expectedSoftDurabilityDamage = (float)GetExpectedArmorDamage(parameters.SoftArmorClass, parameters.SoftArmorMaterial, postPlatePenetrationPower, parameters.ArmorDamagePerc, softDurabilityPercentage);

                //        // Calc Potential damages:
                //        //! Remember no need for the reduction factor, as these methods already do it
                //        float shotBlunt = (float)BluntDamage(softDurabilityPercentage, parameters.SoftArmorClass, parameters.SoftBluntThroughput, postPlateDamage, postPlatePenetrationPower);
                //        float shotPenetrating = (float)PenetrationDamage(softDurabilityPercentage, parameters.SoftArmorClass, postPlateDamage, postPlatePenetrationPower);
                //        var AverageDamage = (shotBlunt * (1 - softPenetrationChance)) + (shotPenetrating * softPenetrationChance);



                //        MultiLayerBallisticHit mLBH = new();

                //        mLBH.HitNum = hitNumber;
                //        mLBH.PenetrationChance_Plate = platePenetrationChance;
                //        mLBH.DurabilityBeforeHit_Plate = PlateCurrentDurability;
                //        mLBH.DurabilityDamageTotalAfterHit_Plate = PlateCurrentDurability - expectedPlateDurabilityDamage > 0 ? PlateCurrentDurability - expectedPlateDurabilityDamage : 0;

                //        mLBH.PenetrationPower_PostPlate = postPlatePenetrationPower;
                //        mLBH.Damage_PostPlate = postPlateDamage;
                //        mLBH.PenetrationChance_Soft = softPenetrationChance;
                //        mLBH.DurabilityBeforeHit_Soft = SoftCurrentDurability;
                //        mLBH.DurabilityDamageTotalAfterHit_Soft = SoftCurrentDurability - expectedSoftDurabilityDamage > 0 ? SoftCurrentDurability - expectedSoftDurabilityDamage : 0;

                //        mLBH.BluntDamage = shotBlunt;
                //        mLBH.PenetrationDamage = shotPenetrating;
                //        //todo HP and CoK stuff

                //        Console.WriteLine(mLBH.ToString());
                //        hitNumber++;
                //    }
                //    else
                //    {
                //        Console.WriteLine();
                //        hitNumber++;
                //    }

                //}
                hitNumber++;
                Console.WriteLine("Out of bounds?");
            }


            // bullet vs plate



            // bullet vs soft

            return hits;
        }

        

        //helper function for getting that reduction multiplier as used for damage and penetration, aka "damage mitigation"
        public static double CalculateReductionFactor(double penetrationPower, double armorDurabilityPerc, int armorClass)
        {
            float factor_A = (float) CalculateFactor_A(armorDurabilityPerc, armorClass);

            float reductionMultiplier = (float) Math.Clamp(penetrationPower / ((factor_A + 12f)), 0.6f, 1f);

            return reductionMultiplier;
        }

        // Helper for calculating FactorA which is used in a bunch of ballistic calculations
        private static double CalculateFactor_A(double armorDurabilityPerc, int armorClass)
        {
            return (121 - 5000 / (45 + (armorDurabilityPerc * 2))) * armorClass * 0.1;
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
                armor_destructability = 0.1875;
            else if (armor_material == ArmorMaterial.UHMWPE)
                armor_destructability = 0.3375;
            else if (armor_material == ArmorMaterial.Combined)
                armor_destructability = 0.375;
            else if (armor_material == ArmorMaterial.Titan)
                armor_destructability = 0.4125;
            else if (armor_material == ArmorMaterial.Aluminium)
                armor_destructability = 0.45;
            else if (armor_material == ArmorMaterial.ArmoredSteel)
                armor_destructability = 0.525;
            else if (armor_material == ArmorMaterial.Ceramic)
                armor_destructability = .55;
            else if (armor_material == ArmorMaterial.Glass)
                armor_destructability = .6;

            return armor_destructability;
        }
        public static double PenetrationChance(int armorClass, float bulletPen, float armorDurabilityPerc)
        {
            /**  
             * The goal of this is to work out the value with a given set of inputs.
             * Equations taken and modified from https://www.desmos.com/calculator/m8cmsfokkl.
             */
            double factor_a = CalculateFactor_A(armorDurabilityPerc, armorClass);

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

            //double A_Factor = CalculateFactor_A(armorDurability, armor_class);

            //! 1.1 max is shown in test result of 5.45 BT vs Usec Trooper. .6 min is shown in rest results of 5.45 T vs a Korund and a Slick plate.
            double result = 
                bullet_penetration *
                armorDamagePercentage_dbl *
                Math.Clamp(bullet_penetration / armor_class * 10, .6d, 1.1d) *
                armor_destructability;

            //! CZTL's minimum dura damage as per buckshot vs a slick plate
            result = Math.Max(result, 1);

            return result;
        }
        //! This function was gleaned from reverse regression analysis of a big data set of test results from in-game.
        public static double DamageToArmorPenetration(int armor_class, ArmorMaterial armor_material, double bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
        {
            double armor_destructability = GetDestructabilityFromMaterial(armor_material);
            double armorDamagePercentage_dbl = bullet_armorDamagePercentage / 100d;

            //double A_Factor = CalculateFactor_A(armorDurability, armor_class);

            //! .9 max is shown in test result of ignolnik vs PACA, Zhuk-3, etc. .5 min is shown in rest results of 5.45 T vs pretty much everything lmao.
            double result = 
                bullet_penetration * 
                armorDamagePercentage_dbl *
                Math.Clamp(bullet_penetration / armor_class * 10, .5d, .9d) *
                armor_destructability;

            //! CZTL's minimum dura damage as per buckshot vs a slick plate
            result = Math.Max(result, 1);

            return result;
        }
        public static double GetExpectedArmorDamage(int armor_class, ArmorMaterial armor_material, double bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
        {
            var blocked = DamageToArmorBlock(armor_class, armor_material, bullet_penetration, bullet_armorDamagePercentage, armorDurability);
            var penned = DamageToArmorPenetration(armor_class, armor_material, bullet_penetration, bullet_armorDamagePercentage, armorDurability);

            double probabilityOfPenetration =  PenetrationChance(armor_class, (float) bullet_penetration, (float) armorDurability);

            return (probabilityOfPenetration * penned) + ((1 - probabilityOfPenetration) * blocked);
        }
        // This Function provides the blunt damage that a character will receive after a bullet is stopped by armor.
        public static double BluntDamage(double armorDurabilityPercentage, int armorClass, double bluntThroughput, double bulletDamage, double bulletPenetration)
        {
            double median(double a, double b, double c)
            {
                double[] arr = new double[] { a, b, c };
                Array.Sort(arr);
                return arr[1];
            }

            var factor_a = CalculateFactor_A(armorDurabilityPercentage, armorClass);

            double medianResult = median(0.2, 1 - (0.03 * (factor_a - bulletPenetration)), 1);

            double finalResult =
                bluntThroughput *
                medianResult *
                bulletDamage;

            return finalResult;
        }
        // This function provides the damage that a character will receive after a bullet penetrates armor, accounting for the damage mitigation, if any.
        public static double PenetrationDamage(double armorDurabilityPercentage, int armorClass, double bulletDamage, double bulletPenetration)
        {
            double median(double a, double b, double c)
            {
                double[] arr = new double[] { a, b, c };
                Array.Sort(arr);
                return arr[1];
            }

            var factor_a = CalculateFactor_A(armorDurabilityPercentage, armorClass);

            double medianResult = median(0.6, bulletPenetration / (factor_a + 12), 1);

            double finalResult =
                medianResult *
                bulletDamage;

            return finalResult;
        }
        public static int GetLegMetaHTK(Ammo ammo)
        {
            /* In this function we will find the STK of the ammo vs legs. For this we need to consider the bullet damage, the fragmentation chance and from those two the average damage.
             * Perhaps later we could also include the the CoK and CCoK for a given shot being a kill, but for now let's just use an average figure.
             * As legs have a 1.0 damage multiplier for blacked limb damage, it's pretty simple.
             * lmao, not anymore. Now legs have .7, and now you gotta assume if all shots are going into one leg or both. I will assume both.
             */
            double health_pool = 375;
            double legs_pool = 65;
            double frag_chance = ammo.FragmentationChance;
            if (ammo.PenetrationPower < 20)
            {
                frag_chance = 0;
            }

            double average_damage = (ammo.Damage * 1 - frag_chance) + ((ammo.Damage * 1.5) * frag_chance);

            double remainderFromLegs;
            int legPoolShots;
            if (average_damage < legs_pool)
            {
                legPoolShots = (int)Math.Ceiling(legs_pool / average_damage);
                remainderFromLegs = (legPoolShots * average_damage) - legs_pool;
            }

            else
            {
                remainderFromLegs = average_damage % legs_pool; // 150 % 130 = 20
                legPoolShots = 1;
            }
            health_pool = health_pool - (remainderFromLegs * .7);

            var math = health_pool / (average_damage * .7);
            int shots = (int)Math.Ceiling((decimal) math);

            shots = shots + legPoolShots;

            return shots;
        }
        public static int GetLegMetaHTK(string ammoId)
        {
            Ammo ammo = (Ammo) Ammos.Cleaned.FirstOrDefault(x=>x.Id == ammoId);

            return GetLegMetaHTK(ammo);
        }
    }
}
