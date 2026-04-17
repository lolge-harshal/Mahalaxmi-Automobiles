/**
 * Displays a single product with image, name, description, price and enquire button.
 *
 * Props:
 *   id, name, description, price, image_url  — product data
 *   onEnquire  — (product) => void  (optional; hides button if omitted)
 */
export default function ProductCard({ id, name, description, price, image_url, onEnquire }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            {/* Image */}
            <div className="aspect-video bg-gray-100 overflow-hidden">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{name}</h3>

                {description && (
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{description}</p>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    {price != null ? (
                        <span className="text-primary-600 font-bold text-base shrink-0">
                            &#8377;{Number(price).toLocaleString('en-IN')}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">Price on request</span>
                    )}

                    {onEnquire && (
                        <button
                            onClick={() => onEnquire({ id, name, description, price, image_url })}
                            className="btn-primary text-xs px-4 py-2 shrink-0"
                        >
                            Enquire
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
