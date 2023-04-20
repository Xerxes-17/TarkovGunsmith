using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RatStash;
using WishGranterProto;
using WishGranterProto.ExtensionMethods;

namespace WishGranter.Statics
{
    public enum MuzzleType
    {
        Loud,
        Quiet,
        Any
    }

    // Decided to combine these three categories into one as Mods are only relevant to Weapons and presets need weapons and mods soo...
    public static class ModsWeaponsPresets
    {
        public static List<Weapon> CleanedWeapons = ConstructCleanedWeaponList();
        public static List<WeaponMod> CleanedMods = ConstructCleanedWeaponModList();
        public static List<WeaponPreset> Presets = ConstructDefaultPresets();

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

            result = PatchWeaponStatsFromAPI(result);

            return result;
        }
        private static List<WeaponMod> ConstructCleanedWeaponModList()
        {
            List<WeaponMod> startList = StaticRatStash.DB.GetItems(x => x is WeaponMod).Cast<WeaponMod>().ToList();

            // Setup the filters for things that I don't think are relevant, but we also remove the Mounts so they can be added in clean later
            List<Type> ModsFilter = new List<Type>() {
                typeof(IronSight), typeof(CompactCollimator), typeof(Collimator),
                typeof(OpticScope), typeof(NightVision), typeof(ThermalVision),
                typeof(AssaultScope), typeof(SpecialScope), typeof(Magazine),
                typeof(CombTactDevice), typeof(Flashlight), typeof(LaserDesignator),
                typeof(Mount), typeof(Launcher)};

            // Apply that filter
            var temp = startList.Where(mod => !ModsFilter.Contains(mod.GetType())).ToList();

            // Get the mounts from AllMods into a list, filter it to be only the mounts we want (for foregrips) and add them back to FilteredMods
            IEnumerable<Mount> Mounts = startList.OfType<Mount>();
            var MountsFiltered = Mounts.Where(mod => mod.Slots.Any(slot => slot.Name == "mod_foregrip")).ToArray();
            temp.AddRange(MountsFiltered);

            // Magwells for G36 which are "mounts"
            var magwell_1 = startList.Find(x => x.Id.Equals("622f02437762f55aaa68ac85"));
            if (magwell_1 != null)
            {
                temp.Add(magwell_1);
            }
            var magwell_2 = startList.Find(x => x.Id.Equals("622f039199f4ea1a4d6c9a17"));
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
            var AUG_A1_Scope = startList.Find(x => x.Id.Equals("62ea7c793043d74a0306e19f"));
            if (AUG_A1_Scope != null)
            {
                temp.Add(AUG_A1_Scope);
            }

            // Need to add in the SVDS UB as it is a "mount"
            var SVDS_UB = startList.Find(x => x.Id.Equals("5c471c2d2e22164bef5d077f"));
            if (SVDS_UB != null)
            {
                temp.Add(SVDS_UB);
            }

            return temp;
        }
        public static List<WeaponMod> GetListWithLoudMuzzles()
        {
            List<WeaponMod> list = CleanedMods;

            list.RemoveAll(x => x is Silencer);

            // Debug print
            //foreach (var item in list.Where(x => x is MuzzleDevice))
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id}");
            //}

            return list;
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
            list = list.Union(otherMuzzleDevices.Union(silencers)).ToList();
            //? Need to check if muzzle devices like the AUG flash hiders are included here.

            list.OrderBy(x => x.Name);

            // Debug print
            //foreach (var item in otherMuzzleDevices.Union(silencers))
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id}");
            //}

            return list;
        }
        public static List<string> GetAllPossibleChildrenIdsForCI(string compoundItemId)
        {
            HashSet<string> output = new ();

            var compoundItem = (CompoundItem) StaticRatStash.DB.GetItem(compoundItemId);

            foreach (var slot in compoundItem.Slots)
            {
                if (slot.Filters[0].Whitelist.Any())
                {
                    output.UnionWith(slot.Filters[0].Whitelist);

                    foreach(var id in slot.Filters[0].Whitelist)
                    {
                        output.UnionWith(GetAllPossibleChildrenIdsForCI(id));
                    }
                }
            }
            return output.ToList();
        }
        public static List<WeaponMod> FilterModsListByIdList(List<WeaponMod> inputMods, List<string> inputIds)
        {
            return inputMods.Where(x=>inputIds.Contains(x.Id)).ToList();
        }
        public static List<WeaponMod> GetShortListOfModsForCompundItemWithParams(string compundItemID, MuzzleType muzzleType, int playerLevel, bool fleaMarket, List<string>? exclusionList = null)
        {
            // Make return list
            List<WeaponMod> output = new();

            // Get the cleaned master list with the chosen muzzle devices
            if (muzzleType == MuzzleType.Loud)
                output = GetListWithLoudMuzzles();
            else if (muzzleType == MuzzleType.Quiet)
                output = GetListWithQuietMuzzles();
            else
                output = CleanedMods;

            // Make a list of Ids that the provided weapon or mod could possibly fit to itself and children.
            var shortListOfIds = GetAllPossibleChildrenIdsForCI(compundItemID);

            // Filter the master list by that list of possibilities
            output = FilterModsListByIdList(output, shortListOfIds);

            // Filter the list to items which meet player level requirement and possibly include flea offers.
            List<MarketEntry> marketData= new();
            if (fleaMarket)
                marketData = Market.GetFreeMarketPurchaseOffersByPlayerLevel(playerLevel);
            else
                marketData = Market.GetTraderOffersByPlayerlevel(playerLevel);

            var marketIds = marketData.Select(x => x.Id).ToList();
            output = FilterModsListByIdList(output, marketIds);

            // Remove any items that have been explicitly excluded, if there are any.
            if(exclusionList != null)
                output = output.Where(x => !exclusionList.Contains(x.Id)).ToList();

            return output;
        }
        public static List<WeaponPreset> ConstructDefaultPresets()
        {
            List<WeaponPreset> ReturnedPresets = new();

            var DefaultPresetsJSON = TarkovDevAPI.GetAllWeaponPresets();
            // We're handed the Default Prests JSON by param, so let's break that down into a set of tokens
            string searchJSONpath = "$.data.items..properties.presets.[*]";
            var filtering = DefaultPresetsJSON.SelectTokens(searchJSONpath).ToList();

            // Now for each token, lets get the details of them, so the Id, the name, and the contents of the preset
            foreach (var preset in filtering)
            {
                var id = preset.SelectToken("$.id").ToString();
                var name = preset.SelectToken("$.name").ToString();

                var contents = preset.SelectTokens("$..containsItems..item.id");
                List<string> containedIDs = new();

                foreach (var result in contents)
                {
                    containedIDs.Add(result.ToString());
                }

                // Now let's get a list of all these items in the contents from the RatStashDB
                List<Item> items = new List<Item>();
                foreach (var ItemId in containedIDs)
                {
                    items.Add(StaticRatStash.DB.GetItem(ItemId));
                }

                // Kind of danmgerous to assume that the first item is a weapon core, but the assumption holds for now.
                Weapon weapon = (Weapon)items[0];
                // Remove it so we can do a smooth cast in the next method
                items.RemoveAt(0);

                // This will go and create a ratstash weapon from the preset mods list
                weapon = WG_Recursion.AddDefaultAttachments(weapon, items);

                //Now we need to process the cashOffers, if any
                var cashOffers = preset.SelectTokens("$.buyFor.[*]");
                foreach (var cashOffer in cashOffers)
                {
                    var priceRUB = cashOffer.SelectToken("$.priceRUB").ToObject<int>();
                    var currency = cashOffer.SelectToken("$.currency").ToString();
                    var price = cashOffer.SelectToken("$.price").ToObject<int>();
                    var vendor = cashOffer.SelectToken("$.vendor.name").ToString();
                    var minTraderLevel = -1;
                    var offerType = OfferType.Cash;

                    int reqPlayerLevel;
                    if (vendor != "Flea Market")
                    {
                        minTraderLevel = cashOffer.SelectToken("$.vendor.minTraderLevel").ToObject<int>();
                        reqPlayerLevel = WG_Market.LoyaltyLevelByPlayerLevel[vendor][minTraderLevel - 1];

                    }
                    else
                    {
                        minTraderLevel = 5;
                        reqPlayerLevel = 15;
                        offerType = OfferType.Flea;
                    }

                    WeaponPreset PresetForReturned = new();
                    PresetForReturned.Name = name;
                    PresetForReturned.Id = id;
                    PresetForReturned.Weapon = weapon;

                    PurchaseOffer purchaseOffer = new();
                    purchaseOffer.PriceRUB = priceRUB;
                    purchaseOffer.Currency = currency;
                    purchaseOffer.Price = price;
                    purchaseOffer.Vendor = vendor;
                    purchaseOffer.MinVendorLevel = minTraderLevel;
                    purchaseOffer.ReqPlayerLevel = reqPlayerLevel;
                    purchaseOffer.OfferType = offerType;

                    PresetForReturned.PurchaseOffer = purchaseOffer;
                    ReturnedPresets.Add(PresetForReturned);
                }

                // Let's also process the barter offers, if any.
                var barterOffers = preset.SelectTokens("$.bartersFor.[*]");

                foreach (var barterOffer in barterOffers)
                {
                    var trader = barterOffer.SelectToken("$.trader.name").ToString();
                    var minTraderLevel = barterOffer.SelectToken("$.level").ToObject<int>();
                    var reqPlayerLevel = WG_Market.LoyaltyLevelByPlayerLevel[trader][minTraderLevel - 1];


                    var requiredItems = barterOffer.SelectTokens("$.requiredItems[*]");
                    var barterTotalCost = -1;
                    foreach (var requiredItem in requiredItems)
                    {
                        var quantity = requiredItem.SelectToken("$.quantity").ToObject<int>();
                        var barterName = requiredItem.SelectToken("$.item.name").ToString();

                        var priceRUB = requiredItem.SelectToken("$..buyFor.[0].priceRUB");

                        int priceRUB_value = -1;
                        if (priceRUB != null)
                        {
                            priceRUB_value = priceRUB.Value<int>();
                        }

                        if (priceRUB_value != -1)
                        {
                            barterTotalCost += (quantity * priceRUB_value);
                        }
                    }
                    var offerType = OfferType.Barter;

                    // If the barter wants something that isn't buyable on the flea, we disregard it
                    if (barterTotalCost != -1)
                    {
                        WeaponPreset PresetForReturned = new();
                        PresetForReturned.Name = name;
                        PresetForReturned.Id = id;
                        PresetForReturned.Weapon = weapon;

                        PurchaseOffer purchaseOffer = new();
                        purchaseOffer.PriceRUB = barterTotalCost;
                        purchaseOffer.Vendor = trader;
                        purchaseOffer.MinVendorLevel = minTraderLevel;
                        purchaseOffer.ReqPlayerLevel = reqPlayerLevel;
                        purchaseOffer.OfferType = offerType;

                        PresetForReturned.PurchaseOffer = purchaseOffer;


                        ReturnedPresets.Add(PresetForReturned);
                    }
                }
            }
            return ReturnedPresets;
        }
        public static List<Weapon> PatchWeaponStatsFromAPI(List<Weapon> inputList)
        {
            // Send API Req for all stats of interest
            var apiDetails = TarkovDevAPI.GetAllGunBaseStats();

            // Break JSON down into set of tokens
            string searchJSONpath = "$.data.items.[*]";
            var tokens = apiDetails.SelectTokens(searchJSONpath).ToList();

            foreach (var preset in tokens)
            {
                // Match each token to a weapon
                var id = preset.SelectToken("$.id").ToString();
                var match = inputList.Find(x=>x.Id.Equals(id));

                if (match != null)
                {
                    match.Ergonomics = int.Parse(preset.SelectToken("$.properties.ergonomics").ToString());
                    match.RecoilAngle = int.Parse(preset.SelectToken("$.properties.recoilAngle").ToString());
                    match.RecoilForceUp = int.Parse(preset.SelectToken("$.properties.recoilVertical").ToString());
                    match.RecoilDispersion = int.Parse(preset.SelectToken("$.properties.recoilDispersion").ToString());
                    match.Convergence = float.Parse(preset.SelectToken("$.properties.convergence").ToString());
                }
            }

            return inputList;
        }
    }
}
