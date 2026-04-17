import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    adminFetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
    adminFetchServices, adminCreateService, adminUpdateService, adminDeleteService,
    adminFetchEnquiries, adminUpdateEnquiry, adminDeleteEnquiry,
    adminFetchAllContent, adminUpsertContent,
} from '../services/adminService'

const invalidate = (qc, key) => qc.invalidateQueries({ queryKey: key })

// ── Products ──────────────────────────────────────────────────────────────────

export function useAdminProducts() {
    return useQuery({ queryKey: ['admin', 'products'], queryFn: adminFetchProducts })
}

export function useAdminCreateProduct() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminCreateProduct,
        onSuccess: () => {
            invalidate(qc, ['admin', 'products'])
            invalidate(qc, ['products'])
        },
    })
}

export function useAdminUpdateProduct() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, fields }) => adminUpdateProduct(id, fields),
        onSuccess: () => {
            invalidate(qc, ['admin', 'products'])
            invalidate(qc, ['products'])
        },
    })
}

export function useAdminDeleteProduct() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminDeleteProduct,
        onSuccess: () => {
            invalidate(qc, ['admin', 'products'])
            invalidate(qc, ['products'])
        },
    })
}

// ── Services ──────────────────────────────────────────────────────────────────

export function useAdminServices() {
    return useQuery({ queryKey: ['admin', 'services'], queryFn: adminFetchServices })
}

export function useAdminCreateService() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminCreateService,
        onSuccess: () => {
            invalidate(qc, ['admin', 'services'])
            invalidate(qc, ['services'])
        },
    })
}

export function useAdminUpdateService() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, fields }) => adminUpdateService(id, fields),
        onSuccess: () => {
            invalidate(qc, ['admin', 'services'])
            invalidate(qc, ['services'])
        },
    })
}

export function useAdminDeleteService() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminDeleteService,
        onSuccess: () => {
            invalidate(qc, ['admin', 'services'])
            invalidate(qc, ['services'])
        },
    })
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

export function useAdminEnquiries() {
    return useQuery({ queryKey: ['admin', 'enquiries'], queryFn: adminFetchEnquiries })
}

export function useAdminUpdateEnquiry() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status, admin_notes }) => adminUpdateEnquiry(id, { status, admin_notes }),
        onSuccess: () => invalidate(qc, ['admin', 'enquiries']),
    })
}

export function useAdminDeleteEnquiry() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminDeleteEnquiry,
        onSuccess: () => invalidate(qc, ['admin', 'enquiries']),
    })
}

// ── Website Content ───────────────────────────────────────────────────────────

export function useAdminContent() {
    return useQuery({ queryKey: ['admin', 'content'], queryFn: adminFetchAllContent })
}

export function useAdminUpsertContent() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: adminUpsertContent,
        onSuccess: () => {
            invalidate(qc, ['admin', 'content'])
            invalidate(qc, ['website_content'])
        },
    })
}
