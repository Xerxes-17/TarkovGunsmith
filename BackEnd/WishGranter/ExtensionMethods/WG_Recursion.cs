using RatStash;
using Force.DeepCloner;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Recursion
    {
        // The assumption here is that you're being fed in a list of Items which sometimes includes the ammo, we don't need a list of IDs as the list is all of the mods needed
        public static Weapon AddDefaultAttachments(this Weapon weapon, List<Item> baseAttachments)
        {

            List<WeaponMod> attachmentsList = baseAttachments.Where(x => x.GetType() != typeof(Ammo)).Cast<WeaponMod>().ToList();

            weapon = (Weapon)FitCompoundItem_Simple(weapon, attachmentsList);

            return weapon;
        }

        // A method for removing a mod from a compund item, without needing to know where it is exactly.
        public static void RemoveModFromCompoundItem(CompoundItem compItem, WeaponMod mod)
        {
            foreach(var slot in compItem.Slots)
            {
                if (slot.ContainedItem != null)
                {
                    var slotItem = (CompoundItem) slot.ContainedItem;
                    if(slotItem.Id == mod.Id)
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

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
            }
            //! We force Meta Recoil mode on muzzle devices because for most the difference in ergo is tiny, and the recoil is the more important thing.
            else if (mode == "Meta Recoil")
            {
                // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();

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

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
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

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
            }
            return inputList;
        }

        public static List<WeaponMod> SortWeaponModListByMode(List<WeaponMod> inputList, string mode)
        {
            if (mode == "recoil")
            {
                // Get the max value, filter out any that don't have it, then sort by the price.
                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
            }
            //! We force Meta Recoil mode on muzzle devices because for most the difference in ergo is tiny, and the recoil is the more important thing.
            else if (mode == "Meta Recoil")
            {
                // Get the max value, filter out any that don't have it, then do the same with the opposite, finally sort by cost
                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
            }

            //? Ergo Builds need to have 0 or positive ergo options removed for muzzle devices, otherwise they choose to have just end-caps or empty silencer adapters
            else if (mode == "ergo")
            {
                // Get the max value, filter out any that don't have it, then sort by the price.
                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
            }
            else if (mode == "Meta Ergonomics")
            {
                // Get the max value, filter out any that don't have it, then sort by the opposite.
                var options_EMax = inputList.Max(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == options_EMax).ToList();

                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();

                inputList = inputList.OrderBy(x => WG_Market.GetBestCashOfferPriceByItemId(x.Id)).ToList();
            }
            return inputList;
        }

        //? This allows for fitting mods to a CI as per the fitting mode
        //todo Look into how this relates to the SMFS function, as it feels kind of redundant?
        public static CompoundItem SMFS_Wrapper(CompoundItem CI, List<WeaponMod> inputList, string mode, HashSet<string> CommonBlackListIDs)
        {
            // First clone the Item, so we don't pollute the input
            var localClone = CI.DeepClone();

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
            
            List<string> AR15_type = new List<string>
            { 
                "5c07c60e0db834002330051f", // ADAR
                "5447a9cd4bdc2dbd208b4567", // M4A1
                "5d43021ca4b9362eab4b5e25"  // TX-15
            };

            if (AR15_type.Contains(CI.Id ))
            {
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
                    foreach(var gasblock in gasblocks)
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
                        if (intersection.Count() == 0)
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

                    var shortlistOfMuzzleDevices = inputList.Where(x => barrelWhiteList.Contains(x.Id) && !comboBlackList.Contains(x.Id) ).ToList();

                    HashSet<string> blacklistHashSet = new();
                    blacklistHashSet.UnionWith(comboBlackList);

                    var fittedMuzzledDevices = shortlistOfMuzzleDevices.Select(x => SMFS_Wrapper(x, inputList, mode, blacklistHashSet)).ToList();


                    fittedMuzzledDevices = fittedMuzzledDevices.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList();

                    var bestMuzzle = fittedMuzzledDevices.First().DeepClone();

                    temp_barrel.Slots[0].ContainedItem = bestMuzzle;

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
            }
            // Something similar could be done with the handguards and dust covers on AKs...
            // Shit, this might even be a better way of checking for the pistolgrip and stock combo things

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
            var candidates = inputList.Where(x  => slot.Filters[0].Whitelist.Contains(x.Id) && !CommonBlackListIds.Contains(x.Id)).ToList();

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

                    if(options.Count > 0)
                    {
                        // Sort options by mode and select the best one
                        options = SortWeaponModListForSlotByMode(slot, options, mode);
                        result = options.First();
                    }
                }
            }
            return result;
        }

        public static void ProcessBlockersInListOfMods_MK2(List<WeaponMod> inputList, Weapon inputWeapon, string mode)
        {
            // Make a list which will be mustated and returned later.
            List<WeaponMod> returnList = new List<WeaponMod>();
            returnList.AddRange(inputList);

            // From the list, get all of the blocker types
            var blockers = returnList.Where(x => x.ConflictingItems.Count > 0).ToList();
            var names = blockers.Select(x => x.Name).ToList();

            foreach(var blocker in blockers)
            {
                // First, do a check to see if the blocker is the only one of it's kind, because if it is we're not going to be able to pick anything else, eg, gun barrel.
                var oneOfAKind = inputList.Where(x => x.GetType() == blocker.GetType()).ToList();
                if (oneOfAKind.Count <= 1)
                {
                    // If it is the only candidate, we're just going to remove the incompatible mods from the return list, and move on to the next mod
                    //todo warning: this could be an issue where a mod removes another blocker before it is checked in this loop!
                    returnList.RemoveAll(mod => blocker.ConflictingItems.Contains(mod.Id));
                }
                else
                {
                    // Let's now check if the blocker is the only one of it's kind. If it is, great, move on, if not, compare it with the others and then choose the one which is best.
                    var oneBlockerOfAKind = blockers.Where(b => b.GetType() == blocker.GetType()).ToList();
                    if (oneBlockerOfAKind.Count >= 1)
                    {
                        //todo Expand this area later.
                        if(mode == "recoil")
                        {
                            oneBlockerOfAKind = oneBlockerOfAKind.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList(); //! helps if you make recoils be floats you dingus
                        }
                        else if (mode == "Meta Recoil")
                        {
                            oneBlockerOfAKind = oneBlockerOfAKind.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList();
                        }
                        // We better remove the other blockers from the return list too while we're here
                        var slice = oneBlockerOfAKind.Skip(1).ToList();
                        returnList.RemoveAll(x => slice.Contains(x));
                    }
                    //! There will always be at least one blocker, it's why we're here, so we can select it like this.
                    var candidateBlocker = oneBlockerOfAKind.First();

                    // We need to get the Mods which are of the same type of item, and the mods which are blocked, and not the blocker itself again, natch.
                    var competitorMods = returnList.Where(x => x.GetType() == candidateBlocker.GetType() || candidateBlocker.ConflictingItems.Contains(x.Id) && x.Id != candidateBlocker.Id).ToList();
                }
            }
        }

        public static List<WeaponMod> ProcessBlockersInListOfMods(List<WeaponMod> inputList, Weapon inputWeapon, string mode)
        {
            // Make a list which will be returned later.
            List<WeaponMod> returnList = new List<WeaponMod>();
            returnList.AddRange(inputList);

            // We're going to make a dictionary where mods are keyed to type
            Dictionary<Type, HashSet<WeaponMod> > slotDictionary = new ();

            foreach(WeaponMod weaponMod in inputList)
            {
                foreach(Slot slot in weaponMod.Slots)
                {
                    slot.ContainedItem = null;
                }

                // If the key already exists, add the weapon mod to it
                var temp = slotDictionary.GetValueOrDefault(weaponMod.GetType());
                if (temp != null)
                {
                    temp.Add(weaponMod);
                }
                // Otherwise add it
                else
                {
                    HashSet<WeaponMod> newHashSet = new();
                    newHashSet.Add(weaponMod);
                    slotDictionary.Add(weaponMod.GetType(), newHashSet);
                }
            }
            // Let's then go to each HashSet (aka slot type)
            foreach (var hashSet in slotDictionary.Values)
            {
                List<WeaponMod> blocking = new();
                List<WeaponMod> nonBlocking = new();

                // Put the items of that type into blocking or non-blocking
                foreach (var item in hashSet)
                {
                    if(item.ConflictingItems.Count > 0)
                        blocking.Add(item);
                    else
                        nonBlocking.Add(item);
                }
                 
                // If none of them are blockers, we don't need to do anything
                // If we have blockers, we need to work out which one is best
                WeaponMod candidateBlocker = new ();
                if(blocking.Count > 0)
                {
                    //! Get the most effective blocker mod of this type
                    if (mode == "recoil")
                    {
                        blocking = blocking.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList(); //! helps if you make recoils be floats you dingus
                    }
                    else if (mode == "ergo")
                    {
                        blocking = blocking.OrderBy(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo).ToList();
                    }
                    else if (mode == "MetaErgonomics")
                    {
                        blocking = blocking.OrderBy(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo).ToList();
                    }
                    else if (mode == "MetaRecoil")
                    {
                        blocking = blocking.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList();
                    }
                    candidateBlocker = blocking.First();

                    //! Now we put the blocking object head to head vs the non-blocking options
                    //! Clone the weapon for modeling the blockerMod build with
                    Weapon versionWithBlocker = new Weapon();

                    versionWithBlocker = inputWeapon.DeepClone();

                    foreach(var slot in versionWithBlocker.Slots) // Important to remove all of the "default sub attachments"
                    {
                        slot.ContainedItem = null;
                    }

                    //TODO: Force the blockerMod build to use the blocker mod
                    //! Create the list of mods the blockerMod build will use
                    List<WeaponMod> modsListForBlocker = inputList.Where(x => x.ConflictingItems.Count == 0).ToList();
                    modsListForBlocker.RemoveAll(x => candidateBlocker.ConflictingItems.Contains(x.Id));
                    modsListForBlocker.Add(candidateBlocker);

                    //! Model the blockerMod build and output the result.
                    versionWithBlocker = (Weapon)FitCompoundItem(versionWithBlocker, modsListForBlocker, mode, null, candidateBlocker);
                    var withBlockerResults = GetCompoundItemTotals<Weapon>(versionWithBlocker);

                    //WG_Output.WriteOutputFileWeapon(versionWithBlocker, "aa_withBlockerBuild");

                    //! Clone the weapon for modeling the nonBlocking build with
                    Weapon verionWithNonBlocking = new Weapon();
                    verionWithNonBlocking = inputWeapon.DeepClone();

                    //! Remove any default mods, in case one of them is a blocker (looking at you ADAR)
                    foreach (var slot in verionWithNonBlocking.Slots)
                    {
                        slot.ContainedItem = null;
                    }

                    //! Create the list of mods the nonBlocking build will use
                    List<WeaponMod> modsListForNonBlocking = inputList.Where(x => 
                    x.ConflictingItems.Count == 0 ||
                    x.GetType() == typeof(Barrel) ||
                    x.GetType() == typeof(Handguard)
                    ).ToList();

                    //! This is a problem, as it is removing the bareel from the list, the other problem is the fucking ADAR wooden stock.
                    //! Another part of it could be that it is foring the non-blocking to not have a vital part in some cases, like the ADAR barrel.

                    //TODO Try making the comparision for blocking vs non blocking be a simpler comparision between the mods of the same type/slot, and of the types that are in the blocked list.
                    //TODO Eg, Instead of building a whole gun, just sum up the delta of the PG + Stock vs the ADAR stock. You'd be able to recursively fit the stock too.


                    //! Model the nonBlocking build and output the result.
                    verionWithNonBlocking = (Weapon)FitCompoundItem(verionWithNonBlocking, modsListForNonBlocking, mode);
                    var withNonBlockingResults = GetCompoundItemTotals<Weapon>(verionWithNonBlocking);

                    //WG_Output.WriteOutputFileWeapon(verionWithNonBlocking, "aa_withNonBlockingBuild");

                    //TODO: Deal with case where all choices are blocking eg, M4A1 barrels or when the blocking and non-blocking are equal
                    if (mode == "recoil")
                    {
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with recoil: {withBlockerResults.TotalRecoil < withNonBlockingResults.TotalRecoil}");
                        //Console.WriteLine($"The blocker stats:     {withBlockerResults}");
                        //Console.WriteLine($"The nonblocking stats: {withNonBlockingResults}");

                        if (withBlockerResults.TotalRecoil < withNonBlockingResults.TotalRecoil)
                        {
                            returnList.RemoveAll(x => candidateBlocker.ConflictingItems.Contains(x.Id));
                        }
                        else
                        {
                            // need to remove all of the blockers if the champion fails
                            returnList.RemoveAll(x=> blocking.Contains(x));
                            //returnList.Remove(candidateBlocker);

                            //Also, if the blocker is already fitted as a part of a stock config (looking at you ADAR!) we need to remove the blocker from the weapon.
                            RemoveModFromCompoundItem(inputWeapon, candidateBlocker);
                        }
                    }
                    else if (mode == "ergo")
                    {
                        //WG_Output.WriteOutputFileWeapon(versionWithBlocker, "Blocker");
                        //WG_Output.WriteOutputFileWeapon(verionWithNonBlocking, "Not-Blocker");

                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with ergo: {withBlockerResults.TotalErgo > withNonBlockingResults.TotalErgo}");
                        //Console.WriteLine($"The blocker stats:     {withBlockerResults}");
                        //Console.WriteLine($"The nonblocking stats: {withNonBlockingResults}");

                        if (withBlockerResults.TotalErgo > withNonBlockingResults.TotalErgo)
                        {
                            returnList.RemoveAll(x => candidateBlocker.ConflictingItems.Contains(x.Id));
                        }
                        else
                        {
                            // need to remove all of the blockers if the champion fails
                            returnList.RemoveAll(x => blocking.Contains(x));
                            //returnList.Remove(candidateBlocker);


                            //Also, if the blocker is already fitted as a part of a stock config (looking at you ADAR!) we need to remove the blocker from the weapon.
                            RemoveModFromCompoundItem(inputWeapon, candidateBlocker);
                        }
                    }
                    else if (mode == "MetaErgonomics")
                    {
                        if (withBlockerResults.TotalErgo > withNonBlockingResults.TotalErgo)
                        {
                            returnList.RemoveAll(x => candidateBlocker.ConflictingItems.Contains(x.Id));
                        }
                        else
                        {
                            // need to remove all of the blockers if the champion fails
                            returnList.RemoveAll(x => blocking.Contains(x));
                            //returnList.Remove(candidateBlocker);


                            //Also, if the blocker is already fitted as a part of a stock config (looking at you ADAR!) we need to remove the blocker from the weapon.
                            RemoveModFromCompoundItem(inputWeapon, candidateBlocker);
                        }
                    }
                    else if(mode == "MetaRecoil") // Might need to make this an OR with recoil
                    {
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with recoil: {withBlockerResults.TotalRecoil < withNonBlockingResults.TotalRecoil}");
                        //Console.WriteLine($"The blocker stats:     {withBlockerResults}");
                        //Console.WriteLine($"The nonblocking stats: {withNonBlockingResults}");

                        if (withBlockerResults.TotalRecoil < withNonBlockingResults.TotalRecoil)
                        {
                            returnList.RemoveAll(x => candidateBlocker.ConflictingItems.Contains(x.Id));
                        }
                        else
                        {
                            // need to remove all of the blockers if the champion fails
                            returnList.RemoveAll(x => blocking.Contains(x));
                            //returnList.Remove(candidateBlocker);

                            //Also, if the blocker is already fitted as a part of a stock config (looking at you ADAR!) we need to remove the blocker from the weapon.
                            RemoveModFromCompoundItem(inputWeapon, candidateBlocker);
                        }
                    }

                    //Console.WriteLine("");

                }
                //else
                //{
                //    //Console.WriteLine($"No blockers in slot type of {hashSet.First().GetType()}");
                //}
            }

            return returnList;
        }

        public static List<WeaponMod> CreateListOfModsFromIds(List<string> Ids, List<WeaponMod> WeaponMods)
        {
            List<WeaponMod> result = new List<WeaponMod>();

            foreach (string id in Ids)
            {
                var found = WeaponMods.Find(x => x.Id == id);
                if (found != null)
                {
                    //foreach(Slot slot in found.Slots)
                    //{
                    //    slot.ContainedItem = null;
                    //} // Get rid of any default attached mods, because wtf?
                    result.Add(found);
                }
            }

            return result;
        }
        
        // Get a list of all possible items for a CI
        public static List<string> CreateMasterWhiteListIds(CompoundItem CompItem, List<WeaponMod> AvailableWeaponMods)
        {
            // Assign the AWM mod IDs to a list for ease of access, setup HashSet that will be returned
            var AWM_Ids = AvailableWeaponMods.Select(x => x.Id).ToList();
            HashSet<string> MasterWhiteList = new HashSet<string>();

            // Get the Ids of all items that will attach
            foreach (Slot slot in CompItem.Slots)
            {
                //We add the IDs which are a part of our AWM_Ids, as we are only concerned with mods which are available 
                MasterWhiteList.UnionWith(slot.Filters[0].Whitelist.Where(id => AWM_Ids.Contains(id)).ToList());
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
                    cache.UnionWith(result.ToList());
                }
            }
            // Unite the MWL with the results of recursion and then return it
            MasterWhiteList.UnionWith(cache);
            
            return MasterWhiteList.ToList();
        }

        // Put the Ids into names
        public static List<string> CreateHumanReadableMWL(List<string> Ids, List<WeaponMod> AvailibleWeaponMods)
        {
            List<string> Names = new List<string>();

            foreach (var id in Ids)
            {
                var found = AvailibleWeaponMods.Find(x =>x.Id == id);
                if(found != null)
                {
                    //Console.WriteLine(found.Name);
                    Names.Add(found.Name);
                }
            }
            return Names;
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

        // Fits a compound item according to the mods list given and the mode.
        public static CompoundItem FitCompoundItem(CompoundItem CompItem, List<WeaponMod> mods, string mode, List<J_CashOffer> CashOffers = null, WeaponMod mustFit = null)
        {
            //Clone Stuff
            var CompItem_CLONE = CompItem.DeepClone();

            CompItem_CLONE.Description = "CLONE";

            foreach (Slot slot in CompItem_CLONE.Slots)
            {
                List<WeaponMod> shortList = mods.Where(item => slot.Filters[0].Whitelist.Contains(item.Id)).ToList();

                List<WeaponMod>? candidatesList = new();

                candidatesList.AddRange(shortList.Select(item => (WeaponMod)FitCompoundItem(item, mods, mode, null, mustFit)));

                if (mustFit == null && slot.Name.Equals("mod_barrel") && CashOffers != null)
                {
                    Console.WriteLine("barrel");
                }

                if (shortList.Count > 0)
                {
                    if (mode.Equals("ergo") && !slot.Name.Contains("mod_muzzle"))
                    {
                        //if (mustFit == null && slot.Name.Equals("mod_barrel"))
                        //{
                        //    Console.WriteLine("barrel2");
                        //}

                        // Simple cull step if the slot currently has a default option, removing anything that is worse than "stock"

                        //? This section will be one I'll want to preserve for sure.
                        if (slot.ContainedItem != null)
                        {
                            // If there is a stock mod in this slot, let's cast it and compare it.
                            var original = (WeaponMod)slot.ContainedItem;

                            // We also want to fit it out too, if it can be done. This is needed for say, AK stocks with rubber butt pad.
                            var fittedOriginal = FitCompoundItem(original, mods, mode, CashOffers, mustFit);

                            //// This will check that all candidates have thier required mods fitted.
                            //candidatesList = candidatesList.Where(x => CheckAllRequiredSlotsFilled(x, candidatesList)).ToList();

                            // This mode is ERGO, so we want to ensure that any candidates are in fact better than the original
                            // We do this by removing any candidates which aren't better in the primary stat than the original, once the original has been added to if possible.
                            var cutoffValue = GetCompoundItemTotals<WeaponMod>(fittedOriginal).TotalErgo;
                            candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalErgo > cutoffValue).ToList();

                            // We can then add the fitted original as a competitor.
                            candidatesList.Add((WeaponMod)fittedOriginal);

                            // This will check that all candidates have thier required mods fitted.
                            candidatesList = candidatesList.Where(x => CheckAllRequiredSlotsFilled(x, candidatesList)).ToList();

                        }
                        if (candidatesList.Count > 0)
                        {

                            // Sort options by trait
                            candidatesList = candidatesList.OrderByDescending(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo).ToList();

                            // Get all of the candidates with the best Ergonomics value
                            candidatesList = candidatesList.Where(item => item.Ergonomics.Equals(candidatesList.First().Ergonomics)).ToList();

                            if (CashOffers != null)
                            {
                                // Sort the candidates by the lowest price
                                candidatesList = candidatesList.OrderBy(y => CashOffers.Find(z => z.item.id.Equals(y.Id)).priceRUB).ToList();
                            }
                        }

                    }
                    else if (mode.Equals("recoil") || (mode.Equals("ergo") && slot.Name.Contains("mod_muzzle") == true))
                    {
                        // Simple cull step if the slot currently has a default option
                        if (slot.ContainedItem != null)
                        {
                            // If there is a stock mod in this slot, let's cast it and compare it.
                            var original = (WeaponMod)slot.ContainedItem;

                            // We also want to fit it out too, if it can be done. This is needed for say, AK stocks with rubber butt pad.
                            var fittedOriginal = FitCompoundItem(original, mods, mode, CashOffers, mustFit);

                            // This mode is RECOIL, so we want to ensure that any candidates are in fact better than the original.
                            // We do this by removing any candidates which aren't better in the primary stat than the original, once the original has been added to if possible.
                            // Remember, recoil values are NEGATIVE.
                            var cutoffValue = GetCompoundItemTotals<WeaponMod>(fittedOriginal).TotalRecoil;
                            candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalRecoil < cutoffValue).ToList();

                            // We can then add the fitted original as a competitor.
                            candidatesList.Add((WeaponMod)fittedOriginal);

                            // This will check that all candidates have thier required mods fitted.
                            candidatesList = candidatesList.Where(x => CheckAllRequiredSlotsFilled(x, candidatesList)).ToList();

                        }

                        if (candidatesList.Count > 0)
                        {
                            

                            // Sort options by trait
                            candidatesList = candidatesList.OrderBy(x => GetCompoundItemTotals<WeaponMod>(x).TotalRecoil).ToList();

                            // Get all of the candidates with the best stat value
                            candidatesList = candidatesList.Where(item => item.Recoil.Equals(candidatesList.First().Recoil)).ToList();


                            if (CashOffers != null)
                            {
                                // Sort the candidates by the lowest price
                                candidatesList = candidatesList.OrderBy(y => CashOffers.Find(z => z.item.id.Equals(y.Id)).priceRUB).ToList();
                            }
                        }
                    }
                    else if (mode.Equals("MetaErgonomics") && !slot.Name.Contains("mod_muzzle"))
                    {
                        // Simple cull step if the slot currently has a default option, removing anything that is worse than "stock"
                        if (slot.ContainedItem != null)
                        {
                            // If there is a stock mod in this slot, let's cast it and compare it.
                            var original = (WeaponMod)slot.ContainedItem;

                            // We also want to fit it out too, if it can be done. This is needed for say, AK stocks with rubber butt pad.
                            var fittedOriginal = FitCompoundItem(original, mods, mode, CashOffers, mustFit);

                            // For now, it seems we need to explicitly not filter the candidates at this point for the meta branches.

                            // We can then add the fitted original as a competitor.
                            candidatesList.Add((WeaponMod)fittedOriginal);
                        }
                        if (candidatesList.Count > 0)
                        {
                            // Get the max ergo and then filter out any options which don't match it, as it is the max, we can simply Equals for it
                            var maxE = candidatesList.Max(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo);
                            candidatesList = candidatesList.Where(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo.Equals(maxE)).ToList();

                            // Then do the same but for recoil
                            var maxR = candidatesList.Max(x => GetCompoundItemTotals<WeaponMod>(x).TotalRecoil);
                            candidatesList = candidatesList.Where(x => GetCompoundItemTotals<WeaponMod>(x).TotalRecoil.Equals(maxR)).ToList();

                            //// Sort the remaining candidates by their recoil, then get the ones with the best recoil
                            //candidatesList = candidatesList.OrderBy(x => GetCompoundItemTotals<WeaponMod>(x).TotalRecoil).ToList();
                            //candidatesList = candidatesList.Where(item => item.Recoil.Equals(candidatesList.First().Recoil)).ToList();

                            //candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalRecoil.Equals(GetCompoundItemTotals<WeaponMod>(candidatesList.First()).TotalRecoil)).ToList();

                            if (CashOffers != null)
                            {
                                // Sort the remaining candidates by the lowest price
                                candidatesList = candidatesList.OrderBy(y => CashOffers.Find(z => z.item.id.Equals(y.Id)).priceRUB).ToList();
                            }
                        }

                    }
                    else if (mode.Equals("MetaRecoil") || (mode.Equals("MetaErgonomics") && slot.Name.Contains("mod_muzzle") == true))
                    {
                        // Simple cull step if the slot currently has a default option
                        if (slot.ContainedItem != null)
                        {
                            // If there is a stock mod in this slot, let's cast it and compare it.
                            var original = (WeaponMod)slot.ContainedItem;

                            // We also want to fit it out too, if it can be done. This is needed for say, AK stocks with rubber butt pad.
                            var fittedOriginal = FitCompoundItem(original, mods, mode, CashOffers, mustFit);

                            // For now, it seems we need to explicitly not filter the candidates at this point for the meta branches.

                            // We can then add the fitted original as a competitor.
                            candidatesList.Add((WeaponMod)fittedOriginal);
                        }

                        if (candidatesList.Count > 0)
                        {
                            // Get all of the candidates with the best desired stat value
                            // Remember, recoil values are NEGATIVE, so you want the MIN not the MAX!
                            var maxR = candidatesList.Min(x => GetCompoundItemTotals<WeaponMod>(x).TotalRecoil);
                            candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalRecoil == maxR).ToList();

                            // Get the max ergo and then filter out any options which don't match it, as it is the max, we can simply Equals for it
                            var maxE = candidatesList.Max(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo);
                            candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalErgo.Equals(maxE)).ToList();


                            if (CashOffers != null)
                            {
                                // Sort the candidates by the lowest price
                                candidatesList = candidatesList.OrderBy(y => CashOffers.Find(z => z.item.id.Equals(y.Id)).priceRUB).ToList();
                            }
                        }
                    }

                    

                    // This is here so that when there is blocker comparisions being done, the blocker is forced into being used in the comparision.
                    if (mustFit != null)
                    {
                        if(slot.Filters[0].Whitelist.Contains(mustFit.Id))
                            slot.ContainedItem = mustFit;
                        else if (candidatesList.Count > 0)
                            slot.ContainedItem = candidatesList.First();
                        {
                            if (candidatesList.Count > 0)
                                slot.ContainedItem = candidatesList.First();
                        }
                            
                    }
                    else
                    {
                        if (candidatesList.Count > 0)
                            slot.ContainedItem = candidatesList.First();
                    }
                }


            }
            return CompItem_CLONE;
        }

        // Take a given compound item of either Weapon or WeaponMod type, and return the total ergo and recoil as ints
        public static (int TotalErgo, int TotalRecoil) GetCompoundItemTotals<T>(this CompoundItem item)
        {
            float sumErgo = -1;
            float sumRecoil = -1;
            List<WeaponMod> Children = AccumulateMods(item.Slots);
            var (TotalErgo, TotalRecoil) = GetAttachmentsTotals(Children);


            if (typeof(T) == typeof(Weapon))
            {
                var weapon = (Weapon)item;

                sumErgo = weapon.Ergonomics + (int) TotalErgo;
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

            //var isValid = CheckAllRequiredSlotsFilled(item);

            //if (!isValid)
            //{
            //    sumErgo = -2000;
            //    sumRecoil = 2000;
            //}

            // Return the values as Ints because that makes comparision easier and we don't care about a .5 ergo difference.
            return ( (int)sumErgo, (int)sumRecoil);
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
                WeaponMod wm = (WeaponMod) slot.ContainedItem;
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
                if(slot.ContainedItem != null)
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
            foreach(var slot in CI.Slots)
            {
                if(slot.ContainedItem != null)
                {
                    result.AddRange(AggregateBlacklistRecursively((CompoundItem) slot.ContainedItem));
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

            foreach(var slot in CI.Slots)
            {
                if(slot.Required == true && slot.ContainedItem == null && result == true)
                {
                    result = false; 
                }
                else if (slot.Required == true && slot.ContainedItem != null)
                {
                    var temp = CheckThatAllRequiredSlotsFilled((CompoundItem) slot.ContainedItem);

                    if(result == true && temp == false)
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
            foreach(var slot in theMod.Slots)
            {
                if(slot.ContainedItem != null)
                {
                    result.AddRange(AggregateListOfModsRecursively((WeaponMod)slot.ContainedItem));
                }
            }
            return result;
        }
    }
}
