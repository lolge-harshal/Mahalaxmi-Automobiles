import { useState } from 'react'
import { usePageContent, useSubmitContact } from '../hooks/useWorkshop'
import { sanitizeContactForm } from '../utils/sanitize'
import PageBanner from '../components/PageBanner'
import SEO from '../components/SEO'

// ── Field error ───────────────────────────────────────────────────────────────

function FieldError({ message }) {
    if (!message) return null
    return <p className="mt-1 text-xs text-red-600">{message}</p>
}

// ── Contact info card ─────────────────────────────────────────────────────────

function InfoItem({ label, value, href }) {
    const content = (
        <span className="text-gray-700 text-sm font-medium">
            {value}
        </span>
    )
    return (
        <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 shrink-0" />
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                {href
                    ? <a href={href} className="text-gray-700 text-sm font-medium hover:text-primary-600 transition-colors">{value}</a>
                    : content
                }
            </div>
        </div>
    )
}

// ── Contact info panel ────────────────────────────────────────────────────────

function ContactInfo({ info }) {
    return (
        <div className="space-y-5">
            <InfoItem
                label="Address"
                value={info?.address ?? '123 Main Road, City, State — 000000'}
            />
            <InfoItem
                label="Phone"
                value={info?.phone ?? '+91 00000 00000'}
                href={`tel:${(info?.phone ?? '').replace(/\s/g, '')}`}
            />
            <InfoItem
                label="Email"
                value={info?.email ?? 'info@mahalaxmiautomobiles.com'}
                href={`mailto:${info?.email ?? 'info@mahalaxmiautomobiles.com'}`}
            />
            <InfoItem
                label="Business Hours"
                value={info?.hours ?? 'Mon – Sat: 9:00 AM – 7:00 PM'}
            />
        </div>
    )
}

// ── Form validation ───────────────────────────────────────────────────────────

function validate({ name, email, message }) {
    const errors = {}
    if (!name.trim()) errors.name = 'Full name is required.'
    else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'

    if (!email.trim()) errors.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'

    if (!message.trim()) errors.message = 'Message is required.'
    else if (message.trim().length < 10) errors.message = 'Message must be at least 10 characters.'

    return errors
}

// ── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const { mutate, isPending, isSuccess, isError, error, reset } = useSubmitContact()

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value }
        setForm(updated)
        if (touched[e.target.name]) {
            const newErrors = validate(updated)
            setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] || '' }))
        }
    }

    const handleBlur = (e) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }))
        const newErrors = validate(form)
        setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] || '' }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setTouched({ name: true, email: true, phone: true, message: true })

        // Sanitize and validate together
        const { sanitized, errors: fieldErrors } = sanitizeContactForm(form)
        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors)
            return
        }
        mutate(sanitized)
    }

    const handleReset = () => {
        setForm({ name: '', email: '', phone: '', message: '' })
        setErrors({})
        setTouched({})
        reset()
    }

    // ── Success state ──
    if (isSuccess) {
        return (
            <div className="card text-center py-12">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent</h3>
                <p className="text-gray-500 text-sm mb-6">
                    Thank you for reaching out. Our team will get back to you within one business day.
                </p>
                <button onClick={handleReset} className="btn-secondary">
                    Send Another Message
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
            <h2 className="text-lg font-bold text-gray-900">Send Us a Message</h2>

            {/* Server error */}
            {isError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error?.message ?? 'Failed to send message. Please try again.'}
                </div>
            )}

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="name" name="name" type="text" autoComplete="name"
                    value={form.name} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={!!errors.name}
                    className={`input-field ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Rajesh Kumar"
                />
                <FieldError message={errors.name} />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    id="email" name="email" type="email" autoComplete="email"
                    value={form.email} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={!!errors.email}
                    className={`input-field ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="you@example.com"
                />
                <FieldError message={errors.email} />
            </div>

            {/* Phone (optional) */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <input
                    id="phone" name="phone" type="tel" autoComplete="tel"
                    value={form.phone} onChange={handleChange}
                    className="input-field"
                    placeholder="+91 98765 43210"
                />
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message" name="message" rows={5}
                    value={form.message} onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={!!errors.message}
                    className={`input-field resize-none ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Tell us about your enquiry, vehicle details, or service requirement…"
                />
                <FieldError message={errors.message} />
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending…
                    </span>
                ) : (
                    'Send Message'
                )}
            </button>
        </form>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Contact() {
    const { data: content, isLoading } = usePageContent('contact')
    const info = content?.info ?? {}

    return (
        <div>
            <SEO
                title="Contact Us"
                description="Get in touch with Mahalaxmi Automobiles for vehicle enquiries, service bookings, and support."
            />
            <PageBanner
                title="Contact Us"
                subtitle="We are here to help. Reach out to our team for enquiries, bookings, or any assistance you need."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* ── Left: Info ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-5">Get in Touch</h2>
                            {isLoading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ContactInfo info={info} />
                            )}
                        </div>

                        {/* Map placeholder */}
                        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-100 aspect-video flex items-center justify-center">
                            <div className="text-center px-4">
                                <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <p className="text-xs text-gray-400">Map integration available</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Form ── */}
                    <div className="lg:col-span-3">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
