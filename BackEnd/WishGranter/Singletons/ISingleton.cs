namespace WishGranter
{
    public interface ISingleton
    {
        public static ISingleton Instance { get; }
    }

    public abstract class BaseSingleton : ISingleton
    {
        private static readonly object padlock = new object();
        private static ISingleton instance = null;

        protected BaseSingleton()
        {
        }

        public static ISingleton Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new SingletonBaseImpl();
                    }
                    return instance;
                }
            }
        }

        private class SingletonBaseImpl : BaseSingleton
        {
            internal SingletonBaseImpl()
            {
            }
        }
    }
}
