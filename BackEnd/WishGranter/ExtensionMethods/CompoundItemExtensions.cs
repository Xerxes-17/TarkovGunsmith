using RatStash;
using WishGranter.Statics;

namespace WishGranter.ExtensionMethods
{
    public static class CompoundItemExtensions
    {
        public static bool Test(this CompoundItem CompItem)
        {
            if (CompItem == null)
                return false;
            else
                return true;
        }

        public static (int TotalErgo, double TotalRecoil) GetRecursiveStatsTotals<T>(this CompoundItem item)
        {
            float sumErgo = -1;
            float sumRecoil = -1;
            List<WeaponMod> Children = Gunsmith.AccumulateMods(item.Slots);
            var (TotalErgo, TotalRecoil) = Gunsmith.GetAttachmentsTotals(Children);


            if (typeof(T) == typeof(Weapon))
            {
                var weapon = (Weapon)item;

                sumErgo = weapon.Ergonomics + (int)TotalErgo;
                sumRecoil = weapon.RecoilForceUp + (weapon.RecoilForceUp * (TotalRecoil / 100));
            }
            else if (typeof(T) == typeof(WeaponMod))
            {
                var mod = (WeaponMod)item;

                sumErgo = mod.Ergonomics + TotalErgo;
                sumRecoil = mod.Recoil + TotalRecoil;
            }
            else
            {
                Console.Error.WriteLine("Error: Incorrect type given to method GetCompoundItemTotals()");
            }

            // Return the values as Ints because that makes comparision easier and we don't care about a .5 ergo difference.
            return ((int)sumErgo, sumRecoil);
        }

    }
}
