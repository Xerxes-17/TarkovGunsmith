using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using RatStash;
using System.ComponentModel.DataAnnotations.Schema;
using WishGranterProto.ExtensionMethods;

namespace WishGranter.Statics
{
    
    // Add-Migration <NAME> -Context Monolit
    // Update-Database -Context Monolit
    public class Monolit : DbContext
    {
        const string DB_NAME = "monolit.db";

        public DbSet<BallisticHit> BallisticHits { get; set; }
        public DbSet<BallisticTest> BallisticTests { get; set; }
        public DbSet<BallisticDetails> BallisticDetails { get; set; }
        public DbSet<BallisticRating> BallisticRatings { get; set; }
        public DbSet<ArmorItemStats> ArmorItems { get; set; }
        public DbSet<Ammo_SQL> Ammos { get; set; }

        public DbSet<Weapon_SQL> Weapons { get; set; }
        public DbSet<BasePreset> BasePresets { get; set; }
        public DbSet<GunsmithParameters> GunsmithParameters { get; set; }
        public DbSet<Fitting> Fittings { get; set; }
        public DbSet<PurchasedMods> PurchasedMods { get; set; }

        public string DbPath { get; }
        public Monolit()
        {
            //! For Dev
            //var folder = Environment.SpecialFolder.LocalApplicationData;
            //var path = Environment.GetFolderPath(folder);
            //DbPath = System.IO.Path.Join(path, DB_NAME);

            //!For Prod
            var baseFolder = AppDomain.CurrentDomain.BaseDirectory;
            DbPath = Path.Combine(baseFolder, DB_NAME);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //var baseFolder = AppDomain.CurrentDomain.BaseDirectory;
            //var dbPath = Path.Combine(baseFolder, DB_NAME);

            optionsBuilder.UseSqlite($"Data Source={DbPath}");
            //optionsBuilder.EnableSensitiveDataLogging(true); // optional for debugging purposes

            //optionsBuilder.LogTo(s => System.Diagnostics.Debug.WriteLine(s));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AmmoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticHitEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticTestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticDetailsEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticRatingEntityTypeConfiguration());

            modelBuilder.ApplyConfiguration(new WeaponEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BasePresetEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new GunsmithParametersEntityConfiguration());
            modelBuilder.ApplyConfiguration(new FittingEntityConfiguration());
            modelBuilder.ApplyConfiguration(new PurchasedModsConfiguration());
        }

        public static string CreateMonolitFromScratch()
        {
            string result = "CMFS Started";
            // Make Ammos
            Ammo_SQL.Generate_Save_All_Ammo();
            // Make BallisticDetails
            Statics.BallisticDetails.Generate_Save_All_BallisticDetails();

            // Make ArmorItems
            ArmorItemStats.Generate_Save_All_ArmorItems();

            // Make BallisticTests - > BallisticHits
            BallisticTest.Generate_Save_All_BallisticTests();

            // Make BallisticRatings
            BallisticRating.Generate_Save_All_BallisticRatings();

            CreateGunsmithDBStuff();

            result = "CMFS Success";

            return result;
        }

        public static void CreateGunsmithDBStuff()
        {
            // Make Weapons
            Weapon_SQL.Hydrate_DB_WithWeapons();

            // Make BasePresets
            BasePreset.Hydrate_DB_BasePreset();

            // Make Gunsmith Parameters
            Statics.GunsmithParameters.Hydrate_DB_GunsmithParameters();

            // Make Fittings -> PurchasedMods
            //Fitting.Hydrate_DB_WithAllFittings();
        }
    }
}
