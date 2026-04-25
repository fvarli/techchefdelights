import clsx from 'clsx'
import styles from './Pill.module.css'

type PillVariant = 'default' | 'active' | 'terra' | 'sage' | 'ghost'

type PillProps = {
  children: React.ReactNode
  variant?: PillVariant
  className?: string
}

export function Pill({ children, variant = 'default', className }: PillProps) {
  return (
    <span className={clsx(styles.pill, styles[variant], className)}>{children}</span>
  )
}
