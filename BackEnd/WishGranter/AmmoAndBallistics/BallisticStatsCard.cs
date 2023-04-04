using RatStash;

namespace WishGranter
{
    public class BallisticStatsCard
    {
        //! Properties
        public int initialSpeed { get; set; } = -1;
        public int penetration { get; set; } = -1;
        public int armorDamagePerc { get; set; } = -1;
        public int damage { get; set; } = -1;
        public float massGrams { get; set; } = -1;
        public float diameterMillimeters { get; set; } = -1;
        public float ballisticCoefficient { get; set; } = -1;

        //! Default Con
        public BallisticStatsCard() { }

        //! Parameter Con
        public BallisticStatsCard(Ammo ammo)
        {
            initialSpeed = ammo.InitialSpeed;
            penetration = ammo.PenetrationPower;
            armorDamagePerc = ammo.ArmorDamage;
            damage = ammo.Damage;
            massGrams = ammo.BulletMass;
            diameterMillimeters = ammo.BulletDiameterMillimeters;
            ballisticCoefficient = ammo.BallisticCoeficient;
        }
    }
}

