import Link from 'next/link'
import type { ApiLocale } from '@/lib/api/enums'
import { localePath } from '@/lib/path'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import styles from './Header.module.css'

type HeaderLabels = {
  recipes: string
  categories: string
  search: string
  saved: string
  profile: string
}

type Props = {
  locale: ApiLocale
  labels: HeaderLabels
}

export function Header({ locale, labels }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={localePath(locale, '/')} className={styles.brand}>
          <span className={styles.brandName}>techchef</span>
          <span className={styles.brandDot} aria-hidden>
            .
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <Link href={localePath(locale, '/recipes')} className={styles.navLink}>
            {labels.recipes}
          </Link>
          <Link href={localePath(locale, '/c')} className={styles.navLink}>
            {labels.categories}
          </Link>
          <Link href={localePath(locale, '/search')} className={styles.navLink}>
            {labels.search}
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link
            href={localePath(locale, '/saved')}
            className={styles.iconLink}
            aria-label={labels.saved}
          >
            <span aria-hidden>♡</span>
          </Link>
          <Link
            href={localePath(locale, '/profile')}
            className={styles.iconLink}
            aria-label={labels.profile}
          >
            <span aria-hidden>◯</span>
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}
