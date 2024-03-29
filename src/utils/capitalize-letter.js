export const capitalizeFirstLetter = (str) => {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeFirstLetterRegex = (str) => {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
};
