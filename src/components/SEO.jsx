import { useEffect } from 'react'

const SITE_NAME = 'Mahalaxmi Automobiles'
const DEFAULT_DESCRIPTION =
    'Mahalaxmi Automobiles — Your trusted destination for quality vehicles, genuine spare parts, and professional automotive services.'

/**
 * Lightweight SEO head manager (no external dependency).
 * Sets document.title and updates/creates meta tags.
 *
 * Props:
 *   title       — page-specific title (appended with site name)
 *   description — page-specific meta description
 *   noIndex     — set true for auth/dashboard pages
 */
export default function SEO({ title, description, noIndex = false }) {
    useEffect(() => {
        // Title
        document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME

        // Helper to upsert a <meta> tag
        const setMeta = (name, content, attr = 'name') => {
            let el = document.querySelector(`meta[${attr}="${name}"]`)
            if (!el) {
                el = document.createElement('meta')
                el.setAttribute(attr, name)
                document.head.appendChild(el)
            }
            el.setAttribute('content', content)
        }

        setMeta('description', description ?? DEFAULT_DESCRIPTION)
        setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow')

        // Open Graph
        setMeta('og:title', title ? `${title} | ${SITE_NAME}` : SITE_NAME, 'property')
        setMeta('og:description', description ?? DEFAULT_DESCRIPTION, 'property')
        setMeta('og:type', 'website', 'property')
        setMeta('og:site_name', SITE_NAME, 'property')

        // Twitter card
        setMeta('twitter:card', 'summary')
        setMeta('twitter:title', title ? `${title} | ${SITE_NAME}` : SITE_NAME)
        setMeta('twitter:description', description ?? DEFAULT_DESCRIPTION)

        return () => {
            // Reset to defaults on unmount
            document.title = SITE_NAME
        }
    }, [title, description, noIndex])

    return null
}
