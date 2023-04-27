using RatStash;
using WishGranterProto;

namespace WishGranter.Statics
{
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
