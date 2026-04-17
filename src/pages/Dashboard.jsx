import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMyEnquiries } from '../hooks/useWorkshop'
import ErrorMessage from '../components/ErrorMessage'
import SEO from '../components/SEO'

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    in_progress: 'bg-blue-50   text-blue-700   border-blue-200',
    resolved: 'bg-green-50  text-green-700  border-green-200',
    closed: 'bg-gray-100  text-gray-500   border-gray-200',
}

const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
}

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending
    const label = STATUS_LABELS[status] ?? status
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {label}
        </span>
    )
}

// ── Enquiry row ───────────────────────────────────────────────────────────────

function EnquiryRow({ enquiry }) {
    const [expanded, setExpanded] = useState(false)
    const product = enquiry.products

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Summary row */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
            >
                {/* Product thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {product?.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                        {product?.name ?? 'General Enquiry'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                        })}
                    </p>
                </div>

                {/* Status + chevron */}
                <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={enquiry.status} />
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded message */}
            {expanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-50 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1">Your Message</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
                    {enquiry.updated_at !== enquiry.created_at && (
                        <p className="text-xs text-gray-400 mt-2">
                            Last updated: {new Date(enquiry.updated_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Enquiry list ──────────────────────────────────────────────────────────────

function EnquiryList() {
    const { data, isLoading, isError, refetch } = useMyEnquiries()

    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                        <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </div>
                ))}
            </div>
        )
    }

    if (isError) {
        return <ErrorMessage message="Could not load your enquiries." onRetry={refetch} />
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">No enquiries yet</p>
                <p className="text-xs text-gray-400 mb-4">
                    Browse our products and click Enquire to get started.
                </p>
                <Link to="/products" className="btn-primary text-xs px-5">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {data.map((enquiry) => (
                <EnquiryRow key={enquiry.id} enquiry={enquiry} />
            ))}
        </div>
    )
}

// ── Stats strip ───────────────────────────────────────────────────────────────

function EnquiryStats({ data }) {
    if (!data) return null

    const total = data.length
    const pending = data.filter((e) => e.status === 'pending').length
    const resolved = data.filter((e) => e.status === 'resolved').length

    const stats = [
        { label: 'Total Enquiries', value: total },
        { label: 'Pending', value: pending },
        { label: 'Resolved', value: resolved },
    ]

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((s) => (
                <div key={s.label} className="card text-center py-4">
                    <div className="text-2xl font-bold text-primary-600 mb-0.5">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                </div>
            ))}
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const { user } = useAuthStore()
    const { data: enquiries } = useMyEnquiries()

    const name = user?.user_metadata?.full_name || 'User'
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—'

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
            <SEO title="My Dashboard" noIndex />
            {/* ── Top bar ── */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome, {name}</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage your enquiries and account details.
                            </p>
                        </div>
                        <Link to="/products" className="btn-primary self-start sm:self-auto">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Left: Account card ── */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card">
                            <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-400">
                                Account Details
                            </h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-50">
                                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-lg">
                                        {name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Email</p>
                                    <p className="text-gray-700 truncate">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Full Name</p>
                                    <p className="text-gray-700">{name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Member Since</p>
                                    <p className="text-gray-700">{memberSince}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div className="card">
                            <h2 className="font-semibold text-gray-400 text-xs uppercase tracking-wide mb-3">
                                Quick Links
                            </h2>
                            <nav className="space-y-1">
                                {[
                                    { label: 'Browse Products', to: '/products' },
                                    { label: 'Our Services', to: '/services' },
                                    { label: 'Contact Us', to: '/contact' },
                                ].map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                                    >
                                        {link.label}
                                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* ── Right: Enquiries ── */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">My Enquiries</h2>
                            <Link to="/products" className="text-sm text-primary-600 hover:underline font-medium">
                                New Enquiry
                            </Link>
                        </div>

                        <EnquiryStats data={enquiries} />
                        <EnquiryList />
                    </div>
                </div>
            </div>
        </div>
    )
}
