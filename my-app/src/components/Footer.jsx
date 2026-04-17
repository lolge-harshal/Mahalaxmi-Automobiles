import { Link } from 'react-router-dom'

const footerLinks = {
    Company: [
        { label: 'About', to: '/about' },
        { label: 'Services', to: '/services' },
        { label: 'Products', to: '/products' },
        { label: 'Contact', to: '/contact' },
    ],
    Account: [
        { label: 'Log in', to: '/login' },
        { label: 'Sign up', to: '/signup' },
        { label: 'Dashboard', to: '/dashboard' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">MA</span>
                            </div>
                            <span className="font-semibold text-white text-lg">Mahalaxmi Automobiles</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Your trusted partner for quality vehicles and professional automotive services.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h3 className="text-white font-semibold text-sm mb-3">{section}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="text-sm hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-800 text-sm text-center">
                    &copy; {new Date().getFullYear()} Mahalaxmi Automobiles. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
