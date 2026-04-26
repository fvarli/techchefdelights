import Link from 'next/link'
import { Kicker, Pill } from '@/components/foundation'
import { LiveCounter } from '@/components/home/LiveCounter'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeRecipeCard } from '@/lib/api/home-loaders'
import styles from './HomeHero.module.css'

type HeroLabels = {
  kicker: string
  title: string
  tagline: string
  liveLabel: string
  searchPlaceholder: string
  searchHint: string
  quickChipsLabel: string
}

type Props = {
  locale: ApiLocale
  liveCount: number
  liveTtlSeconds: number
  quickChips: Array<{ slug: string; name: string }>
  spotlight: HomeRecipeCard | null
  labels: HeroLabels
}

export function HomeHero({
  locale,
  liveCount,
  liveTtlSeconds,
  quickChips,
  spotlight,
  labels,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.text}>
        <div className={styles.kickerRow}>
          <Kicker>{labels.kicker}</Kicker>
          <span aria-hidden className={styles.kickerSep}>·</span>
          <LiveCounter initial={liveCount} ttlSeconds={liveTtlSeconds} label={labels.liveLabel} />
        </div>

        <h1 className={styles.title}>{labels.title}</h1>
        <p className={styles.tagline}>{labels.tagline}</p>

        <Link
          href={localePath(locale, '/search')}
          className={styles.searchBar}
          aria-label={labels.searchPlaceholder}
        >
          <span className={styles.searchIcon} aria-hidden>⌕</span>
          <span className={styles.searchPlaceholder}>{labels.searchPlaceholder}</span>
          <span className={styles.searchHint} aria-hidden>{labels.searchHint}</span>
        </Link>

        {quickChips.length > 0 && (
          <div className={styles.chips}>
            <span className={styles.chipsLabel}>{labels.quickChipsLabel}</span>
            <div className={styles.chipsRow}>
              {quickChips.slice(0, 8).map((c) => (
                <Link
                  key={c.slug}
                  href={localePath(locale, `/search?tag=${c.slug}`)}
                  className={styles.chipLink}
                >
                  <Pill>{c.name}</Pill>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {spotlight && (
        <Link
          href={localePath(locale, `/r/${spotlight.slug}`)}
          className={styles.spotlight}
          aria-label={spotlight.title}
        >
          <div className={styles.spotlightImage}>
            <span className={styles.spotlightImageLabel} aria-hidden>
              {spotlight.title.toUpperCase().slice(0, 18)}
            </span>
          </div>
          <div className={styles.spotlightMeta}>
            <span className={styles.spotlightKicker}>
              {spotlight.cuisine ?? labels.kicker}
            </span>
            <h2 className={styles.spotlightTitle}>{spotlight.title}</h2>
            <p className={styles.spotlightTagline}>{spotlight.tagline}</p>
          </div>
        </Link>
      )}
    </section>
  )
}
