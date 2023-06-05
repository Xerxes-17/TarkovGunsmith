using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WishGranter.Statics
{
    public class FittingSummary
    {
        // We might wish to consider the cost totals in other currencies too.... could do that with a dictionary of RUB, EUR and USD + ints.
        //? Might also be where we keep the recoil score, if it comes to that
        //? Same for the ADS speed and time stuff. unless that goes into the stats summary
        public int? Id { get; set; }
        public int? FittingBundleId { get; set; }
        public int? StatsSummaryId { get; set; }
        public StatsSummary StatsSummary { get; set; } = new(); // Can put the attachments stat summary here 
        public int TotalRubleCost { get; set; } // Can put the total cost of the fitting here
        public int PurchasedModsCost { get; set; }
        public int PresetModsRefund { get; set; } // Can also save this here
        public bool Valid { get; set; }
        public string ValidString { get; set; }

        public FittingSummary() { }
        public FittingSummary(BasePreset basePreset, PurchasedMods purchasedMods) 
        {
            UpdateSummary(basePreset, purchasedMods);

            // Add a validity check here
        }

        public void UpdateSummary(BasePreset basePreset, PurchasedMods purchasedMods, PurchasedAmmo? purchasedAmmo = null)
        {
            // Summarize the new stats 
            StatsSummary = new StatsSummary(basePreset, purchasedMods.GetWeaponMods());

            // Get the refund total of sold preset mods, get the except of the preseet mods in the fitterd mods.
            var modIdsToBePawned = basePreset.WeaponMods.Except(purchasedMods.GetWeaponMods()).Select(x => x.Id).ToList();
            PresetModsRefund = Market.GetTraderBuyBackTotalFromIdList(modIdsToBePawned);

            // Storing this here for later display in FE, and using right now with the next step
            PurchasedModsCost = purchasedMods.GetSummOfRUBprices();

            // Now we can get the new total.
            TotalRubleCost = basePreset.PurchaseOffer.PriceRUB + PurchasedModsCost - PresetModsRefund;

        }
    }
    public class FittingSummaryConfiguration : IEntityTypeConfiguration<FittingSummary>
    {
        public void Configure(EntityTypeBuilder<FittingSummary> builder)
        {
            builder.ToTable("FittingSummaries");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(x => x.TotalRubleCost)
                .IsRequired();

            builder.Property(x => x.PurchasedModsCost)
                .IsRequired();

            builder.Property(x => x.PresetModsRefund)
                .IsRequired();

            builder.Property(x => x.Valid)
                .IsRequired();

            builder.Property(x => x.ValidString)
                .HasMaxLength(50)
                .IsRequired();

            builder.HasOne(x => x.StatsSummary)
                .WithOne()
                .HasForeignKey<FittingSummary>(x => x.StatsSummaryId) // Set foreign key to StatsSummaryId
                .IsRequired();

            builder.HasOne<FittingBundle>()
                .WithOne();
        }
    }
}
