using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using WishGranterProto;
using WishGranterProto.ExtensionMethods;
using System.Linq;
using RatStash;
using System.Collections.Generic;
using Force.DeepCloner;
using Newtonsoft.Json.Linq;
using System.IO;
using WishGranter;
using Newtonsoft.Json;
using WishGranter.Statics;
using WishGranter.AmmoEffectivenessChart;
using System.Text.Json;

namespace WishGranterTests
{
    [TestClass]
    public class ArmorsTest
    {
        [TestMethod]
        public void Test_ConvertHelmetsToArmorTableRows()
        {
            var result = Armors.ConvertHelmetsToArmorTableRows();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_GetAssembledHelmets()
        {
            var result = Armors.GetAssembledHelmets();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_GetAssembledArmorsAndRigs()
        {
            var result = Armors.GetAssembledArmorsAndRigs();

            Console.WriteLine(result.Count);
        }

        [TestMethod]
        public void Test_ConvertAssembledArmorsAndRigsToTableRows()
        {
            var result = Armors.ConvertAssembledArmorsAndRigsToTableRows();

            Console.WriteLine(result.Count);
        }
    }

    [TestClass]
    public class BallisticSystemTest
    {
        [TestMethod]
        public void Test_PenetrationDamage2()
        {
            Console.WriteLine($"vs AC4");

            Console.WriteLine($"Layer, Penetration, Damage, PostPenetration, PostDamage, PenChance");

            for(int i = 0; i <= 30; i++)
            {
                var result = Ballistics.PenetrationDamage2(100, 4, 100, 25+i, 1);
                //var result2 = Ballistics.PenetrationDamage2(100, 3, result.bulletDamage, result.bulletPenetration, 2);
            }
            

        }

        [TestMethod]
        public void Test_PenetrationChance()
        {
            var result = Ballistics.PenetrationChance(6, 44, 100);
            Console.WriteLine($"Penetration Chance: {result}");
        }
    }

    [TestClass]
    public class ArmorPlateTests
    {
        [TestMethod]
        public void Test_GetItemsPlatesAreCompatibleWith()
        {
            var result = ArmorModule.GetItemsPlatesAreCompatibleWith();
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Count > 0);
        }
        [TestMethod]
        public void Test_CreateArmorToPlateMap()
        {
            var result = ArmorModule.CreateArmorToPlateMap(ArmorModule.GetDefaultUsedByPairs());

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Count > 0);
        }
        [TestMethod]
        public void Test_CreatePlateToArmorMap()
        {
            var result = ArmorModule.CreatePlateToArmorMap(ArmorModule.GetDefaultUsedByPairs());

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Count > 0);

            foreach(var item in result)
            {
                var plateName = StaticRatStash.DB.GetItem(item.Key).Name;
                Console.WriteLine($"{plateName} is used in:");
                foreach (var value in item.Value)
                {
                    var armorName = StaticRatStash.DB.GetItem(value).Name;
                    Console.WriteLine($"  {armorName}");
                }
                Console.WriteLine("");
            }
        }
        [TestMethod]
        public void Test_GetDefaultUsedByPairs()
        {
            var result = ArmorModule.GetDefaultUsedByPairs();

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Count > 0);
        }

        [TestMethod]
        public void Test_GetPlatesAndInsertsFromRatStash()
        {
            var result = ArmorModule.GetArmorModulesFromRatStash();

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Count > 0);
        }

        [TestMethod]
        public void Test_NewTypes()
        {
            List<Type> plateAndInsertTypes = new List<Type>()
                {
                    typeof(ArmorPlate), typeof(BuiltInInserts)
                };

            var ArmoredEquipments = StaticRatStash.DB.GetItems().Where(x => x is ArmoredEquipment).Cast<ArmoredEquipment>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems().Where(x => x is ChestRig).Cast<ChestRig>().ToList();

            HashSet<string> usedPlatesAndInserts = new HashSet<string>();

            foreach(var armor in ArmoredEquipments)
            {
                foreach(var slot in armor.Slots)
                {
                    foreach(var id in slot.Filters[0].Whitelist)
                        if(plateAndInsertTypes.Contains(StaticRatStash.DB.GetItem(id).GetType()))
                        {
                            usedPlatesAndInserts.Add(id);
                        }
                }
            }

            foreach(var rig in ArmoredChestRigs)
            {
                foreach(var slot in rig.Slots)
                {
                    foreach (var id in slot.Filters[0].Whitelist)
                        if (plateAndInsertTypes.Contains(StaticRatStash.DB.GetItem(id).GetType()))
                        {
                            usedPlatesAndInserts.Add(id);
                        }
                }
            }
            Console.WriteLine($"Count of usedPlatesAndInserts: {usedPlatesAndInserts.Count}");
            var distinctPlatesAndInserts = usedPlatesAndInserts.Distinct().ToList();
            Console.WriteLine($"Count of distinctPlatesAndInserts: {distinctPlatesAndInserts.Count}");

            

            var armorPlates = StaticRatStash.DB.GetItems(x=> x.GetType() == typeof(ArmorPlate)).Cast<ArmorPlate>().ToList();
            var builtInInserts = StaticRatStash.DB.GetItems(x => x is BuiltInInserts).Cast<BuiltInInserts>().ToList();

            armorPlates.Sort((x, y) => y.ArmorClass - x.ArmorClass);
            builtInInserts.Sort((x, y) => y.ArmorClass - x.ArmorClass);

            Console.WriteLine($"Count of plates: {armorPlates.Count()}");
            Console.WriteLine($"Count of inserts: {builtInInserts.Count()}");

            HashSet<string> plateAndInsertIds = new HashSet<string>();

            var plateIds = armorPlates.Select(x => x.Id).ToList();
            var InsertIds = builtInInserts.Select(x => x.Id).ToList();
            plateAndInsertIds.UnionWith(plateIds);
            plateAndInsertIds.UnionWith(InsertIds);
            Console.WriteLine($"Count of plateAndInsertIds: {plateAndInsertIds.Count}");

            var wtf = plateAndInsertIds.Except(usedPlatesAndInserts);
            Console.WriteLine($"Count of wtf: {wtf.Count()}");

            var unusedThings = wtf.Select(x=> StaticRatStash.DB.GetItem(x)).ToList();


            var armorPlates_OnlyPlateColliders = armorPlates.Where(x => x.ArmorPlateColliders.Count > 0 && x.ArmorColliders.Count == 0).ToList();
            var armorPlates_OnlyArmorColliders = armorPlates.Where(x => x.ArmorPlateColliders.Count == 0 && x.ArmorColliders.Count > 0).ToList();
            var armorPlates_OnlyMixedColliders = armorPlates.Where(x => x.ArmorPlateColliders.Count > 0 && x.ArmorColliders.Count > 0).ToList();
            var armorPlates_NoColliders = armorPlates.Where(x => x.ArmorPlateColliders.Count == 0 && x.ArmorColliders.Count == 0).ToList();

            Console.WriteLine($"OnlyPlates count: {armorPlates_OnlyPlateColliders.Count}");
            Console.WriteLine($"OnlyArmor count: {armorPlates_OnlyArmorColliders.Count}");
            Console.WriteLine($"OnlyMixed count: {armorPlates_OnlyMixedColliders.Count}");
            Console.WriteLine($"NoColliders count: {armorPlates_NoColliders.Count}");

            var inserts_OnlyPlateColliders = builtInInserts.Where(x => x.ArmorPlateColliders.Count > 0 && x.ArmorColliders.Count == 0).ToList();
            var inserts_OnlyArmorColliders = builtInInserts.Where(x => x.ArmorPlateColliders.Count == 0 && x.ArmorColliders.Count > 0).ToList();
            var inserts_OnlyMixedColliders = builtInInserts.Where(x => x.ArmorPlateColliders.Count > 0 && x.ArmorColliders.Count > 0).ToList();
            var inserts_NoColliders = builtInInserts.Where(x => x.ArmorPlateColliders.Count == 0 && x.ArmorColliders.Count == 0).ToList();

            Console.WriteLine($"OnlyPlates count: {inserts_OnlyPlateColliders.Count}");
            Console.WriteLine($"OnlyArmor count: {inserts_OnlyArmorColliders.Count}");
            Console.WriteLine($"OnlyMixed count: {inserts_OnlyMixedColliders.Count}");
            Console.WriteLine($"NoColliders count: {inserts_NoColliders.Count}");

            var armorPlates_NotOnlyPlate = armorPlates.Where(x => !armorPlates.Contains(x)).ToList();

            var beefLead = armorPlates_OnlyPlateColliders.Where(x => x.RicochetParams.X == 0).ToList();
            var beefLead2 = armorPlates_OnlyPlateColliders.Where(x => x.RicochetParams.X != 0).ToList();

            var plates_Rico_X_0 = beefLead.Select(x=> (x.Name, x.ArmorMaterial)).ToList();

            var plates_Rico_X_not0 = beefLead2.Select(x => ( x.Name, x.ArmorMaterial )).ToList();

            var lightPlates = armorPlates_OnlyPlateColliders.Where(x => x.ArmorType == ArmorType.Light).ToList();
            var heavyPlates = armorPlates_OnlyPlateColliders.Where(x => x.ArmorType == ArmorType.Heavy).ToList();

            var lightPlates_meterial = lightPlates.Select(x => (x.Name, x.ArmorMaterial)).ToList();
            var heavyPlates_material = heavyPlates.Select(x => (x.Name, x.ArmorMaterial)).ToList();

            //foreach (var item in builtInInserts)
            //{
            //    Console.WriteLine(item.Name);
            //    Console.WriteLine(item.Id);
            //    Console.WriteLine(item.ArmorClass);
            //    Console.WriteLine(item.Durability);
            //    Console.WriteLine(item.ArmorMaterial);
            //    Console.WriteLine(item.ArmorType);
            //    Console.WriteLine(item.BluntThroughput);
            //    Console.WriteLine("ArmorColliders:");
            //    foreach (var armorCollider in item.ArmorColliders)
            //    {
            //        Console.WriteLine($"  {armorCollider}");
            //    }
            //    Console.WriteLine("ArmorPlateColliders:");
            //    foreach (var armorPlateCollider in item.ArmorPlateColliders)
            //    {
            //        Console.WriteLine($"  {armorPlateCollider}");
            //    }
            //    Console.WriteLine();
            //}






        }
    }

    [TestClass]
    public class RatsStashTests
    {
        [TestMethod]
        public void Test_SomeMath()
        {
            var result = StaticRatStash.DB.GetItems().Where(x => x is ArmoredEquipment).Cast<ArmoredEquipment>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems().Where(x => x is ChestRig).Cast<ChestRig>().ToList();
            var plates = StaticRatStash.DB.GetItems().Where(x => x is ArmorPlate).ToList();
            Console.WriteLine(result.Count);

        }
    }

    [TestClass]
    public class GunsmithProblemsTesting
    {
        [TestMethod]
        public void Test_SomeMath()
        {
            Monolit db = new();

            BasePreset basePreset = ModsWeaponsPresets.BasePresets.FirstOrDefault(x => x.Id.Equals("59dcdbb386f77417b03f350d_-1252658724"));
            var ParamSettings = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Loud, 20, false, new List<string>());
            Gunsmith.FitWeapon(basePreset, ParamSettings);
        }
    }

    [TestClass]
    public class FittingThingTests
    {

        [TestMethod]
        public void Test_SomeMath()
        {
            Console.WriteLine(Ballistics.GetLegMetaHTK("5efb0cabfb3e451d70735af5"));
        }

        [TestMethod]
        public void Test_GetAllPossibleChildrenIdsForCI()
        {
            var result = ModsWeaponsPresets.GetAllPossibleChildrenIdsForCI("60db29ce99594040e04c4a27");
        }

        [TestMethod]
        public void Test_Hydrate_DB_Fittings_All()
        {
            var result = Fitting.Hydrate_DB_WithAllFittings();
            Console.WriteLine($"Changes: {result}");
        }

        [TestMethod]
        public void Test_SpeedOfFittingProcess()
        {
            var result = Fitting.Test_SpeedOfFittingProcess();
            Console.WriteLine($"Changes: {result}");
        }

        [TestMethod]
        public void Test_Hydrate_DB_Fittings_CashOnly()
        {
            var result = Fitting.Hydrate_DB_WithBasicFittings();
            Console.WriteLine($"Changes: {result}");
        }


        [TestMethod]
        public void Test_Hydrate_DB_GunsmithParameters()
        {
            var result = GunsmithParameters.Hydrate_DB_GunsmithParameters();
            Console.WriteLine($"Changes: {result}");
        }

        [TestMethod]
        public void Test_Hydrate_DB_WithPresets()
        {
            var result = BasePreset.Hydrate_DB_BasePreset();
            Console.WriteLine($"Changes: {result}");
        }

        [TestMethod]
        public void Test_Hydrate_DB_WithWeapons()
        {
            var result = Weapon_SQL.Hydrate_DB_WithWeapons();
            Console.WriteLine($"Changes: {result}");
        }


        [TestMethod]
        public void Test_GetBestAmmo()
        {
            var preset = ModsWeaponsPresets.BasePresets[0];
            var param = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Loud, 15, true, new List<string>());
            PurchasedAmmo.GetBestPurchasedAmmo(preset, param);
        }
    }

    [TestClass]
    public class AECTests
    {
        [TestMethod]
        public void Test_Constructor()
        {
            AEC AEC = new();

            Console.WriteLine($"AEC.Rows.Count: {AEC.Rows.Count}");
        }

        [TestMethod]
        public void Test_BallsiticThing()
        {
            SimulationParameters parameters = new SimulationParameters
            {
                ArmorClass = 2,
                MaxDurability = 38,
                StartingDurabilityPerc = 100,
                BluntThroughput = .22f,
                ArmorMaterial = ArmorMaterial.Aramid,
                TargetZone = TargetZone.Thorax,
                Penetration = 15f,
                Damage = 87,
                ArmorDamagePerc = 20
            };

            var result = Ballistics.SimulateHitSeries_Engine(parameters);

            Console.WriteLine($"result.Count: {result.Count}");
            Console.WriteLine($"result[0].PenetrationDamage: {result[0].PenetrationDamage}");
            Console.WriteLine($"result[0].BluntDamage: {result[0].BluntDamage}");
        }
        [TestMethod]
        public void Test_BallsiticThing2()
        {
            var result = Ballistics.PenetrationDamage(100, 4, 35.425 , 44.702);

            Console.WriteLine($"result: {result}");
        }

    }

    [TestClass]
    public class MonolitTests
    {
        [TestMethod]
        public void Test_Monolit_CreateGunsmithDBStuff()
        {
            Monolit.CreateGunsmithDBStuff();
        }
        
        //! Use this one to rebuild DB
        [TestMethod]
        public void Test_Monolit_CreateMonolitFromScratch()
        {
            var outcome = Monolit.CreateMonolitFromScratch();
        }

        [TestMethod]
        public void Test_Hydrate_DB_WithAllFittings()
        {
            Fitting.Hydrate_DB_WithAllFittings();
        }

        [TestMethod]
        public void Test_MonolitRebuild()
        {
            Ammo_SQL.Generate_Save_All_Ammo();
            BallisticDetails.Generate_Save_All_BallisticDetails();
            ArmorItemStats.Generate_Save_All_ArmorItems();
            BallisticTest.Generate_Save_All_BallisticTests();
            BallisticRating.Generate_Save_All_BallisticRatings();
        }

        [TestMethod]
        public void Test_UpdateEverthingFromRatStashOrigin()
        {
            Ammo_SQL.UpdateEverthingFromRatStashOrigin();
        }

        [TestMethod]
        public void Test_BallisticRatingsTable_Generation()
        {
            BallisticRating.Generate_Save_All_BallisticRatings();
        }

        [TestMethod]
        public void Test_BallisticTestsTable_Generation()
        {
            BallisticTest.Generate_Save_All_BallisticTests();
        }

        [TestMethod]
        public void Test_ArmorItemsTable_Generation()
        {
            ArmorItemStats.Generate_Save_All_ArmorItems();
        }

        [TestMethod]
        public void Test_BallisticDetailsTable_Generation()
        {
            BallisticDetails.Generate_Save_All_BallisticDetails();
        }
        
        [TestMethod]
        public void Test_AmmoTable_Generation()
        {
            Ammo_SQL.Generate_Save_All_Ammo();
        }
    }
    [TestClass]
    public class ModsWeaponsPresetsTests
    {
        //[TestMethod]
        //public void Test_VerifyBasePresets_Count()
        //{
        //    var result = ModsWeaponsPresets.BasePresets;
        //    Console.WriteLine($"Count: {result.Count}");
        //    foreach (var preset in result)
        //    {
        //        Console.WriteLine($"{preset.Name}, {preset.Id},[{preset.Ergonomics}, {preset.Recoil_Vertical}, {preset.Weight}] {preset.PurchaseOffer.OfferType}");
        //    }
        //}

        [TestMethod]
        public void Test_GetShortListOfModsForCompundItemWithParams_AK74_Loud_40_noFLea()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74 5.45")).Id;
            List<WeaponMod> result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(weapon_id, MuzzleType.Loud, 40, false);
            Console.WriteLine($"Count: {result.Count}");
            foreach(WeaponMod mod in result)
            {
                Console.WriteLine($"{mod.Name}, {mod.Id}");
            }
        }
        [TestMethod]
        public void Test_GetShortListOfModsForCompundItemWithParams_AK74_Silent_40_noFLea()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74 5.45")).Id;
            List<WeaponMod> result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(weapon_id, MuzzleType.Quiet, 40, false);
            Console.WriteLine($"Count: {result.Count}");
            foreach (WeaponMod mod in result)
            {
                Console.WriteLine($"{mod.Name}, {mod.Id}");
            }
        }
        [TestMethod]
        public void Test_GetShortListOfModsForCompundItemWithParams_AK74_Any_40_noFLea()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74 5.45")).Id;
            List<WeaponMod> result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(weapon_id, MuzzleType.Any, 40, false);
            Console.WriteLine($"Count: {result.Count}");
            foreach (WeaponMod mod in result)
            {
                Console.WriteLine($"{mod.Name}, {mod.Id}");
            }
        }
    }

    [TestClass]
    public class GunsmithTests
    {
        static string AK_74M_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74M")).Id;
        static string M4A1_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Colt M4A1 5.56x45 ass")).Id;
        static string AK_74N_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74N")).Id;

        [TestMethod]
        public void Test_FitWeapon_AK74N_Loud_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74N_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Loud, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_AK74N_Quiet_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74N_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Quiet, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_AK74N_Any_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74N_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Any, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_M4A1_Loud_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(M4A1_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Loud, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_M4A1_Silent_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(M4A1_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Quiet, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_M4A1_Any_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(M4A1_id);
            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Any, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_74M_Loud_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74M_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Loud, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }


        [TestMethod]
        public void Test_FitWeapon_74M_Silent_MetaRecoil()
        {
            var weapon = (Weapon) StaticRatStash.DB.GetItem(AK_74M_id);

            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Quiet, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
        [TestMethod]
        public void Test_FitWeapon_74M_Any_MetaRecoil()
        {
            var weapon = (Weapon)StaticRatStash.DB.GetItem(AK_74M_id);
            Weapon fitted = Gunsmith.FitWeapon(weapon, FittingPriority.MetaRecoil, MuzzleType.Any, 40, false);

            var result = Gunsmith.GetCompoundItemStatsTotals<Weapon>(fitted);
            var validTuple = Gunsmith.CheckIfCompoundItemIsValid(fitted);

            Console.WriteLine($"result: {result}");
            Console.WriteLine($"Verify: {validTuple}");
            Gunsmith.PrintOutAttachedMods(fitted);

            Assert.IsTrue(validTuple.Valid);
        }
    }


    [TestClass]
    public class SingletonTests
    {
        [TestMethod]
        public void Test_GetSomeIDs_Init()
        {
            var adar = StaticRatStash.DB.GetItem(x => x.Name.Contains("AR-15 ADAR 2-15 wooden stock"));
            var r43_val = StaticRatStash.DB.GetItem(x => x.Name.Contains("AS VAL Rotor 43 pistol grip & buffer tube"));
            var cqr = StaticRatStash.DB.GetItem(x => x.Name.Contains("AR-15 Hera Arms CQR pistol grip/buttstock"));
            var cqr47 = StaticRatStash.DB.GetItem(x => x.Name.Contains("AKM/AK-74 Hera Arms CQR47 pistol grip/buttstock"));
        }


        [TestMethod]
        public void Test_StaticRatStash_Count()
        {
            int result = StaticRatStash.DB.GetItems().Count();
            Console.WriteLine($"Ratstash.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticArmors_parseTest()
        {
            var ChestRigs = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(ChestRig)).ToList();
            var vests = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(Armor)).ToList();

            Console.WriteLine($"ChestRigs.Count: {ChestRigs.Count}");
        }

        [TestMethod]
        public void Test_StaticArmors_CleanedCount()
        {
            var result = Armors.Cleaned.Count;
            Console.WriteLine($"Armors.Cleaned.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticAmmos_CleanedCount()
        {
            var result = Ammos.Cleaned.Count;
            Console.WriteLine($"Ammos.Cleaned.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticModsWeapons_Count()
        {
            var result = ModsWeaponsPresets.CleanedWeapons.Count;
            var result2 = ModsWeaponsPresets.CleanedMods.Count;

            Console.WriteLine($"AllWeapons.Count: {result}");
            Console.WriteLine($"AllMods.Count: {result2}");
        }

        [TestMethod]
        public void Test_WeaponsStatsAPIPatch()
        {
            var result = ModsWeaponsPresets.CleanedWeapons.Find(x=>x.Name.Contains("OP-SKS"));
            Console.WriteLine($"OP-SKS vertical Recoil: {result.RecoilForceUp}");
            Console.WriteLine($"FirstWeapon: {result}");
        }

        [TestMethod]
        public void Test_StaticModsWeapons_Silencers()
        {
            var result = ModsWeaponsPresets.GetListWithQuietMuzzles().Count;
            Console.WriteLine($"CleanedMods.Silencers.Count: {result}");
        }

        [TestMethod]
        public void Test_StaticModsWeapons_LoudMuzzles()
        {
            var result = ModsWeaponsPresets.GetListWithLoudMuzzles().Count;
            Console.WriteLine($"CleanedMods.LoudMuzzles.Count: {result}");
        }

        [TestMethod]
        public void Test_TarkovDevApi_GetFleaMarketData()
        {
            var result = TarkovDevAPI.GetFleaMarketData();
            Console.WriteLine($"GetAllFlea.Result: {result}");
        }

        [TestMethod]
        public void Test_TarkovDevApi_GetAllMarketData()
        {
            var result = TarkovDevAPI.GetAllMarketData();
            Console.WriteLine($"GetAllFlea.Result: {result}");
        }

        [TestMethod]
        public void Test_GetAllPossibleChildrenIdsForCI()
        {
            CompoundItem input = (CompoundItem) StaticRatStash.DB.GetItem(x => x.Name.Contains("Kalashnikov AK-74M 5.45x39 assault rifle"));

            var result = ModsWeaponsPresets.GetShortListOfModsForCompundItemWithParams(input.Id, MuzzleType.Loud, 40, false);
            Console.WriteLine($"GetShortListOfModsForCompundItemWithParams.Result.Count: {result.Count}");
        }

        [TestMethod]
        public void Test_StaticTest()
        {
            var loadDict = Market.LoyaltyLevelsByPlayerLevel;

            Console.WriteLine($"wtf: {loadDict.Count}");
            Console.WriteLine($"wtf: {loadDict}");
        }

    }


    //[TestClass]
    //public class BallisticTests
    //{
    //    static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

    //    [TestMethod]
    //    public void Test_AmmoAuthority_Init()
    //    {
    //        AmmoInformationAuthority result = new();
            
    //        using StreamWriter writetext = new("RangeTables.json");
    //        writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));
    //        Console.WriteLine(result);
    //    }

    //    [TestMethod]
    //    public void Test_GetDamageAndPenetrationAtSpeed_545BT_001m()
    //    {
    //        var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(866.9968f, 880f, 42, 42);
    //        Console.WriteLine(result);
    //    }

    //    [TestMethod]
    //    public void Test_GetDamageAndPenetrationAtSpeed_545BT_010m()
    //    {
    //        var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(854.3049f, 880f, 42, 42);
    //        Console.WriteLine(result);
    //    }

    //    [TestMethod]
    //    public void Test_GetDamageAndPenetrationAtSpeed_545BT_050m()
    //    {
    //        var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(806.42944f, 880f, 42, 42);
    //        Console.WriteLine(result);
    //    }

    //    [TestMethod]
    //    public void Test_GetDamageAndPenetrationAtSpeed_545BT_100m()
    //    {
    //        var result = WG_Ballistics.GetDamageAndPenetrationAtSpeed(731.42474f, 880f, 42, 42);
    //        Console.WriteLine(result);
    //    }

    //    [TestMethod]
    //    public void Test_GetBulletSpeedAtDistance_545BT_100m()
    //    {
    //        var result = WG_Ballistics.GetBulletSpeedAtDistance(100, 3.02f, 5.62f, .209f, 880);
    //        Console.WriteLine(result);

    //        Assert.IsTrue(731.42474 - result < .00005);
    //    }
    //    [TestMethod]
    //    public void Test_GetBulletSpeedAtDistance_545BT_400m()
    //    {
    //        var result = WG_Ballistics.GetBulletSpeedAtDistance(400, 3.02f, 5.62f, .209f, 880);
    //        Console.WriteLine(result);
    //    }

    //    [TestMethod]
    //    public void Test_BulletRangeTableData_invalidateCurrentData_545BT()
    //    {
    //        BulletRangeTableData instance = new();
    //        instance.bulletID = "56dff061d2720bb5668b4567";
    //        instance.bulletName = "5.45x39mm BT gs";

    //        bulletStatsPOCO bulletStatsPOCO = new bulletStatsPOCO();
    //        bulletStatsPOCO.penetration = 42;
    //        bulletStatsPOCO.damage = 42;
    //        bulletStatsPOCO.massGrams = 3.02f;
    //        bulletStatsPOCO.diameterMillimeters = 5.62f;
    //        bulletStatsPOCO.ballisticCoefficient = .209f;
    //        bulletStatsPOCO.initialSpeed = 880;

    //        var result = instance.invalidateCurrentData(bulletStatsPOCO, RatStashDB);
    //        Assert.IsTrue(result);
    //    }

    //    [TestMethod]
    //    public void Test_BulletRangeTablesAuthority_All()
    //    {

    //        List<Ammo> Ammo = RatStashDB.GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
    //        Ammo = Ammo.Where(x => x.Name.Contains("12/70")).ToList();
    //        OLD_AmmoInformationAuthority bulletRangeTablesAuthority = new OLD_AmmoInformationAuthority(Ammo, RatStashDB);

    //        using StreamWriter writetext = new("RangeTables.json");
    //        writetext.Write(JToken.Parse(JsonConvert.SerializeObject(bulletRangeTablesAuthority)));

    //        Console.WriteLine($"Number of entries: {bulletRangeTablesAuthority.RangeTables_Ammo.Count}");
    //    }
    //}

    //[TestClass]
    //public class CalculationTests
    //{
    //    static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

    //    [TestMethod]
    //    public void test()
    //    {
    //        List<Ammo> Ammo = RatStashDB.GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
    //        Console.WriteLine("blah");
    //    }

    //}
    //[TestClass]
    //public class DataScienceTests
    //{
    //    static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

    //    [TestMethod]
    //    public void Test_TagillaMask()
    //    {
    //        var result = RatStashDB.GetItems(x => x.Name.Contains("Tagilla's welding mask"));
    //    }


    //    [TestMethod]
    //    public void Test_CompileArmorTable()
    //    {
    //        var result = WG_DataScience.CompileArmorTable(RatStashDB);

    //        Console.WriteLine(result.Count);
    //        Assert.AreEqual(107, result.Count);
    //    }

    //    [TestMethod]
    //    public void Test_CompileAmmoTable()
    //    {
    //        var result = WG_DataScience.CompileAmmoTable(RatStashDB);

    //        Console.WriteLine(result.Count);
    //        Assert.AreEqual(166, result.Count);
    //    }

    //    [TestMethod]
    //    public void Test_CalculateArmorEffectivenessData_RatRig()
    //    {
    //        ArmorItem ratrig = new ArmorItem();
    //        ratrig.ArmorMaterial = ArmorMaterial.Titan;
    //        ratrig.BluntThroughput = .36;
    //        ratrig.MaxDurability = 40;
    //        ratrig.ArmorClass = 4;
    //        ratrig.Name = "RatRig dummy";

    //        var result = WG_DataScience.CalculateArmorEffectivenessData(ratrig, RatStashDB);

    //        Console.WriteLine(result.Count);
    //    }

    //}

    //[TestClass]
    //public class FittingTests
    //{
    //    static Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
    //    static List<WeaponMod> AllAvailibleWeaponMods = RatStashDB.GetItems(x => x is WeaponMod).Cast<WeaponMod>().ToList();

    //    static int filterMode = 1;

    //    [TestMethod]
    //    public void getAltynFS()
    //    {
    //        var altynFS = RatStashDB.GetItem("5aa7e373e5b5b000137b76f0");

    //        Console.WriteLine(altynFS.GetType().Name);

    //        var armoredEquipment = RatStashDB.GetItems(x => x.GetType() == typeof(ArmoredEquipment)).Cast<ArmoredEquipment>().ToList();
    //        armoredEquipment = armoredEquipment.Where(x => x.ArmorClass > 1).ToList();

    //        Console.WriteLine(armoredEquipment.Count);

    //        //todo Add this to the armorSelection List method and so on.
    //    }

    //    [TestMethod]
    //    public void SMFS_Wrapper_AKS_74UB()
    //    {
    //        var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);

    //        Weapon Weapon = (Weapon)RatStashDB.GetItem("5839a40f24597726f856b511");
    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(Weapon, filtered);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();
    //        HashSet<string> CommonBlackListIDs = new();


    //        var Meta_Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        var Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "recoil", CommonBlackListIDs);
    //        var Meta_Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
    //        var Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "ergo", CommonBlackListIDs);

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Recoil : {Recoil.Name}");
    //        var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Recoil);
    //        Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Ergo);
    //        Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Ergo : {Ergo.Name}");
    //        var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Ergo);
    //        Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        Console.WriteLine("");
    //    }

    //    [TestMethod]
    //    public void SelectModForSlot_AK_74M()
    //    {
    //        var Weapon = (Weapon)RatStashDB.GetItem("5ac4cd105acfc40016339859");
    //        HashSet<string> CommonBlackListIDs = new();

    //        var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, 3);
    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(Weapon, filtered);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    //        var Meta_Recoil = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        var Recoil = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
    //        var Meta_Ergo = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
    //        var Ergo = WG_Recursion.SelectModForSlot(Weapon.Slots[2], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Recoil : {Recoil.Name}");
    //        var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
    //        Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
    //        Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Ergo : {Ergo.Name}");
    //        var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
    //        Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        Console.WriteLine("");
    //    }


    //    [TestMethod]
    //    public void SMFS_Wrapper_AK_74M()
    //    {
    //        var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);
    //        HashSet<string> CommonBlackListIDs = new();

    //        Weapon Weapon = (Weapon)RatStashDB.GetItem("5ac4cd105acfc40016339859");
    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(Weapon, filtered);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();


    //        var Meta_Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        //var Recoil = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "recoil");
    //        //var Meta_Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "Meta Ergonomics");
    //        //var Ergo = WG_Recursion.SMFS_Wrapper(Weapon, ShortList_WeaponMods, "ergo");

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        //Console.WriteLine($"Recoil : {Recoil.Name}");
    //        //var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Recoil);
    //        //Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        //WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        //Console.WriteLine("");

    //        //Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        //var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Ergo);
    //        //Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        //WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        //Console.WriteLine("");

    //        //Console.WriteLine($"Ergo : {Ergo.Name}");
    //        //var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Ergo);
    //        //Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        //WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        //Console.WriteLine("");
    //        Console.WriteLine("Items on CBL:");
    //        foreach (var id in CommonBlackListIDs)
    //        {
    //            Console.WriteLine($"{RatStashDB.GetItem(id).Name}");
    //        }
    //    }

    //    [TestMethod]
    //    public void SMFS_Wrapper_ADAR()
    //    {
    //        var filtered = WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);
    //        HashSet<string> CommonBlackListIDs = new();

    //        Weapon ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, filtered);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();


    //        var Meta_Recoil = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        //var Recoil = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "recoil");
    //        //var Meta_Ergo = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "Meta Ergonomics");
    //        //var Ergo = WG_Recursion.SMFS_Wrapper(ADAR, ShortList_WeaponMods, "ergo");

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        //Console.WriteLine($"Recoil : {Recoil.Name}");
    //        //var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Recoil);
    //        //Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        //WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        //Console.WriteLine("");

    //        //Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        //var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Meta_Ergo);
    //        //Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        //WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        //Console.WriteLine("");

    //        //Console.WriteLine($"Ergo : {Ergo.Name}");
    //        //var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<Weapon>(Ergo);
    //        //Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        //WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        //Console.WriteLine("");
    //    }

    //    [TestMethod]
    //    public void SelectModForSlot_ADAR_PG()
    //    {
    //        var ADAR = (Weapon) RatStashDB.GetItem("5c07c60e0db834002330051f");
    //        HashSet<string> CommonBlackListIDs = new();

    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, AllAvailibleWeaponMods);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    //        var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
    //        var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
    //        var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[0], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Recoil : {Recoil.Name}");
    //        var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
    //        Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
    //        Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Ergo : {Ergo.Name}");
    //        var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
    //        Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        Console.WriteLine("");
    //    }

    //    [TestMethod]
    //    public void SelectModForSlot_ADAR_Upper() //Something isn't right with the way uppers are done
    //    {
    //        var filtered =  WG_Compilation.CompileFilteredModList(AllAvailibleWeaponMods, filterMode);

    //        var ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
    //        HashSet<string> CommonBlackListIDs = new();

    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, filtered);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    //        ShortList_WeaponMods = WG_Compilation.CompileFilteredModList(ShortList_WeaponMods, 3); // 3 is any mode

    //        var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
    //        var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
    //        var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[2], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Recoil : {Recoil.Name}");
    //        var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
    //        Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
    //        Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Ergo : {Ergo.Name}");
    //        var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
    //        Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        Console.WriteLine("");
    //    }

    //    [TestMethod]
    //    public void SelectModForSlot_ADAR_BufferTube()
    //    {
    //        var ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
    //        HashSet<string> CommonBlackListIDs = new();

    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, AllAvailibleWeaponMods);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    //        var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
    //        var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
    //        var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[3], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Recoil : {Recoil.Name}");
    //        var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
    //        Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
    //        Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Ergo : {Ergo.Name}");
    //        var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
    //        Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        Console.WriteLine("");
    //    }

    //    [TestMethod]
    //    public void SelectModForSlot_ADAR_ChrgHndl()
    //    {
    //        var ADAR = (Weapon)RatStashDB.GetItem("5c07c60e0db834002330051f");
    //        HashSet<string> CommonBlackListIDs = new();

    //        List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(ADAR, AllAvailibleWeaponMods);
    //        List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    //        var Meta_Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "Meta Recoil", CommonBlackListIDs);
    //        var Recoil = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "recoil", CommonBlackListIDs);
    //        var Meta_Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "Meta Ergonomics", CommonBlackListIDs);
    //        var Ergo = WG_Recursion.SelectModForSlot(ADAR.Slots[4], ShortList_WeaponMods, "ergo", CommonBlackListIDs);

    //        Console.WriteLine($"Meta_Recoil : {Meta_Recoil.Name}");
    //        var Meta_Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Recoil);
    //        Console.WriteLine($"The stats:     e{Meta_Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Recoil : {Recoil.Name}");
    //        var Recoil_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Recoil);
    //        Console.WriteLine($"The stats:     e{Recoil_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Recoil, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Meta_Ergo : {Meta_Ergo.Name}");
    //        var Meta_Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Meta_Ergo);
    //        Console.WriteLine($"The stats:     e{Meta_Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Meta_Ergo, 0);
    //        Console.WriteLine("");

    //        Console.WriteLine($"Ergo : {Ergo.Name}");
    //        var Ergo_Result = WG_Recursion.GetCompoundItemTotals_RecoilFloat<WeaponMod>(Ergo);
    //        Console.WriteLine($"The stats:     e{Ergo_Result}r");
    //        WG_Recursion.PrintAttachedModNames_Recursively(Ergo, 0);
    //        Console.WriteLine("");
    //    }
    //}

    
    [TestClass]
    public class MarketTests
    {
        static JObject? MarketDataJSON;
        static List<MarketEntry>? MarketData; 

        //[TestInitialize]
        //public void test_Init()
        //{
        //    MarketDataJSON = WG_TarkovDevAPICalls.GetAllArmorAmmoMods();
        //    MarketData = WG_Market.CompileMarketDataList(MarketDataJSON);
        //}
        
        [TestMethod]
        public void test_GetBestSaleOfferByItemId_Zabralo()
        {
            var result = Market.GetBestTraderSaleOffer("545cdb794bdc2d3a198b456a").PurchaseOffer.PriceRUB;
            Console.WriteLine($"Zabralo sell value is: {result}");
            Assert.IsTrue(result == 238680);
        }

        [TestMethod]
        public void test_GetItemTraderLevelByItemId_M855A1()
        {
            var result = Market.GetEarliestCheapestTraderPurchaseOffer("54527ac44bdc2d36668b4567").PurchaseOffer.MinVendorLevel;
            Console.WriteLine($"M855A1 trader level is: {result}");
            Assert.IsTrue(result == 4);
        }

        [TestMethod]
        public void test_GetCheapestTraderPurchaseOffer_null()
        {
            var result = Market.GetCheapestTraderPurchaseOffer("00000000");

            Assert.IsTrue(result == null);
        }
    }


    [TestClass]
    public class ClonerUnitTests
    {
        [TestMethod]
        public void DeepCloneTest_Weapon()
        {
            Weapon testObject = new Weapon();

            testObject.Name = "Test Ligma";

            var result = testObject.DeepClone();

            Console.WriteLine(result.Name);

            result.Name = "Just Ligma";

            Console.WriteLine(result.Name);
            Console.WriteLine(testObject.Name);

            Assert.IsTrue(testObject.Name.Equals("Test Ligma"));
            Assert.IsTrue(result.Name.Equals("Just Ligma"));
        }
    }
}