import { supabase } from './supabaseClient'

/**
 * Generic helper to fetch rows from any Supabase table.
 * @param {string} table - Table name
 * @param {object} options - { columns, filters, order, limit }
 */
export async function fetchRows(table, { columns = '*', filters = {}, order, limit } = {}) {
    let query = supabase.from(table).select(columns)

    Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
    })

    if (order) query = query.order(order.column, { ascending: order.ascending ?? true })
    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error
    return data
}

/**
 * Insert a row into a table.
 */
export async function insertRow(table, payload) {
    const { data, error } = await supabase.from(table).insert(payload).select()
    if (error) throw error
    return data
}

/**
 * Update a row by id.
 */
export async function updateRow(table, id, payload) {
    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select()
    if (error) throw error
    return data
}

/**
 * Delete a row by id.
 */
export async function deleteRow(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
}
