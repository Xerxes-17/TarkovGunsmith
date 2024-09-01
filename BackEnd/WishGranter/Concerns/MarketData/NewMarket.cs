using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using WishGranter.Concerns.API;

namespace WishGranter.Concerns.MarketData
{
    // Concept: let's grab all of our market data from apti.tarkov.dev and process it in a robust way that is then saved to an SQLite
    // db so we can do all of those nice SELECT * FROM markets calls.

    // data fetch from API or from SQL

    // process trader names from API or SQL

    // Process loyalty levels from API or SQL

    // process item cash offers from API or SQL

    // process barter offers from API opr SQL

    public class NewMarket
    {
        private static readonly SemaphoreSlim _initLock = new(1, 1);

        public static bool initialised { get; set; } = false;

        private static List<Trader> _traders { get; set; } = new List<Trader>();

        public static async Task<List<Trader>> GetTraders()
        {
            if (initialised)
            {
                return _traders;
            }

            await _initLock.WaitAsync();
            try
            {
                if (!initialised)
                {
                    await InitNewMarketAsync();
                }
            }
            finally
            {
                _initLock.Release();
            }

            return _traders;
        }

        public static async Task InitNewMarketAsync()
        {
            List<Task> tasks = new()
            {
                InitTraderBaseInfo(),

            };

            await Task.WhenAll(tasks);

            if (_traders.Count > 0)
            {
                initialised = true;
            }

            initialised = true;
        }

        public static async Task InitTraderBaseInfo()
        {
            List<Trader> traders = new();

            var baseInfo = await NewTarkovDevApi.RobustGetTraderBaseInfo();

            string searchJSONpath = "$.data.traders[*]";
            var tokens = baseInfo.SelectTokens(searchJSONpath).ToList();

            if(tokens == null || tokens.Count == 0) 
            {
                return;
            }

            foreach (JToken token in tokens)
            {
                var id = token.SelectToken(".id").ToString();
                var name = token.SelectToken("$.name").ToString();
                var imageLink = token.SelectToken("$.imageLink").ToString();

                List<TraderLevel> levels = new();
                var levelTokens = token.SelectTokens("$.levels.[*]");
                foreach (JToken levelToken in levelTokens)
                {
                    var level = levelToken.SelectToken("$.level").ToObject<int>();
                    var requiredPlayerLevel = levelToken.SelectToken("$.requiredPlayerLevel").ToObject<int>();
                    var requiredReputation = levelToken.SelectToken("$.requiredReputation").ToObject<float>();
                    var requiredCommerce = levelToken.SelectToken("$.requiredCommerce").ToObject<int>();

                    TraderLevel traderLevel = new(level, requiredPlayerLevel, requiredReputation, requiredCommerce, id);

                    levels.Add(traderLevel);
                }

                Trader trader = new(id, name, imageLink, levels);
                traders.Add(trader);
            }

            _traders = traders;
        }
    }
}
