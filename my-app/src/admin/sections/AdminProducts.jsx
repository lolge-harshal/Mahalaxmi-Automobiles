import { useState } from 'react'
import {
    useAdminProducts, useAdminCreateProduct,
    useAdminUpdateProduct, useAdminDeleteProduct,
} from '../../hooks/useAdmin'
import AdminTable from '../components/AdminTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import SectionLoader from '../components/SectionLoader'

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', description: '', price: '', is_active: true }

function validate(f) {
    const e = {}
    if (!f.name.trim()) e.name = 'Product name is required.'
    if (f.price !== '' && isNaN(Number(f.price))) e.price = 'Price must be a number.'
    return e
}

// ── Car icon (used everywhere instead of images) ──────────────────────────────

function CarIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    )
}

// ── Product form ──────────────────────────────────────────────────────────────

function ProductForm({ initial, onSubmit, onCancel, loading }) {
    const [form, setForm] = useState(initial ?? EMPTY_FORM)
    const [errors, setErrors] = useState({})

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = validate(form)
        if (Object.keys(errs).length) { setErrors(errs); return }
        onSubmit({
            name: form.name.trim(),
            description: form.description.trim() || null,
            price: form.price !== '' ? Number(form.price) : null,
            image_url: null,
            is_active: form.is_active,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                </label>
                <input
                    value={form.name} onChange={(e) => set('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="e.g. Maruti Suzuki Swift VXi"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    rows={3} value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    className="input-field resize-none"
                    placeholder="Brief description of the product…"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                <input
                    type="number" min="0" step="0.01"
                    value={form.price} onChange={(e) => set('price', e.target.value)}
                    className={`input-field ${errors.price ? 'border-red-400' : ''}`}
                    placeholder="e.g. 650000"
                />
                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => set('is_active', !form.is_active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${form.is_active ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                        ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-gray-700">
                    {form.is_active ? 'Active (visible to public)' : 'Inactive (hidden from public)'}
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving…
                        </span>
                    ) : 'Save Product'}
                </button>
                <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </form>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────

const COLS = [
    { key: 'image', label: 'Image', className: 'w-16' },
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', className: 'w-32' },
    { key: 'status', label: 'Status', className: 'w-24' },
    { key: 'actions', label: '', className: 'w-24 text-right' },
]

export default function AdminProducts() {
    const { data, isLoading, isError, refetch } = useAdminProducts()
    const createMut = useAdminCreateProduct()
    const updateMut = useAdminUpdateProduct()
    const deleteMut = useAdminDeleteProduct()

    const [modal, setModal] = useState(null)   // null | 'create' | product obj
    const [confirm, setConfirm] = useState(null)   // null | product obj

    const isSaving = createMut.isPending || updateMut.isPending
    const isDeleting = deleteMut.isPending

    const openCreate = () => setModal('create')
    const openEdit = (p) => setModal(p)
    const closeModal = () => { setModal(null); createMut.reset(); updateMut.reset() }

    const handleSave = (fields) => {
        if (modal === 'create') {
            createMut.mutate(fields, { onSuccess: closeModal })
        } else {
            updateMut.mutate({ id: modal.id, fields }, { onSuccess: closeModal })
        }
    }

    const handleDelete = () => {
        deleteMut.mutate(confirm.id, {
            onSuccess: () => setConfirm(null),
        })
    }

    if (isLoading) return <SectionLoader />
    if (isError) return (
        <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-3">Failed to load products.</p>
            <button onClick={refetch} className="btn-secondary">Retry</button>
        </div>
    )

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Products</h2>
                    <p className="text-sm text-gray-500">{data.length} total</p>
                </div>
                <button onClick={openCreate} className="btn-primary">Add Product</button>
            </div>

            {/* Mutation errors */}
            {(createMut.isError || updateMut.isError) && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {(createMut.error ?? updateMut.error)?.message ?? 'An error occurred.'}
                </div>
            )}

            <AdminTable
                columns={COLS}
                rows={data}
                empty="No products yet. Click Add Product to get started."
                renderRow={(p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                            <div className="w-12 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                <CarIcon className="w-6 h-6 text-primary-400" />
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{p.name}</p>
                            {p.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>
                            )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                            {p.price != null
                                ? `₹${Number(p.price).toLocaleString('en-IN')}`
                                : <span className="text-gray-400 text-xs">—</span>
                            }
                        </td>
                        <td className="px-4 py-3">
                            <StatusBadge status={p.is_active ? 'active' : 'inactive'} />
                        </td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => openEdit(p)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setConfirm(p)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
            />

            {/* Create / Edit modal */}
            <FormModal
                open={!!modal}
                title={modal === 'create' ? 'Add Product' : `Edit — ${modal?.name}`}
                onClose={closeModal}
            >
                <ProductForm
                    initial={modal !== 'create' ? {
                        name: modal?.name ?? '',
                        description: modal?.description ?? '',
                        price: modal?.price ?? '',
                        is_active: modal?.is_active ?? true,
                    } : undefined}
                    onSubmit={handleSave}
                    onCancel={closeModal}
                    loading={isSaving}
                />
            </FormModal>

            {/* Delete confirm */}
            <ConfirmDialog
                open={!!confirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${confirm?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                danger
                loading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirm(null)}
            />
        </>
    )
}
