import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../services/supabaseClient'

/**
 * Fetch the role for a given user id from the profiles table.
 * Falls back to 'user' if the row doesn't exist yet.
 */
async function fetchRole(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    if (error || !data) return 'user'
    return data.role ?? 'user'
}

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            role: 'user',       // 'user' | 'admin'
            initialized: false,

            /**
             * Bootstrap: resolve the current session, load role, then subscribe
             * to future auth state changes. Call once at app mount.
             */
            initialize: async () => {
                const {
                    data: { session },
                } = await supabase.auth.getSession()

                let role = 'user'
                if (session?.user) {
                    role = await fetchRole(session.user.id)
                }

                set({ session, user: session?.user ?? null, role, initialized: true })

                supabase.auth.onAuthStateChange(async (_event, session) => {
                    let role = 'user'
                    if (session?.user) {
                        role = await fetchRole(session.user.id)
                    }
                    set({ session, user: session?.user ?? null, role })
                })
            },

            /** Manually refresh the role (e.g. after an admin promotes a user). */
            refreshRole: async () => {
                const userId = get().user?.id
                if (!userId) return
                const role = await fetchRole(userId)
                set({ role })
            },

            /** Clear all auth state (called after sign-out). */
            clearAuth: () => set({ user: null, session: null, role: 'user' }),

            // ── Derived helpers ──────────────────────────────────────────────────
            isAuthenticated: () => !!get().session,
            isAdmin: () => get().role === 'admin',
        }),
        {
            name: 'auth-storage',          // localStorage key
            // Only persist the minimal fields needed to avoid stale data
            // NOTE: initialized is intentionally NOT persisted — it must
            // always start false so initialize() runs on every page load.
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                role: state.role,
            }),
        }
    )
)
