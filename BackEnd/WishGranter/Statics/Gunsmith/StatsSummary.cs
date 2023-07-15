using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;

namespace WishGranter.Statics
{
    public class StatsSummary
    {
        public int? Id { get; set; }
        public string WeaponId { get; set; } // Needed because some weapons have many presets and we want to cross-compare
        public string PresetId { get; set; }
        public float Ergonomics { get; set; } // Because some bitch-ass mods have non-integer values
        public float Recoil_Vertical { get; set; }
        public float Weight { get; set; } // CZTL tells me this is very important for the ADS speed and time

        public StatsSummary() {}

        public StatsSummary(BasePreset basePreset, List<WeaponMod> weaponMods) 
        {
            WeaponId = basePreset.Weapon.Id;
            PresetId = basePreset.Id;
            SummarizeFromObjects(basePreset.Weapon, weaponMods);
        }
        public StatsSummary(Weapon weapon, string presetId,  List<WeaponMod> weaponMods)
        {
            WeaponId = weapon.Id;
            PresetId = presetId;
            SummarizeFromObjects(weapon, weaponMods);
        }

        public void SummarizeFromObjects(Weapon weapon, List<WeaponMod> weaponMods, Ammo? ammo = null)
        {
            var ergoBonus = 0f;
            var recoilBonus = 0f;
            var weightSum = 0f;
            foreach(var weaponMod in weaponMods)
            {
                ergoBonus += weaponMod.Ergonomics;
                recoilBonus += weaponMod.Recoil;
                weightSum += weaponMod.Weight;
            }

            Ergonomics = weapon.Ergonomics + ergoBonus;

            Recoil_Vertical = weapon.RecoilForceUp + (weapon.RecoilForceUp * (recoilBonus / 100));
            if (ammo != null)
                Recoil_Vertical += ammo.AmmoRec;

            Weight = weapon.Weight + weightSum;
        }
    }

    public class StatsSummaryConfiguration : IEntityTypeConfiguration<StatsSummary>
{
    public void Configure(EntityTypeBuilder<StatsSummary> builder)
    {
        builder.ToTable("StatsSummaries");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id")
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

            builder.HasOne<BasePreset>()
                .WithOne()
                .HasForeignKey<StatsSummary>(x => x.PresetId)
                .IsRequired();

            builder.HasOne<Weapon_SQL>()
            .WithMany()
            .HasForeignKey(b => b.WeaponId)
            .IsRequired();
    }
}
}
