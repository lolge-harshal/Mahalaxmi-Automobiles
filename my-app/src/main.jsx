import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// ── React Query client ────────────────────────────────────────────────────────

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,   // 5 min — don't refetch if data is fresh gg
            gcTime: 1000 * 60 * 10,  // 10 min — keep unused data in cache
            retry: 1,               // one retry on failure
            refetchOnWindowFocus: false,         // avoid surprise refetches on tab switch
        },
        mutations: {
            retry: 0,   // never auto-retry mutations — let the UI handle errors
        },
    },
})

// ── Mount ─────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                {/* DevTools only bundled in development */}
                {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
