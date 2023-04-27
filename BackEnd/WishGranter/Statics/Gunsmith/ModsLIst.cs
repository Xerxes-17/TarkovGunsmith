using RatStash;
using WishGranter.ExtensionMethods;
using WishGranter.Statics;


//todo This idea needs to be fleshed out later, but It's really practical to do yet.
namespace WishGranter
{
    public class ModsList
    {
        public GunsmithParameters Parameters { get; init; }
        public List<WeaponMod> WeaponMods { get; set; }
        public void SortModListByPriority(Slot? slot = null)
        {
            if (slot != null)
            {
                // If we're dealing with a muzzle slot item, we want to remove things like thread protectors in these modes because otherwise they will be chosen over useful attachments.
                if (slot.Name.Equals("mod_muzzle") && (Parameters.priority == FittingPriority.MetaErgonomics || Parameters.priority == FittingPriority.Ergonomics))
                {
                    WeaponMods.RemoveAll(x => x.Ergonomics > 0 || (x.Ergonomics == 0 && x.Recoil == 0));
                }
            }
            // Then do the sorts
            if (Parameters.priority == FittingPriority.MetaRecoil)
            {
                SortWeaponModListHelper_MetaRecoil();
            }
            else if (Parameters.priority == FittingPriority.Recoil)
            {
                SortWeaponModListHelper_EconRecoil();
            }
            else if (Parameters.priority == FittingPriority.MetaErgonomics)
            {
                SortWeaponModListHelper_MetaErgonomics();
            }
            else if (Parameters.priority == FittingPriority.Ergonomics)
            {
                SortWeaponModListHelper_EconErgonomics();
            }
        }
        private void SortWeaponModListHelper_MetaRecoil()
        {
            // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
            //todo See if these can be made into single lines instead of pairs.
            var inputsRecoilMax = WeaponMods.Min(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalRecoil);
            WeaponMods = WeaponMods.Where(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalRecoil == inputsRecoilMax).ToList();

            var inputsErgoMax = WeaponMods.Max(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalErgo);
            WeaponMods = WeaponMods.Where(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalErgo == inputsErgoMax).ToList();

            //? From my intuition, there will only ever be one option after getting the double-max 
            //WeaponMods = WeaponMods.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
        }
        private void SortWeaponModListHelper_EconRecoil()
        {
            // Get the max value, filter out any that don't have it, then sort by the price.
            var inputsRecoilMax = WeaponMods.Min(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalRecoil);
            WeaponMods = WeaponMods.Where(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalRecoil == inputsRecoilMax).ToList();

            WeaponMods = WeaponMods.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
        }
        private void SortWeaponModListHelper_MetaErgonomics()
        {
            // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
            //todo See if these can be made into single lines instead of pairs.
            var inputsErgoMax = WeaponMods.Max(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalErgo);
            WeaponMods = WeaponMods.Where(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalErgo == inputsErgoMax).ToList();

            var inputsRecoilMax = WeaponMods.Min(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalRecoil);
            WeaponMods = WeaponMods.Where(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalRecoil == inputsRecoilMax).ToList();

            //WeaponMods = WeaponMods.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
        }
        private void SortWeaponModListHelper_EconErgonomics()
        {

            // Get the max value, filter out any that don't have it, then sort by the price.
            var inputsErgoMax = WeaponMods.Max(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalErgo);
            WeaponMods = WeaponMods.Where(x => x.GetRecursiveStatsTotals<WeaponMod>().TotalErgo == inputsErgoMax).ToList();

            WeaponMods = WeaponMods.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
        }

    }
}
