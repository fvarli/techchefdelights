import { Kicker } from '@/components/foundation'
import styles from './TipsStrip.module.css'

type Tip = {
  kicker: string
  title: string
  body: string
}

type Props = {
  tips: Tip[]
  labels: { kicker: string; title: string }
}

export function TipsStrip({ tips, labels }: Props) {
  if (tips.length === 0) return null
  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <Kicker num="08">{labels.kicker}</Kicker>
        <h2 className={styles.title}>{labels.title}</h2>
      </header>
      <div className={styles.grid}>
        {tips.map((tip, i) => (
          <article key={i} className={styles.card}>
            <span className={styles.tipKicker}>{tip.kicker}</span>
            <h3 className={styles.tipTitle}>{tip.title}</h3>
            <p className={styles.tipBody}>{tip.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
