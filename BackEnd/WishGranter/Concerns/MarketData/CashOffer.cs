using RatStash;

namespace WishGranter.Concerns.MarketData
{
    public class IdNameTuple
    {
        public IdNameTuple(string itemId, string itemName)
        {
            ItemId = itemId;
            ItemName = itemName;
        }

        public string? Id { get; set; }
        public string? Name { get; set;}
        public string ItemId { get; }
        public string ItemName { get; }
    }

    public class UnlockTask
    {
        public UnlockTask(IdNameTuple taskTrader, string taskId, string taskName, int? minPlayerLevel, string wikiLink)
        {
            TaskTrader = taskTrader;
            TaskId = taskId;
            TaskName = taskName;
            MinPlayerLevel = minPlayerLevel;
            WikiLink = wikiLink;
        }

        public string? Id { get; set; }
        public IdNameTuple? Trader {  get; set; }
        public string? Name { get; set; }
        public int? MinPlayerLevel { get; set; }
        public string? WikiLink { get; set; }
        public IdNameTuple TaskTrader { get; }
        public string TaskId { get; }
        public string TaskName { get; }
    }

    public class CashOffer
    {
        public CashOffer(IdNameTuple item, int? priceRUB, int? price, string currency, int? buyLimit, int? minTraderLevel)
        {
            Item = item;
            PriceRUB = priceRUB;
            Price = price;
            Currency = currency;
            BuyLimit = buyLimit;
            MinTraderLevel = minTraderLevel;
        }

        public CashOffer(IdNameTuple item, int? priceRUB, int? price, string currency, int? buyLimit, int? minTraderLevel, UnlockTask unlockTask) : this(item, priceRUB, price, currency, buyLimit, minTraderLevel)
        {
            UnlockTask = unlockTask;
        }

        public int? PriceRUB { get; set; }
        public int? Price { get; set; }
        public IdNameTuple? Item { get; set; }
        public string? Currency { get; set; }
        public int? BuyLimit { get; set; }
        public int? MinTraderLevel { get; set; }
        public UnlockTask? UnlockTask { get; }
    }
}

