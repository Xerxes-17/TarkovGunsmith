using RatStash;

namespace WishGranter
{
    public class Singleton_Ratstash : BaseSingleton
    {
        public Database DB { get; } = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");

        private Singleton_Ratstash()
        {
        }

        public static Singleton_Ratstash GetInstance()
        {
            return (Singleton_Ratstash)Instance;
        }
    }
}
