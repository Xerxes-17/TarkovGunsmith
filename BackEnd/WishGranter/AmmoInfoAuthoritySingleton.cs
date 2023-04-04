using RatStash;

namespace WishGranter
{
    public class AmmoInfoAuthoritySingleton
    {
        private static AmmoInfoAuthoritySingleton? _instance = null;
        private AmmoInformationAuthority info { get; } = new();

        private static readonly object lockObj = new object();

        private AmmoInfoAuthoritySingleton()
        {
            
        }

        public static AmmoInfoAuthoritySingleton Instance
        {
            get 
            {
                lock (lockObj)
                {
                    if (_instance == null)
                    {
                        _instance = new AmmoInfoAuthoritySingleton();
                        _instance.info.InitializeInstance();
                    }
                        
                            
                }
                return _instance; 
            }
        }

        public void SingletonFunction()
        {
            Console.WriteLine("Hi you've just called the singleton, how can we help you?");
        }
        public SortedDictionary<string, AmmoReccord> Access()
        {
            return info.AmmoReccords;
        }
    }
}
