using RatStash;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Output
    {
        public static List<SelectionWeapon> WriteStockPresetList(List<Weapon> DefaultWeaponPresets, JObject ImageLinksJSON)
        {

            //! NEED TO MOVE THIS OUTSIDE OF THE CALL (probably)
            List<TraderCashOffer> cashOffers = WG_Market.GetAllCashOffers();

            List<SelectionWeapon> result = new();

            List<string> prohibited = new();
            prohibited.Add("Master Hand");
            prohibited.Add("Штурмовая винтовка Colt M4A1 5.56x45");

            prohibited.Add("launcher_ak_toz_gp25_40_vog_settings");
            prohibited.Add("launcher_ar15_colt_m203_40x46_settings");
            prohibited.Add("FN40GL Mk2 grenade launcher");
            prohibited.Add("M32A1 MSGL 40mm grenade launcher");

            prohibited.Add("NSV \"Utyos\" 12.7x108 heavy machine gun");
            prohibited.Add("AGS-30 30x29mm automatic grenade launcher");

            prohibited.Add("ZiD SP-81 26x75 signal pistol");
            prohibited.Add("RSP-30 reactive signal cartridge (Green)");
            prohibited.Add("ROP-30 reactive flare cartridge (White)");
            prohibited.Add("RSP-30 reactive signal cartridge (Red)");
            prohibited.Add("RSP-30 reactive signal cartridge (Yellow)");

            IEnumerable < Weapon > shortList = DefaultWeaponPresets.Where(x => !prohibited.Contains(x.Name));

            foreach (Weapon weapon in shortList)
            {
                string searchJSONpath = $"$.data.items[?(@.id=='{weapon.Id}')].properties.defaultPreset.gridImageLink";
                var gridImageLink = ImageLinksJSON.SelectToken(searchJSONpath).ToString();

                SelectionWeapon selectionWeapon = new SelectionWeapon();

                var temp = WG_Recursion.GetCompoundItemTotals<Weapon>(weapon);

                selectionWeapon.Value = weapon.Id;
                selectionWeapon.Label = weapon.Name;

                if (gridImageLink != null)
                {
                    selectionWeapon.ImageLink = gridImageLink; // New function goes here.
                }
                else
                {
                    selectionWeapon.ImageLink = "NO IMAGE LINK FOUND";
                }
                
                selectionWeapon.Ergonomics = temp.TotalErgo; // Need to get the calculated val for the total.
                selectionWeapon.RecoilForceUp = temp.TotalRecoil; // Same here

                selectionWeapon.RecoilAngle = weapon.RecoilAngle;
                selectionWeapon.RecoilDispersion = weapon.RecoilDispersion;
                selectionWeapon.Convergence = weapon.Convergence;

                selectionWeapon.AmmoCaliber = weapon.AmmoCaliber;
                selectionWeapon.BFirerate = weapon.BFirerate;
      
                if (cashOffers.Where(x => x.ItemId.Equals(selectionWeapon.Value)).Count() > 0)
                {
                    selectionWeapon.requiredPlayerLevel = cashOffers.Find(x => x.ItemId.Equals(selectionWeapon.Value)).RequiredPlayerLevel;
                    // Improve this later
                }

                result.Add(selectionWeapon);
            }
            result = result.OrderBy(x => x.Label).ToList();

            //using StreamWriter writetext = new("outputs\\MyStockPresets.json"); // This is here as a debug/verify
            //writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));

            return result;

        }

        public static List<SelectionAmmo> WriteAmmoList(Database database)
        {
            List<SelectionAmmo> result = new();

            List<string> prohibited = new();
            prohibited.Add("5cde8864d7f00c0010373be1");
            prohibited.Add("5d2f2ab648f03550091993ca");
            prohibited.Add("5e85aac65505fa48730d8af2");
            prohibited.Add("5943d9c186f7745a13413ac9");
            prohibited.Add("5996f6fc86f7745e585b4de3");
            prohibited.Add("5996f6d686f77467977ba6cc");
            prohibited.Add("63b35f281745dd52341e5da7");

            //Removing all low-penetration ammo
            IEnumerable<Item> All_Ammo = database.GetItems(m => m is Ammo);
            All_Ammo = All_Ammo.Where(m =>
            {
                var temp = (Ammo) m;
                return temp.PenetrationPower > 20 && !prohibited.Contains(temp.Id);
            });

            foreach (var item in All_Ammo)
            {
                SelectionAmmo sOption = new SelectionAmmo();
                var temp = (Ammo)item;

                sOption.Value = temp.Id;
                sOption.Label = temp.Name;
                sOption.SetImageLinkWithId(temp.Id);

                sOption.Caliber = temp.Caliber;
                sOption.Damage = temp.Damage;
                sOption.PenetrationPower = temp.PenetrationPower;
                sOption.ArmorDamagePerc = temp.ArmorDamage;
                sOption.BaseArmorDamage = (temp.PenetrationPower * (temp.ArmorDamage / 100));
                sOption.TraderLevel = WG_Report.FindTraderLevelFromFile(temp.Id);

                result.Add(sOption);
            }

            result = result.OrderBy(x => x.Label).ToList();

            //using StreamWriter writetext = new("outputs\\MyAmmos.json"); // This is here as a debug/verify
            //writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));

            return result;
        }

        // Need to add helmets to this!
        // Also might need to make the material type be a string and not an enum
        // Need to get Barter offers too
        public static List<SelectionArmor> WriteArmorList(Database database)
        {
            List<SelectionArmor> result = new();
            IEnumerable<Item> All_Armor = database.GetItems(m => m is Armor);
            All_Armor = All_Armor.Where(a => a.Id != "63737f448b28897f2802b874"); // This seems to be a BSG dev armor

            IEnumerable<Item> All_Rigs = database.GetItems(m => m is ChestRig);
            All_Rigs = All_Rigs.Where(a => a.Id != "639343fce101f4caa40a4ef3"); // This seems to be a BSG dev armor
            All_Rigs = All_Rigs.Where(x => {
                var temp = (ChestRig)x;
                return temp.ArmorClass > 0;
            });

            foreach (var item in All_Armor)
            {
                SelectionArmor armorOption = new SelectionArmor();
                var temp = (Armor)item;

                armorOption.Value = temp.Id;
                armorOption.Label = temp.Name;
                armorOption.SetImageLinkWithId(temp.Id);

                armorOption.ArmorClass = temp.ArmorClass;
                armorOption.MaxDurability = temp.MaxDurability;
                armorOption.ArmorMaterial = temp.ArmorMaterial;
                armorOption.EffectiveDurability = WG_Calculation.GetEffectiveDurability(temp.MaxDurability, temp.ArmorMaterial);
                armorOption.TraderLevel = WG_Report.FindTraderLevelFromFile(temp.Id);

                result.Add(armorOption);
            }
            foreach (var item in All_Rigs)
            {
                SelectionArmor armorOption = new SelectionArmor();
                var temp = (ChestRig)item;
                
                armorOption.Value = temp.Id;
                armorOption.Label = temp.Name;
                armorOption.SetImageLinkWithId(temp.Id);

                armorOption.ArmorClass = temp.ArmorClass;
                armorOption.MaxDurability = temp.MaxDurability;
                armorOption.ArmorMaterial = temp.ArmorMaterial;
                armorOption.EffectiveDurability = WG_Calculation.GetEffectiveDurability(temp.MaxDurability, temp.ArmorMaterial);
                armorOption.TraderLevel = WG_Report.FindTraderLevelFromFile(temp.Id);

                result.Add(armorOption);
            }
            result = result.OrderBy(x => x.Label).ToList();

            //using StreamWriter writetext = new("outputs\\MyArmors.json"); // This is here as a debug/verify
            //writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));

            return result;
        }
        public static void WriteOutputFileWeapon(Weapon weapon, string filename)
        {
            filename = filename.Replace('"', ' ');
            string path = "results\\" + filename + ".txt";
            DateTime dateTime = DateTime.Now;
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine($"New output from {dateTime}");
                sw.Close();
            }

                using (StreamWriter sw = File.AppendText(path))
                {
                    // Write the Weapon name and base stats
                    sw.WriteLine(weapon.Name);
                    sw.WriteLine($"Ergo: {weapon.Ergonomics}");
                    sw.WriteLine($"Recoil: {weapon.RecoilForceUp}");

                    // Write the attached mods
                    IEnumerable<Slot> notNulls = weapon.Slots.Where(x => x.ContainedItem != null);
                    string temp = string.Empty;
                    foreach (Slot slot in notNulls)
                    {
                        temp += RecursiveStringBySlots(slot);
                    }
                sw.WriteLine(temp);

                var final = WG_Recursion.GetCompoundItemTotals<Weapon>(weapon);
                sw.WriteLine($"Final Ergo: {final.TotalErgo}");
                sw.WriteLine($"Final Recoil: {final.TotalRecoil}");
                sw.WriteLine($"Recoil Dispersion: {weapon.RecoilDispersion}");
                sw.WriteLine($"Convergence: {weapon.Convergence}");
                sw.WriteLine($"Rate of Fire: {weapon.BFirerate}");
                sw.WriteLine("");

                sw.Close();
                }
        }

        public static void WriteOutputFileWeapons(List<Weapon> weapons, string filename)
        {
            filename = filename.Replace('"', ' ');
            string path = "results\\" + filename + ".txt";
            DateTime dateTime = DateTime.Now;
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine($"New output from {dateTime}");
                sw.WriteLine($"num of weapons: {weapons.Count} \n");
                sw.Close();
            }

            foreach(Weapon weapon in weapons)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    // Write the Weapon name and base stats
                    sw.WriteLine(weapon.Name);
                    sw.WriteLine($"Ergo: {weapon.Ergonomics}");
                    sw.WriteLine($"Recoil: {weapon.RecoilForceUp}");

                    // Write the attached mods
                    IEnumerable<Slot> notNulls = weapon.Slots.Where(x => x.ContainedItem != null);
                    string temp = string.Empty;
                    foreach (Slot slot in notNulls)
                    {
                        temp += RecursiveStringBySlots(slot);
                    }
                    sw.WriteLine(temp);
                    sw.Close();
                }
            }
        }

        private static string RecursiveStringBySlots(this Slot obj)
        {
            string result = "  " + obj.ContainedItem.Name;
            WeaponMod mod = (WeaponMod)obj.ContainedItem;
            result = result + "\n    Ergo: " + mod.Ergonomics;
            result = result + "\n  Recoil: " + mod.Recoil + "%\n";

            IEnumerable<Slot> notNulls = mod.Slots.Where(x => x.ContainedItem != null);

            foreach (var slot in notNulls)
            {
                result += RecursiveStringBySlots(slot);
            }

            return result;
        }

        public static void WriteOutputFileMods(List<WeaponMod> mods, string filename)
        {
            string path = "results\\" + filename + ".txt";
            DateTime dateTime = DateTime.Now;
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine($"New output from {dateTime}");
                sw.WriteLine($"num of mods: {mods.Count} \n");
                sw.Close();
            }

            foreach (WeaponMod mod in mods)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    // Write the Weapon name and base stats
                    sw.WriteLine(mod.Name);
                    sw.WriteLine($"Ergo: {mod.Ergonomics}");
                    sw.WriteLine($"Recoil: {mod.Recoil}%");

                    // Write the attached mods
                    IEnumerable<Slot> notNulls = mod.Slots.Where(x => x.ContainedItem != null);
                    string temp = string.Empty;
                    foreach (Slot slot in notNulls)
                    {
                        temp += RecursiveStringBySlots(slot);
                    }
                    sw.WriteLine(temp);
                    sw.Close();
                }
            }
        }

        public static void WriteOutputFileForType<T>(List<Item> aList, string filename)
        {
            string path = "results\\" + filename + ".txt";
            DateTime dateTime = DateTime.Now;
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine($"New output from {dateTime}");
                sw.WriteLine($"num of items: {aList.Count} \n");
                sw.Close();
            }

            var result = aList.Where(x => x.GetType() == typeof(T)).ToList();
            result.ForEach((x) =>
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.WriteLine(x.Name);
                    sw.WriteLine(x.Id);
                    sw.WriteLine("");
                }
            });
        }

        public static void WriteOutputFileForResultsTuple(List<(Weapon, Ammo)> results, string filename)
        {
            string path = "results\\" + filename + ".txt";
            DateTime dateTime = DateTime.Now;
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine($"New output from {dateTime}");
                sw.WriteLine($"num of items: {results.Count} \n");
                sw.Close();
            }
            //  Write the results to teh file
            results.ForEach(((result) =>
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    // Identify the weapon
                    sw.WriteLine(result.Item1.ShortName);
                    sw.WriteLine(result.Item1.Id);
                    sw.WriteLine("");

                    // Create the string of attachments recursively and write it
                    IEnumerable<Slot> notNulls = result.Item1.Slots.Where<Slot>(y => y.ContainedItem != null);
                    string attachedMods = string.Empty;
                    foreach (Slot slot in notNulls)
                    {
                        attachedMods += RecursiveStringBySlots(slot);
                    }
                    sw.WriteLine(attachedMods);

                    // Write the final weapon stats
                    var temp = WG_Recursion.GetCompoundItemTotals<Weapon>(result.Item1);
                    sw.WriteLine($"Final Ergo: {temp.TotalErgo}");
                    sw.WriteLine($"Final Recoil: {temp.TotalRecoil}");
                    sw.WriteLine($"Recoil Dispersion: {result.Item1.RecoilDispersion}");
                    sw.WriteLine($"Convergence: {result.Item1.Convergence}");
                    sw.WriteLine($"Bullet: {result.Item2.Name}");
                    sw.WriteLine($"Penetration: {result.Item2.PenetrationPower}");
                    sw.WriteLine($"Damage: {result.Item2.Damage}");
                    sw.WriteLine($"Rate of Fire: {result.Item1.BFirerate}");
                    sw.WriteLine("");

                    sw.Close();
                }
            }));
        }
        
        private static List<TransmissionWeaponMod> RecursiveAttachedMods(this Slot obj, List<J_CashOffer> CashOffers)
        {
            List<TransmissionWeaponMod> result = new();
            WeaponMod ContainedItem = (WeaponMod) obj.ContainedItem;

            TransmissionWeaponMod attachedMod = new(); 
            attachedMod.ShortName = ContainedItem.ShortName;
            attachedMod.Id = ContainedItem.Id;
            attachedMod.Ergo = ContainedItem.Ergonomics;
            attachedMod.RecoilMod = ContainedItem.Recoil;

            attachedMod.PriceRUB = CashOffers.Find(x => x.item.id.Equals(attachedMod.Id)).priceRUB;

            result.Add(attachedMod);

            IEnumerable<Slot> notNulls = ContainedItem.Slots.Where(x => x.ContainedItem != null);
            foreach (var slot in notNulls)
            {
                result.AddRange(RecursiveAttachedMods(slot, CashOffers));
            }

            return result;
        }
        public static List<TransmissionWeapon> CreateTransmissionWeaponListFromResultsTupleList(List<(Weapon, Ammo)> results, List<J_CashOffer> CashOffers)
        {
            /*
             * Reasoning: Sending off the entire RatStash details is not needed, and sending a string would be very finnicky, so sending a JSON of simplified and serialized objects is ideal.
             */

            // Create a transmission list
            List<TransmissionWeapon> Transmission = new();

            results.ForEach(result =>
            {
                // Get the summary of stats and an IEnum of slots that are in use
                var tempSummary = WG_Recursion.GetCompoundItemTotals<Weapon>(result.Item1);
                IEnumerable<Slot> notNulls = result.Item1.Slots.Where<Slot>(y => y.ContainedItem != null);

                // Create a list of all of the attached mods as TransmissionWMs
                List<TransmissionWeaponMod> attachedMods = new();
                foreach (Slot slot in notNulls)
                {
                    attachedMods.AddRange(RecursiveAttachedMods(slot, CashOffers));
                }

                // Create the TransmissionPatron (Bullet)
                var attachedPatron = new TransmissionPatron();
                attachedPatron.ShortName = result.Item2.ShortName;
                attachedPatron.Id = result.Item2.Id;
                attachedPatron.Penetration = result.Item2.PenetrationPower;
                attachedPatron.ArmorDamagePerc = result.Item2.ArmorDamage;
                attachedPatron.Damage = result.Item2.Damage;

                //Now put it all together
                var transmissionWeapon = new TransmissionWeapon();
                transmissionWeapon.ShortName = result.Item1.ShortName;
                transmissionWeapon.Id = result.Item1.Id;
                transmissionWeapon.BaseErgo = result.Item1.Ergonomics;
                transmissionWeapon.BaseRecoil = result.Item1.RecoilForceUp;
                transmissionWeapon.Convergence = result.Item1.Convergence;
                transmissionWeapon.RecoilDispersion = result.Item1.RecoilDispersion;
                transmissionWeapon.RateOfFire = result.Item1.BFirerate;

                transmissionWeapon.AttachedModsFLat = attachedMods;
                transmissionWeapon.FinalErgo = tempSummary.TotalErgo;
                transmissionWeapon.FinalRecoil = tempSummary.TotalRecoil;

                transmissionWeapon.SelectedPatron = attachedPatron;

                transmissionWeapon.PriceRUB = CashOffers.Find(x => x.item.id.Equals(transmissionWeapon.Id)).priceRUB;

                Transmission.Add(transmissionWeapon);
            });

            return Transmission;
        }
    }
}
