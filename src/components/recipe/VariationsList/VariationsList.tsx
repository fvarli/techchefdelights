import type { ApiRecipe } from '@/lib/api/types'
import styles from './VariationsList.module.css'

type Props = {
  variations: ApiRecipe['variations']
  title: string
}

export function VariationsList({ variations, title }: Props) {
  if (variations.length === 0) return null
  return (
    <section id="variations" className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {variations.map((v, i) => (
          <article key={i} className={styles.card}>
            <h3 className={styles.cardTitle}>{v.title}</h3>
            <p className={styles.cardBody}>{v.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
