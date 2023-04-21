using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;

namespace WishGranter.Statics
{
    // Ballistic Details at a given distance for a given bullet
    public record class BallisticDetails
    {
        public int? Id { get; set; }
        public string AmmoId { get; set; }
        public Ammo Ammo { get; set; }
        public int Distance { get; set; }
        public float Penetration { get; set; }
        public float Damage { get; set; }
        public float Speed { get; set; }
    }
    public class BallisticDetailsEntityTypeConfiguration : IEntityTypeConfiguration<BallisticDetails>
    {
        public void Configure(EntityTypeBuilder<BallisticDetails> builder)
        {
            builder.ToTable("BallisticDetails");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.AmmoId)
                .IsRequired();

            builder.Property(b => b.Distance)
                .IsRequired();

            builder.Property(b => b.Penetration)
                .IsRequired()
                .HasColumnType("decimal(18,3)");

            builder.Property(b => b.Damage)
                .IsRequired()
                .HasColumnType("decimal(18,3)");

            builder.Property(b => b.Speed)
                .IsRequired()
                .HasColumnType("decimal(18,3)");

            builder.HasOne<Ammo_SQL>()
                .WithMany()
                .HasForeignKey(b => b.AmmoId);
        }
    }
}
