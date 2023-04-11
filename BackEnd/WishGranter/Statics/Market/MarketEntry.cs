namespace WishGranterProto
{
    public class MarketEntry
    {
        public string Name { get; set; } = "Not set after construction";
        public string Id { get; set; } = "Not set after construction";
        public PurchaseOffer PurchaseOffer { get; set; } = new();
    }
}
