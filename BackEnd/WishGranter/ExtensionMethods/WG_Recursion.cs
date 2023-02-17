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

        //? This is for fitting the mods to a weapon in a preset, the assumption is that the mods has only one mode of a given type and that is what will be fitted.
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
                inputList = inputList.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList();
            }
            //! We force Meta Recoil mode on muzzle devices because for most the difference in ergo is tiny, and the recoil is the more important thing.
            else if (mode == "Meta Recoil")
            {
                // Get the max value, filter out any that don't have it, then sort by the opposite.
                var options_RMax = inputList.Min(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil);
                inputList = inputList.Where(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == options_RMax).ToList();
                inputList = inputList.OrderByDescending(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo).ToList();
            }

            //? Ergo Builds need to have 0 or positive ergo options removed for muzzle devices, otherwise they choose to have just end-caps or empty silencer adapters
            else if (mode == "ergo")
            {
                if (slot.Name.Equals("mod_muzzle"))
                {
                    inputList.RemoveAll(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo > 0 || (GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalErgo == 0 && GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil == 0));
                }

                inputList = inputList.OrderByDescending(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo).ToList();
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
                inputList = inputList.OrderBy(x => GetCompoundItemTotals_RecoilFloat<WeaponMod>(x).TotalRecoil).ToList();
            }
            return inputList;
        }
        //? This allows for fitting mods to a CI as per the fitting mode
        public static CompoundItem FitCompoundItem_Complex(CompoundItem CompItem, List<WeaponMod> mods, string mode)
        {
            // Need to do this so that mutation doesn't spread.
            var CompItemClone = CompItem.DeepClone();

            foreach (Slot slot in CompItemClone.Slots)
            {
                // Get the mods from the list that are appropriate for the given slot
                List<WeaponMod> shortList = mods.Where(mod => slot.Filters[0].Whitelist.Contains(mod.Id)).ToList();

                // This is the list we will sort and then choose from later
                List<WeaponMod>? candidatesList = new();

                // If there are candidates, fit them out as per this function (recursively)
                //? I wonder what will happen if we make it call SMFS_Wrapper() instead...
                candidatesList.AddRange(shortList.Select(item => (WeaponMod)FitCompoundItem_Complex(item, shortList, mode)));
                //candidatesList.AddRange(shortList.Select(item => (WeaponMod)SMFS_Wrapper(item, shortList, mode)));

                // Add it to the slot once it is fitted and if it exists
                if (shortList.Count > 0)
                {
                    // We sort the candidates as per the mode
                    candidatesList = SortWeaponModListForSlotByMode(slot, candidatesList, mode);

                    // We fit the best candidate into the slot
                    //!We can only do this if something can go into the slot!
                    slot.ContainedItem = candidatesList.First();
                }
            }

            // By the end, you'll have a fully fitted out CompundItem, be it a Weapon or a WeaponMod
            return CompItemClone;
        }

        //? Shit, it would appear that I've duplicated usage of SMFS, but each one is slightly different
        //? With this one, it woudl appear that the SMFS func isn't given a filtered list, but a raw list It also doesn't call recursively internally

        public static CompoundItem SMFS_Wrapper(CompoundItem CI, List<WeaponMod> inputList, string mode)
        {
            var localClone = CI.DeepClone();

            foreach(var slot in localClone.Slots)
            {
                var temp = SelectModForSlot(slot, inputList, mode);

                if (!temp.Name.Contains("ERROR:"))
                {
                    slot.ContainedItem = temp;
                }

            }
            return localClone;
        }

        // I guess we need to do the blocker comparision at the time of fitting, otherwise we can't know the slot details
        //todo Make the mode selection block be its own function, as it takes a list and returns a mod, this will make it more maintainable.
        //? The spot you were last working on was line 282, eg, the way it chooses the sub-mods of a candidate, maybe you need to make it call this function?
        public static WeaponMod SelectModForSlot(Slot slot, List<WeaponMod> inputList, string mode)
        {
            var localList = inputList.DeepClone(); // Deep clone to ensure mutation doesn't spread.
            WeaponMod result = new();   // The Mod that was promised.
            result.Name = $"ERROR: I'm a mod which should have been changed for {slot.Name}";

            // Get a list of the candidate mods.
            var candidates = localList.Where(x => slot.Filters[0].Whitelist.Contains(x.Id)).ToList();

            //! Solo candidate check
            if (candidates.Count == 1)
            {
                //Console.WriteLine("One of a kind!");
                //? Right, probs need to fit this out actually first lmao
                candidates[0] = (WeaponMod)SMFS_Wrapper(candidates[0], localList, mode);
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
                    //! BLOCKER vs nonBlocker
                    else
                    {
                        //! BLOCKER vs BLOCKER
                        //todo What if the blockers can have things attached to them? Eg, Barrels. Let's assume that any attachments for a blocker could be mounted to other blockers too and thus can be ignored for now.
                        //? Actually this is a problem because say, handguards are taken at face value instead of with their real value.
                        //! So for now we are fitting blocker mods, however I do wonder if this might cause an issue as FitCompoundItem_Complex() function doesn't account of blockers itself?

                        List<WeaponMod> fittedBlockers = new();
                        foreach (var blocker in blockers)
                        {
                            fittedBlockers.Add((WeaponMod)FitCompoundItem_Complex(blocker, localList, mode));
                        }
                        blockers.Clear();
                        blockers.AddRange(fittedBlockers);

                        //! Select Blocker from sorted list
                        blockers = SortWeaponModListForSlotByMode(slot, blockers, mode);
                        candidateBlocker = blockers.First();

                        //!THEN BLOCKER-CHAMP vs nonBLOCKERS

                        // We need to get the Mods which will go in the same slot, are of the same type of item, the mods which are blocked, and not the blocker itself again, natch.
                        var competitorMods = localList.Where(x =>
                            candidates.Contains(x) ||
                            candidateBlocker.ConflictingItems.Contains(x.Id) &&
                            x.Id != candidateBlocker.Id
                        ).ToList();

                        // Let's now sort the competitors into their types and fit them out.
                        Dictionary<Type, HashSet<WeaponMod>> typeDictionary = new();

                        foreach (WeaponMod weaponMod in competitorMods)
                        {
                            var temp = typeDictionary.GetValueOrDefault(weaponMod.GetType());
                            var loop_WeaponMode = weaponMod.DeepClone();

                            // Fit out the mod, eg, butt-pad onto stock.
                            loop_WeaponMode = (WeaponMod)FitCompoundItem_Complex(loop_WeaponMode, localList, mode);

                            // If the key already exists, add the weapon mod to it
                            if (temp != null)
                            {
                                temp.Add(loop_WeaponMode);
                            }
                            // Otherwise add it
                            else
                            {
                                HashSet<WeaponMod> newHashSet = new();
                                newHashSet.Add(loop_WeaponMode);
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
                        var blockerCandidateResult = (candidateBlocker.Ergonomics, candidateBlocker.Recoil);

                        // Put the blocker and the non-blocking candidate together, we ensure the non-blocker is the right one from the list by comparing against the slot whitelist
                        var selectionList = new List<WeaponMod>();
                        selectionList.Add(candidateBlocker);
                        selectionList.AddRange(summationList.Where(x => slot.Filters[0].Whitelist.Contains(x.Id)));

                        // Compare the candidates by the fitting mode
                        //todo Add in a check for the price of options, will need to add that function to WG_Market first
                        if (mode == "recoil")
                        {
                            //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with recoil: {blockerCandidateResult.Recoil < nonBlockingCompetitionResult.TotalRecoil}");
                            //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                            //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                            if (blockerCandidateResult.Recoil < nonBlockingCompetitionResult.TotalRecoil)
                            {

                                result = candidateBlocker;
                            }
                            else
                            {
                                selectionList.Remove(candidateBlocker);
                                result = selectionList[0];
                            }
                        }
                        else if (mode == "Meta Recoil")
                        {
                            //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with Meta Recoil: {(blockerCandidateResult.Recoil < nonBlockingCompetitionResult.TotalRecoil) && (blockerCandidateResult.Ergonomics > nonBlockingCompetitionResult.TotalErgo)}");
                            //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                            //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                            if ((blockerCandidateResult.Recoil < nonBlockingCompetitionResult.TotalRecoil) && (blockerCandidateResult.Ergonomics > nonBlockingCompetitionResult.TotalErgo))
                            {

                                result = candidateBlocker;
                            }
                            else
                            {
                                selectionList.Remove(candidateBlocker);
                                result = selectionList[0];
                            }

                        }
                        else if (mode == "ergo")
                        {
                            //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with ergo: {blockerCandidateResult.Ergonomics > nonBlockingCompetitionResult.TotalErgo}");
                            //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                            //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                            if (blockerCandidateResult.Ergonomics > nonBlockingCompetitionResult.TotalErgo)
                            {

                                result = candidateBlocker;
                            }
                            else
                            {
                                selectionList.Remove(candidateBlocker);
                                result = selectionList[0];
                            }

                        }
                        else if (mode == "Meta Ergonomics")
                        {
                            //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with Meta Ergo: {(blockerCandidateResult.Ergonomics > nonBlockingCompetitionResult.TotalErgo) && (blockerCandidateResult.Recoil < nonBlockingCompetitionResult.TotalRecoil)}");
                            //Console.WriteLine($"The blocker stats:     e{blockerCandidateResult}r");
                            //Console.WriteLine($"The nonblocking stats: e{nonBlockingCompetitionResult}r");

                            if ((blockerCandidateResult.Ergonomics > nonBlockingCompetitionResult.TotalErgo) && (blockerCandidateResult.Recoil < nonBlockingCompetitionResult.TotalRecoil))
                            {
                                result = candidateBlocker;
                            }
                            else
                            {
                                selectionList.Remove(candidateBlocker);
                                result = selectionList[0];
                            }
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
                        var loop_WeaponMod = weaponMod.DeepClone();

                        // Fit out the mod, eg, butt-pad onto stock.

                        //loop_WeaponMode = (WeaponMod)FitCompoundItem(loop_WeaponMode, inputList, mode);
                        ////? Always seems to choose the 260mm barrel? Probs got something wrong with the FCI function
                        ////? Let's modify to use the SMFS() func
                        //? The problem here is that SMSF will return a default WM when nothing is possible, perhaps in the wrapper we need to handle when the result was "nothing" ?
                        //? Or we need to add a gaurd clause to not call it if there isn't anyuthing viable

                        foreach(var sub_slot in loop_WeaponMod.Slots)
                        {
                            var temp = SelectModForSlot(sub_slot, localList, mode);

                            if (!temp.Name.Contains("ERROR:"))
                            {
                                sub_slot.ContainedItem = temp;
                            }
                        }

                        //loop_WeaponMod = (WeaponMod)FitCompoundItem_Complex(loop_WeaponMod, localList, mode);

                        //? Why isn't this adding the slected mod to the slot?
                        options.Add(loop_WeaponMod);

                        //? Add a debug print here to see what is being done?
                        //PrintAttachedModNames_Recursively(loop_WeaponMode, 0);
                        //var Loop_Result = GetCompoundItemTotals_RecoilFloat<WeaponMod>(loop_WeaponMode);
                        //Console.WriteLine($"The stats:     e{Loop_Result}r");
                        //Console.WriteLine($"");
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
                        WG_Output.WriteOutputFileWeapon(versionWithBlocker, "Blocker");
                        WG_Output.WriteOutputFileWeapon(verionWithNonBlocking, "Not-Blocker");

                        Console.WriteLine($"The blocker {candidateBlocker.Name} is better with ergo: {withBlockerResults.TotalErgo > withNonBlockingResults.TotalErgo}");
                        Console.WriteLine($"The blocker stats:     {withBlockerResults}");
                        Console.WriteLine($"The nonblocking stats: {withNonBlockingResults}");

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
    }
}
