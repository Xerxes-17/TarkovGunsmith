using KellermanSoftware.CompareNetObjects;
using RatStash;

namespace WishGranter
{
    public class AmmoReccord
    {
        //! Properties
        public Ammo details { get; set; } = new();
        public int traderLevel { get; set; }  = 0;
        public BallisticStatsCard ballisticStats { get; set; } = new();
        public int[] rangeIntervals { get; set; }  = Array.Empty<int>();
        
        public SortedList<int, RangeTableEntry> rangeTable { get; set; } = new();

        //! Default Con
        public AmmoReccord() { }

        //! Parameter Con
        public AmmoReccord(Ammo ammo)
        {
            this.details = ammo;
            this.ballisticStats = new(ammo);
            InitializeRangeIntervals();
            UpdateRangeTable();
        }

        private void InitializeRangeIntervals()
        {
            if (details.Name.Contains("flechette") || details.Name.Contains("buckshot"))
            {
                int[] temp = { 1, 10, 25, 50 };
                rangeIntervals = temp;
            }
            // Slugs and pistols
            else if (
                details.Name.Contains("slug") ||
                details.Name.Contains("12/70 RIP") ||
                details.Name.Contains(".45 ACP") ||
                details.Name.Contains("9x21mm") ||
                details.Name.Contains("12/70 RIP") ||
                details.Name.Contains("9x1") ||
                details.Name.Contains("5.7x28") ||
                details.Name.Contains("4.6x30") ||
                details.Name.Contains("9x21mm") ||
                details.Name.Contains("7.62x25") ||
                details.Name.Contains(".357"))
            {
                int[] temp = { 1, 10, 25, 50, 75, 100 };
                rangeIntervals = temp;
            }
            // Intermediate rouunds
            else if (
                details.Name.Contains("x39mm") ||
                details.Name.Contains("5.56x45mm") ||
                details.Name.Contains(".300") ||
                details.Name.Contains("12.7x55mm")
                )
            {
                int[] temp = { 1, 10, 25, 50, 75, 100, 110, 125, 150, 200 };
                rangeIntervals = temp;
            }

            else
            {
                int[] temp = { 1, 10, 25, 50, 75, 100, 110, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600 };
                rangeIntervals = temp;
            }
        }
        private void UpdateRangeTable()
        {
            // First create the RTE in tuple-List form.
            var temp = WG_Ballistics.GetBulletStatsTupleAtIntervals(rangeIntervals, ballisticStats); // GetBulletStatsTupleAtIntervals is in WG_Ballistics becuase it has a number of constants the function needs
            rangeTable.Clear();

            foreach (var tuple in temp)
            {
                rangeTable.Add(tuple.Key, new RangeTableEntry(tuple.Value.speedAtDistance, tuple.Value.penetrationAtDistance, tuple.Value.damageAtDistance));
            }
            foreach(var entry in rangeTable)
            {
                entry.Value.updateRatings(details);
            }
        }

        public bool UpdateAmmoReccord(Ammo newAmmo)
        {
            CompareLogic compareLogic = new CompareLogic();

            BallisticStatsCard newBallisticStats = new(newAmmo);
            ComparisonResult comparision = compareLogic.Compare(details, newAmmo);
            //Is there a change?
            if (!comparision.AreEqual)
            {
                ComparisonResult comparisionBallisticStats = compareLogic.Compare(ballisticStats, newBallisticStats);

                // Is it a change to other stats, or the ballistic stats?
                if (!comparisionBallisticStats.AreEqual)
                {
                    ballisticStats = newBallisticStats;
                    UpdateRangeTable();
                }
                // If no changes to the ballistic stats, we can just update the details and leave the table data alone.
                else
                {
                    details = newAmmo;
                }
                // Return that a change was made
                return true;
            }
            // Return that no change was made.
            return false;
        }
    }
}

