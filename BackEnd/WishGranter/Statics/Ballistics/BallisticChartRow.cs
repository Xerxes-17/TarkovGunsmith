using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;
using RatStash;

namespace WishGranter.Statics
{
    public class BallisticTableRow
    {
        [JsonIgnore]
        public int? Id { get; set; }
        public string AmmoId { get; set; } = "";
        [JsonIgnore]
        public Ammo? Ammo { get; set; }
        public int Distance { get; set; }
        public float Penetration { get; set; }
        public float Damage { get; set; }
        public float Speed { get; set; }
        public int TimeOfFlightMS { get; set; }
        public int DropMM { get; set; }

        public void LoadAmmo()
        {
            Ammo = Ammos.Cleaned.FirstOrDefault(x => x.Id == AmmoId); // Load the Ammo property
        }

        public static void Generate_Save_All_BallisticTableRows()
        {
            var AllAmmoRecords = Ammos.Cleaned;

            using var db = new Monolit();

            foreach (var ammo in AllAmmoRecords)
            {
                var intervals = RangeSimulation.GetIntervalsFromAmmoCaliber(ammo);
                bool allGood = true;
                foreach (var interval in intervals)
                {
                    //Check if there are any missing intervals for that ammo
                    var check = db.BallisticTableRows.Any(x => x.AmmoId == ammo.Id && x.Distance == interval);
                    if (allGood && !check)
                    {
                        // If one is missing, remove all of them
                        allGood = false;
                        db.BallisticTableRows.RemoveRange(db.BallisticTableRows.Where(x => x.AmmoId == ammo.Id));
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

    public class BallisticTableRowEntityTypeConfiguration : IEntityTypeConfiguration<BallisticTableRow>
    {
        public void Configure(EntityTypeBuilder<BallisticTableRow> builder)
        {
            builder.ToTable("BallisticChartRows");

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

            builder.Property(b => b.TimeOfFlightMS)
                .IsRequired()
                .HasColumnType("decimal(18,3)");

            builder.Property(b => b.DropMM)
                .IsRequired();
        }
    }
}
