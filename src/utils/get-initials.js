// This is a JavaScript function declaration using the const keyword.
// It defines a function named getInitials that takes an optional parameter 'name' with a default value of an empty string.
export const getInitials = (name = "") =>
  // The following chain of methods manipulates the 'name' string to extract initials.

  // Replace consecutive whitespaces with a single whitespace.
  name
    .replace(/\s+/, " ")

    // Split the string into an array of words using whitespace as the separator.
    .split(" ")

    // Take the first two elements (words) from the array.
    .slice(0, 2)

    // Map over the selected words, and for each word, extract the first character and convert it to uppercase.
    .map((v) => v && v[0].toUpperCase())

    // Join the resulting array of uppercase initials into a single string.
    .join("");
