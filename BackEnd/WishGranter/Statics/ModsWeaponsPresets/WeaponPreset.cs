using RatStash;
using WishGranterProto;

namespace WishGranter.Statics
{
    public class WeaponPreset
    {
        public string Name { get; set; } = "Hey this didn't get set after construction.";
        public string Id { get; set; } = "Hey this didn't get set after construction.";
        public Weapon Weapon { get; set; } = new Weapon();
        public PurchaseOffer PurchaseOffer { get; set; } = new();
    }
}
