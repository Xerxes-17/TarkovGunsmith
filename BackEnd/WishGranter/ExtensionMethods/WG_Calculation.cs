using RatStash;
using Newtonsoft.Json.Linq;

namespace WishGranterProto.ExtensionMethods
{
    // These methods are for working out statistics and such for various things.
    public static class WG_Calculation
    {
        public static int GetEffectiveDurability(int maxDurability, ArmorMaterial armorMaterial)
        {
            double armor_destructability = -1;

            if (armorMaterial == ArmorMaterial.Aramid)
                armor_destructability = .25;
            else if (armorMaterial == ArmorMaterial.UHMWPE)
                armor_destructability = .45;
            else if (armorMaterial == ArmorMaterial.Combined)
                armor_destructability = .5;
            else if (armorMaterial == ArmorMaterial.Titan)
                armor_destructability = .55;
            else if (armorMaterial == ArmorMaterial.Aluminium)
                armor_destructability = .6;
            else if (armorMaterial == ArmorMaterial.ArmoredSteel)
                armor_destructability = .7;
            else if (armorMaterial == ArmorMaterial.Ceramic)
                armor_destructability = .8;


            return (int) (maxDurability / armor_destructability);
        }
        // Self explainatory
        public static double PenetrationChance(int armorClass, int bulletPen, double armorDurability)
        {
            /**  
             * The goal of this is to work out the value with a given set of inputs.
             * Equations taken and modified from https://www.desmos.com/calculator/m8cmsfokkl.
             */
            double factor_a = CalculateFactor_A(armorDurability, armorClass);

            // This is a jank way of getting the equation selection working, but w/e.
            double result = -1;
            //double result = .4 * Math.Pow(factor_a - bulletPen - 15, 2) / 100;

            //if (result > 1 && (bulletPen < factor_a))
            //{
            //    result = 0;
            //}
            //else if ((factor_a - 15 < bulletPen) && (bulletPen < factor_a))
            //{
            //    result = .4 * Math.Pow(factor_a - bulletPen - 15, 2) / 100;
            //}
            //else if (result > .9)
            //{
            //    result = (100 + (bulletPen / (.9 * factor_a - bulletPen))) / 100;
            //}
            //else
            //{
            //    result = 0;
            //}

            //? Maybe improved??
            if (factor_a <= bulletPen)
            {
                result = (100 + (bulletPen / (.9 * factor_a - bulletPen))) / 100;
            }
            else if (factor_a - 15 < bulletPen && bulletPen < factor_a)
            {
                result = .4 * Math.Pow(factor_a - bulletPen - 15, 2) / 100;
            }
            else
            {
                result = 0;
            }

            return result;
        }

        private static double CalculateFactor_A(double armorDurability, int armorClass)
        {
            return (121 - 5000 / (45 + (armorDurability * 2))) * armorClass * 0.1;
        }

        // Takes the details of a given armor and bullet pair and returns a double of the expected armor damage caused.
        // bullet_armorDamagePercentage is an int because the BSG files use an integer.
        public static double DamageToArmor(int armor_class, ArmorMaterial armor_material, int bullet_penetration, int bullet_armorDamagePercentage)
        {
            double[,] ArmorDamageMultipliers = new double[,] { { .9, 1, 1.2, 1.5, 1.8 }, { .9, .9, 1, 1, 1.2 }, { .9, .9, .9, 1, 1 }, { .9, .9, .9, .9, 1 }, { .9, .9, .9, .9, .9 }, { .9, .9, .9, .9, .9 } };

            // Need -2 as we aren't concerned with AC 1 or Pen 1-19 items.
            int penetrationIndex = (bullet_penetration / 10) - 2;
            double ArmorDamageMultiplier = ArmorDamageMultipliers[penetrationIndex, armor_class - 2];

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

            double RoundUpAdjustment = Math.Min(1, (bullet_penetration / 10D) / armor_class);

            double armorDamagePercentage_dbl = bullet_armorDamagePercentage / 100d;

            return bullet_penetration * armorDamagePercentage_dbl * armor_destructability * RoundUpAdjustment * ArmorDamageMultiplier;
        }

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

        // Finds the test serires result of a given armor at a percentage of durability vs a given ammo type, also needs the image links JSON so that the FE can consume the links.
        public static TransmissionArmorTestResult FindPenetrationChanceSeries(ArmorItem armorItem, Ammo ammo, double startingDuraPerc)
        {
            // Setup variables
            TransmissionArmorTestResult testResult = new();
            testResult.TestName = $"{armorItem.Name} vs {ammo.Name}";
            double doneDamage = 0;
            double startingDura = (double)armorItem.MaxDurability * (startingDuraPerc / 100);

            double HitPoints = 85;
            if (armorItem.ArmorType.Equals("Helmet"))
            {
                HitPoints = 35;
            }

            // ArmorGI
            //string searchJSONpath = $"$.data.items.[?(@.id=='{armorItem.Id}')].gridImageLink";
            //var searchResult = imageLinks.SelectToken(searchJSONpath).ToString();
            //testResult.ArmorGridImage = searchResult;

            // AmmoGI
            //searchJSONpath = $"$.data.items.[?(@.id=='{ammo.Id}')].gridImageLink";
            //testResult.AmmoGridImage = imageLinks.SelectToken(searchJSONpath).ToString();

            // ADPS
            testResult.ArmorDamagePerShot = ArmorItemDamageFromAmmo(armorItem, ammo);

            // Dev Console log
            //Console.WriteLine(testResult.TestName);

            while (doneDamage < startingDura)
            {
                // Get the current durability and pen chance
                double durability = ((double)startingDura - doneDamage) / (double)armorItem.MaxDurability * 100;
                double penChance = PenetrationChance(armorItem.ArmorClass, ammo.PenetrationPower, durability);
                double penetrationChance = penChance * 100;

                // Calc Potential damages:
                var ShotBlunt = BluntDamage(durability, armorItem.ArmorClass, armorItem.BluntThroughput, ammo.Damage, ammo.PenetrationPower);
                var ShotPenetrating = DamageToCharacter(durability, armorItem.ArmorClass, ammo.Damage, ammo.PenetrationPower);

                // Calc Average Damage
                var AverageDamage = (ShotBlunt * (1 - penChance)) + (ShotPenetrating * penChance);

                //? Let's go for now a "remaining HP" model

                HitPoints = HitPoints - AverageDamage;

                // Dev Console log
                //Console.WriteLine("durability%: " + durability);
                //Console.WriteLine("durability: " + (startingDura - doneDamage));
                //Console.WriteLine("doneDamage: " + doneDamage);
                //Console.WriteLine("penetrationChance: " + penetrationChance);
                //Console.WriteLine("");

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


                testResult.Shots.Add(testShot);

                // Add the damage of the current shot so it can be used in the next loop
                doneDamage = doneDamage + ArmorItemDamageFromAmmo(armorItem, ammo);
            }
            return testResult;
        }

        public static TransmissionArmorTestResult FindPenetrationChanceSeries_Custom(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc, int damage)
        {
            TransmissionArmorTestResult testResult = new();
            testResult.TestName = $"Custom test of AC:{ac} MaxDura:{maxDurability}, StartDura%:{string.Format("{0:0.00}", startingDurabilityPerc)} Material:{material}, vs Pen:{penetration}, AD%:{armorDamagePerc}";

            double doneDamage = 0;
            double startingDura = (double)maxDurability * ( (double) startingDurabilityPerc / 100);

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

                // Calc Average Damage
                var AverageDamage = (ShotBlunt * (1 - penChance)) + (ShotPenetrating * penChance);

                //? Let's go for now a "remaining HP" model
                HitPoints = HitPoints - AverageDamage;

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

                testResult.Shots.Add(testShot);

                // Add the damage of the current shot so it can be used in the next loop
                doneDamage = doneDamage + (double) testResult.ArmorDamagePerShot;
            }
            return testResult;
        }
    }
}
