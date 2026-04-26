'use client'

import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import type { ApiLocale } from '@/lib/api/enums'
import { localePath } from '@/lib/path'
import styles from './LanguageSwitcher.module.css'

type Props = {
  locale: ApiLocale
}

const LOCALES: Array<{ code: ApiLocale; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'es', label: 'ES' },
]

const LOCALE_PREFIX_RE = /^\/(tr|es)(?=\/|$)/

/**
 * v1 generic locale swap. Strips the current locale prefix and applies the
 * target prefix. On a recipe page, switching from EN→TR may 404 because
 * slugs are per-locale (strict lookup). v1.1 polish: read slugByLocale from
 * a recipe-page React context to route to the equivalent slug.
 */
export function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  function buildPath(target: ApiLocale): string {
    const stripped = pathname.replace(LOCALE_PREFIX_RE, '') || '/'
    return localePath(target, stripped)
  }

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LOCALES.map((l) => {
        const active = l.code === locale
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => {
              if (!active) router.push(buildPath(l.code))
            }}
            className={clsx(styles.btn, active && styles.btnActive)}
            aria-pressed={active}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
