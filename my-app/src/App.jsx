import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import BaseLayout from './layouts/BaseLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
// Each page is split into its own chunk — only downloaded when first visited.

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Products = lazy(() => import('./pages/Products'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

// ── Page-level loading fallback ───────────────────────────────────────────────

function PageLoader() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    )
}

// ── Router ────────────────────────────────────────────────────────────────────

export default function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<BaseLayout />}>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Protected — authenticated users only */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin — full-screen layout, outside BaseLayout */}
                <Route element={<ProtectedRoute requireAdmin />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Routes>
        </Suspense>
    )
}
