import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/authService'
import { useAuthStore } from '../store/authStore'

// Password strength scorer (0–4)
function scorePassword(pwd) {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return Math.min(score, 4)
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']

function EyeIcon({ open }) {
    return open ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    )
}

function FieldError({ id, message }) {
    if (!message) return null
    return (
        <p id={id} className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {message}
        </p>
    )
}

export default function Signup() {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [touched, setTouched] = useState({})

    const navigate = useNavigate()
    const { initialize } = useAuthStore()
    const pwdScore = scorePassword(form.password)

    // ── Validation ────────────────────────────────────────────────────────────
    function validate(fields = form) {
        const e = {}
        if (!fields.fullName.trim()) e.fullName = 'Full name is required.'
        else if (fields.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters.'

        if (!fields.email) e.email = 'Email is required.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email address.'

        if (!fields.password) e.password = 'Password is required.'
        else if (fields.password.length < 8) e.password = 'Password must be at least 8 characters.'

        if (!fields.confirm) e.confirm = 'Please confirm your password.'
        else if (fields.confirm !== fields.password) e.confirm = 'Passwords do not match.'

        return e
    }

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value }
        setForm(updated)
        // Re-validate touched fields live
        if (touched[e.target.name]) {
            const newErrors = validate(updated)
            setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] || '' }))
        }
    }

    const handleBlur = (e) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }))
        const newErrors = validate()
        setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] || '' }))
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')

        // Mark all fields touched and validate
        setTouched({ fullName: true, email: true, password: true, confirm: true })
        const fieldErrors = validate()
        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors)
            return
        }

        setLoading(true)
        try {
            const data = await signUp({ email: form.email, password: form.password, fullName: form.fullName.trim() })
            // If email confirmation is disabled, Supabase returns a session immediately.
            // Re-initialize auth state so the store picks up the new user, then redirect.
            if (data?.session) {
                await initialize()
                navigate('/dashboard', { replace: true })
            } else {
                // Confirmation email was sent — show the "check inbox" screen
                setSuccess(true)
            }
        } catch (err) {
            setServerError(err.message || 'Failed to create account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // ── Success screen ────────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
                <div className="card max-w-md w-full text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                    <p className="text-gray-500 text-sm mb-2">
                        We sent a confirmation link to
                    </p>
                    <p className="font-semibold text-gray-900 mb-6">{form.email}</p>
                    <p className="text-xs text-gray-400 mb-8">
                        Click the link in the email to activate your account. Check your spam folder if you don't see it.
                    </p>
                    <Link to="/login" className="btn-primary px-8">
                        Go to login
                    </Link>
                </div>
            </div>
        )
    }

    // ── Form ──────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
                    <p className="text-gray-500 mt-1 text-sm">Free forever. No credit card required.</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
                    {/* Server error */}
                    {serverError && (
                        <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {serverError}
                        </div>
                    )}

                    {/* Full name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            value={form.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.fullName}
                            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                            className={`input-field ${errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Jane Smith"
                        />
                        <FieldError id="fullName-error" message={errors.fullName} />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={`input-field ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="you@example.com"
                        />
                        <FieldError id="email-error" message={errors.email} />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!errors.password}
                                aria-describedby="password-strength"
                                className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="Min. 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        </div>
                        <FieldError id="password-error" message={errors.password} />

                        {/* Strength meter */}
                        {form.password && (
                            <div id="password-strength" className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= pwdScore ? strengthColor[pwdScore] : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Strength: <span className="font-medium">{strengthLabel[pwdScore] || 'Too short'}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                id="confirm"
                                name="confirm"
                                type={showConfirm ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={form.confirm}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={!!errors.confirm}
                                aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                                className={`input-field pr-10 ${errors.confirm ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                            >
                                <EyeIcon open={showConfirm} />
                            </button>
                        </div>
                        <FieldError id="confirm-error" message={errors.confirm} />
                    </div>

                    {/* Role note */}
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Your account will be created with the <strong>user</strong> role. Admins can promote accounts later.
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-base"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating account…
                            </span>
                        ) : (
                            'Create account'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
