// utils.js

/**
 * Formats a date string into a human-readable format.
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const capitalizePriority = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};
