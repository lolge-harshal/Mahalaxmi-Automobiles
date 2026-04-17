import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

/**
 * Initializes auth state on first mount and exposes all auth helpers.
 * Safe to call in multiple components — initialize() is idempotent.
 */
export function useAuth() {
    const {
        user,
        session,
        role,
        initialized,
        initialize,
        refreshRole,
        clearAuth,
        isAuthenticated,
        isAdmin,
    } = useAuthStore()

    useEffect(() => {
        if (!initialized) {
            initialize()
        }
    }, [initialized, initialize])

    return {
        user,
        session,
        role,
        initialized,
        isAuthenticated,
        isAdmin,
        refreshRole,
        clearAuth,
    }
}
