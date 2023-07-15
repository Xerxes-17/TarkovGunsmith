using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;
using System.ComponentModel.DataAnnotations;

namespace WishGranter.Statics
{
    public record class Ammo_SQL
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Penetration { get; set; }
        [Required]
        public int ArmorDamage { get; set; }
        [Required]
        public int Damage { get; set; }
        [Required]
        public int InitialSpeed { get; set; }

        public float BulletMass { get; set; }
        public float BulletDiameterMillimeters { get; set; }
        public float BallisticCoeficient { get; set; }


        Ammo_SQL() { }
        Ammo_SQL(Ammo ammo)
        {
            Id = ammo.Id;
            Name = ammo.Name;
            Penetration = ammo.PenetrationPower;
            ArmorDamage = ammo.ArmorDamage;
            Damage = ammo.Damage;
            InitialSpeed = ammo.InitialSpeed;
            BulletMass = ammo.BulletMass;
            BulletDiameterMillimeters = ammo.BulletDiameterMillimeters;
            BallisticCoeficient = ammo.BallisticCoeficient;
        }

        public bool EqualsExceptName(Ammo a)
        {
            return Id == a.Id &&
                Penetration == a.PenetrationPower &&
                ArmorDamage == a.ArmorDamage &&
                Damage == a.Damage &&
                InitialSpeed == a.InitialSpeed &&
                BulletMass == a.BulletMass &&
                BulletDiameterMillimeters == a.BulletDiameterMillimeters &&
                BallisticCoeficient == a.BallisticCoeficient;
        }

        public static List<Ammo_SQL> GetListOfStaleAmmoComparedToRatStash()
        {
            using var db = new Monolit();
            var RatStashAmmos = Ammos.Cleaned;
            List < Ammo_SQL > returnList = new List<Ammo_SQL>();

            foreach (var RatAmmo in RatStashAmmos)
            {
                var DBAmmo = db.Ammos.FirstOrDefault(x => x.Id == RatAmmo.Id);
                if (DBAmmo != null)
                {
                    var isStale = !DBAmmo.EqualsExceptName(RatAmmo);
                    if (isStale)
                    {
                        returnList.Add(DBAmmo);
                    }
                }
                else
                {
                    returnList.Add(new Ammo_SQL(RatAmmo));
                }
            }
            return returnList;
        }

        public static void UpdateEverthingFromRatStashOrigin()
        {
            using var db = new Monolit();
            //Console.WriteLine($"Database path: {db.DbPath}.");

            var toBeUpdated = GetListOfStaleAmmoComparedToRatStash();

            //Debug Print
            //foreach (var item in toBeUpdated)
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id} ");
            //}

            db.Ammos.RemoveRange(toBeUpdated);

            foreach(var item in toBeUpdated)
            {
                var ratAmmo = Ammos.Cleaned.FirstOrDefault(x=> x.Id == item.Id);
                CheckGenerateAndSavetoDB(ratAmmo);
                BallisticDetails.CheckGenerateAndSavetoDB(ratAmmo);
            }
        }

        public static void Generate_Save_All_Ammo()
        {
            var AllAmmoRecords = Ammos.Cleaned;

            using var db = new Monolit();
            //Console.WriteLine($"Database path: {db.DbPath}.");

            foreach (var item in AllAmmoRecords)
            {
                var check = db.Ammos.Any(x => x.Id == item.Id);
                if (check == false)
                {
                    CheckGenerateAndSavetoDB(item, db);
                }
            }
            db.SaveChanges();
        }
        public static bool CheckGenerateAndSavetoDB(Ammo ammo, Monolit db) 
        {
            Ammo_SQL entity = new Ammo_SQL(ammo);
            bool success = false;

            if (!db.Ammos.Any(x => x == entity))
            {
                db.Add(entity);
                success = true;
            }

            return success;
        }

        public static bool CheckGenerateAndSavetoDB(Ammo ammo)
        {
            using var db = new Monolit();
            Ammo_SQL entity = new Ammo_SQL(ammo);
            bool success = false;

            if (!db.Ammos.Any(x => x == entity))
            {
                db.Add(entity);
                success = true;
                db.SaveChanges();
            }
            
            return success;
        }

        public static void DEV_CheckUpdateSave_AllAmmoAndChildren()
        {
            var AllAmmoRecords = Ammos.Cleaned;
            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            foreach (var item in AllAmmoRecords)
            {
                var check = db.Ammos.Any(x => x.Id == item.Id);
                if (check)
                {
                    var myEntity = db.Ammos.Single(e => e.Id == item.Id);
                    if (!myEntity.EqualsExceptName(item))
                    {
                        db.Ammos.Remove(myEntity);

                    }
                }
                else
                {
                    db.Add(new Ammo_SQL
                    {
                        Id = item.Id,
                        Name = item.Name,
                        Penetration = item.PenetrationPower,
                        ArmorDamage = item.ArmorDamage,
                        Damage = item.Damage,
                        InitialSpeed = item.InitialSpeed,
                        BulletMass = item.BulletMass,
                        BulletDiameterMillimeters = item.BulletDiameterMillimeters,
                        BallisticCoeficient = item.BallisticCoeficient
                    });
                }
            }
            db.SaveChanges();
        }
    }
    public class AmmoEntityTypeConfiguration : IEntityTypeConfiguration<Ammo_SQL>
    {
        public void Configure(EntityTypeBuilder<Ammo_SQL> builder)
        {
            builder.ToTable("Ammos"); // Set table name

            builder.HasKey(a => a.Id); // Set primary key

            builder.Property(a => a.Name) // Configure Name property
                .IsRequired();

            builder.Property(a => a.Penetration)
                .IsRequired();
            builder.Property(a => a.ArmorDamage)
                .IsRequired();
            builder.Property(a => a.Damage)
                .IsRequired();
            builder.Property(a => a.InitialSpeed)
                .IsRequired();

            builder.Property(a => a.BulletMass)
               .IsRequired();
            builder.Property(a => a.BulletDiameterMillimeters)
                .IsRequired();
            builder.Property(a => a.BallisticCoeficient)
                .IsRequired();
        }
    }
}
