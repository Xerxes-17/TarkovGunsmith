using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WishGranter.Statics
{
    public record class BallisticHit
    {
        public int? TestId { get; set; }
        public int HitNum { get; set; }

        // Armor and Damage
        public double DurabilityBeforeHit { get; set; }
        public double DurabilityDamageTotalAfterHit { get; set; }
        public double PenetrationChance { get; set; }
        public double BluntDamage { get; set; }
        public double PenetrationDamage { get; set; }

        // Hitpoints and COK
        public double AverageRemainingHitPoints { get; set; }
        public float CumulativeChanceOfKill { get; set; }
        public float SpecificChanceOfKill { get; set; }
    }
    public class BallisticHitEntityTypeConfiguration : IEntityTypeConfiguration<BallisticHit>
    {
        public void Configure(EntityTypeBuilder<BallisticHit> builder)
        {
            builder.HasKey(b => new { b.TestId, b.HitNum });

            builder.Property(b => b.DurabilityBeforeHit)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.DurabilityDamageTotalAfterHit)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.PenetrationChance)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.BluntDamage)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.PenetrationDamage)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.AverageRemainingHitPoints)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.CumulativeChanceOfKill)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(b => b.SpecificChanceOfKill)
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.HasOne<BallisticTest>()
                .WithMany()
                .HasForeignKey(b => b.TestId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => new { x.TestId, x.HitNum}).IsUnique();
        }
    }
}
