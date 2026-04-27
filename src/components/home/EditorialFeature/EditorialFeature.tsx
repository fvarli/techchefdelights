import Link from 'next/link'
import { Kicker, Placeholder } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeFeaturedItem } from '@/lib/api/home-loaders'
import styles from './EditorialFeature.module.css'

type Props = {
  feature: HomeFeaturedItem
  locale: ApiLocale
  labels: {
    kicker: string
    cta: string
    minutes: string
  }
}

export function EditorialFeature({ feature, locale, labels }: Props) {
  const r = feature.recipe
  return (
    <section className={styles.section}>
      <Link href={localePath(locale, `/recipes/${r.slug}`)} className={styles.imageLink}>
        <Placeholder tone="dark" ratio={3 / 4} label={r.title.toUpperCase().slice(0, 18)} />
      </Link>

      <div className={styles.content}>
        <Kicker num="03">{labels.kicker}</Kicker>

        {feature.pullQuote && (
          <blockquote className={styles.pullQuote}>“{feature.pullQuote}”</blockquote>
        )}

        <h2 className={styles.title}>{r.title}</h2>
        <p className={styles.tagline}>{r.tagline}</p>

        <div className={styles.metaRow}>
          {feature.byline && <span className={styles.byline}>{feature.byline}</span>}
          {feature.byline && (
            <span aria-hidden className={styles.dot}>·</span>
          )}
          <span className={styles.time}>
            {r.totalMinutes} {labels.minutes}
          </span>
          {r.cuisine && (
            <>
              <span aria-hidden className={styles.dot}>·</span>
              <span className={styles.cuisine}>{r.cuisine}</span>
            </>
          )}
        </div>

        <Link href={localePath(locale, `/recipes/${r.slug}`)} className={styles.cta}>
          {labels.cta} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
