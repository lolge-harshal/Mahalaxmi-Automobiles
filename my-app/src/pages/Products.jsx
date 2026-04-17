import { useState } from 'react'
import { useProducts } from '../hooks/useWorkshop'
import PageBanner from '../components/PageBanner'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorMessage from '../components/ErrorMessage'
import EnquiryModal from '../components/EnquiryModal'
import SEO from '../components/SEO'

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyProducts() {
    return (
        <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No Products Listed Yet</h3>
            <p className="text-sm text-gray-400">
                Our inventory is being updated. Please check back soon or contact us directly.
            </p>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Products() {
    const { data, isLoading, isError, refetch } = useProducts()
    const [selectedProduct, setSelectedProduct] = useState(null)

    const isEmpty = !isLoading && !isError && (!data || data.length === 0)

    return (
        <div>
            <SEO
                title="Products"
                description="Browse our inventory of quality vehicles and automotive products at Mahalaxmi Automobiles."
            />
            <PageBanner
                title="Our Products"
                subtitle="Browse our current inventory of vehicles and automotive products. Click Enquire on any listing to get in touch with our team."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Error */}
                {isError && (
                    <ErrorMessage
                        message="Unable to load products at this time."
                        onRetry={refetch}
                    />
                )}

                {/* Empty */}
                {isEmpty && <EmptyProducts />}

                {/* Grid */}
                {!isError && !isEmpty && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading
                            ? <SkeletonCard count={6} image />
                            : data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onEnquire={setSelectedProduct}
                                />
                            ))
                        }
                    </div>
                )}
            </div>

            {/* Enquiry modal — rendered at page level so it overlays everything */}
            <EnquiryModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    )
}
