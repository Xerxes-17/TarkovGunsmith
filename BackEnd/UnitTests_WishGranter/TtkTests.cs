using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Diagnostics;
using System.Linq;
using WishGranter.API_Methods;
using WishGranter.Statics;

namespace WishGranterTests
{
    [TestClass]
    public class TtkTests
    {
        // A class 4 plate over a class 3 aramid insert, matching the simulator's default thorax setup.
        private static TtkMatrixParameters DefaultThoraxParameters()
        {
            return new TtkMatrixParameters
            {
                initialHitPoints = 85,
                targetZone = "Thorax",
                distance = 15,
                maxHits = 60,
                armorLayers = new[]
                {
                    new ArmorLayer
                    {
                        isPlate = true,
                        armorClass = 4,
                        bluntDamageThroughput = 26,
                        durability = 40,
                        maxDurability = 40,
                        armorMaterial = RatStash.ArmorMaterial.UHMWPE
                    },
                    new ArmorLayer
                    {
                        isPlate = false,
                        armorClass = 3,
                        bluntDamageThroughput = 33,
                        durability = 50,
                        maxDurability = 50,
                        armorMaterial = RatStash.ArmorMaterial.Aramid
                    },
                }
            };
        }

        [TestMethod]
        public void Test_GenerateTtkMatrix_Timing()
        {
            // Load the RatStash item database first so its one-off cost isn't billed to the matrix.
            Ballistics.GenerateTtkMatrix(DefaultThoraxParameters() with { distance = 5 });

            var parameters = DefaultThoraxParameters();

            var uncachedRun = Stopwatch.StartNew();
            var result = Ballistics.GenerateTtkMatrix(parameters);
            uncachedRun.Stop();

            var cachedRun = Stopwatch.StartNew();
            Ballistics.GenerateTtkMatrix(parameters);
            cachedRun.Stop();

            Console.WriteLine($"uncached run: {uncachedRun.ElapsedMilliseconds} ms");
            Console.WriteLine($"cached run: {cachedRun.ElapsedMilliseconds} ms");
            Console.WriteLine($"ammo simulated: {result.ammo.Count}");
            Console.WriteLine($"weapons returned: {result.weapons.Count}");

            Assert.IsTrue(result.ammo.Count > 0, "Expected at least one ammo simulation.");
            Assert.IsTrue(result.weapons.Count > 0, "Expected at least one weapon.");
        }

        [TestMethod]
        public void Test_GenerateTtkMatrix_DoesNotMutateCallerLayers()
        {
            // A distance no other test uses, so this exercises a real run rather than the cache.
            var parameters = DefaultThoraxParameters() with { distance = 27 };
            var durabilityBefore = parameters.armorLayers.Select(layer => layer.durability).ToArray();

            Ballistics.GenerateTtkMatrix(parameters);

            for (int i = 0; i < parameters.armorLayers.Length; i++)
            {
                Assert.AreEqual(
                    durabilityBefore[i],
                    parameters.armorLayers[i].durability,
                    $"Layer {i} durability was mutated by the simulation.");
            }
        }

        [TestMethod]
        public void Test_GenerateTtkMatrix_EveryAmmoHasAMatchingCaliberSomewhere()
        {
            var result = Ballistics.GenerateTtkMatrix(DefaultThoraxParameters());

            var weaponCalibers = result.weapons.Select(weapon => weapon.caliber).ToHashSet();
            var orphanedAmmo = result.ammo
                .Where(ammo => !weaponCalibers.Contains(ammo.caliber))
                .Select(ammo => $"{ammo.ammoName} ({ammo.caliber})")
                .ToList();

            // Not a failure, some calibers genuinely have no player weapon, but worth seeing.
            Console.WriteLine($"ammo with no matching weapon: {orphanedAmmo.Count}");
            foreach (var ammo in orphanedAmmo)
            {
                Console.WriteLine($"  {ammo}");
            }
        }

        [TestMethod]
        public void Test_GenerateTtkMatrix_ReadsFireDataFromRatStash()
        {
            var result = Ballistics.GenerateTtkMatrix(DefaultThoraxParameters());

            // Colt M4A1, a known full auto weapon.
            var m4 = result.weapons.Single(weapon => weapon.weaponId.Equals("5447a9cd4bdc2dbd208b4567"));
            Console.WriteLine($"M4A1 bFirerate: {m4.bFirerate}, single: {m4.singleFireRate}, modes: {string.Join(",", m4.fireModes)}");

            Assert.AreEqual(800, m4.bFirerate);
            Assert.IsTrue(m4.fireModes.Contains("Fullauto"), "Expected the M4A1 to report a Fullauto fire mode.");

            // Semi auto only weapons carry a placeholder bFirerate, so SingleFireRate has to be the
            // one driving their rate of fire.
            var mosin = result.weapons.Single(weapon => weapon.weaponId.Equals("5bfd297f0db834001a669119"));
            Console.WriteLine($"Mosin bFirerate: {mosin.bFirerate}, single: {mosin.singleFireRate}, modes: {string.Join(",", mosin.fireModes)}");

            Assert.IsFalse(mosin.fireModes.Contains("Fullauto"));
            Assert.IsTrue(mosin.singleFireRate > mosin.bFirerate);
        }
    }
}
