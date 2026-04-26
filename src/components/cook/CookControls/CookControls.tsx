import Link from 'next/link'
import clsx from 'clsx'
import styles from './CookControls.module.css'

type Props = {
  basePath: string
  stepIndex: number
  totalSteps: number
  labels: { previous: string; next: string; complete: string }
}

function stepHref(basePath: string, step: number): string {
  return step === 0 ? basePath : `${basePath}?step=${step}`
}

export function CookControls({ basePath, stepIndex, totalSteps, labels }: Props) {
  const prevStep = stepIndex > 0 ? stepIndex - 1 : null
  const nextStep = stepIndex < totalSteps - 1 ? stepIndex + 1 : null
  const isLast = stepIndex === totalSteps - 1

  return (
    <nav className={styles.bar} aria-label="Cook navigation">
      <div className={styles.inner}>
        {prevStep !== null ? (
          <Link
            href={stepHref(basePath, prevStep)}
            replace
            className={styles.btn}
            data-direction="prev"
          >
            <span aria-hidden>←</span>
            <span>{labels.previous}</span>
          </Link>
        ) : (
          <span className={clsx(styles.btn, styles.btnDisabled)} aria-hidden>
            <span>←</span>
            <span>{labels.previous}</span>
          </span>
        )}

        <span className={styles.dotsRow} aria-hidden>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={clsx(styles.dot, i === stepIndex && styles.dotActive, i < stepIndex && styles.dotPast)}
            />
          ))}
        </span>

        {nextStep !== null ? (
          <Link
            href={stepHref(basePath, nextStep)}
            replace
            className={clsx(styles.btn, styles.btnPrimary)}
            data-direction="next"
          >
            <span>{labels.next}</span>
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <span className={clsx(styles.btn, styles.btnPrimary)} data-direction="complete">
            <span>{labels.complete}</span>
            <span aria-hidden>✓</span>
          </span>
        )}
      </div>
    </nav>
  )
}
