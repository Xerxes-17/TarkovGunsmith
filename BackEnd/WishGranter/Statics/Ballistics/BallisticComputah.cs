using Private_Ballistic_Engine;
using RatStash;

namespace WishGranter.Statics
{
    public class BallisticComputah
    {
        public record struct BallisticComputahInput
        (
            BallisticSimInput defaultAmmoInput,
            BallisticSimInput secondAmmoInput,
            List<int> calibrationDistances
        );

        public static BallisticSimOutput Simulate(Ammo ammo, int maxDistance = 200, float velocityModifier = 0)
        {
            var veloMod = (100 + velocityModifier) / 100;

            BallisticSimInput input = new BallisticSimInput
            {
                AmmoId = ammo.Id,
                BulletMass = ammo.BulletMass,
                BulletDiameterMillimeters = ammo.BulletDiameterMillimeters,
                BallisticCoeficient = ammo.BallisticCoeficient,
                InitialSpeed = ammo.InitialSpeed * veloMod,
                MaxDistance = maxDistance,
                Damage = ammo.Damage,
                Penetration = ammo.PenetrationPower,
            };

            return BallisticSimulation.Simulate(input);
        }

        public static BallisticSimOutput Simulate(BallisticSimInput input, float velocityModifier = 0)
        {
            var veloMod = (100 + velocityModifier) / 100;

            input.InitialSpeed *= veloMod;

            return BallisticSimulation.Simulate(input);
        }

        public static List<SimulationToCalibrationDistancePair> CreateDropTable(BallisticComputahInput input)
        {
            return BallisticSimulation.CreateCalibratedDropTableForAmmo(input.defaultAmmoInput, input.secondAmmoInput, input.calibrationDistances);
        }
    }
}
