export default function extractUsername(inputString) {
  // Check if the inputString is empty, undefined, or null
  if (!inputString || inputString === "") {
    return "";
  }

  // Split the inputString by "@" delimiter
  const parts = inputString.split("@");

  // If there is at least one part after splitting, return the first part (username)
  if (parts.length > 0) {
    return parts[0];
  }

  // If no "@" is found, return the original string
  return inputString;
}