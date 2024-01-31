using RatStash;
using WishGranter.Statics;

namespace WishGranter
{
    public class NewArmorTableRow
    {
        public string Id { get; set; } = "";
        public string Type { get; set; } = ""; // Use an enum if "Heavy" and "Light" are fixed values
        public string Name { get; set; } = "";
        public string ImageLink { get; set; } = "";

        public double Weight { get; set; }
        public double Ergonomics { get; set; }
        public double SpeedPenalty { get; set; }
        public double TurnSpeed { get; set; }

        public bool IsDefault { get; set; }

        public int ArmorClass { get; set; }
        public double BluntThroughput { get; set; }
        public double Durability { get; set; }
        public double EffectiveDurability { get; set; }
        public ArmorMaterial ArmorMaterial { get; set; } = ArmorMaterial.Glass;
        public RicochetParams RicochetParams { get; set; } = new RicochetParams();
        public ArmorCollider[] ArmorColliders { get; set; } = new ArmorCollider[0];

        public List<NewArmorTableRow> SubRows { get; set; } = new();
    }

    public static class Armors
    {
        private static List<Type> SelectionFilter = new List<Type>()
        {
            typeof(Armor),
            typeof(ArmoredEquipment),
            typeof(FaceCover),
            typeof(Headwear),
            typeof(VisObservDevice)
        };

        public static List<Item> Cleaned { get; } = ConstructCleanedList();

        private static List<Item> ConstructCleanedList()
        {
            var ArmoredEquipmentAndChildren = StaticRatStash.DB.GetItems(x => SelectionFilter.Contains(x.GetType())).Cast<ArmoredEquipment>().Cast<Item>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(ChestRig)).Cast<ChestRig>().Cast<Item>().ToList();

            var result = ArmoredEquipmentAndChildren
                .Union(ArmoredChestRigs)
                .ToList();

            result.RemoveAll(x => x.Id == "58ac60eb86f77401897560ff");
            result.RemoveAll(x => x.Id == "59e8936686f77467ce798647"); // Dev balaclava

            //Debug Print
            //foreach (var item in result)
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id} ");
            //}

            return result;
        }


        public static List<ArmoredEquipment> GetAssembledHelmets()
        {
            var helmets = StaticRatStash.DB.GetItems(x => typeof(Headwear) == x.GetType() && x.Name.Contains("helmet")).Cast<ArmoredEquipment>().ToList();

            var allArmoredEquipment = StaticRatStash.DB.GetItems(x => typeof(ArmoredEquipment) == x.GetType()).Cast<ArmoredEquipment>().Where(x=>x.ArmorClass > 0).ToList();

            foreach (var helmet in helmets)
            {
                Console.WriteLine(helmet.Name);
                foreach(var slot in helmet.Slots)
                {
                    if(slot.Filters[0].PlateId != "")
                    {
                        var defaultItem = StaticRatStash.DB.GetItem(slot.Filters[0].PlateId);

                        if(defaultItem != null)
                        {
                            Console.WriteLine($"  {defaultItem.Name}");
                            slot.ContainedItem = defaultItem;
                        }
                    }
                    //else
                    //{
                    //    var intersect = slot.Filters[0].Whitelist.Intersect(allArmoredEquipment.Select(x=>x.Id)).ToList();

                    //    if (intersect.Count() > 0)
                    //    {
                    //        foreach(var item in intersect)
                    //        {
                    //            var ratItem = StaticRatStash.DB.GetItem(item);
                    //            Console.WriteLine($" -{ratItem.Name}");
                    //        }
                    //    }
                    //}
                }
                Console.WriteLine();
            }

            return helmets;
        }

        public static List<NewArmorTableRow> ConvertHelmetsToArmorTableRows()
        {
            List<NewArmorTableRow> result = new List<NewArmorTableRow>();
            var allArmoredEquipment = StaticRatStash.DB.GetItems(x => typeof(ArmoredEquipment) == x.GetType()).Cast<ArmoredEquipment>().Where(x => x.ArmorClass > 0).ToList();

            var assembled = GetAssembledHelmets();

            assembled.RemoveAll(x => x.Id == "59ef13ca86f77445fd0e2483"); //No Jacks

            foreach (var assembledHelm in assembled)
            {
                NewArmorTableRow mainRow = new NewArmorTableRow();
                mainRow.Id = assembledHelm.Id;
                mainRow.Type = assembledHelm.ArmorType.ToString();
                mainRow.Name = assembledHelm.Name;
                
                mainRow.Weight = assembledHelm.Weight;
                mainRow.Ergonomics = assembledHelm.WeaponErgonomicPenalty;
                mainRow.SpeedPenalty = assembledHelm.SpeedPenaltyPercent;
                mainRow.TurnSpeed = assembledHelm.MousePenalty;
                mainRow.IsDefault = true;

                var foo = assembledHelm.Slots.Where(x=>x.Filters[0].ArmorColliders.Count > 0).ToList();
                var notFoo = assembledHelm.Slots.Where(x => x.Filters[0].ArmorColliders.Count == 0).ToList();

                var temp = (ArmoredEquipment)StaticRatStash.DB.GetItem(foo[0].ContainedItem.Id);
                int countOfDefaults = assembledHelm.Slots.Where(x=>x.ContainedItem != null).Count();
                var armorColliders = assembledHelm.Slots
                        .Where(x => x.ContainedItem != null)
                        .SelectMany(x => x.Filters[0].ArmorColliders)
                        .ToArray();

                if (temp != null)
                {
                    mainRow.ArmorMaterial = temp.ArmorMaterial;
                    mainRow.ArmorClass = temp.ArmorClass;
                    mainRow.BluntThroughput = temp.BluntThroughput;
                    mainRow.Durability = temp.Durability * countOfDefaults;
                    mainRow.EffectiveDurability = Ballistics.GetEffectiveDurability(temp.Durability, temp.ArmorMaterial) * countOfDefaults;
                    mainRow.RicochetParams = temp.RicochetParams;
                    mainRow.ArmorColliders = armorColliders;
                }

                foreach(var bar in foo)
                {
                    var subTemp = (ArmoredEquipment) bar.ContainedItem;
                    NewArmorTableRow subRow = new NewArmorTableRow();
                    subRow.Id = subTemp.Id;
                    subRow.Type = subTemp.ArmorType.ToString();
                    subRow.Name = subTemp.Name;
                    
                    subRow.Weight = subTemp.Weight;
                    subRow.Ergonomics = subTemp.WeaponErgonomicPenalty;
                    subRow.SpeedPenalty = subTemp.SpeedPenaltyPercent;
                    subRow.TurnSpeed = subTemp.MousePenalty;
                    subRow.IsDefault = true;

                    subRow.ArmorMaterial = subTemp.ArmorMaterial;
                    subRow.ArmorClass = subTemp.ArmorClass;
                    subRow.BluntThroughput = subTemp.BluntThroughput;
                    subRow.Durability = subTemp.Durability;
                    subRow.EffectiveDurability = Ballistics.GetEffectiveDurability(subTemp.Durability, subTemp.ArmorMaterial);
                    subRow.RicochetParams = subTemp.RicochetParams;
                    subRow.ArmorColliders = subTemp.ArmorColliders.ToArray();

                    mainRow.SubRows.Add(subRow);
                }

                foreach(var notBar in notFoo)
                {
                    var intersect = notBar.Filters[0].Whitelist.Intersect(allArmoredEquipment.Select(x => x.Id)).ToList();

                    if (intersect.Count() > 0)
                    {
                        foreach (var item in intersect)
                        {
                            var ratItem = (ArmoredEquipment) StaticRatStash.DB.GetItem(item);
                            NewArmorTableRow subRow = new NewArmorTableRow();
                            subRow.Id = ratItem.Id;
                            subRow.Type = ratItem.ArmorType.ToString();
                            subRow.Name = ratItem.Name;

                            subRow.Weight = ratItem.Weight;
                            subRow.Ergonomics = ratItem.WeaponErgonomicPenalty;
                            subRow.SpeedPenalty = ratItem.SpeedPenaltyPercent;
                            subRow.TurnSpeed = ratItem.MousePenalty;
                            subRow.IsDefault = false;

                            subRow.ArmorMaterial = ratItem.ArmorMaterial;
                            subRow.ArmorClass = ratItem.ArmorClass;
                            subRow.BluntThroughput = ratItem.BluntThroughput;
                            subRow.Durability = ratItem.Durability;
                            subRow.EffectiveDurability = Ballistics.GetEffectiveDurability(ratItem.Durability, ratItem.ArmorMaterial);
                            subRow.RicochetParams = ratItem.RicochetParams;
                            subRow.ArmorColliders = ratItem.ArmorColliders.ToArray();

                            mainRow.SubRows.Add(subRow);
                        }
                    }
                }

                result.Add(mainRow);
            }


            return result;
        }
    }
}
