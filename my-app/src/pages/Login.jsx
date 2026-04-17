import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn } from '../services/authService'
import { useAuthStore } from '../store/authStore'

// Map Supabase error messages to user-friendly strings
function friendlyError(msg = '') {
    if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.'
    if (msg.includes('Email not confirmed')) return 'Please confirm your email before signing in.'
    if (msg.includes('Too many requests')) return 'Too many attempts. Please wait a moment and try again.'
    return msg || 'Something went wrong. Please try again.'
}

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

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const { isAdmin } = useAuthStore()

    const from = location.state?.from?.pathname || '/dashboard'

    // ── Validation ────────────────────────────────────────────────────────────
    function validate() {
        const e = {}
        if (!form.email) e.email = 'Email is required.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
        if (!form.password) e.password = 'Password is required.'
        return e
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        // Clear field error on change
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')

        const fieldErrors = validate()
        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors)
            return
        }

        setLoading(true)
        try {
            await signIn(form)
            // Redirect admins to /admin, regular users to intended destination
            navigate(isAdmin() ? '/admin' : from, { replace: true })
        } catch (err) {
            setServerError(friendlyError(err.message))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 mt-1 text-sm">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
                    {/* Server error banner */}
                    {serverError && (
                        <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {serverError}
                        </div>
                    )}

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
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={`input-field ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="••••••••"
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
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-base relative"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing in…
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 font-medium hover:underline">
                            Sign up free
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
