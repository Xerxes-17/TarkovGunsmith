using Newtonsoft.Json.Linq;

namespace WishGranter.Statics
{
    public static class TarkovDevAPI
    {
        private static async Task<JObject> TarkovDevQueryAsync(string queryDetails, string filename)
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
        // Get all of the gun presets with thier vendor information included
        public static JObject GetAllWeaponPresets()
        {
            // We get a big JSON from tarkov-dev which provides all of the info needed for constructing the weapon presests.
            JObject DefaultPresestsJSON = TarkovDevQueryAsync("{ items(type: gun) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } properties { ... on ItemPropertiesWeapon { presets { id name containsItems { item { id name } count } bartersFor{ trader{ name } level requiredItems{ quantity item{ id name buyFor{ priceRUB vendor{ name } } } } } buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } properties { ... on ItemPropertiesPreset { default } } } } } } }", "NewPresets").Result;

            Console.WriteLine("DefaultPresetsJSON returned.");

            return DefaultPresestsJSON;
        }
        public static JObject GetAllGunBaseStats()
        {
            // We get a big JSON from tarkov-dev which provides all of the info needed for constructing the weapon presests.
            JObject DefaultPresestsJSON = TarkovDevQueryAsync("{ items(types: [gun]) { id name properties { ... on ItemPropertiesWeapon { ergonomics recoilAngle recoilVertical recoilDispersion convergence } } } }", "GunStats").Result;

            Console.WriteLine("GunStatsJSON returned.");

            return DefaultPresestsJSON;
        }

        // Get all of the Ammo and Mods with thier vendor information included, for cash, barters and flea
        public static JObject GetAllAmmoAndMods()
        {
            // Get all of the offers for the Ammo and Mods.
            JObject MarketDataJSON = TarkovDevQueryAsync("{ items(types: [ ammo, mods ]) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } bartersFor { level requiredItems { quantity item { id name buyFor { priceRUB vendor { name } } } } trader{ name } } sellFor { priceRUB vendor { name } } } }", "MarketData_AmmoMods").Result;
            Console.WriteLine("MarketDataJSON returned.");
            return MarketDataJSON;
        }

        // Get all of the Armors, Ammo and Mods with thier vendor information included, for cash, barters and flea
        public static JObject GetAllArmorAmmoMods()
        {
            // Get all of the offers for the Ammo and Mods.
            JObject MarketDataJSON = TarkovDevQueryAsync("{ items(types: [ ammo, mods, armor ]) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } bartersFor { level requiredItems { quantity item { id name buyFor { priceRUB vendor { name } } } } trader{ name } } sellFor { priceRUB vendor { name } } } }", "MarketData_ArmorAmmoMods").Result;
            Console.WriteLine("MarketDataJSON returned.");
            return MarketDataJSON;
        }

        public static JObject GetAllMarketData()
        {
            // Get *all* of the offers for *any* item.
            JObject MarketDataJSON = TarkovDevQueryAsync("{ items(types: [ any ]) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } bartersFor { level requiredItems { quantity item { id name buyFor { priceRUB vendor { name } } } } trader{ name } } sellFor { priceRUB vendor { name } } } }", "MarketData_Any").Result;
            Console.WriteLine("MarketDataJSON returned.");
            return MarketDataJSON;
        }

        public static JObject GetFleaMarketData()
        {
            // Get all of the flea market offers for any item.
            JObject marketDataJSON = TarkovDevQueryAsync("{ items(types: [any]) { id name buyFor { price currency priceRUB vendor { name } } } }", "AllPurchaseOffers_Any").Result;
            Console.WriteLine("AllPurchaseOffers returned.");

            JArray itemsArray = marketDataJSON["data"]["items"] as JArray;

            var selectedItems = new JArray();

            foreach (var item in itemsArray)
            {
                var buyForArray = item["buyFor"] as JArray;

                var selectedBuyForArray = buyForArray.Where(buyFor => buyFor["vendor"]["name"].Value<string>() == "Flea Market").ToList();

                if (selectedBuyForArray.Count > 0)
                {
                    var selectedItem = new JObject(new JProperty("id", item["id"]), new JProperty("name", item["name"]), new JProperty("buyFor", new JArray(selectedBuyForArray)));
                    selectedItems.Add(selectedItem);
                }
            }

            JObject selectedObject = new JObject(new JProperty("data", new JObject(new JProperty("items", selectedItems))));

            return selectedObject;
        }
    }
}
