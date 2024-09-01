using Newtonsoft.Json.Linq;

namespace WishGranter.Concerns.API
{
    public class NewTarkovDevApi
    {
        /// <summary>
        /// Send a query to TarkovDev's GraphQL endpoint, with error handling done for you.
        /// </summary>
        /// <param name="queryString">Query string in GraphQL format.</param>
        /// <param name="queryName">The name of the query, also used as backup filename.</param>
        /// <returns>JObject of the query response data.</returns>
        private static async Task<JObject> RobustTarkovDevQueryAsync(string queryString, string queryName)
        {
            // Use a relative path assuming the application starts in the project root
            string relativePath = "TarkovDev_jsons\\" + queryName + ".json";

            // Full path for logging purposes
            string fullPath = Path.GetFullPath(relativePath);

            try
            {
                JObject result;
                using (var httpClient = new HttpClient())
                {
                    // This is the GraphQL query string
                    var Query = new Dictionary<string, string>()
                    {
                        {"query", queryString }
                    };

                    Console.WriteLine($"Sending request {queryName} to TarkovDevApi...");

                    // Http response message, the result of the query
                    var httpResponse = await httpClient.PostAsJsonAsync("https://api.tarkov.dev/graphql", Query);

                    // Response content
                    var responseContent = await httpResponse.Content.ReadAsStringAsync();

                    // Parse response content into a JObject.
                    result = JObject.Parse(responseContent);
                    Console.WriteLine($"Response received & parsed {queryName} from TarkovDevApi.");

                    // Save the result as a local JSON
                    using StreamWriter writetext = new(fullPath);
                    writetext.Write(result);
                    writetext.Close();

                    Console.WriteLine($"Fallback file '{fullPath}' written.");

                    return result;
                }
            }
            catch (Exception ex)
            {
                // Log the exception message
                Console.WriteLine($"An error occurred while fetching & parsing {queryName}: {ex.Message}");

                try
                {
                    // Read the JSON content from the relative file path
                    string localJsonContent = File.ReadAllText(relativePath);
                    JObject localPresetsJSON = JObject.Parse(localJsonContent);

                    Console.WriteLine($"Fallback file '{fullPath}' loaded successfully.");

                    return localPresetsJSON;
                }

                catch (Exception fileEx)
                {
                    // Log the exception message related to reading the file
                    Console.WriteLine($"Fallback file '{fullPath}' failed to load: {fileEx.Message}");

                    // Return an empty JObject as a last resort
                    return new JObject();
                }

            }
        }

        /// <summary>
        /// Fetch the trader details: id, name, imageLink, levels:{level, requiredPlayerLevel, requiredReputation, requiredCommerce}
        /// </summary>
        public static async Task<JObject> RobustGetTraderBaseInfo()
        {
            string queryString = "{ traders { id name imageLink levels { level requiredPlayerLevel requiredReputation requiredCommerce } } }";
            string queryName = "traderBaseInfo";

            JObject result = await RobustTarkovDevQueryAsync(queryString, queryName);
            return result;
        }

        /// <summary>
        /// Fetch the cash offers of all traders.
        /// </summary>
        public static async Task<JObject> RobustGetTraderCashOffers()
        {
            string queryString = "{ traders { id cashOffers { item { id name } priceRUB price currency buyLimit minTraderLevel taskUnlock { id trader{ id name } name minPlayerLevel name wikiLink } } } }";
            string queryName = "traderCashOffers";

            JObject result = await RobustTarkovDevQueryAsync(queryString, queryName);
            return result;
        }

        /// <summary>
        /// Fetch the barter offers of all traders.
        /// </summary>
        public static async Task<JObject> RobustGetTraderBarterOffers()
        {
            string queryString = "{ traders { id barters { id level buyLimit taskUnlock { id trader{ id name } name minPlayerLevel name wikiLink } requiredItems { item { id name } count quantity } rewardItems { item { id name } count quantity } } } }";
            string queryName = "traderBarterOffers";

            JObject result = await RobustTarkovDevQueryAsync(queryString, queryName);
            return result;
        }

        /// <summary>
        /// Fetch the flea market offers of all items.
        /// </summary>
        public static async Task<JObject> RobustGetFleaMarketOffers()
        {
            string queryString = "{ items { id name basePrice avg24hPrice lastLowPrice low24hPrice high24hPrice lastOfferCount changeLast48h } }";
            string queryName = "fleaPrices";

            JObject result = await RobustTarkovDevQueryAsync(queryString, queryName);
            return result;
        }


    }
}
