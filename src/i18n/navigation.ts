import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Localized navigation helpers. Use these instead of `next/link` and
 * `next/navigation` whenever the target href is a public route — they
 * resolve the right URL per locale via routing.pathnames.
 *
 * Example: <Link href="/recipes/[slug]" params={{ slug }} />
 *   - EN: /recipes/<slug>
 *   - TR: /tr/tarifler/<slug>
 *   - ES: /es/recetas/<slug>
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
