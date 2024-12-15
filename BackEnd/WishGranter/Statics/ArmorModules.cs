using RatStash;

namespace WishGranter.Statics
{
    public static class ArmorModules
    {
        public static List<ArmorModule> armorModules { get; } = ArmorModule.GetArmorModulesFromRatStash();

        public static List<ArmorModule> GetThoraxAramids()
        {
            List<ArmorModule> aramids = new List<ArmorModule>();

            aramids = armorModules
                .Where(module => module.ArmorMaterial == ArmorMaterial.Aramid)
                .Where(
                    module => module.ArmorColliders.Contains(ArmorCollider.RibcageUp) 
                    || module.ArmorPlateColliders.Contains(ArmorPlateCollider.Plate_Korund_chest)
                    || module.ArmorPlateColliders.Contains(ArmorPlateCollider.Plate_Granit_SAPI_chest)
                )
                .ToList();

            return aramids;
        }

        public static List<ArmorModule> GetThoraxAramidsClass2()
        {
            return GetThoraxAramids().Where(x => x.ArmorClass == 2).ToList();
        }

        public static List<ArmorModule> GetThoraxAramidsClass3()
        {
            return GetThoraxAramids().Where(x => x.ArmorClass == 3).ToList();
        }

        public static List<float> GetBluntValuesFromList(List<ArmorModule> modules)
        {
            var result = modules.Select(x => x.BluntThroughput).ToList();
            result.Sort();

            return result;
        }

        public static List<int> GetDurabilityValuesFromList(List<ArmorModule> modules)
        {
            var result = modules.Select(x => x.MaxDurability).ToList();
            result.Sort();

            return result;
        }
    }
}
