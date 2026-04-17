import { Link } from 'react-router-dom'
import { useServices } from '../hooks/useWorkshop'
import PageBanner from '../components/PageBanner'
import ServiceCard from '../components/ServiceCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorMessage from '../components/ErrorMessage'
import SEO from '../components/SEO'

// Shown when the DB has no services yet
const FALLBACK_SERVICES = [
    { id: 'f1', title: 'New Vehicle Sales', description: 'Browse our showroom for the latest models from leading manufacturers. Our sales team will guide you to the right choice.', price: null },
    { id: 'f2', title: 'Pre-Owned Vehicles', description: 'Certified pre-owned vehicles inspected for quality and reliability, offered at competitive prices with full documentation.', price: null },
    { id: 'f3', title: 'Service and Maintenance', description: 'Scheduled maintenance, diagnostics, and repairs carried out by trained technicians using genuine parts.', price: null },
    { id: 'f4', title: 'Genuine Spare Parts', description: 'We supply authentic spare parts and accessories to keep your vehicle performing at its best.', price: null },
    { id: 'f5', title: 'Vehicle Financing', description: 'Flexible loan and EMI plans in partnership with leading financial institutions to make ownership affordable.', price: null },
    { id: 'f6', title: 'Insurance Assistance', description: 'End-to-end support for vehicle insurance — new policies, renewals, and claim processing.', price: null },
    { id: 'f7', title: 'Vehicle Registration', description: 'Hassle-free assistance with RTO registration, transfer of ownership, and related documentation.', price: null },
    { id: 'f8', title: 'Roadside Assistance', description: 'Emergency support and towing services to ensure you are never stranded on the road.', price: null },
]

// ── Process steps ─────────────────────────────────────────────────────────────

const steps = [
    { step: '01', title: 'Book an Appointment', body: 'Call us or use our contact form to schedule a service visit at your convenience.' },
    { step: '02', title: 'Vehicle Inspection', body: 'Our technicians perform a thorough inspection and provide a detailed estimate.' },
    { step: '03', title: 'Service Execution', body: 'Work is carried out using genuine parts and manufacturer-approved procedures.' },
    { step: '04', title: 'Quality Check', body: 'Every vehicle undergoes a final quality check before handover.' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Services() {
    const { data, isLoading, isError, refetch } = useServices()

    const services = (!isLoading && !isError && data && data.length > 0)
        ? data
        : (!isLoading && !isError ? FALLBACK_SERVICES : [])

    return (
        <div>
            <SEO
                title="Our Services"
                description="Comprehensive automotive services at Mahalaxmi Automobiles — vehicle sales, maintenance, spare parts, financing, and more."
            />
            <PageBanner
                title="Our Services"
                subtitle="Mahalaxmi Automobiles offers a comprehensive range of automotive services designed to meet every need of our customers."
            />

            {/* ── Services grid ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {isError && (
                    <ErrorMessage
                        message="Unable to load services at this time."
                        onRetry={refetch}
                    />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading
                        ? <SkeletonCard count={8} />
                        : services.map((s) => (
                            <ServiceCard
                                key={s.id}
                                title={s.title}
                                description={s.description}
                                price={s.price}
                            />
                        ))
                    }
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Getting your vehicle serviced at Mahalaxmi Automobiles is simple and transparent.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s) => (
                            <div key={s.step} className="card text-center hover:shadow-md transition-shadow">
                                <div className="text-4xl font-black text-primary-100 mb-3">{s.step}</div>
                                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-primary-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
                    <h2 className="text-2xl font-bold mb-3">Need a Service? Book an Appointment Today.</h2>
                    <p className="text-primary-200 mb-7 max-w-lg mx-auto text-sm">
                        Our team is ready to assist you. Reach out and we will get back to you promptly.
                    </p>
                    <Link to="/contact" className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors">
                        Book an Appointment
                    </Link>
                </div>
            </section>
        </div>
    )
}
