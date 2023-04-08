namespace WishGranter
{
    public class Singleton_Armors : BaseSingleton
    {
        private Singleton_Armors()
        {
        }

        public static Singleton_Armors GetInstance()
        {
            return (Singleton_Armors)Instance;
        }
    }
}
