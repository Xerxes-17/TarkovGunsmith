using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WishGranter.Statics;

namespace WishGranter.Concerns.MarketData
{
    public record class Trader
    {
        public Trader() { }
        public Trader(string id, string name, string imageLink, List<TraderLevel> levels)
        {
            Id = id;
            Name = name;
            ImageLink = imageLink;
            Levels = levels;
        }

        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? ImageLink { get; set; }

        public List<TraderLevel> Levels { get; set; } = new();

        public class TraderEntityTypeConfiguration : IEntityTypeConfiguration<Trader>
        {
            public void Configure(EntityTypeBuilder<Trader> builder)
            {
                builder.ToTable("Traders");

                builder.HasKey(t => t.Id);

                builder.Property(t => t.Name)
                    .IsRequired();

                builder.Property(t => t.ImageLink)
                    .IsRequired();

                builder.HasMany(t => t.Levels)
                    .WithOne()
                    .HasForeignKey(t=> t.Level)
                    .OnDelete(DeleteBehavior.Cascade);
            }
        }
    }
}
