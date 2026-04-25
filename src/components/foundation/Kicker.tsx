import clsx from 'clsx'
import styles from './Kicker.module.css'

type KickerProps = {
  num?: string
  children: React.ReactNode
  tone?: 'terra' | 'mute'
  className?: string
}

export function Kicker({ num, children, tone = 'terra', className }: KickerProps) {
  return (
    <div className={clsx(styles.kicker, tone === 'mute' && styles.toneMute, className)}>
      ◆ {num && <span className={styles.num}>{num} / </span>}
      {children}
    </div>
  )
}
