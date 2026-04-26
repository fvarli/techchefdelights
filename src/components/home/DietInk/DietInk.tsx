import Link from 'next/link'
import { Kicker } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeDietTile } from '@/lib/api/home-loaders'
import styles from './DietInk.module.css'

type Props = {
  diets: HomeDietTile[]
  locale: ApiLocale
  labels: {
    kicker: string
    title: string
    desc: string
    recipesSuffix: string
  }
}

export function DietInk({ diets, locale, labels }: Props) {
  if (diets.length === 0) return null
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <Kicker num="06" tone="mute">
            {labels.kicker}
          </Kicker>
          <h2 className={styles.title}>{labels.title}</h2>
          <p className={styles.desc}>{labels.desc}</p>
        </header>
        <div className={styles.grid}>
          {diets.map((d) => (
            <Link
              key={d.slug}
              href={localePath(locale, `/d/${d.slug}`)}
              className={styles.tile}
            >
              <span className={styles.name}>{d.name}</span>
              <span className={styles.count}>
                {d.recipeCount} {labels.recipesSuffix}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
