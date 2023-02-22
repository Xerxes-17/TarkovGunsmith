using RatStash;

namespace WishGranterProto.ExtensionMethods
{
    public static class WG_Inspection
    {
        // Inspect a given CompoundItem list to find the name, id and conflicting items of items of a given type.
        //? Hey this could be useful for the build validity checker!
        public static void InspectListForType<T>(List<CompoundItem> aList, List<WeaponMod> allmods)
        {
            var result = aList.Where(x => x.GetType() == typeof(T)).ToList();
            result.ForEach((x) =>
            {
                Console.WriteLine(x.Name);
                Console.WriteLine(x.Id);

                x.ConflictingItems = x.ConflictingItems.Where(x => allmods.Any(y => y.Id == x)).ToList();
                x.ConflictingItems.ForEach(y => {
                    Console.WriteLine(y);
                    var match = allmods.FirstOrDefault(z => z.Id == y);
                    if (match != null)
                        Console.WriteLine("  " + match.Name + " type: " + match.GetType().Name);
                });
                Console.WriteLine("");
            });
        }
    }
}
