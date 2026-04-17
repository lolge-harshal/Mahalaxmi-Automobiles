import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSubmitEnquiry } from '../hooks/useWorkshop'
import { sanitizeEnquiryMessage } from '../utils/sanitize'

/**
 * Modal for submitting a product enquiry.
 *
 * Props:
 *   product  — { id, name, image_url, price } | null  (null = closed)
 *   onClose  — () => void
 */
export default function EnquiryModal({ product, onClose }) {
    const [message, setMessage] = useState('')
    const [fieldError, setFieldError] = useState('')
    const textareaRef = useRef(null)
    const { isAuthenticated } = useAuthStore()

    const { mutate, isPending, isSuccess, isError, error, reset } = useSubmitEnquiry()

    // Focus textarea when modal opens
    useEffect(() => {
        if (product && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 50)
        }
    }, [product])

    // Reset internal state whenever the modal opens for a new product
    useEffect(() => {
        if (product) {
            setMessage('')
            setFieldError('')
            reset()
        }
    }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') handleClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    })

    if (!product) return null

    const handleClose = () => {
        if (isPending) return   // don't close mid-submit
        onClose()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const { value: clean, error } = sanitizeEnquiryMessage(message)
        if (error) { setFieldError(error); return }
        setFieldError('')
        mutate({ productId: product.id, message: clean })
    }

    const authenticated = isAuthenticated()

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Product thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p id="enquiry-modal-title" className="font-semibold text-gray-900 truncate">
                                Enquire about {product.name}
                            </p>
                            {product.price != null && (
                                <p className="text-xs text-primary-600 font-medium mt-0.5">
                                    &#8377;{Number(product.price).toLocaleString('en-IN')}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isPending}
                        className="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="p-6">

                    {/* Not logged in */}
                    {!authenticated && (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-700 font-medium mb-1">Sign in to send an enquiry</p>
                            <p className="text-sm text-gray-500 mb-5">
                                You need to be logged in to submit an enquiry for this product.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link to="/login" onClick={onClose} className="btn-primary">Log in</Link>
                                <Link to="/signup" onClick={onClose} className="btn-secondary">Sign up</Link>
                            </div>
                        </div>
                    )}

                    {/* Success */}
                    {authenticated && isSuccess && (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <p className="font-semibold text-gray-900 mb-1">Enquiry Submitted</p>
                            <p className="text-sm text-gray-500 mb-5">
                                Our team will review your enquiry and get back to you shortly.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={handleClose} className="btn-primary">Done</button>
                                <Link to="/dashboard" onClick={onClose} className="btn-secondary">View My Enquiries</Link>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    {authenticated && !isSuccess && (
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Server error */}
                            {isError && (
                                <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                    {error?.message ?? 'Failed to submit enquiry. Please try again.'}
                                </div>
                            )}

                            <label htmlFor="enquiry-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Your Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="enquiry-message"
                                ref={textareaRef}
                                rows={4}
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    if (fieldError) setFieldError('')
                                }}
                                placeholder="e.g. I am interested in this vehicle. Please share availability and best price."
                                className={`input-field resize-none ${fieldError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                aria-invalid={!!fieldError}
                                aria-describedby={fieldError ? 'enquiry-error' : undefined}
                            />
                            {fieldError && (
                                <p id="enquiry-error" className="mt-1 text-xs text-red-600">{fieldError}</p>
                            )}

                            <div className="flex gap-3 mt-5">
                                <button type="submit" disabled={isPending} className="btn-primary flex-1">
                                    {isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting…
                                        </span>
                                    ) : (
                                        'Submit Enquiry'
                                    )}
                                </button>
                                <button type="button" onClick={handleClose} disabled={isPending} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
