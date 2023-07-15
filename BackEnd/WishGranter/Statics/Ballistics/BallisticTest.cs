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

        public static void CheckGenerateAndSavetoDB(BallisticDetails parent)
        {
            using var db = new Monolit();
            var armorItems = db.ArmorItems;
            parent.LoadAmmo();

            // Ensure that all possible outdated children are gone
            db.BallisticTests.RemoveRange(db.BallisticTests.Where(x => x.DetailsId == parent.Id));

            // Do all the sims and save
            foreach (var item in armorItems)
            {
                var result = Ballistics.SimulateHitSeries_Presets(item, 100, parent);
                db.Add(result);
            }


            db.SaveChanges();
        }

        public static void Generate_Save_All_BallisticTests()
        {
            using var db = new Monolit();
            var armorItems = db.ArmorItems;
            var ballisticDetails = db.BallisticDetails;

            foreach (var item in armorItems)
            {
                foreach (var details in ballisticDetails)
                {
                    details.LoadAmmo();

                    var check = db.BallisticTests.Any(x => x.ArmorId == item.Id && x.DetailsId == details.Id);
                    if (check == false)
                    {
                        var result = Ballistics.SimulateHitSeries_Presets(item, 100, details);
                        db.Add(result);

                        // Don't put SaveChanges here, far too slow.
                    }
                    // SaveChanges here is 130MB to 210MB RAM, still too slow
                }
                // About a GB or 2, takes 10 minutes
            }
            db.SaveChanges(); // Absolutely Chonks RAM, but is really fast at about 3.6 - 3.8 mins
        }
    };

    public class BallisticTestEntityTypeConfiguration : IEntityTypeConfiguration<BallisticTest>
    {
        public void Configure(EntityTypeBuilder<BallisticTest> builder)
        {
            builder.ToTable("BallisticTests");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(x => x.ArmorId)
                .HasColumnName("ArmorId")
                .HasColumnType("nvarchar(50)")
                .IsRequired();

            builder.HasOne<ArmorItemStats>()
                .WithMany()
                .HasForeignKey(b => b.ArmorId);

            // Define the relationship between BallisticTest and BallisticDetails
            builder.HasOne(test => test.Details)
                .WithMany()
                .HasForeignKey(test => test.DetailsId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

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

            builder.HasIndex(x => new { x.Id, x.ArmorId, x.DetailsId }).IsUnique();
        }
    }
}
