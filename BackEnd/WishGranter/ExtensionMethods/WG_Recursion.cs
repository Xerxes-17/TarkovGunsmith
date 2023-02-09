using RatStash;
using Force.DeepCloner;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Recursion
    {
        // Adds the basic attachments to a weapon default preset
        public static Weapon AddDefaultAttachments(this Weapon weapon, List<string> baseAttachments, List<WeaponMod> mods)
        {
            //Console.WriteLine($"{weapon.Name} base attachments:");

            List<WeaponMod> attachmentsList = mods.Where(x => baseAttachments.Contains(x.Id)).ToList();

            //foreach (var attachment in attachmentsList)
            //{
            //    Console.WriteLine($"\t{attachment.Name}");
            //}

            weapon = (Weapon)FitCompoundItem(weapon, attachmentsList, "base");

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
                    if (item.Id == "5649af884bdc2d1b2b8b4589")
                        Console.WriteLine("B33 bastard");

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
                    List<WeaponMod> modsListForNonBlocking = inputList.Where(x => x.ConflictingItems.Count == 0).ToList();

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
                        //Console.WriteLine($"The blocker {candidateBlocker.Name} is better with ergo: {withBlockerResults.TotalErgo > withNonBlockingResults.TotalErgo}");
                        //Console.WriteLine($"The blocker stats:     {withBlockerResults}");
                        //Console.WriteLine($"The nonblocking stats: {withNonBlockingResults}");

                        if(withBlockerResults.TotalErgo > withNonBlockingResults.TotalErgo)
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
        public static List<string> CreateMasterWhiteListIds(CompoundItem CompItem, List<WeaponMod> AvailibleWeaponMods)
        {
            HashSet<string> MasterWhiteList = new HashSet<string>();

            // Get the Ids of all items that will attach
            foreach (Slot slot in CompItem.Slots)
            {
                MasterWhiteList.UnionWith(slot.Filters[0].Whitelist.Except(MasterWhiteList).ToList());
            }
            var cache = new HashSet<string>();
            // Get the Ids of all items that will attach to those attachments
            foreach (string item in MasterWhiteList)
            {
                var found = AvailibleWeaponMods.Find(x => x.Id == item);
                if (found != null)
                {
                    var result = CreateMasterWhiteListIds(found, AvailibleWeaponMods);
                    cache.UnionWith(result.Except(MasterWhiteList).ToList());
                }
            }
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

                if (shortList.Count > 0)
                {
                    // repalce this with a switch when you add more options.
                    if (mode.Equals("ergo") && !slot.Name.Contains("mod_muzzle"))
                    {
                        // Simple cull step if the slot currently has a default option, removing anything that is worse than "stock"
                        if (slot.ContainedItem != null)
                        {
                            var original = (WeaponMod)slot.ContainedItem;
                            candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalErgo > GetCompoundItemTotals<WeaponMod>(original).TotalErgo).ToList();
                        }
                        if (candidatesList.Count > 0)
                        {
                            // Sort options by trait
                            candidatesList = candidatesList.OrderByDescending(x => GetCompoundItemTotals<WeaponMod>(x).TotalErgo).ToList();

                            if (CashOffers != null)
                            {
                                // Get all of the candidates with the best Ergonomics value
                                candidatesList = candidatesList.Where(item => item.Ergonomics.Equals(candidatesList.First().Ergonomics)).ToList();

                                // Sort the candidates by the lowest price
                                candidatesList = candidatesList.OrderBy(y => CashOffers.Find(z => z.item.id.Equals(y.Id)).priceRUB).ToList();
                            }

                            // TODO: reimplement the accounting for cost.
                            //! Seems to be the case already looking above?
                            // Check if there are multiple best options and then sort by lowest price to best
                            //candidatesList = candidatesList.Where(x => getModTotals(x).t_ergo == getModTotals(candidatesList.First()).t_ergo).ToList();
                            //candidatesList = candidatesList.OrderBy(x => getModTotals(x).t_price).ToList();
                        }

                    }
                    else if (mode.Equals("recoil") || slot.Name.Contains("mod_muzzle") == true)
                    {
                        // Simple cull step if the slot currently has a default option
                        if (slot.ContainedItem != null)
                        {
                            var original = (WeaponMod)slot.ContainedItem;

                            //Need to do the work here
                            //candidatesList.Add(original); // Add the original, if it is already there then a double won't cause a problem, if it isn't we need it there for comparision

                            WG_Output.WriteOutputFileMods(candidatesList.OfType<WeaponMod>().ToList(), "ex_candidatesList"); // Get the output for development

                            // This could be causing a problem, review it later
                            candidatesList = candidatesList.Where(item => GetCompoundItemTotals<WeaponMod>(item).TotalRecoil < GetCompoundItemTotals<WeaponMod>(original).TotalRecoil).ToList();
                        }

                        if (candidatesList.Count > 0)
                        {
                            // Sort options by trait
                            candidatesList = candidatesList.OrderBy(x => GetCompoundItemTotals<WeaponMod>(x).TotalRecoil).ToList();

                            if (CashOffers != null)
                            {
                                // Get all of the candidates with the best Ergonomics value
                                candidatesList = candidatesList.Where(item => item.Recoil.Equals(candidatesList.First().Recoil)).ToList();

                                // Sort the candidates by the lowest price
                                candidatesList = candidatesList.OrderBy(y => CashOffers.Find(z => z.item.id.Equals(y.Id)).priceRUB).ToList();
                            }

                            // TODO: reimplement the accounting for cost.
                            // Check if there are multiple best options and then sort by lowest price to best
                            //! Seems to be the case already looking above?
                            //candidatesList = candidatesList.Where(x => getModTotals(x).t_recoil == getModTotals(candidatesList.First()).t_recoil).ToList();
                            //candidatesList = candidatesList.OrderBy(x => getModTotals(x).t_price).ToList();
                        }
                    }
                    // This is here so that when there is blocker comparisions being done, the blocker is forced into being used in the comparision.
                    if(mustFit != null)
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
    }
}
