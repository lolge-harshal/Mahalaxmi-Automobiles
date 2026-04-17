import { supabase } from './supabaseClient'

// ── Products ──────────────────────────────────────────────────────────────────

export async function adminFetchProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, is_active, created_at')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
}

export async function adminCreateProduct({ name, description, price, image_url, is_active }) {
    const { data, error } = await supabase
        .from('products')
        .insert({ name, description, price: price || null, image_url: image_url || null, is_active })
        .select()
        .single()
    if (error) throw error
    return data
}

export async function adminUpdateProduct(id, fields) {
    const { data, error } = await supabase
        .from('products')
        .update(fields)
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function adminDeleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
}

// ── Product image upload ──────────────────────────────────────────────────────

export async function uploadProductImage(file) {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false })
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
}

export async function deleteProductImage(imageUrl) {
    if (!imageUrl) return
    // Extract the path after the bucket name in the URL
    const marker = '/product-images/'
    const idx = imageUrl.indexOf(marker)
    if (idx === -1) return
    const path = imageUrl.slice(idx + marker.length)
    await supabase.storage.from('product-images').remove([path])
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function adminFetchServices() {
    const { data, error } = await supabase
        .from('services')
        .select('id, title, description, price, is_active, sort_order')
        .order('sort_order', { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function adminCreateService({ title, description, price, is_active, sort_order }) {
    const { data, error } = await supabase
        .from('services')
        .insert({ title, description, price: price || null, is_active, sort_order: sort_order ?? 0 })
        .select()
        .single()
    if (error) throw error
    return data
}

export async function adminUpdateService(id, fields) {
    const { data, error } = await supabase
        .from('services')
        .update(fields)
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function adminDeleteService(id) {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) throw error
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

export async function adminFetchEnquiries() {
    const { data, error } = await supabase
        .from('enquiries')
        .select(`
            id, message, status, admin_notes, created_at, updated_at,
            user_id,
            products ( id, name )
        `)
        .order('created_at', { ascending: false })
    if (error) throw error

    if (!data || data.length === 0) return []

    // Fetch profile names in a single query for all unique user_ids
    const userIds = [...new Set(data.map((e) => e.user_id))]
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds)

    const profileMap = (profiles ?? []).reduce((acc, p) => {
        acc[p.id] = p
        return acc
    }, {})

    return data.map((e) => ({
        ...e,
        profiles: profileMap[e.user_id] ?? null,
    }))
}

export async function adminUpdateEnquiry(id, { status, admin_notes }) {
    const { data, error } = await supabase
        .from('enquiries')
        .update({ status, admin_notes })
        .eq('id', id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function adminDeleteEnquiry(id) {
    const { error } = await supabase.from('enquiries').delete().eq('id', id)
    if (error) throw error
}

// ── Website Content ───────────────────────────────────────────────────────────

export async function adminFetchAllContent() {
    const { data, error } = await supabase
        .from('website_content')
        .select('id, page, section, content, is_active, updated_at')
        .order('page')
        .order('section')
    if (error) throw error
    return data ?? []
}

export async function adminUpsertContent({ page, section, content, is_active }) {
    const { data, error } = await supabase
        .from('website_content')
        .upsert(
            { page, section, content, is_active, updated_at: new Date().toISOString() },
            { onConflict: 'page,section' }
        )
        .select()
        .single()
    if (error) throw error
    return data
}
