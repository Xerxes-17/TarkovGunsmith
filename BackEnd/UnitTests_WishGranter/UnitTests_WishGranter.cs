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
using WishGranter.API_Methods;
using System.Collections.Immutable;

namespace WishGranterTests
{
    [TestClass]
    public class CalculateMultiShotSeriesTesting
    {
        [TestMethod]
        public void Test_MultiLayerSoftOnly()
        {
            ArmorLayer AR500 = new ArmorLayer
            {
                isPlate = true,
                armorClass = 3,
                bluntDamageThroughput = 18,
                durability = 45,
                maxDurability = 45,
                armorMaterial = ArmorMaterial.ArmoredSteel
            };
            ArmorLayer Kirasa = new ArmorLayer
            {
                isPlate = false,
                armorClass = 2,
                bluntDamageThroughput = 33,
                durability = 56,
                maxDurability = 56,
                armorMaterial = ArmorMaterial.Aramid
            };

            ArmorLayer[] layers = { AR500, Kirasa };

            BallisticSimParametersV2 parameters = new BallisticSimParametersV2
            {
                penetration = 28,
                damage = 53,
                armorDamagePerc = 40,
                initialHitPoints = 85,
                targetZone = "Thorax",
                armorLayers = layers
            };

            var result = Ballistics.CalculateMultiShotSeries(parameters);
            
            foreach(var iteration in result.hitSummaries)
            {
                Console.WriteLine(iteration.cumulativeChanceOfKill);
                Console.WriteLine(iteration.specificChanceOfKill);
                Console.WriteLine();
            }
            Console.WriteLine(result);
        }

    }
    [TestClass]
    public class HpProbabilitiesTesting
    {
        [TestMethod]
        public void Test_MultiLayerSoftOnly()
        {
            List<LayerSummaryResult> layerSummaryResults = new List<LayerSummaryResult>();
            LayerSummaryResult Kirasa = new LayerSummaryResult
            {
                isPlate = false,
                prPen = .972f,
                bluntThroughput = .33f,
                damageBlock = 17.49f,
                damagePen = 46.20f,
            };

            layerSummaryResults.Add(Kirasa);

            HpProbabilities hpProbabilities = new(85);

            hpProbabilities.updateProbabilities(layerSummaryResults);
            hpProbabilities.printCurrentInternals();
        }

        [TestMethod]
        public void Test_MultiLayerPlateOnly()
        {
            List<LayerSummaryResult> layerSummaryResults = new List<LayerSummaryResult>();
            LayerSummaryResult AR500 = new LayerSummaryResult
            {
                isPlate = true,
                prPen = 0.658f,
                bluntThroughput = .18f,
                damageBlock = 8.92f,
                damagePen = 35.18f,
            };

            layerSummaryResults.Add(AR500);

            HpProbabilities hpProbabilities = new(85);

            hpProbabilities.updateProbabilities(layerSummaryResults);
            hpProbabilities.printCurrentInternals();
        }

        [TestMethod]
        public void Test_MultiLayerPlateAndSoft()
        {
            List<LayerSummaryResult> layerSummaryResults = new List<LayerSummaryResult>();
            LayerSummaryResult AR500 = new LayerSummaryResult
            {
                isPlate = true,
                prPen = 0.658f,
                bluntThroughput = .18f,
                damageBlock = 8.92f,
                damagePen = 35.18f,
            };
            LayerSummaryResult Kirasa = new LayerSummaryResult
            {
                isPlate = false,
                prPen = 0.7257334f,
                bluntThroughput = .33f,
                damageBlock = 11.08f,
                damagePen = 21.110756f,
            };

            layerSummaryResults.Add(AR500);
            layerSummaryResults.Add(Kirasa);

            HpProbabilities hpProbabilities = new(85);

            hpProbabilities.updateProbabilities(layerSummaryResults);
            hpProbabilities.printCurrentInternals();
        }

        [TestMethod]
        public void Test_MultiLayerFaceShieldMaskGlasses()
        {
            List<LayerSummaryResult> layerSummaryResults = new List<LayerSummaryResult>();
            LayerSummaryResult layer1 = new LayerSummaryResult
            {
                isPlate = false,
                prPen = 0.6576608f,
                bluntThroughput = .148f,
                damageBlock = 7.3315787f,
                damagePen = 35.184593f,
            };
            LayerSummaryResult layer2 = new LayerSummaryResult
            {
                isPlate = false,
                prPen = 0.7257334f,
                bluntThroughput = .198f,
                damageBlock = 6.646726f,
                damagePen = 21.110756f,
            };
            LayerSummaryResult layer3 = new LayerSummaryResult
            {
                isPlate = false,
                prPen = 0.94688076f,
                bluntThroughput = .315f,
                damageBlock = 6.649888f,
                damagePen = 12.666453f,
            };

            layerSummaryResults.Add(layer1);
            layerSummaryResults.Add(layer2);
            layerSummaryResults.Add(layer3);

            HpProbabilities hpProbabilities = new(35);

            hpProbabilities.updateProbabilities(layerSummaryResults);
            hpProbabilities.printCurrentInternals();
        }
    }
    [TestClass]
    public class NewBallisticsTesting
    {
        [TestMethod]
        public void Test_ReductionFactor()
        {
            var result1 = Ballistics.CalculateReductionFactor(31, 100, 3);
            Console.WriteLine("Hoping for .75: " + result1);
            var result2 = Ballistics.CalculateReductionFactor(35, 100, 4);
            Console.WriteLine("Hoping for .66: " + result2);
        }

        [TestMethod]
        public void Test_CalculateFactor_A_1()
        {
            void PrintResultsToCSV(double[,] results, string filePath)
            {
                try
                {
                    using (StreamWriter sw = new StreamWriter(filePath))
                    {
                        for (int i = 0; i < results.GetLength(0); i++)
                        {
                            // Write each row to the CSV file
                            for (int j = 0; j < results.GetLength(1); j++)
                            {
                                sw.Write(results[i, j]);
                                if (j < results.GetLength(1) - 1)
                                    sw.Write(",");
                            }
                            sw.WriteLine();
                        }
                    }

                    Console.WriteLine("File created successfully at: " + filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error writing to file: " + ex.Message);
                }
            }


            int ACs = 6;
            int duraMax = 100;

            double[,] resultsArray = new double[ACs, duraMax];

            for (int i = 1; i < ACs; i++)
            {
                for(int j = 1; j <= duraMax; j++)
                {
                    var result = Ballistics.CalculateFactor_A(j, i);

                    resultsArray[i, j-1] = result;
                }
            }

            // Print the results to a CSV file
            PrintResultsToCSV(resultsArray, "D:\\DocumentsLibrary\\Desktop\\output_factorA.csv");

        }

        [TestMethod]
        public void Test_CalculateReductionFactor_BP()
        {
            void PrintResultsToCSV(double[,] results, string filePath)
            {
                try
                {
                    using (StreamWriter sw = new StreamWriter(filePath))
                    {
                        for (int i = 0; i < results.GetLength(0); i++)
                        {
                            // Write each row to the CSV file
                            for (int j = 0; j < results.GetLength(1); j++)
                            {
                                sw.Write(results[i, j]);
                                if (j < results.GetLength(1) - 1)
                                    sw.Write(",");
                            }
                            sw.WriteLine();
                        }
                    }

                    Console.WriteLine("File created successfully at: " + filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error writing to file: " + ex.Message);
                }
            }

            int ACs = 6;
            int duraMax = 100;

            double[,] resultsArray = new double[ACs, duraMax];

            for (int i = 1; i < ACs; i++)
            {
                for (int j = 1; j <= duraMax; j++)
                {
                    var result = Ballistics.CalculateReductionFactor(28, j, i);

                    resultsArray[i, j - 1] = result;
                }
            }
            PrintResultsToCSV(resultsArray, "D:\\DocumentsLibrary\\Desktop\\output_reductionFactor.csv");
        }
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
                SoftBluntThroughput = .33f,
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
        public void Test_MultiLayerSimulation_EngineV2_6B13_PP()
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
                Penetration = 34,
                Damage = 50,
                ArmorDamagePerc = 42,
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
        public void Test_GetSomething()
        {
            var result = StaticRatStash.DB.GetItems()
                .Where(x => x is ArmoredEquipment)
                .Where(x => x is not BuiltInInserts)
                .Where(x => x is not ArmorPlate)
                .Cast<ArmoredEquipment>()
                .Where(x=>x.ArmorClass > 0 && x.ArmorClass < 7)
                .ToList();

            var faceCovers = result.Where(x => x is FaceCover).ToList();
            var glasses = result.Where(x => x is VisObservDevice).ToList();
            var headwear = result.Where(x => x is Headwear).ToList();
            var armoredEquipment = result.Where(x => x is ArmoredEquipment).ToList();

            var test = faceCovers[0].GetType().ToString();

            var ArmoredChestRigs = StaticRatStash.DB.GetItems().Where(x => x is ChestRig).Cast<ChestRig>().ToList();
            var plates = StaticRatStash.DB.GetItems().Where(x => x is ArmorPlate).ToList();
            Console.WriteLine(result.Count);
            foreach(var item in result)
            {
                Console.WriteLine(item.Name);
            }

        }

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

        [TestMethod]
        public void Test_GetVelocityOf_M700()
        {
            string weapon_id = StaticRatStash.DB.GetItem(x => x.Name.Contains("Remington Model 700 7.62x51 bolt-action sniper rifle")).Id;
            
            var m700 = ModsWeaponsPresets.BasePresets.Find(x=>x.WeaponId == weapon_id && x.PurchaseOffer.OfferType == OfferType.Cash);

            var velocity = m700.Velocity;

            Console.WriteLine($"velocity m700: {velocity}");
        }

        [TestMethod]
        public void Test_GetAllOpticCalibrations()
        {
            var stuff = StaticRatStash.DB.GetItems().Where(x => x is Sights).Cast<Sights>().ToList();
            Console.WriteLine($"{stuff.Count}");
            HashSet<int> intervals = new HashSet<int>();
            stuff.ForEach(x =>
            {
                var foo = x.CalibrationDistances[0];
                Console.WriteLine($"{x.Name}, [{String.Join(", ", foo)}]");
                intervals.UnionWith(foo);
            });
            var sorted = intervals.ToImmutableSortedSet();
            Console.WriteLine($"unique intervals: {String.Join(", ", sorted)}");
        }

        [TestMethod]
        public void Test_GetDefaultAmmosByWeapon()
        {
            var defaultAmmoDictionary = ModsWeaponsPresets.CleanedWeapons
                .GroupBy(x => Ammos.Cleaned?.Find(ammo => ammo?.Id == x?.DefAmmo)?.Name ?? x.Id)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(x => x.ShortName)
                    );
            foreach (var item in defaultAmmoDictionary)
            {
                var valueString = String.Join(", ", item.Value);
                Console.WriteLine($"{item.Key}: {valueString}");
            }
        }


        [TestMethod]
        public void Test_GetDefaultAmmos_AndVelocityModifiers()
        {
            var defaultAmmoDictionary = ModsWeaponsPresets.BasePresets
                .GroupBy(x => Ammos.Cleaned?.Find(ammo => ammo?.Id == x.Weapon?.DefAmmo)?.Name ?? x.Id)
                .ToDictionary(
                    group => group.Key,
                    group => 
                    { 
                        var list = group.GroupBy(y => y.Velocity).ToList();
                        var sublistStrings = list.Select(subList =>
                        {
                            var subStart = subList.Key.ToString();
                            var subEnd = subList.Select(x => x.Weapon.ShortName).ToHashSet();
                            var subGroupString = string.Join(", ", subEnd);
                            return $"{subStart}:[{subGroupString}]";
                        });

                        var groupedValueString = string.Join(", " , sublistStrings);

                        return $"{{{groupedValueString}}}";
                    }  
                ) ;

            var sortedDictionary = new SortedDictionary<string, string>(defaultAmmoDictionary);

            foreach (var item in sortedDictionary)
            {
                var valueJoin = String.Join(", ", item.Value);
                Console.WriteLine($"{item.Key}, {valueJoin}");
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