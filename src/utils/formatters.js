/**
 * Format a date string to a human-readable format.
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} options
 */
export function formatDate(date, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

/**
 * Truncate a string to a given length, appending an ellipsis.
 */
export function truncate(str, maxLength = 80) {
    if (!str) return ''
    return str.length <= maxLength ? str : `${str.slice(0, maxLength)}…`
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}
