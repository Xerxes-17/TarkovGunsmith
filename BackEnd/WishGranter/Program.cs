using Microsoft.OpenApi.Models;
using System.Text.Json;

using OpenTelemetry.Resources;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using OpenTelemetry.Logs;
using System.Diagnostics;
using OpenTelemetry.Exporter;
using Honeycomb.OpenTelemetry;
using OpenTelemetry;
using WishGranter.AmmoEffectivenessChart;
using WishGranter.Statics;
using WishGranter.API_Methods;

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

using var db = new Monolit();
Console.WriteLine($"Database path: {db.DbPath}.");

AEC AmmoEffectivenessChart = new AEC();
var jsonOptions = new JsonSerializerOptions
{
    WriteIndented = true
};
string jsonAmmoEffectivenessChart = System.Text.Json.JsonSerializer.Serialize(AmmoEffectivenessChart, jsonOptions);


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
};

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddHoneycomb(options)
    .Build();

await startAPIAsync();

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
                              builder.AllowAnyOrigin();
                              builder.AllowAnyHeader();
                              builder.AllowAnyMethod();
                          });
    });
    builder.Services.AddHealthChecks();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddLogging();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v3", new OpenApiInfo { Title = "Tarkov-Gunsmith", Description = "Mod your guns, test your armor/ammo", Version = "v3" });
    });

    var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v3/swagger.json", "Tarkov-Gunsmith API V3");
    });

    app.UseCors(MyAllowSpecificOrigins);


    //! ******* Basics *******
    app.MapHealthChecks("/health");
    app.MapGet("/", () => "Hello World! I use Swagger btw.");

    app.MapGet("/GetArmorOptionsList", () => API_Basics.GetArmorOptionsList(MyActivitySource));
    app.MapGet("/GetAmmoOptionsList", () => API_Basics.GetAmmoOptionsList(MyActivitySource));
    app.MapGet("/GetWeaponOptionsList", () => API_Basics.GetWeaponOptionsList(MyActivitySource));

    app.MapGet("/GetWeaponDataSheetData", () => API_Basics.GetWeaponsDataSheet(MyActivitySource));
    app.MapGet("/GetAmmoDataSheetData", () => API_Basics.GetAmmoDataSheet(MyActivitySource));

    app.MapGet("/GetArmorModulesData", () => API_Basics.GetArmorModulesDataSheet(MyActivitySource));
    app.MapGet("/GetArmorDataSheetData", () => API_Basics.GetArmorDataSheet(MyActivitySource));
    app.MapGet("/GetHelmetsDataSheetData", () => API_Basics.GetHelmetsDataSheet(MyActivitySource));
    app.MapGet("/GetGetNewArmorStatSheetData", () => API_Basics.GetNewArmorStatSheet(MyActivitySource));



    //! ******* TBS *******
    app.MapGet("/CalculateArmorVsBulletSeries/{armorId}/{startingDuraPerc}/{bulletId}", (string armorId, float startingDuraPerc, string bulletId) =>
        API_TBS.CalculateArmorVsBulletSeries(MyActivitySource, armorId, bulletId, startingDuraPerc));

    //todo Need to make this take parameter object because lmao
    app.MapGet("/CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{bluntThroughput}/{penetration}/{armorDamagePerc}/{damage}/{targetZone}",
        (int ac, float maxDurability, float startingDurabilityPerc, float bluntThroughput, string material, int penetration, int armorDamagePerc, int damage, string targetZone) =>
        API_TBS.CalculateArmorVsBulletSeries_Custom(MyActivitySource, ac, maxDurability, startingDurabilityPerc, bluntThroughput, material, penetration, armorDamagePerc, damage, targetZone));


    //! ******* Ballistic Simulator *******
    app.MapPost("/GetSingleShotBallisticSimulation",
        async context =>
        {
            using var reader = new StreamReader(context.Request.Body);
            var json = await reader.ReadToEndAsync();
            var requestData = JsonSerializer.Deserialize<BallisticSimParameters>(json);
            var result = API_BallisticSimulator.SingleShotSimulation(MyActivitySource, requestData);

            context.Response.StatusCode = StatusCodes.Status200OK;

            await context.Response.WriteAsync(JsonSerializer.Serialize(result));
        });

    app.MapPost("/GetMultiShotBallisticSimulation",
    async context =>
    {
        using var reader = new StreamReader(context.Request.Body);
        var json = await reader.ReadToEndAsync();
        var requestData = JsonSerializer.Deserialize<BallisticSimParametersV2>(json);
        var result = API_BallisticSimulator.MultiShotSimulation(MyActivitySource, requestData);

        context.Response.StatusCode = StatusCodes.Status200OK;

        await context.Response.WriteAsync(JsonSerializer.Serialize(result));
    });

    //! ******* AEC *******
    //app.MapGet("/GetAmmoEffectivenessChart", () => API_AEC.GetAmmoEffectivenessChart(MyActivitySource)).Produces<AEC>();
    //app.MapPut("/UpdateAmmoRatingsInAEC", () => API_AEC.UpdateRatingsAEC(MyActivitySource));
    //app.MapGet("/GetTimestampAEC", () => API_AEC.GetTimestampAEC());

    //app.MapGet("/GetArmorVsAmmo/{armorId}", (string armorId) => API_AEC.GetArmorVsArmmo(MyActivitySource, armorId));
    //app.MapGet("/GetAmmoVsArmor/{ammoId}", (string ammoId) => API_AEC.GetAmmoVsArmor(MyActivitySource, ammoId));

    //! ******* Gunsmith *******
    app.MapPost("/getSingleWeaponBuild",
        async context =>
        {
            using var reader = new StreamReader(context.Request.Body);
            var json = await reader.ReadToEndAsync();
            var requestData = JsonSerializer.Deserialize<WeaponBuildRequest>(json);
            var result = API_Gunsmith.GetSingleWeaponBuild(
            MyActivitySource,
            requestData.PresetId,
            requestData.Priority,
            requestData.MuzzleMode,
            requestData.PlayerLevel,
            requestData.Flea,
            requestData.ExcludedIds);

            context.Response.StatusCode = StatusCodes.Status200OK;

            await context.Response.WriteAsync(JsonSerializer.Serialize(result));
        });

    //app.MapGet("/GetWeaponStatsCurve/{presetID}/{mode}/{muzzleMode}/{flea}",
    //    (string presetID, string mode, string muzzleMode, bool flea) 
    //    => API_Gunsmith.GetWeaponStatsCurve(MyActivitySource, presetID, mode, muzzleMode, flea));

    app.Run();
    await host.RunAsync();
}
