using Force.DeepCloner;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RatStash;
using System.Text;
using WishGranterProto;

namespace WishGranter.Statics
{
    // Okay, so we need a way to save the data in a sensible way, we also need a way to choose how these loadouts are saved so that there isn't so much duplication
    // An intermediate join table which has the parameters and then links to a given fitting bundle could work.

    public class TheCube
    {
        public int GunsmithParametersId { get; set; }
        public GunsmithParameters GunsmithParameters { get; set; } = new(); // The parameters we're going to use to in the bundle.
        public int BundleId { get; set; }
        public FittingBundle Bundle { get; set; } = new();

        //todo we will now need to call the Bundle methods from this level in order to provide the Params
    }
    public class PurchasedMod
    {
        // Let's combine the mod and the purchase order we get it from together!
        public WeaponMod WeaponMod { get; set; } = new();
        public PurchaseOffer? PurchaseOffer { get; set; }
        public PurchasedMod() { }
        public PurchasedMod(WeaponMod weaponMod, PurchaseOffer purchaseOffer)
        {
            WeaponMod = weaponMod;
            PurchaseOffer = purchaseOffer;
        }
        public PurchasedMod Clone()
        {
            return new PurchasedMod
            {
                WeaponMod = this.WeaponMod.DeepClone(),
                PurchaseOffer = this.PurchaseOffer?.DeepClone()
            };
        }
    }

    public class PurchasedModComparer : IEqualityComparer<PurchasedMod>
    {
        public bool Equals(PurchasedMod x, PurchasedMod y)
        {
            if (ReferenceEquals(x, y))
                return true;
            if (x is null || y is null)
                return false;

            return x.WeaponMod.Equals(y.WeaponMod) && (x.PurchaseOffer?.Equals(y.PurchaseOffer) ?? y.PurchaseOffer is null);
        }

        public int GetHashCode(PurchasedMod obj)
        {
            unchecked
            {
                int hash = 17;
                hash = hash * 23 + obj.WeaponMod.GetHashCode();
                hash = hash * 23 + (obj.PurchaseOffer?.GetHashCode() ?? 0);
                return hash;
            }
        }
    }
    public class PurchasedModListComparer : ValueComparer<List<PurchasedMod>>
    {
        public PurchasedModListComparer() : base(
            (c1, c2) => c1.SequenceEqual(c2),
            c => c.Aggregate(0, (acc, x) => acc + x.GetHashCode()),
            c => c.Select(x => x.Clone()).ToList()
        )
        { }
    }

    public class PurchasedModsComparer : ValueComparer<PurchasedMods>
    {
        public PurchasedModsComparer() : base(
            (c1, c2) => c1.HashId.SequenceEqual(c2.HashId) && c1.List.SequenceEqual(c2.List, new PurchasedModComparer()),
            c => c.HashId.GetHashCode() + c.List.Sum(x => x.GetHashCode()),
            c => new PurchasedMods { HashId = c.HashId, List = c.List.Select(x => x.Clone()).ToList() }
        )
        { }
    }

    public class PurchasedAmmo
    {
        // Hey, combining the Ammo selection with it's purchase info would be pretty cool too!
        public Ammo Ammo { get; set; } = new();
        public PurchaseOffer PurchaseOffer { get; set; } = new();

        public PurchasedAmmo() { }
        public PurchasedAmmo(Ammo ammo, PurchaseOffer purchaseOffer)
        {
            Ammo = ammo;
            PurchaseOffer = purchaseOffer;
        }

        public static PurchasedAmmo GetBestPurchasedAmmo(BasePreset basePreset, GunsmithParameters gunsmithParameters)
        {
            var caliber = basePreset.Weapon.AmmoCaliber;
            if (caliber.Equals("Caliber9x18PMM"))
            {
                caliber = "Caliber9x18PM";
            }
            PurchasedAmmo purchasedAmmo;
            var shortlist = Ammos.GetAmmoOfCalibre(caliber);
            if(shortlist.Count > 0)
            {
                var ammoIds = shortlist.Select(x => x.Id).ToList();
                //Get a list of the ammo type Ids which are avail on the market
                var marketEntries = Market.GetPurchaseOfferTraderOrFleaList(ammoIds, gunsmithParameters.playerLevel, gunsmithParameters.fleaMarket).Where(x => x != null);
                var marketEntryIds = marketEntries.Select(x => x.Id).ToList();

                // Filter the ammo choices by that and choose the one with the best pen
                shortlist = shortlist.Where(x => marketEntryIds.Contains(x.Id)).ToList();

                shortlist = shortlist.OrderByDescending(x => x.PenetrationPower).ToList();

                if(shortlist.Count > 0)
                {
                    var bestPen = shortlist[0];
                    var bestPen_market = marketEntries.FirstOrDefault(x => x.Id == bestPen.Id);

                    purchasedAmmo = new PurchasedAmmo(bestPen, bestPen_market.PurchaseOffer);
                }
                else
                {
                    purchasedAmmo = null;
                }

            }
            else
            {
                purchasedAmmo=null;
            }

            
            return purchasedAmmo;
        }
    }
}
