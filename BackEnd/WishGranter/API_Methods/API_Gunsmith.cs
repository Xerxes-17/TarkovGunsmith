using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Diagnostics;
using WishGranter.Statics;
using WishGranterProto.ExtensionMethods;

namespace WishGranter.API_Methods
{
    public static class API_Gunsmith
    {
        //TODO make this actually use the Fittings DB context and draw from there. Set it up so that it checkes for a saved option and if null produces and saves it.
        //todo This will let me skip past the "big DB update issue" for the moment.
        public static string GetSingleWeaponBuild(ActivitySource myActivitySource, string presetID, string priority, string muzzleMode, int playerLevel, bool fleaMarket)
        {
            Monolit db = new();

            GunsmithParameters parameters = new GunsmithParameters(
                (FittingPriority)Enum.Parse(typeof(FittingPriority), priority),
                (MuzzleType)Enum.Parse(typeof(MuzzleType), muzzleMode),
                playerLevel,
                fleaMarket
                );

            BasePreset basePreset = ModsWeaponsPresets.BasePresets.FirstOrDefault(x=>x.Id == presetID);

            using var myActivity = myActivitySource.StartActivity("Request from MWB for single weapon");
            myActivity?.SetTag("presetID", presetID);
            myActivity?.SetTag("priority", priority);
            myActivity?.SetTag("muzzleMode", muzzleMode);
            myActivity?.SetTag("playerLevel", playerLevel);
            myActivity?.SetTag("weaponName", basePreset.Weapon.Name);
            myActivity?.SetTag("fleaMarket", fleaMarket);
            Console.WriteLine($"Request to Gunsmith for single weapon: [{presetID}, {priority}, {muzzleMode}, {playerLevel} ({fleaMarket})]");

            GunsmithParameters fromDbParameters = GunsmithParameters.GetGunsmithParametersFromDB(parameters, db);
            Fitting theFitting = db.Fittings.FirstOrDefault(fitting => fitting.BasePresetId == presetID && fromDbParameters.Id == fitting.GunsmithParametersId);

            if(theFitting == null)
            {
                theFitting = new Fitting(basePreset, fromDbParameters, db);
                //todo Add the save it to the DB
            }

            myActivity?.SetTag("valid", theFitting.IsValid);
            myActivity?.SetTag("validityString", theFitting.ValidityString);

            // Setup the serialzier
            var options = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
            };

            var jsonString = JsonConvert.SerializeObject(theFitting);

            return jsonString;
        }
        /// <summary> Provides the stats curve of the provided weapon.</summary>
        public static List<CurveDataPoint> GetWeaponStatsCurve(ActivitySource myActivitySource, string presetId, string priority, string muzzleMode, bool flea)
        {
            using var myActivity = myActivitySource.StartActivity("Request for Stats curve");
            myActivity?.SetTag("presetID", presetId);

            var basePreset = ModsWeaponsPresets.BasePresets.Find(x => x.Id == presetId);
            var minPurchaseLevel = basePreset.PurchaseOffer.ReqPlayerLevel;

            Monolit db = new();
            var fittings = db.Fittings.Where(fitting =>
                fitting.BasePresetId == presetId && 
                fitting.GunsmithParameters.priority == (FittingPriority)Enum.Parse(typeof(FittingPriority), priority) &&
                fitting.GunsmithParameters.muzzleType == (MuzzleType)Enum.Parse(typeof(MuzzleType), muzzleMode) &&
                fitting.GunsmithParameters.fleaMarket == flea
            ).ToList();

            var dataCurve = new List<CurveDataPoint>();
            foreach (var fitting in fittings)
            {
                CurveDataPoint dataPoint = new CurveDataPoint();
                dataPoint.level = fitting.GunsmithParameters.playerLevel;
                dataPoint.recoil = fitting.Recoil_Vertical;
                dataPoint.ergo = fitting.Ergonomics;
                dataPoint.price = fitting.TotalRubleCost;
                dataPoint.penetration = fitting.PurchasedAmmo.Ammo.PenetrationPower;
                dataPoint.damage = fitting.PurchasedAmmo.Ammo.Damage; //todo This probably doesn't work for multi-shot, fix it.
                dataPoint.invalid = !fitting.IsValid;
            }

            return dataCurve;
        }
    }
}
