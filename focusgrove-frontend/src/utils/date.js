// src/utils/date.js

/**
 * Converts a Date object to a timezone-safe "YYYY-MM-DD" string 
 * by using the date's local parts, avoiding UTC conversion issues.
 * @param {Date} date The date to format.
 * @returns {string} The formatted date string.
 */
export const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
