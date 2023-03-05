using RatStash;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http.Json;
using System.Runtime.InteropServices;

namespace WishGranterProto.ExtensionMethods
{
    public enum OfferType
    {
        None,
        Sell,
        Cash,
        Barter,
        Flea
    }
    public class TraderCashOffer
    {
        public string TraderName { get; set; } = string.Empty;
        public int TraderLevel { get; set; } = -1;
        public int RequiredPlayerLevel { get; set; } = -1;

        public string ItemId { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;

        public int PriceInRUB { get; set; } = -1;

    }

    public class MarketEntry
    {
        public string Name { get; set; } = "Not set after construction";
        public string Id { get; set; } = "Not set after construction";
        public PurchaseOffer PurchaseOffer { get; set; } = new();
    }
    public class PurchaseOffer
    {
        public int PriceRUB { get; set; } = -1;
        public int Price { get; set; } = -1;
        public string Currency { get; set; } = string.Empty;
        public string Vendor { get; set; } = string.Empty;
        public int MinVendorLevel { get; set; } = -1;
        public int ReqPlayerLevel { get; set; } = -1;
        public OfferType OfferType { get; set; } = OfferType.None;
    }
    public class WeaponPreset
    {
        public string Name { get; set; } = "Hey this didn't get set after construction.";
        public string Id { get; set; } = "Hey this didn't get set after construction.";
        public Weapon Weapon { get; set; } = new Weapon();
        public PurchaseOffer PurchaseOffer { get; set; } = new();
    }

    public class TransmissionWeapon
    {
        public string? ShortName { get; set; }
        public string? Id { get; set; }
        public string? Details { get; set; }
        public int? BaseErgo { get; set; }
        public int? BaseRecoil { get; set; }
        public double? Convergence { get; set; }
        public int? RecoilDispersion { get; set; }
        public int? RateOfFire { get; set; }

        public List<TransmissionWeaponMod> AttachedModsFLat { get; set; } = new List<TransmissionWeaponMod>();
        public int? FinalErgo { get; set; }
        public int? FinalRecoil { get; set; }

        public TransmissionPatron? SelectedPatron { get; set; }

        public int PresetPrice { get; set; } = -1;
        public int SellBackValue { get; set; } = -1;
        public int PurchasedModsCost { get; set; } = -1;
        public int FinalCost { get; set; } = -1;

        public bool Valid { get; set; } = true;
    }
    public class TransmissionWeaponMod
    {
        public string? ShortName { get; set; }
        public string? Id { get; set; }
        public double? Ergo { get; set; }
        public double? RecoilMod { get; set; }

        public int PriceRUB { get; set; } = -1;
    }
    public class TransmissionPatron
    {
        public string? ShortName { get; set; }
        public string? Id { get; set; }
        public int? Penetration { get; set; }
        public int? ArmorDamagePerc { get; set; }
        public int? Damage { get; set; }
        public double FragChance { get; set; } = -1;
    }
    public class TransmissionArmorTestResult
    {
        public string? TestName { get; set;}
        public double? ArmorDamagePerShot { get; set; }

        public string? ArmorId  { get; set; }
        public string? ArmorGridImage  { get; set; }


        public string? AmmoId { get; set; }
        public string? AmmoGridImage { get; set; }

        public List<TransmissionArmorTestShot> Shots { get; set; } = new List<TransmissionArmorTestShot>();

        public int KillShot { get; set; } = -1;

    }
    public class TransmissionArmorTestShot
    {
        public double? DurabilityPerc { get; set; }
        public double? Durability { get; set; }
        public double? DoneDamage { get; set; }
        public double? PenetrationChance { get; set; }

        public double BluntDamage { get; set; } = -1;
        public double PenetratingDamage { get; set; } = -1;
        public double AverageDamage { get; set; } = -1;
        public double RemainingHitPoints { get; set; } = -1;

        public double ProbabilityOfKillCumulative { get; set; } = -1;
        public double ProbabilityOfKillSpecific { get; set; } = -1;
    }

    public class ArmorItem
    {
        public string? Name { get; set; }
        public string? Id { get; set; }
        public int? MaxDurability { get; set; }

        //Giveing these two Properties defaults so that they can play nice with RatStash types which aren't nullable
        public int ArmorClass { get; set; } = -1;
        public ArmorMaterial ArmorMaterial { get; set; } = ArmorMaterial.Glass;

        public double BluntThroughput { get; set; } = -1;
        public string ArmorType { get; set; } = "You shouldn't see this.";

    }

    public class SelectionOption
    {
        public string? Value { get; set; } // Id
        public string? Label { get; set; } // Name
        public string? ImageLink { get; set; }

        // public boolean IsBarter { get; setl} = false;

        public void SetImageLinkWithId(string Id)
        {
            ImageLink = $"https://assets.tarkov.dev/{Id}-icon.jpg";
        }
    }
    public class SelectionArmor : SelectionOption
    {
        public int? ArmorClass { get; set; }
        public int? MaxDurability { get; set;}
        public ArmorMaterial? ArmorMaterial { get; set; }
        public int? EffectiveDurability { get; set; }
        public int? TraderLevel { get; set; }

        public string Type { get; set; } = "";
    }
    public class SelectionAmmo : SelectionOption
    {
        public string Caliber { get; set; } = "";
        public int Damage { get; set; } = -1;
        public int PenetrationPower { get; set; } = -1;
        public int ArmorDamagePerc { get; set; } = -1;
        public double BaseArmorDamage { get; set; } = -1;
        public int TraderLevel { get; set; } = -1;
    }
    public class SelectionWeapon : SelectionOption
    {
        // Adding camera recoil and jam stats might be an idea for later
        public int Ergonomics { get; set; } = -1;

        public int RecoilForceUp { get; set; } = -1;
        public int RecoilAngle { get; set; } = -1;
        public int RecoilDispersion { get; set; } = -1;
        public double Convergence { get; set; } = -1;

        public string AmmoCaliber { get; set; } = "";
        public int BFirerate { get; set; } = -1;

        public int traderLevel { get; set; } = -1;
        public int requiredPlayerLevel { get; set; } = int.MaxValue; // Will need to make this more graceful later.

        public OfferType OfferType { get; set; } = OfferType.None;
        public int PriceRUB { get; set; } = -1;
    }

    public record struct CurveDataPoint
    (
        int level,
        int recoil, 
        int ergo, 
        int price,
        int penetration,
        int damage,
        bool invalid
    );

    public class ArmorTableRow
    {
        public string Id { get; set; } = "default";
        public string Name { get; set; } = "default";
        public int ArmorClass { get; set; } = -1;
        public int MaxDurability { get; set; } = -1;
        public ArmorMaterial Material { get; set; } = new();
        public int EffectiveDurability { get; set; } = -1;
        public double BluntThroughput { get; set; } = -1;
        public int Price { get; set; } = 0;
        public int TraderLevel { get; set; } = -1;
        public string Type { get; set; } = "default"; // "Helmet", "ArmorVest", "ChestRig", "ArmoredEquipment"
    }

    public class AmmoTableRow
    {
        public string Id { get; set; } = "default";
        public string Name { get; set; } = "default";
        public int Price { get; set; } = 0;
        public int TraderLevel { get; set; } = -1;
        public string Caliber { get; set; } = "";
        public int Damage { get; set; } = -1;
        public int PenetrationPower { get; set; } = -1;
        public int ArmorDamagePerc { get; set; } = -1;
        public double BaseArmorDamage { get; set; } = -1;

        public double LightBleedDelta { get; set; } = -1;
        public double HeavyBleedDelta { get; set; } = -1;
        public double FragChance { get; set; } = -1;
        public double InitialSpeed { get; set; } = -1;
        public double AmmoRec { get; set; } = -1;
        public bool Tracer { get; set; } = false;
    }

    // We will take the base stats, and the stats of the DEFAULT preset of the weapon.
    public class WeaponTableRow
    {
        public string Id { get; set; } = "default";
        public string Name { get; set; } = "default";
        public string Caliber { get; set; } = "default";

        // Base Stats
        public int RateOfFire { get; set; } = -1;
        public int BaseErgonomics { get; set; } = -1;
        public int BaseRecoil { get; set; } = -1;

        // Hidden Stats
        public int RecoilDispersion { get; set; } = -1;
        public double Convergence { get; set; } = -1;
        public int RecoilAngle { get; set; } = -1;
        public double CameraRecoil { get; set; } = -1;

        // Default Preset Stats
        public int DefaultErgonomics { get; set; } = -1;
        public int DefaultRecoil { get; set; } = -1;

        // Trader information will be for the base preset
        public int Price { get; set; } = 0;
        public int TraderLevel { get; set; } = -1;
        public int FleaPrice { get; set; } = -1;
    }

    public class EffectivenessDataRow
    {
        public string AmmoId { get; set; } = "";
        public string ArmorId { get; set; } = "";
        public string AmmoName { get; set; } = "";
        public string ArmorName { get; set; } = "";
        public string ArmorType { get; set; } = "";
        public int ArmorClass { get; set; } = -1;

        public double FirstShot_PenChance { get; set; } = -1;
        public double FirstShot_PenDamage { get; set; } = -1;
        public double FirstShot_BluntDamage { get; set; } = -1;
        public double FirstShot_ArmorDamage { get; set; } = -1;

        public int ExpectedShotsToKill { get; set; } = -1;
        // This should be the culuminitive chance of the shots to kill.
        public double ExpectedKillShotConfidence { get; set; } = -1;

        //? Perhaps a "shots to get > 90% chance to kill?
        //? Or even have it by tiers? so like >30 , >60, >90

        //? Need to include the bullet damage and penetration

    }
}
