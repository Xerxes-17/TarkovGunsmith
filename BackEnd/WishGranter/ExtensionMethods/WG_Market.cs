using Newtonsoft.Json.Linq;

namespace WishGranterProto.ExtensionMethods
{
    // I plan to expand this later so that there is one reccord for all possible information of a given item, for now will work with just cash offers.
    public class MarketRecord
    {
        string Name { get; set; }  = string.Empty;
        string Id { get; set; } = string.Empty;
        int BasePrice { get; set; } = -1;
        bool CanBuyOnRagFair { get; set; } = false;
        List<TraderCashOffer> CashOffers { get; set; } = new();
    }

    public class TraderCashOffer
    {
        public string TraderName { get; set; } = string.Empty ;
        public int TraderLevel { get; set; } = -1;
        public int RequiredPlayerLevel { get; set; } = -1;

        public string ItemId { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;

        public int PriceInRUB { get; set; } = -1;

    }

    public class SellOffer
    {
        public int PriceRUB { get; set; } = -1;
        public string TraderName { get; set; } = "Not set after construction";
    }
    public class MarketEntry
    {
        public string Name { get; set; } = "Not set after construction";
        public string Id { get; set; } = "Not set after construction";
        public PurchaseOffer PurchaseOffer { get; set; } = new();
    }

    public class WG_Market
    {
        public static List<string> TraderNames = new()
        {
            "Prapor",
            "Skier",
            "Peacekeeper",
            "Mechanic",
            "Jaeger"
        };

        public static Dictionary<string, int[]> LoyaltyLevelByPlayerLevel = new()
        {
            { "Prapor",         new[] { 1, 15, 26, 36 } },
            { "Skier",          new[] { 1, 15, 28, 38 } },
            { "Peacekeeper",    new[] { 1, 14, 23, 37 } },
            { "Mechanic",       new[] { 1, 20, 30, 40 } },
            { "Jaeger",         new[] { 1, 15, 22, 33 } }
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
                    var offerType = "Cash";

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
                        offerType = "Flea";
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
                    var offerType = "Barter";
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
                purchaseOffer_Sell.OfferType = "Sell";

                MarketEntry marketEntry_Sell = new MarketEntry();
                marketEntry_Sell.Id = id;
                marketEntry_Sell.Name = name;
                marketEntry_Sell.PurchaseOffer = purchaseOffer_Sell;

                CompiledMarketDataList.Add(marketEntry_Sell);

            }

            // Return the Compiled Market Data!
            return CompiledMarketDataList;
        }

        // Gets the item offers from traders
        static JObject TraderOffersJSON = TarkovDevQueryAsync("{traders(lang:en){ id name levels{ id level requiredReputation requiredPlayerLevel cashOffers{ item{ id name } priceRUB currency price }}}}", "TestingTraderOffers").Result;

        public static int GetCheapestCashOfferForItem(string id)
        {
            List<TraderCashOffer> NewList = GetAllCashOffers().Where(x => x.ItemId.Equals(id)).ToList();
            NewList.Sort((a, b) =>
            {
                if (a.PriceInRUB > b.PriceInRUB)
                {
                    return 1;
                }
                else if (a.PriceInRUB < b.PriceInRUB)
                {
                    return -1;
                }
                else
                {
                    return 0;
                }
            });
            return NewList[0].PriceInRUB;
        }

        public static int GetCheapestCashOfferForItemWithPlayerLevel(string id, int playerLevel)
        {
            List<TraderCashOffer> NewList = FilterTraderCashOffersByPlayerLevel(playerLevel);
            NewList = NewList.Where(x => x.ItemId.Equals(id)).ToList();
            NewList.Sort( (a,b) =>
            {
                if(a.PriceInRUB > b.PriceInRUB)
                {
                    return 1;
                }
                else if( a.PriceInRUB < b.PriceInRUB)
                {
                    return -1;
                }
                else
                {
                    return 0;
                }
            });
            return NewList[0].PriceInRUB;
        }

        public static List<TraderCashOffer> GetTraderCashOffersByItemId(string id)
        {
            List<TraderCashOffer> NewList = new();
            NewList.AddRange(GetAllCashOffers().Where(x => x.ItemId.Equals(id)));
            return NewList;
        }

        public static List<TraderCashOffer> FilterTraderCashOffersByPlayerLevel(int playerLevel)
        {
            List<TraderCashOffer> NewList = new();
            NewList.AddRange(GetAllCashOffers().Where(x => x.RequiredPlayerLevel <= playerLevel));
            return NewList;
        }

        public static List<TraderCashOffer> GetAllCashOffers()
        {
            TraderOffersJSON = TarkovDevQueryAsync("{traders(lang:en){ id name levels{ id level requiredReputation requiredPlayerLevel cashOffers{ item{ id name } priceRUB currency price }}}}", "TestingTraderOffers").Result;

            List<TraderCashOffer> outputList = new();

            foreach (var trader in LoyaltyLevelByPlayerLevel)
            {
                for (int i = 0; i < 4; i++)
                {
                    string searchJSONpath = $"$.data.traders.[?(@.name=='{trader.Key}')].levels.[?(@.level=={i+1})].cashOffers.[*]";
                    var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();
                    foreach (var result in filtering)
                    {
                        TraderCashOffer temp = new TraderCashOffer();

                        string searchJSONpath_id = "$.item.id";
                        var id = result.SelectToken(searchJSONpath_id).ToString();
                        temp.ItemId = id;

                        string searchJSONpath_name = "$.item.name";
                        var name = result.SelectToken(searchJSONpath_name).ToString();
                        temp.ItemName = name;

                        string searchJSONpath_priceRUB = "$.priceRUB";
                        var priceRUB = result.SelectToken(searchJSONpath_priceRUB).ToString();
                        temp.PriceInRUB = int.Parse(priceRUB);

                        temp.TraderName = trader.Key;
                        temp.TraderLevel = i + 1;
                        temp.RequiredPlayerLevel = trader.Value[i];

                        outputList.Add(temp);
                    }
                }
            }
            return outputList;
        }

        static async Task<JObject> TarkovDevQueryAsync(string queryDetails, string filename)
        {
            JObject result;

            using (var httpClient = new HttpClient())
            {
                // This is the GraphQL query string
                var Query = new Dictionary<string, string>()
        {
            {"query", queryDetails }
        };

                // Http response message, the result of the query
                var httpResponse = await httpClient.PostAsJsonAsync("https://api.tarkov.dev/graphql", Query);

                // Response content
                var responseContent = await httpResponse.Content.ReadAsStringAsync();

                // Parse response content into a JObject.
                result = JObject.Parse(responseContent);

                // Save the result as a local JSON
                using StreamWriter writetext = new("TarkovDev_jsons\\" + filename + ".json"); // This is here as a debug/verify
                writetext.Write(result);
                writetext.Close();
            }
            return result;
        }

    };

       
}
