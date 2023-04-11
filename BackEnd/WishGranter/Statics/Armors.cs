using RatStash;

namespace WishGranter
{
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
            var ArmoredEquipmentAndChildren = StaticRatStash.DB.GetItems(x => SelectionFilter.Contains(x.GetType())).Cast<ArmoredEquipment>().Where(x => x.ArmorClass > 0).Cast<Item>().ToList();
            var ArmoredChestRigs = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(ChestRig)).Cast<ChestRig>().Where(x => x.ArmorClass > 0).Cast<Item>().ToList();

            var result = ArmoredEquipmentAndChildren
                .Union(ArmoredChestRigs)
                .ToList();

            result.RemoveAll(x => x.Id == "58ac60eb86f77401897560ff");

            //Debug Print
            //foreach (var item in result)
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id} ");
            //}

            return result;
        }
    }
}
