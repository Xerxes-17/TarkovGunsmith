using RatStash;
namespace WishGranter.Statics
{
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
}
