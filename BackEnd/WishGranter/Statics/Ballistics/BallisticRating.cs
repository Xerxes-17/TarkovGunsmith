using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;

namespace WishGranter.Statics
{
    // This will need to be per BallisticDetails
    public class BallisticRating
    {
        //? tbh, need to see how the HTK numbers look, we can either go for decimals or for ceiling integer numbers
        [JsonIgnore]
        public int? Id { get; set; }
        [JsonIgnore]
        public int BallisticDetailsId { get; set; }
        public int AC { get; set; }
        public int ThoraxHTK_avg { get; set; }
        public int HeadHTK_avg { get; set; }
        public int LegHTK_avg { get; set; }
        public float FirstHitPenChance { get; set; }
        public float FirstHitPenetrationDamage { get; set; }

        public static void BurnAndReplaceAllRatings()
        {
            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            db.BallisticRatings.RemoveRange(db.BallisticRatings);
            db.SaveChanges();

            Dev_Generate_Save_All_BallisticRatings();
            db.SaveChanges();
        }

        public static void CheckGenerateAndSavetoDB(BallisticDetails parent)
        {
            using var db = new Monolit();
            parent.LoadAmmo();
            // Ensure that all possible outdated children are gone
            db.BallisticRatings.RemoveRange(db.BallisticRatings.Where(x => x.BallisticDetailsId == parent.Id));

            var ballisticTests = db.BallisticTests.Where(x => x.DetailsId.Equals(parent.Id)).ToList();
            var headArmorItems = db.ArmorItems.Where(x => x.TargetZone == TargetZone.Head).ToList();
            var thoraxArmorItems = db.ArmorItems.Where(x => x.TargetZone == TargetZone.Thorax).ToList();

            for (int i = 1; i <= 6; i++)
            {
                var headArmorItemsWithACi = headArmorItems.Where(x => x.ArmorClass == i).ToList();
                var thoraxArmorItemsWithACi = thoraxArmorItems.Where(x => x.ArmorClass == i).ToList();

                var headArmorIds = headArmorItemsWithACi.Select(x => x.Id).ToList();
                var thoraxArmorIds = thoraxArmorItemsWithACi.Select(x => x.Id).ToList();

                var headTestsAtThisAC = db.BallisticTests
                    .Where(x => x.DetailsId == parent.Id && headArmorIds.Contains(x.ArmorId))
                    .ToList();

                var thoraxTestsAtThisAC = db.BallisticTests
                    .Where(x => x.DetailsId == parent.Id && thoraxArmorIds.Contains(x.ArmorId))
                    .ToList();

                BallisticRating result = new BallisticRating
                {
                    BallisticDetailsId = (int)parent.Id,
                    AC = i,
                    HeadHTK_avg = (int)Math.Ceiling(headTestsAtThisAC.Select(x => x.ProbableKillShot).Average()),
                    LegHTK_avg = Ballistics.GetLegMetaHTK(parent.AmmoId),
                    FirstHitPenChance = (float)Ballistics.PenetrationChance(i, parent.Penetration, 100),
                    FirstHitPenetrationDamage = (float)Ballistics.PenetrationDamage(100, i, parent.Damage, parent.Penetration)
                };
                // with AC there currently are no AC1 thorax armors, so we can say that the HTK would be equivalent to no armor at all.
                if (i == 1)
                {
                    result.ThoraxHTK_avg = (int)Math.Ceiling(85 / parent.Damage);
                }
                else
                {
                    result.ThoraxHTK_avg = (int)Math.Ceiling(thoraxTestsAtThisAC.Select(x => x.ProbableKillShot).Average());
                }

                db.Add(result);
            }
            db.SaveChanges();
        }

        public static void Dev_Generate_Save_All_BallisticRatings()
        {
            using var db = new Monolit();

            var ballisticDetails = db.BallisticDetails;
            var ballisticTests = db.BallisticTests;

            var headArmorItems = db.ArmorItems.Where(x => x.TargetZone == TargetZone.Head).ToList();
            var thoraxArmorItems = db.ArmorItems.Where(x => x.TargetZone == TargetZone.Thorax).ToList();

            foreach (var bDetails in ballisticDetails)
            {
                bDetails.LoadAmmo();
                for (int i = 1; i <= 6; i++)
                {
                    var headArmorItemsWithACi = headArmorItems.Where(x => x.ArmorClass == i).ToList();
                    var thoraxArmorItemsWithACi = thoraxArmorItems.Where(x => x.ArmorClass == i).ToList();

                    var headArmorIds = headArmorItemsWithACi.Select(x => x.Id).ToList();
                    var thoraxArmorIds = thoraxArmorItemsWithACi.Select(x => x.Id).ToList();

                    var headTestsAtThisAC = db.BallisticTests
                        .Where(x => x.DetailsId == bDetails.Id && headArmorIds.Contains(x.ArmorId))
                        .ToList();

                    var thoraxTestsAtThisAC = db.BallisticTests
                        .Where(x => x.DetailsId == bDetails.Id && thoraxArmorIds.Contains(x.ArmorId))
                        .ToList();

                    BallisticRating result = new BallisticRating
                    {
                        BallisticDetailsId = (int)bDetails.Id,
                        AC = i,
                        HeadHTK_avg = (int)Math.Ceiling(headTestsAtThisAC.Select(x => x.ProbableKillShot).Average()),
                        LegHTK_avg = Ballistics.GetLegMetaHTK(bDetails.AmmoId),
                        FirstHitPenChance = (float)Ballistics.PenetrationChance(i, bDetails.Penetration, 100)
                    };
                    // with AC there currently are no AC1 thorax armors, so we can say that the HTK would be equivalent to no armor at all.
                    if (i == 1)
                    {
                        result.ThoraxHTK_avg = (int)Math.Ceiling(85 / bDetails.Damage);
                    }
                    else
                    {
                        result.ThoraxHTK_avg = (int)Math.Ceiling(thoraxTestsAtThisAC.Select(x => x.ProbableKillShot).Average());
                    }

                    db.Add(result);
                }
            }
            db.SaveChanges();
        }
    }
    public class BallisticRatingEntityTypeConfiguration : IEntityTypeConfiguration<BallisticRating>
    {
        public void Configure(EntityTypeBuilder<BallisticRating> builder)
        {
            builder.ToTable("BallisticRatings");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(x => x.BallisticDetailsId)
                .HasColumnName("BallisticDetailsId")
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(x => x.AC)
                .HasColumnName("AC")
                .HasColumnType("int")
                .IsRequired();

            builder.Property(x => x.ThoraxHTK_avg)
                .HasColumnName("ThoraxHTK_avg")
                .HasColumnType("int")
                .IsRequired();

            builder.Property(x => x.HeadHTK_avg)
                .HasColumnName("HeadHTK_avg")
                .HasColumnType("int")
                .IsRequired();

            builder.Property(x => x.LegHTK_avg)
                .HasColumnName("LegHTK_avg")
                .HasColumnType("int")
                .IsRequired();

            builder.Property(x => x.FirstHitPenChance)
                .HasColumnName("FirstHitPenChance")
                .HasColumnType("float")
                .IsRequired();

            builder.HasIndex(x => new { x.Id, x.BallisticDetailsId, x.AC }).IsUnique();
        }
    }
}
