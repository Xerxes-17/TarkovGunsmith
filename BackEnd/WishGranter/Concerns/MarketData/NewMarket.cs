using Newtonsoft.Json.Linq;
using OpenTelemetry.Trace;
using RatStash;
using System.Collections.Generic;
using System.Xml.Linq;
using WishGranter.Concerns.API;
using WishGranterProto;

namespace WishGranter.Concerns.MarketData
{
    // Concept: let's grab all of our market data from api.tarkov.dev and process it in a robust way that is then saved to an SQLite
    // db so we can do all of those nice SELECT * FROM markets calls.

    // data fetch from API or from SQL

    // process trader names from API or SQL

    // Process loyalty levels from API or SQL

    // process item cash offers from API or SQL

    // process barter offers from API or SQL

    public class NewMarket
    {
        private static readonly SemaphoreSlim _initLock = new(1, 1);
        public static bool initialised { get; set; } = false;

        private static List<Trader> _traders { get; set; } = new List<Trader>();
        private static List<FleaMarketOffer> _fleaMarketOffers { get; set; } = new List<FleaMarketOffer>();
        private static List<CashOffer> _cashOffers { get; set; } = new List<CashOffer>();

        private static List<BarterOffer> _barterOffers { get; set; } = new List<BarterOffer>();

        public static List<BuyBackOffer> _buyBackOffers { get; set; } = new List<BuyBackOffer>();

        public static async Task<List<Trader>> GetTraders()
        {
            if (initialised)
            {
                return _traders;
            }

            await _initLock.WaitAsync();
            try
            {
                if (!initialised)
                {
                    await InitNewMarketAsync();
                }
            }
            finally
            {
                _initLock.Release();
            }

            return _traders;
        }

        public static async Task<List<FleaMarketOffer>> GetFleaMarketOffers()
        {
            if (initialised)
            {
                return _fleaMarketOffers;
            }

            await _initLock.WaitAsync();
            try
            {
                if (!initialised)
                {
                    await InitNewMarketAsync();
                }
            }
            finally
            {
                _initLock.Release();
            }

            return _fleaMarketOffers;
        }

        public static async Task<List<CashOffer>> GetCashOffers()
        {
            if (initialised)
            {
                return _cashOffers;
            }

            await _initLock.WaitAsync();
            try
            {
                if (!initialised)
                {
                    await InitNewMarketAsync();
                }
            }
            finally
            {
                _initLock.Release();
            }

            return _cashOffers;
        }

        public static async Task<List<BarterOffer>> GetBarterOffers()
        {
            if (initialised)
            {
                return _barterOffers;
            }

            await _initLock.WaitAsync();
            try
            {
                if (!initialised)
                {
                    await InitNewMarketAsync();
                }
            }
            finally
            {
                _initLock.Release();
            }

            return _barterOffers;
        }

        public static async Task<List<BuyBackOffer>> GetBuyBackOffers()
        {
            if (initialised)
            {
                return _buyBackOffers;
            }

            await _initLock.WaitAsync();
            try
            {
                if (!initialised)
                {
                    await InitNewMarketAsync();
                }
            }
            finally
            {
                _initLock.Release();
            }

            return _buyBackOffers;
        }


        public static async Task InitNewMarketAsync()
        {
            await InitTraderBaseInfo();

            List<Task> tasks = new()
            {
                InitFleaMarketOffers(),
                InitTraderCashOffers(),
                InitTraderBarterOffers(),
                InitBuyBackOffers(),
            };

            await Task.WhenAll(tasks);

            bool isGreatSuccess =
                _traders.Count > 0 &&
                _barterOffers.Count > 0 &&
                _cashOffers.Count > 0 &&
                _fleaMarketOffers.Count > 0 &&
                _buyBackOffers.Count > 0;
                

            if (isGreatSuccess)
            {
                initialised = true;
            }

            initialised = true;
        }

        public static async Task InitTraderBaseInfo()
        {
            List<Trader> traders = new();

            var baseInfo = await NewTarkovDevApi.RobustGetTraderBaseInfo();

            string searchJSONpath = "$.data.traders[*]";
            var tokens = baseInfo.SelectTokens(searchJSONpath).ToList();

            if (tokens == null || tokens.Count == 0)
            {
                return;
            }

            foreach (JToken token in tokens)
            {
                var id = token.SelectToken(".id").ToString();
                var name = token.SelectToken("$.name").ToString();
                var imageLink = token.SelectToken("$.imageLink").ToString();

                List<TraderLevel> levels = new();
                var levelTokens = token.SelectTokens("$.levels.[*]");
                foreach (JToken levelToken in levelTokens)
                {
                    var level = levelToken.SelectToken("$.level").ToObject<int>();
                    var requiredPlayerLevel = levelToken.SelectToken("$.requiredPlayerLevel").ToObject<int>();
                    var requiredReputation = levelToken.SelectToken("$.requiredReputation").ToObject<float>();
                    var requiredCommerce = levelToken.SelectToken("$.requiredCommerce").ToObject<int>();

                    TraderLevel traderLevel = new(level, requiredPlayerLevel, requiredReputation, requiredCommerce, id);

                    levels.Add(traderLevel);
                }
                Trader trader = new(id, name, imageLink, levels);
                traders.Add(trader);
            }
            _traders = traders;
        }

        public static async Task InitFleaMarketOffers()
        {
            List<FleaMarketOffer> offers = new();

            var fleaMarketInfo = await NewTarkovDevApi.RobustGetFleaMarketOffers();

            string searchJSONpath = "$.data.items[*]";
            var tokens = fleaMarketInfo.SelectTokens(searchJSONpath).ToList();
            if (tokens == null || tokens.Count == 0)
            {
                return;
            }
            foreach (var token in tokens)
            {
                var id = token.SelectToken(".id").ToString();
                var name = token.SelectToken("$.name").ToString();
                var basePrice = token.SelectToken("$.basePrice")?.ToObject<int?>();
                var avg24hPrice = token.SelectToken("$.avg24hPrice")?.ToObject<int?>();
                var lastLowPrice = token.SelectToken("$.lastLowPrice")?.ToObject<int?>();
                var low24hPrice = token.SelectToken("$.low24hPrice")?.ToObject<int?>();
                var high24hPrice = token.SelectToken("$.high24hPrice")?.ToObject<int?>();
                var lastOfferCount = token.SelectToken("$.lastOfferCount")?.ToObject<int?>();
                var changeLast48h = token.SelectToken("$.changeLast48h")?.ToObject<int?>();

                FleaMarketOffer flaMarketOffer = new(id, name, basePrice, avg24hPrice, lastLowPrice, low24hPrice, high24hPrice, lastOfferCount, changeLast48h);
                offers.Add(flaMarketOffer);
            }

            _fleaMarketOffers = offers;
        }

        public static async Task InitTraderBarterOffers()
        {
            List<BarterOffer> barterOffers = new();

            var offersInfo = await NewTarkovDevApi.RobustGetTraderBarterOffers();
            string searchJSONpath = "$.data.traders[*]";

            var traders = offersInfo.SelectTokens(searchJSONpath).ToList();
            if (traders == null || traders.Count == 0)
            {
                return;
            }

            foreach (JToken trader in traders)
            {
                var traderId = trader.SelectToken("id").ToString();

                string searchTraderPath = "$.data.traders[*]";
                var tokens = trader.SelectTokens(searchTraderPath).ToList();
                foreach (JToken token in tokens)
                {
                    var barterId = token.SelectToken(".id").ToString();
                    var level = token.SelectToken("$.level")?.ToObject<int?>();
                    var buyLimit = token.SelectToken("$.buyLimit")?.ToObject<int?>();


                    var requiredItemsTokens = token.SelectToken("$.requiredItems[*]");
                    List<ItemBunch> requiredItems = new();
                    foreach (JToken requiredToken in requiredItemsTokens)
                    {
                        var itemId = requiredToken.SelectToken("item.id").ToString();
                        var itemName = requiredToken.SelectToken("$item.name").ToString();

                        IdNameTuple item = new(itemId, itemName);

                        var reqCount = requiredToken.SelectToken("$.count")?.ToObject<int?>(); ;
                        var reqQuantity = requiredToken.SelectToken("$.quantity")?.ToObject<int?>(); ;

                        ItemBunch requiredBunch = new(item, reqCount, reqQuantity);
                        requiredItems.Add(requiredBunch);
                    }


                    var rewardItemsTokens = token.SelectToken("$.rewardItems[*]");
                    List<ItemBunch> rewardItems = new();
                    foreach (JToken rewardToken in rewardItemsTokens)
                    {
                        var itemId = rewardToken.SelectToken("item.id").ToString();
                        var itemName = rewardToken.SelectToken("$item.name").ToString();

                        IdNameTuple item = new(itemId, itemName);

                        var reqCount = rewardToken.SelectToken("$.count")?.ToObject<int?>(); ;
                        var reqQuantity = rewardToken.SelectToken("$.quantity")?.ToObject<int?>(); ;

                        ItemBunch rewardBunch = new(item, reqCount, reqQuantity);
                        rewardItems.Add(rewardBunch);
                    }

                    var taskUnlockToken = token.SelectToken("$.taskUnlock");
                    if (taskUnlockToken == null)
                    {
                        BarterOffer barter = new(traderId, barterId, level, buyLimit, requiredItems, rewardItems);
                        barterOffers.Add(barter);
                    }
                    else
                    {
                        var taskId = taskUnlockToken.SelectToken(".id").ToString();
                        var taskName = taskUnlockToken.SelectToken("$.name").ToString();
                        var minPlayerLevel = taskUnlockToken.SelectToken("$.minPlayerLevel")?.ToObject<int?>();
                        var wikiLink = taskUnlockToken.SelectToken(".wikiLink").ToString();

                        var taskTraderId = taskUnlockToken.SelectToken("trader.id").ToString();
                        var taskTraderName = taskUnlockToken.SelectToken("trader.name").ToString();

                        IdNameTuple taskTrader = new IdNameTuple(taskTraderId, taskTraderName);

                        UnlockTask unlockTask = new UnlockTask(taskTrader, taskId, taskName, minPlayerLevel, wikiLink);
                        BarterOffer barter = new(traderId, barterId, level, buyLimit, requiredItems, rewardItems, unlockTask);
                        barterOffers.Add(barter);
                    }
                }
            }
            _barterOffers = barterOffers;

        }

        public static async Task InitTraderCashOffers()
        {
            List<CashOffer> cashOffers = new();

            var offersInfo = await NewTarkovDevApi.RobustGetTraderCashOffers();
            string searchJSONpath = "$.data.traders[*]";

            var traders = offersInfo.SelectTokens(searchJSONpath).ToList();

            if (traders == null || traders.Count == 0)
            {
                return;
            }

            foreach (JToken traderToken in traders)
            {
                var traderId = traderToken.SelectToken("id").ToString();

                string searchTraderPath = "$.data.traders[*]";
                var tokens = traderToken.SelectTokens(searchTraderPath).ToList();

                foreach (JToken token in tokens)
                {
                    var itemId = token.SelectToken("item.id").ToString();
                    var itemName = token.SelectToken("$item.name").ToString();

                    IdNameTuple item = new IdNameTuple(itemId, itemName);

                    var priceRUB = token.SelectToken("$.priceRUB")?.ToObject<int?>();
                    var price = token.SelectToken("$.price")?.ToObject<int?>();
                    var currency = token.SelectToken("$.currency").ToString();

                    var buyLimit = token.SelectToken("$.buyLimit")?.ToObject<int?>();
                    var minTraderLevel = token.SelectToken("$.minTraderLevel")?.ToObject<int?>();

                    var taskUnlockToken = token.SelectToken("$.taskUnlock");
                    if (taskUnlockToken == null)
                    {
                        CashOffer cashOffer = new CashOffer(item, traderId, priceRUB, price, currency, buyLimit, minTraderLevel);
                        cashOffers.Add(cashOffer);
                    }
                    else
                    {
                        var taskId = taskUnlockToken.SelectToken(".id").ToString();
                        var taskName = taskUnlockToken.SelectToken("$.name").ToString();
                        var minPlayerLevel = taskUnlockToken.SelectToken("$.minPlayerLevel")?.ToObject<int?>();
                        var wikiLink = taskUnlockToken.SelectToken(".wikiLink").ToString();

                        var taskTraderId = taskUnlockToken.SelectToken("trader.id").ToString();
                        var taskTraderName = taskUnlockToken.SelectToken("trader.name").ToString();

                        IdNameTuple taskTrader = new IdNameTuple(taskTraderId, taskTraderName);

                        UnlockTask unlockTask = new UnlockTask(taskTrader, taskId, taskName, minPlayerLevel, wikiLink);

                        CashOffer cashOffer = new CashOffer(item, traderId, priceRUB, price, currency, buyLimit, minTraderLevel, unlockTask);
                        cashOffers.Add(cashOffer);
                    }
                }
            }

            _cashOffers = cashOffers;
        }

        public static async Task InitBuyBackOffers()
        {
            List<BuyBackOffer> buyBackOffers = new();

            var offersInfo = await NewTarkovDevApi.RobustGetBuyBackOffers();
            string searchJSONpath = "$.data.items[*]";

            var items = offersInfo.SelectTokens(searchJSONpath).ToList();

            if (items == null || items.Count == 0)
            {
                return;
            }

            foreach (JToken itemToken in items)
            {
                var itemId = itemToken.SelectToken("id").ToString();
                var itemName = itemToken.SelectToken("name").ToString();

                string searchItemPath = "$.sellFor[*]";
                var sellTokens = itemToken.SelectTokens(searchItemPath).ToList();

                foreach (JToken token in sellTokens)
                {
                    var vendorName = token.SelectToken("$.vendor.name").ToString();
                    if (vendorName.Equals("Flea Market"))
                    {
                        continue;
                    }

                    var vendorId = _traders.Find(t => t.Name.Equals(vendorName))?.Id ?? "NOT_FOUND";
                    if (vendorId.Equals("NOT_FOUND"))
                    {
                        // TODO: Add a warning log here
                        continue;
                    }

                    var priceRUB = token.SelectToken("$.priceRUB").ToObject<int>();
                    var price = token.SelectToken("$.price").ToObject<int>();
                    var currency = token.SelectToken("$.currency").ToString();

                    BuyBackOffer buyBackOffer = new BuyBackOffer(
                        itemId,
                        vendorId,
                        price,
                        currency,
                        priceRUB
                        );

                    buyBackOffers.Add( buyBackOffer );
                }
            }



            _buyBackOffers = buyBackOffers;
        }

        /// <summary>
        /// Since we're going to only be dealing with weapon mods here, we know by definition it's always gonna be mechanic.
        /// If it can't find a BuyBack, returns -1.
        /// </summary>
        public static int FindBestBuyBackValue(string itemId)
        {
            var offers = _buyBackOffers.FindAll(x => x.ItemId == itemId).ToList();
            var maxValue = offers?.Max(x => x.PriceRUB) ?? -1;

            return maxValue;
        }

        /// <summary>
        /// As an intermediate step, we're going to create the old MarketEntry style data from the new approach. Hopefully I rediscover my 
        /// past intent!
        /// Todo: Replace this with whatever I was supposed to.
        /// Actually, shouldn't be using this for anything. delete it.
        /// </summary>
        public static List<MarketEntry> ConstructMarketData_Old()
        {
            List<MarketEntry> CompiledMarketDataList = new();

            foreach (var entry in _cashOffers)
            {
                var vendor = _traders.Find(t => t.Id.Equals(entry.TraderId));
                if (vendor == null)
                {
                    Console.WriteLine($"Warning: trader (id:{entry.TraderId}) not found in ConstructMarketData_Old()");
                    continue; 
                }
                var vendorId = vendor.Id ?? "ERR: MISSING";
                var vendorName = vendor.Name ;
                var minTraderLevel = entry.MinTraderLevel ?? 1;
                var reqPlayerLevel = vendor.Levels[minTraderLevel - 1].RequiredPlayerLevel;

                PurchaseOffer purchaseOffer = new(
                    entry.PriceRUB ?? -1,
                    entry.Price ?? -1,
                    entry.Currency ?? "",
                    vendorName ?? "",
                    entry.MinTraderLevel ?? -1,
                    reqPlayerLevel,
                    OfferType.Cash
                    );

                MarketEntry marketEntry = new MarketEntry();
                marketEntry.Id = vendorId;
                marketEntry.Name = vendorName ?? "ERR: MISSING";
                marketEntry.PurchaseOffer = purchaseOffer;

                CompiledMarketDataList.Add(marketEntry);
            }

            return CompiledMarketDataList;
        }
    }
}
