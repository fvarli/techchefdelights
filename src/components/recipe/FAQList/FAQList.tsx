import type { ApiRecipe } from '@/lib/api/types'
import styles from './FAQList.module.css'

type Props = {
  faq: ApiRecipe['faq']
  title: string
}

export function FAQList({ faq, title }: Props) {
  if (faq.length === 0) return null
  return (
    <section id="faq" className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.list}>
        {faq.map((f, i) => (
          <details key={i} className={styles.item}>
            <summary className={styles.question}>
              <span className={styles.qText}>{f.q}</span>
              <span className={styles.qIcon} aria-hidden>
                +
              </span>
            </summary>
            <p className={styles.answer}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
