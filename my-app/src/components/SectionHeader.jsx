/**
 * Reusable section heading with optional subtitle.
 * Props: title, subtitle, centered (bool)
 */
export default function SectionHeader({ title, subtitle, centered = true }) {
    return (
        <div className={centered ? 'text-center mb-12' : 'mb-10'}>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            {subtitle && (
                <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
            )}
        </div>
    )
}
