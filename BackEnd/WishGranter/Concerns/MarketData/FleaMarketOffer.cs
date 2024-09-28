namespace WishGranter.Concerns.MarketData
{
    public record class FleaMarketOffer
    {
        public FleaMarketOffer() { }

        public FleaMarketOffer(string id, string name, int? basePrice, int? avg24hPrice, int? lastLowPrice, int? low24hPrice, int? high24hPrice, int? lastOfferCount, int? changeLast48h)
        {
            Id = id;
            Name = name;
            BasePrice = basePrice;
            Avg24hPrice = avg24hPrice;
            LastLowPrice = lastLowPrice;
            Low24hPrice = low24hPrice;
            High24hPrice = high24hPrice;
            LastOfferCount = lastOfferCount;
            ChangeLast48h = changeLast48h;
        }

        public string? Id { get; set; }
        public string? Name { get; set; }

        public int? BasePrice { get; set; }
        public int? Avg24hPrice { get; set; }
        public int? LastLowPrice { get; set; }
        public int? Low24hPrice { get; set; }
        public int? High24hPrice { get; set; }
        public int? LastOfferCount { get; set; }
        public int? ChangeLast48h { get; set; }

    }
}
