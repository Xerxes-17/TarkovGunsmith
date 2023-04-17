using Force.DeepCloner;
using RatStash;

namespace WishGranter.Statics
{
    // This class will handle all of the fittings logic
    public static class Gunsmith
    {
        // A method for removing a mod from a compund item, without needing to know where it is exactly.
        public static void RemoveModFromCompoundItem(CompoundItem compItem, WeaponMod mod)
        {
            foreach (var slot in compItem.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    var slotItem = (CompoundItem)slot.ContainedItem;
                    if (slotItem.Id == mod.Id)
                    {
                        slot.ContainedItem = null;
                    }
                    else if (slotItem.Slots.Count > 0)
                    {
                        RemoveModFromCompoundItem(slotItem, mod);
                    }
                }
            }
        }

        //? This is for fitting the mods to a weapon in a preset, the assumption is that the mods has only one mod of a given type and that is what will be fitted.
        public static CompoundItem FitCompoundItem_Simple(CompoundItem CompItem, List<WeaponMod> mods)
        {
            // Need to do this so that mutation doesn't spread.
            var CompItemClone = CompItem.DeepClone();

            foreach (Slot slot in CompItemClone.Slots)
            {
                // Get the mods from the list that are appropriate for the given slot
                List<WeaponMod> shortList = mods.Where(mod => slot.Filters[0].Whitelist.Contains(mod.Id)).ToList();
                List<WeaponMod>? candidatesList = new();

                // If there is a candidate, fit it out as per this function (recursively)
                candidatesList.AddRange(shortList.Select(item => (WeaponMod)FitCompoundItem_Simple(item, mods)));

                // Add it to the slot once it is fitted and if it exists
                if (shortList.Count > 0)
                {
                    slot.ContainedItem = candidatesList.First();
                }
            }

            // By the end, you'll have a fully fitted out CompundItem, be it a Weapon or a WeaponMod
            return CompItemClone;
        }
        //todo Expand this so that the Market Price is also accoutned for.
        public static List<WeaponMod> SortWeaponModListForSlotByMode(Slot slot, List<WeaponMod> inputList, string mode)
        {
            if (mode == "recoil")
            {
                // Get the max value, filter out any that don't have it, then sort by the price.
                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
            }
            //! We force Meta Recoil mode on muzzle devices because for most the difference in ergo is tiny, and the recoil is the more important thing.
            else if (mode == "Meta Recoil")
            {
                // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();

            }

            //? Ergo Builds need to have 0 or positive ergo options removed for muzzle devices, otherwise they choose to have just end-caps or empty silencer adapters
            //? This is because only a few muzzle thread covers have positive ergo, and otherwise the rest have none or negative
            else if (mode == "ergo")
            {
                if (slot.Name.Equals("mod_muzzle"))
                {
                    inputList.RemoveAll(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo > 0 || (GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == 0 && GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == 0));
                }
                // Get the max value, filter out any that don't have it, then sort by the price.
                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
            }
            else if (mode == "Meta Ergonomics")
            {
                if (slot.Name.Equals("mod_muzzle"))
                {
                    inputList.RemoveAll(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo > 0 || (GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == 0 && GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == 0));
                }
                // Get the max value, filter out any that don't have it, then sort by the opposite.
                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
            }
            return inputList;
        }

        public static List<WeaponMod> SortWeaponModListByMode(List<WeaponMod> inputList, string mode)
        {
            if (inputList.Any())
            {
                if (mode == "recoil")
                {
                    // Get the max value, filter out any that don't have it, then sort by the price.
                    var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                    inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                    inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
                }
                //! We force Meta Recoil mode on muzzle devices because for most the difference in ergo is tiny, and the recoil is the more important thing.
                else if (mode == "Meta Recoil")
                {
                    // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
                    var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                    inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                    var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                    inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                    inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
                }

                //? Ergo Builds need to have 0 or positive ergo options removed for muzzle devices, otherwise they choose to have just end-caps or empty silencer adapters
                else if (mode == "ergo")
                {
                    // Get the max value, filter out any that don't have it, then sort by the price.
                    var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                    inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                    inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
                }
                else if (mode == "Meta Ergonomics")
                {
                    // Get the max value, filter out any that don't have it, then sort by the opposite.
                    var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                    inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                    var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                    inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                    inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();
                }
            }

            return inputList;
        }

        private static List<WeaponMod> EnhancedLogic_AR15_Uppers(List<WeaponMod> inputList, string mode)
        {
            // Let's do something special if the CI is an AR-15 type weapon
            //? Because fuck you Baltim- I mean, we had to make this special rule because making standard rules for all cases wasn't working.
            // To find the best barrel and handguard combo, all we need is 4 things: barrel, gasblock, handguard, receiver
            // 1. Fit out the barrels with gasblocks
            // 2. Fit out the handguards
            // 3. Fit the HGs to the receivers
            // 4. combine these 3.4. pairs with appropriate 1.BarrelGasBlocks
            // 5. Then give the best muzzle device possible to the 4.combo
            // Then, select the combination which is the best!
            // We also need to remove all other options, so that when the main fitting method gets to these parts and slots, it only ever has one choice possible.


            var gasblocks = inputList.Where(x => x.GetType() == typeof(GasBlock)).ToList();
            inputList.RemoveAll(x => gasblocks.Contains(x));

            var barrels = inputList.Where(x => x.GetType() == typeof(Barrel)).ToList();
            inputList.RemoveAll(x => barrels.Contains(x));

            var handguards = inputList.Where(x => x.GetType() == typeof(Handguard)).ToList();
            inputList.RemoveAll(x => handguards.Contains(x));

            var receivers = inputList.Where((x) => x.GetType() == typeof(Receiver)).ToList();
            inputList.RemoveAll(x => receivers.Contains(x));

            // First we gotta get the permutations of barrels + gas blocks
            List<WeaponMod> fittedBarrels = new List<WeaponMod>();
            foreach (var barrel in barrels)
            {
                foreach (var gasblock in gasblocks)
                {
                    var clone_barrel = barrel.DeepClone();
                    var clone_gasBlock = gasblock.DeepClone();

                    clone_barrel.Slots[1].ContainedItem = clone_gasBlock;
                    fittedBarrels.Add(clone_barrel);
                }
            }

            // Fit out all of the HGs
            List<WeaponMod> fittedHandGuards = new();
            HashSet<string> temp_BL = new HashSet<string>();
            foreach (var hg in handguards)
            {
                fittedHandGuards.Add((WeaponMod)SMFS_Wrapper(hg, inputList, mode, temp_BL));
            }


            // Pair up the Receivers with handguards
            List<WeaponMod> PairedReceivers = new List<WeaponMod>();
            foreach (var receiver in receivers)
            {
                foreach (var fittedHG in fittedHandGuards)
                {
                    var clone_rec = receiver.DeepClone();
                    var clone_fHG = fittedHG.DeepClone();

                    if (clone_rec.Slots[2].Filters[0].Whitelist.Contains(clone_fHG.Id))
                    {
                        clone_rec.Slots[2].ContainedItem = clone_fHG;
                        PairedReceivers.Add(clone_rec);
                    }
                }
            }

            //? As we need to have the receiver get fitted with the barrel, it will be the "seed"
            List<WeaponMod> FinalCombos = new();
            foreach (var pairedReceiver in PairedReceivers)
            {
                List<string> RHS_Prohibited = new List<string>();
                RHS_Prohibited = AggregateBlacklistRecursively(pairedReceiver);

                List<string> RHS_Ids = new List<string>();
                RHS_Ids.Add(pairedReceiver.Id);
                RHS_Ids.Add(pairedReceiver.Slots[2].ContainedItem.Id);

                // Make the shotlist of fitted barrels, and remove any which won't be accepted by the pairedReceiver
                var shortlist_FittedBarrels = fittedBarrels.DeepClone();
                shortlist_FittedBarrels.RemoveAll(x => RHS_Prohibited.Contains(x.Id));
                shortlist_FittedBarrels.RemoveAll(x => RHS_Prohibited.Contains(x.Slots[1].ContainedItem.Id));

                // Then for each remaining fittedBarrel, get its prohibited list and if the RHS_Ids don't contain a problem, fit it to the Rec and add the rec to the Final Combo list
                foreach (var fittedBarrel in shortlist_FittedBarrels)
                {
                    List<string> LHS_Prohibited = new List<string>();
                    LHS_Prohibited = AggregateBlacklistRecursively(fittedBarrel);

                    var intersection = LHS_Prohibited.Intersect(RHS_Ids);
                    if (!intersection.Any())
                    {
                        var fc_Rec = pairedReceiver.DeepClone();
                        var fc_Bar = fittedBarrel.DeepClone();

                        fc_Rec.Slots[1].ContainedItem = fc_Bar;

                        FinalCombos.Add(fc_Rec);
                    }

                }
            }

            foreach (var combo in FinalCombos)
            {
                var comboBlackList = AggregateBlacklistRecursively(combo);
                var temp_barrel = (WeaponMod)combo.Slots[1].ContainedItem;
                var barrelWhiteList = temp_barrel.Slots[0].Filters[0].Whitelist;

                var shortlistOfMuzzleDevices = inputList.Where(x => barrelWhiteList.Contains(x.Id) && !comboBlackList.Contains(x.Id)).ToList();

                HashSet<string> blacklistHashSet = new();
                blacklistHashSet.UnionWith(comboBlackList);

                var fittedMuzzledDevices = shortlistOfMuzzleDevices.Select(x => SMFS_Wrapper(x, inputList, mode, blacklistHashSet)).ToList();

                fittedMuzzledDevices = fittedMuzzledDevices.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList();

                if (fittedMuzzledDevices.Any())
                {
                    var bestMuzzle = fittedMuzzledDevices.First().DeepClone();

                    temp_barrel.Slots[0].ContainedItem = bestMuzzle;
                }
            }

            // Gotta remove all of the muzzle devices too - need to do this after the previous step
            List<Type> MuzzleTypes = new List<Type>()
                {
                    typeof(MuzzleDevice), typeof(Compensator), typeof(Flashhider), typeof(Silencer), typeof(CombMuzzleDevice)
                };
            var muzzles = inputList.Where(x => MuzzleTypes.Contains(x.GetType())).ToList();
            inputList.RemoveAll(x => muzzles.Contains(x));

            // Sort FinalCombos by the mode, select the best one, then aggregate the list of mods in that combo and add them back to the input list.
            FinalCombos = SortWeaponModListByMode(FinalCombos, mode);
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);

            inputList.AddRange(theList);

            return inputList;
        }

        private static List<WeaponMod> EnhancedLogic_SVDS(List<WeaponMod> inputList, string mode)
        {
            // This once will be pretty easy, on slots 6 and 7 of the SVDS are the SVDS UB, DustCover (and handguard) OR the SAG MK1 + CDC
            // UB + DC = (polymer) +7 ergo / (XRS-DRG) -1 recoil +8 ergo / (SVD modern) -6 recoil +7 ergo
            // SAG + CDC = -3 recoil and +13 ergo
            // so to rank:
            // SVD Modern = 0
            //? 5e56991336989c75ab4f03f6 - Modern
            //? 5e569a0156edd02abe09f27d - Top Rail
            // SAG + CDC = 1
            //? 5dfcd0e547101c39625f66f9 - SAG
            //? 5dfce88fe9dc277128008b2e - CDC
            // .XRS-DRG = 2
            //? 5e5699df2161e06ac158df6f - XRS-DRG
            // default = 3
            //? 5c471c2d2e22164bef5d077f - UB
            //? 5c471c6c2e221602b66cd9ae - Poly HG
            //? 5c471bd12e221602b4129c3a - Dust Cover

            List<string> removalList = new List<string>();
            removalList.Add("5e56991336989c75ab4f03f6");
            removalList.Add("5e569a0156edd02abe09f27d");
            removalList.Add("5dfcd0e547101c39625f66f9");
            removalList.Add("5dfce88fe9dc277128008b2e");
            removalList.Add("5e5699df2161e06ac158df6f");
            removalList.Add("5c471c2d2e22164bef5d077f");
            removalList.Add("5c471c6c2e221602b66cd9ae");
            removalList.Add("5c471bd12e221602b4129c3a");

            List<WeaponMod> FinalCombos = new();


            //! Might as well do this procedurally

            // Default combo - don't need to check that the defaults are in the inputList, as we know it will be there always
            WeaponMod dummy = new WeaponMod();
            dummy.Name = "Hi, I'm a dummy";
            Slot dummySlot1 = new Slot();
            Slot dummySlot2 = new Slot();
            Slot dummySlot3 = new Slot();

            dummySlot1.ContainedItem = inputList.Find(x => x.Id.Equals("5c471c2d2e22164bef5d077f")); // UB
            dummySlot2.ContainedItem = inputList.Find(x => x.Id.Equals("5c471c6c2e221602b66cd9ae")); // HG
            dummySlot3.ContainedItem = inputList.Find(x => x.Id.Equals("5c471bd12e221602b4129c3a")); // DC

            dummy.Slots.Add(dummySlot1);
            dummy.Slots.Add(dummySlot2);
            dummy.Slots.Add(dummySlot3);

            FinalCombos.Add(dummy);

            //. XRS combo
            if (inputList.Any(x => x.Id.Equals("5e5699df2161e06ac158df6f")))
            {
                var XRS_Clone = dummy.DeepClone();
                XRS_Clone.Slots[1].ContainedItem = inputList.Find(x => x.Id.Equals("5e5699df2161e06ac158df6f")); // HG
                FinalCombos.Add(XRS_Clone);
            }

            //. Modernization combo
            if (inputList.Any(x => x.Id.Equals("5e56991336989c75ab4f03f6")))
            {
                var Modern_Clone = dummy.DeepClone();

                if (inputList.Any(x => x.Id.Equals("5e569a0156edd02abe09f27d")))
                {
                    var handguard = inputList.Find(x => x.Id.Equals("5e56991336989c75ab4f03f6"));
                    var top_rail = inputList.Find(x => x.Id.Equals("5e569a0156edd02abe09f27d"));
                    handguard.Slots[6].ContainedItem = top_rail;

                    Modern_Clone.Slots[1].ContainedItem = handguard; // HG
                }
                else
                {
                    Modern_Clone.Slots[1].ContainedItem = inputList.Find(x => x.Id.Equals("5e56991336989c75ab4f03f6")); // HG
                }
                FinalCombos.Add(Modern_Clone);
            }

            // SAG combo
            if (inputList.Any(x => x.Id.Equals("5dfcd0e547101c39625f66f9")) && inputList.Any(x => x.Id.Equals("5dfce88fe9dc277128008b2e")))
            {
                var SAG_Clone = dummy.DeepClone();
                SAG_Clone.Slots[0].ContainedItem = inputList.Find(x => x.Id.Equals("5dfcd0e547101c39625f66f9")); // UB
                SAG_Clone.Slots[1].ContainedItem = null;
                SAG_Clone.Slots[2].ContainedItem = inputList.Find(x => x.Id.Equals("5dfce88fe9dc277128008b2e")); // DC

                FinalCombos.Add(SAG_Clone);
            }

            // Remove all of the mods we're looking at
            inputList.RemoveAll(x => removalList.Contains(x.Id));

            // Sort the combos by the mode
            FinalCombos = SortWeaponModListByMode(FinalCombos, mode);

            // Get the best one, add those mods back to the input list and return that.
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);
            inputList.AddRange(theList);

            return inputList;
        }

        //Currently used by the SA-58 and the G36
        public static List<WeaponMod> EnhancedLogic_Handguards_Barrels(List<WeaponMod> inputList, string mode)
        {
            var barrels = inputList.Where(x => x.GetType() == typeof(Barrel)).ToList();
            inputList.RemoveAll(x => barrels.Contains(x));

            var handguards = inputList.Where(x => x.GetType() == typeof(Handguard)).ToList();
            inputList.RemoveAll(x => handguards.Contains(x));

            List<WeaponMod> fittedBarrels = new List<WeaponMod>();
            HashSet<string> temp_BL = new HashSet<string>();
            foreach (var barrel in barrels)
            {
                fittedBarrels.Add((WeaponMod)SMFS_Wrapper(barrel, inputList, mode, temp_BL));
            }

            List<WeaponMod> fittedHandies = new List<WeaponMod>();
            temp_BL = new HashSet<string>();
            foreach (var handy in handguards)
            {
                fittedHandies.Add((WeaponMod)SMFS_Wrapper(handy, inputList, mode, temp_BL));
            }

            List<WeaponMod> FinalCombos = new();

            foreach (var fitBarrel in fittedBarrels)
            {
                // Get the shortlist of compatible combos with this barrel
                var shortlist = fittedHandies.Where(
                        (x) =>
                        !x.ConflictingItems.Contains(fitBarrel.Id) && // Hand Guard
                        !fitBarrel.ConflictingItems.Contains(x.Id)    // Barrel
                    ).ToList();

                // Make a dummy slot, sort the combos by the mode, select the best one.
                if (shortlist.Count > 0)
                {
                    shortlist = SortWeaponModListByMode(shortlist, mode);
                    var selectedGBcombo = shortlist.First();

                    // We're going to make a dummy weaponMod and store the combo in it, as that way we can use it with existing functions for sorting and comparing.
                    WeaponMod dummy = new WeaponMod();
                    dummy.Name = "Hi, I'm a dummy";
                    Slot dummySlot1 = new Slot();
                    Slot dummySlot2 = new Slot();

                    dummySlot1.ContainedItem = selectedGBcombo;
                    dummySlot2.ContainedItem = fitBarrel;

                    dummy.Slots.Add(dummySlot1);
                    dummy.Slots.Add(dummySlot2);

                    FinalCombos.Add(dummy);
                }
            }

            // Sort the combos by the mode
            FinalCombos = SortWeaponModListByMode(FinalCombos, mode);

            // Get the best one, add those mods back to the input list and return that.
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);

            inputList.AddRange(theList);


            return inputList;
        }
        public static List<WeaponMod> EnhancedLogic_AUG(List<WeaponMod> inputList, string mode)
        {
            var barrels = inputList.Where(x => x.GetType() == typeof(Barrel)).ToList();

            List<WeaponMod> fittedBarrels = new List<WeaponMod>();
            HashSet<string> temp_BL = new HashSet<string>();

            // First let's get all of the T4AUG combos
            var T4AUG = inputList.Find(x => x.Id.Equals("630f2982cdb9e392db0cbcc7"));
            if (T4AUG != null)
            {

                // Add the conflicting items to the BL
                temp_BL = temp_BL.Union(T4AUG.ConflictingItems).ToHashSet();
                foreach (var barrel in barrels)
                {
                    // Clone the items, add the T4AUG, have it choose the best muzzle device, add it to the comparision list.
                    var clone_T4AUG = T4AUG.DeepClone();
                    var clone_Barrel = barrel.DeepClone();

                    clone_Barrel.Slots[1].ContainedItem = clone_T4AUG;

                    fittedBarrels.Add((WeaponMod)SMFS_Wrapper(clone_Barrel, inputList, mode, temp_BL));
                }

                // Then, let's remove the T4AUG from the list, and fit everything !T4AUG
                inputList.RemoveAll(x => x.Id.Equals("630f2982cdb9e392db0cbcc7"));
                foreach (var barrel in barrels)
                {
                    temp_BL = new();
                    var clone_Barrel = barrel.DeepClone();

                    fittedBarrels.Add((WeaponMod)SMFS_Wrapper(clone_Barrel, inputList, mode, temp_BL));
                }


            }
            else
            {
                // If we don't have the T4AUG, just fit out the barrels

                foreach (var barrel in barrels)
                {
                    temp_BL = new();
                    var clone_Barrel = barrel.DeepClone();

                    fittedBarrels.Add((WeaponMod)SMFS_Wrapper(clone_Barrel, inputList, mode, temp_BL));
                }
            }

            if (fittedBarrels.Any())
            {
                // Sort the combos by the mode
                fittedBarrels = SortWeaponModListByMode(fittedBarrels, mode);

                // Get the best one
                var thatResult = fittedBarrels.First();
                var theList = AggregateListOfModsRecursively(thatResult);

                // To ensure that we have only the mods on theList, we will remove any mods on the whitelists of the barrel slots, simple eh?
                var quickRemovalList = new List<string>();
                foreach (var slot in thatResult.Slots)
                {
                    quickRemovalList.AddRange(slot.Filters[0].Whitelist);
                }

                inputList.RemoveAll(x => quickRemovalList.Contains(x.Id));

                // Then we add those items on the list to it.
                inputList.AddRange(theList);
            }

            return inputList;
        }

        private static List<WeaponMod> EnhancedLogic_Kalashnikovs_GasTubes_Handguards_DustCovers(List<WeaponMod> inputList, string mode)
        {
            var gasblocks = inputList.Where(x => x.GetType() == typeof(GasBlock)).ToList();
            inputList.RemoveAll(x => gasblocks.Contains(x));

            var handguards = inputList.Where(x => x.GetType() == typeof(Handguard)).ToList();
            inputList.RemoveAll(x => handguards.Contains(x));

            var receivers = inputList.Where((x) => x.GetType() == typeof(Receiver)).ToList();
            inputList.RemoveAll(x => receivers.Contains(x));

            List<WeaponMod> fittedGasBlocks = new List<WeaponMod>();
            foreach (var gasblock in gasblocks)
            {
                //Don't need to account for the UltiMAK M1-B as it can't fit any foregrips anyway
                foreach (var handguard in handguards)
                {
                    // Check if the HG fits with the gasblock
                    if (gasblock.Slots[0].Filters[0].Whitelist.Contains(handguard.Id))
                    {
                        // If yes, clone them both, fit them together and then return them to the list
                        var clone_GB = gasblock.DeepClone();
                        var clone_HG = handguard.DeepClone();

                        // Need to fit the HG before adding it to the GB
                        HashSet<string> temp_BL = new HashSet<string>();
                        clone_HG = (WeaponMod)SMFS_Wrapper(clone_HG, inputList, mode, temp_BL);

                        clone_GB.Slots[0].ContainedItem = clone_HG;
                        fittedGasBlocks.Add(clone_GB);
                    }
                }
            }

            // We should now have a list of all of the GB combos. Fortunately, as we don't need to consider how the dust covers are fitted, we can just use them as-is.
            // Additionally, as we have a limited number of dust covers, a way to slim down the problem is to get the best compatible handguard/gastube combo for that dust cover
            // and then compare the these combinations
            List<WeaponMod> FinalCombos = new();
            foreach (var dustcover in receivers)
            {
                // Get the shortlist of compatible combos with this DC
                var shortlistOfGasBlocks = fittedGasBlocks.Where(
                        (x) =>
                        !x.Slots[0].ContainedItem.ConflictingItems.Contains(dustcover.Id) && // Hand Guard
                        !dustcover.ConflictingItems.Contains(x.Slots[0].ContainedItem.Id)    // Dust Cover
                    ).ToList();

                // Make a dummy slot, sort the combos by the mode, select the best one.
                shortlistOfGasBlocks = SortWeaponModListByMode(shortlistOfGasBlocks, mode);
                var selectedGBcombo = shortlistOfGasBlocks.First();

                // We're going to make a dummy weaponMod and store the combo in it, as that way we can use it with existing functions for sorting and comparing.
                WeaponMod dummy = new WeaponMod();
                dummy.Name = "Hi, I'm a dummy";
                Slot dummySlot1 = new Slot();
                Slot dummySlot2 = new Slot();

                dummySlot1.ContainedItem = selectedGBcombo;
                dummySlot2.ContainedItem = dustcover;

                dummy.Slots.Add(dummySlot1);
                dummy.Slots.Add(dummySlot2);

                FinalCombos.Add(dummy);
            }

            // Sort the combos by the mode
            FinalCombos = SortWeaponModListByMode(FinalCombos, mode);

            // Get the best one, add those mods back to the input list and return that.
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);

            inputList.AddRange(theList);



            return inputList;
        }
        private static List<WeaponMod> EnhancedLogic_Kalashnikovs_PistolGrips_Stocks(List<WeaponMod> inputList)
        {
            //todo This entire logic lmao
            //? Maybe it can be made generic for both ARs and AKs?
            return inputList;
        }

        private static List<WeaponMod> EnhancedLogic_Kalashnikovs(List<WeaponMod> inputList, string mode)
        {
            inputList = EnhancedLogic_Kalashnikovs_GasTubes_Handguards_DustCovers(inputList, mode);

            // Will need to add a check for if the AK is of a fixed stock type or not as this function is only relevant for them.
            inputList = EnhancedLogic_Kalashnikovs_PistolGrips_Stocks(inputList);

            return inputList;
        }
        //? This allows for fitting mods to a CI as per the fitting mode
        public static CompoundItem SMFS_Wrapper(CompoundItem CI, List<WeaponMod> inputList, string mode, HashSet<string> CommonBlackListIDs)
        {
            // First clone the Item, so we don't pollute the input
            var localClone = CI.DeepClone();

            List<string> AR15_type = new List<string>
            {
                "5c07c60e0db834002330051f", // ADAR
                "5447a9cd4bdc2dbd208b4567", // M4A1
                "5d43021ca4b9362eab4b5e25", // TX-15
                "5bb2475ed4351e00853264e3"  // 416
            };

            if (AR15_type.Contains(CI.Id))
            {
                inputList = EnhancedLogic_AR15_Uppers(inputList, mode);
            }
            else if (CI.Name.Contains("Kalashnikov"))
            {
                inputList = EnhancedLogic_Kalashnikovs(inputList, mode);
            }
            // G36 (left) and SA-58 (right)
            else if (CI.Id.Equals("623063e994fc3f7b302a9696") || CI.Id.Equals("5b0bbe4e5acfc40dc528a72d"))
            {
                inputList = EnhancedLogic_Handguards_Barrels(inputList, mode);
            }
            // AUG A1 and A3
            else if (CI.Id.Equals("62e7c4fba689e8c9c50dfc38") || CI.Id.Equals("63171672192e68c5460cebc5"))
            {
                inputList = EnhancedLogic_AUG(inputList, mode);
            }
            else if (CI.Id.Equals("5c46fbd72e2216398b5a8c9c"))
            {
                inputList = EnhancedLogic_SVDS(inputList, mode);
            }

            //? Now back to our regular programming...

            // Then for each slot of the local clone, we're going to select a mod for that slot using the pimrary function
            foreach (var slot in localClone.Slots)
            {
                //Remove any default mods, they've already been added into the input list
                slot.ContainedItem = null;

                var temp = SelectModForSlot(slot, inputList, mode, CommonBlackListIDs);

                // If the function finds a choice that isn't an empty WepMod, insert it into the slot
                if (!temp.Name.Contains("ERROR:"))
                {
                    slot.ContainedItem = temp;
                }
            }
            // You should get back a fully-fitted CompItem be it a Weapon or a WeaponMod
            return localClone;
        }

        // I guess we need to do the blocker comparision at the time of fitting, otherwise we can't know the slot details
        public static WeaponMod SelectModForSlot(Slot slot, List<WeaponMod> inputList, string mode, HashSet<string> CommonBlackListIds)
        {

            //? Remember, don't deepclone the input list!! You don't need to, since you DC each item yo utake from it, no pollution is risked and it makes recursion possible in terms of speed
            //var inputList = inputList.DeepClone();

            WeaponMod result = new();   // The Mod that was promised.
            result.Name = $"ERROR: I'm a mod which should have been changed for {slot.Name}";

            // Get a list of the candidate mods, we also don't allow for mods which have been blacklisted
            var candidates = inputList.Where(x => slot.Filters[0].Whitelist.Contains(x.Id) && !CommonBlackListIds.Contains(x.Id)).ToList();

            //? This is here incase there are any duplciates in the candidates list, which might cause a problem in the branch selection if unaddressed
            candidates = candidates.Distinct().ToList();

            //! Solo candidate check
            if (candidates.Count == 1)
            {
                //Console.WriteLine("One of a kind!");
                //? Right, probs need to fit this out actually first lmao
                candidates[0] = (WeaponMod)SMFS_Wrapper(candidates[0], inputList, mode, CommonBlackListIds);
                result = candidates[0];

            }
            //! More than one candidate
            else
            {
                var blockers = candidates.Where(x => x.ConflictingItems.Count > 0).ToList();

                //! If any blockers
                if (blockers.Count > 0)
                {
                    WeaponMod candidateBlocker = new();
                    //! Solo blocker check
                    if (blockers.Count == 1)
                    {
                        candidateBlocker = blockers[0];
                    }
                    else
                    {
                        //! BLOCKER vs BLOCKER
                        //todo What if the blockers can have things attached to them? Eg, Barrels. Let's assume that any attachments for a blocker could be mounted to other blockers too and thus can be ignored for now.
                        //? Actually this is a problem because say, handguards are taken at face value instead of with their real value.
                        //! So for now we are fitting blocker mods, however I do wonder if this might cause an issue as FitCompoundItem_Complex() function doesn't account of blockers itself?
                        // Perhaps we should just fix up the blocker processer function, and get rid of this part of the new fittign method entirely?
                        // We could easily take what is here for setting up the competition of mods, and then use them in the pre-processing step
                        //?Radical idea: remove forbidden mods from the whitelist of thier slot??? this could be a problem as we don't always have access to the slot in question
                        //?This would work with AK and other simple weapons, but could be an issue with the AR15 type guns...
                        //? For AKs, just loop through the slots of the weapon and modify the whitelists
                        //? for AR15, loop through the slots of the mods in the MWL, and remove the ids from those white lists....
                        //? Would need to check, but we could even make use ofg the blacklist for a slot, and change the shotlist logic to take into account the mask of white subtracted by black.
                        //? Of course, we could just populate our own master black list as well, which might be the easiest option
                        //? I'm trying to avoid having a seperate blocker processing step, as notionally it really should be done at the time of fitting for that slot.
                        //? A Master black list could be a HashSet
                        //? Logically, it shouldn't matter which direction we encounter a blocker pair from

                        List<WeaponMod> fittedBlockers = new();
                        foreach (var blocker in blockers)
                        {
                            fittedBlockers.Add((WeaponMod)SMFS_Wrapper(blocker, inputList, mode, CommonBlackListIds));
                        }
                        blockers.Clear();
                        blockers.AddRange(fittedBlockers);

                        //! Select Blocker from sorted list
                        blockers = SortWeaponModListForSlotByMode(slot, blockers, mode);
                        candidateBlocker = blockers.First();

                    }

                    //!THEN BLOCKER-CHAMP vs nonBLOCKERS

                    // We need to get the Mods which will go in the same slot, are of the same type of item, the mods which are blocked, and not the blocker itself again, natch.
                    var competitorMods = inputList.Where(x =>
                        (candidates.Contains(x) &&
                        x.Id != candidateBlocker.Id) || (
                        candidateBlocker.ConflictingItems.Contains(x.Id) &&
                        x.Id != candidateBlocker.Id)
                    ).ToList();

                    var nonblockingList = inputList.Where(x => x.ConflictingItems.Count == 0).ToList();

                    // Let's now sort the competitors into their types and fit them out.
                    Dictionary<Type, HashSet<WeaponMod>> typeDictionary = new();

                    foreach (WeaponMod weaponMod in competitorMods)
                    {
                        var temp = typeDictionary.GetValueOrDefault(weaponMod.GetType());
                        var loop_WeaponMod = weaponMod.DeepClone();

                        // Fit out the mod, eg, butt-pad onto stock.
                        //? Maybe this is why you had the 2nd method for fitting? So that you could limit the fitting
                        //todo need to remove the blocker from the list that is fed into this, otherwise you get blocker vs blocker
                        //! Right so here is the issue; you need to be able to compare the blocker with the thigns it will block, and those things need to be fully fitted
                        //! We also need to actually stop the loosing blockers fro being fitted, as it seems later they can be chosen anyway!

                        // Also need to look at why the B-33 check has both a Vltor and a Troy handgaurd at the same time
                        loop_WeaponMod = (WeaponMod)SMFS_Wrapper(loop_WeaponMod, nonblockingList, mode, CommonBlackListIds);

                        // If the key already exists, add the weapon mod to it
                        if (temp != null)
                        {
                            temp.Add(loop_WeaponMod);
                        }
                        // Otherwise add it
                        else
                        {
                            HashSet<WeaponMod> newHashSet = new();
                            newHashSet.Add(loop_WeaponMod);
                            typeDictionary.Add(weaponMod.GetType(), newHashSet);
                        }
                    }
                    // Now that we have the Dict, we can now go through each key, pick the best one and add it to a list for summing up.
                    List<WeaponMod> summationList = new();
                    foreach (var key in typeDictionary.Keys)
                    {
                        var values = typeDictionary[key].ToList();

                        // Sort values to mode and pick the best one.
                        values = SortWeaponModListForSlotByMode(slot, values, mode);
                        summationList.Add(values.First());
                    }

                    // Let's now get the results for a comparision
                    var nonBlockingCompetitionResult = GetAttachmentsTotals_Recursive(summationList);
                    var blockerCandidateResult = GetCompoundItemTotals_RecoilFloat<WeaponMod>(candidateBlocker);

                    // Put the blocker and the non-blocking candidate together, we ensure the non-blocker is the right one from the list by comparing against the slot whitelist
                    var selectionList = new List<WeaponMod>();
                    selectionList.Add(candidateBlocker);
                    selectionList.AddRange(summationList.Where(x => slot.Filters[0].Whitelist.Contains(x.Id)));

                    // Compare the candidates by the fitting mode
                    //todo Add in a check for the price of options, will need to add that function to WG_Market first
                    if (mode == "recoil")
                    {
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with recoil: {blockerCandidateResult.TotalRecoil < nonBlockingCompetitionResult.TotalRecoil}");
                        //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                        //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                        if (blockerCandidateResult.TotalRecoil < nonBlockingCompetitionResult.TotalRecoil)
                        {

                            result = candidateBlocker;
                            CommonBlackListIds.UnionWith(summationList.Select(x => x.Id));
                        }
                        else
                        {
                            selectionList.Remove(candidateBlocker);
                            result = selectionList[0];

                            CommonBlackListIds.UnionWith(blockers.Select(x => x.Id));
                        }
                    }
                    else if (mode == "Meta Recoil")
                    {
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with Meta Recoil: {(blockerCandidateResult.TotalRecoil < nonBlockingCompetitionResult.TotalRecoil)}");
                        //Console.WriteLine("===== BLOCKER =====");
                        //PrintAttachedModNames_Recursively(candidateBlocker, 0);
                        //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                        //Console.WriteLine("");

                        //Console.WriteLine("===== nonBlocking =====");
                        //foreach (var item in summationList)
                        //{
                        //    PrintAttachedModNames_Recursively(item, 0);
                        //}
                        //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");
                        //Console.WriteLine("");
                        //Console.WriteLine("");
                        if ((blockerCandidateResult.TotalRecoil < nonBlockingCompetitionResult.TotalRecoil))
                        {

                            result = candidateBlocker;
                            CommonBlackListIds.UnionWith(summationList.Select(x => x.Id));
                        }
                        else
                        {
                            selectionList.Remove(candidateBlocker);
                            result = selectionList[0];
                            CommonBlackListIds.UnionWith(blockers.Select(x => x.Id));
                        }

                    }
                    else if (mode == "ergo")
                    {
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with ergo: {blockerCandidateResult.TotalErgo > nonBlockingCompetitionResult.TotalErgo}");
                        //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                        //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                        if (blockerCandidateResult.TotalErgo > nonBlockingCompetitionResult.TotalErgo)
                        {

                            result = candidateBlocker;
                            CommonBlackListIds.UnionWith(summationList.Select(x => x.Id));
                        }
                        else
                        {
                            selectionList.Remove(candidateBlocker);
                            result = selectionList[0];
                            CommonBlackListIds.UnionWith(blockers.Select(x => x.Id));
                        }

                    }
                    else if (mode == "Meta Ergonomics")
                    {
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with Meta Ergo: {(blockerCandidateResult.TotalErgo > nonBlockingCompetitionResult.TotalErgo)}");
                        //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                        //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                        if ((blockerCandidateResult.TotalErgo > nonBlockingCompetitionResult.TotalErgo))
                        {
                            result = candidateBlocker;
                            CommonBlackListIds.UnionWith(summationList.Select(x => x.Id));
                        }
                        else
                        {
                            selectionList.Remove(candidateBlocker);
                            result = selectionList[0];
                            CommonBlackListIds.UnionWith(blockers.Select(x => x.Id));
                        }
                    }
                }

                //! No BLOCKERs, just nonBlockers
                else
                {
                    //!Just select the best option from the candidates
                    List<WeaponMod> options = new();

                    foreach (WeaponMod weaponMod in candidates)
                    {
                        // This should fit out the mod so that it can be all it can be, and then we can add the result to the options list.
                        options.Add((WeaponMod)SMFS_Wrapper(weaponMod, inputList, mode, CommonBlackListIds));
                    }

                    if (options.Count > 0)
                    {
                        // Sort options by mode and select the best one
                        options = SortWeaponModListForSlotByMode(slot, options, mode);
                        result = options.First();
                    }
                }
            }
            return result;
        }

        // Get a list of all possible items for a CI
        public static List<string> CreateMasterWhiteListIds(CompoundItem CompItem, List<WeaponMod> AvailableWeaponMods)
        {
            HashSet<string> MasterWhiteList = new HashSet<string>();

            if (AvailableWeaponMods.Any() && AvailableWeaponMods != null)
            {
                // Assign the AWM mod IDs to a list for ease of access, setup HashSet that will be returned
                var AWM_Ids = AvailableWeaponMods.Select(x => x.Id).ToList();
                var AWM_Names = AvailableWeaponMods.Select(x => x.Name).ToList();

                // Get the Ids of all items that will attach
                foreach (Slot slot in CompItem.Slots)
                {
                    //We add the IDs which are a part of our AWM_Ids, as we are only concerned with mods which are available 
                    var slotWhiteList = slot.Filters[0].Whitelist;
                    var AWM_Ids_on_SlotWhiteList = AWM_Ids.Where(id => slotWhiteList.Contains(id)).ToList();

                    MasterWhiteList.UnionWith(AWM_Ids_on_SlotWhiteList);
                }

                // We now need a HashSet for storing the result of the recursive check, as we need to find the valid Ids of mods which can connect to mods.
                var cache = new HashSet<string>();
                foreach (string item in MasterWhiteList)
                {
                    // A quick null check
                    var found = AvailableWeaponMods.Find(x => x.Id == item);
                    if (found != null)
                    {
                        // Recursion!
                        var result = CreateMasterWhiteListIds(found, AvailableWeaponMods);
                        cache.UnionWith(result);
                    }
                }
                // Unite the MWL with the results of recursion and then return it
                MasterWhiteList.UnionWith(cache);
            }


            return MasterWhiteList.ToList();
        }
        public static bool CheckAllRequiredSlotsFilled(CompoundItem input, List<WeaponMod> candidateList)
        {
            bool result = true;

            foreach (var slot in input.Slots)
            {
                if (slot.Required == true && slot.ContainedItem == null)
                {
                    result = false;
                    //Console.WriteLine("Missing Requirement");
                    //Console.WriteLine(input.Name);
                    //Console.WriteLine(slot.Name);
                }
                else if (slot.Required == true && slot.ContainedItem != null)
                {
                    result = CheckAllRequiredSlotsFilled((CompoundItem)slot.ContainedItem, candidateList);
                }
            }

            return result;
        }

        public static bool CheckAllRequiredSlotsFilled(CompoundItem input)
        {
            bool result = true;

            foreach (var slot in input.Slots)
            {
                if (slot.Required == true && slot.ContainedItem == null)
                {
                    result = false;
                    //Console.WriteLine("Missing Requirement");
                    //Console.WriteLine(input.Name);
                    //Console.WriteLine(slot.Name);
                }
                else if (slot.Required == true && slot.ContainedItem != null)
                {
                    result = CheckAllRequiredSlotsFilled((CompoundItem)slot.ContainedItem);
                }
            }

            return result;
        }

        public static (int TotalErgo, double TotalRecoil) GetCompoundItemTotals_RecoilFloat<T>(this CompoundItem item)
        {
            float sumErgo = -1;
            float sumRecoil = -1;
            List<WeaponMod> Children = AccumulateMods(item.Slots);
            var (TotalErgo, TotalRecoil) = GetAttachmentsTotals(Children);


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

        // Returns a flat list of attached mods to a given parent's slots list.
        public static List<WeaponMod> AccumulateMods(this List<Slot> slots)
        {
            List<WeaponMod> attachedMods = new List<WeaponMod>();
            IEnumerable<Slot> notNulls = slots.Where(x => x.ContainedItem != null);

            foreach (Slot slot in notNulls)
            {
                WeaponMod wm = (WeaponMod)slot.ContainedItem;
                attachedMods.Add(wm);
                attachedMods.AddRange(AccumulateMods(wm.Slots));
            }

            return attachedMods;
        }

        // Takes a flat list of WeaponMods and sums thier ergo and recoil attributes.
        public static (float TotalErgo, float TotalRecoil) GetAttachmentsTotals(List<WeaponMod> attachments)
        {
            float t_ergo = 0;
            float t_recoil = 0;

            foreach (WeaponMod attachment in attachments)
            {
                t_ergo += attachment.Ergonomics;
                t_recoil += attachment.Recoil;
            }

            return (t_ergo, t_recoil);
        }

        public static (int TotalErgo, double TotalRecoil) GetAttachmentsTotals_Recursive(List<WeaponMod> attachments)
        {
            int t_ergo = 0;
            double t_recoil = 0;

            foreach (WeaponMod attachment in attachments)
            {
                var result = GetCompoundItemTotals_RecoilFloat<WeaponMod>(attachment);
                t_ergo += result.TotalErgo;
                t_recoil += result.TotalRecoil;
            }

            return (t_ergo, t_recoil);
        }

        public static void PrintAttachedModNames_Recursively(CompoundItem CI, int depth)
        {
            for (int i = 0; i < depth; i++)
            {
                Console.Write("\t");
            }
            Console.WriteLine(CI.Name);

            foreach (var slot in CI.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    var temp = (CompoundItem)slot.ContainedItem;
                    PrintAttachedModNames_Recursively(temp, depth + 1);
                }
            }
        }

        public static List<string> AggregateBlacklistRecursively(CompoundItem CI)
        {
            List<string> result = new();
            result.AddRange(CI.ConflictingItems);
            foreach (var slot in CI.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    result.AddRange(AggregateBlacklistRecursively((CompoundItem)slot.ContainedItem));
                }
            }
            return result;
        }
        public static List<string> AggregateIdsRecursively(CompoundItem CI)
        {
            List<string> result = new();
            result.Add(CI.Id);
            foreach (var slot in CI.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    result.AddRange(AggregateIdsRecursively((CompoundItem)slot.ContainedItem));
                }
            }
            return result;
        }
        // Does not include the ID of the weapon itself!
        public static List<string> AggregateAttachedModsRecursively(Weapon weapon)
        {
            List<string> result = new();
            foreach (var slot in weapon.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    result.AddRange(AggregateIdsRecursively((CompoundItem)slot.ContainedItem));
                }
            }
            return result;
        }

        public static bool CheckThatAllRequiredSlotsFilled(CompoundItem CI)
        {
            bool result = true;

            foreach (var slot in CI.Slots)
            {
                if (slot.Required == true && slot.ContainedItem == null && result == true)
                {
                    result = false;
                }
                else if (slot.Required == true && slot.ContainedItem != null)
                {
                    var temp = CheckThatAllRequiredSlotsFilled((CompoundItem)slot.ContainedItem);

                    if (result == true && temp == false)
                    {
                        result = false;
                    }
                }
            }
            return result;
        }

        //todo add to this so that it will return if the problem is due to conflicting items or missing required slots
        public static bool CheckIfCompoundItemIsValid(CompoundItem CI)
        {
            bool result = true;

            var blacklist = AggregateBlacklistRecursively(CI);
            var Ids = AggregateIdsRecursively(CI);

            var intersection = blacklist.Intersect(Ids);

            if (intersection.Any())
            {
                result = false;
            }
            else
            {
                result = CheckThatAllRequiredSlotsFilled(CI);
            }

            return result;
        }

        public static List<WeaponMod> AggregateListOfModsRecursively(WeaponMod theMod)
        {
            List<WeaponMod> result = new();
            result.Add(theMod);
            foreach (var slot in theMod.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    result.AddRange(AggregateListOfModsRecursively((WeaponMod)slot.ContainedItem));
                }
            }
            return result;
        }
    }
}
