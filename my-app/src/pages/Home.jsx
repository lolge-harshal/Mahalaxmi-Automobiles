import { Link } from 'react-router-dom'
import { usePageContent, useServices, useProducts } from '../hooks/useWorkshop'
import ServiceCard from '../components/ServiceCard'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import SectionHeader from '../components/SectionHeader'
import ErrorMessage from '../components/ErrorMessage'
import SEO from '../components/SEO'

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ content }) {
    const hero = content?.hero ?? {}
    return (
        <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
                {/* Eyebrow */}
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-300 mb-4">
                    Authorised Automobile Dealer
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                    {hero.heading ?? 'Welcome to'}<br />
                    <span className="text-primary-200">Mahalaxmi Automobiles</span>
                </h1>

                <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {hero.subheading ?? 'Your trusted destination for quality vehicles, genuine spare parts, and professional automotive services.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/services"
                        className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-sm"
                    >
                        {hero.cta_primary ?? 'Our Services'}
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-primary-400 text-white font-semibold hover:bg-primary-700 transition-colors"
                    >
                        {hero.cta_secondary ?? 'Contact Us'}
                    </Link>
                </div>
            </div>

            {/* Bottom wave divider */}
            <div className="overflow-hidden leading-none">
                <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" className="w-full fill-gray-50">
                    <path d="M0,32L1440,0L1440,40L0,40Z" />
                </svg>
            </div>
        </section>
    )
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

const stats = [
    { label: 'Years of Service', value: '15+' },
    { label: 'Vehicles Sold', value: '5,000+' },
    { label: 'Happy Customers', value: '4,800+' },
    { label: 'Service Bays', value: '12' },
]

function StatsBar() {
    return (
        <section className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-gray-100">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center px-4">
                            <div className="text-3xl font-bold text-primary-600 mb-1">{s.value}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ── Featured Services ─────────────────────────────────────────────────────────

function FeaturedServices() {
    const { data, isLoading, isError, refetch } = useServices({ limit: 4 })

    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Our Services"
                    subtitle="From routine maintenance to complex repairs, our certified technicians deliver quality workmanship on every job."
                />

                {isError && <ErrorMessage onRetry={refetch} />}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading
                        ? <SkeletonCard count={4} />
                        : data?.map((service) => (
                            <ServiceCard
                                key={service.id}
                                title={service.title}
                                description={service.description}
                                price={service.price}
                            />
                        ))
                    }
                </div>

                {!isLoading && !isError && (
                    <div className="text-center mt-10">
                        <Link to="/services" className="btn-secondary">
                            View All Services
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

// ── Featured Products ─────────────────────────────────────────────────────────

function FeaturedProducts() {
    const { data, isLoading, isError, refetch } = useProducts({ limit: 3 })

    // Don't render the section at all if there are no products and we're not loading
    if (!isLoading && !isError && (!data || data.length === 0)) return null

    return (
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Featured Vehicles"
                    subtitle="Explore our current selection of quality vehicles available for purchase."
                />

                {isError && <ErrorMessage onRetry={refetch} />}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading
                        ? <SkeletonCard count={3} image />
                        : data?.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                image_url={product.image_url}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

// ── Why Choose Us ─────────────────────────────────────────────────────────────

const reasons = [
    {
        title: 'Authorised Dealership',
        body: 'We are an authorised dealer offering genuine vehicles, parts, and full manufacturer warranty support.',
    },
    {
        title: 'Certified Technicians',
        body: 'Our service team holds manufacturer certifications and undergoes regular training to stay current.',
    },
    {
        title: 'Transparent Pricing',
        body: 'No hidden charges. We provide detailed estimates before any work begins.',
    },
    {
        title: 'Genuine Spare Parts',
        body: 'We use only OEM-approved parts to ensure the safety and longevity of your vehicle.',
    },
]

function WhyChooseUs() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Why Choose Mahalaxmi Automobiles"
                    subtitle="We have built our reputation on trust, quality, and a genuine commitment to customer satisfaction."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reasons.map((r) => (
                        <div key={r.title} className="card hover:shadow-md transition-shadow">
                            <div className="w-8 h-1 rounded bg-primary-600 mb-4" />
                            <h3 className="font-semibold text-gray-900 mb-2">{r.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{r.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ── CTA Banner ────────────────────────────────────────────────────────────────

function CTABanner() {
    return (
        <section className="bg-primary-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-primary-200 mb-8 max-w-xl mx-auto">
                    Visit our showroom or speak with our team to find the right vehicle or service for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
                    >
                        Contact Us
                    </Link>
                    <Link
                        to="/about"
                        className="inline-flex items-center justify-center px-7 py-3 rounded-lg border border-primary-400 text-white font-semibold hover:bg-primary-600 transition-colors"
                    >
                        Learn About Us
                    </Link>
                </div>
            </div>
        </section>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
    const { data: content, isLoading: contentLoading } = usePageContent('home')

    return (
        <div>
            <SEO
                title="Home"
                description="Mahalaxmi Automobiles — Authorised dealer for quality vehicles, genuine spare parts, and professional automotive services."
            />
            <Hero content={contentLoading ? {} : content} />
            <StatsBar />
            <FeaturedServices />
            <FeaturedProducts />
            <WhyChooseUs />
            <CTABanner />
        </div>
    )
}
