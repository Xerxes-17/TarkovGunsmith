namespace WishGranter.Statics
{
    public static class ArmorModules
    {
        public static List<ArmorModule> armorModules { get; } = ArmorModule.GetArmorModulesFromRatStash();
    }
}
