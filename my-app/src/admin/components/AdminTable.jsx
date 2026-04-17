/**
 * Reusable admin table shell.
 * Props: columns (array of { key, label, className }), rows (array), renderRow (fn), empty (string)
 */
export default function AdminTable({ columns, rows, renderRow, empty = 'No records found.' }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.className ?? ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {rows && rows.length > 0
                        ? rows.map(renderRow)
                        : (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 text-sm">
                                    {empty}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
