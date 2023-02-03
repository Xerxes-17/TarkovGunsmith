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

        public int PriceRUB { get; set; } = -1;
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

    }
    public class TransmissionArmorTestShot
    {
        public double? DurabilityPerc { get; set; }
        public double? Durability { get; set; }
        public double? DoneDamage { get; set; }
        public double? PenetrationChance { get; set; }
    }

    public class ArmorItem
    {
        public string? Name { get; set; }
        public string? Id { get; set; }

        public int? MaxDurability { get; set; }

        //Giveing these two Properties defaults so that they can play nice with RatStash types which aren't nullable
        public int ArmorClass { get; set; } = -1;
        public ArmorMaterial ArmorMaterial { get; set; } = ArmorMaterial.Glass;

    }

    public class SelectionOption
    {
        public string? Value { get; set; } // Id
        public string? Label { get; set; } // Name
        public string? ImageLink { get; set; }

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
    }
    public class SelectionAmmo : SelectionOption
    {
        public string Caliber { get; set; } = "";
        public int Damage { get; set; } = -1;
        public int PenetrationPower { get; set; } = -1;
        public int ArmorDamagePerc { get; set; } = -1;
        public double BaseArmorDamage { get; set; } = -1;
        public int TraderLevel { get; set; } = 0;
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
    }

    public record struct J_OfferUnlock
    (
        J_Trader trader,
        int level,
        J_Item item
    );
    public record struct J_Trader
    (
        string id,
        string name

    );
    public record struct J_Item
    (
        string id,
        string name
    );
    public record struct J_CashOffer
    (
        int priceRUB,
        string currency,
        int price,
        J_Item item
    );
}
