using RatStash;

namespace WishGranter
{
    public static class Ammos
    {
        public static List<Ammo> Cleaned { get; } = ConstructCleanedList();

        private static List<Ammo> ConstructCleanedList()
        {
            List<Ammo> Ammo = StaticRatStash.DB.GetItems(x => x.GetType() == typeof(Ammo)).Cast<Ammo>().ToList();
            
            Ammo.RemoveAll(x => x.Name.Contains("Zvezda"));
            Ammo.RemoveAll(x => x.Name.Contains("flare"));
            Ammo.RemoveAll(x => x.Name.Contains("patron_30x29_vog_30"));
            Ammo.RemoveAll(x => x.Name.Contains("Caliber20x1mm")); // blicky disk

            Ammo.RemoveAll(x => x.Id.Equals("5943d9c186f7745a13413ac9"));  //Shrapnel
            Ammo.RemoveAll(x => x.Name.Contains("F1 Shrapnel"));
            Ammo.RemoveAll(x => x.Name.Contains("RGD-5 Shrapnel"));
            Ammo.RemoveAll(x => x.Name.Contains("M67 Shrapnel"));
            Ammo.RemoveAll(x => x.Name.Contains("MON-50 Shrapnel"));

            Ammo.RemoveAll(x => x.Name.Contains("Airsoft 6mm BB"));
            Ammo.RemoveAll(x => x.Name.Contains("40mm VOG-25 grenade"));
            Ammo.RemoveAll(x => x.Name.Contains("30x29mm"));
            Ammo.RemoveAll(x => x.Name.Contains("12.7x108mm"));

            Ammo.RemoveAll(x => x.Name.Contains("40x46mm"));
            //Ammo.RemoveAll(x => x.Name.Contains("40x46mm M3"));
            //Ammo.RemoveAll(x => x.Name.Contains("40x46mm M4"));
            //Ammo.RemoveAll(x => x.Name.Contains("40x46mm M5"));

            Ammo.RemoveAll(x => x.Name.Contains("40x46mm"));

            Ammo.RemoveAll(x => x.Id.Equals("5e85aac65505fa48730d8af2"));  //Some dev thing
            Ammo.RemoveAll(x => x.Id.Equals("5f647fd3f6e4ab66c82faed6"));  //Some dev thing

            Ammo = Ammo.OrderBy(x=>x.Caliber).ThenByDescending(x=>x.PenetrationPower).ToList();

            //Debug Print
            //foreach (var item in Ammo)
            //{
            //    Console.WriteLine($"{item.Name}, {item.Id} ");
            //}

            return Ammo.ToList();
        }

        public static List<Ammo> GetAmmoOfCalibre(string ammoCaliber)
        {
            return Cleaned.Where(x=>x.Caliber.Equals(ammoCaliber)).ToList();
        }

        public static Ammo? GetAmmoById(string Id)
        {
            return Cleaned.Find(x=>x.Id.Equals(Id));
        }
    }
}
