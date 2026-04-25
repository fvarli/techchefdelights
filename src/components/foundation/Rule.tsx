import clsx from 'clsx'
import styles from './Rule.module.css'

type RuleProps = {
  variant?: 'soft' | 'strong'
  className?: string
}

export function Rule({ variant = 'soft', className }: RuleProps) {
  return <hr className={clsx(styles.rule, variant === 'strong' && styles.strong, className)} />
}
