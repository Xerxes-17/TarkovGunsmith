using System.Globalization;
using RatStash;
using Newtonsoft.Json.Linq;
using WishGranterProto.ExtensionMethods;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Force.DeepCloner;
using WishGranter;

using OpenTelemetry.Resources;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using OpenTelemetry.Logs;
using System.Diagnostics;
using OpenTelemetry.Exporter;
using Honeycomb.OpenTelemetry;
using OpenTelemetry;

static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureLogging(logging =>
        {
            logging.ClearProviders();
            logging.AddConsole();
            logging.AddDebug();
            logging.AddEventSourceLogger();
        });

IHost host = CreateHostBuilder(args).Build();

var logger = host.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Host created.");
logger.LogInformation("Wishgranter-API is starting.");

// Need this to get Russian chars and symbols. This is here incase we don't load a localization correctly and need to read Russian names.
//CultureInfo ci = new CultureInfo("ru-RU");
//Console.OutputEncoding = System.Text.Encoding.Unicode;
//Console.WriteLine(ci.DisplayName + " - currency symbol: " + ci.NumberFormat.CurrencySymbol);
//? Goign to see if this is the cause of the logs on AWS being all single line

var watch = new Stopwatch();
watch.Start();

var DefaultPresestsJSON = WG_TarkovDevAPICalls.GetAllGunPresets();
var MarketDataJSON = WG_TarkovDevAPICalls.GetAllArmorAmmoMods();

// Noting how long the initial data pull takes
watch.Stop();
Console.WriteLine($"Obtaining TarkovDev data finished by {watch.ElapsedMilliseconds} ms.");

//! Compiling the marketData
//TODO If we move this into WG_Market, we can then setup a simple fetch method for other parts of the program to use, no need to share the List itself around, could also add a refresh method too as we will need later.
watch.Start();
logger.LogInformation("Compiling MarketData");
var MarketData = WG_Market.CompileMarketDataList(MarketDataJSON);
logger.LogInformation($"Number of Market Entries: {MarketData.Count}");
watch.Stop();
logger.LogInformation($"Compiling MarketData finished by {watch.ElapsedMilliseconds} ms.\n");

//using StreamWriter writetext = new("outputs\\MyMarketData.json"); // This is here as a debug/verify
//writetext.Write(JToken.Parse(JsonConvert.SerializeObject(MarketData)));
//writetext.Close();

//! Processing the Default Presets
watch.Start();
logger.LogInformation("Compiling default weapon presets");

AmmoInformationAuthority ammoInformationAuthority = new AmmoInformationAuthority();
ammoInformationAuthority.InitializeInstance();

var DefaultWeaponPresets = WG_Compilation.CompileDefaultPresets(DefaultPresestsJSON, RatStashSingleton.Instance.DB());

logger.LogInformation($"Number of presets: {DefaultWeaponPresets.Count}");
var SelectionWeaponPresets = WG_Output.WriteStockPresetList(DefaultWeaponPresets);
logger.LogInformation($"Number of SelectionWeaponPresets: {SelectionWeaponPresets.Count}");

watch.Stop();
logger.LogInformation($"Compiling default weapon presets finished by {watch.ElapsedMilliseconds} ms.\n");

var ArmorOptionsList = WG_Output.WriteArmorList(RatStashSingleton.Instance.DB());
var AmmoOptionsList = WG_Output.WriteAmmoList(RatStashSingleton.Instance.DB());

// Init the DataScience instance, get the big data table ready
WG_DataScience dataScience = new WG_DataScience();
dataScience.CreateAmmoEffectivenessCharts(RatStashSingleton.Instance.DB());

//! All the builder stuff
var builder = WebApplication.CreateBuilder(args);

// Define some important constants to initialize tracing with
//https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-7.0&tabs=windows#environment-variables
//? Use these for local dev
var honeycombServiceName = builder.Configuration["Honeycomb:ServiceName"];
var honeycombApiKey = builder.Configuration["Honeycomb:ApiKey_DEV"];

if (string.IsNullOrEmpty(honeycombApiKey))
{
    //? Use these for AWS deploys
    honeycombServiceName = Environment.GetEnvironmentVariable("ServiceName");
    honeycombApiKey = Environment.GetEnvironmentVariable("ApiKey_Honeycomb"); // this is in the AWS deploy plan
}

var serviceName = honeycombServiceName;

var serviceVersion = "1.0.0";
var appResourceBuilder = ResourceBuilder.CreateDefault()
.AddService(serviceName: serviceName, serviceVersion: serviceVersion);
var MyActivitySource = new ActivitySource(serviceName);

var options = new HoneycombOptions
{
    ServiceName = honeycombServiceName,
    ServiceVersion = "1.0.0",
    ApiKey = honeycombApiKey,
    ResourceBuilder = ResourceBuilder.CreateDefault()
    //.AddAttributes(
    //    new Dictionary<string, object>
    //    {
    //        {"custom-resource-attribute", "some-value"}
    //    })
};

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddHoneycomb(options)
    .Build();


startAPIAsync();

async Task startAPIAsync()
{
    const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    builder.Services.AddOpenTelemetry().WithTracing(tracerProviderBuilder =>
    {
        tracerProviderBuilder
            .AddConsoleExporter()
            .AddSource(MyActivitySource.Name)
            .SetResourceBuilder(appResourceBuilder)
            .AddHttpClientInstrumentation()
            .AddAspNetCoreInstrumentation()
            .AddSqlClientInstrumentation()
            .AddOtlpExporter(opt =>
            {
                opt.Endpoint = new Uri("https://api.honeycomb.io");
                opt.Headers = $"x-honeycomb-team={honeycombApiKey}";
                opt.Protocol = OtlpExportProtocol.HttpProtobuf;
            });
    });

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
    builder.Services.AddLogging();
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
        (int playerLevel, string mode, int muzzleMode, string presetID, int purchaseType)
        => getSingleWeaponBuild(playerLevel, mode, muzzleMode, presetID, purchaseType));

    //app.MapGet("/getWeaponOptionsByPlayerLevelAndNameFilter/{level}/{mode}/{muzzleMode}/{searchString}/{purchaseType}",
    //    (int level, string mode, int muzzleMode, string searchString, string purchaseType) 
    //    => getWeaponOptionsByPlayerLevelAndNameFilter_MK2(level, mode, muzzleMode, searchString, purchaseType));

    app.MapGet("/CalculateArmorVsBulletSeries/{armorId}/{startingDuraPerc}/{bulletId}",(string armorId, double startingDuraPerc, string bulletId) => CalculateArmorVsBulletSeries(armorId, bulletId, startingDuraPerc));

    app.MapGet("/CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{penetration}/{armorDamagePerc}/{damage}",(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc, int damage) => CalculateArmorVsBulletSeries_Custom(ac, maxDurability, startingDurabilityPerc, material, penetration, armorDamagePerc, damage));

    app.MapGet("/GetWeaponOptionsList", () => GetWeaponOptionsList());
    app.MapGet("/GetArmorOptionsList", () => GetArmorOptionsList());
    app.MapGet("/GetAmmoOptionsList", () => GetAmmoOptionsList());

    app.MapGet("/GetWeaponStatsCurve/{presetID}/{mode}/{muzzleMode}/{purchaseType}", (string presetID, string mode, int muzzleMode, int purchaseType) => GetWeaponStatsCurve(presetID, mode, muzzleMode, purchaseType));

    app.MapGet("/GetAmmoDataSheetData", () => GetAmmoDataSheetData());
    app.MapGet("/GetArmorDataSheetData", () => GetArmorDataSheetData());
    app.MapGet("/GetWeaponDataSheetData", () => GetWeaponsDataSheetData());

    app.MapGet("/GetArmorEffectivenessData/{armorId}", (string armorId) => GetEffectivenessDataForArmor(armorId));
    app.MapGet("/GetAmmoEffectivenessData/{ammoId}", (string ammoId) => GetEffectivenessDataForAmmo(ammoId));

    app.MapGet("/GetCondensedAmmoEffectivenessTable", () => GetCondensedAmmoEffectivenessTable());
    app.MapGet("/GetAmmoEffectivenessChartAtDistance/{distance}", (int distance) => GetAmmoEffectivenessChartAtDistance(distance));
    app.MapGet("/GetAmmoAuthorityData", () => GetAmmoAuthorityData());

    app.Run();
    await host.RunAsync();
}

List<SelectionWeapon> GetWeaponOptionsList()
{
    using var myActivity = MyActivitySource.StartActivity("Request for WeaponOptionList");
    return SelectionWeaponPresets;
}
List<SelectionArmor> GetArmorOptionsList()
{
    using var myActivity = MyActivitySource.StartActivity("Request for ArmorOptionList");
    return ArmorOptionsList;
}
List<SelectionAmmo> GetAmmoOptionsList()
{
    using var myActivity = MyActivitySource.StartActivity("Request for AmmoOptionList");
    return AmmoOptionsList;
}

string getSingleWeaponBuild(int playerLevel, string mode, int muzzleMode, string presetID, int purchaseType)
{


    // Get the WeaponPreset that the request wants, we clone it to ensure no original record contamination.
    WeaponPreset WantedPreset = DefaultWeaponPresets.Find(p => p.Id.Equals(presetID) && p.PurchaseOffer.OfferType.Equals((OfferType)purchaseType)).DeepClone();

    // Note in the console log the request.
    Console.WriteLine($"Request from MWB for single weapon: [{playerLevel}, {mode}, {muzzleMode}, {presetID} ({WantedPreset.Weapon.Name}), {purchaseType}]");

    using var myActivity = MyActivitySource.StartActivity("Request from MWB for single weapon");
    myActivity?.SetTag("playerLevel", playerLevel);
    myActivity?.SetTag("mode", mode);
    myActivity?.SetTag("muzzleMode", muzzleMode);
    myActivity?.SetTag("presetID", presetID);
    myActivity?.SetTag("weaponName", WantedPreset.Weapon.Name);
    myActivity?.SetTag("purchaseType", purchaseType);

    // Get all of the trader offers - It's in the main program space
    // No need now to make a mask as we only need to filter by player level and the transaction type now, neat!
    // We can then use these IDs with the RatStashSingleton.Instance.DB() to get appropriate Mods, Ammo, etc.
    List<MarketEntry> filteredMarketData = WG_Market.GetMarketDataFilteredByPlayerLeverl(playerLevel);

    // While I could combine these statements, it would be messy an unreadable. So first we get the list of IDs of weapon mods and ammo then we get lists of the mods and ammo from the RatStashSingleton.Instance.DB().
    List<string> SelectedIDs_Mods_Ammo = filteredMarketData.Select(x => x.Id).ToList();

    List<Type> TypeFilterList = new List<Type>()
    {
        typeof(Ammo), typeof(ThrowableWeapon), typeof(Armor), typeof(ChestRig)
        //todo add presets and weapons to the market data
        //, typeof(AssaultCarbine), typeof(AssaultRifle),
        //typeof(GrenadeLauncher),  typeof(Handgun),  typeof(Machinegun),  typeof(MarksmanRifle),
        // typeof(Revolver),  typeof(Shotgun),  typeof(Smg),  typeof(SniperRifle),  typeof(SpecialWeapon)
    };

    List<WeaponMod> AvailibleWeaponMods = RatStashSingleton.Instance.DB().GetItems(x => SelectedIDs_Mods_Ammo.Contains(x.Id) && !TypeFilterList.Contains(x.GetType())).Cast<WeaponMod>().ToList();

    // Get the ammo too and then filter it down to the caliber of the weapon
    List<Ammo> AvailableAmmoChoices= RatStashSingleton.Instance.DB().GetItems(x => SelectedIDs_Mods_Ammo.Contains(x.Id) && x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
    AvailableAmmoChoices = AvailableAmmoChoices.Where(x => x.Caliber.Equals(WantedPreset.Weapon.AmmoCaliber)).ToList();

    // We also need to add the mods that are in the preset to the availible mods, this is for cases where the preset is the only place where a mod can be purchased.
    List<WeaponMod> IncludedWithPresetMods = WG_Recursion.AccumulateMods(WantedPreset.Weapon.Slots);
    AvailibleWeaponMods.AddRange(IncludedWithPresetMods.Where(x => !AvailibleWeaponMods.Contains(x)));

    //! Filter out all of the WeaponMods which aren't of the allowed types, Incl' muzzle devices
    AvailibleWeaponMods = WG_Compilation.CompileFilteredModList(AvailibleWeaponMods, muzzleMode);

    // Next the MWL is made in relation to the current weapon, as we don't need to care about M4 parts when building an AK, Да? We then make a shortlist from the MWL.
    List<string> MasterWhiteList = WG_Recursion.CreateMasterWhiteListIds(WantedPreset.Weapon, AvailibleWeaponMods);
    List<WeaponMod> ShortList_WeaponMods = RatStashSingleton.Instance.DB().GetItems(x => MasterWhiteList.Contains(x.Id)).Cast<WeaponMod>().ToList();

    var AWM_Names = ShortList_WeaponMods.Select(x => x.Name).ToList();

    // Let's now fit the weapon and get the best penetrating ammo
    HashSet<string> CommonBlackListIDs = new();
    CompoundItem weapon_result = WG_Recursion.SMFS_Wrapper(WantedPreset.Weapon, ShortList_WeaponMods, mode, CommonBlackListIDs);

    var temp = AvailableAmmoChoices.Find(x => x.PenetrationPower == AvailableAmmoChoices.Max(y => y.PenetrationPower));
    Ammo ammo_result = new();
    if (temp != null)
    {
        ammo_result = temp;
    }

    //? A little check to see if a build is valid, to help with debugging and maintenance
    logger.LogInformation($"The build was valid: {WG_Recursion.CheckIfCompoundItemIsValid(weapon_result)}");
    myActivity?.SetTag("valid", WG_Recursion.CheckIfCompoundItemIsValid(weapon_result));

    // Setup the serialzier
    var options = new JsonSerializerSettings
    {
        Formatting = Formatting.Indented,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
    };

    var jsonString = JsonConvert.SerializeObject(WG_Output.CreateTransmissionWeaponListFromResultsTuple_Single((Weapon) weapon_result, ammo_result, preset: WantedPreset));

    return jsonString;
}

TransmissionArmorTestResult CalculateArmorVsBulletSeries(string armorID, string bulletID, double startingDuraPerc, float distance = 100)
{
    using var myActivity = MyActivitySource.StartActivity("Request for CalculateArmorVsBulletSeries");
    myActivity?.SetTag("armorID", armorID);
    myActivity?.SetTag("bulletID", bulletID);
    myActivity?.SetTag("startingDuraPerc", startingDuraPerc);

    var Bullet = RatStashSingleton.Instance.DB().GetItem(bulletID);

    TransmissionArmorTestResult result = new();

    ArmorItem armorItem = WG_Calculation.GetArmorItemFromRatstashByIdString(armorID, RatStashSingleton.Instance.DB());

    myActivity?.SetTag("bulletName", Bullet.ShortName);
    myActivity?.SetTag("armorName", armorItem.Name);

    return WG_Calculation.FindPenetrationChanceSeries(armorItem, (Ammo)Bullet, startingDuraPerc, distance);
}

TransmissionArmorTestResult CalculateArmorVsBulletSeries_Custom(int ac, double maxDurability, double startingDurabilityPerc, string material, int penetration, int armorDamagePerc, int damage)
{
    logger.LogInformation($"Request for ADC_Custom: [{ac}, {maxDurability}, {startingDurabilityPerc}, {material}, {penetration}, {armorDamagePerc}, {damage}]");

    using var myActivity = MyActivitySource.StartActivity("Request for ADC_Custom");
    myActivity?.SetTag("ac", ac);
    myActivity?.SetTag("maxDurability", maxDurability);
    myActivity?.SetTag("startingDurabilityPerc", startingDurabilityPerc);
    myActivity?.SetTag("material", material);
    myActivity?.SetTag("penetration", penetration);
    myActivity?.SetTag("armorDamagePerc", armorDamagePerc);
    myActivity?.SetTag("damage", damage);

    return WG_Calculation.FindPenetrationChanceSeries_Custom(ac, maxDurability, startingDurabilityPerc, material, penetration, armorDamagePerc, damage);
}

List<CurveDataPoint> GetWeaponStatsCurve(string presetID, string mode, int muzzleMode, int purchaseType)
{
    // Get the WeaponPreset that the request wants, we clone it to ensure no original record contamination.
    WeaponPreset WantedPreset = DefaultWeaponPresets.Find(p => p.Id.Equals(presetID) && p.PurchaseOffer.OfferType.Equals((OfferType)purchaseType)).DeepClone();

    logger.LogInformation($"Request for Stats curve of {WantedPreset.Weapon.Name}");
    using var myActivity = MyActivitySource.StartActivity("Request for Stats curve");
    myActivity?.SetTag("weaponName", WantedPreset.Weapon.Name);


    var result = dataScience.CreateListOfWeaponStats(WantedPreset, mode, muzzleMode, RatStashSingleton.Instance.DB());
    return result;
}

List<AmmoTableRow> GetAmmoDataSheetData()
{
    using var myActivity = MyActivitySource.StartActivity("Request for AmmoDataSheet");

    return WG_DataScience.CompileAmmoTable(RatStashSingleton.Instance.DB());
}
List<ArmorTableRow> GetArmorDataSheetData()
{
    using var myActivity = MyActivitySource.StartActivity("Request for ArmorDataSheet");
    return WG_DataScience.CompileArmorTable(RatStashSingleton.Instance.DB());
}

List<WeaponTableRow> GetWeaponsDataSheetData()
{
    using var myActivity = MyActivitySource.StartActivity("Request for WeaponsDataSheet");
    return WG_DataScience.CompileWeaponTable(DefaultWeaponPresets);
}

List<EffectivenessDataRow> GetEffectivenessDataForArmor(string armorID)
{
    using var myActivity = MyActivitySource.StartActivity("Request for Armor vs Ammo Data");
    myActivity?.SetTag("armorID", armorID);

    var armor = WG_Calculation.GetArmorItemFromRatstashByIdString(armorID, RatStashSingleton.Instance.DB());

    return WG_DataScience.CalculateArmorEffectivenessData(armor, RatStashSingleton.Instance.DB());
}

List<EffectivenessDataRow> GetEffectivenessDataForAmmo(string ammoID)
{
    using var myActivity = MyActivitySource.StartActivity("Request for Ammo vs Armor Data");
    myActivity?.SetTag("ammoID", ammoID);
    var ammo = (Ammo) RatStashSingleton.Instance.DB().GetItem(ammoID);

    return WG_DataScience.CalculateAmmoEffectivenessData(ammo, RatStashSingleton.Instance.DB());
}

List<CondensedDataRow> GetCondensedAmmoEffectivenessTable()
{
    using var myActivity = MyActivitySource.StartActivity("Request for Ammo Effectiveness Table");
    return dataScience.CreateCondensedAmmoEffectivenessTable(RatStashSingleton.Instance.DB());
}

List<CondensedDataRow> GetAmmoEffectivenessChartAtDistance(int distance)
{
    using var myActivity = MyActivitySource.StartActivity($"Request for Ammo Effectiveness Chart at Distance");
    myActivity?.SetTag("distance", distance);
    return dataScience.getAmmoEffectivenessChartForDistance(distance);
}

SortedDictionary<string, AmmoReccord> GetAmmoAuthorityData()
{
    using var myActivity = MyActivitySource.StartActivity($"Request for Ammo Reccords");
    return ammoInformationAuthority.AmmoReccords;
}