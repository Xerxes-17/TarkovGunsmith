using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;
using System.Text.Json.Serialization;
using WishGranterProto;

namespace WishGranter.Statics
{
    public class Fitting
    {
        public int Id { get; set; }
        [JsonIgnore]
        public string WeaponId { get; set; } = string.Empty;

        [JsonIgnore]
        public string BasePresetId { get; set; } = string.Empty;
        public BasePreset BasePreset { get; set; } = new();

        [JsonIgnore]
        public int GunsmithParametersId { get; set; }
        public GunsmithParameters GunsmithParameters { get; set; } = new();

        // Gameplay Info
        public float Ergonomics { get; set; } // Because some bitch-ass mods have non-integer values
        public float Recoil_Vertical { get; set; }
        public float Weight { get; set; } // CZTL tells me this is very important for the ADS speed and time

        // Econ Info
        public int TotalRubleCost { get; set; } // Can put the total cost of the fitting here
        public int PurchasedModsCost { get; set; }
        public int PresetModsRefund { get; set; } // Can also save this here

        // Verification Info
        public bool IsValid { get; set; }
        public string ValidityString { get; set; } = string.Empty;

        [JsonIgnore]
        public byte[] PurchasedModsHashId { get; set; } = new byte[32];
        public PurchasedMods PurchasedMods { get; set; } = new();
        // This list needs to make a hash value which is used as the key to store it as in the DB. This way any builds with overlapping 

        public PurchasedAmmo? PurchasedAmmo { get; set; } = new();

        public Fitting() { }
        public Fitting(BasePreset basePreset, GunsmithParameters gunsmithParameters, Monolit db)
        {
            WeaponId = basePreset.WeaponId;
            BasePresetId = basePreset.Id;
            BasePreset = basePreset;
            GunsmithParameters = GunsmithParameters.GetGunsmithParametersFromDB(gunsmithParameters, db);
            GunsmithParametersId = GunsmithParameters.Id;

            var gunsmithOutput = Gunsmith.GetPurchasedMods(BasePreset, GunsmithParameters);

            var purchasedMods = db.PurchasedMods.SingleOrDefault(x => x.HashId.SequenceEqual(gunsmithOutput.HashId));

            if(purchasedMods != null)
            {
                PurchasedMods = purchasedMods;
            }
            else
            {
                PurchasedMods = gunsmithOutput;
            }

            PurchasedModsHashId = PurchasedMods.HashId;

            UpdateSummaryFields(basePreset, PurchasedMods);

            PurchasedAmmo = PurchasedAmmo.GetBestPurchasedAmmo(basePreset, GunsmithParameters);
        }

        public static int Hydrate_DB_WithBasicFittings()
        {
            int count = 0;

            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");
            List<Fitting> newFittings = new List<Fitting>();

            foreach (var preset in ModsWeaponsPresets.BasePresets.Where(x => x.PurchaseOffer.OfferType == OfferType.Flea).ToList())
            {
                for (int i = preset.PurchaseOffer.ReqPlayerLevel; i <= 40; i++)
                {
                    var param = new GunsmithParameters(FittingPriority.MetaRecoil, MuzzleType.Any, i, false);

                    Fitting newFit = new(preset, param, db);
                    newFittings.Add(newFit);

                    count++;
                }
            }

            db.SaveChanges();

            return count;
        }

        public void UpdateSummaryFields(BasePreset basePreset, PurchasedMods purchasedMods)
        {
            UpdateGameplayInfoFields(basePreset.Weapon, purchasedMods.GetWeaponMods());
            PurchasedMods = purchasedMods;
            BasePreset = basePreset;

            // Get the refund total of sold preset mods, get the except of the preseet mods in the fitterd mods.
            var modIdsToBePawned = basePreset.WeaponMods.Except(purchasedMods.GetWeaponMods()).Select(x => x.Id).ToList();
            PresetModsRefund = Market.GetTraderBuyBackTotalFromIdList(modIdsToBePawned);

            // Storing this here for later display in FE, and using right now with the next step
            PurchasedModsCost = purchasedMods.GetSummOfRUBprices();

            // Now we can get the new total.
            TotalRubleCost = basePreset.PurchaseOffer.PriceRUB + PurchasedModsCost - PresetModsRefund;
        }

        public void UpdateGameplayInfoFields(Weapon weapon, List<WeaponMod> weaponMods)
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
    public class FittingEntityConfiguration : IEntityTypeConfiguration<Fitting>
    {
        public void Configure(EntityTypeBuilder<Fitting> builder)
        {
            builder.ToTable("Fittings");

            builder.HasKey(fb => fb.Id); // Set primary key

            builder.HasOne<Weapon_SQL>()
                .WithMany()
                .HasForeignKey(b => b.WeaponId)
                .OnDelete(DeleteBehavior.Cascade);

            // Define the relationship between Fitting and BasePreset
            builder.HasOne(x => x.BasePreset)
                .WithMany()
                .HasForeignKey(b => b.BasePresetId)
                .OnDelete(DeleteBehavior.Cascade);

            // Define the relationship between Fitting and GunsmithParameters
            builder.HasOne(x => x.GunsmithParameters)
                .WithMany()
                .HasForeignKey(b => b.GunsmithParametersId)
                .OnDelete(DeleteBehavior.Cascade);



            builder.Property(x => x.Ergonomics)
                .HasColumnName("Ergonomics")
                .IsRequired();

            builder.Property(x => x.Recoil_Vertical)
                .HasColumnName("Recoil_Vertical")
                .IsRequired();

            builder.Property(x => x.Weight)
                .HasColumnName("Weight")
                .IsRequired();



            builder.Property(x => x.TotalRubleCost)
                .IsRequired();

            builder.Property(x => x.PurchasedModsCost)
                .IsRequired();

            builder.Property(x => x.PresetModsRefund)
                .IsRequired();



            builder.Property(x => x.IsValid)
                .IsRequired();

            builder.Property(x => x.ValidityString)
                .IsRequired();


            builder.HasOne<PurchasedMods>()
                    .WithMany()
                    .HasForeignKey(b => b.PurchasedModsHashId)
                    .OnDelete(DeleteBehavior.Cascade);

            // Define the relationship between Fitting and PurchasedMods
            //builder.HasOne(x => x.PurchasedMods)              
            //    .WithMany()
            //    .HasForeignKey(x => x.PurchasedModsHashId)
            //    .OnDelete(DeleteBehavior.Cascade);
            //builder.Ignore(p => p.PurchasedModsHashId);
            builder.Ignore(p => p.PurchasedMods);


            builder.Ignore(p => p.PurchasedAmmo);
        }
    }
}
