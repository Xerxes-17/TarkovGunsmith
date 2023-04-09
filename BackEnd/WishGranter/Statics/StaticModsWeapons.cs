using RatStash;

namespace WishGranter.Statics
{
    // Decided to combine these two categories into one as Mods are only relevant to Weapons, possibly going to add presets too?
    public static class StaticModsWeapons
    {
        public static List<Weapon> CleanedWeapons = ConstructCleanedWeaponList();
        public static List<WeaponMod> CleanedMods = ConstructCleanedWeaponModList();

        private static List<Weapon> ConstructCleanedWeaponList()
        {
            List<Weapon> result = StaticRatStash.DB.GetItems(x => x is Weapon && x is not GrenadeLauncher).Cast<Weapon>().ToList();

            result.RemoveAll(x => x.Id.Equals("5cdeb229d7f00c000e7ce174")); // NSV
            result.RemoveAll(x => x.Id.Equals("5d52cc5ba4b9367408500062")); // AGS
            result.RemoveAll(x => x.Id.Equals("5ae083b25acfc4001a5fc702")); // MasterHand

            // Making the base sort to be by name will make looking for things at other times in debug nicer.
            result = result.OrderBy(x => x.Name).ToList();

            // Debug print
            //foreach (var weapon in result)
            //{
            //    Console.WriteLine($"{weapon.Name}, {weapon.Id}");
            //}

            return result;
        }
        private static List<WeaponMod> ConstructCleanedWeaponModList()
        {
            List<WeaponMod> result = StaticRatStash.DB.GetItems(x => x is WeaponMod).Cast<WeaponMod>().ToList();

            // Setup the filters for things that I don't think are relevant, but we also remove the Mounts so they can be added in clean later
            List<Type> ModsFilter = new List<Type>() {
                typeof(IronSight), typeof(CompactCollimator), typeof(Collimator),
                typeof(OpticScope), typeof(NightVision), typeof(ThermalVision),
                typeof(AssaultScope), typeof(SpecialScope), typeof(Magazine),
                typeof(CombTactDevice), typeof(Flashlight), typeof(LaserDesignator),
                typeof(Mount), typeof(Launcher)};

            // Apply that filter
            var temp = result.Where(mod => !ModsFilter.Contains(mod.GetType())).ToList();

            // Get the mounts from AllMods into a list, filter it to be only the mounts we want (for foregrips) and add them back to FilteredMods
            IEnumerable<Mount> Mounts = result.OfType<Mount>();
            var MountsFiltered = Mounts.Where(mod => mod.Slots.Any(slot => slot.Name == "mod_foregrip")).ToArray();
            temp.AddRange(MountsFiltered);

            // Magwells for G36 which are "mounts"
            var magwell_1 = result.Find(x => x.Id.Equals("622f02437762f55aaa68ac85"));
            if (magwell_1 != null)
            {
                temp.Add(magwell_1);
            }
            var magwell_2 = result.Find(x => x.Id.Equals("622f039199f4ea1a4d6c9a17"));
            if (magwell_2 != null)
            {
                temp.Add(magwell_2);
            }

            // Fuck the Goliaf, it's not as good as the B-11 and I can't be arsed writing EnahncedLogic to deal with it.
            var goliaf = temp.Find(x => x.Id.Equals("5d15ce51d7ad1a1eff619092"));
            if (goliaf.Id.Equals("5d15ce51d7ad1a1eff619092"))
            {
                temp.Remove(goliaf);
            }

            // Need to add in the AUG A1 scope as it is a receiver too
            var AUG_A1_Scope = result.Find(x => x.Id.Equals("62ea7c793043d74a0306e19f"));
            if (AUG_A1_Scope != null)
            {
                temp.Add(AUG_A1_Scope);
            }

            // Need to add in the SVDS UB as it is a "mount"
            var SVDS_UB = result.Find(x => x.Id.Equals("5c471c2d2e22164bef5d077f"));
            if (SVDS_UB != null)
            {
                temp.Add(SVDS_UB);
            }

            return result;
        }

        public static List<WeaponMod> GetListWithQuietMuzzles()
        {
            //Get out list from Cleaned mods, remove all of the Muzzle devices
            List<WeaponMod> list = CleanedMods;
            list = list.Where(x => x is not MuzzleDevice).ToList();

            // Get all the silencers, and their IDs
            var silencers = CleanedMods.Where(x => x is Silencer).ToList();
            var SilencerIds = silencers.Select(x => x.Id).ToList();

            // Get all of the flash hiders and compensators, then filter them by if they have a compatibility with a silencer.
            var otherMuzzleDevices = CleanedMods.Where(x => x is Flashhider || x is CombMuzzleDevice).ToList();
            otherMuzzleDevices = otherMuzzleDevices.Where(x =>
                    x.Slots.Any(s=>s.Filters[0].Whitelist.Intersect(SilencerIds).Any())
                ).ToList();

            // Add the silencers and their compatible mounts back to the list
            list = otherMuzzleDevices.Union(silencers).ToList();
            //? Need to check if muzzle devices like the AUG flash hiders are included here.


            list.OrderBy(x => x.Name);

            // Debug print
            foreach (var item in otherMuzzleDevices.Union(silencers))
            {
                Console.WriteLine($"{item.Name}, {item.Id}");
            }

            return list;
        }

        public static List<WeaponMod> GetListWithLoudMuzzles()
        {
            List<WeaponMod> list = CleanedMods;

            list.RemoveAll(x => x is Silencer);

            // Debug print
            foreach (var item in list.Where(x=>x is MuzzleDevice))
            {
                Console.WriteLine($"{item.Name}, {item.Id}");
            }

            return list;
        }
    }
}
