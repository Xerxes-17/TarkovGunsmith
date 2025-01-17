using Force.DeepCloner;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;
using System.Diagnostics;
using System.Text.Json.Serialization;
using WishGranterProto;


namespace WishGranter.Statics
{

    public class PurchasedMod
    {
        // Let's combine the mod and the purchase order we get it from together!
        public WeaponMod WeaponMod { get; set; } = new();
        public PurchaseOffer? PurchaseOffer { get; set; }
        public PurchasedMod() { }
        public PurchasedMod(WeaponMod weaponMod, PurchaseOffer purchaseOffer)
        {
            WeaponMod = weaponMod;
            PurchaseOffer = purchaseOffer;
        }
        public PurchasedMod Clone()
        {
            return new PurchasedMod
            {
                WeaponMod = this.WeaponMod.DeepClone(),
                PurchaseOffer = this.PurchaseOffer?.DeepClone()
            };
        }
    }

    public class PurchasedModComparer : IEqualityComparer<PurchasedMod>
    {
        public bool Equals(PurchasedMod x, PurchasedMod y)
        {
            if (ReferenceEquals(x, y))
                return true;
            if (x is null || y is null)
                return false;

            return x.WeaponMod.Equals(y.WeaponMod) && (x.PurchaseOffer?.Equals(y.PurchaseOffer) ?? y.PurchaseOffer is null);
        }

        public int GetHashCode(PurchasedMod obj)
        {
            unchecked
            {
                int hash = 17;
                hash = hash * 23 + obj.WeaponMod.GetHashCode();
                hash = hash * 23 + (obj.PurchaseOffer?.GetHashCode() ?? 0);
                return hash;
            }
        }
    }
    public class PurchasedModListComparer : ValueComparer<List<PurchasedMod>>
    {
        public PurchasedModListComparer() : base(
            (c1, c2) => c1.SequenceEqual(c2),
            c => c.Aggregate(0, (acc, x) => acc + x.GetHashCode()),
            c => c.Select(x => x.Clone()).ToList()
        )
        { }
    }

    public class PurchasedModsComparer : ValueComparer<PurchasedMods>
    {
        public PurchasedModsComparer() : base(
            (c1, c2) => c1.HashId.SequenceEqual(c2.HashId) && c1.List.SequenceEqual(c2.List, new PurchasedModComparer()),
            c => c.HashId.GetHashCode() + c.List.Sum(x => x.GetHashCode()),
            c => new PurchasedMods { HashId = c.HashId, List = c.List.Select(x => x.Clone()).ToList() }
        )
        { }
    }

    public class PurchasedAmmo
    {
        // Hey, combining the Ammo selection with it's purchase info would be pretty cool too!
        public Ammo Ammo { get; set; } = new();
        public PurchaseOffer PurchaseOffer { get; set; } = new();

        public PurchasedAmmo() { }
        public PurchasedAmmo(Ammo ammo, PurchaseOffer purchaseOffer)
        {
            Ammo = ammo;
            PurchaseOffer = purchaseOffer;
        }

        public static PurchasedAmmo GetBestPurchasedAmmo(BasePreset basePreset, GunsmithParameters gunsmithParameters)
        {
            var caliber = basePreset.Weapon.AmmoCaliber;
            if (caliber.Equals("Caliber9x18PMM"))
            {
                caliber = "Caliber9x18PM";
            }
            PurchasedAmmo purchasedAmmo;
            var shortlist = Ammos.GetAmmoOfCalibre(caliber);
            if (shortlist.Count > 0)
            {
                var ammoIds = shortlist.Select(x => x.Id).ToList();
                //Get a list of the ammo type Ids which are avail on the market
                var marketEntries = Market.GetPurchaseOfferTraderOrFleaList(ammoIds, gunsmithParameters.playerLevel, gunsmithParameters.fleaMarket).Where(x => x != null);
                var marketEntryIds = marketEntries.Select(x => x.Id).ToList();

                // Filter the ammo choices by that and choose the one with the best pen
                shortlist = shortlist.Where(x => marketEntryIds.Contains(x.Id)).ToList();

                shortlist = shortlist.OrderByDescending(x => x.PenetrationPower).ToList();

                if (shortlist.Count > 0)
                {
                    var bestPen = shortlist[0];
                    var bestPen_market = marketEntries.FirstOrDefault(x => x.Id == bestPen.Id);

                    purchasedAmmo = new PurchasedAmmo(bestPen, bestPen_market.PurchaseOffer);
                }
                else
                {
                    purchasedAmmo = null;
                }

            }
            else
            {
                purchasedAmmo = null;
            }


            return purchasedAmmo;
        }
    }

    public class Fitting
    {
        public int Id { get; set; } = 0;
        [JsonIgnore]
        public string WeaponId { get; set; } = string.Empty;

        [JsonIgnore]
        public string BasePresetId { get; set; } = string.Empty;
        public BasePreset? BasePreset { get; set; } = new();

        [JsonIgnore]
        public int GunsmithParametersId { get; set; }
        public GunsmithParameters? GunsmithParameters { get; set; } = new();

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
        public string PurchasedModsHashId { get; set; } = "";
        public PurchasedMods? PurchasedMods { get; set; } = new();
        // This list needs to make a hash value which is used as the key to store it as in the DB. This way any builds with overlapping mods can just use the same object instead of their own copy of it

        public PurchasedAmmo? PurchasedAmmo { get; set; } = new();

        public Fitting() { }
        public Fitting(BasePreset basePreset, GunsmithParameters gunsmithParameters)
        {
            WeaponId = basePreset.WeaponId;
            BasePresetId = basePreset.Id;
            BasePreset = basePreset;
            GunsmithParameters = gunsmithParameters;
            GunsmithParametersId = GunsmithParameters.Id;


            var gunsmithOutput = Gunsmith.GetPurchasedMods(BasePreset, GunsmithParameters);

            //! Hacky remvoe of monolit-db, the db was a parameter
            //var purchasedMods = db.PurchasedMods.SingleOrDefault(x => x.HashId.Equals(gunsmithOutput.HashId));

            //if (purchasedMods != null)
            //{
            //    PurchasedMods = purchasedMods;
            //}
            //else
            //{
            //    PurchasedMods = gunsmithOutput;
            //}

            //PurchasedModsHashId = PurchasedMods.HashId;
            
            UpdateSummaryFields(basePreset, gunsmithOutput);

            PurchasedAmmo = PurchasedAmmo.GetBestPurchasedAmmo(basePreset, GunsmithParameters);
        }
        //! this is the old constructor that used the monolit-db
        public Fitting(BasePreset basePreset, GunsmithParameters gunsmithParameters, Monolit db)
        {
            WeaponId = basePreset.WeaponId;
            BasePresetId = basePreset.Id;
            BasePreset = basePreset;
            GunsmithParameters = gunsmithParameters;
            GunsmithParametersId = GunsmithParameters.Id;


            var gunsmithOutput = Gunsmith.GetPurchasedMods(BasePreset, GunsmithParameters);

            //! Hacky remvoe of monolit-db, the db was a parameter
            var purchasedMods = db.PurchasedMods.SingleOrDefault(x => x.HashId.Equals(gunsmithOutput.HashId));

            if (purchasedMods != null)
            {
                PurchasedMods = purchasedMods;
            }
            else
            {
                PurchasedMods = gunsmithOutput;
            }

            UpdateSummaryFields(basePreset, gunsmithOutput);

            PurchasedAmmo = PurchasedAmmo.GetBestPurchasedAmmo(basePreset, GunsmithParameters);
        }

        public static int Hydrate_DB_WithAllFittings()
        {
            OfferType[] offerType = { OfferType.Cash, OfferType.Barter };
            int count = 0;

            foreach (FittingPriority fittingPriority in Enum.GetValues(typeof(FittingPriority)))
            {
                foreach (MuzzleType muzzleType in Enum.GetValues(typeof(MuzzleType)))
                {
                    foreach(var offer in offerType)
                    {
                        count += Hydrate_DB_WithParamFittings(fittingPriority, muzzleType, offer);
                    }
                }
            }
            return count;
        }

        public static int Test_SpeedOfFittingProcess()
        {
            OfferType[] offerType = { OfferType.Cash, OfferType.Barter };
            int count = 0;
            var watch = new Stopwatch();
            watch.Start();
            count += Hydrate_DB_WithParamFittings(FittingPriority.MetaRecoil, MuzzleType.Any, OfferType.Cash);
            watch.Stop();

            Console.WriteLine($"Time taken: {watch.ElapsedMilliseconds / 1000}");

            return count;
        }


        public static async Task<int> Hydrate_DB_WithParamFittingsAsync(FittingPriority fittingPriority, MuzzleType muzzleType, OfferType offerType)
        {
            int count = 0;

            using var db = new Monolit();
            List<Fitting> newFittings = new List<Fitting>();

            await Task.Run(() =>
            {
                foreach (var preset in ModsWeaponsPresets.BasePresets.Where(x => x.PurchaseOffer.OfferType == offerType).ToList())
                {
                    for (int i = preset.PurchaseOffer.ReqPlayerLevel; i <= 40; i++)
                    {
                        var DBparam = db.GunsmithParameters.SingleOrDefault(
                            x => x.priority == fittingPriority &&
                            x.muzzleType == muzzleType &&
                            x.playerLevel == i &&
                            x.fleaMarket == false
                        );

                        Fitting newFit = new Fitting(preset, DBparam, db);

                        lock (newFittings)
                        {
                            newFittings.Add(newFit);
                            count++;
                        }
                    }
                }
            });

            Stripper_Unique(newFittings);
            return count;
        }

        public static int Hydrate_DB_WithParamFittings(FittingPriority fittingPriority, MuzzleType muzzleType, OfferType offerType)
        {
            int count = 0;

            using var db = new Monolit();
            List<Fitting> newFittings = new List<Fitting>();

            foreach (var preset in ModsWeaponsPresets.BasePresets.Where(x => x.PurchaseOffer.OfferType == offerType).ToList())
            {
                //Fitting previousFitting = null;

                for (int i = preset.PurchaseOffer.ReqPlayerLevel; i <= 40; i++)
                {
                    //var param = new GunsmithParameters(fittingPriority, muzzleType, i, false);
                    //todo NEED TO MAKE THIS MUCH MORE EFFICENT; ADD A CHECK THAT THE NEW INPUT LIST IS DIFFERENT FROM THE PREV LEVEL, OTHERWISE JUST COPY PREV LEVEL DETAILS AND SKIP
                    var DBparam = db.GunsmithParameters.SingleOrDefault(
                        x=> x.priority == fittingPriority && 
                        x.muzzleType == muzzleType &&
                        x.playerLevel == i &&
                        x.fleaMarket == false
                        );

                    Fitting newFit = new(preset, DBparam, db);

                    //previousFitting = newFit; //Save the current fitting so the next iteration can check against it

                    newFittings.Add(newFit);
                    count++;
                }
            }
            Stripper_Unique(newFittings);
            return count;
        }

        public static void Stripper_Unique(List<Fitting> newFittings)
        {
            using var db = new Monolit();

            HashSet<GunsmithParameters> parameters = new HashSet<GunsmithParameters>();
            HashSet<PurchasedMods> purchasedMods = new HashSet<PurchasedMods>();
            HashSet<BasePreset> presets = new HashSet<BasePreset>();

            foreach(var newFit in newFittings)
            {
                parameters.Add(newFit.GunsmithParameters);
                newFit.GunsmithParameters = null;
                purchasedMods.Add(newFit.PurchasedMods);
                newFit.PurchasedMods = null;
                presets.Add(newFit.BasePreset);
                newFit.BasePreset = null;
            }

            var existingPurchasedMods = db.PurchasedMods.Select(x=>x.HashId).ToList();
            purchasedMods.RemoveWhere(pm => existingPurchasedMods.Contains(pm.HashId));

            var existingParameters = db.GunsmithParameters.Select(x => x.Id).ToList();
            parameters.RemoveWhere(gp => existingParameters.Contains(gp.Id));

            var existingPresets = db.BasePresets.Select(x => x.Id).ToList();
            presets.RemoveWhere(bp => existingPresets.Contains(bp.Id));

            db.AddRange(presets);
            db.AddRange(parameters);
            db.AddRange(purchasedMods);
            db.AddRange(newFittings);
            db.SaveChanges();
        }

        public static int Hydrate_DB_WithBasicFittings()
        {
            int count = 0;

            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");
            List<Fitting> newFittings = new List<Fitting>();

            foreach (var preset in ModsWeaponsPresets.BasePresets.Where(x => x.PurchaseOffer.OfferType == OfferType.Cash).ToList())
            {
                for (int i = preset.PurchaseOffer.ReqPlayerLevel; i <= 40; i++)
                {
                    var param = new GunsmithParameters(FittingPriority.Ergonomics, MuzzleType.Any, i, false, new List<string>());

                    Fitting newFit = new(preset, param, db);
                    newFittings.Add(newFit);

                    count++;
                }
            }
            Stripper_Unique(newFittings);

            return count;
        }

        public void UpdateSummaryFields(BasePreset basePreset, PurchasedMods purchasedMods)
        {
            UpdateGameplayInfoFields(basePreset.Weapon, purchasedMods.GetWeaponMods());
            PurchasedMods = purchasedMods;
            BasePreset = basePreset;

            // Get the refund total of sold preset mods, get the except of the preseet mods in the fitterd mods.
            var modIdsToBePawned = basePreset.WeaponMods.Except(purchasedMods.GetWeaponMods()).Select(x => x.Id).ToList();

            var presetModsKept = basePreset.WeaponMods.Intersect(purchasedMods.GetWeaponMods()).ToList();

            // Get the mods that actually got purchased
            var tempPMods = new PurchasedMods(purchasedMods.List
                .Where(x => !presetModsKept.Contains(x.WeaponMod)).ToList());

            PresetModsRefund = Market.GetTraderBuyBackTotalFromIdList(modIdsToBePawned);

            // Storing this here for later display in FE, and using right now with the next step
            PurchasedModsCost = tempPMods.GetSummOfRUBprices();

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

            builder.HasKey(f => f.Id) // Set primary key
                .HasAnnotation("Sqlite:Autoincrement", true);

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



            builder.Ignore(p => p.PurchasedMods);
            builder.Ignore(p => p.PurchasedAmmo);
        }
    }
}
