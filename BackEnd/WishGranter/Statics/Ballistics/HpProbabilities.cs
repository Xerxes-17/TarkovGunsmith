using Force.DeepCloner;
using WishGranter.API_Methods;

namespace WishGranter.Statics
{
    public class HpProbabilities
    {
        //Initial code for this class provided by NightShade, a true goon
        const int FACTOR = 100; // double to fixed multiplication factor
        public Dictionary<int, float> currentHpProbabilities { get; set; } = new() { [8500] = 1 };
        public Dictionary<int, float> previousHpProbabilities { get; set; } = new() { [8500] = 1 };

        public int hitNumber { get; set; } = 0;
        public float CumulativeChanceOfKillMemory { get; set; } = 0;
        public float cumulativeChanceOfKill { get; set; } = 0;
        public float specificChanceOfKill { get; set; } = 0;

        // Constructor
        public HpProbabilities(int HP)
        {
            currentHpProbabilities = new() { [HP * 100] = 1 };
            previousHpProbabilities = new() { [HP * 100] = 1 };
        }

        // Update Method, returns if the CCoKMem is > 99.99%

        public BallisticSimHitSummary updateProbabilities(List<LayerSummaryResult> layers)
        {
            Func<float, LayerSummaryResult, float> multiplyBluntThroughput = (accumulator, layerResult) => accumulator * (layerResult.bluntThroughput / 100);
            Func<float, LayerSummaryResult, float> multiplyPrPen = (accumulator, layerResult) => accumulator * layerResult.prPen;

            List<PrDamagePair> outcomes = new List<PrDamagePair>();

            List<LayerHitResultDetails> layerResults = new List<LayerHitResultDetails>();

            PrDamagePair penetrateAllLayers = new PrDamagePair
            {
                probability = layers.Aggregate(1, multiplyPrPen),
                damageFixed = (int)(layers.Last().damagePen * FACTOR),
            };

            //! We only care if the chance is more than 1 in a thousand
            if (penetrateAllLayers.probability > .001)
            {
                outcomes.Add(penetrateAllLayers);
            }

            for (int i = 0; i < layers.Count; i++)
            {
                float bluntDamage = layers[i].damageBlock;
                float prBlock = 1 - layers[i].prPen;

                if (i != layers.Count - 1 )
                {
                    //! Get the aggMult of subsequent layers so it can be applied to this layer's blunt damage
                    float subsequentLayersBluntCombined = layers.Skip(i).Aggregate(layers[i].bluntThroughput, multiplyBluntThroughput); //todo make some unit tests of this
                    if (layers[i].isPlate)
                    {
                        //! But if it's a plate we just set it to .6
                        subsequentLayersBluntCombined = .6f;
                    }
                    bluntDamage *= subsequentLayersBluntCombined;
                }
                //! Get the aggMult of previous layers PrPen so that it can be applied to the PrBlock of this layer
                var previousLayers = layers.Take(i);
                var aggPrPenPrevLayers = previousLayers.Aggregate(1, multiplyPrPen);
                prBlock *= aggPrPenPrevLayers;

                int blockDamageFixed = (int)(bluntDamage * FACTOR);

                outcomes.Add(new PrDamagePair { damageFixed = blockDamageFixed, probability = prBlock });

                LayerHitResultDetails layerDetails = new LayerHitResultDetails
                {
                    prBlock = prBlock,
                    damageBlock = bluntDamage,
                    damageMitigated = layers[i].damageMitigated,
                    averageRemainingDurability = layers[i].averageRemainingDP,
                };

                layerResults.Add(layerDetails);
            }
            //! Should result in layers.Count + 1 outcomes

            var nextProbabilities = new Dictionary<int, float>();
            foreach (var item in currentHpProbabilities)
            {
                var hp = item.Key;
                var probability = item.Value;

                foreach(var outcome in outcomes)
                {
                    var nextHp = Math.Max(hp - outcome.damageFixed, 0);
                    var nextPr = Math.Min(nextProbabilities.GetValueOrDefault(nextHp, 0) + (probability * outcome.probability), 1);
                    nextProbabilities[nextHp] = nextPr;
                }
            }

            currentHpProbabilities = nextProbabilities;

            if (currentHpProbabilities.ContainsKey(0))
            {
                cumulativeChanceOfKill = currentHpProbabilities[0] * 100;
                CumulativeChanceOfKillMemory = cumulativeChanceOfKill;


                if (previousHpProbabilities.ContainsKey(0))
                {
                    var previousDeathChance = previousHpProbabilities[0];
                    var currentDeathChance = currentHpProbabilities[0];
                    specificChanceOfKill = (currentDeathChance - previousDeathChance) * 100;
                }
                else
                {
                    specificChanceOfKill = currentHpProbabilities[0] * 100;
                }
            }

            Func<float, KeyValuePair<int, float>, float> accumulateAverageHpRemaining = (accumulator, superPositions) => accumulator + (superPositions.Key * superPositions.Value);
            var averageRemainingHP = currentHpProbabilities.Aggregate(0f, (acc, superPos) => accumulateAverageHpRemaining(acc, superPos))/100;

            BallisticSimHitSummary hitSummary = new BallisticSimHitSummary
            {
                hitNum = hitNumber + 1,
                specificChanceOfKill = specificChanceOfKill,
                cumulativeChanceOfKill = cumulativeChanceOfKill,
                averageRemainingHP = averageRemainingHP,
                prPenetration = penetrateAllLayers.probability,
                damagePenetration = layers.Last().damagePen,
                layerHitResultDetails = layerResults
            };

            previousHpProbabilities = currentHpProbabilities.DeepClone();
            hitNumber++;

            return hitSummary;
        }

        public void printCurrentInternals()
        {
            Console.WriteLine("Current State:");
            foreach(var value in currentHpProbabilities)
            {
                Console.WriteLine(value.ToString());
            }
            var PrSum = currentHpProbabilities.Values.Aggregate(0f, (acc, val) => acc + val);
            Console.WriteLine($"PrSum: {PrSum}");
            Console.WriteLine($"hitNumber {hitNumber}");
            Console.WriteLine($"CumulativeChanceOfKillMemory: {CumulativeChanceOfKillMemory}");
            Console.WriteLine($"thisCumulativeChanceOfKill: {cumulativeChanceOfKill}");
            Console.WriteLine($"thisSpecificChanceOfKill: {specificChanceOfKill}");
        }
    }
}
