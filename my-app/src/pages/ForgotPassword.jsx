import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordReset } from '../services/authService'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email) { setError('Email is required.'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }

        setLoading(true)
        try {
            await sendPasswordReset(email)
            setSent(true)
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
                <div className="card max-w-md w-full text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                    </p>
                    <Link to="/login" className="btn-primary px-8">Back to login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
                    {error && (
                        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending…
                            </span>
                        ) : (
                            'Send reset link'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        <Link to="/login" className="text-primary-600 font-medium hover:underline">
                            ← Back to login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
