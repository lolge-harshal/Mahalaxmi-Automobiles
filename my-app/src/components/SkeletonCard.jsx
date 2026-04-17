/**
 * Animated skeleton placeholder used while data is loading.
 * Props: count (number of cards), image (bool — show image placeholder)
 */
export default function SkeletonCard({ count = 3, image = false }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    {image && <div className="aspect-video bg-gray-200" />}
                    <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                        {image && <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" />}
                    </div>
                </div>
            ))}
        </>
    )
}
