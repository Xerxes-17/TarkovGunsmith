using RatStash;
using WishGranter.Statics;
using WishGranterProto;

namespace WishGranter.AmmoEffectivenessChart
{
    //Ammo Effectiveness Chart
    //todo add update method
    public class AEC
    {
        public List<AEC_Row> Rows { get; set; }

        public AEC()
        {
            var ammoIds = Ammos.Cleaned.Select(x => x.Id).ToList(); //Probably should consider making it just take the ammo object as a param but eh, whatever...
            Rows = new List<AEC_Row>();
            foreach (var ammoId in ammoIds)
            {
                Rows.Add(new AEC_Row(ammoId));
            }
        }
    }
    public class AEC_Row
    {
        public Ammo Ammo { get; set; } // Still want the ammo here and the Ammo in each details object as null to avoid data repitition
        public List<BallisticDetails> Details { get; set; } // Details includes a List of the corresponding ratings
        public PurchaseOffer? PurchaseOffer { get; set; } //todo Need to expand on this.

        public AEC_Row(string AmmoID)
        {
            using var db = new Monolit();

            Ammo = Ammos.Cleaned.FirstOrDefault(x=>x.Id == AmmoID)!;
            Details = db.BallisticDetails.Where(x => x.AmmoId.Equals(AmmoID)).ToList();
            foreach(var item in Details)
            {
                item.LoadRatings();
            }
            var marketEntry = Market.GetEarliestCheapestTraderPurchaseOffer(AmmoID);
            if(marketEntry != null)
            {
                PurchaseOffer = marketEntry.PurchaseOffer;
            }
        }
    }
}
