import clsx from 'clsx'
import styles from './MetaRow.module.css'

type MetaRowProps = {
  items: React.ReactNode[]
  size?: 'sm' | 'md'
  tone?: 'mute' | 'sub'
  className?: string
}

export function MetaRow({ items, size = 'md', tone = 'mute', className }: MetaRowProps) {
  return (
    <div
      className={clsx(
        styles.row,
        size === 'sm' && styles.sizeSm,
        tone === 'sub' && styles.toneSub,
        className,
      )}
    >
      {items.map((item, i) => (
        <span key={i} className={styles.item}>
          {i > 0 && <span className={styles.dot}>·</span>}
          {item}
        </span>
      ))}
    </div>
  )
}
