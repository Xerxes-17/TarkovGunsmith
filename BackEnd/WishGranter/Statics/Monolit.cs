using Microsoft.EntityFrameworkCore;
using RatStash;
using System.ComponentModel.DataAnnotations.Schema;
using WishGranterProto.ExtensionMethods;

namespace WishGranter.Statics
{
    public class Monolit : DbContext
    {
        public DbSet<BallisticHit> BallisticHits { get; set; }
        public DbSet<BallisticTest> BallisticTests { get; set; }
        public DbSet<BallisticDetails> BallisticDetails { get; set; }
        public DbSet<BallisticRating> BallisticRatings { get; set; }
        public DbSet<ArmorItemStats> ArmorItems { get; set; }
        public DbSet<Ammo_SQL> Ammos { get; set; }

        public string DbPath { get; }
        public Monolit()
        {
            var baseFolder = AppDomain.CurrentDomain.BaseDirectory;
            DbPath = Path.Combine(baseFolder, "monolit.db");
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AmmoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticHitEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticTestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticDetailsEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticRatingEntityTypeConfiguration());

        }
    }
}
