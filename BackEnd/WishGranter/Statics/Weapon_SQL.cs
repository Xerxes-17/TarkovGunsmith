using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;

namespace WishGranter.Statics
{
    public record class Weapon_SQL
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public Weapon_SQL() { }
        public Weapon_SQL(Weapon weapon)
        {
            Id = weapon.Id;
            Name = weapon.Name;
        }

        public static int Hydrate_DB_WithWeapons()
        {
            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            var temp = ModsWeaponsPresets.CleanedWeapons;
            int count = 0;
            foreach(var weapon in temp)
            {
                var check = db.Weapons.Any(x => x.Id == weapon.Id);
                if (check == false)
                {
                    var sql_W = new Weapon_SQL(weapon);
                    db.Add(sql_W);
                    count++;
                }
            }

            db.SaveChanges();
            return count;
        }
    }
    public class WeaponEntityTypeConfiguration : IEntityTypeConfiguration<Weapon_SQL>
    {
        public void Configure(EntityTypeBuilder<Weapon_SQL> builder)
        {
            builder.ToTable("Weapons"); // Set table name

            builder.HasKey(a => a.Id); // Set primary key

            builder.Property(a => a.Name) // Configure Name property
                .IsRequired();
        }
    }
}
