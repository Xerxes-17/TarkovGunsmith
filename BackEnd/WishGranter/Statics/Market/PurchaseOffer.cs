using System.Security.Cryptography;
using System.Text;

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

        public PurchaseOffer() { }
        public PurchaseOffer(int priceRUB, int price, string currency, string vendor, int minVendorLevel, int reqPlayerLevel, OfferType offerType)
        {
            PriceRUB = priceRUB;
            Price = price;
            Currency = currency;
            Vendor = vendor;
            MinVendorLevel = minVendorLevel;
            ReqPlayerLevel = reqPlayerLevel;
            OfferType = offerType;
        }
        public override int GetHashCode()
        {
            using (var sha256 = SHA256.Create())
            {
                var inputBytes = Encoding.UTF8.GetBytes(
                    $"{PriceRUB}{Price}{Currency}{Vendor}{MinVendorLevel}{ReqPlayerLevel}{OfferType}");

                var hashBytes = sha256.ComputeHash(inputBytes);

                return BitConverter.ToInt32(hashBytes, 0);
            }
        }

        internal PurchaseOffer Clone()
        {
            throw new NotImplementedException();
        }
    }
}
