/**
 * Sorts the surcharge rates by age in ascending order
 * @param surchargeRates - The surcharge rates object
 * @returns Sorted keys representing age ranges
 */
export const sortSurchargeRates = (surchargeRates) => {
  return Object.keys(surchargeRates).sort((a, b) => {
    const [aStart] = a.split("-").map(Number);
    const [bStart] = b.split("-").map(Number);
    return aStart - bStart;
  });
};

/**
 * Extracts necessary values from the sorted surchargeRates object
 * @param sortedSurchargeKeys - Sorted keys representing age ranges
 * @param surchargeRates - The surcharge rates object
 * @returns Object containing extracted values
 */
export const extractSurchargeValues = (sortedSurchargeKeys, surchargeRates) => {
  const freeChildAge =
    sortedSurchargeKeys.find((ageRange) => surchargeRates[ageRange] === 0) || "0-4";
  const freeChildMaxAge = parseInt(freeChildAge.split("-")[1]);

  const nextChildRange =
    sortedSurchargeKeys.find(
      (ageRange) => surchargeRates[ageRange] !== 0 && surchargeRates[ageRange] < 1
    ) || "5-12";
  const nextChildStartAge = parseInt(nextChildRange.split("-")[0]);
  const nextChildEndAge = parseInt(nextChildRange.split("-")[1]);

  const adultAge =
    sortedSurchargeKeys.find((ageRange) => surchargeRates[ageRange] === 0.5) || "13-17";
  const adultStartAge = parseInt(adultAge.split("-")[0]);
  const adultRate = surchargeRates ? surchargeRates[adultAge] : 0.5;

  return {
    freeChildAge,
    freeChildMaxAge,
    nextChildRange,
    nextChildStartAge,
    nextChildEndAge,
    adultAge,
    adultStartAge,
    adultRate,
  };
};
