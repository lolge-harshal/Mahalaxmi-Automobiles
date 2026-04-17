import { useState } from 'react'
import {
    useAdminServices, useAdminCreateService,
    useAdminUpdateService, useAdminDeleteService,
} from '../../hooks/useAdmin'
import AdminTable from '../components/AdminTable'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import SectionLoader from '../components/SectionLoader'

const EMPTY_FORM = { title: '', description: '', price: '', is_active: true, sort_order: '0' }

function validate(f) {
    const e = {}
    if (!f.title.trim()) e.title = 'Service title is required.'
    if (f.price !== '' && isNaN(Number(f.price))) e.price = 'Price must be a number.'
    return e
}

function ServiceForm({ initial, onSubmit, onCancel, loading }) {
    const [form, setForm] = useState(initial ?? EMPTY_FORM)
    const [errors, setErrors] = useState({})
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = validate(form)
        if (Object.keys(errs).length) { setErrors(errs); return }
        onSubmit({
            title: form.title.trim(),
            description: form.description.trim() || null,
            price: form.price !== '' ? Number(form.price) : null,
            is_active: form.is_active,
            sort_order: Number(form.sort_order) || 0,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Title <span className="text-red-500">*</span>
                </label>
                <input
                    value={form.title} onChange={(e) => set('title', e.target.value)}
                    className={`input-field ${errors.title ? 'border-red-400' : ''}`}
                    placeholder="e.g. Engine Oil Change"
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    rows={3} value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    className="input-field resize-none"
                    placeholder="Brief description of the service…"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Starting Price (INR)
                        <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
                    </label>
                    <input
                        type="number" min="0" step="0.01"
                        value={form.price} onChange={(e) => set('price', e.target.value)}
                        className={`input-field ${errors.price ? 'border-red-400' : ''}`}
                        placeholder="e.g. 500"
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                        type="number" min="0"
                        value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)}
                        className="input-field"
                        placeholder="0"
                    />
                </div>
            </div>

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
                    {form.is_active ? 'Active (visible to public)' : 'Inactive (hidden)'}
                </span>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving…
                        </span>
                    ) : 'Save Service'}
                </button>
                <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </form>
    )
}

const COLS = [
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price', className: 'w-32' },
    { key: 'order', label: 'Order', className: 'w-20' },
    { key: 'status', label: 'Status', className: 'w-24' },
    { key: 'actions', label: '', className: 'w-24 text-right' },
]

export default function AdminServices() {
    const { data, isLoading, isError, refetch } = useAdminServices()
    const createMut = useAdminCreateService()
    const updateMut = useAdminUpdateService()
    const deleteMut = useAdminDeleteService()

    const [modal, setModal] = useState(null)
    const [confirm, setConfirm] = useState(null)

    const isSaving = createMut.isPending || updateMut.isPending
    const isDeleting = deleteMut.isPending

    const closeModal = () => { setModal(null); createMut.reset(); updateMut.reset() }

    const handleSave = (fields) => {
        if (modal === 'create') {
            createMut.mutate(fields, { onSuccess: closeModal })
        } else {
            updateMut.mutate({ id: modal.id, fields }, { onSuccess: closeModal })
        }
    }

    if (isLoading) return <SectionLoader />
    if (isError) return (
        <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-3">Failed to load services.</p>
            <button onClick={refetch} className="btn-secondary">Retry</button>
        </div>
    )

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Services</h2>
                    <p className="text-sm text-gray-500">{data.length} total</p>
                </div>
                <button onClick={() => setModal('create')} className="btn-primary">Add Service</button>
            </div>

            {(createMut.isError || updateMut.isError) && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {(createMut.error ?? updateMut.error)?.message ?? 'An error occurred.'}
                </div>
            )}

            <AdminTable
                columns={COLS}
                rows={data}
                empty="No services yet. Click Add Service to get started."
                renderRow={(s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{s.title}</p>
                            {s.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                            )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                            {s.price != null
                                ? `₹${Number(s.price).toLocaleString('en-IN')}`
                                : <span className="text-gray-400 text-xs">On request</span>
                            }
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-center">{s.sort_order}</td>
                        <td className="px-4 py-3">
                            <StatusBadge status={s.is_active ? 'active' : 'inactive'} />
                        </td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setModal(s)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setConfirm(s)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

            <FormModal
                open={!!modal}
                title={modal === 'create' ? 'Add Service' : `Edit — ${modal?.title}`}
                onClose={closeModal}
            >
                <ServiceForm
                    initial={modal !== 'create' ? {
                        title: modal?.title ?? '',
                        description: modal?.description ?? '',
                        price: modal?.price ?? '',
                        is_active: modal?.is_active ?? true,
                        sort_order: modal?.sort_order ?? '0',
                    } : undefined}
                    onSubmit={handleSave}
                    onCancel={closeModal}
                    loading={isSaving}
                />
            </FormModal>

            <ConfirmDialog
                open={!!confirm}
                title="Delete Service"
                message={`Are you sure you want to delete "${confirm?.title}"?`}
                confirmLabel="Delete"
                danger
                loading={isDeleting}
                onConfirm={() => deleteMut.mutate(confirm.id, { onSuccess: () => setConfirm(null) })}
                onCancel={() => setConfirm(null)}
            />
        </>
    )
}
