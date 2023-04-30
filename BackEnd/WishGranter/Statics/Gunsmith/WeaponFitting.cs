using RatStash;
using WishGranterProto;

namespace WishGranter.Statics
{
    public struct ModPurchaseOfferTuple
    {
        // Need to include these together for builds which are trader + Flea
        WeaponMod WeaponMod { get; set; }
        PurchaseOffer PurchaseOffer { get; set; }
    }
    /* Fuckit, time to just write some stuff down and try and puszzle out the data structure from it. From the top down with a weapon fit we need to have:
     * 1 - The parameters of the fitting request.
     * 2 - The Ammo that fitting will use.
     * 3 - The Weapon itself
     * 4 - the PRESET of the weapon, because we need to know where it comes from !!! Currently we do fit out each preset, but why bother to do this? We know they are correct, just sum up the bonuses and apply them to the base weapon my guy.
     *     but then the other part of the issue is handling the value of that.
     * 5 - The list of the mods used in a fitting, because we're going to present a flat list anyway, and we don't need to connect the parts after the fit.
     * 6 - WE need the corresponding list of purchase offers for that list of mods, or do we? any flea market fit is going to be the same as a BIS fit, only with the purchase source changing as the player level goes up
     *    aha no, we do need it, becuase in the FE the purchase offer is shown with the Mod.
     * 7 - We need a summary of the fitting's stats, becuase we want to be able to use them in the graph plot
     */

    //? Now, I probably want a way of keeping the data more compact with less duplicates, so it might be an idea to have a wrapper class which is the player level, and the ID of the Fitting bundle for it, so that
    //? When a build is the same for multiple levels, we can just take the pointer to that build instead of holding a copy of it.

    public class NewPresetClass
    {
        public string Name { get; set; }
        public string Id { get; set; }
        public StatsSummary StatsSummary { get; set; }
        public Weapon Weapon { get; set; }
        public PurchaseOffer PurchaseOffer { get; set; }
        public List <WeaponMod> WeaponMods { get; set; }
        // We don't need to remember the market details of the Mods, because the mods are only ever going to get sold to a trader, which can be looked up when needed.        
    }

    public class StatsSummary
    {
        public float Ergonomics { get; set; } //Because some bitch-ass mods have non-integer values
        public float Recoil_Vertical { get; set; }
        public float Weight { get; set; } // CZTL tells me this is very important for the ADS speed and time
    }

    public class FittingBundleThing
    {
        //! No need for the Weapon to be saved at this level, as it can be found in the preset
        //? Could make it be a pointer at this level?
        NewPresetClass NewPresetClass { get; set; } // The preset that we're going to use! Wow! Includes all of the associated info
        public GunsmithParameters GunsmithParameters { get; set; } // The parameters we're going to use to create the preset with.
        FittingSummary FittingSummary { get; set; }
        List <ModPurchaseOfferTuple> FittingModsPurchasesList { get; set; } // The mods our fitting will have, and thier purchase details (needed in the FE)

        //? If we put the cross-intreset methods in this class, it will have access to all of the children information

        //? I also need to consider the Mags list, but that would be simple enough to code as a independent function

    }
    public class FittingSummary
    {
        public StatsSummary StatsSummary { get; set; } // Can put the attachments stat summary here 
        public int TotalRubleCost { get; set; } // Can put the total cost of the fitting here
        public int PurchasedModsCost { get; set; }
        public int PresetModsRefund { get; set; } // Can also save this here

        // We might wish to consider the cost totals in other currencies too....
        //? Might also be where we keep the recoil score, if it comes to that
        //? Same for the ADS speed and time stuff. unless that goes into the stats summary
    }

    public class TNO1
    {
        string WeaponId { get; set; } // Don't need a copy of the weapon, just the ID, as the Preset and the Fitting have the weapon
        Ammo Ammo { get; set; }

        public string PresetId { get; set; } // for Loading preset from JSON
        WeaponPreset WeaponPreset { get; set; } // Has all of the details of the Preset Including the purchase info

        public GunsmithParameters GunsmithParameters { get; set; }
        Weapon WeaponFitting { get; set; }
        

    }


    public class NewWeaponPresetClass
    {
        public string Id { get; set; }
        public string Name { get; set; } // for SQL
        public string WeaponId { get; set; } // for SQL
        public MarketEntry WeaponMarketEntry { get; set; }
        public List<WeaponMod> Mods { get; set; }

        public WeaponFitSummary Summary { get; set; }
    }

    public class NewFitPackageClass
    {
        public string WeaponId { get; set; } // for SQL
        public Weapon Weapon { get; set; } // Needed in FE.
        public string AmmoId { get; set; } // for SQL
        public Ammo Ammo { get; set; } // Needed in FE.

        public string PresetId { get; set; } // for SQL
        public WeaponFitSummary PresetSummary { get; set; } // We don't really directly care for the list of mods in the preset, so jsut a summary is fine.

        public List<WeaponMod> FittingMods { get; set; } // The list of mods attached to the Weapon in this fitting.
        public WeaponFitSummary FittingSummary { get; set; } // We naturally want the list of mods used in this fitting in a flat list for viewing in the FE.

        public GunsmithParameters GunsmithParameters { get; set; }

    }

    public class WeaponFit
    {
        // Plan on storing these in the SQL...
        public int Id { get; set; }
        public GunsmithParameters GunsmithParameters { get; set; }
        public int WeaponId { get; set; }
        public Weapon Weapon { get; set; }
        public MarketEntry WeaponMarketEntry { get; set; }
        public int AmmoId { get; set; }
        public Ammo Ammo { get; set; }
        public List<WeaponMod> Mods { get; set; }
        //? Possibly a list of Market Entries, but perhaps it should be a list of tuples? Alternatively, there was that idea of the combo parameters and list of mods or w/e.
        //? See on discord "I see a lot of functions that work on a list of weapon mods"
        public WeaponFitPackage FittingPackage { get; set; }

    }

    public class WeaponFitPackage
    {
        public WeaponPreset WeaponPreset { get; set; }
        public GunsmithParameters GunsmithParameters { get; set; }
        public WeaponFitSummary Summary { get; set; }
        public List<WeaponMod> Mods { get; set; }
    }
    public class WeaponFitSummary
    {
        public int Ergonomics { get; set; }
        public float Recoil_Vertical { get; set; }
        public int PriceRUB { get; set; }
        public int PresetModsRefundRUB { get; set; }
    }
}
