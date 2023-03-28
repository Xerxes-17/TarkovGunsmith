using RatStash;
using WishGranterProto.ExtensionMethods;

namespace WishGranter
{
    public class AmmoRatingsBag
    {
        public float distancePenetrationPower { get; set; } = 0;
        public float distanceDamage { get; set; } = 0;
        public List<string> ratings { get; set; } = new();
    }

    public class bulletStatsPOCO
    {
        public int penetration { get; set; } = -1 ;
        public int damage { get; set; } = -1;
        public float massGrams { get; set; } = -1;
        public float diameterMillimeters { get; set; } = -1;
        public float ballisticCoefficient { get; set; } = -1;
        public int initialSpeed { get; set; } = -1;

        public bulletStatsPOCO() { } //Default Con

        public bulletStatsPOCO(int _penetration, int _damage, float _massGrams, float _diameterMillimeters, float _ballisticCoefficient, int _initialSpeed)
        {
            penetration = _penetration;
            damage = _damage;
            massGrams = _massGrams;
            diameterMillimeters = _diameterMillimeters;
            ballisticCoefficient = _ballisticCoefficient;
            initialSpeed = _initialSpeed;
        }
    }

    public class BulletRangeTableData
    {
        // Need to modify this so that it is appropriate for the given round. No point in calculating data for a buckshot pellet past 50m for example
        // Pehaps it should be made into based on the caliber
        //{ 1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200, 250, 300, 350, 450, 500, 600 }
        public int[]? rangeIntervals { get; set; } = null;

        public string bulletID { get; set; } = "";
        public string bulletName { get; set; } = "";
        public bulletStatsPOCO bulletStats { get; set; } = new ();
        SortedList<int, (float damageAtDistance, float penetrationAtDistance, float speedAtDistance)> rangeTable { get; set; } = new (); // int key is range in meters

        //Adding in the AmmoEffectiveness Data to this class since it relies on the dam/pen of the range table. We will need to be able to invalidate it too when there are changes.
        public SortedList<int, CondensedDataRow> AmmoEffectivenessData { get; set; } = new (); // This will store the effectiveness data for a bullet at a given range.

        public BulletRangeTableData() { } //Default Con

        public BulletRangeTableData(string _bulletID, string _bulletName, bulletStatsPOCO _stats, Database database)
        {
            bulletID = _bulletID;
            bulletName = _bulletName;
            bulletStats = _stats;
            
            if (bulletName.Contains("flechette") || bulletName.Contains("buckshot"))
            {
                int[] temp = { 1, 10, 25, 50 };
                rangeIntervals = temp;
            }
            // Slugs and pistols
            else if (
                bulletName.Contains("slug") ||
                bulletName.Contains("12/70 RIP") ||
                bulletName.Contains(".45 ACP") ||
                bulletName.Contains("9x21mm") ||
                bulletName.Contains("12/70 RIP") ||
                bulletName.Contains("9x1") ||
                bulletName.Contains("5.7x28") ||
                bulletName.Contains("4.6x30") ||
                bulletName.Contains("9x21mm") ||
                bulletName.Contains("7.62x25") ||
                bulletName.Contains(".357"))
            {
                int[] temp = { 1, 10, 25, 50, 75, 100 };
                rangeIntervals = temp;
            }
            // Intermediate rouunds
            else if (
                bulletName.Contains("x39mm") ||
                bulletName.Contains("5.56x45mm") ||
                bulletName.Contains(".300") ||
                bulletName.Contains("12.7x55mm")
                )
            {
                int[] temp = { 1, 10, 25, 50, 75, 100, 110, 125, 150, 200 };
                rangeIntervals = temp;
            }

            else
            {
                int[] temp = { 1, 10, 25, 50, 75, 100, 110, 125, 150, 200, 250, 300, 350, 450, 500, 600 };
                rangeIntervals = temp;
            }

        }

        public bool invalidateCurrentData(bulletStatsPOCO newData, Database database)
        {
            if (newData == bulletStats)
                return false;

            bulletStats = newData;

            var ammo = (Ammo) database.GetItem(bulletID);
            //updateBulletRangeTable(ammo, database);
            return true;               
        }



        public void updateAmmoEffectivenessData(Ammo round, Database database)
        {
            foreach(int distance in rangeIntervals)
            {
                var ammoStatsAtDistance = rangeTable.FirstOrDefault(x => x.Key.Equals(distance)).Value;

                //round.Caliber = round.Caliber.Remove(0, 7); // Get rid of the "caliber" part of the string

                // get the AED for the round at this distance 
                var effectivenessData = WG_DataScience.CalculateAmmoEffectivenessData(round, database, distance);

                // organize the data by armor class
                List<EffectivenessDataRow>[] armorClasses = new List<EffectivenessDataRow>[6];
                armorClasses[0] = new List<EffectivenessDataRow>();
                armorClasses[1] = new List<EffectivenessDataRow>();
                armorClasses[2] = new List<EffectivenessDataRow>();
                armorClasses[3] = new List<EffectivenessDataRow>();
                armorClasses[4] = new List<EffectivenessDataRow>();
                armorClasses[5] = new List<EffectivenessDataRow>();

                foreach (var result in effectivenessData)
                {
                    armorClasses[result.ArmorClass - 1].Add(result);
                }

                List<string> ratings = new List<string>();

                foreach (var armorClass in armorClasses)
                {
                    var vests = armorClass.Where(x => x.ArmorType.Equals("Armor"));
                    int meanSTK_vests = 0;
                    if (vests.Any())
                    {
                        var STK_vals_vests = vests.Select(x => x.ExpectedShotsToKill).ToList();
                        meanSTK_vests = (int)Math.Round(STK_vals_vests.Average());
                    }

                    var helmets = armorClass.Where(x => x.ArmorType.Equals("Helmet"));
                    int meanSTK_helmets = 0;
                    if (helmets.Any())
                    {
                        var STK_vals_helmets = helmets.Select(x => x.ExpectedShotsToKill).ToList();
                        meanSTK_helmets = (int)Math.Round(STK_vals_helmets.Average());
                    }

                    //? We can insert the leg-meta effectiveness here as all we need is the round information, and later, the target info (like bosses).
                    int meanSTK_legs = WG_DataScience.GetLegMetaSTK(round);

                    //! Hey, why don't we add in the first shot pen chance too? We can just grab the first one from the list as it's going to be the same for the entire class.
                    var firstShotPenChance = (int)armorClass[0].FirstShot_PenChance;

                    //? Let's also change this to use raw STK values
                    string resultString = $"{meanSTK_vests}.{meanSTK_helmets}.{meanSTK_legs} | {firstShotPenChance}%";

                    ratings.Add(resultString);
                }

                AmmoRatingsBag arb = new AmmoRatingsBag();
                arb.distanceDamage = ammoStatsAtDistance.damageAtDistance;
                arb.distancePenetrationPower = ammoStatsAtDistance.penetrationAtDistance;
                arb.ratings = ratings;
                //? Need to fix this
                //!AmmoEffectivenessData.Add(distance, cdr);
            }
        }
    }

    public class OLD_AmmoInformationAuthority
    {
        public SortedDictionary<string, BulletRangeTableData> RangeTables_Ammo { get; set; } = new () ;

        public OLD_AmmoInformationAuthority() { } //Default Con

        public OLD_AmmoInformationAuthority(List<Ammo> ammoList, Database database) 
        {
            foreach (Ammo ammo in ammoList)
            {
                var temp = makeRangeTableEntryFromAmmo(ammo, database);
                RangeTables_Ammo.Add(temp.bulletID, temp);
                Console.WriteLine($"Ranged Data calcualted for: {ammo.Name}");
            }
        }

        public BulletRangeTableData makeRangeTableEntryFromAmmo(Ammo ammo, Database database)
        {
            bulletStatsPOCO bulletStatsPOCO = new (ammo.PenetrationPower, ammo.Damage, ammo.BulletMass, ammo.BulletDiameterMillimeters, ammo.BallisticCoeficient, ammo.InitialSpeed);

            return new BulletRangeTableData(ammo.Id, ammo.Name, bulletStatsPOCO, database);
        }

        public BulletRangeTableData getBulletEntryById(string id)
        {
            return RangeTables_Ammo.FirstOrDefault(x=> x.Key.Equals(id)).Value;
        }
    }

    public class WG_Ballistics
    {
        // Maximum simulation iterations (*SHOULD* be enough for every round in the game)
        private const int _maxIterations = 2000;
        // The time step between each simulation iteration
        private const float _simTimeStep = 0.01f;

        private static readonly int[] rangeIntervals = { 1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200, 250, 300, 350, 450, 500, 600 };

        public readonly struct G1DragModel
        {
            public G1DragModel(float mach, float ballist)
            {
                this.Mach = mach;
                this.Ballist = ballist;
            }

            public readonly float Mach { get; }

            public readonly float Ballist { get; }
        }

        private static readonly IReadOnlyList<G1DragModel> G1Coefficents = new List<G1DragModel>
        {
            new G1DragModel(0f, 0.2629f),
            new G1DragModel(0.05f, 0.2558f),
            new G1DragModel(0.1f, 0.2487f),
            new G1DragModel(0.15f, 0.2413f),
            new G1DragModel(0.2f, 0.2344f),
            new G1DragModel(0.25f, 0.2278f),
            new G1DragModel(0.3f, 0.2214f),
            new G1DragModel(0.35f, 0.2155f),
            new G1DragModel(0.4f, 0.2104f),
            new G1DragModel(0.45f, 0.2061f),
            new G1DragModel(0.5f, 0.2032f),
            new G1DragModel(0.55f, 0.202f),
            new G1DragModel(0.6f, 0.2034f),
            new G1DragModel(0.7f, 0.2165f),
            new G1DragModel(0.725f, 0.223f),
            new G1DragModel(0.75f, 0.2313f),
            new G1DragModel(0.775f, 0.2417f),
            new G1DragModel(0.8f, 0.2546f),
            new G1DragModel(0.825f, 0.2706f),
            new G1DragModel(0.85f, 0.2901f),
            new G1DragModel(0.875f, 0.3136f),
            new G1DragModel(0.9f, 0.3415f),
            new G1DragModel(0.925f, 0.3734f),
            new G1DragModel(0.95f, 0.4084f),
            new G1DragModel(0.975f, 0.4448f),
            new G1DragModel(1f, 0.4805f),
            new G1DragModel(1.025f, 0.5136f),
            new G1DragModel(1.05f, 0.5427f),
            new G1DragModel(1.075f, 0.5677f),
            new G1DragModel(1.1f, 0.5883f),
            new G1DragModel(1.125f, 0.6053f),
            new G1DragModel(1.15f, 0.6191f),
            new G1DragModel(1.2f, 0.6393f),
            new G1DragModel(1.25f, 0.6518f),
            new G1DragModel(1.3f, 0.6589f),
            new G1DragModel(1.35f, 0.6621f),
            new G1DragModel(1.4f, 0.6625f),
            new G1DragModel(1.45f, 0.6607f),
            new G1DragModel(1.5f, 0.6573f),
            new G1DragModel(1.55f, 0.6528f),
            new G1DragModel(1.6f, 0.6474f),
            new G1DragModel(1.65f, 0.6413f),
            new G1DragModel(1.7f, 0.6347f),
            new G1DragModel(1.75f, 0.628f),
            new G1DragModel(1.8f, 0.621f),
            new G1DragModel(1.85f, 0.6141f),
            new G1DragModel(1.9f, 0.6072f),
            new G1DragModel(1.95f, 0.6003f),
            new G1DragModel(2f, 0.5934f),
            new G1DragModel(2.05f, 0.5867f),
            new G1DragModel(2.1f, 0.5804f),
            new G1DragModel(2.15f, 0.5743f),
            new G1DragModel(2.2f, 0.5685f),
            new G1DragModel(2.25f, 0.563f),
            new G1DragModel(2.3f, 0.5577f),
            new G1DragModel(2.35f, 0.5527f),
            new G1DragModel(2.4f, 0.5481f),
            new G1DragModel(2.45f, 0.5438f),
            new G1DragModel(2.5f, 0.5397f),
            new G1DragModel(2.6f, 0.5325f),
            new G1DragModel(2.7f, 0.5264f),
            new G1DragModel(2.8f, 0.5211f),
            new G1DragModel(2.9f, 0.5168f),
            new G1DragModel(3f, 0.5133f),
            new G1DragModel(3.1f, 0.5105f),
            new G1DragModel(3.2f, 0.5084f),
            new G1DragModel(3.3f, 0.5067f),
            new G1DragModel(3.4f, 0.5054f),
            new G1DragModel(3.5f, 0.504f),
            new G1DragModel(3.6f, 0.503f),
            new G1DragModel(3.7f, 0.5022f),
            new G1DragModel(3.8f, 0.5016f),
            new G1DragModel(3.9f, 0.501f),
            new G1DragModel(4f, 0.5006f),
            new G1DragModel(4.2f, 0.4998f),
            new G1DragModel(4.4f, 0.4995f),
            new G1DragModel(4.6f, 0.4992f),
            new G1DragModel(4.8f, 0.499f),
            new G1DragModel(5f, 0.4988f)
        };

        public static float CalculateDragCoefficient(float velocity)
        {
            int num = (int)Math.Floor(velocity / 343f / 0.05f);

            if (num <= 0)
            {
                return 0f;
            }

            if (num > G1Coefficents.Count - 1)
            {
                return G1Coefficents.Last().Ballist;
            }

            float num2 = G1Coefficents[num - 1].Mach * 343f;
            float num3 = G1Coefficents[num].Mach * 343f;
            float ballist = G1Coefficents[num - 1].Ballist;

            return (G1Coefficents[num].Ballist - ballist) / (num3 - num2) * (velocity - num2) + ballist;
        }

        //? Not Sure if this should stay here or become a part of BulletRangeTableData -- No it will stay here because it needs the constsants of this class
        public static SortedList<int, (float damageAtDistance, float penetrationAtDistance, float speedAtDistance)> GetBulletStatsTupleAtIntervals(int[] intervals, BallisticStatsCard bulletStats)
        {
            // Results storage
            SortedList<int, (float damageAtDistance, float penetrationAtDistance, float speedAtDistance)> newbulletRangeTable = new();

            // Perform calculations based on the bullet properties
            float BW1 = bulletStats.massGrams * 2f;
            float BDW1 = bulletStats.massGrams * 0.0014223f / (bulletStats.diameterMillimeters * bulletStats.diameterMillimeters * bulletStats.ballisticCoefficient);
            float BDW2 = bulletStats.diameterMillimeters * bulletStats.diameterMillimeters * 3.1415927f / 4f;
            float BDW3 = 1.2f * BDW2;

            // Working vars
            float lastDist = 0;
            float lastVel = bulletStats.initialSpeed;

            int intervalsIndex = 0;

            for (int i = 1; i < _maxIterations; i++)
            {
                // Calc drag
                float dragCoef = CalculateDragCoefficient(lastVel) * BDW1;

                // Create offset
                float offset = BDW3 * -dragCoef * lastVel * lastVel / BW1;

                // Set current distance
                float currDist = lastDist + lastVel * _simTimeStep + 5e-05f * offset;
                float currVel = lastVel + offset * _simTimeStep;

                // Is it the first point the bullet goes over an inverval value?
                if (currDist >= intervals[intervalsIndex])
                {
                    var damageAndPen = GetDamageAndPenetrationAtSpeed(currVel, bulletStats.initialSpeed, bulletStats.damage, bulletStats.penetration);
                    newbulletRangeTable.Add(intervals[intervalsIndex], (damageAndPen.finalDamage, damageAndPen.finalPenetration, currVel));

                    intervalsIndex++;
                    lastDist = currDist;
                    lastVel = currVel;
                }
                // If not, update and continue.
                else
                {
                    lastDist = currDist;
                    lastVel = currVel;
                }
                // If we exhaust our desired intervals, break loop
                if(intervalsIndex == intervals.Length)
                {
                    i = _maxIterations + 1;
                }
            }

            return newbulletRangeTable;
        }

        public static float GetBulletSpeedAtDistance(float shotDistance, float BulletMassGrams, float BulletDiameterMillimeters, float BallisticCoefficient, float BulletSpeed)
        {
            // Perform calculations based on the bullet properties
            float BW1 = BulletMassGrams * 2f;
            float BDW1 = BulletMassGrams * 0.0014223f / (BulletDiameterMillimeters * BulletDiameterMillimeters * BallisticCoefficient);
            float BDW2 = BulletDiameterMillimeters * BulletDiameterMillimeters * 3.1415927f / 4f;
            float BDW3 = 1.2f * BDW2;

            // Working vars
            float lastDist = 0;
            float lastVel = BulletSpeed;
            float currVel = 0;

            for (int i = 1; i < _maxIterations; i++)
            {
                // Calc drag
                float dragCoef = CalculateDragCoefficient(lastVel) * BDW1;

                // Create offset
                float offset = BDW3 * -dragCoef * lastVel * lastVel / BW1;

                // Set current distance
                float currDist = lastDist + lastVel * _simTimeStep + 5e-05f * offset;
                currVel = lastVel + offset * _simTimeStep;

                if (currDist >= shotDistance)
                {
                    break;
                }
                else
                {
                    lastDist = currDist;
                    lastVel = currVel;
                }
            }

            return currVel;
        }

        public static (float finalDamage, float finalPenetration) GetDamageAndPenetrationAtSpeed(float instantaneousSpeed, float initialSpeed, float initialDamage, float initialPenetration)
        {
            float ratio = Math.Clamp(instantaneousSpeed / initialSpeed, 0, 1);
            float changeFactor = ratio + (1f - ratio) * Math.Clamp(.5f, 0, 1);

            float finalDamage = initialDamage * changeFactor;
            float finalPenetration = initialPenetration * changeFactor;

            return (finalDamage, finalPenetration);
        }

        public static (float finalDamage, float finalPenetration) GetDamageAndPenetrationAtDistance(float distance, Ammo ammo)
        {
            var speed = GetBulletSpeedAtDistance((float)distance, ammo.BulletMass, ammo.BulletDiameterMillimeters, ammo.BallisticCoeficient, ammo.InitialSpeed);
            return GetDamageAndPenetrationAtSpeed(speed, ammo.InitialSpeed, ammo.Damage, ammo.PenetrationPower);
        }

        public static void GenerateSpeedAndDistanceLookupTables(int[] distanceIntervals, List<Ammo> ammoList)
        {
            /*
             * This method will take the distanceIntervals array, and a list of Ammo.
             * It will check if there is a locally made copy of a saved JSON of output values.
             * If there isn't, it will calculate the distance values for the ammo by the intervals provided.
             * These tuple results will be saved and keyed so they can be looked up later in a JSON and we can save a significant amount of calculation time when wishgranter initializses.
             * Will most likely need to include a magic number for the "version" of this json so that it can be invalidated and updated as needed.
             * Idea: perhaps each key can have the base stats of the ammo type, and when these values change an update is triggered for that row only. Would also remove the need to manually set versioning and would speed up updates.
             *  Should include the damage, penetration and speed at a given distance.
             *  
             *  DPS @ Dist lookup table > ammo effectiveness tables for distance > other tables
             */

            foreach(Ammo ammo in ammoList)
            {

            }


        }


    }
}

