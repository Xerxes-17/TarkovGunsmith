using Microsoft.EntityFrameworkCore;
using RatStash;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WishGranter.Statics
{
    // These two record classes are just so the DB can keep consistentcy with their IDs. It's easy enough to just use annotations with them.
    //? Actually, we're going to use this one to store all of the armorItem details in an SQL table as it's going to exist anyway
    //todo spin this off into its own .cs file with IEntityTypeConfiguration
    public record class ArmorItemStats
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int ArmorClass { get; set; }
        [Required]
        public float BluntThroughput { get; set; }
        [Required]
        public int MaxDurability { get; set; }
        [Required]
        public ArmorMaterial ArmorMaterial { get; set; }
        [Required]
        public TargetZone TargetZone { get; set; }
    }
    public record class Ammo_SQL
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public class Monolit : DbContext
    {
        public DbSet<BallisticHit> BallisticHits { get; set; }
        public DbSet<BallisticTest> BallisticTests { get; set; }
        public DbSet<BallisticDetails> BallisticDetails { get; set; }
        public DbSet<ArmorItemStats> Armors { get; set; }
        public DbSet<Ammo_SQL> Ammos { get; set; }

        public string DbPath { get; }
        public Monolit()
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = System.IO.Path.Join(path, "monolit2.db");
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new BallisticHitEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticTestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new BallisticDetailsEntityTypeConfiguration());
        }
    }
}
