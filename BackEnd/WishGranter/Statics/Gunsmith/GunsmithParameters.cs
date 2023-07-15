using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WishGranter.Statics
{
    public record class GunsmithParameters
    {
        public int Id { get; set; }
        public FittingPriority priority { get; init; }
        public MuzzleType muzzleType { get; init; }
        public int playerLevel { get; init; }
        public bool fleaMarket { get; init; }
        public List<string>? exclusionList { get; init; } = null;

        public GunsmithParameters() { }

        public GunsmithParameters(
        FittingPriority priority,
        MuzzleType muzzleType,
        int playerLevel,
        bool fleaMarket,
        List<string>? exclusionList = null)
        {
            this.priority = priority;
            this.muzzleType = muzzleType;
            this.playerLevel = playerLevel;
            this.fleaMarket = fleaMarket;
            this.exclusionList = exclusionList;
        }

        public static GunsmithParameters GetGunsmithParametersFromDB(GunsmithParameters gunsmithParameters, Monolit db)
        {
            var get = db.GunsmithParameters.Single(x =>
            x.priority == gunsmithParameters.priority &&
            x.muzzleType == gunsmithParameters.muzzleType &&
            x.playerLevel == gunsmithParameters.playerLevel &&
            x.fleaMarket == gunsmithParameters.fleaMarket
            );

            return get;
        }

        public static int Hydrate_DB_GunsmithParameters()
        {
            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            int count = 0;

            foreach (FittingPriority priority in Enum.GetValues(typeof(FittingPriority)))
            {
                foreach (MuzzleType muzzleType in Enum.GetValues(typeof(MuzzleType)))
                { 
                    for (int i = 1; i <= 40; i++)
                    {
                        var check = db.GunsmithParameters.Any(x => x.priority == priority && x.muzzleType == muzzleType && x.playerLevel == i);

                        if (check == false)
                        {
                            //var newDB_Preset = new BasePreset(item.Name, item.Id, item.Weapon, item.PurchaseOffer, item.WeaponMods);
                            db.Add(new GunsmithParameters(priority, muzzleType, i, true));
                            db.Add(new GunsmithParameters(priority, muzzleType, i, false));

                            count += 2;
                        }
                    }
                }
            }

            db.SaveChanges();
            return count;
        }
    };

    public class GunsmithParametersEntityConfiguration : IEntityTypeConfiguration<GunsmithParameters>
    {
        public void Configure(EntityTypeBuilder<GunsmithParameters> builder)
        {
            builder.ToTable("GunsmithParameters");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.priority);
            builder.Property(x => x.muzzleType);
            builder.Property(x => x.playerLevel);
            builder.Property(x => x.fleaMarket);

            builder.Ignore(x => x.exclusionList);
        }
    }

}
