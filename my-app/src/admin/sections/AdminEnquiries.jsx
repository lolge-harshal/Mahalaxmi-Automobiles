import { useState } from 'react'
import {
    useAdminEnquiries, useAdminUpdateEnquiry, useAdminDeleteEnquiry,
} from '../../hooks/useAdmin'
import FormModal from '../components/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import SectionLoader from '../components/SectionLoader'
import AdminTable from '../components/AdminTable'

const STATUSES = ['pending', 'in_progress', 'resolved', 'closed']

// ── Detail / edit panel ───────────────────────────────────────────────────────

function EnquiryDetail({ enquiry, onClose }) {
    const [status, setStatus] = useState(enquiry.status)
    const [notes, setNotes] = useState(enquiry.admin_notes ?? '')
    const updateMut = useAdminUpdateEnquiry()

    const handleSave = () => {
        updateMut.mutate(
            { id: enquiry.id, status, admin_notes: notes },
            { onSuccess: onClose }
        )
    }

    const user = enquiry.profiles
    const product = enquiry.products

    return (
        <div className="space-y-5">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Customer</p>
                    <p className="text-gray-800 font-medium">{user?.full_name ?? '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Product</p>
                    <p className="text-gray-800 font-medium">{product?.name ?? 'General Enquiry'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Submitted</p>
                    <p className="text-gray-700">
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                        })}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Current Status</p>
                    <StatusBadge status={enquiry.status} />
                </div>
            </div>

            {/* Message */}
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Customer Message</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {enquiry.message}
                </div>
            </div>

            {/* Update status */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-field"
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>

            {/* Admin notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Notes
                    <span className="text-gray-400 font-normal text-xs ml-1">(not visible to customer)</span>
                </label>
                <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Add internal notes about this enquiry…"
                />
            </div>

            {updateMut.isError && (
                <p className="text-sm text-red-600">{updateMut.error?.message ?? 'Update failed.'}</p>
            )}

            <div className="flex gap-3">
                <button onClick={handleSave} disabled={updateMut.isPending} className="btn-primary flex-1">
                    {updateMut.isPending ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving…
                        </span>
                    ) : 'Save Changes'}
                </button>
                <button onClick={onClose} disabled={updateMut.isPending} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────

const COLS = [
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'message', label: 'Message', className: 'max-w-xs' },
    { key: 'status', label: 'Status', className: 'w-28' },
    { key: 'date', label: 'Date', className: 'w-28' },
    { key: 'actions', label: '', className: 'w-20 text-right' },
]

const STATUS_FILTER_OPTIONS = ['all', ...STATUSES]

export default function AdminEnquiries() {
    const { data, isLoading, isError, refetch } = useAdminEnquiries()
    const deleteMut = useAdminDeleteEnquiry()

    const [selected, setSelected] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all' ? data : data?.filter((e) => e.status === filter)

    if (isLoading) return <SectionLoader />
    if (isError) return (
        <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-3">Failed to load enquiries.</p>
            <button onClick={refetch} className="btn-secondary">Retry</button>
        </div>
    )

    // Summary counts
    const counts = STATUSES.reduce((acc, s) => {
        acc[s] = data.filter((e) => e.status === s).length
        return acc
    }, {})

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Enquiries</h2>
                    <p className="text-sm text-gray-500">{data.length} total</p>
                </div>
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 mb-5">
                {STATUS_FILTER_OPTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                            ${filter === s
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                            }`}
                    >
                        {s === 'all'
                            ? `All (${data.length})`
                            : `${s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} (${counts[s] ?? 0})`
                        }
                    </button>
                ))}
            </div>

            <AdminTable
                columns={COLS}
                rows={filtered}
                empty="No enquiries match the selected filter."
                renderRow={(e) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 text-sm">
                                {e.profiles?.full_name ?? 'Unknown'}
                            </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                            {e.products?.name ?? <span className="text-gray-400">General</span>}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                            <p className="text-sm text-gray-600 line-clamp-2">{e.message}</p>
                        </td>
                        <td className="px-4 py-3">
                            <StatusBadge status={e.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                            {new Date(e.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                            })}
                        </td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setSelected(e)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                    title="View / Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setConfirm(e)}
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

            <FormModal
                open={!!selected}
                title="Enquiry Details"
                onClose={() => setSelected(null)}
            >
                {selected && (
                    <EnquiryDetail enquiry={selected} onClose={() => setSelected(null)} />
                )}
            </FormModal>

            <ConfirmDialog
                open={!!confirm}
                title="Delete Enquiry"
                message="Are you sure you want to permanently delete this enquiry?"
                confirmLabel="Delete"
                danger
                loading={deleteMut.isPending}
                onConfirm={() => deleteMut.mutate(confirm.id, { onSuccess: () => setConfirm(null) })}
                onCancel={() => setConfirm(null)}
            />
        </>
    )
}
