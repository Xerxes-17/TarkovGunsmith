using System.Globalization;
using RatStash;
using Newtonsoft.Json.Linq;
using WishGranterProto.ExtensionMethods;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

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
Console.WriteLine("Wishgranter-API is starting.");

// Need this to get Russian chars and symbols.
CultureInfo ci = new CultureInfo("ru-RU");
Console.OutputEncoding = System.Text.Encoding.Unicode;
Console.WriteLine(ci.DisplayName + " - currency symbol: " + ci.NumberFormat.CurrencySymbol);

var watch = new System.Diagnostics.Stopwatch();
watch.Start();

//This loads all of the weapons, mods and ammo from the items.json into a RatStashDB using the EN localization and creates an IEnumerable of each category.
//These are the "master list".
Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
IEnumerable<Item> All_Weapons = RatStashDB.GetItems(m => m is Weapon);
IEnumerable<Item> All_Mods = RatStashDB.GetItems(m => m is WeaponMod);
IEnumerable<Item> All_Ammo = RatStashDB.GetItems(m => m is Ammo);
IEnumerable<Item> All_Armor = RatStashDB.GetItems(m => m is Armor);
IEnumerable<Item> All_Rigs = RatStashDB.GetItems(m => m is ChestRig);
Console.WriteLine("RatStashDB started from file.");

// Gets the basic weapon packages.
JObject DefaultPresetsJSON = TarkovDevQueryAsync("{ items(categoryNames: Weapon) { id name containsItems { item { id name } } } }", "DefaultPresets").Result; //! This needs to be replaced with bundles from the trader offers
Console.WriteLine("DefaultPresetsJSON returned.");

// Gets the quest unlock values.
JObject QuestUnlocksJSON = TarkovDevQueryAsync("{ tasks { name minPlayerLevel finishRewards{ offerUnlock{ trader { id name } level item { id name } } } } }", "QuestUnlocks").Result; //! This can probably be replaced with Trader offers
Console.WriteLine("QuestUnlocksJSON returned.");

// Gets the item offers from traders
JObject TraderOffersJSON = TarkovDevQueryAsync("{traders(lang:en){ id name levels{ id level requiredReputation requiredPlayerLevel cashOffers{ item{ id name } priceRUB currency price }}}}", "TraderOffers").Result;
Console.WriteLine("TraderOffersJSON returned.");

// Gets the flea market data
JObject FleaMarketJSON = TarkovDevQueryAsync("{ items(categoryNames: [Ammo, Weapon, WeaponMod]) { id name low24hPrice avg24hPrice buyFor{ vendor{ name } price currency priceRUB } } }", "FleaMarketData").Result; // This could also be condensed into the TraderOffers JSON
Console.WriteLine("FleaMarketJSON returned.");

// Gets the imagelinks for all of the items.
JObject ImageLinksJSON = TarkovDevQueryAsync("{ items(categoryNames: [WeaponMod, Weapon, Armor, ChestRig, Ammo]) { id name iconLink gridImageLink baseImageLink inspectImageLink image512pxLink image8xLink wikiLink properties{... on ItemPropertiesWeapon{defaultPreset{gridImageLink} } } } }", "ImageLinks").Result;

// Noting how long the initial data pull takes
watch.Stop();
Console.WriteLine($"Obtaining TarkovDev data finished in {watch.ElapsedMilliseconds} ms.");

//! Getting list of cash offers.
var CashOffers = WG_Compilation.MakeListOfCashOffers(TraderOffersJSON);

//! Processing the attachments to remove extraneous options
watch.Restart();
watch.Start();
Console.WriteLine("Compiling FilteredModsList");
var FilteredModsList = WG_Compilation.CompileFilteredModList(All_Mods.OfType<Item>().ToList(), 1);
Console.WriteLine($"Number of mods: {FilteredModsList.Count}");

//WG_Output.WriteOutputFileMods(FilteredModsList.OfType<WeaponMod>().ToList(), "FilteredModsList");

watch.Stop();
Console.WriteLine($"Compiling FilteredModsList finished in {watch.ElapsedMilliseconds} ms.");

string[] traderNames =
{
    "Prapor", "Therapist", "Fence", "Skier", "Peacekeeper","Mechanic", "Ragman", "Jaeger"
};

//! Processing the Default Presets
watch.Restart();
watch.Start();


Console.WriteLine("Compiling default weapon presets");

var DefaultWeaponPresets = WG_Compilation.CompileDefaultPresets(DefaultPresetsJSON, All_Weapons.OfType<Weapon>().ToList(), All_Mods.OfType<WeaponMod>().ToList());
Console.WriteLine($"Number of presets: {DefaultWeaponPresets.Count}");

WG_Output.WriteOutputFileWeapons(DefaultWeaponPresets, "DefaultPresets");

WG_Output.WriteStockPresetList(DefaultWeaponPresets, ImageLinksJSON);

watch.Stop();
Console.WriteLine($"Compiling default weapon presets finished in {watch.ElapsedMilliseconds} ms.\n");


startAPI();




void startAPI()
{
    const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
                          builder =>
                          {
                              builder.WithOrigins(
                                  "*"
                                  );
                          });
    });
    builder.Services.AddHealthChecks();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Tarkov-Gunsmith", Description = "Mod your guns, test your armor/ammo", Version = "v1" });
    });

    var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Tarkov-Gunsmith API V1");
    });

    app.UseCors(MyAllowSpecificOrigins);

    //app.UseHttpsRedirection();

    app.MapHealthChecks("/health");
    app.MapGet("/", () => "Hello World!");
    app.MapGet("/getWeaponOptionsByPlayerLevelAndNameFilter/{level}/{mode}/{muzzleMode}/{searchString}", (int level, string mode, int muzzleMode, string searchString) => getWeaponOptionsByPlayerLevelAndNameFilter(level, mode, muzzleMode, searchString));
    app.MapGet("/CalculateArmorVsBulletSeries_Name/{armorName}/{startingDuraPerc}/{bulletName}", (string armorName, double startingDuraPerc, string bulletName) => CalculateArmorVsBulletSeries_Name(armorName, bulletName, startingDuraPerc, ImageLinksJSON));

    app.Run();
}

//GetOptionsByPlayerLevel(43, "recoil");
//getWeaponOptionsByPlayerLevelAndNameFilter(43, "recoil", "5.56");

/// <summary>
/// This will take a given player level, and return a list of all guns and their best configuration for eitehr recoil or ergo
/// </summary>
/// <param name="level"> The player's level </param>
/// <param name="mode"> Goal of the fittings, can be "recoil" or "ergo" </param>
string GetOptionsByPlayerLevel(int level, string mode)
{
    //! Make the mask of trader item IDs
    var leveledTraderMask = WG_Compilation.MakeTraderMaskByPlayerLevel(level, traderNames.ToList(), TraderOffersJSON);

    //! Apply the mask of trader item IDs to the input lists
    var LeveledLists = WG_Compilation.GetMaskedTuple(leveledTraderMask, DefaultWeaponPresets, FilteredModsList.OfType<WeaponMod>().ToList(), All_Ammo.OfType<Ammo>().ToList());

    List<(Weapon, Ammo)> finalAnswer = new();

    foreach (var weapon in LeveledLists.Masked_Weapons)
    {
        var ids = WG_Recursion.CreateMasterWhiteListIds(weapon, LeveledLists.Masked_Mods.ToList());

        WG_Recursion.CreateHumanReadableMWL(ids, LeveledLists.Masked_Mods.OfType<WeaponMod>().ToList());

        var shortlistOfMods = WG_Recursion.CreateListOfModsFromIds(ids, LeveledLists.Masked_Mods.ToList());

        var afterblockers = WG_Recursion.ProcessBlockersInListOfMods(shortlistOfMods, weapon, mode);

        var result = WG_Compilation.CompileAWeapon(weapon, afterblockers, LeveledLists.Masked_Ammo, mode, "penetration", CashOffers);

        if (result.Item1 != null && result.Item2 != null)
        {
            finalAnswer.Add(result);
        }
    }

    WG_Output.WriteOutputFileForResultsTuple(finalAnswer, $"ex_TestResult{mode}Mode_PriceSorting_Method");

    var options = new JsonSerializerSettings
    {
        Formatting = Formatting.Indented,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
    };

    var jsonString = JsonConvert.SerializeObject(WG_Output.CreateTransmissionWeaponListFromResultsTupleList(finalAnswer, CashOffers), options);

    return jsonString;
}

string getWeaponOptionsByPlayerLevelAndNameFilter(int level, string mode, int muzzleMode, string searchString)
{
    Console.WriteLine($"Request for MWB: [{level}, {mode}, {muzzleMode}, {searchString}]");

    var WantedWeapons = DefaultWeaponPresets.Where(w => w.Id.Contains(searchString)).ToList();

    FilteredModsList = WG_Compilation.CompileFilteredModList(All_Mods.OfType<Item>().ToList(), muzzleMode);

    //! Make the mask of trader item IDs
    var leveledTraderMask = WG_Compilation.MakeTraderMaskByPlayerLevel(level, traderNames.ToList(), TraderOffersJSON);

    //! Apply the mask of trader item IDs to the input lists
    var LeveledLists = WG_Compilation.GetMaskedTuple(leveledTraderMask, WantedWeapons, FilteredModsList.OfType<WeaponMod>().ToList(), All_Ammo.OfType<Ammo>().ToList());

    List<(Weapon, Ammo)> finalAnswer = new();

    foreach (var weapon in LeveledLists.Masked_Weapons)
    {
        var ids = WG_Recursion.CreateMasterWhiteListIds(weapon, LeveledLists.Masked_Mods.ToList());

        WG_Recursion.CreateHumanReadableMWL(ids, LeveledLists.Masked_Mods.OfType<WeaponMod>().ToList());

        var shortlistOfMods = WG_Recursion.CreateListOfModsFromIds(ids, LeveledLists.Masked_Mods.ToList());

        var afterblockers = WG_Recursion.ProcessBlockersInListOfMods(shortlistOfMods, weapon, mode);

        var result = WG_Compilation.CompileAWeapon(weapon, afterblockers, LeveledLists.Masked_Ammo, mode, "penetration", CashOffers);

        if (result.Item1 != null && result.Item2 != null)
        {
            finalAnswer.Add(result);
        }
    }

    var options = new JsonSerializerSettings
    {
        Formatting = Formatting.Indented,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
    };

    var jsonString = JsonConvert.SerializeObject(WG_Output.CreateTransmissionWeaponListFromResultsTupleList(finalAnswer, CashOffers), options);

    return jsonString;
}


TransmissionArmorTestResult CalculateArmorVsBulletSeries(string armorID, string bulletID, double startingDuraPerc, JObject imageLinks)
{
    var Armor = RatStashDB.GetItem(armorID);
    var Bullet = RatStashDB.GetItem(bulletID);

    TransmissionArmorTestResult result = new();
    ArmorItem armorItem = new();

    // Need to cast the Item to respective types to get properties
    if (Armor.GetType() == typeof(Armor))
    {
        var temp = (Armor)Armor;
        armorItem.Name = temp.Name;
        armorItem.Id = temp.Id;
        armorItem.MaxDurability = temp.MaxDurability;
        armorItem.ArmorClass = temp.ArmorClass;
        armorItem.ArmorMaterial = temp.ArmorMaterial;
    }
    else if (Armor.GetType() == typeof(ChestRig))
    {
        var temp = (ChestRig)Armor;
        armorItem.Name = temp.Name;
        armorItem.Id = temp.Id;
        armorItem.MaxDurability = temp.MaxDurability;
        armorItem.ArmorClass = temp.ArmorClass;
        armorItem.ArmorMaterial = temp.ArmorMaterial;
    }

    return WG_Calculation.FindPenetrationChanceSeries(armorItem, (Ammo)Bullet, startingDuraPerc, imageLinks);
}

// Might need to make an IEnum list of armors and rigs with AC instead of allowing for search of any rig.
TransmissionArmorTestResult CalculateArmorVsBulletSeries_Name(string armorName, string bulletName, double startingDuraPerc, JObject imageLinks)
{
    Console.WriteLine($"Request for ADC: [{armorName}, {startingDuraPerc}, {bulletName}]");

    TransmissionArmorTestResult result = new();

    var armorSearchResult = RatStashDB.GetItem(item=> item.Name.Contains(armorName));
    var bulletSearchResult = RatStashDB.GetItem(item => item.Name.Contains(bulletName));

    if(armorSearchResult != null && bulletSearchResult != null)
    {
        result = CalculateArmorVsBulletSeries(armorSearchResult.Id, bulletSearchResult.Id, startingDuraPerc,  imageLinks);
    }

    return result;
}

