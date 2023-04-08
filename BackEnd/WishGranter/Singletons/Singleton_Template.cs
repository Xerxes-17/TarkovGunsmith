namespace WishGranter
{
    public class Singleton_Template : BaseSingleton
    {
        private Singleton_Template()
        {
        }

        public static Singleton_Template GetInstance()
        {
            return (Singleton_Template)Instance;
        }
    }
}
