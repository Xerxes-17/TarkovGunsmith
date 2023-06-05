using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RatStash;
using System.Security.Cryptography;
using System.Text.Json;

namespace WishGranter.Statics
{
    public class PurchasedMods
    {
        public byte[] HashId { get; set; } = new byte[32];
        public List<PurchasedMod> List { get; set; } = new List<PurchasedMod>();


        public List<WeaponMod> GetWeaponMods()
        {
            return List.Select(x => x.WeaponMod).ToList();
        }
        public int GetSummOfRUBprices()
        {
            int summ = 0;
            foreach (var tuple in List)
            {
                if(tuple.PurchaseOffer != null)
                {
                    summ += tuple.PurchaseOffer.PriceRUB;
                }
                
            }

            return summ;
        }
        public PurchasedMods() { }
        public PurchasedMods(List<PurchasedMod> list)
        {
            List = list;
            HashId = GetHash();
        }

        private static readonly JsonSerializerOptions _options = new()
        {
            WriteIndented = true,
        };


        public static byte[] SerializeListToUtf8(List<PurchasedMod> List)
        {
            return JsonSerializer.SerializeToUtf8Bytes(List, _options);
        }

        public static List<PurchasedMod> DeserializeListFromUtf8(byte[] bytes)
        {
            return JsonSerializer.Deserialize<List<PurchasedMod>>(bytes, _options);
        }

        public byte[] GetHash()
        {
            var serializedObjects = new List<byte[]>();
            foreach (var obj in List)
            {
                var jsonBytes = JsonSerializer.SerializeToUtf8Bytes(obj);
                serializedObjects.Add(jsonBytes);
            }
            var concatenatedBytes = ConcatenateByteArrays(serializedObjects);
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(concatenatedBytes);
            return hashBytes;
        }

        private byte[] ConcatenateByteArrays(IEnumerable<byte[]> byteArrays)
        {
            var totalLength = 0;
            foreach (var byteArray in byteArrays)
            {
                totalLength += byteArray.Length;
            }
            var concatenatedBytes = new byte[totalLength];
            var offset = 0;
            foreach (var byteArray in byteArrays)
            {
                byteArray.CopyTo(concatenatedBytes, offset);
                offset += byteArray.Length;
            }
            return concatenatedBytes;
        }
    }

    public class PurchasedModsConfiguration : IEntityTypeConfiguration<PurchasedMods>
    {
        public void Configure(EntityTypeBuilder<PurchasedMods> builder)
        {
            builder.ToTable("PurchasedMods");
            builder.HasKey(x => x.HashId);

            builder.Property(x => x.HashId)
                .IsRequired()
                .HasMaxLength(32);

            builder.Property(x => x.List)
                .HasColumnName("ListBlob")
                .IsRequired()
                .HasConversion(
                    x => PurchasedMods.SerializeListToUtf8(x),
                    x => PurchasedMods.DeserializeListFromUtf8(x)
                )
                .Metadata.SetValueComparer(new PurchasedModListComparer());
        }
    }
}
