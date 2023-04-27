using RatStash;

namespace WishGranter
{
    public static class StaticRatStash
    {
        public static Database DB { get; } = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

        public static List<Item> GetListOfItemsByListOfIds(List<string> ids)
        {
            List < Item > items = new();

            foreach(string id in ids)
                items.Add(DB.GetItem(id));

            return items;
        }
    }
}
