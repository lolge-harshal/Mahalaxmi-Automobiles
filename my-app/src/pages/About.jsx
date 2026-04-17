import { Link } from 'react-router-dom'
import { usePageContent } from '../hooks/useWorkshop'
import PageBanner from '../components/PageBanner'
import ErrorMessage from '../components/ErrorMessage'
import SEO from '../components/SEO'

// Static highlights — shown alongside dynamic DB content
const highlights = [
    {
        title: 'Authorised Dealership',
        body: 'An authorised dealer offering genuine vehicles, parts, and warranty-backed services from leading manufacturers.',
    },
    {
        title: 'Expert Technicians',
        body: 'Our certified service team ensures every vehicle receives the highest standard of care and precision.',
    },
    {
        title: 'Customer-First Approach',
        body: 'We prioritise transparency, honesty, and long-term relationships with every customer we serve.',
    },
    {
        title: 'Comprehensive Inventory',
        body: 'A wide selection of new and pre-owned vehicles across multiple segments and price ranges.',
    },
    {
        title: 'Genuine Spare Parts',
        body: 'We stock only OEM-approved parts and accessories to maintain the performance and safety of your vehicle.',
    },
    {
        title: 'After-Sales Support',
        body: 'Dedicated support for maintenance, insurance, financing, and all vehicle documentation needs.',
    },
]

const milestones = [
    { year: '2009', event: 'Mahalaxmi Automobiles founded with a single showroom.' },
    { year: '2013', event: 'Expanded service centre with 8 additional bays.' },
    { year: '2017', event: 'Achieved authorised dealership status with a leading manufacturer.' },
    { year: '2020', event: 'Launched online enquiry and booking platform.' },
    { year: '2024', event: 'Crossed 5,000 vehicles sold and 4,800 satisfied customers.' },
]

// ── Loading skeleton ──────────────────────────────────────────────────────────

function AboutSkeleton() {
    return (
        <div className="animate-pulse space-y-4 mb-12">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function About() {
    const { data: content, isLoading, isError, refetch } = usePageContent('about')
    const intro = content?.intro ?? {}

    return (
        <div>
            <SEO
                title="About Us"
                description="Learn about Mahalaxmi Automobiles — our journey, values, and commitment to quality automotive services."
            />
            <PageBanner
                title="About Us"
                subtitle="Learn about our journey, our values, and our commitment to the automotive community."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* ── Left: Dynamic intro from DB ── */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {intro.heading ?? 'Who We Are'}
                        </h2>

                        {isLoading && <AboutSkeleton />}
                        {isError && <ErrorMessage message="Could not load page content." onRetry={refetch} />}

                        {!isLoading && !isError && (
                            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    {intro.body ?? 'Mahalaxmi Automobiles is a trusted name in the automotive sector, committed to providing quality vehicles and professional services to our customers.'}
                                </p>
                                <p>
                                    With a strong foundation built on integrity and expertise, we have grown to become a preferred destination for vehicle buyers and owners alike. Whether you are looking to purchase a new vehicle, service your existing one, or source genuine spare parts, our team is here to assist you at every step.
                                </p>
                                <p>
                                    Our state-of-the-art service centre is equipped with the latest diagnostic tools and staffed by manufacturer-certified technicians who take pride in delivering work of the highest standard.
                                </p>
                            </div>
                        )}

                        {/* Milestones */}
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Our Journey</h3>
                            <div className="relative border-l-2 border-primary-100 pl-6 space-y-6">
                                {milestones.map((m) => (
                                    <div key={m.year} className="relative">
                                        <div className="absolute -left-[1.65rem] top-1 w-4 h-4 rounded-full bg-primary-600 border-2 border-white shadow" />
                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">{m.year}</span>
                                        <p className="text-sm text-gray-600 mt-0.5">{m.event}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Highlights ── */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">What Sets Us Apart</h3>
                        {highlights.map((h) => (
                            <div key={h.title} className="card p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{h.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{h.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA ── */}
                <div className="mt-16 bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Experience the Difference?</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Visit our showroom or get in touch with our team today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/contact" className="btn-primary">Contact Us</Link>
                        <Link to="/services" className="btn-secondary">View Services</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
