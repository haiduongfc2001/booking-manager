// Function to calculate the number of nights from check-in date to check-out date
export default function calculateNumberOfNights(checkIn, checkOut) {
  // Convert the dates into Date objects
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  // Calculate the number of milliseconds in a day
  const oneDay = 24 * 60 * 60 * 1000;

  // Calculate the number of nights by taking the difference of two days and dividing by the number of milliseconds in a day
  const differenceMs = endDate.getTime() - startDate.getTime();
  const calculateNumberOfNights = Math.round(differenceMs / oneDay);

  return calculateNumberOfNights;
}
