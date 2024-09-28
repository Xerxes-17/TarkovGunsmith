namespace WishGranter.Concerns.MarketData
{

    public class ItemBunch
    {
        public ItemBunch(IdNameTuple item, int? reqCount, int? reqQuantity)
        {
            Item = item;
            Count = reqCount;
            Quantity = reqQuantity;
        }

        public IdNameTuple? Item { get; set; }
        public int? Count { get; set; }
        public int? Quantity { get; set; }
    }

    public class BarterOffer
    {
        public BarterOffer(string traderId, string barterId, int? level, int? buyLimit, List<ItemBunch> requiredItems, List<ItemBunch> rewardItems)
        {
            TraderId = traderId;
            Id = barterId;
            Level = level;
            BuyLimit = buyLimit;
            RequiredItems = requiredItems;
            RewardItems = rewardItems;
        }

        public BarterOffer(string traderId, string barterId, int? level, int? buyLimit, List<ItemBunch> requiredItems, List<ItemBunch> rewardItems, UnlockTask unlockTask) : this(traderId, barterId, level, buyLimit, requiredItems, rewardItems)
        {
            UnlockTask = unlockTask;
        }

        public string? TraderId { get; set; }

        public string? Id { get; set; }

        public int? Level { get; set; }

        public int? BuyLimit { get; set; }

        public UnlockTask? UnlockTask { get; }

        public List<ItemBunch> RequiredItems { get; set; }

        public List<ItemBunch> RewardItems { get; set; }
    }
}
