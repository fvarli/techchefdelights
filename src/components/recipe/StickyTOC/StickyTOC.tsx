import styles from './StickyTOC.module.css'

type TOCItem = {
  id: string
  label: string
}

type StickyTOCProps = {
  items: TOCItem[]
  title: string
}

export function StickyTOC({ items, title }: StickyTOCProps) {
  return (
    <nav className={styles.toc} aria-label={title}>
      <h2 className={styles.label}>{title}</h2>
      <ol className={styles.list}>
        {items.map((item, i) => (
          <li key={item.id} className={styles.item}>
            <a href={`#${item.id}`} className={styles.link}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.text}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
