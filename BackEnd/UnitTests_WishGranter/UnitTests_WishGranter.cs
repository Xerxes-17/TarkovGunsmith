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
    public class NewBallisticsTesting
    {
        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_Trooper_BP()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 40,
                PlateStartingDurabilityPerc = 100,
                PlateBluntThroughput = 0.26f,
                PlateArmorMaterial = ArmorMaterial.UHMWPE,

                SoftArmorClass = 2,
                SoftMaxDurability = 50,
                SoftStartingDurabilityPerc = 76,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 BP
                Penetration = 45,
                Damage = 46,
                ArmorDamagePerc = 46,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach (var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                //Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                //Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                //Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                //Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }
        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_AnaM1_545_BP()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 45,
                PlateStartingDurabilityPerc = 100,
                PlateBluntThroughput = .18f,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 40,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .23f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 BP
                Penetration = 45,
                Damage = 46,
                ArmorDamagePerc = 46,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach (var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }
        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_AnaM1_545_PS()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 45,
                PlateStartingDurabilityPerc = 100,
                PlateBluntThroughput = .18f,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 40,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .23f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 PS
                Penetration = 28,
                Damage = 53,
                ArmorDamagePerc = 40,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach (var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                //Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                //Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }

        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_AnaM1_762_39_PS()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 45,
                PlateStartingDurabilityPerc = 100,
                PlateBluntThroughput = .18f,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 40,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //7.62x39 PS
                Penetration = 35,
                Damage = 57,
                ArmorDamagePerc = 52,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach (var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                //Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                //Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }

        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_6B13_FMJ()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 50,
                PlateStartingDurabilityPerc = 100,
                PlateBluntThroughput = .18f,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 34,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 FMJ
                Penetration = 24,
                Damage = 55,
                ArmorDamagePerc = 38,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach (var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                //Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                //Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                //Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                //Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }

        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_6B13_PS()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 50,
                PlateStartingDurabilityPerc = 100,
                PlateBluntThroughput = .18f,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 34,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 PS
                Penetration = 28,
                Damage = 53,
                ArmorDamagePerc = 40,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach(var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }

        [TestMethod]
        public void Test_MultiLayerSimulation_Trooper_PS()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 40,
                PlateStartingDurabilityPerc = 100,
                PlateArmorMaterial = ArmorMaterial.UHMWPE,

                SoftArmorClass = 2,
                SoftMaxDurability = 50,
                SoftStartingDurabilityPerc = 76,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //7.62 T45m1
                Penetration = 28,
                Damage = 53,
                ArmorDamagePerc = 40,
            };

            Ballistics.MultiLayerSimulation_Engine(multiLayerSimulationParameters);
        }

        [TestMethod]
        public void Test_MultiLayerSimulation_Engine_6B13_FMJ()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 50,
                PlateStartingDurabilityPerc = 100,
                PlateArmorMaterial = ArmorMaterial.Ceramic,

                SoftArmorClass = 2,
                SoftMaxDurability = 34,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 FMJ
                Penetration = 24,
                Damage = 55,
                ArmorDamagePerc = 38,
            };

            Ballistics.MultiLayerSimulation_Engine(multiLayerSimulationParameters);
        }

        [TestMethod]
        public void Test_MultiLayerSimulation_Engine_6B13_PS()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 50,
                PlateBluntThroughput = .18f,
                PlateStartingDurabilityPerc = 100,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 34,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 PS
                Penetration = 28,
                Damage = 53,
                ArmorDamagePerc = 40,
            };

            Ballistics.MultiLayerSimulation_Engine(multiLayerSimulationParameters);
        }
        [TestMethod]
        public void Test_MultiLayerSimulation_EngineV2_6B13_BP()
        {
            MultiLayerSimulationParameters multiLayerSimulationParameters = new MultiLayerSimulationParameters
            {
                TargetZone = TargetZone.Thorax,

                PlateArmorClass = 4,
                PlateMaxDurability = 50,
                PlateBluntThroughput = .18f,
                PlateStartingDurabilityPerc = 100,
                PlateArmorMaterial = ArmorMaterial.ArmoredSteel,

                SoftArmorClass = 2,
                SoftMaxDurability = 34,
                SoftStartingDurabilityPerc = 100,
                SoftBluntThroughput = .33f,
                SoftArmorMaterial = ArmorMaterial.Aramid,

                //5.45 BP
                Penetration = 45,
                Damage = 46,
                ArmorDamagePerc = 46,
            };

            var result = Ballistics.MultiLayerSimulation_EngineV2(multiLayerSimulationParameters);

            foreach (var item in result)
            {
                Console.WriteLine("");
                Console.WriteLine($"HitNum: {item.HitNum}");

                Console.WriteLine($"PenetrationChance_Plate : {item.PenetrationChance_Plate}");
                //Console.WriteLine($"DurabilityBeforeHit_Plate: {item.DurabilityBeforeHit_Plate}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Plate : {item.DurabilityDamageTotalAfterHit_Plate}");

                //Console.WriteLine($"PenetrationPower_PostPlate: {item.PenetrationPower_PostPlate }");
                //Console.WriteLine($"Damage_PostPlate: {item.Damage_PostPlate }");

                Console.WriteLine($"PenetrationChance_Soft: {item.PenetrationChance_Soft}");
                //Console.WriteLine($"DurabilityBeforeHit_Soft: {item.DurabilityBeforeHit_Soft}");
                //Console.WriteLine($"DurabilityDamageTotalAfterHit_Soft: {item.DurabilityDamageTotalAfterHit_Soft}");

                Console.WriteLine($"BluntDamage: {item.BluntDamage }");
                Console.WriteLine($"PenetrationDamage: {item.PenetrationDamage }");

                Console.WriteLine($"AverageRemainingHitPoints: {item.AverageRemainingHitPoints}");
                Console.WriteLine($"CumulativeChanceOfKill: {item.CumulativeChanceOfKill}");
                Console.WriteLine($"SpecificChanceOfKill: {item.SpecificChanceOfKill}");
            }
        }


        [TestMethod]
        public void Test_NewCalcReductionMult()
        {
            for (int i = 0; i < 20; i++)
            {
                var result = Ballistics.CalculateReductionFactor(30+i, 100, 4);
                Console.WriteLine($"pen: {30 + i}, dura: 100%, ac: 4, reductionFactor: {result}");
            }
        }


        [TestMethod]
        public void Test_NewBlunt2()
        {
            //Testing damage of 9x18mm PM P vs Steel C
            var result = Ballistics.BluntDamage(100, 3, .2, 50, 5);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_NewBlunt()
        {
            //Testing damage of 7mm buck pellet vs nerc armor aramid of 6B13
            var result = Ballistics.BluntDamage(100, 3, .33, 38, 3);
            Console.WriteLine(result);
        }

        [TestMethod]
        public void Test_SomeMath()
        {
            Monolit db = new();
            var armor = db.ArmorItems.FirstOrDefault(y => y.Id.Equals("5ca21c6986f77479963115a7"));
            var ammo = db.BallisticDetails.FirstOrDefault(x => x.AmmoId.Equals("601aa3d2b2bcb34913271e6d") && x.Distance == 10);

            var result = Ballistics.SimulateHitSeries_Presets(armor, 100, ammo);
            Console.WriteLine(result);
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
                ArmorClass = 4,
                MaxDurability = 38,
                StartingDurabilityPerc = 100,
                BluntThroughput = .156f,
                ArmorMaterial = ArmorMaterial.Aramid,
                TargetZone = TargetZone.Head,
                Penetration = 47.593f,
                Damage = 37.715f,
                ArmorDamagePerc = 58
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