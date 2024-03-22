function FormatNumber(input) {
  if (input === null || input === undefined) {
    return FormatNumber(0); // Return empty string for null or undefined
  }

  let numberValue;

  // Check if the input is already a number
  if (typeof input === "number") {
    numberValue = input;
  } else if (typeof input === "string") {
    // Try to convert the input string to a number
    numberValue = parseFloat(input);

    // Check if the conversion is successful
    if (isNaN(numberValue)) {
      return FormatNumber(0); // Return empty string if conversion fails
    }
  } else {
    return FormatNumber(0); // Return empty string for other data types
  }

  // Use toLocaleString with options for formatting
  return numberValue.toLocaleString("en-US", {
    style: "decimal", // Use the decimal style
    minimumFractionDigits: 2, // Minimum two decimal places
    maximumFractionDigits: 2, // Maximum two decimal places
  });
}

export default FormatNumber;

export const FormatNumberTextField = (num) => {
  if (!num) return;

  let displayedNum = num.toString();
  if (displayedNum === ".0") {
    return "";
  }
  if (displayedNum.endsWith(".0")) {
    displayedNum = displayedNum
      .replace(displayedNum[displayedNum.indexOf(".0") - 1], "")
      .replace(".0", ".00");
  }
  if (!displayedNum.includes(".")) {
    displayedNum += ".00";
  }
  if (displayedNum.includes(".00") && !displayedNum.endsWith(".00")) {
    displayedNum = displayedNum.replace(".00", "") + ".00";
  }
  displayedNum = displayedNum
    .replace(/^0+/, "")
    .replace(/[^\d.]/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return displayedNum;
};

export const ReformatNumberTextField = (num) => {
  if (!num) return;
  return num.toString().replace(/,|\.0(0|)|[^\d.]/g, "");
};

export const ReformatNumberFormData = (formData, numberTextField = []) => {
  return Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      !numberTextField.length || (key && numberTextField.includes(key))
        ? value.toString().replace(/,|\.0(0|)|[^\d.]/g, "")
        : value.toString(),
    ])
  );
};
