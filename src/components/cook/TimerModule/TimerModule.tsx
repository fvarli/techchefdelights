'use client'

import clsx from 'clsx'
import { useTimer } from '@/hooks/useTimer'
import styles from './TimerModule.module.css'

type Props = {
  seconds: number
  customLabel: string | null
  labels: {
    start: string
    pause: string
    resume: string
    reset: string
    addMinute: string
    complete: string
  }
}

function formatMs(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerModule({ seconds, customLabel, labels }: Props) {
  const timer = useTimer(seconds)
  const pct =
    timer.totalMs > 0
      ? Math.min(100, ((timer.totalMs - timer.remainingMs) / timer.totalMs) * 100)
      : 0

  return (
    <div className={clsx(styles.module, styles[`state-${timer.state}`])} role="timer" aria-live="polite">
      {customLabel && <span className={styles.label}>{customLabel}</span>}
      <div className={styles.display} aria-label={formatMs(timer.remainingMs)}>
        {formatMs(timer.remainingMs)}
      </div>
      <div className={styles.progress} aria-hidden>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.controls}>
        {timer.state === 'idle' && (
          <button type="button" onClick={timer.start} className={styles.primary}>
            {labels.start}
          </button>
        )}
        {timer.state === 'active' && (
          <button type="button" onClick={timer.pause} className={styles.primary}>
            {labels.pause}
          </button>
        )}
        {timer.state === 'paused' && (
          <>
            <button type="button" onClick={timer.resume} className={styles.primary}>
              {labels.resume}
            </button>
            <button type="button" onClick={timer.reset} className={styles.secondary}>
              {labels.reset}
            </button>
          </>
        )}
        {timer.state === 'complete' && (
          <>
            <span className={styles.completeLabel}>{labels.complete}</span>
            <button type="button" onClick={timer.reset} className={styles.secondary}>
              {labels.reset}
            </button>
          </>
        )}
        {timer.state !== 'complete' && (
          <button
            type="button"
            onClick={timer.addMinute}
            className={styles.tertiary}
            aria-label={labels.addMinute}
          >
            {labels.addMinute}
          </button>
        )}
      </div>
    </div>
  )
}
