using System.Globalization;
using RatStash;
using Newtonsoft.Json.Linq;
using WishGranterProto.ExtensionMethods;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Force.DeepCloner;

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
Console.WriteLine("RatStashDB started from file.");

// Gets the basic weapon packages.
JObject DefaultPresetsJSON = TarkovDevQueryAsync("{ items(categoryNames: Weapon) { id name containsItems { item { id name } } } }", "DefaultPresets").Result; //! This needs to be replaced with bundles from the trader offers


JObject DefaultPresestsJSON_MK2 = TarkovDevQueryAsync("{ items(type: gun) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } properties { ... on ItemPropertiesWeapon { presets { id name containsItems { item { id name } count } bartersFor{ trader{ name } level requiredItems{ quantity item{ id name buyFor{ priceRUB vendor{ name } } } } } buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } properties { ... on ItemPropertiesPreset { default } } } } } } }", "NewPresets").Result;
Console.WriteLine("DefaultPresetsJSON returned.");

// Gets the quest unlock values.
//JObject QuestUnlocksJSON = TarkovDevQueryAsync("{ tasks { name minPlayerLevel finishRewards{ offerUnlock{ trader { id name } level item { id name } } } } }", "QuestUnlocks").Result; //! This can probably be replaced with Trader offers
//Console.WriteLine("QuestUnlocksJSON returned.");

// Gets the item offers from traders
JObject TraderOffersJSON = TarkovDevQueryAsync("{traders(lang:en){ id name levels{ id level requiredReputation requiredPlayerLevel cashOffers{ item{ id name } priceRUB currency price }}}}", "TraderOffers").Result;
Console.WriteLine("TraderOffersJSON returned.");

// Gets the flea market data
//JObject FleaMarketJSON = TarkovDevQueryAsync("{ items(categoryNames: [Ammo, Weapon, WeaponMod]) { id name low24hPrice avg24hPrice buyFor{ vendor{ name } price currency priceRUB } } }", "FleaMarketData").Result; // This could also be condensed into the TraderOffers JSON
//Console.WriteLine("FleaMarketJSON returned.");

// Gets the imagelinks for all of the items.
//! This soon won't be needed.
JObject ImageLinksJSON = TarkovDevQueryAsync("{ items(categoryNames: [WeaponMod, Weapon, Armor, ChestRig, Ammo]) { id name iconLink gridImageLink baseImageLink inspectImageLink image512pxLink image8xLink wikiLink properties{... on ItemPropertiesWeapon{defaultPreset{gridImageLink} } } } }", "ImageLinks").Result;

// Noting how long the initial data pull takes
watch.Stop();
Console.WriteLine($"Obtaining TarkovDev data finished in {watch.ElapsedMilliseconds} ms.");

//! Getting list of cash offers.
var CashOffers = WG_Compilation.MakeListOfCashOffers(TraderOffersJSON);

string[] traderNames =
{
    "Prapor", "Skier", "Peacekeeper","Mechanic", "Jaeger"
};

//! Processing the Default Presets
watch.Start();

Console.WriteLine("Compiling default weapon presets");
var DefaultWeaponPresets = WG_Compilation.CompileDefaultPresets(DefaultPresetsJSON, All_Weapons.OfType<Weapon>().ToList(), All_Mods.OfType<WeaponMod>().ToList());

var DefaultWeaponPresets2 = WG_Compilation.CompileDefaultPresets_MK2(DefaultPresestsJSON_MK2, RatStashDB);

Console.WriteLine($"Number of presets: {DefaultWeaponPresets.Count}");
Console.WriteLine($"Number of presets2: {DefaultWeaponPresets2.Count}");

WG_Output.WriteStockPresetList_MK2(DefaultWeaponPresets2, ImageLinksJSON);

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
    app.MapGet("/", () => "Hello World! I use Swagger btw.");
    app.MapGet("/getWeaponOptionsByPlayerLevelAndNameFilter/{level}/{mode}/{muzzleMode}/{searchString}/{purchaseType}", (int level, string mode, int muzzleMode, string searchString, string purchaseType) => getWeaponOptionsByPlayerLevelAndNameFilter_MK2(level, mode, muzzleMode, searchString, purchaseType));
    app.MapGet("/CalculateArmorVsBulletSeries/{armorId}/{startingDuraPerc}/{bulletId}", (string armorId, double startingDuraPerc, string bulletId) => CalculateArmorVsBulletSeries(armorId, bulletId, startingDuraPerc, ImageLinksJSON));
    app.MapGet("/CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{penetration}/{armorDamagePerc}",
        (int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc) =>
        CalculateArmorVsBulletSeries_Custom(ac, maxDurability, startingDurabilityPerc, material, penetration, armorDamagePerc));

    app.MapGet("/GetWeaponOptionsList", () => GetWeaponOptionsList());
    app.MapGet("/GetArmorOptionsList", () => GetArmorOptionsList());
    app.MapGet("/GetAmmoOptionsList", () => GetAmmoOptionsList());

    app.Run();
}

//GetOptionsByPlayerLevel(43, "recoil");
//getWeaponOptionsByPlayerLevelAndNameFilter(43, "recoil", "5.56");

/// <summary>
/// This will take a given player level, and return a list of all guns and their best configuration for eitehr recoil or ergo
/// </summary>
/// <param name="level"> The player's level </param>
/// <param name="mode"> Goal of the fittings, can be "recoil" or "ergo" </param>
/// 
List<SelectionWeapon> GetWeaponOptionsList()
{
    Console.WriteLine($"Request for WeaponOptionList");
    //return WG_Output.WriteStockPresetList(DefaultWeaponPresets, ImageLinksJSON);
    return WG_Output.WriteStockPresetList_MK2(DefaultWeaponPresets2, ImageLinksJSON);
}

List<SelectionArmor> GetArmorOptionsList()
{
    Console.WriteLine($"Request for ArmorOptionList");
    return WG_Output.WriteArmorList(RatStashDB);
}
List<SelectionAmmo> GetAmmoOptionsList()
{
    Console.WriteLine($"Request for AmmoOptionList");
    return WG_Output.WriteAmmoList(RatStashDB);
}

string getWeaponOptionsByPlayerLevelAndNameFilter_MK2(int level, string mode, int muzzleMode, string searchString, string purchaseType)
{
    Console.WriteLine($"Request for MWB: [{level}, {mode}, {muzzleMode}, {searchString}]");

    var WantedWeapons_MK2 = DefaultWeaponPresets2.Where(p => p.Id.Equals(searchString) && p.PurchaseOffer.OfferType.Equals(purchaseType)).ToList();

    var FilteredModsList = WG_Compilation.CompileFilteredModList(All_Mods.OfType<Item>().ToList(), muzzleMode);

    //! Make the mask of trader item IDs
    var leveledTraderMask = WG_Compilation.MakeTraderMaskByPlayerLevel(level, traderNames.ToList(), TraderOffersJSON);

    //! Apply the mask of trader item IDs to the input lists
    var LeveledLists = WG_Compilation.GetMaskedTuple(leveledTraderMask, WantedWeapons_MK2, FilteredModsList.OfType<WeaponMod>().ToList(), All_Ammo.OfType<Ammo>().ToList());

    List<(WeaponPreset, Ammo)> finalAnswer = new();

    foreach (var preset in LeveledLists.Masked_Weapons)
    {
        var ids = WG_Recursion.CreateMasterWhiteListIds(preset.Weapon, LeveledLists.Masked_Mods.ToList());

        var readable = WG_Recursion.CreateHumanReadableMWL(ids, LeveledLists.Masked_Mods.OfType<WeaponMod>().ToList());

        var shortlistOfMods = WG_Recursion.CreateListOfModsFromIds(ids, LeveledLists.Masked_Mods.ToList());

        var afterblockers = WG_Recursion.ProcessBlockersInListOfMods(shortlistOfMods, preset.Weapon, mode);

        var pre_result = WG_Compilation.CompileAWeapon(preset.Weapon, afterblockers, LeveledLists.Masked_Ammo, mode, "penetration", CashOffers);

        //! Fix this stanky hack later
        var result = (WantedWeapons_MK2[0].DeepClone(), pre_result.Item2);
        result.Item1.Weapon = pre_result.Item1;

        if (pre_result.Item1 != null && pre_result.Item2 != null)
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


string getWeaponOptionsByPlayerLevelAndNameFilter(int level, string mode, int muzzleMode, string searchString)
{
    Console.WriteLine($"Request for MWB: [{level}, {mode}, {muzzleMode}, {searchString}]");

    var WantedWeapons = DefaultWeaponPresets.Where(w => w.Id.Contains(searchString)).ToList();

    var FilteredModsList = WG_Compilation.CompileFilteredModList(All_Mods.OfType<Item>().ToList(), muzzleMode);

    //! Make the mask of trader item IDs
    var leveledTraderMask = WG_Compilation.MakeTraderMaskByPlayerLevel(level, traderNames.ToList(), TraderOffersJSON);

    //! Apply the mask of trader item IDs to the input lists
    var LeveledLists = WG_Compilation.GetMaskedTuple(leveledTraderMask, WantedWeapons, FilteredModsList.OfType<WeaponMod>().ToList(), All_Ammo.OfType<Ammo>().ToList());

    List<(Weapon, Ammo)> finalAnswer = new();

    foreach (var weapon in LeveledLists.Masked_Weapons)
    {
        var ids = WG_Recursion.CreateMasterWhiteListIds(weapon, LeveledLists.Masked_Mods.ToList());

        var readable = WG_Recursion.CreateHumanReadableMWL(ids, LeveledLists.Masked_Mods.OfType<WeaponMod>().ToList());

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
    else if (Armor.GetType() == typeof(Headwear))
    {
        var temp = (Headwear)Armor;
        armorItem.Name = temp.Name;
        armorItem.Id = temp.Id;
        armorItem.MaxDurability = temp.MaxDurability;
        armorItem.ArmorClass = temp.ArmorClass;
        armorItem.ArmorMaterial = temp.ArmorMaterial;
    }

    return WG_Calculation.FindPenetrationChanceSeries(armorItem, (Ammo)Bullet, startingDuraPerc, imageLinks);
}

TransmissionArmorTestResult CalculateArmorVsBulletSeries_Custom(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc)
{
    Console.WriteLine($"Request for ADC_Custom: [{ac}, {maxDurability}, {startingDurabilityPerc}, {material}, {penetration}, {armorDamagePerc}]");

    return WG_Calculation.FindPenetrationChanceSeries_Custom(ac, maxDurability, startingDurabilityPerc, material, penetration, armorDamagePerc);
}