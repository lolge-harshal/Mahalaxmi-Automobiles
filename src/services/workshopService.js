import { supabase } from './supabaseClient'

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts({ limit, featured } = {}) {
    let query = supabase
        .from('products')
        .select('id, name, description, price, image_url, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data ?? []
}

export async function fetchProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()
    if (error) throw error
    return data
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function fetchServices({ limit } = {}) {
    let query = supabase
        .from('services')
        .select('id, title, description, price')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data ?? []
}

// ── Website Content ───────────────────────────────────────────────────────────

export async function fetchPageContent(page) {
    const { data, error } = await supabase
        .from('website_content')
        .select('section, content')
        .eq('page', page)
        .eq('is_active', true)

    if (error) throw error

    // Transform array into { section: content } map for easy access
    return (data ?? []).reduce((acc, row) => {
        acc[row.section] = row.content
        return acc
    }, {})
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

/**
 * Fetch all enquiries for the currently authenticated user.
 * Joins product name so we can display it without a second query.
 */
export async function fetchMyEnquiries() {
    const { data, error } = await supabase
        .from('enquiries')
        .select(`
            id,
            message,
            status,
            created_at,
            updated_at,
            products ( id, name, image_url )
        `)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
}

/**
 * Submit a new enquiry for a product.
 * user_id is enforced server-side via RLS (auth.uid() = user_id).
 */
export async function submitEnquiry({ productId, message }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be logged in to send an enquiry.')

    const { error } = await supabase
        .from('enquiries')
        .insert({ user_id: user.id, product_id: productId, message })

    if (error) throw error
}

// ── Contact Messages ──────────────────────────────────────────────────────────

export async function submitContactMessage({ name, email, phone, message }) {
    const { error } = await supabase
        .from('contact_messages')
        .insert({ name, email, phone: phone || null, message })
    if (error) throw error
}
