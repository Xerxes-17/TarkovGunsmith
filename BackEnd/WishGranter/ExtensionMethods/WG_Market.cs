using Newtonsoft.Json.Linq;

namespace WishGranterProto.ExtensionMethods
{
    // I plan to expand this later so that there is one reccord for all possible information of a given item, for now will work with just cash offers.
    public class MarketRecord
    {
        string Name { get; set; }  = string.Empty;
        string Id { get; set; } = string.Empty;
        int BasePrice { get; set; } = -1;
        bool CanBuyOnRagFair { get; set; } = false;
        List<TraderCashOffer> CashOffers { get; set; } = new();
    }

    public class TraderCashOffer
    {
        public string TraderName { get; set; } = string.Empty ;
        public int TraderLevel { get; set; } = -1;
        public int RequiredPlayerLevel { get; set; } = -1;

        public string ItemId { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;

        public int PriceInRUB { get; set; } = -1;

    }

    public class WG_Market
    {
        static Dictionary<string, int[]> LoyaltyLevelByPlayerLevel = new()
        {
            { "Prapor",         new[] { 1, 15, 26, 36 } },
            { "Skier",          new[] { 1, 15, 28, 38 } },
            { "Peacekeeper",    new[] { 1, 14, 23, 37 } },
            { "Mechanic",       new[] { 1, 20, 30, 40 } },
            { "Jaeger",         new[] { 1, 15, 22, 33 } }
        };

        static List<string> TraderNames = new()
        {
            "Prapor",
            "Skier",
            "Peacekeeper",
            "Mechanic",
            "Jaeger"
        };

        // Gets the item offers from traders
        static JObject TraderOffersJSON = TarkovDevQueryAsync("{traders(lang:en){ id name levels{ id level requiredReputation requiredPlayerLevel cashOffers{ item{ id name } priceRUB currency price }}}}", "TestingTraderOffers").Result;

        public static int GetCheapestCashOfferForItem(string id)
        {
            List<TraderCashOffer> NewList = GetAllCashOffers().Where(x => x.ItemId.Equals(id)).ToList();
            NewList.Sort((a, b) =>
            {
                if (a.PriceInRUB > b.PriceInRUB)
                {
                    return 1;
                }
                else if (a.PriceInRUB < b.PriceInRUB)
                {
                    return -1;
                }
                else
                {
                    return 0;
                }
            });
            return NewList[0].PriceInRUB;
        }

        public static int GetCheapestCashOfferForItemWithPlayerLevel(string id, int playerLevel)
        {
            List<TraderCashOffer> NewList = FilterTraderCashOffersByPlayerLevel(playerLevel);
            NewList = NewList.Where(x => x.ItemId.Equals(id)).ToList();
            NewList.Sort( (a,b) =>
            {
                if(a.PriceInRUB > b.PriceInRUB)
                {
                    return 1;
                }
                else if( a.PriceInRUB < b.PriceInRUB)
                {
                    return -1;
                }
                else
                {
                    return 0;
                }
            });
            return NewList[0].PriceInRUB;
        }

        public static List<TraderCashOffer> GetTraderCashOffersByItemId(string id)
        {
            List<TraderCashOffer> NewList = new();
            NewList.AddRange(GetAllCashOffers().Where(x => x.ItemId.Equals(id)));
            return NewList;
        }

        public static List<TraderCashOffer> FilterTraderCashOffersByPlayerLevel(int playerLevel)
        {
            List<TraderCashOffer> NewList = new();
            NewList.AddRange(GetAllCashOffers().Where(x => x.RequiredPlayerLevel <= playerLevel));
            return NewList;
        }

        public static List<TraderCashOffer> GetAllCashOffers()
        {
            TraderOffersJSON = TarkovDevQueryAsync("{traders(lang:en){ id name levels{ id level requiredReputation requiredPlayerLevel cashOffers{ item{ id name } priceRUB currency price }}}}", "TestingTraderOffers").Result;

            List<TraderCashOffer> outputList = new();

            foreach (var trader in LoyaltyLevelByPlayerLevel)
            {
                for (int i = 0; i < 4; i++)
                {
                    string searchJSONpath = $"$.data.traders.[?(@.name=='{trader.Key}')].levels.[?(@.level=={i+1})].cashOffers.[*]";
                    var filtering = TraderOffersJSON.SelectTokens(searchJSONpath).ToList();
                    foreach (var result in filtering)
                    {
                        TraderCashOffer temp = new TraderCashOffer();

                        string searchJSONpath_id = "$.item.id";
                        var id = result.SelectToken(searchJSONpath_id).ToString();
                        temp.ItemId = id;

                        string searchJSONpath_name = "$.item.name";
                        var name = result.SelectToken(searchJSONpath_name).ToString();
                        temp.ItemName = name;

                        string searchJSONpath_priceRUB = "$.priceRUB";
                        var priceRUB = result.SelectToken(searchJSONpath_priceRUB).ToString();
                        temp.PriceInRUB = int.Parse(priceRUB);

                        temp.TraderName = trader.Key;
                        temp.TraderLevel = i + 1;
                        temp.RequiredPlayerLevel = trader.Value[i];

                        outputList.Add(temp);
                    }
                }
            }
            return outputList;
        }

        static async Task<JObject> TarkovDevQueryAsync(string queryDetails, string filename)
        {
            JObject result;

            using (var httpClient = new HttpClient())
            {
                // This is the GraphQL query string
                var Query = new Dictionary<string, string>()
        {
            {"query", queryDetails }
        };

                // Http response message, the result of the query
                var httpResponse = await httpClient.PostAsJsonAsync("https://api.tarkov.dev/graphql", Query);

                // Response content
                var responseContent = await httpResponse.Content.ReadAsStringAsync();

                // Parse response content into a JObject.
                result = JObject.Parse(responseContent);

                // Save the result as a local JSON
                using StreamWriter writetext = new("TarkovDev_jsons\\" + filename + ".json"); // This is here as a debug/verify
                writetext.Write(result);
                writetext.Close();
            }
            return result;
        }

    };

       
}
