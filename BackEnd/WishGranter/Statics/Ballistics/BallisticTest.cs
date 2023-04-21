using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WishGranter.Statics
{
    public record class BallisticTest
    {
        public int? Id { get; set; }
        public string ArmorId { get; set; }
        public int DetailsId { get; set; } // foreign key
        public BallisticDetails? Details { get; set; }
        public float StartingDurabilityPerc { get; set; }
        public int ProbableKillShot { get; set; }
        public List<BallisticHit> Hits { get; set; }
    };

    public class BallisticTestEntityTypeConfiguration : IEntityTypeConfiguration<BallisticTest>
    {
        public void Configure(EntityTypeBuilder<BallisticTest> builder)
        {
            builder.ToTable("BallisticTests");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("int")
                .IsRequired();

            builder.Property(x => x.ArmorId)
                .HasColumnName("ArmorId")
                .HasColumnType("nvarchar(50)")
                .IsRequired();

            // Define the relationship between BallisticTest and BallisticDetails
            builder.HasOne(test => test.Details)
                .WithMany()
                .HasForeignKey(test => test.DetailsId)
                .IsRequired();

            builder.Property(x => x.StartingDurabilityPerc)
                .HasColumnName("StartingDurabilityPerc")
                .HasColumnType("decimal(18,3)")
                .IsRequired();

            builder.Property(x => x.ProbableKillShot)
                .HasColumnName("ProbableKillShot")
                .HasColumnType("int")
                .IsRequired();

            builder.HasMany(x => x.Hits)
                .WithOne()
                .HasForeignKey(x => x.TestId)
                .OnDelete(DeleteBehavior.Cascade);


        }
    }
}
