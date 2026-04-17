export default function SectionLoader() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-gray-100 rounded-lg w-full" />
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-50 rounded-lg w-full" />
            ))}
        </div>
    )
}
