using RatStash;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Reflection;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Compilation
    {

        public static List<J_CashOffer> MakeListOfCashOffers(JObject TraderOffersJSON)
        {
            var list = new List<J_CashOffer>();

            string searchJSONpath = "$.data.traders.[*].levels.[*].cashOffers.[*]";
            List<JToken> shortList = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();

            foreach (JToken item in shortList)
            {
                J_CashOffer j_CashOffer = JsonConvert.DeserializeObject<J_CashOffer>(item.ToString());
                list.Add(j_CashOffer);
            }

            return list;
        }

        public static List<Weapon> RemoveByChoiceWeapons(List<Weapon> WeaponsList, List<string> IdsList)
        {
            return (WeaponsList.FindAll(x => !IdsList.Contains(x.Id)));
        }
        public static List<WeaponMod> RemoveByChoiceMods(List<WeaponMod> ModList, List<string> IdsList)
        {
            return (ModList.FindAll(x => !IdsList.Contains(x.Id)));
        }
        public static List<Ammo> RemoveByChoiceAmmo(List<Ammo> AmmoList, List<string> IdsList)
        {
            return (AmmoList.FindAll(x => !IdsList.Contains(x.Id)));
        }
        public static (List<Weapon> Selected_Weapons, List<WeaponMod> Selected_Mods, List<Ammo> Selected_Ammo) RemoveByChoiceAny(List<string> FilterIds, List<Weapon> inputWeapons, List<WeaponMod> inputMods, List<Ammo> inputAmmo)
        {
            return 
                (
                    RemoveByChoiceWeapons(inputWeapons,FilterIds), RemoveByChoiceMods(inputMods,FilterIds), RemoveByChoiceAmmo(inputAmmo,FilterIds)
                );
        }


        // Returns a list of Ratstash Weapons which have been given thier default preset attachments.
        public static List<Weapon> CompileDefaultPresets(JObject DefaultPresetsJSON, List<Weapon> All_Weapons, List<WeaponMod> All_Mods)
        {
            // First make a dictionary of the DWPs, this will be used to store thier ID strings key is Weapon ID, value is list of attached mods
            Dictionary<string, List<string>> DefaultWeaponPresets = new();

            // Getting all the items from the JObject
            var weaponIDs =
                from c in DefaultPresetsJSON["data"]["items"].Distinct()
                select (string)c["id"];

            // Selecting from all of the weapons thier attached mod ids
            foreach (var id in weaponIDs)
            {
                string JsonPathSearch = $"$.data.items.[?(@.id=='{id}')]..item.id";
                var result = DefaultPresetsJSON.SelectTokens(JsonPathSearch).ToList();

                List<string> containedIDs = new();
                foreach (var item in result) { containedIDs.Add(item.ToString()); }

                DefaultWeaponPresets.Add(id, containedIDs);
            }

            // Getting a list of weapons from the master
            List<Weapon> Stock_Weapons = All_Weapons.OfType<Weapon>().ToList();

            // Compiling the stock preset weapons into RatStash form
            //TODO Need to replace the MysteriousCloner with the DeepClone functionality.
            foreach (var pair in DefaultWeaponPresets)
            {
                Weapon temp = Stock_Weapons.FirstOrDefault(x => x.Id == pair.Key);

                if(temp != null)
                {
                    temp = MysteriousCloner(Stock_Weapons.FirstOrDefault(x => x.Id == pair.Key));
                }

                if (temp != null)
                {
                    temp = WG_Recursion.AddDefaultAttachments(temp, pair.Value, All_Mods);

                    Console.WriteLine($"{temp.ShortName} Stock Preset has been processed");

                    int index = Stock_Weapons.FindIndex(x => x.Id == temp.Id);
                    Stock_Weapons.RemoveAt(index);
                    Stock_Weapons.Add(temp);
                }
            }
            return Stock_Weapons;
        }

        public static List<Item> CompileFilteredModList(List<Item> All_Mods, int muzzleMode)
        {
            // Setup the filters for things that I don't think are relevant, but we also remove the Mounts so they can be added in clean later
            List<Type> ModsFilter = new List<Type>() {
                typeof(IronSight), typeof(CompactCollimator), typeof(Collimator),
                typeof(OpticScope), typeof(NightVision), typeof(ThermalVision),
                typeof(AssaultScope), typeof(SpecialScope), typeof(Magazine),
                typeof(CombTactDevice), typeof(Flashlight), typeof(LaserDesignator),
                typeof(Mount)};

            // Muzzle mode 1 = loud, 2 = silencers, 3 = any
            if (muzzleMode == 1)
                ModsFilter.Add(typeof(Silencer));
            else if (muzzleMode == 2)
            {
                //Some silencers are combined devices you dummy
                //ModsFilter.Add(typeof(CombMuzzleDevice)); 

                ModsFilter.Add(typeof(Compensator));
                ModsFilter.Add(typeof(Flashhider));
                ModsFilter.Add(typeof(Pms)); //wtf is a pms?
            }

            // Apply that filter
            var temp = All_Mods.Where(mod => !ModsFilter.Contains(mod.GetType())).ToList();

            // Get the mounts from AllMods into a list, filter it to be only the mounts we want (for foregrips) and add them back to FilteredMods
            IEnumerable<Mount> Mounts = All_Mods.OfType<Mount>();
            var MountsFiltered = Mounts.Where(mod => mod.Slots.Any(slot => slot.Name == "mod_foregrip")).Cast<Item>().ToArray();
            temp.AddRange(MountsFiltered);

            return temp;
        }

        public static List<string> MakeTraderMask(int level, List<string> traderNames, JObject TraderOffersJSON, JObject QuestUnlocksJSON)
        {
            // The trader mask is a simple flat list of id strings
            List<string> traderMask = new List<string>();

            // First add all of the items which belong to the provided traders, up to the given level.
            foreach (string traderName in traderNames)
            {
                for (int i = 1; i <= level; i++)
                {
                    string searchJSONpath = $"$.data.traders.[?(@.name=='{traderName}')].levels.[?(@.level=={i})].cashOffers.[*].item.id";
                    var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();
                    filtering.ForEach(x => traderMask.Add(x.ToString()));
                }
            }

            // Next add all of the Quest unlock items, up to the given level.
            string searchQuestsJSONpath = $"$.data.tasks..finishRewards.offerUnlock[*]";
            List<JToken> shortList = QuestUnlocksJSON.SelectTokens(searchQuestsJSONpath).ToList();

            List<J_OfferUnlock> unlocks = new List<J_OfferUnlock>();
            foreach (JToken item in shortList)
            {
                J_OfferUnlock j_OfferUnlock = JsonConvert.DeserializeObject<J_OfferUnlock>(item.ToString());
                if (j_OfferUnlock.level <= level)
                {
                    unlocks.Add(j_OfferUnlock);
                }
            }
            foreach (var offer in unlocks)
            {
                traderMask.Add(offer.item.id);
            }

            // Finally return the flat list
            return traderMask;
        }
        /// <summary>
        /// This will take a given player level, trader names and a JSON of trader offers and return a list of all ids that are relevant. 
        /// </summary>
        public static List<string> MakeTraderMaskByPlayerLevel(int playerLevel, List<string> traderNames, JObject TraderOffersJSON)
        {
            // The trader mask is a simple flat list of id strings
            List<string> traderMask = new List<string>();

            // Add the level 1 traders
            foreach (string traderName in traderNames)
            {
                string searchJSONpath = $"$.data.traders.[?(@.name=='{traderName}')].levels.[?(@.level=={1})].cashOffers.[*].item.id";
                var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();
                filtering.ForEach(x => traderMask.Add(x.ToString()));
            }

            // This is horrible, but it works, making something more elegant would take research time and I can be reasonably certain that the overall requirements won't change drastically.
            // level 2 traders
            if (playerLevel >= 14)
            {
                traderMask.AddRange(HelperTraderMaskFunc(2, "Peacekeeper", TraderOffersJSON));
            }
            if (playerLevel >= 15)
            {
                traderMask.AddRange(HelperTraderMaskFunc(2, "Prapor", TraderOffersJSON));
                traderMask.AddRange(HelperTraderMaskFunc(2, "Jaeger", TraderOffersJSON));
                traderMask.AddRange(HelperTraderMaskFunc(2, "Skier", TraderOffersJSON));
            }
            if (playerLevel >= 20)
            {
                traderMask.AddRange(HelperTraderMaskFunc(2, "Mechanic", TraderOffersJSON));
            }

            // level 3 traders
            if (playerLevel >= 22)
            {
                traderMask.AddRange(HelperTraderMaskFunc(3, "Jaeger", TraderOffersJSON));
            }
            if (playerLevel >= 23)
            {
                traderMask.AddRange(HelperTraderMaskFunc(3, "Peacekeeper", TraderOffersJSON));
            }
            if (playerLevel >= 26)
            {
                traderMask.AddRange(HelperTraderMaskFunc(3, "Prapor", TraderOffersJSON));
            }
            if (playerLevel >= 28)
            {
                traderMask.AddRange(HelperTraderMaskFunc(3, "Skier", TraderOffersJSON));
            }
            if (playerLevel >= 30)
            {
                traderMask.AddRange(HelperTraderMaskFunc(3, "Mechanic", TraderOffersJSON));
            }

            // level 4 traders
            if (playerLevel >= 33)
            {
                traderMask.AddRange(HelperTraderMaskFunc(4, "Jaeger", TraderOffersJSON));
            }
            if (playerLevel >= 36)
            {
                traderMask.AddRange(HelperTraderMaskFunc(4, "Prapor", TraderOffersJSON));
            }
            if (playerLevel >= 37)
            {
                traderMask.AddRange(HelperTraderMaskFunc(4, "Peacekeeper", TraderOffersJSON));
            }
            if (playerLevel >= 38)
            {
                traderMask.AddRange(HelperTraderMaskFunc(4, "Skier", TraderOffersJSON));
            }
            if (playerLevel >= 40)
            {
                traderMask.AddRange(HelperTraderMaskFunc(4, "Mechanic", TraderOffersJSON));
            }
               
            return traderMask;

        }

        private static List<string> HelperTraderMaskFunc(int traderLevel, string traderName, JObject TraderOffersJSON)
        {
            List<string> result = new List<string>();

            string searchJSONpath = $"$.data.traders.[?(@.name=='{traderName}')].levels.[?(@.level=={traderLevel})].cashOffers.[*].item.id";
            var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();

            filtering.ForEach(x => result.Add(x.ToString()));

            return result;
        }

        public static (List<Weapon> Masked_Weapons, List<WeaponMod> Masked_Mods, List<Ammo> Masked_Ammo) GetMaskedTuple(List<string> mask, List<Weapon> inputWeapons, List<WeaponMod> inputMods, List<Ammo> inputAmmo)
        {
            var f_weapons = inputWeapons.FindAll(x => mask.Contains(x.Id));

            var f_mods = inputMods.FindAll(x => mask.Contains(x.Id)).ToHashSet();
            //! Need to add in the mods which are only sold as part of weapons
            foreach (var weapon in f_weapons)
            {
                f_mods.UnionWith(WG_Recursion.AccumulateMods(weapon.Slots));
            }

            var f_ammo = inputAmmo.OfType<Ammo>().ToList().FindAll(x => mask.Contains(x.Id));

            return (f_weapons, f_mods.ToList(), f_ammo);
        }

        public static Ammo SelectAmmo(Weapon InputWeapon, List<Ammo> AmmoList, string mode)
        {
            Ammo bullet = null;
            AmmoList = AmmoList.FindAll(ammo => ammo.Caliber.Equals(InputWeapon.AmmoCaliber));

            if (AmmoList.Count > 0)
            {
                if (mode.Equals("damage"))
                    AmmoList = AmmoList.OrderByDescending(ammo => ammo.Damage).ToList();
                else if (mode.Equals("penetration"))
                    AmmoList = AmmoList.OrderByDescending(ammo => ammo.PenetrationPower).ToList();
                bullet = AmmoList.First();
            }
            return bullet;
        }

        public static List<(Weapon, Ammo)> CompileSelectedWeaponType<T>(List<Weapon> Input_Weapons, List<WeaponMod> Input_Mods, List<Ammo> Input_Ammo, string modType, string ammoType, List<J_CashOffer> CashOffers)
        {
            List<(Weapon, Ammo)> Results = new();

            // Filter the given list of weapons to be only of the given type
            List<Weapon> SelectedTypeOfWeapons = Input_Weapons.Where(x => x is T).ToList();

            // For each weapon in the list, recursively fit as best possible with the given parameters.
            foreach (var IWeapon in SelectedTypeOfWeapons)
            {
                Weapon ModdedWeapon = (Weapon)WG_Recursion.FitCompoundItem(IWeapon, Input_Mods, modType, CashOffers);
                Ammo BestAmmoAvailible = SelectAmmo(IWeapon, Input_Ammo, ammoType);

                if(BestAmmoAvailible != null)
                {
                    Results.Add((ModdedWeapon, BestAmmoAvailible));
                }
            }

            // Sort the results according to the mode.
            if (modType == "ergo")
                Results = Results.OrderByDescending(x => WG_Recursion.GetCompoundItemTotals<Weapon>(x.Item1).TotalErgo).ToList();
            else if (modType == "recoil")
                Results = Results.OrderBy(x => WG_Recursion.GetCompoundItemTotals<Weapon>(x.Item1).TotalRecoil).ToList(); ;

            return Results;
        }

        public static (Weapon, Ammo) CompileAWeapon(Weapon Input_Weapon, List<WeaponMod> Input_Mods, List<Ammo> Input_Ammo, string modType, string ammoType, List<J_CashOffer> CashOffers)
        {
            (Weapon, Ammo) result = new();

            Weapon ModdedWeapon = (Weapon)WG_Recursion.FitCompoundItem(Input_Weapon, Input_Mods, modType, CashOffers);
            Ammo BestAmmoAvailible = SelectAmmo(Input_Weapon, Input_Ammo, ammoType);

            if (BestAmmoAvailible != null)
            {
                result = (ModdedWeapon, BestAmmoAvailible);
            }

            return result;
        }

        // How does this work? I don't know!
        public static Weapon MysteriousCloner(Weapon original)
        {
            Weapon clone = new();

            PropertyInfo[] properties = typeof(Weapon).GetProperties();
            foreach (var p in properties.Where(prop => prop.CanRead && prop.CanWrite))
                p.SetMethod.Invoke(clone, new object[] { p.GetMethod.Invoke(original, null) });

            return clone;
        }

        // Was seeing if this would fix the issue wioth the CompileDefaultPresets() method.
        public static WeaponMod MysteriousCloner_WeaponMod(WeaponMod original)
        {
            WeaponMod clone = new();

            PropertyInfo[] properties = typeof(WeaponMod).GetProperties();
            foreach (var p in properties.Where(prop => prop.CanRead && prop.CanWrite))
                p.SetMethod.Invoke(clone, new object[] { p.GetMethod.Invoke(original, null) });

            return clone;
        }

        public static T MysteriousCloner_Generic<T>(T original)
        {

            T clone = (T)Activator.CreateInstance(typeof(T));

            PropertyInfo[] properties = typeof(WeaponMod).GetProperties();
            foreach (var p in properties.Where(prop => prop.CanRead && prop.CanWrite))
                p.SetMethod.Invoke(clone, new object[] { p.GetMethod.Invoke(original, null) });

            return clone;
        }
    }
}
