import styles from './TocAccordion.module.css'

type TOCItem = { id: string; label: string }

type Props = {
  items: TOCItem[]
  title: string
}

/**
 * Mobile alternative to StickyTOC. Native <details>; zero JS, zero hydration cost.
 * Hidden via CSS at ≥1024px (where StickyTOC takes over).
 */
export function TocAccordion({ items, title }: Props) {
  return (
    <details className={styles.accordion}>
      <summary className={styles.summary}>
        <span className={styles.label}>{title}</span>
        <span className={styles.icon} aria-hidden>
          +
        </span>
      </summary>
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
    </details>
  )
}
