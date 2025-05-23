using RatStash;

namespace WishGranter.Statics
{
    public static class ArmorModules
    {
        public static List<ArmorModule> armorModules { get; } = ArmorModule.GetArmorModulesFromRatStash();

        // This is here so that it can be tested.
        public static ArmorModule FetchTrooperThoraxInsert()
        {
            // get the trooper insert
            var trooperSoftInsert = armorModules.First(module =>
                module.UsedInNames.Contains("HighCom Trooper TFO body armor (MultiCam)") &&
                module.ArmorMaterial.Equals(ArmorMaterial.Aramid) &&
                module.ArmorColliders.Contains(ArmorCollider.RibcageUp) &&
                module.Category.Equals("Insert")
            );
            return trooperSoftInsert;
        }

        // This is here so that it can be tested.
        public static List<ArmorModule> FetchAllFrontPlates()
        {
            var plates = armorModules.Where(module =>
                    (module.ArmorPlateColliders.Contains(ArmorPlateCollider.Plate_Korund_chest) ||
                    module.ArmorPlateColliders.Contains(ArmorPlateCollider.Plate_Granit_SAPI_chest)) &&
                    module.Category.Equals("Plate")
                ).ToList();

            return plates;
        }
    }
}
