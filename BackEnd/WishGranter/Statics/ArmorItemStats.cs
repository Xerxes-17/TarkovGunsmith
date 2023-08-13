using RatStash;
using System.ComponentModel.DataAnnotations;

namespace WishGranter.Statics
{
    // These two record classes are just so the DB can keep consistentcy with their IDs. It's easy enough to just use annotations with them.
    //? Actually, we're going to use this one to store all of the armorItem details in an SQL table as it's going to exist anyway
    //todo spin this off into its own .cs file with IEntityTypeConfiguration
    public record class ArmorItemStats
    {
        [Key]
        public string Id { get; set; } = "";
        [Required]
        public string Name { get; set; } = "";
        [Required]
        public int ArmorClass { get; set; }
        [Required]
        public ArmorMaterial ArmorMaterial { get; set; }
        [Required]
        public float BluntThroughput { get; set; }
        [Required]
        public int MaxDurability { get; set; }
        [Required]
        public int EffectiveMaxDurability { get; set; }
        [Required]
        public TargetZone TargetZone { get; set; }
        [Required]
        public string Type { get; set; } = "";
        [Required]
        public float Weight { get; set; }

        // The input list should be provided by the Armors static class
        public static List<ArmorItemStats> GenerateListOfArmorItems(List<Item> armorList)
        {
            var ArmoredEquipmentAndChildren = armorList.Where(x=> x is ArmoredEquipment).Cast<ArmoredEquipment>();
            var ArmoredChestRigs = armorList.Where(x => x is ChestRig).Cast<ChestRig>();
            List<ArmorItemStats> outputList = new();

            foreach (var armor in ArmoredEquipmentAndChildren)
            {
                TargetZone targetZone;
                if(armor.ArmorZone.Any(x => x.Equals(ArmorZone.Chest)))
                {
                    targetZone = TargetZone.Thorax;
                }
                else
                    targetZone = TargetZone.Head;

                string type;
                if (armor is Headwear) {
                    type = "Helmet";
                }
                else if(armor is Armor){
                    type = "ArmorVest";
                }
                else{
                    type = "ArmoredEquipment";
                }

                ArmorItemStats armorItemStats = new ArmorItemStats
                {
                    Id = armor.Id,
                    Name = armor.Name,
                    ArmorClass = armor.ArmorClass,
                    ArmorMaterial = armor.ArmorMaterial,
                    BluntThroughput = armor.BluntThroughput,
                    MaxDurability = armor.MaxDurability,
                    EffectiveMaxDurability = Ballistics.GetEffectiveDurability(armor.MaxDurability, armor.ArmorMaterial),
                    TargetZone = targetZone,
                    Type = type,
                    Weight = armor.Weight,
                };
                outputList.Add(armorItemStats);
            }

            foreach (var rig in ArmoredChestRigs)
            {
                ArmorItemStats armorItemStats = new ArmorItemStats
                {
                    Id = rig.Id,
                    Name = rig.Name,
                    ArmorClass = rig.ArmorClass,
                    ArmorMaterial = rig.ArmorMaterial,
                    BluntThroughput = rig.BluntThroughput,
                    MaxDurability = rig.MaxDurability,
                    EffectiveMaxDurability = Ballistics.GetEffectiveDurability(rig.MaxDurability, rig.ArmorMaterial),
                    TargetZone = TargetZone.Thorax,
                    Type = "ChestRig",
                    Weight = rig.Weight,
                };
                outputList.Add(armorItemStats);
            }

            return outputList;
        }

        public static void Generate_Save_All_ArmorItems()
        {
            var items = GenerateListOfArmorItems(Armors.Cleaned);

            using var db = new Monolit();
            Console.WriteLine($"Database path: {db.DbPath}.");

            foreach (var item in items)
            {
                var check = db.ArmorItems.Any(x => x.Id == item.Id);
                if (check == false)
                {
                    db.Add(item);
                }
            }
            db.SaveChanges();
        }

        public static ArmorItemStats GetArmorItemStatsByID(string Id)
        {
            using var db = new Monolit();

            var item = db.ArmorItems.FirstOrDefault(x => x.Id == Id);

            return item;
        }
    }
}
