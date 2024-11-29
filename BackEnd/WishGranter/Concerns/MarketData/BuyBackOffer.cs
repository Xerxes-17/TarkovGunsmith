using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace WishGranter.Concerns.MarketData
{
    // For when you're selling something back to the traders
    // We're going to ignore the FleaMarket entries because the FleaOffer class will handle that instead
    public record class BuyBackOffer
    {
        public BuyBackOffer() {
            ItemId = "NOT_SET";
            TraderId =  "NOT_SET";
            Price = -1;
            Currency = "NOT_SET";
            PriceRUB = -1;
        }

        public BuyBackOffer(string itemId, string traderId, int price, string currency, int priceRUB)
        {
            ItemId = itemId;
            TraderId = traderId;
            Price = price;
            Currency = currency;
            PriceRUB = priceRUB;
        }

        public string ItemId { get; set; }
        public string TraderId { get; set; }
        public int Price { get; set; }
        public string Currency { get; set; }
        public int PriceRUB { get; set; }

        public class BuyBackOfferEntityTypeConfiguration : IEntityTypeConfiguration<BuyBackOffer>
        {
            public void Configure(EntityTypeBuilder<BuyBackOffer> builder)
            {
                builder.ToTable("BuyBackOffers");

                builder.HasKey(t => new { t.TraderId, t.ItemId });

                builder.Property(t => t.ItemId)
                    .IsRequired();

                builder.Property(t => t.TraderId)
                    .IsRequired();

                builder.Property(t => t.Price)
                    .IsRequired();

                builder.Property(t => t.Currency)
                    .IsRequired();

                builder.Property(t => t.PriceRUB)
                    .IsRequired();
            }
        }
    }
}
