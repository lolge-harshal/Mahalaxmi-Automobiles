import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from './LoadingSpinner'

/**
 * Route guard that handles three states:
 *  1. Auth not yet initialized → show spinner (prevents flash redirect)
 *  2. Not authenticated        → redirect to /login (preserving destination)
 *  3. Authenticated but wrong role → redirect to /dashboard
 *
 * Also calls initialize() directly so hard-refreshing routes outside
 * BaseLayout (e.g. /admin) don't get stuck on the loading spinner.
 */
export default function ProtectedRoute({ requireAdmin = false }) {
    const { initialized, isAuthenticated, isAdmin, initialize } = useAuthStore()
    const location = useLocation()

    useEffect(() => {
        if (!initialized) {
            initialize()
        }
    }, [initialized, initialize])

    // Still resolving session from Supabase / localStorage
    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
