'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './MobileBottomNav.module.css'

type Tab = {
  key: 'home' | 'search' | 'saved' | 'plan' | 'profile'
  href: string
  icon: string
  label: string
}

type Props = {
  locale: ApiLocale
  labels: { home: string; search: string; saved: string; plan: string; profile: string }
}

export function MobileBottomNav({ locale, labels }: Props) {
  const pathname = usePathname()

  const tabs: Tab[] = [
    { key: 'home', href: localePath(locale, '/'), icon: '⌂', label: labels.home },
    { key: 'search', href: localePath(locale, '/search'), icon: '⌕', label: labels.search },
    { key: 'saved', href: localePath(locale, '/saved'), icon: '♡', label: labels.saved },
    { key: 'plan', href: localePath(locale, '/plan'), icon: '◧', label: labels.plan },
    { key: 'profile', href: localePath(locale, '/profile'), icon: '◯', label: labels.profile },
  ]

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      <ul className={styles.list}>
        {tabs.map((tab) => {
          const active =
            tab.key === 'home'
              ? pathname === '/' || /^\/(tr|es)$/.test(pathname)
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          return (
            <li key={tab.key} className={styles.item}>
              <Link
                href={tab.href}
                className={clsx(styles.link, active && styles.linkActive)}
                aria-current={active ? 'page' : undefined}
              >
                <span className={styles.icon} aria-hidden>
                  {tab.icon}
                </span>
                <span className={styles.label}>{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
