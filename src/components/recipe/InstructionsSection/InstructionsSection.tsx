import type { ApiRecipe } from '@/lib/api/types'
import styles from './InstructionsSection.module.css'

type Props = {
  steps: ApiRecipe['steps']
  labels: { title: string; step: string; chefNote: string; minutes: string }
}

function formatTimer(seconds: number, minutesLabel: string): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60
  if (sec === 0) return `${minutes} ${minutesLabel}`
  return `${minutes} ${minutesLabel} ${sec}s`
}

export function InstructionsSection({ steps, labels }: Props) {
  return (
    <section id="instructions" className={styles.section}>
      <h2 className={styles.title}>{labels.title}</h2>
      <ol className={styles.steps}>
        {steps.map((s) => (
          <li key={s.index} className={styles.step}>
            <div className={styles.numCol}>
              <span className={styles.numLabel}>{labels.step}</span>
              <span className={styles.num}>{String(s.index + 1).padStart(2, '0')}</span>
            </div>
            <div className={styles.body}>
              {s.title && <h3 className={styles.stepTitle}>{s.title}</h3>}
              <p className={styles.text}>{s.body}</p>
              {s.timer && (
                <span className={styles.timer}>
                  <span className={styles.timerIcon} aria-hidden>
                    ⏱
                  </span>
                  {formatTimer(s.timer.seconds, labels.minutes)}
                  {s.timer.label && <span className={styles.timerLabel}>· {s.timer.label}</span>}
                </span>
              )}
              {s.note && (
                <aside className={styles.chefNote}>
                  <span className={styles.chefNoteLabel}>{labels.chefNote}</span>
                  <p className={styles.chefNoteText}>{s.note}</p>
                </aside>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
