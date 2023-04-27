namespace WishGranterProto
{
    public class PurchaseOffer
    {
        public int PriceRUB { get; set; } = -1;
        public int Price { get; set; } = -1;
        public string Currency { get; set; } = string.Empty;
        public string Vendor { get; set; } = string.Empty;
        public int MinVendorLevel { get; set; } = -1;
        public int ReqPlayerLevel { get; set; } = -1;
        public OfferType OfferType { get; set; } = OfferType.None;
    }
}
