/**
 * @typedef {Object} FormatOptions
 * @property {string} [locale]
 * @property {string} [currency]
 * @property {number} [minimumFractionDigits]
 * @property {number} [maximumFractionDigits]
 */

/**
 * Formats a number as currency or decimal based on options provided.
 *
 * @param {number} number - The number to format.
 * @param {FormatOptions} [options] - Optional settings for formatting.
 * @returns {string} - The formatted number as a string.
 */
function FormatCurrency(number, options) {
  const defaultOptions = {
    locale: "vi-VN",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  };

  return new Intl.NumberFormat(defaultOptions.locale, {
    style: defaultOptions.currency ? "currency" : "decimal",
    currency: defaultOptions.currency,
    minimumFractionDigits: defaultOptions.minimumFractionDigits,
    maximumFractionDigits: defaultOptions.maximumFractionDigits,
  }).format(number);
}

export default FormatCurrency;
