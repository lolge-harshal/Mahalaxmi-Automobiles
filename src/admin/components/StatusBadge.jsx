const STYLES = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    in_progress: 'bg-blue-50   text-blue-700   border-blue-200',
    resolved: 'bg-green-50  text-green-700  border-green-200',
    closed: 'bg-gray-100  text-gray-500   border-gray-200',
    active: 'bg-green-50  text-green-700  border-green-200',
    inactive: 'bg-gray-100  text-gray-500   border-gray-200',
}

const LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    active: 'Active',
    inactive: 'Inactive',
}

export default function StatusBadge({ status }) {
    const style = STYLES[status] ?? STYLES.pending
    const label = LABELS[status] ?? status
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {label}
        </span>
    )
}
