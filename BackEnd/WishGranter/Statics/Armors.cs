using RatStash;
using WishGranter.Statics;

namespace WishGranter
{
    public class NewArmorTableRow
    {
        public string Id { get; set; } = "";
        public string Type { get; set; } = ""; // Use an enum if "Heavy" and "Light" are fixed values
        public string Category { get; set; } = ""; // If it is a plate, insert or attachment.
        public string Name { get; set; } = "";
        public string ImageLink { get; set; } = "";

        public double Weight { get; set; }
        public double Ergonomics { get; set; }
        public double SpeedPenalty { get; set; }
        public double TurnSpeed { get; set; }

        public bool IsDefault { get; set; } // Means integral for the helmet, builtIn with vests and rigs

        public int ArmorClass { get; set; }
        public double BluntThroughput { get; set; }
        public double Durability { get; set; }
        public double EffectiveDurability { get; set; }
        public ArmorMaterial ArmorMaterial { get; set; } = ArmorMaterial.Glass;
        public RicochetParams RicochetParams { get; set; } = new RicochetParams();
        public ArmorCollider[] ArmorColliders { get; set; } = new ArmorCollider[0];
        public ArmorPlateCollider[] ArmorPlateColliders { get; set; } = new ArmorPlateCollider[0];
        public List<string> CompatibleInSlotIds { get; set; } = new();

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

        public static List<NewArmorTableRow> AssembledArmorsAndRigsAsRows { get; } = ConvertAssembledArmorsAndRigsToTableRows();

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

            var allArmoredEquipment = StaticRatStash.DB.GetItems(x => typeof(ArmoredEquipment) == x.GetType()).Cast<ArmoredEquipment>().Where(x => x.ArmorClass > 0).ToList();

            foreach (var helmet in helmets)
            {
                foreach (var slot in helmet.Slots)
                {
                    if (slot.Filters[0].PlateId != "")
                    {
                        var defaultItem = StaticRatStash.DB.GetItem(slot.Filters[0].PlateId);

                        if (defaultItem != null)
                        {
                            slot.ContainedItem = defaultItem;
                        }
                    }
                }
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

                var foo = assembledHelm.Slots.Where(x => x.Filters[0].ArmorColliders.Count > 0).ToList();
                var notFoo = assembledHelm.Slots.Where(x => x.Filters[0].ArmorColliders.Count == 0).ToList();

                var isLocked = foo[0].Filters[0].Locked; //todo use this

                var temp = (ArmoredEquipment)StaticRatStash.DB.GetItem(foo[0].ContainedItem.Id);
                int countOfDefaults = assembledHelm.Slots.Where(x => x.ContainedItem != null).Count();
                var armorColliders = assembledHelm.Slots
                        .Where(x => x.ContainedItem != null)
                        .SelectMany(x => x.Filters[0].ArmorColliders)
                        .ToArray();

                var totalDura = foo.Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                var totalEffectiveDura = foo.Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));

                if (temp != null)
                {
                    mainRow.ArmorMaterial = temp.ArmorMaterial;
                    mainRow.ArmorClass = temp.ArmorClass;
                    mainRow.BluntThroughput = temp.BluntThroughput;
                    mainRow.Durability = totalDura;
                    mainRow.EffectiveDurability = totalEffectiveDura;
                    mainRow.RicochetParams = temp.RicochetParams;
                    mainRow.ArmorColliders = armorColliders;
                }

                foreach (var bar in foo)
                {
                    var subTemp = (ArmoredEquipment)bar.ContainedItem;
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

                foreach (var notBar in notFoo)
                {
                    var intersect = notBar.Filters[0].Whitelist.Intersect(allArmoredEquipment.Select(x => x.Id)).ToList();

                    if (intersect.Count() > 0)
                    {
                        foreach (var item in intersect)
                        {
                            var ratItem = (ArmoredEquipment)StaticRatStash.DB.GetItem(item);
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


        public static List<Item> GetAssembledArmorsAndRigs()
        {
            var vests = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(Armor)).Cast<ArmoredEquipment>().Cast<Item>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(ChestRig) && (x.Name.Contains("armored") || (x.Name.Contains("plate carrier")))).Cast<ChestRig>().Cast<Item>().ToList();

            var result = vests
                .Union(ArmoredChestRigs)
                .Cast<CompoundItem>()
                .ToList();

            result.RemoveAll(x => x.Id == "58ac60eb86f77401897560ff");
            result.RemoveAll(x => x.Id == "59e8936686f77467ce798647"); // Dev balaclava

            foreach (var item in result)
            {
                //Console.WriteLine($"{item.Name}");
                foreach (var slot in item.Slots)
                {
                    if (slot.Filters[0].PlateId != "")
                    {
                        var defaultItem = StaticRatStash.DB.GetItem(slot.Filters[0].PlateId);

                        if (defaultItem != null)
                        {
                            slot.ContainedItem = defaultItem;
                            //Console.WriteLine($"  {defaultItem.Name}");
                        }
                    }
                }
                //Console.WriteLine($"");
            }

            //Debug Print
            //foreach (var item in result)
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id} ");
            //}

            return result.Cast<Item>().ToList();
        }

        public static List<NewArmorTableRow> ConvertAssembledArmorsAndRigsToTableRows()
        {
            List<NewArmorTableRow> result = new List<NewArmorTableRow>();
            var assembled = GetAssembledArmorsAndRigs();

            var vests = assembled.Where(x => x.GetType() == typeof(Armor)).Cast<Armor>();

            var rigs = assembled.Where(x => x.GetType() == typeof(ChestRig)).Cast<ChestRig>();

            foreach (var armor in vests)
            {
                NewArmorTableRow mainRow = new NewArmorTableRow();
                mainRow.Id = armor.Id;
                mainRow.Type = armor.ArmorType.ToString();
                mainRow.Name = armor.Name;

                mainRow.IsDefault = true;

                var armorColliderSlots = armor.Slots.Where(x => x.Filters[0].ArmorColliders.Count > 0).ToList();
                var armorPlateSlots = armor.Slots.Where(x => x.Filters[0].ArmorPlateColliders.Count > 0).ToList();

                var armorColliders = armor.Slots
                        .Where(x => x.ContainedItem != null)
                        .SelectMany(x => x.Filters[0].ArmorColliders)
                        .ToArray();
                var armorPlateColliders = armor.Slots
                        .Where(x => x.ContainedItem != null)
                        .SelectMany(x => x.Filters[0].ArmorPlateColliders)
                        .ToArray();

                var totalDuraArmor = armorColliderSlots.Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                var totalEffectiveDuraArmor = armorColliderSlots.Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                var totalDuraPlates = 0;
                var totalEffectiveDuraPlates = 0;
                if (armorPlateSlots.Count > 0)
                {
                    totalDuraPlates = armorPlateSlots.Where(x => x.ContainedItem != null).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                    totalEffectiveDuraPlates = armorPlateSlots.Where(x => x.ContainedItem != null).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                }
                

                if (totalDuraArmor == 0)
                {
                    totalDuraArmor = armorPlateSlots.Where(x=> x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                    totalEffectiveDuraArmor = armorColliderSlots.Where(x => x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                    totalDuraPlates = armorPlateSlots.Where(x => !x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                    totalEffectiveDuraPlates = armorPlateSlots.Where(x => !x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                }

                ArmoredEquipment sampleSoftArmor = new();
                
                if(armorColliderSlots.Count > 0)
                {
                    sampleSoftArmor = (ArmoredEquipment)StaticRatStash.DB.GetItem(armorColliderSlots[0].ContainedItem.Id);
                }
                else
                {
                    sampleSoftArmor = armorPlateSlots.Where(x => !x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().FirstOrDefault();
                }

                var defaultPlates = armorPlateSlots.Where(x => !x.Required && x.ContainedItem != null).Select(x => x.ContainedItem).Cast<ArmoredEquipment>();

                var plateWeight = defaultPlates.Sum(item => item.Weight);
                mainRow.Weight = armor.Weight + plateWeight;

                var plateErgo = defaultPlates.Sum(item => item.WeaponErgonomicPenalty);
                mainRow.Ergonomics = armor.WeaponErgonomicPenalty + plateErgo;

                var plateSpeed = defaultPlates.Sum(item => item.SpeedPenaltyPercent);
                mainRow.SpeedPenalty = armor.SpeedPenaltyPercent + plateSpeed;

                var plateTurn = defaultPlates.Sum(item => item.MousePenalty);
                mainRow.TurnSpeed = armor.MousePenalty + plateTurn;


                if (sampleSoftArmor != null)
                {
                    mainRow.ArmorMaterial = sampleSoftArmor.ArmorMaterial;
                    mainRow.ArmorClass = sampleSoftArmor.ArmorClass;
                    mainRow.BluntThroughput = sampleSoftArmor.BluntThroughput;
                    mainRow.Durability = totalDuraArmor + totalDuraPlates;
                    mainRow.EffectiveDurability = totalEffectiveDuraArmor + totalEffectiveDuraPlates;
                    mainRow.RicochetParams = sampleSoftArmor.RicochetParams;
                    mainRow.ArmorColliders = armorColliders;
                    mainRow.ArmorPlateColliders = armorPlateColliders;
                }

                foreach(var slot in armorColliderSlots)
                {
                    var subTemp = (ArmoredEquipment)slot.ContainedItem;
                    NewArmorTableRow subRow = new NewArmorTableRow();
                    subRow.Id = subTemp.Id;
                    subRow.Type = subTemp.ArmorType.ToString();
                    subRow.Name = subTemp.Name;

                    subRow.Weight = subTemp.Weight;
                    subRow.Ergonomics = subTemp.WeaponErgonomicPenalty;
                    subRow.SpeedPenalty = subTemp.SpeedPenaltyPercent;
                    subRow.TurnSpeed = subTemp.MousePenalty;
                    subRow.IsDefault = slot.Required;

                    subRow.ArmorMaterial = subTemp.ArmorMaterial;
                    subRow.ArmorClass = subTemp.ArmorClass;
                    subRow.BluntThroughput = subTemp.BluntThroughput;
                    subRow.Durability = subTemp.Durability;
                    subRow.EffectiveDurability = Ballistics.GetEffectiveDurability(subTemp.Durability, subTemp.ArmorMaterial);
                    subRow.RicochetParams = subTemp.RicochetParams;
                    subRow.ArmorColliders = subTemp.ArmorColliders.ToArray();

                    mainRow.SubRows.Add(subRow);
                }
                foreach(var slot in armorPlateSlots)
                {
                    if(slot.ContainedItem != null)
                    {
                        var subTemp = (ArmoredEquipment)slot.ContainedItem;
                        NewArmorTableRow subRow = new NewArmorTableRow();
                        subRow.Id = subTemp.Id;
                        subRow.Type = subTemp.ArmorType.ToString();
                        subRow.Name = subTemp.Name;

                        subRow.Weight = subTemp.Weight;
                        subRow.Ergonomics = subTemp.WeaponErgonomicPenalty;
                        subRow.SpeedPenalty = subTemp.SpeedPenaltyPercent;
                        subRow.TurnSpeed = subTemp.MousePenalty;
                        subRow.IsDefault = slot.Required;

                        subRow.ArmorMaterial = subTemp.ArmorMaterial;
                        subRow.ArmorClass = subTemp.ArmorClass;
                        subRow.BluntThroughput = subTemp.BluntThroughput;
                        subRow.Durability = subTemp.Durability;
                        subRow.EffectiveDurability = Ballistics.GetEffectiveDurability(subTemp.Durability, subTemp.ArmorMaterial);
                        subRow.RicochetParams = subTemp.RicochetParams;
                        subRow.ArmorPlateColliders = subTemp.ArmorPlateColliders.ToArray();
                        subRow.CompatibleInSlotIds = slot.Filters[0].Whitelist;

                        mainRow.SubRows.Add(subRow);
                    }
                }

                result.Add(mainRow);
            }

            foreach (var armor in rigs)
            {
                NewArmorTableRow mainRow = new NewArmorTableRow();
                mainRow.Id = armor.Id;
                mainRow.Type = armor.ArmorType.ToString();
                mainRow.Name = armor.Name;

                mainRow.IsDefault = true;

                var armorColliderSlots = armor.Slots.Where(x => x.Filters[0].ArmorColliders.Count > 0).ToList();
                var armorPlateSlots = armor.Slots.Where(x => x.Filters[0].ArmorPlateColliders.Count > 0).ToList();

                var armorColliders = armor.Slots
                        .Where(x => x.ContainedItem != null)
                        .SelectMany(x => x.Filters[0].ArmorColliders)
                        .ToArray();
                var armorPlateColliders = armor.Slots
                        .Where(x => x.ContainedItem != null)
                        .SelectMany(x => x.Filters[0].ArmorPlateColliders)
                        .ToArray();

                var totalDuraArmor = armorColliderSlots.Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                var totalEffectiveDuraArmor = armorColliderSlots.Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                var totalDuraPlates = 0;
                var totalEffectiveDuraPlates = 0;
                if (armorPlateSlots.Count > 0)
                {
                    totalDuraPlates = armorPlateSlots.Where(x => x.ContainedItem != null).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                    totalEffectiveDuraPlates = armorPlateSlots.Where(x => x.ContainedItem != null).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                }


                if (totalDuraArmor == 0)
                {
                    totalDuraArmor = armorPlateSlots.Where(x => x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                    totalEffectiveDuraArmor = armorColliderSlots.Where(x => x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                    totalDuraPlates = armorPlateSlots.Where(x => !x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => item.Durability);
                    totalEffectiveDuraPlates = armorPlateSlots.Where(x => !x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().Sum(item => Ballistics.GetEffectiveDurability(item.Durability, item.ArmorMaterial));
                }

                ArmoredEquipment sampleSoftArmor = new();

                if (armorColliderSlots.Count > 0)
                {
                    sampleSoftArmor = (ArmoredEquipment)StaticRatStash.DB.GetItem(armorColliderSlots[0].ContainedItem.Id);
                }
                else
                {
                    sampleSoftArmor = armorPlateSlots.Where(x => !x.Required).Select(x => x.ContainedItem).Cast<ArmoredEquipment>().FirstOrDefault();
                }

                var defaultPlates = armorPlateSlots.Where(x => !x.Required && x.ContainedItem != null).Select(x => x.ContainedItem).Cast<ArmoredEquipment>();

                var plateWeight = defaultPlates.Sum(item => item.Weight);
                mainRow.Weight = armor.Weight + plateWeight;

                var plateErgo = defaultPlates.Sum(item => item.WeaponErgonomicPenalty);
                mainRow.Ergonomics = armor.WeaponErgonomicPenalty + plateErgo;

                var plateSpeed = defaultPlates.Sum(item => item.SpeedPenaltyPercent);
                mainRow.SpeedPenalty = armor.SpeedPenaltyPercent + plateSpeed;

                var plateTurn = defaultPlates.Sum(item => item.MousePenalty);
                mainRow.TurnSpeed = armor.MousePenalty + plateTurn;


                if (sampleSoftArmor != null)
                {
                    mainRow.ArmorMaterial = sampleSoftArmor.ArmorMaterial;
                    mainRow.ArmorClass = sampleSoftArmor.ArmorClass;
                    mainRow.BluntThroughput = sampleSoftArmor.BluntThroughput;
                    mainRow.Durability = totalDuraArmor + totalDuraPlates;
                    mainRow.EffectiveDurability = totalEffectiveDuraArmor + totalEffectiveDuraPlates;
                    mainRow.RicochetParams = sampleSoftArmor.RicochetParams;
                    mainRow.ArmorColliders = armorColliders;
                    mainRow.ArmorPlateColliders = armorPlateColliders;
                }

                foreach (var slot in armorColliderSlots)
                {
                    var subTemp = (ArmoredEquipment)slot.ContainedItem;
                    NewArmorTableRow subRow = new NewArmorTableRow();
                    subRow.Id = subTemp.Id;
                    subRow.Type = subTemp.ArmorType.ToString();
                    subRow.Name = subTemp.Name;

                    subRow.Weight = subTemp.Weight;
                    subRow.Ergonomics = subTemp.WeaponErgonomicPenalty;
                    subRow.SpeedPenalty = subTemp.SpeedPenaltyPercent;
                    subRow.TurnSpeed = subTemp.MousePenalty;
                    subRow.IsDefault = slot.Required;

                    subRow.ArmorMaterial = subTemp.ArmorMaterial;
                    subRow.ArmorClass = subTemp.ArmorClass;
                    subRow.BluntThroughput = subTemp.BluntThroughput;
                    subRow.Durability = subTemp.Durability;
                    subRow.EffectiveDurability = Ballistics.GetEffectiveDurability(subTemp.Durability, subTemp.ArmorMaterial);
                    subRow.RicochetParams = subTemp.RicochetParams;
                    subRow.ArmorColliders = subTemp.ArmorColliders.ToArray();

                    mainRow.SubRows.Add(subRow);
                }
                foreach (var slot in armorPlateSlots)
                {
                    if (slot.ContainedItem != null)
                    {
                        var subTemp = (ArmoredEquipment)slot.ContainedItem;
                        NewArmorTableRow subRow = new NewArmorTableRow();
                        subRow.Id = subTemp.Id;
                        subRow.Type = subTemp.ArmorType.ToString();
                        subRow.Name = subTemp.Name;

                        subRow.Weight = subTemp.Weight;
                        subRow.Ergonomics = subTemp.WeaponErgonomicPenalty;
                        subRow.SpeedPenalty = subTemp.SpeedPenaltyPercent;
                        subRow.TurnSpeed = subTemp.MousePenalty;
                        subRow.IsDefault = slot.Required;

                        subRow.ArmorMaterial = subTemp.ArmorMaterial;
                        subRow.ArmorClass = subTemp.ArmorClass;
                        subRow.BluntThroughput = subTemp.BluntThroughput;
                        subRow.Durability = subTemp.Durability;
                        subRow.EffectiveDurability = Ballistics.GetEffectiveDurability(subTemp.Durability, subTemp.ArmorMaterial);
                        subRow.RicochetParams = subTemp.RicochetParams;
                        subRow.ArmorPlateColliders = subTemp.ArmorPlateColliders.ToArray();
                        subRow.CompatibleInSlotIds = slot.Filters[0].Whitelist;

                        mainRow.SubRows.Add(subRow);
                    }
                }

                result.Add(mainRow);
            }

            return result;
        }
    }
}
