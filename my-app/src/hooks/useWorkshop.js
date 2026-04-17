import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    fetchProducts,
    fetchProductById,
    fetchServices,
    fetchPageContent,
    submitContactMessage,
    fetchMyEnquiries,
    submitEnquiry,
} from '../services/workshopService'

// ── Products ──────────────────────────────────────────────────────────────────

export function useProducts(options = {}) {
    return useQuery({
        queryKey: ['products', options],
        queryFn: () => fetchProducts(options),
        staleTime: 1000 * 60 * 5,
    })
}

export function useProduct(id) {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    })
}

// ── Services ──────────────────────────────────────────────────────────────────

export function useServices(options = {}) {
    return useQuery({
        queryKey: ['services', options],
        queryFn: () => fetchServices(options),
        staleTime: 1000 * 60 * 5,
    })
}

// ── Website Content ───────────────────────────────────────────────────────────

export function usePageContent(page) {
    return useQuery({
        queryKey: ['website_content', page],
        queryFn: () => fetchPageContent(page),
        staleTime: 1000 * 60 * 10,
    })
}

// ── Contact ───────────────────────────────────────────────────────────────────

export function useSubmitContact() {
    return useMutation({
        mutationFn: submitContactMessage,
    })
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

export function useMyEnquiries() {
    return useQuery({
        queryKey: ['enquiries', 'mine'],
        queryFn: fetchMyEnquiries,
        staleTime: 1000 * 60 * 2,
    })
}

export function useSubmitEnquiry() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: submitEnquiry,
        onSuccess: () => {
            // Refresh the enquiries list after a successful submission
            queryClient.invalidateQueries({ queryKey: ['enquiries', 'mine'] })
        },
    })
}
