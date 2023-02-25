using RatStash;
using WishGranterProto.ExtensionMethods;

namespace WishGranter
{
    public class WG_DataScience
    {
        public Dictionary<string, List<CurveDataPoint>> statsCurvesCache = new();
        public List<CurveDataPoint> CreateListOfWeaponStats(WeaponPreset preset, string mode, int muzzleMode, Database ratStashDB)
        {
            string key = $"{preset.Id}, {mode}, {muzzleMode}";
            var result = new List<CurveDataPoint>();

            if (!statsCurvesCache.ContainsKey(key))
            {
                int startLevel = preset.PurchaseOffer.ReqPlayerLevel;

                for (int i = startLevel; i <= 40; i++)
                {
                    List<MarketEntry> filteredMarketData = WG_Market.GetMarketDataFilteredByPlayerLeverl(i);

                    // While I could combine these statements, it would be messy an unreadable. So first we get the list of IDs of weapon mods and ammo then we get lists of the mods and ammo from the RatStashDB.
                    List<string> SelectedIDs_Mods_Ammo = filteredMarketData.Select(x => x.Id).ToList();

                    List<Type> TypeFilterList = new List<Type>()
                    {
                        typeof(Ammo), typeof(ThrowableWeapon), typeof(Armor), typeof(ChestRig)
                    };

                    List<WeaponMod> AvailibleWeaponMods = ratStashDB.GetItems(x => SelectedIDs_Mods_Ammo.Contains(x.Id) && !TypeFilterList.Contains(x.GetType())).Cast<WeaponMod>().ToList();

                    // Get the ammo too and then filter it down to the caliber of the weapon
                    List<Ammo> AvailableAmmoChoices = ratStashDB.GetItems(x => SelectedIDs_Mods_Ammo.Contains(x.Id) && x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
                    AvailableAmmoChoices = AvailableAmmoChoices.Where(x => x.Caliber.Equals(preset.Weapon.AmmoCaliber)).ToList();

                    // We also need to add the mods that are in the preset to the availible mods, this is for cases where the preset is the only place where a mod can be purchased.
                    List<WeaponMod> IncludedWithPresetMods = WG_Recursion.AccumulateMods(preset.Weapon.Slots);
                    AvailibleWeaponMods.AddRange(IncludedWithPresetMods.Where(x => !AvailibleWeaponMods.Contains(x)));

                    //! Filter out all of the WeaponMods which aren't of the allowed types, Incl' muzzle devices
                    AvailibleWeaponMods = WG_Compilation.CompileFilteredModList(AvailibleWeaponMods, muzzleMode);

                    // Next the MWL is made in relation to the current weapon, as we don't need to care about M4 parts when building an AK, Да? We then make a shortlist from the MWL.
                    List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(preset.Weapon, AvailibleWeaponMods);
                    List<WeaponMod> ShortList_WeaponMods = ratStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();


                    HashSet<string> CommonBlackListIDs = new();
                    CompoundItem weapon_result = WG_Recursion.SMFS_Wrapper(preset.Weapon, ShortList_WeaponMods, mode, CommonBlackListIDs);

                    var (TotalErgo, TotalRecoil) = WG_Recursion.GetCompoundItemTotals<Weapon>(weapon_result);
                    var (initialCost, sellBackTotal, boughtModsTotal, finalCost) = WG_Market.CalculateWeaponBuildTotals(preset, (Weapon)weapon_result);
                    var isValid = WG_Recursion.CheckIfCompoundItemIsValid(weapon_result);

                    CurveDataPoint temp = new();

                    temp.level = i;
                    temp.recoil = TotalRecoil;
                    temp.ergo = TotalErgo;
                    temp.price = finalCost;
                    temp.invalid = !isValid; // So we can get a red bar to display if it is invalid on ReCharts

                    result.Add(temp);
                }
                statsCurvesCache.Add(key, result);
            }
            else
            {
                result = statsCurvesCache[key];
            }
            return result;
        }
    }
}
