/**
 * Lightweight utility to merge class names conditionally.
 * Usage: cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}
