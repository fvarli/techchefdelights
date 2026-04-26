import Link from 'next/link'
import { Kicker } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeCategoryTile } from '@/lib/api/home-loaders'
import styles from './CategoryGrid.module.css'

type Props = {
  categories: HomeCategoryTile[]
  locale: ApiLocale
  labels: { kicker: string; title: string; recipesSuffix: string }
}

const ICON_MAP: Record<string, string> = {
  cake: '◉',
  'fork-knife': '◬',
  sunrise: '◌',
  croissant: '◐',
  bowl: '○',
  leaf: '◇',
  glass: '▽',
  popcorn: '◓',
}

export function CategoryGrid({ categories, locale, labels }: Props) {
  if (categories.length === 0) return null
  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <Kicker num="05">{labels.kicker}</Kicker>
        <h2 className={styles.title}>{labels.title}</h2>
      </header>
      <div className={styles.grid}>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={localePath(locale, `/c/${c.slug}`)}
            className={styles.tile}
          >
            <span className={styles.icon} aria-hidden>
              {(c.iconKey && ICON_MAP[c.iconKey]) ?? '◆'}
            </span>
            <span className={styles.name}>{c.name}</span>
            <span className={styles.count}>
              {c.recipeCount} {labels.recipesSuffix}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
