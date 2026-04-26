import Link from 'next/link'
import clsx from 'clsx'
import styles from './FilterPillRow.module.css'

export type FilterPill = {
  label: string
  /** Search params to navigate to when this pill is clicked. */
  searchParams: Record<string, string | undefined>
  active: boolean
}

type Props = {
  label: string
  basePath: string
  pills: FilterPill[]
}

function buildHref(basePath: string, params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1] !== '',
  )
  if (entries.length === 0) return basePath
  const search = new URLSearchParams(entries).toString()
  return `${basePath}?${search}`
}

export function FilterPillRow({ label, basePath, pills }: Props) {
  return (
    <div className={styles.row} aria-label={label}>
      <span className={styles.label}>{label}</span>
      <div className={styles.pills} role="list">
        {pills.map((pill, i) => (
          <Link
            key={i}
            role="listitem"
            href={buildHref(basePath, pill.searchParams)}
            scroll={false}
            className={clsx(styles.pill, pill.active && styles.pillActive)}
            aria-current={pill.active ? 'true' : undefined}
          >
            {pill.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
