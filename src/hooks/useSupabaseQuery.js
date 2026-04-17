import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRows, insertRow, updateRow, deleteRow } from '../services/apiService'

/**
 * Fetch rows from a Supabase table with React Query caching.
 */
export function useSupabaseQuery(table, options = {}, queryOptions = {}) {
    return useQuery({
        queryKey: [table, options],
        queryFn: () => fetchRows(table, options),
        ...queryOptions,
    })
}

/**
 * Insert a row and invalidate the table cache.
 */
export function useInsertRow(table) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload) => insertRow(table, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
    })
}

/**
 * Update a row and invalidate the table cache.
 */
export function useUpdateRow(table) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }) => updateRow(table, id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
    })
}

/**
 * Delete a row and invalidate the table cache.
 */
export function useDeleteRow(table) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => deleteRow(table, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
    })
}
