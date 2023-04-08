using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WishGranterProto.ExtensionMethods;

namespace WishGranter
{
    public class SQL_Armor
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
    public class SQL_Ammo
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
    public class SQL_TBS_Result
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("SQL_Armor")]
        public string ArmorId { get; set; }
        public SQL_Armor SQL_Armor { get; set; }
        [Required]
        public int DurabilityPerc { get; set; }

        [Required]
        [ForeignKey("SQL_Ammo")]
        public string AmmoId { get; set; }
        public SQL_Ammo SQL_Ammo { get; set; }
        [Required]
        public int Distance { get; set; }


        [Required]
        public int Killshot { get; set; }
        [Required]
        public virtual ICollection<TransmissionArmorTestShot>? Shots { get; set;}
    }
    public class SQL_TBS_Shot
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [ForeignKey("SQL_TBS_Result")]
        public int ResultId { get; set; }
        public SQL_TBS_Result SQL_TBS_Result { get; set; }

        public int ShotNum { get; set; }
        public double DurabilityPerc { get; set; } = -1;
        public double Durability { get; set; } = -1;
        public double DoneDamage { get; set; } = -1;
        public double PenetrationChance { get; set; } = -1;

        public double BluntDamage { get; set; } = -1;
        public double PenetratingDamage { get; set; } = -1;
        public double AverageDamage { get; set; } = -1;
        public double RemainingHitPoints { get; set; } = -1;

        public double ProbabilityOfKillCumulative { get; set; } = -1;
        public double ProbabilityOfKillSpecific { get; set; } = -1;
    }

    public class MonolitDB : DbContext
    {
        public DbSet<SQL_Armor> Armors { get; set; }
        public DbSet<SQL_Ammo> Ammos { get; set; }
        public DbSet<SQL_TBS_Result> Results { get; set; }
        public DbSet<SQL_TBS_Shot> Shots { get; set; }

        public string DbPath { get; }

        public MonolitDB()
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            DbPath = System.IO.Path.Join(path, "monolit.db");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
    }
}
