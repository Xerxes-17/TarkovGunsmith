using RatStash;
using Newtonsoft.Json.Linq;
using Force.DeepCloner;

namespace WishGranterProto.ExtensionMethods
{
    // These methods are for working out statistics and such for various things.
    public static class WG_Calculation
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

        // Helper for calculating FactorA which is used in a bunch of ballistic calculations
        private static double CalculateFactor_A(double armorDurability, int armorClass)
        {
            return (121 - 5000 / (45 + (armorDurability * 2))) * armorClass * 0.1;
        }

        // This function provides the effective durability of an armor item for a given max durability and armor material.
        public static int GetEffectiveDurability(int maxDurability, ArmorMaterial armorMaterial)
        {
            double armor_destructability = GetDestructabilityFromMaterial(armorMaterial);

            return (int) (maxDurability / armor_destructability);
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

        // Self explainatory
        public static double PenetrationChance(int armorClass, int bulletPen, double armorDurability)
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

        // Takes the details of a given armor and bullet pair and returns a double of the expected armor damage caused.
        // bullet_armorDamagePercentage is an int because the BSG files use an integer.
        public static double DamageToArmor(int armor_class, ArmorMaterial armor_material, int bullet_penetration, int bullet_armorDamagePercentage)
        {
            double[,] ArmorDamageMultipliers = new double[,] { { .9, 1, 1.2, 1.5, 1.8 }, { .9, .9, 1, 1, 1.2 }, { .9, .9, .9, 1, 1 }, { .9, .9, .9, .9, 1 }, { .9, .9, .9, .9, .9 }, { .9, .9, .9, .9, .9 } };

            // Need -2 as we aren't concerned with AC 1 or Pen 1-19 items.
            int penetrationIndex = (bullet_penetration / 10) - 2;
            double ArmorDamageMultiplier = ArmorDamageMultipliers[penetrationIndex, armor_class - 2];

            double armor_destructability = GetDestructabilityFromMaterial(armor_material);

            double RoundUpAdjustment = Math.Min(1, (bullet_penetration / 10D) / armor_class);

            double armorDamagePercentage_dbl = bullet_armorDamagePercentage / 100d;

            return bullet_penetration * armorDamagePercentage_dbl * armor_destructability * RoundUpAdjustment * ArmorDamageMultiplier;
        }

        //! This function was gleaned from reverse regression analysis of a big data set of test results from in-game.
        public static double DamageToArmorBlock(int armor_class, ArmorMaterial armor_material, int bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
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
        public static double DamageToArmorPenetration(int armor_class, ArmorMaterial armor_material, int bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
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

        public static double getExpectedArmorDamage(int armor_class, ArmorMaterial armor_material, int bullet_penetration, int bullet_armorDamagePercentage, double armorDurability)
        {
            var blocked = DamageToArmorBlock(armor_class, armor_material, bullet_penetration, bullet_armorDamagePercentage, armorDurability);
            var penned = DamageToArmorPenetration(armor_class, armor_material, bullet_penetration, bullet_armorDamagePercentage, armorDurability);
            double probabilityOfPenetration = PenetrationChance(armor_class, bullet_penetration, armorDurability);

            return (probabilityOfPenetration * penned) + ((1 - probabilityOfPenetration) * blocked);
        }

        // This Function provides the blunt damage that a character will receive after a bullet is stopped by armor.
        public static double BluntDamage(double armorDurability, int armorClass, double bluntThroughput, int bulletDamage, int bulletPenetration)
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
        public static double DamageToCharacter(double armorDurability, int armorClass, int bulletDamage, int bulletPenetration)
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

        //Takes ArmorItem object to feed into DamageToArmor, this is a wrapper function.
        public static double ArmorItemDamageFromAmmo(ArmorItem armorItem, Ammo ammo)
        {
            return DamageToArmor(armorItem.ArmorClass, armorItem.ArmorMaterial, ammo.PenetrationPower, ammo.ArmorDamage);
        }

        public static ArmorItem GetArmorItemFromRatstashByIdString(string armorID, Database RatStashDB)
        {
            var Armor = RatStashDB.GetItem(armorID);
            ArmorItem armorItem = new();

            // Need to cast the Item to respective types to get properties
            if (Armor.GetType() == typeof(Armor))
            {
                var temp = (Armor)Armor;
                armorItem.Name = temp.ShortName;
                armorItem.Id = temp.Id;
                armorItem.MaxDurability = temp.MaxDurability;
                armorItem.ArmorClass = temp.ArmorClass;
                armorItem.ArmorMaterial = temp.ArmorMaterial;
                armorItem.ArmorType = "Armor";
                armorItem.BluntThroughput = temp.BluntThroughput;
            }
            else if (Armor.GetType() == typeof(ChestRig))
            {
                var temp = (ChestRig)Armor;
                armorItem.Name = temp.ShortName;
                armorItem.Id = temp.Id;
                armorItem.MaxDurability = temp.MaxDurability;
                armorItem.ArmorClass = temp.ArmorClass;
                armorItem.ArmorMaterial = temp.ArmorMaterial;
                armorItem.ArmorType = "Armor";
                armorItem.BluntThroughput = temp.BluntThroughput;
            }
            else if (Armor.GetType() == typeof(Headwear))
            {
                var temp = (Headwear)Armor;
                armorItem.Name = temp.ShortName;
                armorItem.Id = temp.Id;
                armorItem.MaxDurability = temp.MaxDurability;
                armorItem.ArmorClass = temp.ArmorClass;
                armorItem.ArmorMaterial = temp.ArmorMaterial;
                armorItem.ArmorType = "Helmet";
                armorItem.BluntThroughput = temp.BluntThroughput;
            }

            else if (Armor.GetType() == typeof(ArmoredEquipment))
            {
                var temp = (ArmoredEquipment)Armor;
                armorItem.Name = temp.ShortName;
                armorItem.Id = temp.Id;
                armorItem.MaxDurability = temp.MaxDurability;
                armorItem.ArmorClass = temp.ArmorClass;
                armorItem.ArmorMaterial = temp.ArmorMaterial;
                armorItem.ArmorType = "Helmet";
                armorItem.BluntThroughput = temp.BluntThroughput;
            }
            else if (Armor.GetType() == typeof(FaceCover))
            {
                var temp = (FaceCover)Armor;
                armorItem.Name = temp.ShortName;
                armorItem.Id = temp.Id;
                armorItem.MaxDurability = temp.MaxDurability;
                armorItem.ArmorClass = temp.ArmorClass;
                armorItem.ArmorMaterial = temp.ArmorMaterial;
                armorItem.ArmorType = "Helmet";
                armorItem.BluntThroughput = temp.BluntThroughput;
            }
            else if (Armor.GetType() == typeof(VisObservDevice))
            {
                var temp = (VisObservDevice)Armor;
                armorItem.Name = temp.ShortName;
                armorItem.Id = temp.Id;
                armorItem.MaxDurability = temp.MaxDurability;
                armorItem.ArmorClass = temp.ArmorClass;
                armorItem.ArmorMaterial = temp.ArmorMaterial;
                armorItem.ArmorType = "Helmet";
                armorItem.BluntThroughput = temp.BluntThroughput;
            }

            return armorItem;
        }

        // Finds the test serires result of a given armor at a percentage of durability vs a given ammo type
        public static TransmissionArmorTestResult FindPenetrationChanceSeries(ArmorItem armorItem, Ammo ammo, double startingDuraPerc)
        {
            // Setup variables
            TransmissionArmorTestResult testResult = new();
            testResult.TestName = $"If you are reading this, something went wrong in FindPenetrationChanceSeries() with {armorItem.Name} vs {ammo.Name}";

            double doneDamage = 0;
            double startingDura = -1;

            if (armorItem.MaxDurability != null)
            {
                startingDura = (double)armorItem.MaxDurability * (startingDuraPerc / 100);
                testResult.TestName = $"{armorItem.Name} @{string.Format("{0:0.00}", startingDuraPerc)}% vs {ammo.Name}";

                // probability setup
                Dictionary<int, float> currentHpProbabilities = new() { [8500] = 1 };
                Dictionary<int, float> previousHpProbabilities = new() { [8500] = 1 };

                double HitPoints = 85;
                if (armorItem.ArmorType.Equals("Helmet"))
                {
                    HitPoints = 35;
                    currentHpProbabilities = new() { [3500] = 1 };
                }

                // ADPS
                testResult.ArmorDamagePerShot = getExpectedArmorDamage(armorItem.ArmorClass, armorItem.ArmorMaterial, ammo.PenetrationPower, ammo.ArmorDamage, 100);

                while (doneDamage < startingDura || HitPoints > 0)
                {
                    // Get the current durability and pen chance
                    double durability = ((double)startingDura - doneDamage) / (double)armorItem.MaxDurability * 100;
                    double penChance = PenetrationChance(armorItem.ArmorClass, ammo.PenetrationPower, durability);
                    double penetrationChance = penChance * 100;

                    // Calc Potential damages:
                    var ShotBlunt = BluntDamage(durability, armorItem.ArmorClass, armorItem.BluntThroughput, ammo.Damage, ammo.PenetrationPower);
                    var ShotPenetrating = DamageToCharacter(durability, armorItem.ArmorClass, ammo.Damage, ammo.PenetrationPower);
                    

                    // Calc Average Damage and apply it to HP pool
                    var AverageDamage = (ShotBlunt * (1 - penChance)) + (ShotPenetrating * penChance);
                    //! Exception for when the armor is at zero durability
                    if(durability <= 0)
                    {
                        HitPoints = HitPoints - ammo.Damage;
                    }
                    else
                    {
                        HitPoints = HitPoints - AverageDamage;
                    }
                    

                    // Calc the probabilities
                    currentHpProbabilities = NightShade_CalculateNextHpProbabilities(currentHpProbabilities, ShotBlunt, ShotPenetrating, (float) penChance);

                    // Package details in Transmission object
                    TransmissionArmorTestShot testShot = new();
                    testShot.DurabilityPerc = (startingDura - doneDamage) / armorItem.MaxDurability * 100;
                    testShot.DoneDamage = doneDamage;
                    testShot.Durability = startingDura - doneDamage;
                    testShot.PenetrationChance = penetrationChance;

                    testShot.BluntDamage = ShotBlunt;
                    testShot.PenetratingDamage = ShotPenetrating;
                    testShot.AverageDamage = AverageDamage;
                    testShot.RemainingHitPoints = HitPoints;

                    testShot.ProbabilityOfKillCumulative = 0;
                    testShot.ProbabilityOfKillSpecific = 0;

                    //! Exception for when the armor is at zero durability
                    if (testShot.Durability < 0)
                    {
                        testShot.Durability = 0;
                        testShot.DurabilityPerc = 0;
                        testShot.PenetrationChance = 100;
                        testShot.PenetratingDamage = ammo.Damage;
                        testShot.AverageDamage = ammo.Damage;
                        testShot.DoneDamage = (double)armorItem.MaxDurability * (startingDuraPerc / 100);
                    }

                    if (currentHpProbabilities.ContainsKey(0))
                    {
                        testShot.ProbabilityOfKillCumulative = currentHpProbabilities[0] * 100;
                        if (previousHpProbabilities.ContainsKey(0))
                        {
                            testShot.ProbabilityOfKillSpecific = (currentHpProbabilities[0] - previousHpProbabilities[0]) * 100;
                        }
                        else
                        {
                            testShot.ProbabilityOfKillSpecific = currentHpProbabilities[0] * 100;
                        }
                    }

                    testResult.Shots.Add(testShot);

                    // Add the damage of the current shot so it can be used in the next loop
                    doneDamage = doneDamage + getExpectedArmorDamage(armorItem.ArmorClass, armorItem.ArmorMaterial, ammo.PenetrationPower, ammo.ArmorDamage, (double) testResult.Shots.Last().DurabilityPerc!); ;

                    // Update the previousHpProbabilities so that the next loop can use it
                    previousHpProbabilities = currentHpProbabilities.DeepClone();
                } 
                // Let's get the shot that should kill
                var index = testResult.Shots.FindIndex(x => x.ProbabilityOfKillCumulative > 50);

                // In the event that the average damage doesn't go below zero before the end of an armor test serires, set tha final index as the kill shot
                //? This is a small hack until I can go back to this and remake the ADC into a proper terminal ballistics sim.
                if(index == -1)
                {
                    testResult.KillShot = testResult.Shots.Count;
                }
                else
                {
                    testResult.KillShot = index + 1;
                }
            }
            

            return testResult;
        }

        // Finds the test serires result of a custom armor at a percentage of durability vs a given custom ammo
        public static TransmissionArmorTestResult FindPenetrationChanceSeries_Custom(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc, int damage)
        {
            TransmissionArmorTestResult testResult = new();
            testResult.TestName = $"Custom test of AC:{ac} MaxDura:{maxDurability}, StartDura%:{string.Format("{0:0.00}", startingDurabilityPerc)} Material:{material}, vs Pen:{penetration}, AD%:{armorDamagePerc}";

            double doneDamage = 0;
            double startingDura = (double)maxDurability * ( (double) startingDurabilityPerc / 100);

            // probability setup
            Dictionary<int, float> currentHpProbabilities = new() { [8500] = 1 };
            Dictionary<int, float> previousHpProbabilities = new() { [8500] = 1 };

            double HitPoints = 85;

            ArmorMaterial armorMaterial = new();

            if (material == "Aramid")
                armorMaterial = ArmorMaterial.Aramid;
            else if (material == "UHMWPE")
                armorMaterial = ArmorMaterial.UHMWPE;
            else if (material == "Combined")
                armorMaterial = ArmorMaterial.Combined;
            else if (material == "Titan")
                armorMaterial = ArmorMaterial.Titan;
            else if (material == "Aluminium")
                armorMaterial = ArmorMaterial.Aluminium;
            else if (material == "ArmoredSteel")
                armorMaterial = ArmorMaterial.ArmoredSteel;
            else if (material == "Ceramic")
                armorMaterial = ArmorMaterial.Ceramic;

            testResult.ArmorDamagePerShot = DamageToArmor(ac, armorMaterial, penetration, armorDamagePerc);

            while (doneDamage < startingDura)
            {
                double durability = (startingDura - doneDamage) / maxDurability * 100;

                double penChance = PenetrationChance(ac, penetration, durability);
                double penetrationChance = penChance * 100;

                // Calc Potential damages:
                var ShotBlunt = BluntDamage(durability, ac, .27, damage, penetration);
                var ShotPenetrating = DamageToCharacter(durability, ac, damage, penetration);

                // Calc Average Damage and apply it to HP
                var AverageDamage = (ShotBlunt * (1 - penChance)) + (ShotPenetrating * penChance);
                HitPoints = HitPoints - AverageDamage;

                // Calc the probabilities
                currentHpProbabilities = NightShade_CalculateNextHpProbabilities(currentHpProbabilities, ShotBlunt, ShotPenetrating, (float)penChance);

                // Package details in Transmission object
                TransmissionArmorTestShot testShot = new();
                testShot.DurabilityPerc = (startingDura- doneDamage) / maxDurability * 100;
                testShot.DoneDamage = doneDamage;
                testShot.Durability = startingDura - doneDamage;
                testShot.PenetrationChance = penetrationChance;

                testShot.BluntDamage = ShotBlunt;
                testShot.PenetratingDamage = ShotPenetrating;
                testShot.AverageDamage = AverageDamage;
                testShot.RemainingHitPoints = HitPoints;

                testShot.ProbabilityOfKillCumulative = 0;
                testShot.ProbabilityOfKillSpecific = 0;

                if (currentHpProbabilities.ContainsKey(0))
                {
                    testShot.ProbabilityOfKillCumulative = currentHpProbabilities[0] * 100;
                    if (previousHpProbabilities.ContainsKey(0))
                    {
                        testShot.ProbabilityOfKillSpecific = (currentHpProbabilities[0] - previousHpProbabilities[0]) * 100;
                    }
                    else
                    {
                        testShot.ProbabilityOfKillSpecific = currentHpProbabilities[0] * 100;
                    }
                }

                testResult.Shots.Add(testShot);

                // Add the damage of the current shot so it can be used in the next loop
                doneDamage = doneDamage + (double) testResult.ArmorDamagePerShot;
            }

            // Let's get the shot that should kill
            var index = testResult.Shots.FindIndex(x => x.RemainingHitPoints < 0);
            testResult.KillShot = index + 1;

            return testResult;
        }
    }
}
