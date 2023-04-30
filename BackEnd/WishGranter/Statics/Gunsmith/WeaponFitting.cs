using RatStash;
using WishGranterProto;

namespace WishGranter.Statics
{

    public class BasePreset
    {
        //? Look into ensuring that the Weapon here has the mods attached, becuase it's needed in the FitWeapon() method in Gunsmith
        public string Name { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public StatsSummary StatsSummary { get; set; } = new();
        public Weapon Weapon { get; set; } = new();
        public PurchaseOffer PurchaseOffer { get; set; } = new();
        public List<WeaponMod> WeaponMods { get; set; } = new(); // This shouldn't change after construction
        // We don't need to remember the market details of the Mods, because the mods are only ever going to get sold to a trader, which can be looked up when needed.
        public BasePreset() { }
        public BasePreset(string name, string id, Weapon weapon, PurchaseOffer purchaseOffer, List<WeaponMod> weaponMods) 
        {
            Name = name;
            Id = id;
            Weapon = weapon;
            PurchaseOffer = purchaseOffer;
            WeaponMods = weaponMods;
            StatsSummary.SummarizeFromObjects(weapon, weaponMods);
        }
    }
    public class StatsSummary
    {
        public float Ergonomics { get; set; } // Because some bitch-ass mods have non-integer values
        public float Recoil_Vertical { get; set; }
        public float Weight { get; set; } // CZTL tells me this is very important for the ADS speed and time

        public void SummarizeFromObjects(Weapon weapon, List<WeaponMod> weaponMods, Ammo? ammo = null)
        {
            var ergoBonus = 0f;
            var recoilBonus = 0f;
            var weightSum = 0f;
            foreach(var weaponMod in weaponMods)
            {
                ergoBonus += weaponMod.Ergonomics;
                recoilBonus += weaponMod.Recoil;
                weightSum += weaponMod.Weight;
            }

            Ergonomics = weapon.Ergonomics + ergoBonus;

            Recoil_Vertical = weapon.RecoilForceUp + (weapon.RecoilForceUp * (recoilBonus / 100));
            if (ammo != null)
                Recoil_Vertical += ammo.AmmoRec;

            Weight = weapon.Weight + weightSum;
        }
    }
    public class FittingBundleThing
    {
        //! No need for the Weapon to be saved at this level, as it can be found in the preset
        //? Could make it be a pointer at this level?
        //? If we put the cross-intreset methods in this class, it will have access to all of the children information
        //? I also need to consider the Mags list, but that would be simple enough to code as a independent function, or to store it as a list here. Considering the commonality of them, perhps that list should be parceled out to reduce repetition
        BasePreset BasePreset { get; set; } = new(); // The preset that we're going to use! Wow! Includes all of the associated info
        public GunsmithParameters GunsmithParameters { get; set; } = new(); // The parameters we're going to use to create the PurchasedMods with.
        PurchasedMods PurchasedMods { get; set; } = new(); // The mods our fitting will have, and thier purchase details (needed in the FE), build in GunSmith (GetPurchasedModsAmmo())
        PurchasedAmmo PurchasedAmmo { get; set; } = new(); // Our Ammo choice
        FittingSummary FittingSummary { get; set; } = new();

        public FittingBundleThing() { }
        //todo full parameter constructor
        public FittingBundleThing(BasePreset basePreset, GunsmithParameters gunsmithParameters)
        {
            BasePreset = basePreset;
            GunsmithParameters = gunsmithParameters;
            PurchasedMods = Gunsmith.GetPurchasedMods(basePreset.Weapon, GunsmithParameters);


            //todo the ammo selection, then we can get the fitting summary constructor (also todo) to use it and gun+mods to make the summary
        }

        public void AcceptFitting(PurchasedMods newPurchasedMods)
        {
            PurchasedMods = newPurchasedMods;
            FittingSummary.UpdateSummary(BasePreset, PurchasedMods, PurchasedAmmo);
        }
    }
    public class FittingSummary
    {
        // We might wish to consider the cost totals in other currencies too.... could do that with a dictionary of RUB, EUR and USD + ints.
        //? Might also be where we keep the recoil score, if it comes to that
        //? Same for the ADS speed and time stuff. unless that goes into the stats summary

        public StatsSummary StatsSummary { get; set; } = new(); // Can put the attachments stat summary here 
        public int TotalRubleCost { get; set; } // Can put the total cost of the fitting here
        public int PurchasedModsCost { get; set; }
        public int PresetModsRefund { get; set; } // Can also save this here
        public void UpdateSummary(BasePreset basePreset, PurchasedMods purchasedMods, PurchasedAmmo purchasedAmmo)
        {
            // Summarize the new stats 
            StatsSummary.SummarizeFromObjects(basePreset.Weapon, purchasedMods.GetWeaponMods(), purchasedAmmo.Ammo);

            // Get the refund total of sold preset mods, get the except of the preseet mods in the fitterd mods.
            var modIdsToBePawned = basePreset.WeaponMods.Except(purchasedMods.GetWeaponMods()).Select(x => x.Id).ToList();
            PresetModsRefund = Market.GetTraderBuyBackTotalFromIdList(modIdsToBePawned);

            // Storing this here for later display in FE, and using right now with the next step
            PurchasedModsCost = purchasedMods.GetSummOfRUBprices();

            // Now we can get the new total.
            TotalRubleCost = basePreset.PurchaseOffer.PriceRUB + PurchasedModsCost - PresetModsRefund;

        }
    }
    public class PurchasedMods
    {
        public List<PurchasedMod> List { get; set; } = new List<PurchasedMod>();
        public List<WeaponMod> GetWeaponMods()
        {
            return List.Select(x => x.WeaponMod).ToList();
        }
        public int GetSummOfRUBprices()
        {
            int summ = 0;
            foreach (var tuple in List)
            {
                summ += tuple.PurchaseOffer.PriceRUB;
            }

            return summ;
        }
        public PurchasedMods() { }
        public PurchasedMods(List<PurchasedMod> list)
        {
            List = list;
        }
    }
    public struct PurchasedMod
    {
        // Let's combine the mod and the purchase order we get it from together!
        public WeaponMod WeaponMod { get; set; } = new();
        public PurchaseOffer PurchaseOffer { get; set; } = new();
        public PurchasedMod() { }
        public PurchasedMod(WeaponMod weaponMod, PurchaseOffer purchaseOffer)
        {
            WeaponMod = weaponMod;
            PurchaseOffer = purchaseOffer;
        }
    }

    public struct PurchasedAmmo
    {
        // Hey, combining the Ammo selection with it's purchase info would be pretty cool too!
        public Ammo Ammo { get; set; }
        public PurchaseOffer PurchaseOffer { get; set; }
    }
}
