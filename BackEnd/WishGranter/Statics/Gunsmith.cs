using Force.DeepCloner;
using RatStash;

namespace WishGranter.Statics
{
    public enum FittingPriority
    {
        MetaRecoil,
        Recoil,
        MetaErgonomics,
        Ergonomics
    }



    // This class will handle all of the fittings logic
    public static class Gunsmith
    {
        // Our new method which returns that new format
        public static PurchasedMods GetPurchasedMods(BasePreset basePreset, GunsmithParameters parameters) 
        {
            var SelectedMods = AggregateAttachedModsRecursively(FitWeapon(basePreset, parameters)).ToList();

            var SelectedModIds = SelectedMods.Select(x => x.Id).ToList();

            var marketEntries = Market.GetPurchaseOfferTraderOrFleaList(SelectedModIds, parameters.playerLevel, parameters.fleaMarket).Where(x=> x != null).ToList();

            List<PurchasedMod> PurchasedMods = new List<PurchasedMod>();

            foreach (var id in SelectedModIds)
            { 
                var mod = SelectedMods.First(x => x.Id == id);
                var marketEntry = marketEntries.FirstOrDefault(x => x.Id == id);
                if(marketEntry == null)
                {
                    PurchasedMods.Add(new PurchasedMod(mod, null));
                }
                else
                {
                    PurchasedMods.Add(new PurchasedMod(mod, marketEntry.PurchaseOffer));
                }             
            }
            
            return new PurchasedMods(PurchasedMods);
        }

        public static Weapon FitWeapon(BasePreset basePreset, GunsmithParameters parameters)
        {
            return FitWeapon(basePreset, parameters.priority, parameters.muzzleType, parameters.playerLevel, parameters.fleaMarket, parameters.exclusionList);
        }
        public static Weapon FitWeapon(BasePreset basePreset, FittingPriority priority, MuzzleType muzzleType, int playerLevel, bool fleaMarket, List<string>? exclusionList = null)
        {
            // First clone the Item, so we don't pollute the input
            var localClone = basePreset.Weapon.DeepClone();

            // Next, get the Mods that weapon is going to potentially use.
            var modsForWeapon = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(localClone.Id, muzzleType, playerLevel, fleaMarket);
            modsForWeapon.AddRange(basePreset.WeaponMods);

            // If the weapon is a preset, we will add any currently attached mods to the list if they're not there already.
            modsForWeapon = modsForWeapon.Union(AggregateAttachedModsRecursively(localClone)).ToList();

            // We will also remove all currently attached Mods to the weapon, to ensure that they go through the EnhancedLogic compatibility checks with the rest.
            foreach (var slot in localClone.Slots)
            {
                slot.ContainedItem = null;
            }

            // Remove any items that have been explicitly excluded, if there are any.
            if (exclusionList != null)
                modsForWeapon = modsForWeapon.Where(x => !exclusionList.Contains(x.Id)).ToList();

            // Nex, we need to go through EnhancedLogic processing.
            modsForWeapon = EnhancedLogic_Function(localClone, modsForWeapon, priority);

            // Finally, we send the prepared list, weappon and other params into the SimpleFitting recursion and return that
            return (Weapon)SimpleFitting(localClone, modsForWeapon, priority);
        }

        // This can accept either a naked gun or a fitted preset gun.
        public static Weapon FitWeapon(Weapon weapon, FittingPriority priority, MuzzleType muzzleType, int playerLevel, bool fleaMarket, List<string>? exclusionList = null)
        {
            // First clone the Item, so we don't pollute the input
            var localClone = weapon.DeepClone();

            // Next, get the Mods that weapon is going to potentially use.
            var modsForWeapon = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(localClone.Id, muzzleType, playerLevel, fleaMarket);

            // If the weapon is a preset, we will add any currently attached mods to the list if they're not there already.
            modsForWeapon = modsForWeapon.Union(AggregateAttachedModsRecursively(localClone)).ToList();

            // We will also remove all currently attached Mods to the weapon, to ensure that they go through the EnhancedLogic compatibility checks with the rest.
            foreach (var slot in localClone.Slots)
            {
                slot.ContainedItem = null;
            }

            // Remove any items that have been explicitly excluded, if there are any.
            if (exclusionList != null)
                modsForWeapon = modsForWeapon.Where(x => !exclusionList.Contains(x.Id)).ToList();

            // Nex, we need to go through EnhancedLogic processing.
            modsForWeapon = EnhancedLogic_Function(localClone, modsForWeapon, priority);

            // Finally, we send the prepared list, weappon and other params into the SimpleFitting recursion and return that
            return (Weapon) SimpleFitting(localClone, modsForWeapon, priority);
        }

        // Contract: we pass in first the base weapon and the starting input list. As we recursively go through the fitting process, we use a selected mod as the CompItem, but keep the same input list.
        // Said List should have been provided by MWP's GetShortListOfModsForCompundItemWithParams() function.
        public static CompoundItem SimpleFitting(CompoundItem CompItem, in List<WeaponMod> InputMods, FittingPriority mode)
        {
            // Need to do this so that mutation doesn't spread.
            var CompItemClone = CompItem.DeepClone();

            // Look at every slot for the current CompItem
            foreach(var slot in CompItemClone.Slots)
            {
                // Check if we have any mods for that slot, we save a variable of these candidates as we will have a few operations with them
                var candidates = InputMods.Where(x => slot.Filters[0].Whitelist.Contains(x.Id)).ToList();
                if (candidates.Any())
                {
                    // If there's only one candidate, we jsut use it, shrimple as
                    if(candidates.Count == 1)
                    {
                        var item = candidates[0];
                        SimpleFitting(item, InputMods, mode);
                        slot.ContainedItem = item;
                    }
                    // The other situation is to have more than one. We no longer need to consider blockers as they are all handled by EnhancedLogic proparation methods.
                    // So, let's just fit out the mods and then choose the best combo.
                    else
                    {
                        List<WeaponMod> options = new();
                        foreach (var candidate in candidates)
                        {
                            options.Add((WeaponMod) SimpleFitting(candidate, InputMods, mode));
                        }

                        options = SortWeaponModListByMode(options, mode, slot);
                        slot.ContainedItem = options.First();
                    }
                }
            }
            return CompItemClone;
        }
        // Need the blacklist for AR-15 weapons and thier complicated barrel context
        public static CompoundItem SimpleFitting(CompoundItem CompItem, in List<WeaponMod> InputMods, FittingPriority mode, HashSet<string> blackList)
        {
            // Need to do this so that mutation doesn't spread.
            var CompItemClone = CompItem.DeepClone();

            // Look at every slot for the current CompItem
            foreach (var slot in CompItemClone.Slots)
            {
                // Check if we have any mods for that slot, we save a variable of these candidates as we will have a few operations with them
                var candidates = InputMods.Where(x => slot.Filters[0].Whitelist.Contains(x.Id) && !blackList.Contains(x.Id)).ToList();
                if (candidates.Any())
                {
                    // If there's only one candidate, we jsut use it, shrimple as
                    if (candidates.Count == 1)
                    {
                        var item = candidates[0];
                        SimpleFitting(item, InputMods, mode);
                        slot.ContainedItem = item;
                    }
                    // The other situation is to have more than one. We no longer need to consider blockers as they are all handled by EnhancedLogic proparation methods.
                    // So, let's just fit out the mods and then choose the best combo.
                    else
                    {
                        List<WeaponMod> options = new();
                        foreach (var candidate in candidates)
                        {
                            options.Add((WeaponMod)SimpleFitting(candidate, InputMods, mode));
                        }

                        options = SortWeaponModListByMode(options, mode, slot);
                        slot.ContainedItem = options.First();
                    }
                }
            }
            return CompItemClone;
        }
        //? Might be an idea to spin these sorting functions off into thier own class - follow MechTurk's idea of the ModList Class which would also have the build parameters as attributes.
        //? For now, maintain the current limitation of trader deals for mods.
        public static List<WeaponMod> SortWeaponModListByMode(List<WeaponMod> inputList, FittingPriority mode, Slot? slot = null)
        {
            if(inputList.Count > 0)
            {
                if (slot != null)
                {
                    // If we're dealing with a muzzle slot item, we want to remove things like thread protectors in these modes because otherwise they will be chosen over useful attachments.
                    if (slot.Name.Equals("mod_muzzle") && (mode == FittingPriority.MetaErgonomics || mode == FittingPriority.Ergonomics))
                    {
                        inputList.RemoveAll(x => x.Ergonomics > 0 || (x.Ergonomics == 0 && x.Recoil == 0));
                    }
                }
                // Then do the sorts
                if (mode == FittingPriority.MetaRecoil)
                {
                    inputList = SortWeaponModListHelper_MetaRecoil(inputList);
                }
                else if (mode == FittingPriority.Recoil)
                {
                    inputList = SortWeaponModListHelper_EconRecoil(inputList);
                }
                else if (mode == FittingPriority.MetaErgonomics)
                {
                    inputList = SortWeaponModListHelper_MetaErgonomics(inputList);
                }
                else if (mode == FittingPriority.Ergonomics)
                {
                    inputList = SortWeaponModListHelper_EconErgonomics(inputList);
                }
            }
            
            return inputList;
        }
        private static List<WeaponMod> SortWeaponModListHelper_MetaRecoil(List<WeaponMod> inputList)
        {
            // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
            //todo See if these can be made into single lines instead of pairs.
            var inputsRecoilMax = inputList.Min(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil);
            inputList = inputList.Where(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil == inputsRecoilMax).ToList();

            var inputsErgoMax = inputList.Max(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalErgo);
            inputList = inputList.Where(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalErgo == inputsErgoMax).ToList();

            //? From my intuition, there will only ever be one option after getting the double-max 
            //inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();

            return inputList;
        }
        private static List<WeaponMod> SortWeaponModListHelper_EconRecoil(List<WeaponMod> inputList)
        {
            // Get the max value, filter out any that don't have it, then sort by the price.
            var inputsRecoilMax = inputList.Min(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil);
            inputList = inputList.Where(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil == inputsRecoilMax).ToList();

            inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();

            return inputList;
        }
        private static List<WeaponMod> SortWeaponModListHelper_MetaErgonomics(List<WeaponMod> inputList)
        {
            // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
            //todo See if these can be made into single lines instead of pairs.
            var inputsErgoMax = inputList.Max(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalErgo);
            inputList = inputList.Where(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalErgo == inputsErgoMax).ToList();

            var inputsRecoilMax = inputList.Min(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil);
            inputList = inputList.Where(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil == inputsRecoilMax).ToList();

            //inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();

            return inputList;
        }
        private static List<WeaponMod> SortWeaponModListHelper_EconErgonomics(List<WeaponMod> inputList)
        {

            // Get the max value, filter out any that don't have it, then sort by the price.
            var inputsErgoMax = inputList.Max(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalErgo);
            inputList = inputList.Where(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalErgo == inputsErgoMax).ToList();

            inputList = inputList.OrderBy(x => Market.GetCheapestTraderPurchaseOffer(x.Id).PurchaseOffer.PriceRUB).ToList();

            return inputList;
        }

        //The idea of this is to specifically handle the special edge-cases which were causing issues with the generic fitting process, this will allow that to be simpler and cleaner
        //? Might be an idea to spin these EnhancedLogic functions off into thier own class + do a SOLID pass on these logics - follow MechTurk's idea of the ModList Class which would also have the build parameters as attributes.
        private static List<WeaponMod> EnhancedLogic_Function(Weapon inputWeapon, List<WeaponMod> inputList, FittingPriority priority)
        {
            // We run this before the others as it is independant and self-selecting
            inputList = EnhancedLogic_ComboGripStocks(inputList, priority);

            List<string> AR15_type = new List<string>
                {
                    "5c07c60e0db834002330051f", // ADAR
                    "5447a9cd4bdc2dbd208b4567", // M4A1
                    "5d43021ca4b9362eab4b5e25", // TX-15
                    "5bb2475ed4351e00853264e3"  // 416
                };

            switch (inputWeapon.Id)
            {
                case string id when AR15_type.Contains(id):
                    inputList = EnhancedLogic_AR15_Uppers(inputList, priority);
                    break;
                case "623063e994fc3f7b302a9696":
                case "5b0bbe4e5acfc40dc528a72d":
                    inputList = EnhancedLogic_Handguards_Barrels(inputList, priority);
                    break;
                case "62e7c4fba689e8c9c50dfc38":
                case "63171672192e68c5460cebc5":
                    inputList = EnhancedLogic_AUG(inputList, priority);
                    break;
                case "5c46fbd72e2216398b5a8c9c":
                    inputList = EnhancedLogic_SVDS(inputList, priority);
                    break;
                case string id when inputWeapon.Name.Contains("Kalashnikov"):
                    inputList = EnhancedLogic_Kalashnikovs_GasTubes_Handguards_DustCovers(inputList, priority);
                    break;
                default:
                    break;
            }
            return inputList;
        }
        private static List<WeaponMod> EnhancedLogic_AR15_Uppers(List<WeaponMod> inputList, FittingPriority priority)
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
                fittedHandGuards.Add((WeaponMod)SimpleFitting(hg, inputList, priority));
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

                var fittedMuzzledDevices = shortlistOfMuzzleDevices.Select(x => SimpleFitting(x, inputList, priority, blacklistHashSet)).ToList();

                fittedMuzzledDevices = fittedMuzzledDevices.OrderBy(x => GetCompoundItemStatsTotals<WeaponMod>(x).TotalRecoil).ToList();

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
            FinalCombos = SortWeaponModListByMode(FinalCombos, priority);
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);

            inputList.AddRange(theList);

            return inputList;
        }
        private static List<WeaponMod> EnhancedLogic_SVDS(List<WeaponMod> inputList, FittingPriority priority)
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
            FinalCombos = SortWeaponModListByMode(FinalCombos, priority);

            // Get the best one, add those mods back to the input list and return that.
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);
            inputList.AddRange(theList);

            return inputList;
        }
        //Currently used by the SA-58 and the G36
        public static List<WeaponMod> EnhancedLogic_Handguards_Barrels(List<WeaponMod> inputList, FittingPriority priority)
        {
            var barrels = inputList.Where(x => x.GetType() == typeof(Barrel)).ToList();
            inputList.RemoveAll(x => barrels.Contains(x));

            var handguards = inputList.Where(x => x.GetType() == typeof(Handguard)).ToList();
            inputList.RemoveAll(x => handguards.Contains(x));

            List<WeaponMod> fittedBarrels = new List<WeaponMod>();
            HashSet<string> temp_BL = new HashSet<string>();
            foreach (var barrel in barrels)
            {
                fittedBarrels.Add((WeaponMod)SimpleFitting(barrel, inputList, priority));
            }

            List<WeaponMod> fittedHandies = new List<WeaponMod>();
            temp_BL = new HashSet<string>();
            foreach (var handy in handguards)
            {
                fittedHandies.Add((WeaponMod)SimpleFitting(handy, inputList, priority));
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
                    shortlist = SortWeaponModListByMode(shortlist, priority);
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
            FinalCombos = SortWeaponModListByMode(FinalCombos, priority);

            // Get the best one, add those mods back to the input list and return that.
            var thatResult = FinalCombos.First();
            var theList = AggregateListOfModsRecursively(thatResult);

            inputList.AddRange(theList);


            return inputList;
        }
        public static List<WeaponMod> EnhancedLogic_AUG(List<WeaponMod> inputList, FittingPriority priority)
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

                    fittedBarrels.Add((WeaponMod)SimpleFitting(clone_Barrel, inputList, priority));
                }

                // Then, let's remove the T4AUG from the list, and fit everything !T4AUG
                inputList.RemoveAll(x => x.Id.Equals("630f2982cdb9e392db0cbcc7"));
                foreach (var barrel in barrels)
                {
                    temp_BL = new();
                    var clone_Barrel = barrel.DeepClone();

                    fittedBarrels.Add((WeaponMod)SimpleFitting(clone_Barrel, inputList, priority));
                }


            }
            else
            {
                // If we don't have the T4AUG, just fit out the barrels

                foreach (var barrel in barrels)
                {
                    temp_BL = new();
                    var clone_Barrel = barrel.DeepClone();

                    fittedBarrels.Add((WeaponMod)SimpleFitting(clone_Barrel, inputList, priority));
                }
            }

            if (fittedBarrels.Any())
            {
                // Sort the combos by the mode
                fittedBarrels = SortWeaponModListByMode(fittedBarrels, priority);

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
        private static List<WeaponMod> EnhancedLogic_Kalashnikovs_GasTubes_Handguards_DustCovers(List<WeaponMod> inputList, FittingPriority mode)
        {
            // Spin off all the the types we're concerned with into their own lists and remove them from the inputList
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
                        //? HashSet<string> temp_BL = new HashSet<string>();

                        clone_HG = (WeaponMod)SimpleFitting(clone_HG, inputList, mode);

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
        public static List<WeaponMod> EnhancedLogic_ComboGripStocks(List<WeaponMod> inputList, FittingPriority priority)
        {
            // 1. First we need to find if there are any combo PG-Stock items in the list.
            List<string> ComboGripStocks = new List<string>
            {
                "5c0e2ff6d174af02a1659d4a", // ADAR
                "5a33e75ac4a2826c6e06d759", // CQR (AR-15)
                "5a69a2ed8dc32e000d46d1f1", // R43 AS-VAL
                "619b69037b9de8162902673e"  // CQR-47
            };
            if (inputList.Any(x => ComboGripStocks.Contains(x.Id)))
            {
                // 2. If there is one, extract it from the input list, and then extract the incompatible items to the combo-stock from the list as well
                var nonComboList = inputList.Where(x => !ComboGripStocks.Contains(x.Id)).ToList();

                // There's only ever going to be one, aside from if there is the ADAR+CQR, and we know the ADAR is worse so might as well remove it.
                var comboStocks = inputList.Where(x=> ComboGripStocks.Contains(x.Id)).ToList();
                if(comboStocks.Count > 1)
                    comboStocks.RemoveAll(x=>x.Id.Equals(comboStocks[0].Id));
                var comboStock = comboStocks.First();

                //? Remove all PGs and Stocks, so we can add in the champion(s) later
                inputList.RemoveAll(x => x is PistolGrip || x is Stock);

                // Branch point: buffer tube (ADAR/CQR) vs no buffer tube (R43/CQR47)
                // 3. Assemble the best competitor combo to the stock
                // 4. Compare the two options
                // 4.A If the combo-stock wins, insert it back into the list.
                // 4.B If the normal item combo wins, insert them back into the list
                // 5. return the list
                if (comboStock.Id.Equals("5c0e2ff6d174af02a1659d4a") || comboStock.Id.Equals("5a33e75ac4a2826c6e06d759"))
                {
                    // Need to get all of the grips and stocks.
                    var grips = nonComboList.Where(x => x is PistolGrip).ToList();
                    var stocks = nonComboList.Where(x => x is Stock).ToList();

                    // Need to get the best tube for the GripStockCombo
                    var tubes = stocks.Where(x=>x.Slots.Count > 0).ToList();

                    tubes = tubes.Where(x=> !comboStock.ConflictingItems.Contains(x.Id)).ToList();

                    tubes = SortWeaponModListByMode(tubes, priority);
                    var bestTube = tubes.FirstOrDefault();

                    // Make totals
                    (int TotalErgo, float TotalRecoil) comboTotals = ((int) bestTube.Ergonomics + (int)comboStock.Ergonomics, bestTube.Recoil+comboStock.Recoil);

                    // Fit out all of the stocks, choose the best
                    List<WeaponMod> fittedStocks = new List<WeaponMod>();
                    foreach(var stock in stocks)
                    {
                        fittedStocks.Add((WeaponMod)SimpleFitting(stock, nonComboList, priority));
                    }
                    fittedStocks = SortWeaponModListByMode(fittedStocks, priority);
                    var bestStock = fittedStocks.FirstOrDefault();

                    // Choose the best grip
                    grips = SortWeaponModListByMode(grips, priority);
                    var bestGrip = grips.FirstOrDefault();

                    var nonComboTotals = GetCompoundItemStatsTotals<WeaponMod>(bestStock);
                    nonComboTotals.TotalErgo += (int) bestGrip.Ergonomics;

                    // If the combo doesn't win the primary stat, we don't care about the secondary or the price 
                    if (priority == FittingPriority.Recoil || priority == FittingPriority.MetaRecoil)
                    {
                        if (comboTotals.TotalRecoil < nonComboTotals.TotalRecoil)
                        {
                            inputList.Add(bestTube);
                            inputList.Add(comboStock);
                        }
                        else
                        {
                            inputList.Add(bestGrip);
                            inputList.AddRange(AggregateListOfModsRecursively(bestStock));
                        }
                    }
                    else
                    {
                        if (comboTotals.TotalErgo > nonComboTotals.TotalErgo)
                        {
                            inputList.Add(bestTube);
                            inputList.Add(comboStock);
                        }
                        else
                        {
                            inputList.Add(bestGrip);
                            inputList.AddRange(AggregateListOfModsRecursively(bestStock));
                        }
                    }

                }
                else if (comboStock.Id.Equals("5a69a2ed8dc32e000d46d1f1"))
                {
                    // If it's the R43-Val, we need to compare it vs the normal PG and Stock, of which we can safely assume are options
                    var defaultGrip = (WeaponMod) StaticRatStash.DB.GetItem(x => x.Name.Contains("AS VAL pistol grip"));
                    var defaultStock = (WeaponMod) StaticRatStash.DB.GetItem(x => x.Name.Contains("AS VAL skeleton stock"));
                    var defaultTotalErgo = defaultGrip.Ergonomics + defaultStock.Ergonomics; // Just use the stock's recoil by itself

                    // Do all R43
                    var fittedCombo = (WeaponMod)SimpleFitting(comboStock, nonComboList, priority);
                    var rotorTotals = GetCompoundItemStatsTotals<WeaponMod>(fittedCombo);

                    // If the combo doesn't win the primary stat, we don't care about the secondary or the price 
                    if (priority == FittingPriority.Recoil || priority == FittingPriority.MetaRecoil)
                    {
                        if (defaultStock.Recoil < rotorTotals.TotalRecoil)
                        {
                            inputList.Add(defaultGrip);
                            inputList.Add(defaultStock);
                        }
                        else
                        {
                            inputList.AddRange(AggregateListOfModsRecursively(fittedCombo));
                        }
                    }
                    else
                    {
                        if (defaultTotalErgo > rotorTotals.TotalErgo)
                        {
                            inputList.Add(defaultGrip);
                            inputList.Add(defaultStock);
                        }
                        else
                        {
                            inputList.AddRange(AggregateListOfModsRecursively(fittedCombo));
                        }
                    }
                }
                else
                {
                    // If it's the CQR-47, we just need to go to the input list and find if there is a combo to PG and stock which is better.
                    var grips = nonComboList.Where(x => x is PistolGrip).ToList();
                    var stocks = nonComboList.Where(x => x is Stock).ToList();

                    List<WeaponMod> fittedStocks = new();
                    foreach(var stock in stocks)
                    {
                        fittedStocks.Add((WeaponMod)SimpleFitting(stock, nonComboList, priority));
                    }

                    // Thankfully, no conflicts between fitted stocks and grips, yay! Sort and get the best
                    grips = SortWeaponModListByMode(grips, priority);
                    fittedStocks = SortWeaponModListByMode(fittedStocks, priority);
                    var bestGrip = grips.First();
                    var bestStock = fittedStocks.First();

                    // We can just use the recoil of the stock as grips have no input there.
                    var totalsForStock = GetCompoundItemStatsTotals<WeaponMod>(bestStock);
                    var totalErgo = bestGrip.Ergonomics + totalsForStock.TotalErgo;
                    var totalRecoil = totalsForStock.TotalRecoil;

                    // If the combo doesn't win the primary stat, we don't care about the secondary or the price 
                    if (priority == FittingPriority.Recoil || priority == FittingPriority.MetaRecoil)
                    {
                        if(totalRecoil < comboStock.Recoil)
                        {
                            inputList.Add(bestGrip);
                            inputList.AddRange(AggregateListOfModsRecursively(bestStock));
                        }
                        else
                        {
                            inputList.Add(comboStock);
                        }
                    }
                    else
                    {
                        if(totalErgo > comboStock.Ergonomics)
                        {
                            inputList.Add(bestGrip);
                            inputList.AddRange(AggregateListOfModsRecursively(bestStock));
                        }
                        else
                        {
                            inputList.Add(comboStock);
                        }
                    }

                }
            }

            return inputList;
        }

        public static (int TotalErgo, double TotalRecoil) GetCompoundItemStatsTotals<T>(this CompoundItem item)
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

        public static (bool Valid, string Reason) CheckIfCompoundItemIsValid(CompoundItem CI)
        {
            bool result = true;
            string resultString = string.Empty;

            var blacklist = AggregateBlacklistRecursively(CI);
            var Ids = AggregateIdsRecursively(CI);

            var intersection = blacklist.Intersect(Ids);

            if (intersection.Any())
            {
                result = false;
                resultString = "Blacklist Violation";
            }
            else
            {
                result = CheckThatAllRequiredSlotsFilled(CI);

                if(resultString != string.Empty)
                    resultString = resultString + ", Missing Required Mod";
                else
                    resultString = "Missing Required Mod";

            }

            if (result)
                resultString = "All good";

            return (result, resultString);
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
        public static List<string> AggregateAttachedModsIdsRecursively(Weapon weapon)
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
        public static List<WeaponMod> AggregateAttachedModsRecursively(Weapon weapon)
        {
            var items = AggregateAttachedModsIdsRecursively(weapon);
            List<WeaponMod> result = new();
            foreach (var item in items)
            {
                var mod = StaticRatStash.DB.GetItem(item) as WeaponMod;
                if (mod != null)
                    result.Add(mod);
            }
            return result;
        }
        public static void PrintOutAttachedMods(Weapon weapon)
        {
            var list = AggregateAttachedModsRecursively(weapon);
            foreach (var item in list)
            {
                Console.WriteLine($"{item.Name}, {item.Id}");
            }
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


    }
    
}
