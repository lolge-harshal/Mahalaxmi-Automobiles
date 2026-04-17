import { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Global React error boundary.
 * Catches unhandled render errors and shows a friendly fallback UI.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Or with a custom fallback:
 *   <ErrorBoundary fallback={<MyFallback />}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, info) {
        // In production you would send this to an error tracking service
        // e.g. Sentry.captureException(error, { extra: info })
        if (import.meta.env.DEV) {
            console.error('[ErrorBoundary]', error, info)
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback

            return (
                <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                            {import.meta.env.DEV && this.state.error && (
                                <span className="block mt-2 font-mono text-xs text-red-500 bg-red-50 rounded p-2 text-left">
                                    {this.state.error.message}
                                </span>
                            )}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary"
                            >
                                Refresh Page
                            </button>
                            <Link to="/" onClick={this.handleReset} className="btn-secondary">
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
