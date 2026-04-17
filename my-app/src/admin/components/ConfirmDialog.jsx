/**
 * Generic confirmation dialog.
 * Props: open, title, message, confirmLabel, danger, onConfirm, onCancel, loading
 */
export default function ConfirmDialog({
    open, title, message,
    confirmLabel = 'Confirm', danger = false,
    onConfirm, onCancel, loading = false,
}) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} disabled={loading} className="btn-secondary">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm
                            transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            ${danger
                                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing…
                            </span>
                        ) : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
