/**
 * Reusable top-of-page banner used on inner pages (About, Services, Contact).
 * Props: title, subtitle
 */
export default function PageBanner({ title, subtitle }) {
    return (
        <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>
                {subtitle && (
                    <p className="text-primary-200 text-lg max-w-2xl leading-relaxed">{subtitle}</p>
                )}
            </div>
        </section>
    )
}
