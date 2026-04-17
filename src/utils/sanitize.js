/**
 * Input sanitization utilities.
 * Strips dangerous characters before any value reaches the database or DOM.
 */

/** Remove HTML tags and trim whitespace */
export function sanitizeText(value) {
    if (typeof value !== 'string') return ''
    return value.replace(/<[^>]*>/g, '').trim()
}

/** Sanitize and validate an email address */
export function sanitizeEmail(value) {
    if (typeof value !== 'string') return ''
    return value.replace(/[^a-zA-Z0-9._%+\-@]/g, '').trim().toLowerCase()
}

/** Strip everything except digits, spaces, +, -, (, ) for phone numbers */
export function sanitizePhone(value) {
    if (typeof value !== 'string') return ''
    return value.replace(/[^0-9\s+\-()]/g, '').trim()
}

/** Clamp a numeric string to a safe range */
export function sanitizePrice(value) {
    const n = Number(value)
    if (isNaN(n) || n < 0) return null
    if (n > 99_999_999) return null   // 10 crore cap
    return n
}

/** Validate email format */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Validate that a string is a valid UUID v4 */
export function isValidUUID(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

/**
 * Sanitize a contact form payload before submission.
 * Returns { sanitized, errors }
 */
export function sanitizeContactForm({ name, email, phone, message }) {
    const errors = {}
    const sanitized = {
        name: sanitizeText(name),
        email: sanitizeEmail(email),
        phone: sanitizePhone(phone ?? ''),
        message: sanitizeText(message),
    }

    if (!sanitized.name || sanitized.name.length < 2)
        errors.name = 'Full name must be at least 2 characters.'
    if (sanitized.name.length > 100)
        errors.name = 'Name is too long (max 100 characters).'

    if (!sanitized.email)
        errors.email = 'Email address is required.'
    else if (!isValidEmail(sanitized.email))
        errors.email = 'Enter a valid email address.'

    if (!sanitized.message || sanitized.message.length < 10)
        errors.message = 'Message must be at least 10 characters.'
    if (sanitized.message.length > 2000)
        errors.message = 'Message is too long (max 2000 characters).'

    return { sanitized, errors }
}

/**
 * Sanitize an enquiry message before submission.
 */
export function sanitizeEnquiryMessage(message) {
    const clean = sanitizeText(message)
    if (!clean || clean.length < 10) return { value: clean, error: 'Message must be at least 10 characters.' }
    if (clean.length > 1000) return { value: clean, error: 'Message is too long (max 1000 characters).' }
    return { value: clean, error: null }
}
