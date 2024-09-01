using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace WishGranter.Concerns.MarketData
{
    public record class TraderLevel
    {
        public TraderLevel() { }
        public TraderLevel(int level, int requiredPlayerLevel, float requiredReputation, int requiredCommerce, string traderId)
        {
            Level = level;
            RequiredPlayerLevel = requiredPlayerLevel;
            RequiredReputation = requiredReputation;
            RequiredCommerce = requiredCommerce;
            TraderId = traderId;
        }

        public int Level { get; set; }
        public int RequiredPlayerLevel { get; set; }
        public float RequiredReputation { get; set; }
        public int RequiredCommerce { get; set; }

        [JsonIgnore]
        public string? TraderId { get; set; }

        public class TraderLevelEntityTypeConfiguration : IEntityTypeConfiguration<TraderLevel>
        {
            public void Configure(EntityTypeBuilder<TraderLevel> builder)
            {
                builder.ToTable("TraderLevels");

                builder.HasKey(tl => new { tl.TraderId, tl.Level });

                builder.Property(tl => tl.RequiredPlayerLevel)
                    .HasColumnType("decimal(18,3)")
                    .IsRequired();

                builder.Property(tl => tl.RequiredReputation)
                    .HasColumnType("decimal(18,3)")
                    .IsRequired();

                builder.Property(tl => tl.RequiredCommerce)
                    .HasColumnType("decimal(18,3)")
                    .IsRequired();

                builder.HasOne<Trader>()
                    .WithMany()
                    .HasForeignKey(b => b.TraderId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasIndex(x => new { x.TraderId, x.Level }).IsUnique();
            }
        }
    }
}
