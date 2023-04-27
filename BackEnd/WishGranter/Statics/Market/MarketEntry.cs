namespace WishGranterProto
{
    public class MarketEntry
    {
        public string Name { get; set; } = "Not set after construction";
        public string Id { get; set; } = "Not set after construction";
        //todo consider making this into a list, as we sometimes will want 
        public PurchaseOffer PurchaseOffer { get; set; } = new();
    }
}
