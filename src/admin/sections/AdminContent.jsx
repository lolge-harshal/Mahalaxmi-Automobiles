import { useState } from 'react'
import { useAdminContent, useAdminUpsertContent } from '../../hooks/useAdmin'
import SectionLoader from '../components/SectionLoader'

// ── JSON editor for a single content row ─────────────────────────────────────

function ContentEditor({ row, onSaved }) {
    const [raw, setRaw] = useState(JSON.stringify(row.content, null, 2))
    const [active, setActive] = useState(row.is_active)
    const [jsonErr, setJsonErr] = useState('')
    const upsert = useAdminUpsertContent()

    const handleSave = () => {
        let parsed
        try {
            parsed = JSON.parse(raw)
            setJsonErr('')
        } catch {
            setJsonErr('Invalid JSON. Please fix the syntax before saving.')
            return
        }
        upsert.mutate(
            { page: row.page, section: row.section, content: parsed, is_active: active },
            { onSuccess: onSaved }
        )
    }

    return (
        <div className="space-y-3">
            {/* Active toggle */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setActive((v) => !v)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                        ${active ? 'bg-primary-600' : 'bg-gray-200'}`}
                >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
                        ${active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-xs text-gray-600">{active ? 'Active' : 'Inactive'}</span>
            </div>

            {/* JSON textarea */}
            <textarea
                rows={10}
                value={raw}
                onChange={(e) => { setRaw(e.target.value); setJsonErr('') }}
                className={`input-field font-mono text-xs resize-y ${jsonErr ? 'border-red-400' : ''}`}
                spellCheck={false}
            />
            {jsonErr && <p className="text-xs text-red-600">{jsonErr}</p>}

            {upsert.isError && (
                <p className="text-xs text-red-600">{upsert.error?.message ?? 'Save failed.'}</p>
            )}
            {upsert.isSuccess && (
                <p className="text-xs text-green-600">Saved successfully.</p>
            )}

            <button onClick={handleSave} disabled={upsert.isPending} className="btn-primary w-full">
                {upsert.isPending ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving…
                    </span>
                ) : 'Save Content'}
            </button>
        </div>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function AdminContent() {
    const { data, isLoading, isError, refetch } = useAdminContent()
    const [openKey, setOpenKey] = useState(null)   // "page:section"

    if (isLoading) return <SectionLoader />
    if (isError) return (
        <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-3">Failed to load content.</p>
            <button onClick={refetch} className="btn-secondary">Retry</button>
        </div>
    )

    // Group by page
    const pages = data.reduce((acc, row) => {
        if (!acc[row.page]) acc[row.page] = []
        acc[row.page].push(row)
        return acc
    }, {})

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Website Content</h2>
                <p className="text-sm text-gray-500">
                    Edit the JSON content for each page section. Changes are reflected on the public site immediately.
                </p>
            </div>

            <div className="space-y-6">
                {Object.entries(pages).map(([page, rows]) => (
                    <div key={page} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Page header */}
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 capitalize">{page} Page</h3>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {rows.map((row) => {
                                const key = `${row.page}:${row.section}`
                                const isOpen = openKey === key
                                return (
                                    <div key={key}>
                                        {/* Section accordion header */}
                                        <button
                                            onClick={() => setOpenKey(isOpen ? null : key)}
                                            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-800 capitalize">
                                                    {row.section}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                                                    ${row.is_active
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                                    }`}
                                                >
                                                    {row.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">
                                                    Updated {new Date(row.updated_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short',
                                                    })}
                                                </span>
                                                <svg
                                                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>

                                        {/* Editor */}
                                        {isOpen && (
                                            <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50">
                                                <ContentEditor
                                                    row={row}
                                                    onSaved={() => { }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {Object.keys(pages).length === 0 && (
                    <div className="text-center py-12 text-sm text-gray-400">
                        No content records found. Run the migration seed to populate defaults.
                    </div>
                )}
            </div>
        </>
    )
}
