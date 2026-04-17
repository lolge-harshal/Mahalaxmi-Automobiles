import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <SEO title="Page Not Found" noIndex />
            <div className="text-center">
                <p className="text-8xl font-bold text-primary-200 mb-4">404</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn-primary px-6 py-3">
                    Back to home
                </Link>
            </div>
        </div>
    )
}
