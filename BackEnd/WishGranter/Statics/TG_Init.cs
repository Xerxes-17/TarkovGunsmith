using Newtonsoft.Json.Linq;

namespace WishGranter.Statics
{
    // This class will wrap all of the program start-up stuff so program.cs can be clean and not a shit-show
    public class TG_Init
    {
        public static JObject Stub()
        {
            return new JObject();
        }
    }
}
