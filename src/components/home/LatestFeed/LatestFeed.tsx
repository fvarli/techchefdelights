import Link from 'next/link'
import { Kicker, Placeholder } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeRecipeCard } from '@/lib/api/home-loaders'
import styles from './LatestFeed.module.css'

type Props = {
  recipes: HomeRecipeCard[]
  locale: ApiLocale
  labels: { kicker: string; title: string; minutes: string }
}

export function LatestFeed({ recipes, locale, labels }: Props) {
  if (recipes.length === 0) return null
  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <Kicker num="07">{labels.kicker}</Kicker>
        <h2 className={styles.title}>{labels.title}</h2>
      </header>
      <ul className={styles.list}>
        {recipes.map((r) => (
          <li key={r.id} className={styles.item}>
            <Link href={localePath(locale, `/recipes/${r.slug}`)} className={styles.row}>
              <div className={styles.thumb}>
                <Placeholder tone="warm" ratio={1} label={r.title.slice(0, 4).toUpperCase()} />
              </div>
              <div className={styles.body}>
                {r.cuisine && <span className={styles.cuisine}>{r.cuisine}</span>}
                <h3 className={styles.name}>{r.title}</h3>
                <p className={styles.tagline}>{r.tagline}</p>
              </div>
              <span className={styles.meta}>
                {r.totalMinutes} {labels.minutes}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
