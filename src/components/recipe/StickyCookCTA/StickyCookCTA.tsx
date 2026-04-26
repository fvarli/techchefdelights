import Link from 'next/link'
import styles from './StickyCookCTA.module.css'

type Props = {
  cookHref: string
  label: string
  totalMinutes: number
  minutesLabel: string
}

export function StickyCookCTA({ cookHref, label, totalMinutes, minutesLabel }: Props) {
  return (
    <div className={styles.wrap} aria-hidden="false">
      <Link href={cookHref} className={styles.cta}>
        <span className={styles.text}>{label}</span>
        <span className={styles.meta}>
          {totalMinutes} {minutesLabel}
        </span>
        <span aria-hidden className={styles.arrow}>→</span>
      </Link>
    </div>
  )
}
