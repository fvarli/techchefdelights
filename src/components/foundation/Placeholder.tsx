import clsx from 'clsx'
import styles from './Placeholder.module.css'

type PlaceholderTone = 'warm' | 'cool' | 'dark' | 'light' | 'sand'

type PlaceholderProps = {
  label?: string
  tone?: PlaceholderTone
  width?: number | string
  height?: number | string
  ratio?: number
  className?: string
}

export function Placeholder({
  label = 'FOOD',
  tone = 'warm',
  width,
  height,
  ratio,
  className,
}: PlaceholderProps) {
  const style: React.CSSProperties = {
    width: width ?? '100%',
    aspectRatio: ratio,
    height,
  }
  return (
    <div className={clsx(styles.ph, styles[tone], className)} style={style} aria-hidden="true">
      <span className={styles.label}>[{label}]</span>
    </div>
  )
}
