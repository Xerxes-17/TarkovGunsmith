using RatStash;

namespace WishGranter
{
    public class RatStashSingleton
    {
        private static RatStashSingleton? _instance = null;
        private Database database { get; } = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
        private static readonly object lockObj = new object();

        private RatStashSingleton()
        {
            
        }

        public static RatStashSingleton Instance
        {
            get 
            {
                lock (lockObj)
                {
                    if (_instance == null)
                        _instance = new RatStashSingleton();
                }
                return _instance; 
            }
        }

        public void SingletonFunction()
        {
            Console.WriteLine("Hi you've just called the singleton, how can we help you?");
        }
        public Database DB()
        {
            return database;
        }
    }
}
