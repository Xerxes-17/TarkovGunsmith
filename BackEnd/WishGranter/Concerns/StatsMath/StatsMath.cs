namespace WishGranter.Concerns.StatsMath
{
    public class StatsMath
    {
        public static float FindMedian(List<float> numbers)
        {
            if (numbers == null || numbers.Count == 0)
                throw new ArgumentException("The list cannot be null or empty.");

            numbers.Sort(); // Sort the list

            int count = numbers.Count;
            if (count % 2 == 0) // Even number of elements
            {
                // Average of the two middle elements
                return (numbers[count / 2 - 1] + numbers[count / 2]) / 2f;
            }
            else // Odd number of elements
            {
                // Middle element
                return numbers[count / 2];
            }
        }

        public static double FindMedian(List<int> numbers)
        {
            if (numbers == null || numbers.Count == 0)
                throw new ArgumentException("The list cannot be null or empty.");

            numbers.Sort(); // Sort the list

            int count = numbers.Count;
            if (count % 2 == 0) // Even number of elements
            {
                // Average of the two middle elements
                return (numbers[count / 2 - 1] + numbers[count / 2]) / 2.0;
            }
            else // Odd number of elements
            {
                // Middle element
                return numbers[count / 2];
            }
        }
    }
}
