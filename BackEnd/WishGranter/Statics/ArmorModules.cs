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

        public static List<ArmorModule> FetchAllLegacyArmorThoraxInserts()
        {
            List<string> legacyArmorNames = new List<string>
            {
                // AC 2
                "6B2 body armor (Flora)", //
                "BNTI Module-3M body armor", //
                "PACA Soft Armor", //

                // AC 3
                "6B5-16 Zh-86 Uley armored rig (Khaki)", //
                "NPP KlASS Kora-Kulon body armor (Black)", //
                "DRD body armor", //
                "MF-UNTAR body armor", //

                // AC 4
                "6B5-15 Zh-86 Uley armored rig (Flora)", //
                "6B3TM-01 armored rig (Khaki)" //
            };

            var thoraxOnly = armorModules.Where(module => module.ArmorColliders.Contains(ArmorCollider.RibcageUp)).ToList();

            var legacyModules = thoraxOnly.Where(module => module.UsedInNames.Any(name => legacyArmorNames.Contains(name))).ToList();

            return legacyModules;
        }
    }
}
