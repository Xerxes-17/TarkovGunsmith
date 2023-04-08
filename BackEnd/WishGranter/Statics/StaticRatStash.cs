using RatStash;

namespace WishGranter
{
    public static class StaticRatStash
    {
        public static Database DB { get; } = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
    }
}
