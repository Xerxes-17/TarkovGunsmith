using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;
using System.ComponentModel.DataAnnotations.Schema;
using WishGranterProto;

namespace WishGranter.Statics
{
    public class BasePreset
    {
        //? Look into ensuring that the Weapon here has the mods attached, becuase it's needed in the FitWeapon() method in Gunsmith
        public string Name { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public string WeaponId { get; set; } = string.Empty;

        public float Ergonomics { get; set; } // Because some bitch-ass mods have non-integer values
        public float Recoil_Vertical { get; set; }
        public float Weight { get; set; } // CZTL tells me this is very important for the ADS speed and time

        [NotMapped]
        public Weapon Weapon { get; set; } = new();
        [NotMapped]
        public PurchaseOffer PurchaseOffer { get; set; } = new();
        [NotMapped]
        public List<WeaponMod> WeaponMods { get; set; } = new(); // This shouldn't change after construction
        // We don't need to remember the market details of the Mods, because the mods are only ever going to get sold to a trader, which can be looked up when needed.
        public BasePreset() { }
        public BasePreset(string name, string id, Weapon weapon, PurchaseOffer purchaseOffer, List<WeaponMod> weaponMods) 
        {
            Name = name;
            Id = id+"-"+purchaseOffer.GetHashCode();
            WeaponId = weapon.Id;
            Weapon = weapon;
            PurchaseOffer = purchaseOffer;
            WeaponMods = weaponMods;
            SummarizeFromObjects(weapon, weaponMods);
        }

        public static int Hydrate_DB_BasePreset()
        {
            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            var temp = ModsWeaponsPresets.BasePresets;
            int count = 0;

            foreach (var item in temp)
            {
                var check = db.BasePresets.Any(x => x.Id == item.Id);
                if (check == false)
                {
                    //var newDB_Preset = new BasePreset(item.Name, item.Id, item.Weapon, item.PurchaseOffer, item.WeaponMods);
                    db.Add(item);
                    count++;
                }
            }

            db.SaveChanges();
            return count;
        }

        public void SummarizeFromObjects(Weapon weapon, List<WeaponMod> weaponMods)
        {
            var ergoBonus = 0f;
            var recoilBonus = 0f;
            var weightSum = 0f;
            foreach (var weaponMod in weaponMods)
            {
                ergoBonus += weaponMod.Ergonomics;
                recoilBonus += weaponMod.Recoil;
                weightSum += weaponMod.Weight;
            }

            Ergonomics = weapon.Ergonomics + ergoBonus;

            Recoil_Vertical = weapon.RecoilForceUp + (weapon.RecoilForceUp * (recoilBonus / 100));

            Weight = weapon.Weight + weightSum;
        }


    }
    public class BasePresetEntityTypeConfiguration : IEntityTypeConfiguration<BasePreset>
    {
        public void Configure(EntityTypeBuilder<BasePreset> builder)
        {
            builder.ToTable("BasePresets"); // Set table name

            builder.HasKey(p => p.Id); // Set primary key

            // Configure Name property
            builder.Property(p => p.Name)
                .IsRequired();

            builder.Property(x => x.Ergonomics)
                .HasColumnName("Ergonomics")
                .IsRequired();

            builder.Property(x => x.Recoil_Vertical)
                .HasColumnName("Recoil_Vertical")
                .IsRequired();

            builder.Property(x => x.Weight)
                .HasColumnName("Weight")
                .IsRequired();

            // Configure Weapon foreign key
            builder.HasOne<Weapon_SQL>()
                .WithMany()
                .HasForeignKey(b => b.WeaponId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ignore PurchaseOffer and WeaponMods for now
            builder.Ignore(p => p.PurchaseOffer);
            builder.Ignore(p => p.WeaponMods);
            builder.Ignore(p => p.Weapon);
        }
    }
}
