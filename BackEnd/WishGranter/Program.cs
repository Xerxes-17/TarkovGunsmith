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

// Need this to get Russian chars and symbols. This is here incase we don't load a localization correctly and need to read Russian names.
CultureInfo ci = new CultureInfo("ru-RU");
Console.OutputEncoding = System.Text.Encoding.Unicode;
Console.WriteLine(ci.DisplayName + " - currency symbol: " + ci.NumberFormat.CurrencySymbol);

var watch = new System.Diagnostics.Stopwatch();
watch.Start();

// This loads all of the weapons, mods and ammo from the items.json into a RatStashDB using the EN localization
Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
Console.WriteLine("RatStashDB started from file.");

// We get a big JSON from tarkov-dev which provides all of the info needed for constructing the weapon presests.
JObject DefaultPresestsJSON = TarkovDevQueryAsync("{ items(type: gun) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } properties { ... on ItemPropertiesWeapon { presets { id name containsItems { item { id name } count } bartersFor{ trader{ name } level requiredItems{ quantity item{ id name buyFor{ priceRUB vendor{ name } } } } } buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } properties { ... on ItemPropertiesPreset { default } } } } } } }", "NewPresets").Result;
Console.WriteLine("DefaultPresetsJSON returned.");

JObject MarketDataJSON = TarkovDevQueryAsync("{ items(types: [ ammo, mods ]) { id name buyFor { price currency priceRUB vendor { name ... on TraderOffer { minTraderLevel } } } bartersFor { level requiredItems { quantity item { id name buyFor { priceRUB vendor { name } } } } trader{ name } } sellFor { priceRUB vendor { name } } } }", "MarketData").Result;
Console.WriteLine("MarketDataJSON returned.");

// Noting how long the initial data pull takes
watch.Stop();
Console.WriteLine($"Obtaining TarkovDev data finished by {watch.ElapsedMilliseconds} ms.");

//! Compiling the marketData
//TODO If we move this into WG_Market, we can then setup a simple fetch method for other parts of the program to use, no need to share the List itself around, could also add a refresh method too as we will need later.
watch.Start();
Console.WriteLine("Compiling MarketData");
var MarketData = WG_Market.CompileMarketDataList(MarketDataJSON);
Console.WriteLine($"Number of Market Entries: {MarketData.Count}");
watch.Stop();
Console.WriteLine($"Compiling MarketData finished by {watch.ElapsedMilliseconds} ms.\n");

//using StreamWriter writetext = new("outputs\\MyMarketData.json"); // This is here as a debug/verify
//writetext.Write(JToken.Parse(JsonConvert.SerializeObject(MarketData)));
//writetext.Close();

//! Processing the Default Presets
watch.Start();
Console.WriteLine("Compiling default weapon presets");
var DefaultWeaponPresets = WG_Compilation.CompileDefaultPresets(DefaultPresestsJSON, RatStashDB);
Console.WriteLine($"Number of presets: {DefaultWeaponPresets.Count}");
var SelectionWeaponPresets = WG_Output.WriteStockPresetList(DefaultWeaponPresets);
watch.Stop();
Console.WriteLine($"Compiling default weapon presets finished by {watch.ElapsedMilliseconds} ms.\n");

var ArmorOptionsList = WG_Output.WriteArmorList(RatStashDB);
var AmmoOptionsList = WG_Output.WriteAmmoList(RatStashDB);



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

    app.MapGet("/getSingleWeaponBuild/{playerLevel}/{mode}/{muzzleMode}/{presetID}/{purchaseType}",
        (int playerLevel, string mode, int muzzleMode, string presetID, string purchaseType)
        => getSingleWeaponBuild(playerLevel, mode, muzzleMode, presetID, purchaseType));

    //app.MapGet("/getWeaponOptionsByPlayerLevelAndNameFilter/{level}/{mode}/{muzzleMode}/{searchString}/{purchaseType}",
    //    (int level, string mode, int muzzleMode, string searchString, string purchaseType) 
    //    => getWeaponOptionsByPlayerLevelAndNameFilter_MK2(level, mode, muzzleMode, searchString, purchaseType));

    app.MapGet("/CalculateArmorVsBulletSeries/{armorId}/{startingDuraPerc}/{bulletId}",(string armorId, double startingDuraPerc, string bulletId) => CalculateArmorVsBulletSeries(armorId, bulletId, startingDuraPerc));

    app.MapGet("/CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{penetration}/{armorDamagePerc}/{damage}",(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc, int damage) => CalculateArmorVsBulletSeries_Custom(ac, maxDurability, startingDurabilityPerc, material, penetration, armorDamagePerc, damage));

    app.MapGet("/GetWeaponOptionsList", () => GetWeaponOptionsList());
    app.MapGet("/GetArmorOptionsList", () => GetArmorOptionsList());
    app.MapGet("/GetAmmoOptionsList", () => GetAmmoOptionsList());

    app.Run();
}

List<SelectionWeapon> GetWeaponOptionsList()
{
    Console.WriteLine($"Request for WeaponOptionList");
    //return WG_Output.WriteStockPresetList(DefaultWeaponPresets);
    return SelectionWeaponPresets;
}
List<SelectionArmor> GetArmorOptionsList()
{
    Console.WriteLine($"Request for ArmorOptionList");
    return ArmorOptionsList;
}
List<SelectionAmmo> GetAmmoOptionsList()
{
    Console.WriteLine($"Request for AmmoOptionList");
    return AmmoOptionsList;
}


string getSingleWeaponBuild(int playerLevel, string mode, int muzzleMode, string presetID, string purchaseType)
{
    // Get the WeaponPreset that the request wants, we clone it to ensure no original record contamination.
    WeaponPreset WantedPreset = DefaultWeaponPresets.Find(p => p.Id.Equals(presetID) && p.PurchaseOffer.OfferType.Equals(purchaseType)).DeepClone();

    // Note in the console log the request.
    Console.WriteLine($"Request from MWB for single weapon: [{playerLevel}, {mode}, {muzzleMode}, {presetID} ({WantedPreset.Weapon.Name}), {purchaseType}]");

    // Get all of the trader offers - It's in the main program space
    // No need now to make a mask as we only need to filter by player level and the transaction type now, neat!
    // We can then use these IDs with the RatStashDB to get appropriate Mods, Ammo, etc.
    List<MarketEntry> filteredMarketData = MarketData.Where(x => x.PurchaseOffer.ReqPlayerLevel <= playerLevel && x.PurchaseOffer.OfferType.Equals("Cash")).ToList();

    // While I could combine these statements, it would be messy an unreadable. So first we get the list of IDs of weapon mods and ammo then we get lists of the mods and ammo from the RatStashDB.
    List<string> SelectedIDs_Mods_Ammo = filteredMarketData.Select(x => x.Id).ToList();

    List<Type> TypeFilterList = new List<Type>()
    {
        typeof(Ammo), typeof(ThrowableWeapon)
        //todo add presets and weapons to the market data
        //, typeof(AssaultCarbine), typeof(AssaultRifle),
        //typeof(GrenadeLauncher),  typeof(Handgun),  typeof(Machinegun),  typeof(MarksmanRifle),
        // typeof(Revolver),  typeof(Shotgun),  typeof(Smg),  typeof(SniperRifle),  typeof(SpecialWeapon)
    };

    List<WeaponMod> AvailibleWeaponMods = RatStashDB.GetItems(x => SelectedIDs_Mods_Ammo.Contains(x.Id) && !TypeFilterList.Contains(x.GetType())).Cast<WeaponMod>().ToList();

    // Get the ammo too and then filter it down to the caliber of the weapon
    List<Ammo> AvailableAmmoChoices= RatStashDB.GetItems(x => SelectedIDs_Mods_Ammo.Contains(x.Id) && x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
    AvailableAmmoChoices = AvailableAmmoChoices.Where(x => x.Caliber.Equals(WantedPreset.Weapon.AmmoCaliber)).ToList();

    // We also need to add the mods that are in the preset to the availible mods, this is for cases where the preset is the only place where a mod can be purchased.
    List<WeaponMod> IncludedWithPresetMods = WG_Recursion.AccumulateMods(WantedPreset.Weapon.Slots);
    AvailibleWeaponMods.AddRange(IncludedWithPresetMods.Where(x => !AvailibleWeaponMods.Contains(x)));

    //! Filter out all of the WeaponMods which aren't of the allowed types, Incl' muzzle devices
    AvailibleWeaponMods = WG_Compilation.CompileFilteredModList(AvailibleWeaponMods, muzzleMode);

    // Next the MWL is made in relation to the current weapon, as we don't need to care about M4 parts when building an AK, Да? We then make a shortlist from the MWL.
    List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(WantedPreset.Weapon, AvailibleWeaponMods);
    List<WeaponMod> ShortList_WeaponMods = RatStashDB.GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    // Let's now fit the weapon and get the best penetrating ammo
    HashSet<string> CommonBlackListIDs = new();
    var weapon_result = WG_Recursion.SMFS_Wrapper(WantedPreset.Weapon, ShortList_WeaponMods, mode, CommonBlackListIDs);
    var ammo_result = AvailableAmmoChoices.Find(x => x.PenetrationPower == AvailableAmmoChoices.Max(y => y.PenetrationPower));

    //? A little check to see if a build is valid, to ghelp with debugging and maintenance
    Console.WriteLine($"The build was valid: {WG_Recursion.CheckIfCompoundItemIsValid(weapon_result)}");

    // Setup the serialzier
    var options = new JsonSerializerSettings
    {
        Formatting = Formatting.Indented,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
    };

    var jsonString = JsonConvert.SerializeObject(WG_Output.CreateTransmissionWeaponListFromResultsTuple_Single(((Weapon) weapon_result, ammo_result), WantedPreset));

    return jsonString;
}

//string getWeaponOptionsByPlayerLevelAndNameFilter_MK2(int level, string mode, int muzzleMode, string searchString, string purchaseType)
//{
//    Console.WriteLine($"Request for MWB: [{level}, {mode}, {muzzleMode}, {searchString}]");

//    var WantedWeapons_MK2 = DefaultWeaponPresets.Where(p => p.Id.Equals(searchString) && p.PurchaseOffer.OfferType.Equals(purchaseType)).ToList();

//    var FilteredModsList = WG_Compilation.CompileFilteredModList(All_Mods.OfType<Item>().ToList(), muzzleMode);

//    //! Make the mask of trader item IDs
//    var leveledTraderMask = WG_Compilation.MakeTraderMaskByPlayerLevel(level, traderNames.ToList(), TraderOffersJSON);

//    //! Apply the mask of trader item IDs to the input lists
//    var LeveledLists = WG_Compilation.GetMaskedTuple(leveledTraderMask, WantedWeapons_MK2, FilteredModsList.OfType<WeaponMod>().ToList(), All_Ammo.OfType<Ammo>().ToList());

//    List<(WeaponPreset, Ammo)> finalAnswer = new();

//    foreach (var preset in LeveledLists.Masked_Weapons)
//    {
//        var ids = WG_Recursion.CreateMasterWhiteListIds(preset.Weapon, LeveledLists.Masked_Mods.ToList());

//        var readable = WG_Recursion.CreateHumanReadableMWL(ids, LeveledLists.Masked_Mods.OfType<WeaponMod>().ToList());

//        var shortlistOfMods = WG_Recursion.CreateListOfModsFromIds(ids, LeveledLists.Masked_Mods.ToList());

//        var afterblockers = WG_Recursion.ProcessBlockersInListOfMods(shortlistOfMods, preset.Weapon, mode);

//        var pre_result = WG_Compilation.CompileAWeapon(preset.Weapon, afterblockers, LeveledLists.Masked_Ammo, mode, "penetration", CashOffers);

//        //! Fix this stanky hack later
//        var result = (WantedWeapons_MK2[0].DeepClone(), pre_result.Item2);
//        result.Item1.Weapon = pre_result.Item1;

//        if (pre_result.Item1 != null && pre_result.Item2 != null)
//        {
//            finalAnswer.Add(result);
//        }
//    }

//    var options = new JsonSerializerSettings
//    {
//        Formatting = Formatting.Indented,
//        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
//    };

//    var jsonString = JsonConvert.SerializeObject(WG_Output.CreateTransmissionWeaponListFromResultsTupleList(finalAnswer, CashOffers), options);

//    return jsonString;
//}

TransmissionArmorTestResult CalculateArmorVsBulletSeries(string armorID, string bulletID, double startingDuraPerc)
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
        armorItem.ArmorType = "Armor";
        armorItem.BluntThroughput = temp.BluntThroughput;
    }
    else if (Armor.GetType() == typeof(ChestRig))
    {
        var temp = (ChestRig)Armor;
        armorItem.Name = temp.Name;
        armorItem.Id = temp.Id;
        armorItem.MaxDurability = temp.MaxDurability;
        armorItem.ArmorClass = temp.ArmorClass;
        armorItem.ArmorMaterial = temp.ArmorMaterial;
        armorItem.ArmorType = "Armor";
        armorItem.BluntThroughput = temp.BluntThroughput;
    }
    else if (Armor.GetType() == typeof(Headwear))
    {
        var temp = (Headwear)Armor;
        armorItem.Name = temp.Name;
        armorItem.Id = temp.Id;
        armorItem.MaxDurability = temp.MaxDurability;
        armorItem.ArmorClass = temp.ArmorClass;
        armorItem.ArmorMaterial = temp.ArmorMaterial;
        armorItem.ArmorType = "Helmet";
        armorItem.BluntThroughput = temp.BluntThroughput;
    }

    return WG_Calculation.FindPenetrationChanceSeries(armorItem, (Ammo)Bullet, startingDuraPerc);
}

TransmissionArmorTestResult CalculateArmorVsBulletSeries_Custom(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc, int damage)
{
    Console.WriteLine($"Request for ADC_Custom: [{ac}, {maxDurability}, {startingDurabilityPerc}, {material}, {penetration}, {armorDamagePerc}, {damage}]");

    return WG_Calculation.FindPenetrationChanceSeries_Custom(ac, maxDurability, startingDurabilityPerc, material, penetration, armorDamagePerc, damage);
}