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
    public class BasePreset
    {
        public string Name { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public StatsSummary StatsSummary { get; set; } = new();
        public Weapon Weapon { get; set; } = new();
        public PurchaseOffer PurchaseOffer { get; set; } = new();
        public List <WeaponMod> WeaponMods { get; set; } = new();
        // We don't need to remember the market details of the Mods, because the mods are only ever going to get sold to a trader, which can be looked up when needed.        
    }
    public class StatsSummary
    {
        public float Ergonomics { get; set; } //Because some bitch-ass mods have non-integer values
        public float Recoil_Vertical { get; set; }
        public float Weight { get; set; } // CZTL tells me this is very important for the ADS speed and time

        public void SummarizeFromObjects(Weapon weapon, List<WeaponMod> weaponMods)
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
            Weight = weapon.Weight + weightSum;
        }
    }
    public class FittingBundleThing
    {
        //! No need for the Weapon to be saved at this level, as it can be found in the preset
        //? Could make it be a pointer at this level?
        BasePreset BasePreset { get; set; } = new(); // The preset that we're going to use! Wow! Includes all of the associated info
        public GunsmithParameters GunsmithParameters { get; set; } = new(); // The parameters we're going to use to create the preset with.
        FittingSummary FittingSummary { get; set; } = new();
        List <ModPurchaseOfferTuple> FittingModsPurchasesList { get; set; } = new(); // The mods our fitting will have, and thier purchase details (needed in the FE)

        //? If we put the cross-intreset methods in this class, it will have access to all of the children information
        //? I also need to consider the Mags list, but that would be simple enough to code as a independent function

    }
    public class FittingSummary
    {
        public StatsSummary StatsSummary { get; set; } = new(); // Can put the attachments stat summary here 
        public int TotalRubleCost { get; set; } // Can put the total cost of the fitting here
        public int PurchasedModsCost { get; set; }
        public int PresetModsRefund { get; set; } // Can also save this here

        // We might wish to consider the cost totals in other currencies too....
        //? Might also be where we keep the recoil score, if it comes to that
        //? Same for the ADS speed and time stuff. unless that goes into the stats summary
    }
}
