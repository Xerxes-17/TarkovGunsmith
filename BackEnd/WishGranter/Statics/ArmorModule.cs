using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using RatStash;
using System.ComponentModel.DataAnnotations;

namespace WishGranter.Statics
{
    // These two record classes are just so the DB can keep consistentcy with their IDs. It's easy enough to just use annotations with them.
    //? Actually, we're going to use this one to store all of the armorItem details in an SQL table as it's going to exist anyway
    //todo spin this off into its own .cs file with IEntityTypeConfiguration
    public record class ArmorModule
    {
        [Key]
        public string Id { get; set; } = "";
        [Required]
        public string Category { get; set; } = "";
        [Required]
        public ArmorType ArmorType { get; set; } = ArmorType.None;
        [Required]
        public string Name { get; set; } = "";

        [Required]
        public int ArmorClass { get; set; }
        [Required]
        public float BluntThroughput { get; set; }

        [Required]
        public int MaxDurability { get; set; }
        [Required]
        public int MaxEffectiveDurability { get; set; }
        [Required]
        public ArmorMaterial ArmorMaterial { get; set; }
        [Required]
        public float Weight { get; set; }

        [Required]
        public List<string> UsedInNames { get; set;} = new();

        [Required]
        public List<string> CompatibleWith { get; set; } = new();

        [Required]
        public string RicochetParams { get; set; } = "";

        [Required]
        public List<ArmorPlateCollider> ArmorPlateColliders { get; set; } = new();

        [Required]
        public List<ArmorCollider> ArmorColliders { get; set; } = new();
        

        //todo This logic is probably wrong and needs fixing
        public static Dictionary<string, List<string>> GetItemsPlatesAreCompatibleWith()
        {
            Dictionary<string, List<string>> platesToAllowed = new();
            var ArmoredEquipments = StaticRatStash.DB.GetItems().Where(x => x is ArmoredEquipment).Cast<ArmoredEquipment>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems().Where(x => x is ChestRig).Cast<ChestRig>().ToList();

            foreach (var armor in ArmoredEquipments)
            {
                foreach (var slot in armor.Slots)
                {
                    foreach (var allowedId in slot.Filters[0].Whitelist)
                    {
                        if (!platesToAllowed.ContainsKey(allowedId))
                        {
                            platesToAllowed[allowedId] = new List<string>();
                            platesToAllowed[allowedId].Add(armor.Name);
                        }
                        else
                        {
                            if(!platesToAllowed[allowedId].Contains(armor.Name))
                                platesToAllowed[allowedId].Add(armor.Name);

                        }
                    }
                }
            }

            foreach (var rig in ArmoredChestRigs)
            {
                foreach (var slot in rig.Slots)
                {
                    foreach (var allowedId in slot.Filters[0].Whitelist)
                    {
                        if (!platesToAllowed.ContainsKey(allowedId))
                        {
                            platesToAllowed[allowedId] = new List<string>();
                            platesToAllowed[allowedId].Add(rig.Name);
                        }
                        else
                        {
                            if (!platesToAllowed[allowedId].Contains(rig.Name))
                                platesToAllowed[allowedId].Add(rig.Name);
                        }
                    }
                }
            }

            return platesToAllowed;
        }

        public static List<(string armorId, string plateId)> GetDefaultUsedByPairs()
        {
            List<( string armorId, string plateId)> usedBy = new();
            var ArmoredEquipments = StaticRatStash.DB.GetItems().Where(x => x is ArmoredEquipment).Cast<ArmoredEquipment>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems().Where(x => x is ChestRig).Cast<ChestRig>().ToList();

            foreach (var armor in ArmoredEquipments)
            {
                foreach (var slot in armor.Slots)
                {
                    if(slot.Filters[0].PlateId != "")
                        usedBy.Add((armor.Id, slot.Filters[0].PlateId));
                }
            }

            foreach (var rig in ArmoredChestRigs)
            {
                foreach (var slot in rig.Slots)
                {
                    if (slot.Filters[0].PlateId != "")
                        usedBy.Add((rig.Id, slot.Filters[0].PlateId));
                }
            }

            return usedBy;
        }
        public static Dictionary<string, List<string>> CreateArmorToPlateMap(List<(string armorId, string plateId)> usedByPairs)
        {
            // Group pairs by ArmorId
            var groupedByArmor = usedByPairs.GroupBy(pair => pair.armorId);

            // Create ArmorId to N PlateId map
            var armorToPlateMap = groupedByArmor.ToDictionary(
                group => group.Key,
                group => group.Select(pair => pair.plateId).Distinct().ToList()
            );

            return armorToPlateMap;
        }
        public static Dictionary<string, List<string>> CreatePlateToArmorMap(List<(string armorId, string plateId)> usedByPairs)
        {
            // Group pairs by PlateId
            var groupedByPlate = usedByPairs.GroupBy(pair => pair.plateId);

            // Create PlateId to N ArmorId map
            var plateToArmorMap = groupedByPlate.ToDictionary(
                group => group.Key,
                group => group.Select(pair => pair.armorId).Distinct().ToList()
            );

            return plateToArmorMap;
        }

        private static List<string> GetNamesFromIds(List<string> ids)
        {
            var names = new List<string>();
            foreach (var id in ids)
            {
                names.Add(StaticRatStash.DB.GetItem(id).Name);
            }
            return names;
        }
        public static List<ArmorModule> GetArmorModulesFromRatStash()
        {
            var IdPairs = GetDefaultUsedByPairs();
            var PlateToArmorMap = CreatePlateToArmorMap(IdPairs);
            var platesCompatibleDict = GetItemsPlatesAreCompatibleWith();

            List<ArmorModule> armorPlateOrInserts = new List<ArmorModule>();

            var armorPlates = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(ArmorPlate)).Cast<ArmorPlate>().ToList();
            var builtInInserts = StaticRatStash.DB.GetItems(x => x is BuiltInInserts).Cast<BuiltInInserts>().ToList();

            armorPlates = armorPlates.Where(plate => plate.ArmorPlateColliders.Count > 0  && !plate.Name.Equals("")).ToList();
            builtInInserts = builtInInserts.Where(insert => insert.BluntThroughput > 0 && !insert.Name.Equals("")).ToList();
            
            foreach(var plate in armorPlates)
            {
                ArmorModule item = new();
                item.Id = plate.Id;
                item.Category = "Plate";
                item.ArmorType = plate.ArmorType;
                item.Name = plate.Name;

                item.ArmorClass = plate.ArmorClass;
                item.BluntThroughput = plate.BluntThroughput;

                item.MaxDurability = plate.MaxDurability;
                item.MaxEffectiveDurability = Ballistics.GetEffectiveDurability(plate.MaxDurability, plate.ArmorMaterial);
                item.ArmorMaterial = plate.ArmorMaterial;
                item.Weight = plate.Weight;


                var ids = PlateToArmorMap.GetValueOrDefault(plate.Id);
                if(ids != null)
                {
                    var names = GetNamesFromIds(ids);
                    item.UsedInNames = names;
                }
                if (platesCompatibleDict.ContainsKey(plate.Id))
                    item.CompatibleWith = platesCompatibleDict[plate.Id];

                item.RicochetParams = $"x:{plate.RicochetParams.X}, y:{plate.RicochetParams.Y}, z:{plate.RicochetParams.Z}";

                item.ArmorPlateColliders = plate.ArmorPlateColliders;
                item.ArmorColliders = plate.ArmorColliders;

                armorPlateOrInserts.Add(item);
            }

            foreach (var insert in builtInInserts)
            {
                ArmorModule item = new();
                item.Id = insert.Id;
                item.Category = "Insert";
                item.ArmorType = insert.ArmorType;
                item.Name = insert.Name;

                item.ArmorClass = insert.ArmorClass;
                item.BluntThroughput = insert.BluntThroughput;

                item.MaxDurability = insert.MaxDurability;
                item.MaxEffectiveDurability = Ballistics.GetEffectiveDurability(insert.MaxDurability, insert.ArmorMaterial);
                item.ArmorMaterial = insert.ArmorMaterial;
                item.Weight = insert.Weight;

                var ids = PlateToArmorMap.GetValueOrDefault(insert.Id);
                if (ids != null)
                {
                    var names = GetNamesFromIds(ids);
                    item.UsedInNames = names;
                }
                if(platesCompatibleDict.ContainsKey(insert.Id))
                    item.CompatibleWith = platesCompatibleDict[insert.Id];

                item.RicochetParams = $"x:{insert.RicochetParams.X}, y:{insert.RicochetParams.Y}, z:{insert.RicochetParams.Z}";

                item.ArmorPlateColliders = insert.ArmorPlateColliders;
                item.ArmorColliders = insert.ArmorColliders;

                armorPlateOrInserts.Add(item);
            }

            return armorPlateOrInserts;
        }

        //public static ArmorItemStats GetArmorItemStatsByID(string Id)
        //{
        //    using var db = new Monolit();

        //    var item = db.ArmorItems.FirstOrDefault(x => x.Id == Id);

        //    return item;
        //}
    }
}
