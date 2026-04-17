import { supabase } from './supabaseClient'

// ── Sign Up ──────────────────────────────────────────────────────────────────

/**
 * Create a new user account.
 * Stores full_name + role:'user' in auth metadata AND upserts a profiles row.
 */
export async function signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'user',
            },
        },
    })
    if (error) throw error

    // Upsert profile row so the profiles table is always in sync.
    // This runs even before email confirmation; the trigger handles it too,
    // but doing it here ensures immediate availability.
    if (data.user) {
        await upsertProfile(data.user.id, { full_name: fullName, role: 'user' })
    }

    return data
}

// ── Sign In ──────────────────────────────────────────────────────────────────

/**
 * Sign in with email + password.
 */
export async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) throw error
    return data
}

// ── Sign Out ─────────────────────────────────────────────────────────────────

/**
 * Sign out the current user and clear persisted auth state.
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// ── Password Reset ───────────────────────────────────────────────────────────

/**
 * Send a password-reset email.
 */
export async function sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
}

/**
 * Update the password for the currently authenticated user.
 */
export async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
}

// ── Session / User ───────────────────────────────────────────────────────────

export async function getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
}

export async function getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
}

// ── Profiles ─────────────────────────────────────────────────────────────────

/**
 * Upsert a row in the public.profiles table.
 */
export async function upsertProfile(userId, fields) {
    const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...fields, updated_at: new Date().toISOString() })
    if (error) throw error
}

/**
 * Fetch a single profile by user id.
 */
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    if (error) throw error
    return data
}

// ── Role Management (admin only) ─────────────────────────────────────────────

/**
 * Update a user's role in the profiles table.
 * The calling user must be an admin (enforced by RLS policy).
 */
export async function updateUserRole(userId, role) {
    const { error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId)
    if (error) throw error
}
