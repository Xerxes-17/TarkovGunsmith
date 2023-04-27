using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;
using RatStash;

namespace WishGranter.Statics
{
    // Ballistic Details at a given distance for a given bullet
    public class BallisticDetails
    {
        [JsonIgnore]
        public int? Id { get; set; }
        [JsonIgnore]
        public string AmmoId { get; set; }
        [JsonIgnore]
        public Ammo? Ammo { get; set; }
        public int Distance { get; set; }
        public float Penetration { get; set; }
        public float Damage { get; set; }
        public float Speed { get; set; }
        public List<BallisticRating> Ratings { get; set; }

        public void LoadAmmo()
        {
            Ammo = Ammos.Cleaned.FirstOrDefault(x => x.Id == AmmoId); // Load the Ammo property
        }

        public void LoadRatings()
        {
            using var db = new Monolit();
            Ratings = db.BallisticRatings.Where(x => x.BallisticDetailsId.Equals(Id)).ToList();
        }
        
        public static void CheckGenerateAndSavetoDB(Ammo parent)
        {
            using var db = new Monolit();

            var distances = RangeSimulation.GetIntervalsFromAmmoCaliber(parent.Id);

            bool isMissingEntity = !distances.All(d => db.BallisticDetails.Any(e => e.AmmoId == parent.Id && e.Distance == d));

            if (isMissingEntity)
            {
                // Ensure that all possible outdated children are gone
                db.BallisticDetails.RemoveRange(db.BallisticDetails.Where(x => x.AmmoId == parent.Id));
                var refreshedList = RangeSimulation.CalculateBallisticDetailsAtIntervals(parent);
                db.AddRange(refreshedList);
                // Make sure that all of the children of this are updated too
                var details = db.BallisticDetails.Where(x => x.AmmoId.Equals(parent.Id)).ToList();
                foreach (var detail in details)
                {
                    BallisticTest.CheckGenerateAndSavetoDB(detail);
                    // Update the ratings too
                    BallisticRating.CheckGenerateAndSavetoDB(detail);
                }
            }
            db.SaveChanges();
        }

        public static void Dev_Generate_Save_All_BallisticDetails()
        {
            var AllAmmoRecords = Ammos.Cleaned;

            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            foreach (var ammo in AllAmmoRecords)
            {
                var intervals = RangeSimulation.GetIntervalsFromAmmoCaliber(ammo);
                bool allGood = true;
                foreach (var interval in intervals)
                {
                    //Check if there are any missing intervals for that ammo
                    var check = db.BallisticDetails.Any(x => x.AmmoId == ammo.Id && x.Distance == interval);
                    if (allGood && !check)
                    {
                        // If one is missing, remove all of them
                        allGood = false;
                        db.BallisticDetails.RemoveRange(db.BallisticDetails.Where(x => x.AmmoId == ammo.Id));
                        break;
                    }
                }

                if (!allGood)
                {
                    // Generate new list of values and add it to the DB
                    var refreshedList = RangeSimulation.CalculateBallisticDetailsAtIntervals((Ammo)ammo);
                    db.AddRange(refreshedList);
                }
            }
            db.SaveChanges();
        }
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

            builder.Ignore(b => b.Ammo); // ignore the Ammo field

            builder.HasOne<Ammo_SQL>()
                .WithMany()
                .HasForeignKey(b => b.AmmoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(b => new { b.Id, b.AmmoId, b.Distance }).IsUnique();

            builder.HasMany(b => b.Ratings)
                .WithOne()
                .HasForeignKey(r => r.BallisticDetailsId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
