using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations.Schema;

namespace WishGranter.Statics
{
    public class FittingBundle
    {
        //? I also need to consider the Mags list, but that would be simple enough to code as a independent function, or to store it as a list here. Considering the commonality of them, perhps that list should be parceled out to reduce repetition
        public int Id { get; set; }
        public string BasePresetId { get; set; }
        public BasePreset BasePreset { get; set; } = new();
        public GunsmithParameters GunsmithParameters { get; set; } = new();
        public PurchasedMods PurchasedMods { get; set; } = new();
        public PurchasedAmmo PurchasedAmmo { get; set; } = new(); 
        public FittingSummary FittingSummary { get; set; } = new();

        public FittingBundle() { }
        public FittingBundle(BasePreset basePreset, GunsmithParameters gunsmithParameters)
        {
            BasePresetId = basePreset.Id;
            BasePreset = basePreset;
            GunsmithParameters = gunsmithParameters;
            PurchasedMods = Gunsmith.GetPurchasedMods(BasePreset, GunsmithParameters);
            PurchasedAmmo = PurchasedAmmo.GetBestPurchasedAmmo(basePreset, gunsmithParameters);
            UpdateFittingSummary();
        }
        public void UpdateFittingSummary()
        {
            FittingSummary.UpdateSummary(BasePreset, PurchasedMods, PurchasedAmmo);
        }
    }
    public class FittingBundleConfiguration : IEntityTypeConfiguration<FittingBundle>
    {
        public void Configure(EntityTypeBuilder<FittingBundle> builder)
        {
            builder.ToTable("FittingBundles");

            builder.HasKey(fb => fb.Id); // Set primary key

            builder.Property(fb => fb.BasePresetId)
                .IsRequired();

            builder.Ignore(p => p.GunsmithParameters);
            builder.Ignore(p => p.PurchasedMods);
            builder.Ignore(p => p.PurchasedAmmo);

            builder.HasOne(x => x.FittingSummary)
                .WithOne()
                .HasForeignKey<FittingSummary>(x=> x.Id);

            builder.HasOne(x => x.BasePreset)
                .WithOne();
        }
    }
}
