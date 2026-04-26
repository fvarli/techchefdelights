import Link from 'next/link'
import { Kicker, Placeholder } from '@/components/foundation'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { HomeRecipeCard } from '@/lib/api/home-loaders'
import styles from './VisualMasonry.module.css'

type Props = {
  recipes: HomeRecipeCard[]
  locale: ApiLocale
  labels: { kicker: string; title: string }
}

// Pseudo-random heights based on index, deterministic for SSG.
const HEIGHT_PATTERN = [320, 420, 280, 360, 440, 300, 380, 340]
const TONE_PATTERN: Array<'warm' | 'cool' | 'light' | 'sand' | 'dark'> = [
  'warm',
  'cool',
  'light',
  'sand',
  'warm',
  'dark',
  'cool',
  'light',
]

export function VisualMasonry({ recipes, locale, labels }: Props) {
  if (recipes.length === 0) return null
  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <Kicker num="04">{labels.kicker}</Kicker>
        <h2 className={styles.title}>{labels.title}</h2>
      </header>
      <div className={styles.masonry}>
        {recipes.map((r, i) => {
          const height = HEIGHT_PATTERN[i % HEIGHT_PATTERN.length]
          const tone = TONE_PATTERN[i % TONE_PATTERN.length]
          return (
            <Link
              key={r.id}
              href={localePath(locale, `/r/${r.slug}`)}
              className={styles.tile}
              style={{ '--tile-h': `${height}px` } as React.CSSProperties}
            >
              <Placeholder tone={tone} height={height} label={r.title.toUpperCase().slice(0, 18)} />
              <div className={styles.overlay}>
                {r.cuisine && <span className={styles.tileKicker}>{r.cuisine}</span>}
                <span className={styles.tileTitle}>{r.title}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
