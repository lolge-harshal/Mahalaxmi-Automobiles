import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { signOut } from '../services/authService'

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [signingOut, setSigningOut] = useState(false)
    const { user, role, isAuthenticated, isAdmin, clearAuth } = useAuthStore()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        setSigningOut(true)
        try {
            await signOut()
            clearAuth()
            navigate('/')
        } finally {
            setSigningOut(false)
            setMenuOpen(false)
        }
    }

    const linkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`

    const mobileLinkClass = ({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`

    const authenticated = isAuthenticated()
    const admin = isAdmin()

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MA</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">Mahalaxmi Automobiles</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                                {link.label}
                            </NavLink>
                        ))}
                        {authenticated && (
                            <NavLink to="/dashboard" className={linkClass}>
                                Dashboard
                            </NavLink>
                        )}
                        {admin && (
                            <NavLink to="/admin" className={linkClass}>
                                Admin
                            </NavLink>
                        )}
                    </div>

                    {/* Auth area */}
                    <div className="hidden md:flex items-center gap-3">
                        {authenticated ? (
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${admin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {role}
                                </span>
                                <span className="text-sm text-gray-500 truncate max-w-[160px]" title={user?.email}>
                                    {user?.email}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    disabled={signingOut}
                                    className="btn-secondary text-xs px-4 py-2"
                                >
                                    {signingOut ? 'Signing out…' : 'Sign out'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary text-xs px-4 py-2">Log in</Link>
                                <Link to="/signup" className="btn-primary text-xs px-4 py-2">Sign up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={mobileLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        {authenticated && (
                            <NavLink to="/dashboard" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                                Dashboard
                            </NavLink>
                        )}
                        {admin && (
                            <NavLink to="/admin" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                                Admin
                            </NavLink>
                        )}

                        <div className="pt-2 px-3 space-y-2">
                            {authenticated ? (
                                <>
                                    <div className="flex items-center gap-2 py-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${admin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {role}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        disabled={signingOut}
                                        className="btn-secondary w-full"
                                    >
                                        {signingOut ? 'Signing out…' : 'Sign out'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-secondary w-full text-center block" onClick={() => setMenuOpen(false)}>
                                        Log in
                                    </Link>
                                    <Link to="/signup" className="btn-primary w-full text-center block" onClick={() => setMenuOpen(false)}>
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
