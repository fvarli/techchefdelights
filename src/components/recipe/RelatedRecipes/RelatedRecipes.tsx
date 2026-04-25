import { Placeholder } from '@/components/foundation'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './RelatedRecipes.module.css'

export type RelatedRecipeItem = {
  slug: string
  title: string
  tagline: string
  totalMinutes: number
  cuisine: string | null
}

type Props = {
  items: RelatedRecipeItem[]
  locale: ApiLocale
  labels: { title: string; minutes: string }
}

function recipePath(locale: ApiLocale, slug: string): string {
  return locale === 'en' ? `/r/${slug}` : `/${locale}/r/${slug}`
}

export function RelatedRecipes({ items, locale, labels }: Props) {
  if (items.length === 0) return null
  return (
    <section id="related" className={styles.section}>
      <h2 className={styles.title}>{labels.title}</h2>
      <div className={styles.grid}>
        {items.map((r) => (
          <a key={r.slug} href={recipePath(locale, r.slug)} className={styles.card}>
            <Placeholder tone="warm" ratio={4 / 3} label={r.title.toUpperCase().slice(0, 16)} />
            <div className={styles.body}>
              {r.cuisine && <span className={styles.kicker}>{r.cuisine}</span>}
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.tagline}>{r.tagline}</p>
              <span className={styles.meta}>
                {r.totalMinutes} {labels.minutes}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
