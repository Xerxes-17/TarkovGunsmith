using WishGranterProto.ExtensionMethods;
using RatStash;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using WishGranter.Statics;
using System.Diagnostics;
using WishGranterProto;
using static WishGranter.Statics.DopeTable;

namespace WishGranter.API_Methods
{
    public static class API_Basics
    {
        //private static List<SelectionArmor> ArmorOptionsList = WriteArmorOptionsList();
        //private static List<SelectionAmmo> AmmoOptionsList = WriteAmmoOptionsList();
        private static List<SelectionWeapon> WeaponOptionsList = WriteWeaponOptionsList();

        private static List<WeaponTableRow> WeaponsDataSheet = WriteWeaponsDataSheet();
        private static List<AmmoTableRow> AmmoDataSheet = WriteAmmoDataSheet();


        private static List<ArmorModule> ArmorModulesDataSheet = WriteArmorModulesDataSheet();

        //? Is this old?
        //private static List<ArmorTableRow> ArmorDataSheet = WriteArmorDataSheet();

        private static List<NewArmorTableRow> NewHelmets = WriteHelmetsDataSheet();
        private static List<NewArmorTableRow> NewArmorStatsSheet = WriteNewArmorStatsSheet();

        private static DopeTableUI_Options DopeTableUI_Options = constructDopeOptions();

        public static List<SelectionWeapon> GetWeaponOptionsList(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for WeaponOptionList");
            return WeaponOptionsList;
        }
        //public static List<SelectionArmor> GetArmorOptionsList(ActivitySource myActivitySource)
        //{
        //    using var myActivity = myActivitySource.StartActivity("Request for ArmorOptionList");
        //    return ArmorOptionsList;
        //}
        //public static List<SelectionAmmo> GetAmmoOptionsList(ActivitySource myActivitySource)
        //{
        //    using var myActivity = myActivitySource.StartActivity("Request for AmmoOptionList");
        //    return AmmoOptionsList;
        //}


        public static List<WeaponTableRow> GetWeaponsDataSheet(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for WeaponsDataSheet");
            return WeaponsDataSheet;
        }

        public static List<AmmoTableRow> GetAmmoDataSheet(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for AmmoDataSheet");
            return AmmoDataSheet;
        }

        public static List<ArmorModule> GetArmorModulesDataSheet(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for ArmorModulesData");
            return ArmorModulesDataSheet;
        }

        //public static List<ArmorTableRow> GetArmorDataSheet(ActivitySource myActivitySource)
        //{
        //    using var myActivity = myActivitySource.StartActivity("Request for ArmorDataSheet");
        //    return ArmorDataSheet;
        //}

        public static List<NewArmorTableRow> GetHelmetsDataSheet(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for HelmetDataSheet");
            return NewHelmets;
        }
        public static List<NewArmorTableRow> GetNewArmorStatSheet(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request for NewArmorStatsSheet");
            return NewArmorStatsSheet;
        }

        public static DopeTableUI_Options GetDopeTableOptions(ActivitySource myActivitySource)
        {
            using var myActivity = myActivitySource.StartActivity("Request forDopeTableOptions");

            return DopeTableUI_Options;
        }

        public static List<SelectionWeapon> WriteWeaponOptionsList()
        {
            var DefaultWeaponPresets = ModsWeaponsPresets.BasePresets;

            List<SelectionWeapon> result = new();

            List<string> prohibited = new();
            prohibited.Add("Master Hand");
            prohibited.Add("Штурмовая винтовка Colt M4A1 5.56x45");

            prohibited.Add("launcher_ak_toz_gp25_40_vog_settings");
            prohibited.Add("launcher_ar15_colt_m203_40x46_settings");
            prohibited.Add("FN40GL Mk2 grenade launcher");
            prohibited.Add("M32A1 MSGL 40mm grenade launcher");

            prohibited.Add("NSV \"Utyos\" 12.7x108 heavy machine gun");
            prohibited.Add("AGS-30 30x29mm automatic grenade launcher");

            prohibited.Add("ZiD SP-81 26x75 signal pistol");
            prohibited.Add("RSP-30 reactive signal cartridge (Green)");
            prohibited.Add("ROP-30 reactive flare cartridge (White)");
            prohibited.Add("RSP-30 reactive signal cartridge (Red)");
            prohibited.Add("RSP-30 reactive signal cartridge (Yellow)");

            IEnumerable<BasePreset> shortList = DefaultWeaponPresets.Where(x => !prohibited.Contains(x.Name));

            foreach (BasePreset preset in shortList)
            {
                SelectionWeapon selectionWeapon = new SelectionWeapon();

                var temp = Gunsmith.GetCompoundItemStatsTotals<Weapon>(preset.Weapon);

                selectionWeapon.Value = preset.Id;
                selectionWeapon.Label = preset.Name;
                selectionWeapon.SetImageLinkWithId(preset.Id.Split("_").First());

                selectionWeapon.Ergonomics = temp.TotalErgo; // Need to get the calculated val for the total.
                selectionWeapon.RecoilForceUp = temp.TotalRecoil; // Same here

                selectionWeapon.RecoilAngle = preset.Weapon.RecoilAngle;
                selectionWeapon.RecoilDispersion = preset.Weapon.RecoilDispersion;
                selectionWeapon.Convergence = preset.Weapon.Convergence;

                selectionWeapon.AmmoCaliber = preset.Weapon.AmmoCaliber;
                selectionWeapon.BFirerate = preset.Weapon.BFirerate;

                selectionWeapon.traderLevel = preset.PurchaseOffer.MinVendorLevel;
                selectionWeapon.requiredPlayerLevel = preset.PurchaseOffer.ReqPlayerLevel;
                selectionWeapon.OfferType = preset.PurchaseOffer.OfferType;
                selectionWeapon.PriceRUB = preset.PurchaseOffer.PriceRUB;

                result.Add(selectionWeapon);
            }
            result = result.OrderBy(x => x.Label).ToList();

            using StreamWriter writetext = new("outputs\\debug_WeaponOptionsList.json"); // This is here as a debug/verify
            writetext.Write(JToken.Parse(JsonConvert.SerializeObject(result)));
            writetext.Close();

            return result;

        }

        public static List<ArmorModule> WriteArmorModulesDataSheet()
        {
            return ArmorModules.armorModules;
        }
        public static List<NewArmorTableRow> WriteHelmetsDataSheet()
        {
            return Armors.ConvertHelmetsToArmorTableRows();
        }

        public static List<NewArmorTableRow> WriteNewArmorStatsSheet()
        {
            return Armors.AssembledArmorsAndRigsAsRows;
        }

        public static List<ArmorTableRow> WriteArmorDataSheet()
        {
            Monolit db = new();
            var items = db.ArmorItems.ToList();

            List < ArmorTableRow > dataSheet = new List <ArmorTableRow>();
            foreach (var item in items)
            {
                ArmorTableRow row = new();
                row.Id = item.Id;
                row.Name = item.Name;

                row.ArmorClass = item.ArmorClass;
                row.MaxDurability = item.MaxDurability;
                row.Material = item.ArmorMaterial;
                row.EffectiveDurability = Ballistics.GetEffectiveDurability(item.MaxDurability, item.ArmorMaterial);
                row.BluntThroughput = item.BluntThroughput;

                var traderCheck = Market.GetEarliestCheapestTraderPurchaseOffer(item.Id);
                if (traderCheck != null)
                {
                    row.TraderLevel = traderCheck.PurchaseOffer.MinVendorLevel;
                }
                else
                {
                    row.TraderLevel = -1;
                }

                row.Type = item.Type;
                
                dataSheet.Add(row);
            }

            return dataSheet;
        }
        public static List<AmmoTableRow> WriteAmmoDataSheet()
        {
            List<AmmoTableRow> dataSheet = new();

            foreach (var item in Ammos.Cleaned)
            {
                AmmoTableRow row = new();

                row.Id = item.Id;
                row.Name = item.Name;
                row.ShortName = item.ShortName;


                var marketData = Market.GetEarliestCheapestTraderPurchaseOffer(item.Id);

                if (marketData != null)
                {
                    row.TraderLevel = marketData.PurchaseOffer.MinVendorLevel;
                }
                else
                {
                    if (item.CanSellOnRagfair == true)
                    {
                        row.TraderLevel = 5;
                    }
                    else if (item.CanSellOnRagfair == false)
                    {
                        row.TraderLevel = 6;
                    }
                }


                row.Caliber = item.Caliber.Remove(0, 7);
                row.Damage = item.Damage;
                row.PenetrationPower = item.PenetrationPower;
                row.ArmorDamagePerc = item.ArmorDamage;
                row.BaseArmorDamage = (item.PenetrationPower * ((double)item.ArmorDamage / 100));
                row.LightBleedDelta = item.LightBleedingDelta;
                row.HeavyBleedDelta = item.HeavyBleedingDelta;

                if (item.PenetrationPower < 20)
                {
                    row.FragChance = 0;
                }
                else
                {
                    row.FragChance = item.FragmentationChance;
                }

                row.InitialSpeed = item.InitialSpeed;
                row.AmmoRec = item.AmmoRec;
                row.Tracer = item.Tracer;

                dataSheet.Add(row);
            }

            return dataSheet;
        }
        public static List<WeaponTableRow> WriteWeaponsDataSheet()
        {


            List<WeaponTableRow> dataSheet = new();

            foreach (var preset in ModsWeaponsPresets.BasePresets.Where
                (x =>
                x.PurchaseOffer.OfferType == WishGranterProto.OfferType.Cash 
                ||
                x.PurchaseOffer.OfferType == WishGranterProto.OfferType.Barter
                )
                .ToList()
            )
             
            {
                WeaponTableRow row = new();

                row.Id = preset.Id;
                row.Name = preset.Name;
                row.Caliber = preset.Weapon.AmmoCaliber;

                row.RateOfFire = preset.Weapon.BFirerate;
                row.BaseErgonomics = preset.Weapon.Ergonomics;
                row.BaseRecoil = preset.Weapon.RecoilForceUp;

                row.RecoilDispersion = preset.Weapon.RecoilDispersion;
                row.Convergence = preset.Weapon.Convergence;
                row.RecoilAngle = preset.Weapon.RecoilAngle;
                row.CameraRecoil = preset.Weapon.CameraRecoil;

                row.DefaultErgonomics = preset.Ergonomics;
                row.DefaultRecoil = preset.Recoil_Vertical;

                row.Price = preset.PurchaseOffer.PriceRUB;
                row.TraderLevel = preset.PurchaseOffer.MinVendorLevel;

                var fleaPreset = ModsWeaponsPresets.BasePresets.Find(x => x.Weapon.Id == preset.Weapon.Id && x.PurchaseOffer.OfferType == OfferType.Flea);
                if (fleaPreset != null)
                {
                    row.FleaPrice = fleaPreset.PurchaseOffer.PriceRUB;
                }

                string[] parts = preset.Id.Split('_');

                row.SetImageLinkWithId(parts[0]);

                dataSheet.Add(row);
            }

            return dataSheet;
        }
    }
}
