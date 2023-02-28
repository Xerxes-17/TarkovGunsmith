using System.Globalization;
using RatStash;
using Newtonsoft.Json.Linq;
using WishGranterProto.ExtensionMethods;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Force.DeepCloner;
using WishGranter;

Console.WriteLine("Wishgranter-API is starting.");

// Need this to get Russian chars and symbols. This is here incase we don't load a localization correctly and need to read Russian names.
//CultureInfo ci = new CultureInfo("ru-RU");
//Console.OutputEncoding = System.Text.Encoding.Unicode;
//Console.WriteLine(ci.DisplayName + " - currency symbol: " + ci.NumberFormat.CurrencySymbol);
//? Goign to see if this is the cause of the logs on AWS being all single line

var watch = new System.Diagnostics.Stopwatch();
watch.Start();

// This loads all of the weapons, mods and ammo from the items.json into a RatStashDB using the EN localization
Database RatStashDB = Database.FromFile("ratstash_jsons/items.json", false, "ratstash_jsons/en.json");
Console.WriteLine("RatStashDB started from file.");

var DefaultPresestsJSON = WG_TarkovDevAPICalls.GetAllGunPresets();
var MarketDataJSON = WG_TarkovDevAPICalls.GetAllArmorAmmoMods();

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
Console.WriteLine($"Number of SelectionWeaponPresets: {SelectionWeaponPresets.Count}");

watch.Stop();
Console.WriteLine($"Compiling default weapon presets finished by {watch.ElapsedMilliseconds} ms.\n");

var ArmorOptionsList = WG_Output.WriteArmorList(RatStashDB);
var AmmoOptionsList = WG_Output.WriteAmmoList(RatStashDB);

// Init the DataScience instance

WG_DataScience dataScience = new WG_DataScience();

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

string getSingleWeaponBuild(int playerLevel, string mode, int muzzleMode, string presetID, int purchaseType)
{
    // Get the WeaponPreset that the request wants, we clone it to ensure no original record contamination.
    WeaponPreset WantedPreset = DefaultWeaponPresets.Find(p => p.Id.Equals(presetID) && p.PurchaseOffer.OfferType.Equals((OfferType)purchaseType)).DeepClone();

    // Note in the console log the request.
    Console.WriteLine($"Request from MWB for single weapon: [{playerLevel}, {mode}, {muzzleMode}, {presetID} ({WantedPreset.Weapon.Name}), {purchaseType}]");

    // Get all of the trader offers - It's in the main program space
    // No need now to make a mask as we only need to filter by player level and the transaction type now, neat!
    // We can then use these IDs with the RatStashDB to get appropriate Mods, Ammo, etc.
    List<MarketEntry> filteredMarketData = WG_Market.GetMarketDataFilteredByPlayerLeverl(playerLevel);

    // While I could combine these statements, it would be messy an unreadable. So first we get the list of IDs of weapon mods and ammo then we get lists of the mods and ammo from the RatStashDB.
    List<string> SelectedIDs_Mods_Ammo = filteredMarketData.Select(x => x.Id).ToList();

    List<Type> TypeFilterList = new List<Type>()
    {
        typeof(Ammo), typeof(ThrowableWeapon), typeof(Armor), typeof(ChestRig)
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
    CompoundItem weapon_result = WG_Recursion.SMFS_Wrapper(WantedPreset.Weapon, ShortList_WeaponMods, mode, CommonBlackListIDs);

    var temp = AvailableAmmoChoices.Find(x => x.PenetrationPower == AvailableAmmoChoices.Max(y => y.PenetrationPower));
    Ammo ammo_result = new();
    if (temp != null)
    {
        ammo_result = temp;
    }


    //? A little check to see if a build is valid, to help with debugging and maintenance
    Console.WriteLine($"The build was valid: {WG_Recursion.CheckIfCompoundItemIsValid(weapon_result)}");

    // Setup the serialzier
    var options = new JsonSerializerSettings
    {
        Formatting = Formatting.Indented,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
    };

    var jsonString = JsonConvert.SerializeObject(WG_Output.CreateTransmissionWeaponListFromResultsTuple_Single((Weapon) weapon_result, ammo_result, preset: WantedPreset));

    return jsonString;
}

TransmissionArmorTestResult CalculateArmorVsBulletSeries(string armorID, string bulletID, double startingDuraPerc)
{
    Console.WriteLine($"Request for CalculateArmorVsBulletSeries");


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

    else if (Armor.GetType() == typeof(ArmoredEquipment))
    {
        var temp = (ArmoredEquipment)Armor;
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



List<CurveDataPoint> GetWeaponStatsCurve(string presetID, string mode, int muzzleMode, int purchaseType)
{
    // Get the WeaponPreset that the request wants, we clone it to ensure no original record contamination.
    WeaponPreset WantedPreset = DefaultWeaponPresets.Find(p => p.Id.Equals(presetID) && p.PurchaseOffer.OfferType.Equals((OfferType)purchaseType)).DeepClone();

    Console.WriteLine($"Request for Stats curve of {WantedPreset.Weapon.Name}");
    var result = dataScience.CreateListOfWeaponStats(WantedPreset, mode, muzzleMode, RatStashDB);
    return result;
}