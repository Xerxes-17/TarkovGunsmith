using RatStash;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Output
    {
        // Takes the result of a fitting request and packages it into a Transmission format for the FE to receive.
        public static TransmissionWeapon CreateTransmissionWeaponListFromResultsTuple_Single(Weapon weapon, Ammo ammo, WeaponPreset preset)
        {
            // Get the economic totals
            var econ = WG_Market.CalculateWeaponBuildTotals(preset, weapon);


            // Get the summary of stats and an IEnum of slots that are in use
            var tempSummary = WG_Recursion.GetCompoundItemTotals<Weapon>(weapon);
            IEnumerable<Slot> notNulls = weapon.Slots.Where(y => y.ContainedItem != null);

            // Create a list of all of the attached mods as TransmissionWMs
            List<TransmissionWeaponMod> attachedMods = new();
            foreach (Slot slot in notNulls)
            {
                attachedMods.AddRange(RecursiveAttachedMods(slot));
            }

            // Create the TransmissionPatron (Bullet)
            var attachedPatron = new TransmissionPatron();
            attachedPatron.ShortName = ammo.ShortName;
            attachedPatron.Id = ammo.Id;
            attachedPatron.Penetration = ammo.PenetrationPower;
            attachedPatron.ArmorDamagePerc = ammo.ArmorDamage;
            attachedPatron.Damage = ammo.Damage;
            attachedPatron.FragChance = ammo.FragmentationChance;

            //Now put it all together
            var transmissionWeapon = new TransmissionWeapon();
            transmissionWeapon.ShortName = weapon.ShortName;
            transmissionWeapon.Id = preset.Id;
            transmissionWeapon.BaseErgo = weapon.Ergonomics;
            transmissionWeapon.BaseRecoil = weapon.RecoilForceUp;
            transmissionWeapon.Convergence = weapon.Convergence;
            transmissionWeapon.RecoilDispersion = weapon.RecoilDispersion;
            transmissionWeapon.RateOfFire = weapon.BFirerate;

            transmissionWeapon.AttachedModsFLat = attachedMods;
            transmissionWeapon.FinalErgo = tempSummary.TotalErgo;
            transmissionWeapon.FinalRecoil = tempSummary.TotalRecoil;

            transmissionWeapon.SelectedPatron = attachedPatron;

            transmissionWeapon.PresetPrice = econ.initialCost;
            transmissionWeapon.SellBackValue = econ.sellBackTotal;
            transmissionWeapon.PurchasedModsCost = econ.boughtModsTotal;
            transmissionWeapon.FinalCost = econ.finalCost;

            transmissionWeapon.Valid = WG_Recursion.CheckIfCompoundItemIsValid(weapon);

            return transmissionWeapon;
        }
        // Herlper method for getting a list of all of the mods attached to a weapon, returned in the Transmission format
        private static List<TransmissionWeaponMod> RecursiveAttachedMods(this Slot obj)
        {
            List<TransmissionWeaponMod> result = new();
            WeaponMod ContainedItem = (WeaponMod)obj.ContainedItem;

            TransmissionWeaponMod attachedMod = new();
            attachedMod.ShortName = ContainedItem.ShortName;
            attachedMod.Id = ContainedItem.Id;
            attachedMod.Ergo = ContainedItem.Ergonomics;
            attachedMod.RecoilMod = ContainedItem.Recoil;

            attachedMod.PriceRUB = WG_Market.GetBestCashOfferPriceByItemId(attachedMod.Id);

            result.Add(attachedMod);

            IEnumerable<Slot> notNulls = ContainedItem.Slots.Where(x => x.ContainedItem != null);
            foreach (var slot in notNulls)
            {
                result.AddRange(RecursiveAttachedMods(slot));
            }

            return result;
        }

        //! These three functions writes out these item types to their selection option formats.
        public static List<SelectionWeapon> WriteStockPresetList(List<WeaponPreset> DefaultWeaponPresets)
        {
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

            IEnumerable<WeaponPreset> shortList = DefaultWeaponPresets.Where(x => !prohibited.Contains(x.Name));

            foreach (WeaponPreset preset in shortList)
            {
                SelectionWeapon selectionWeapon = new SelectionWeapon();

                var temp = WG_Recursion.GetCompoundItemTotals<Weapon>(preset.Weapon);

                selectionWeapon.Value = preset.Id;
                selectionWeapon.Label = preset.Name;

                selectionWeapon.Ergonomics = temp.TotalErgo; // Need to get the calculated val for the total.
                selectionWeapon.RecoilForceUp = temp.TotalRecoil; // Same here

                selectionWeapon.RecoilAngle = preset.Weapon.RecoilAngle;
                selectionWeapon.RecoilDispersion = preset.Weapon.RecoilDispersion;
                selectionWeapon.Convergence = preset.Weapon.Convergence;

                selectionWeapon.AmmoCaliber = preset.Weapon.AmmoCaliber;
                selectionWeapon.BFirerate = preset.Weapon.BFirerate;

                selectionWeapon.traderLevel = preset.PurchaseOffer.MinVendorLevel;
                selectionWeapon.requiredPlayerLevel = preset.PurchaseOffer.ReqPlayerLevel;
                selectionWeapon.OfferType = preset.PurchaseOffer.OfferType;
                selectionWeapon.PriceRUB = preset.PurchaseOffer.PriceRUB;

                result.Add(selectionWeapon);
            }
            result = result.OrderBy(x => x.Label).ToList();

            using StreamWriter writetext = new("outputs\\MyStockPresets.json"); // This is here as a debug/verify
            writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));
            writetext.Close();

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
                return temp.PenetrationPower > 19 && !prohibited.Contains(temp.Id);
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

                sOption.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);
                if (sOption.TraderLevel == -1 && temp.CanSellOnRagfair == true)
                {
                    sOption.TraderLevel = 5; // Can buy on Flea.
                }
                else if (sOption.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    sOption.TraderLevel = 6;
                }



                result.Add(sOption);
            }

            result = result.OrderBy(x => x.Label).ToList();

            //using StreamWriter writetext = new("outputs\\MyAmmos.json"); // This is here as a debug/verify
            //writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));

            return result;
        }
        public static List<SelectionArmor> WriteArmorList(Database database)
        {
            IEnumerable<Item> Helmets = database.GetItems(m => m is Headwear);
            Helmets = Helmets.Where(x => {
                var temp = (Headwear)x;
                return temp.ArmorClass > 2;
            });

            List<SelectionArmor> result = new();
            IEnumerable<Item> All_Armor = database.GetItems(m => m is Armor);
            All_Armor = All_Armor.Where(a => a.Id != "63737f448b28897f2802b874"); // This seems to be a BSG dev armor

            IEnumerable<Item> All_Rigs = database.GetItems(m => m is ChestRig);
            All_Rigs = All_Rigs.Where(a => a.Id != "639343fce101f4caa40a4ef3"); // This seems to be a BSG dev armor
            All_Rigs = All_Rigs.Where(x => {
                var temp = (ChestRig)x;
                return temp.ArmorClass > 0;
            });

            var armoredEquipment = database.GetItems(x => x.GetType() == typeof(ArmoredEquipment)).Cast<ArmoredEquipment>().ToList();
            armoredEquipment = armoredEquipment.Where(x => x.ArmorClass > 1).ToList();

            foreach (var item in Helmets)
            {
                SelectionArmor armorOption = new SelectionArmor();
                var temp = (Headwear)item;

                armorOption.Value = temp.Id;
                armorOption.Label = temp.Name;
                armorOption.SetImageLinkWithId(temp.Id);

                armorOption.ArmorClass = temp.ArmorClass;
                armorOption.MaxDurability = temp.MaxDurability;
                armorOption.ArmorMaterial = temp.ArmorMaterial;
                armorOption.EffectiveDurability = WG_Calculation.GetEffectiveDurability(temp.MaxDurability, temp.ArmorMaterial);

                armorOption.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);
                if (armorOption.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    armorOption.TraderLevel = 5; // Can buy on Flea.
                }
                else if (armorOption.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    armorOption.TraderLevel = 6;
                }

                armorOption.Type = "Helmet";

                result.Add(armorOption);
            }

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
                armorOption.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);

                if(armorOption.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    armorOption.TraderLevel = 5;
                }
                else if (armorOption.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    armorOption.TraderLevel = 6;
                }

                armorOption.Type = "ArmorVest";

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

                armorOption.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);
                if (armorOption.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    armorOption.TraderLevel = 5;
                }
                else if (armorOption.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    armorOption.TraderLevel = 6;
                }

                armorOption.Type = "ChestRig";

                result.Add(armorOption);
            }

            foreach (var item in armoredEquipment)
            {
                SelectionArmor armorOption = new SelectionArmor();

                armorOption.Value = item.Id;
                armorOption.Label = item.Name;
                armorOption.SetImageLinkWithId(item.Id);

                armorOption.ArmorClass = item.ArmorClass;
                armorOption.MaxDurability = item.MaxDurability;
                armorOption.ArmorMaterial = item.ArmorMaterial;
                armorOption.EffectiveDurability = WG_Calculation.GetEffectiveDurability(item.MaxDurability, (ArmorMaterial)item.ArmorMaterial);

                armorOption.TraderLevel = WG_Market.GetItemTraderLevelByItemId(item.Id);
                if (armorOption.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    armorOption.TraderLevel = 5; // Can buy on Flea.
                }
                else if (armorOption.TraderLevel == -1 && item.CanSellOnRagfair == false)
                {
                    armorOption.TraderLevel = 6;
                }

                armorOption.Type = "ArmoredEquipment";

                result.Add(armorOption);
            }

            result = result.OrderBy(x => x.Label).ToList();

            //using StreamWriter writetext = new("outputs\\MyArmors.json"); // This is here as a debug/verify
            //writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));

            return result;
        }

        //! Going to hold onto this one because they could be useful at times for debugging.
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
        //! Going to hold onto this one because they could be useful at times for debugging.
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
        //! Going to hold onto this one because they could be useful at times for debugging.
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
    }
}
