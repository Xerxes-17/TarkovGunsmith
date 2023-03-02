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

                    var ammo = AvailableAmmoChoices.Find(x => x.PenetrationPower == AvailableAmmoChoices.Max(y => y.PenetrationPower));
                    Ammo ammo_result = new();
                    if (ammo != null)
                    {
                        ammo_result = ammo;
                    }

                    CurveDataPoint temp = new();

                    temp.level = i;
                    temp.recoil = TotalRecoil;
                    temp.ergo = TotalErgo;
                    temp.price = finalCost;
                    temp.penetration = ammo.PenetrationPower;
                    temp.damage = ammo.Damage;
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

        public static List<ArmorTableRow> CompileArmorTable(Database database)
        {
            List<ArmorTableRow> Table = new();

            IEnumerable<Item> Helmets = database.GetItems(m => m is Headwear);
            Helmets = Helmets.Where(x => {
                var temp = (Headwear)x;
                return temp.ArmorClass > 2;
            });

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
                ArmorTableRow row = new();
                var temp = (Headwear)item;

                row.Id = temp.Id;
                row.Name = temp.ShortName;

                row.ArmorClass = temp.ArmorClass;
                row.MaxDurability = temp.MaxDurability;
                row.Material = temp.ArmorMaterial;
                row.EffectiveDurability = WG_Calculation.GetEffectiveDurability(temp.MaxDurability, temp.ArmorMaterial);

                row.BluntThroughput = temp.BluntThroughput;

                row.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);
                if (row.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    row.TraderLevel = 5; // Can buy on Flea.
                }
                else if (row.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    row.TraderLevel = 6;
                }

                row.Type = "Helmet";

                Table.Add(row);
            }
            foreach (var item in All_Armor)
            {
                ArmorTableRow row = new();
                var temp = (Armor)item;

                row.Id = temp.Id;
                row.Name = temp.ShortName;

                row.ArmorClass = temp.ArmorClass;
                row.MaxDurability = temp.MaxDurability;
                row.Material = temp.ArmorMaterial;
                row.EffectiveDurability = WG_Calculation.GetEffectiveDurability(temp.MaxDurability, temp.ArmorMaterial);
                row.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);

                row.BluntThroughput = temp.BluntThroughput;

                if (row.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    row.TraderLevel = 5;
                }
                else if (row.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    row.TraderLevel = 6;
                }

                row.Type = "ArmorVest";

                Table.Add(row);
            }
            foreach (var item in All_Rigs)
            {
                ArmorTableRow row = new();
                var temp = (ChestRig)item;

                row.Id = temp.Id;
                row.Name = temp.ShortName;

                row.ArmorClass = temp.ArmorClass;
                row.MaxDurability = temp.MaxDurability;
                row.Material = temp.ArmorMaterial;
                row.EffectiveDurability = WG_Calculation.GetEffectiveDurability(temp.MaxDurability, temp.ArmorMaterial);

                row.BluntThroughput = temp.BluntThroughput;

                row.TraderLevel = WG_Market.GetItemTraderLevelByItemId(temp.Id);
                if (row.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    row.TraderLevel = 5;
                }
                else if (row.TraderLevel == -1 && temp.CanSellOnRagfair == false)
                {
                    row.TraderLevel = 6;
                }

                row.Type = "ChestRig";

                Table.Add(row);
            }
            foreach (var item in armoredEquipment)
            {
                ArmorTableRow row = new();

                row.Id = item.Id;
                row.Name = item.ShortName;

                row.ArmorClass = item.ArmorClass;
                row.MaxDurability = item.MaxDurability;
                row.Material = item.ArmorMaterial;
                row.EffectiveDurability = WG_Calculation.GetEffectiveDurability(item.MaxDurability, item.ArmorMaterial);

                row.BluntThroughput = item.BluntThroughput;

                row.TraderLevel = WG_Market.GetItemTraderLevelByItemId(item.Id);
                if (row.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    row.TraderLevel = 5;
                }
                else if (row.TraderLevel == -1 && item.CanSellOnRagfair == false)
                {
                    row.TraderLevel = 6;
                }

                row.Type = "ArmoredEquipment";

                Table.Add(row);
            }

            return Table;
        }

        public static List<AmmoTableRow> CompileAmmoTable(Database database)
        {
            List<AmmoTableRow> Table = new();

            List<string> prohibited = new();
            prohibited.Add("5cde8864d7f00c0010373be1");
            prohibited.Add("5d2f2ab648f03550091993ca");
            prohibited.Add("5e85aac65505fa48730d8af2");
            prohibited.Add("5943d9c186f7745a13413ac9");
            prohibited.Add("5996f6fc86f7745e585b4de3");
            prohibited.Add("5996f6d686f77467977ba6cc");
            prohibited.Add("63b35f281745dd52341e5da7");
            prohibited.Add("6241c316234b593b5676b637");
            prohibited.Add("5e85a9f4add9fe03027d9bf1");
            prohibited.Add("5f647fd3f6e4ab66c82faed6");

            // Fleres
            prohibited.Add("62389ba9a63f32501b1b4451");
            prohibited.Add("62389bc9423ed1685422dc57");
            prohibited.Add("62389be94d5d474bf712e709");
            prohibited.Add("635267f063651329f75a4ee8");
            prohibited.Add("624c0570c9b794431568f5d5");
            prohibited.Add("624c09cfbc2e27219346d955");
            prohibited.Add("624c09da2cec124eb67c1046");
            prohibited.Add("624c09e49b98e019a3315b66");
            prohibited.Add("62389aaba63f32501b1b444f");

            //Grenade Stuff
            prohibited.Add("5ede47641cf3836a88318df1");
            prohibited.Add("5996f6cb86f774678763a6ca");
            prohibited.Add("5ede47641cf3836a88318df1");
            prohibited.Add("5ede475339ee016e8c534742");
            prohibited.Add("5ede47405b097655935d7d16");
            prohibited.Add("5f0c892565703e5c461894e9");
            prohibited.Add("5ede475b549eed7c6d5c18fb");
            prohibited.Add("5ede474b0c226a66f5402622");
            prohibited.Add("5d70e500a4b9364de70d38ce");
            prohibited.Add("5656eb674bdc2d35148b457c");
            prohibited.Add("5ede4739e0350d05467f73e8");

            List<Ammo> Ammo = database.GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();

            Ammo = Ammo.Where(x => !prohibited.Contains(x.Id)).ToList();

            foreach(Ammo item in Ammo)
            {
                AmmoTableRow row = new();

                row.Id = item.Id;
                row.Name = item.Name;

                row.TraderLevel = WG_Market.GetItemTraderLevelByItemId(item.Id);
                if (row.TraderLevel == -1 && item.CanSellOnRagfair == true)
                {
                    row.TraderLevel = 5;
                }
                else if (row.TraderLevel == -1 && item.CanSellOnRagfair == false)
                {
                    row.TraderLevel = 6;
                }

                row.Caliber = item.Caliber.Remove(0,7);
                row.Damage = item.Damage;
                row.PenetrationPower = item.PenetrationPower;
                row.ArmorDamagePerc = item.ArmorDamage;
                row.BaseArmorDamage = (item.PenetrationPower * ((double) item.ArmorDamage / 100));
                row.LightBleedDelta = item.LightBleedingDelta;
                row.HeavyBleedDelta = item.HeavyBleedingDelta;

                if(item.PenetrationPower < 20)
                {
                    row.FragChance = 0;
                }
                else
                {
                    row.FragChance = item.FragmentationChance;
                }
                
                row.InitialSpeed = item.InitialSpeed;
                row.AmmoRec = item.AmmoRec;
                row.Tracer = item.Tracer;

                Table.Add(row);
            }

            return Table;
        }

        public static void ChestRigReport(List<ChestRig> ChestRigs, string filename)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,ArmorClass,ArmorMaterial,MaxDurability,BluntThroughput,TraderLevel");
                sw.Close();
            }

            foreach (ChestRig rig in ChestRigs)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{rig.Name},");
                    sw.Write($"{rig.ArmorClass},");
                    sw.Write($"{rig.ArmorMaterial},");
                    sw.Write($"{rig.MaxDurability},");
                    sw.Write($"{rig.BluntThroughput},");

                    sw.Write($"{WG_Market.GetItemTraderLevelByItemId(rig.Id)}\n");

                    sw.Close();
                }
            }
        }

        public static void ArmorReport(List<Armor> Armors, string filename)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,ArmorClass,ArmorMaterial,MaxDurability,BluntThroughput,Indestructibility,TraderLevel");
                sw.Close();
            }

            foreach (Armor armor in Armors)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{armor.Name},");
                    sw.Write($"{armor.ArmorClass},");
                    sw.Write($"{armor.ArmorMaterial},");
                    sw.Write($"{armor.MaxDurability},");
                    sw.Write($"{armor.BluntThroughput},");
                    sw.Write($"{armor.Indestructibility},");

                    sw.Write($"{WG_Market.GetItemTraderLevelByItemId(armor.Id)}\n");

                    sw.Close();
                }
            }
        }

        public static void AmmoReport(List<Ammo> Ammo, string filename)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,Caliber,Damage,PenetrationPower,PenetrationPowerDiviation,ArmorDamage%,Accuracy,Recoil,FragChance,LBC,HBC,Speed,Tracer,TraderLevel");
                sw.Close();
            }

            foreach (Ammo bullet in Ammo)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{bullet.Name},");
                    sw.Write($"{bullet.Caliber},");
                    sw.Write($"{bullet.Damage},");
                    sw.Write($"{bullet.PenetrationPower},");
                    sw.Write($"{bullet.PenetrationPowerDiviation},");
                    sw.Write($"{bullet.ArmorDamage},");
                    sw.Write($"{bullet.AmmoAccuracy},");
                    sw.Write($"{bullet.AmmoRec},");
                    if (bullet.PenetrationPower > 19)
                        sw.Write($"{bullet.FragmentationChance},");
                    else
                        sw.Write("0,");
                    sw.Write($"{bullet.LightBleedingDelta},");
                    sw.Write($"{bullet.HeavyBleedingDelta},");
                    sw.Write($"{bullet.InitialSpeed},");
                    sw.Write($"{bullet.Tracer},");

                    sw.Write($"{WG_Market.GetItemTraderLevelByItemId(bullet.Id)}\n");

                    sw.Close();
                }
            }
        }

        public static void WeaponReport(List<Weapon> Weapons, string filename)
        {
            DateTime dateTime = DateTime.Now;
            string path = $"results\\{filename}_{dateTime.ToFileTime()}.csv";

            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine("Name,Caliber,RoF,SS_RoF," +
                    "Ergonomics,RecoilForceUp,RecoilDispersion,Convergence,RecoilAngle,CameraRecoil,DeviationCurve," +
                    "HipAccuracyRestorationDelay,HipAccuracyRestorationSpeed,HipInnaccuracyGain," +
                    "DurabilityBurnRatio,HeatFactorGun,CoolFactorGun,AllowOverheat,HeatFactorByShot,CoolFactorGunMods," +
                    "BaseMalfunctionChance,AllowJam,AllowFeed,AllowMisfire,AllowSlide," +
                    "TraderLevel");
                sw.Close();
            }

            foreach (Weapon item in Weapons)
            {
                using (StreamWriter sw = File.AppendText(path))
                {
                    sw.Write($"{item.Name},");
                    sw.Write($"{item.AmmoCaliber},");
                    sw.Write($"{item.BFirerate},");
                    sw.Write($"{item.SingleFireRate},");

                    sw.Write($"{item.Ergonomics},");
                    sw.Write($"{item.RecoilForceUp},");
                    sw.Write($"{item.RecoilDispersion},");
                    sw.Write($"{item.Convergence},");
                    sw.Write($"{item.RecoilAngle},");
                    sw.Write($"{item.CameraRecoil},");
                    sw.Write($"{item.DeviationCurve },");

                    sw.Write($"{item.HipAccuracyRestorationDelay},");
                    sw.Write($"{item.HipAccuracyRestorationSpeed},");
                    sw.Write($"{item.HipInaccuracyGain},");

                    sw.Write($"{item.DurabilityBurnRatio},");
                    sw.Write($"{item.HeatFactorGun},");
                    sw.Write($"{item.CoolFactorGun},");
                    sw.Write($"{item.AllowOverheat},");
                    sw.Write($"{item.HeatFactorByShot},");
                    sw.Write($"{item.CoolFactorGunMods},");

                    sw.Write($"{item.BaseMalfunctionChance},");
                    sw.Write($"{item.AllowJam},");
                    sw.Write($"{item.AllowFeed},");
                    sw.Write($"{item.AllowMisfire},");
                    sw.Write($"{item.AllowSlide},");

                    sw.Write($"{WG_Market.GetItemTraderLevelByItemId(item.Id)}\n");

                    sw.Close();
                }
            }
        }
    }
}
