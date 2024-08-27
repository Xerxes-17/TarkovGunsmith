using Private_Ballistic_Engine;
using RatStash;
using System.Collections.Generic;
using System.Linq;

namespace WishGranter.Statics
{
    public static class DopeTable
    {
        public static DopeTableUI_Options dopeTableOptions = constructDopeOptions();

        public record struct DopeTableUI_Options
        (
            List<DopeTableUI_Caliber> Calibers,
            List<int> CalibrationRanges,
            int MaxMaxDistance
        );

        public static DopeTableUI_Options constructDopeOptions()
        {
            return new DopeTableUI_Options()
            {
                Calibers = ConstructDopeCalibers(),
                CalibrationRanges = new List<int>() { 25, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450 },
                MaxMaxDistance = 1600
            };
        }

        public record struct DopeTableUI_Caliber
        (
            string CaliberName,
            List<DopeTableUI_Ammo> AllAmmosOfCaliber,
            List<DopeTableUI_Weapon> WeaponsOfCaliber
        );

        public static List<DopeTableUI_Caliber> ConstructDopeCalibers()
        {
            // Get weapons grouped by caliber into a dict
            var weaponsGroupedByCaliber = ModsWeaponsPresets.CleanedWeapons.GroupBy(x => x.AmmoCaliber).ToDictionary(
                    group => group.Key,
                    group => group
                );
            // Make a set of caliber keys from that dict
            var caliberKeys = weaponsGroupedByCaliber.Keys.ToList();

            List<DopeTableUI_Caliber> dopeCalibers = new List<DopeTableUI_Caliber>();

            foreach (var key in caliberKeys)
            {
                if (key.Equals("Caliber20x1mm"))
                {
                    continue;
                }
                if (key.Equals("Caliber40x46"))
                {
                    continue;
                }
                var isPMM = key.Equals("Caliber9x18PMM");

                var AllAmmosOfCaliberIds = Ammos.Cleaned.Where(ammo => ammo.Caliber.Equals(isPMM ? "Caliber9x18PM" : key)).Select(x=> x.Id).ToList();
                var WeaponsOfCaliberIds = weaponsGroupedByCaliber[key].Select(weapon => weapon.Id).ToList();

                var allAmmosOfCaliber = ConstructDopeAmmosByIds(AllAmmosOfCaliberIds);
                var weaponsOfCaliber = ConstructDopeWeaponsByIds(WeaponsOfCaliberIds);

                var dopeCaliber = new DopeTableUI_Caliber() 
                { 
                    CaliberName = key,
                    AllAmmosOfCaliber = allAmmosOfCaliber,
                    WeaponsOfCaliber = weaponsOfCaliber,
                };

                dopeCalibers.Add(dopeCaliber);
            }
            return dopeCalibers;
        }

        public record struct DopeTableUI_Ammo
        (
            string AmmoLabel,
            DopeTableUI_AmmoStats Stats
        );

        public record struct DopeTableUI_AmmoStats
        (
            string Id,
            string Name,
            int InitialSpeed,
            float BallisticCoefficient,
            float BulletDiameterMillimeters,
            float BulletMass,
            int Penetration,
            int Damage
        );
        private static List<DopeTableUI_Ammo> ConstructDopeAmmosByIds(List<string> ids)
        {
            List<Ammo> ratStashAmmos = Ammos.Cleaned.Where(x => ids.Contains(x.Id)).ToList();

            List<DopeTableUI_Ammo> dopeAmmos = new List<DopeTableUI_Ammo>();
            foreach (Ammo ammo in ratStashAmmos)
            {
                var dopeStats = new DopeTableUI_AmmoStats()
                {
                    Id = ammo.Id,
                    Name = ammo.Name,
                    InitialSpeed = ammo.InitialSpeed,
                    BallisticCoefficient = ammo.BallisticCoeficient,
                    BulletDiameterMillimeters = ammo.BulletDiameterMillimeters,
                    BulletMass = ammo.BulletMass,
                    Penetration = ammo.PenetrationPower,
                    Damage = ammo.Damage,
                };

                var dopeAmmo = new DopeTableUI_Ammo() { AmmoLabel = ammo.ShortName, Stats = dopeStats };

                dopeAmmos.Add(dopeAmmo);
            }
            return dopeAmmos;
        }

        public record struct DopeTableUI_Weapon
        (
            string Id,
            string ShortName,
            float VelocityModifier,
            DopeTableUI_Ammo DefaultAmmo,
            List<DopeTableUI_Barrel> PossibleBarrels
        );

        private static HashSet<string> GetWeaponModsRecursively(string id)
        {
            HashSet<string> newIds = new HashSet<string>
            {
                id
            };
            var next = StaticRatStash.DB.GetItem(id) as CompoundItem;
            if (next != null)
            {
                foreach (var slot in next.Slots)
                {
                    foreach (var whiteId in slot.Filters[0].Whitelist)
                    {
                        var nextSet = GetWeaponModsRecursively(whiteId);
                        newIds = newIds.Union(nextSet).ToHashSet();
                    }
                }
            }
            return newIds;
        }

        private static List<DopeTableUI_Weapon> ConstructDopeWeaponsByIds(List<string> ids)
        {
            List<Weapon> ratStashWeapons = ModsWeaponsPresets.CleanedWeapons.Where(x => ids.Contains(x.Id)).ToList();

            List<DopeTableUI_Weapon> dopeWeapons = new List<DopeTableUI_Weapon>();
            foreach (Weapon weapon in ratStashWeapons)
            {
                if (weapon.Id.Equals("618428466ef05c2ce828f218"))
                {
                    continue; // skip the FDE Mk 16 so we don't have a meaningless duplicate
                }
                if (weapon.Id.Equals("6165ac306ef05c2ce828ef74"))
                {
                    continue; // skip the FDE Mk 17 so we don't have a meaningless duplicate
                }
                if (weapon.Id.Equals("5d67abc1a4b93614ec50137f"))
                {
                    continue; // skip the FDE 5-7 so we don't have a meaningless duplicate
                }
                if (weapon.Id.Equals("661cec09b2c6356b4d0c7a36"))
                {
                    continue; // skip the FDE M60E6 so we don't have a meaningless duplicate
                }
                if (weapon.Id.Equals("5b3b713c5acfc4330140bd8d"))
                {
                    continue; // skip the Gold TT so we don't have a meaningless duplicate
                }

                var ratStashAmmo = StaticRatStash.DB.GetItem(weapon.DefAmmo) as Ammo;

                var dopeDefAmmo = new DopeTableUI_Ammo()
                {
                    AmmoLabel = ratStashAmmo.ShortName ?? "ERRNOENT: DefAmmo in RS",
                    Stats = new DopeTableUI_AmmoStats()
                    {
                        Id = weapon.DefAmmo,
                        Name = ratStashAmmo.Name ?? "ERR",
                        InitialSpeed = ratStashAmmo?.InitialSpeed ??  -1,
                        BallisticCoefficient = ratStashAmmo?.BallisticCoeficient ?? -1,
                        BulletDiameterMillimeters = ratStashAmmo?.BulletDiameterMillimeters ?? -1,
                        BulletMass = ratStashAmmo?.BulletMass ?? -1,
                        Penetration = ratStashAmmo?.PenetrationPower ?? -1,
                        Damage = ratStashAmmo?.Damage ?? -1,
                    }
                };

                var dopeWeapon = new DopeTableUI_Weapon()
                {
                    Id = weapon.Id,
                    ShortName = weapon.ShortName,
                    DefaultAmmo = dopeDefAmmo,
                    VelocityModifier = weapon.Velocity,
                    PossibleBarrels = ConstructDopeBarrelsById(weapon.Id),
                };

                dopeWeapons.Add(dopeWeapon);
            }
            return dopeWeapons;
        }

        public record struct DopeTableUI_Barrel
        (
            string Id,
            string ShortName,
            float VelocityModifier
        );

        private static List<DopeTableUI_Barrel> ConstructDopeBarrelsById(string id)
        {
            var itemIds = GetWeaponModsRecursively(id).ToList();
            var items = StaticRatStash.DB.GetItems().Where(x => itemIds.Contains(x.Id));
            var barrels = items.Where(x => x is Barrel).ToList();

            List<DopeTableUI_Barrel> dopeBarrels = new List<DopeTableUI_Barrel>();
            foreach (Barrel barrel in barrels)
            {
                var dopeBarrel = new DopeTableUI_Barrel()
                {
                    Id = barrel.Id,
                    ShortName = barrel.Id.Equals("5d2703038abbc3105103d94c") ? barrel.ShortName+" stainless steel" : barrel.ShortName,
                    VelocityModifier = barrel.Velocity
                };
                dopeBarrels.Add(dopeBarrel);
            };
            return dopeBarrels;
        }



        public record struct DopeTableInput
        (
            BallisticSimInput input,
            int maxDistance,
            float velocityModifier
        );

    }
}
