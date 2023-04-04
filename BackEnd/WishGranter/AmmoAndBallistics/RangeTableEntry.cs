using RatStash;
using WishGranterProto.ExtensionMethods;

namespace WishGranter
{
    public class RangeTableEntry
    {
        //! Properties
        public float speed { get; set; } = -1;
        public float penetration { get; set; } = -1;
        public float damage { get; set; } = -1;
        public List<string> ratings { get; set; } = new();

        //! Default Con
        public RangeTableEntry() { }

        //! Parameter Con
        public RangeTableEntry(float _speed, float _penetration, float _damage)
        {
            speed = _speed;
            penetration = _penetration;
            damage = _damage;
        }
        public void updateRatings(Ammo round)
        {
            // get the AED for the round at this distance 
            var effectivenessData = WG_DataScience.CalculateAmmoEffectivenessForRTE(round, RatStashSingleton.Instance.DB(), penetration, damage);

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

            List<string> temp_ratings = new List<string>();

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

                temp_ratings.Add(resultString);
            }
            ratings = temp_ratings;
        }
    }
}

