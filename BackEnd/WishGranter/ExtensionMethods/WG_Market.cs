using Newtonsoft.Json.Linq;
using RatStash;

namespace WishGranterProto.ExtensionMethods
{
    public class WG_Market
    {

        public static List<MarketEntry>  ReadyMarketData = new();

        public static List<string> TraderNames = new()
        {
            "Prapor",
            "Skier",
            "Peacekeeper",
            "Mechanic",
            "Jaeger",
            "Ragman"
        };

        public static Dictionary<string, int[]> LoyaltyLevelByPlayerLevel = new()
        {
            { "Prapor",         new[] { 1, 15, 26, 36 } },
            { "Skier",          new[] { 1, 15, 28, 38 } },
            { "Peacekeeper",    new[] { 1, 14, 23, 37 } },
            { "Mechanic",       new[] { 1, 20, 30, 40 } },
            { "Jaeger",         new[] { 1, 15, 22, 33 } },
            { "Ragman",         new[] { 1, 17, 32, 42 } }
        };

        // Takes in the MarketData from tarkov-dev and processes it into a nice flat list of Market Entires,
        // These market entries can be looked up later by other parts of the program for easy matching of 
        // needed data.
        public static List<MarketEntry> CompileMarketDataList(JObject MarketData)
        {
            List<MarketEntry> CompiledMarketDataList = new List<MarketEntry>();

            // We're handed a JSON by param, so let's break it down to a set of tokens.
            string searchJSONpath = "$.data.items[*]";
            var tokens = MarketData.SelectTokens(searchJSONpath).ToList();

            // Now for each token, lets get the details of them, so the Id and name
            foreach (var token in tokens)
            {
                var id = token.SelectToken(".id").ToString();
                var name = token.SelectToken("$.name").ToString();

                // Now we need to process the cashOffers, if any
                var cashOffers = token.SelectTokens("$.buyFor.[*]");
                foreach (var cashOffer in cashOffers)
                {
                    var priceRUB = cashOffer.SelectToken("$.priceRUB").ToObject<int>();
                    var currency = cashOffer.SelectToken("$.currency").ToString();
                    var price = cashOffer.SelectToken("$.price").ToObject<int>();
                    var vendor = cashOffer.SelectToken("$.vendor.name").ToString();
                    var minTraderLevel = -1;
                    var offerType = OfferType.Cash;

                    int reqPlayerLevel;
                    if (vendor != "Flea Market")
                    {
                        minTraderLevel = cashOffer.SelectToken("$.vendor.minTraderLevel").ToObject<int>();
                        reqPlayerLevel = LoyaltyLevelByPlayerLevel[vendor][minTraderLevel - 1];

                    }
                    else
                    {
                        minTraderLevel = 5;
                        reqPlayerLevel = 15;
                        offerType = OfferType.Flea;
                    }

                    PurchaseOffer purchaseOffer = new PurchaseOffer();
                    purchaseOffer.PriceRUB = priceRUB;
                    purchaseOffer.Currency = currency;
                    purchaseOffer.Price = price;
                    purchaseOffer.Vendor = vendor;
                    purchaseOffer.MinVendorLevel = minTraderLevel;
                    purchaseOffer.ReqPlayerLevel = reqPlayerLevel;
                    purchaseOffer.OfferType = offerType;

                    MarketEntry marketEntry = new MarketEntry();
                    marketEntry.Id = id;
                    marketEntry.Name = name;
                    marketEntry.PurchaseOffer = purchaseOffer;

                    CompiledMarketDataList.Add(marketEntry);
                }

                // Let's also process the barter offers, if any.
                var barterOffers = token.SelectTokens("$.bartersFor.[*]");
                foreach (var barterOffer in barterOffers)
                {
                    var trader = barterOffer.SelectToken("$.trader.name").ToString();
                    var minTraderLevel = barterOffer.SelectToken("$.level").ToObject<int>();
                    var reqPlayerLevel = LoyaltyLevelByPlayerLevel[trader][minTraderLevel - 1];


                    var requiredItems = barterOffer.SelectTokens("$.requiredItems[*]");
                    var barterTotalCost = -1;
                    foreach (var requiredItem in requiredItems)
                    {
                        var quantity = requiredItem.SelectToken("$.quantity").ToObject<int>();
                        var barterName = requiredItem.SelectToken("$.item.name").ToString();

                        var priceRUB = requiredItem.SelectToken("$..buyFor.[0].priceRUB");

                        int priceRUB_value = -1;
                        if (priceRUB != null)
                        {
                            priceRUB_value = priceRUB.Value<int>();
                        }

                        if (priceRUB_value != -1)
                        {
                            barterTotalCost += (quantity * priceRUB_value);
                        }
                    }
                    var offerType = OfferType.Barter;
                    // If the barter wants something that isn't buyable on the flea, we disregard it
                    if (barterTotalCost != -1)
                    {
                        PurchaseOffer purchaseOffer = new();
                        purchaseOffer.PriceRUB = barterTotalCost;
                        purchaseOffer.Vendor = trader;
                        purchaseOffer.MinVendorLevel = minTraderLevel;
                        purchaseOffer.ReqPlayerLevel = reqPlayerLevel;
                        purchaseOffer.OfferType = offerType;

                        MarketEntry marketEntry = new MarketEntry();
                        marketEntry.Id = id;
                        marketEntry.Name = name;
                        marketEntry.PurchaseOffer = purchaseOffer;

                        CompiledMarketDataList.Add(marketEntry);
                    }
                }

                // Last, we create market entries for the sale of the Item back to a trader
                // It should usually be mechanic, but there might be some execptions.
                var sellOffers = token.SelectTokens("$.sellFor.[*]");
                List<(string, int)> sellOffersSimple = new();
                foreach (var sellOffer in sellOffers)
                {
                    var priceRUB = sellOffer.SelectToken("$.priceRUB").ToObject<int>();
                    var vendor = sellOffer.SelectToken("$.vendor.name").ToString();
                    sellOffersSimple.Add((vendor, priceRUB));
                }
                sellOffersSimple.RemoveAll(x => x.Item1.Equals("Flea Market"));
                var bestSeller = sellOffersSimple.MaxBy(x => x.Item2);

                PurchaseOffer purchaseOffer_Sell = new PurchaseOffer();
                purchaseOffer_Sell.PriceRUB = bestSeller.Item2;
                purchaseOffer_Sell.Vendor = bestSeller.Item1;
                purchaseOffer_Sell.ReqPlayerLevel = 1;
                purchaseOffer_Sell.OfferType = OfferType.Sell;

                MarketEntry marketEntry_Sell = new MarketEntry();
                marketEntry_Sell.Id = id;
                marketEntry_Sell.Name = name;
                marketEntry_Sell.PurchaseOffer = purchaseOffer_Sell;

                CompiledMarketDataList.Add(marketEntry_Sell);

            }

            //Let's also set the static value here to this data, so that we can now just call functions in this class to do things and get stuff without needing to do parameter games
            ReadyMarketData = CompiledMarketDataList;

            // Return the Compiled Market Data!
            return CompiledMarketDataList;
        }

        public static List<MarketEntry> GetMarketDataFilteredByPlayerLeverl(int playerLevel)
        {
            return ReadyMarketData.Where( x => x.PurchaseOffer.ReqPlayerLevel <= playerLevel && (x.PurchaseOffer.OfferType == OfferType.Cash || x.PurchaseOffer.OfferType == OfferType.Barter)).ToList();
        }

        public static int GetBestCashOfferPriceByItemId(string Id)
        {
            int result = -1;
            var temp = ReadyMarketData.FindAll(x => x.Id == Id && x.PurchaseOffer.OfferType == OfferType.Cash);

            if (temp.Any())
            {
                temp.OrderBy(x => x.PurchaseOffer.PriceRUB);
                result = temp.First().PurchaseOffer.PriceRUB;
            }

            return result;
        }

        public static int GetItemTraderLevelByItemId(string Id)
        {
            int result = -1;
            var temp = ReadyMarketData.FindAll(x => x.Id == Id && (x.PurchaseOffer.OfferType == OfferType.Cash || x.PurchaseOffer.OfferType == OfferType.Barter));

            if (temp.Any())
            {
                temp.OrderBy(x => x.PurchaseOffer.PriceRUB);
                result = temp.First().PurchaseOffer.MinVendorLevel;
            }

            return result;
        }
        
        public static int GetBestSaleOfferByItemId(string Id)
        {
            int result = -1;
            var temp = ReadyMarketData.FindAll(x => x.Id == Id && x.PurchaseOffer.OfferType.Equals(OfferType.Sell));

            // Currently this isn't really needed since in the Compilation stage we only save the best sell offer, but that could change in future...
            if (temp.Any())
            {
                temp.OrderByDescending(x => x.PurchaseOffer.PriceRUB);
                result = temp.First().PurchaseOffer.PriceRUB;
            }

            return result;
        }
        
        public static int GetTotalSaleValue(List<string> Ids)
        {
            int total = 0;
            foreach(string s in Ids)
            {
                var result = GetBestSaleOfferByItemId(s);
                if (result != -1)
                {
                    total += result;
                }
            }
            return total;
        }

        public static int GetTotalCashOffers(List<string> Ids)
        {
            int total = 0;
            foreach (string s in Ids)
            {
                var result = GetBestCashOfferPriceByItemId(s);
                if (result != -1)
                {
                    total += result;
                }
            }
            return total;
        }

        public static (int initialCost, int sellBackTotal, int boughtModsTotal, int finalCost) CalculateWeaponBuildTotals(WeaponPreset preset, Weapon resultWeapon)
        {
            WG_Recursion.PrintAttachedModNames_Recursively(preset.Weapon, 0);

            Console.WriteLine("result");
            WG_Recursion.PrintAttachedModNames_Recursively(resultWeapon, 0);

            // Get the cost of the preset
            int initialCost = preset.PurchaseOffer.PriceRUB;

            // Get the list of mods in the preset, and the list of mods in the result
            var presetModIds = WG_Recursion.AggregateAttachedModsRecursively(preset.Weapon);
            var resultModIds = WG_Recursion.AggregateAttachedModsRecursively(resultWeapon);

            // Get the mods in the preset that were discarded, and get the sum of their sell back value
            var discardedPresetModIds = presetModIds.Except(resultModIds).ToList();
            var sellBackTotal = GetTotalSaleValue(discardedPresetModIds);

            // Get the mods in the result that were not a part of the preset, and then get the sum of thier buy cost
            var purchasedModIds = resultModIds.Except(presetModIds).ToList();
            var boughtModsTotal = GetTotalCashOffers(purchasedModIds);

            var finalCost = initialCost + boughtModsTotal - sellBackTotal;

            return (initialCost, sellBackTotal, boughtModsTotal, finalCost);
        }
    };
}
