using RatStash;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Reflection;
using Force.DeepCloner;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Compilation
    {
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

        // Takes in a JSON provided by dev-tarkov, a RatStashDB and then returns a list of WeaponPresets
        public static List<WeaponPreset> CompileDefaultPresets(JObject DefaultPresetsJSON, Database RatStashDB)
        {
            List<WeaponPreset> ReturnedPresets = new();

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

                foreach(var result in contents)
                {
                    containedIDs.Add(result.ToString());
                }

                // Now let's get a list of all these items in the contents from the RatStashDB
                List<Item> items = new List<Item>();
                foreach (var item in containedIDs)
                {
                    items.Add(RatStashDB.GetItem(item));
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
                        if( priceRUB != null)
                        {
                            priceRUB_value = priceRUB.Value<int>();
                        }

                        if ( priceRUB_value != -1)
                        {
                            barterTotalCost += (quantity * priceRUB_value);
                        }
                    }
                    var offerType = OfferType.Barter;

                    // If the barter wants something that isn't buyable on the flea, we disregard it
                    if(barterTotalCost != -1)
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
            // Finally, give that list of weapon presests 
            return ReturnedPresets;
        }

        // Takes in the list of WeaponMods, and then filteres out unwatned mods, has a selector for allowed muzzle devices.
        public static List<WeaponMod> CompileFilteredModList(List<WeaponMod> All_Mods, int muzzleMode)
        {
            // Setup the filters for things that I don't think are relevant, but we also remove the Mounts so they can be added in clean later
            List<Type> ModsFilter = new List<Type>() {
                typeof(IronSight), typeof(CompactCollimator), typeof(Collimator),
                typeof(OpticScope), typeof(NightVision), typeof(ThermalVision),
                typeof(AssaultScope), typeof(SpecialScope), typeof(Magazine),
                typeof(CombTactDevice), typeof(Flashlight), typeof(LaserDesignator),
                typeof(Mount), typeof(Launcher)};

            // Muzzle mode 1 = loud, 2 = silencers, 3 = any
            if (muzzleMode == 1)
                ModsFilter.Add(typeof(Silencer));
            else if (muzzleMode == 2)
            {
                //Some silencers are combined devices you dummy
                //ModsFilter.Add(typeof(CombMuzzleDevice)); 
                ModsFilter.Add(typeof(Compensator));
                ModsFilter.Add(typeof(Flashhider));
            }

            // Apply that filter
            var temp = All_Mods.Where(mod => !ModsFilter.Contains(mod.GetType())).ToList();

            // Get the mounts from AllMods into a list, filter it to be only the mounts we want (for foregrips) and add them back to FilteredMods
            IEnumerable<Mount> Mounts = All_Mods.OfType<Mount>();
            var MountsFiltered = Mounts.Where(mod => mod.Slots.Any(slot => slot.Name == "mod_foregrip")).ToArray();
            temp.AddRange(MountsFiltered);

            return temp;
        }

        //? Chooses an ammo for a provided weapon from a list, but it currently isn't used anywhere, might need to delete.
        public static Ammo SelectAmmo(Weapon InputWeapon, List<Ammo> AmmoList, string mode)
        {
            Ammo bullet = new();
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

    }
}
