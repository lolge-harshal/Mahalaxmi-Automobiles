/**
 * Inline error state component.
 * Props: message (string), onRetry (fn, optional)
 */
export default function ErrorMessage({ message = 'Something went wrong. Please try again.', onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <p className="text-gray-600 text-sm mb-4">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary text-sm">
                    Try again
                </button>
            )}
        </div>
    )
}
