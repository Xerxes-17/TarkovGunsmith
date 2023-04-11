using Newtonsoft.Json.Linq;
using WishGranterProto;

namespace WishGranter.Statics
{
    public static class Market
    {
        public static List<string> TraderNames = InitTraderNames();

        public static Dictionary<string, int[]> LoyaltyLevelsByPlayerLevel= InitLoyaltyLevels();

        //? Notionally I want to setup an update method for this that runs every minute or so (for flea market data).
        //todo this I'd most likely need to clear all of the current flea market entires and re-insert them.
        //todo this I'd also need to add a flea-market only query to TarkovDevApi
        public static List<MarketEntry> Offers = ConstructMarketData();


        private static List<string> InitTraderNames()
        {
            List<string> TraderNames = new()
            {
                "Prapor",
                "Skier",
                "Peacekeeper",
                "Mechanic",
                "Jaeger",
                "Ragman"
            };
            return TraderNames;
        }
        private static Dictionary<string, int[]> InitLoyaltyLevels()
        {
            Dictionary<string, int[]> LoyaltyLevelsByPlayerLevel = new()
            {
                { "Prapor", new[] { 1, 15, 26, 36 } },
                { "Skier", new[] { 1, 15, 28, 38 } },
                { "Peacekeeper", new[] { 1, 14, 23, 37 } },
                { "Mechanic", new[] { 1, 20, 30, 40 } },
                { "Jaeger", new[] { 1, 15, 22, 33 } },
                { "Ragman", new[] { 1, 17, 32, 42 } }
            };

            return LoyaltyLevelsByPlayerLevel;
        }

        private static List<MarketEntry> ConstructMarketData()
        {
            List<MarketEntry> CompiledMarketDataList = new();

            JObject MarketData = TarkovDevAPI.GetAllMarketData();

            // We're handed a JSON by param, so let's break it down to a set of tokens.
            string searchJSONpath = "$.data.items[*]";
            var tokens = MarketData.SelectTokens(searchJSONpath).ToList();

            // Now for each token, lets get the details of them, so the Id and name
            //todo Need to refactor this method to have smaller helper methods of sections, eg: token to pOffer and mEntry
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
                        reqPlayerLevel = LoyaltyLevelsByPlayerLevel[vendor][minTraderLevel - 1];

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
                    var reqPlayerLevel = LoyaltyLevelsByPlayerLevel[trader][minTraderLevel - 1];


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
            return CompiledMarketDataList;
        }

        private static List<MarketEntry> HelperProcessBuyForOffers(JObject MarketData)
        {
            List<MarketEntry> output = new();

            // We're handed a JSON by param, so let's break it down to a set of tokens.
            string searchJSONpath = "$.data.items[*]";
            var tokens = MarketData.SelectTokens(searchJSONpath).ToList();

            // Now for each token, lets get the details of them, so the Id and name
            //todo Need to refactor this method to have smaller helper methods of sections, eg: token to pOffer and mEntry
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
                        reqPlayerLevel = LoyaltyLevelsByPlayerLevel[vendor][minTraderLevel - 1];

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

                    output.Add(marketEntry);
                }
            }
            return output;
        }

        public static List<MarketEntry> GetSaleOffers()
        {
            return Offers.Where(x=>x.PurchaseOffer.OfferType == OfferType.Sell).ToList();
        }

        public static List<MarketEntry> GetBarterOffers()
        {
            return Offers.Where(x => x.PurchaseOffer.OfferType == OfferType.Barter).ToList();
        }

        public static List<MarketEntry> GetCashOffers()
        {
            return Offers.Where(x => x.PurchaseOffer.OfferType == OfferType.Cash).ToList();
        }

        public static List<MarketEntry> GetFleaOffers()
        {
            return Offers.Where(x => x.PurchaseOffer.OfferType == OfferType.Flea).ToList();
        }

        //? Hang on, if we update the flea offers we need to update the barters too, if we're updating barters and flea offers at the same time, we might as well just call a full refresh with the ConstructMarketData() method.
        public static void UpdateFleaOffers()
        {
            var newOffers = Offers.Where(x => x.PurchaseOffer.OfferType != OfferType.Flea);

            var newFleaOffers = HelperProcessBuyForOffers(TarkovDevAPI.GetFleaMarketData());

            Offers = newOffers.Union(newFleaOffers).ToList();
        }

        public static List<MarketEntry> GetTraderOffers()
        {
            var Cash = GetCashOffers();
            var Barters = GetBarterOffers();
            return Cash.Union(Barters).ToList();
        }

        public static List<MarketEntry> GetTraderOffersByPlayerlevel(int playerLevel)
        {
            var Cash = GetCashOffers();
            var Barters = GetBarterOffers();
            var union = Cash.Union(Barters).ToList();

            return union.Where(x=>x.PurchaseOffer.ReqPlayerLevel <= playerLevel).ToList();
        }

        public static MarketEntry GetBestTraderSaleOffer(string id)
        {
            var offers = GetSaleOffers();
            var offersForItem = offers.Where(x => x.Id == id).ToList();

            offersForItem = offersForItem.OrderByDescending(x => x.PurchaseOffer.PriceRUB).ToList();

            return offersForItem[0];
        }

        public static MarketEntry GetCheapestTraderPurchaseOffer(string id, int playerLevel)
        {
            var offers = GetTraderOffersByPlayerlevel(playerLevel);
            var offersForItem = offers.Where(x => x.Id == id).ToList();

            offersForItem = offersForItem.OrderBy(x => x.PurchaseOffer.PriceRUB).ToList();

            return offersForItem[0];
        }

        public static List<MarketEntry> GetFreeMarketPurchaseOffersByPlayerLevel(int playerLevel)
        {
            var offers = GetTraderOffersByPlayerlevel(playerLevel);
            if (playerLevel >= 15)
                offers.Union(GetFleaOffers());

            return offers;
        }
        public static MarketEntry GetCheapestFreeMarketPurchaseOffer(string id, int playerLevel)
        {
            var offers = GetFreeMarketPurchaseOffersByPlayerLevel(playerLevel);

            var offersForItem = offers.Where(x => x.Id == id).ToList();
            offersForItem = offersForItem.OrderBy(x => x.PurchaseOffer.PriceRUB).ToList();

            return offersForItem[0];
        }
    }
}
