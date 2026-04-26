import Link from 'next/link'
import styles from './CookHeader.module.css'

type Props = {
  recipeTitle: string
  totalSteps: number
  currentStep: number
  exitHref: string
  labels: { exit: string; step: string; of: string }
}

export function CookHeader({
  recipeTitle,
  totalSteps,
  currentStep,
  exitHref,
  labels,
}: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={exitHref} className={styles.exit} aria-label={labels.exit}>
          <span aria-hidden>✕</span>
          <span className={styles.exitLabel}>{labels.exit}</span>
        </Link>

        <h1 className={styles.recipe}>{recipeTitle}</h1>

        <div className={styles.right}>
          <span className={styles.counter}>
            <span className={styles.counterLabel}>{labels.step}</span>
            <span className={styles.counterNum}>
              {String(currentStep + 1).padStart(2, '0')}
            </span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>
              {String(totalSteps).padStart(2, '0')}
            </span>
          </span>
        </div>
      </div>

      <div className={styles.progress} aria-hidden>
        <div
          className={styles.progressFill}
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </header>
  )
}
