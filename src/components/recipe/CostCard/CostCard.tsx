import { formatMoney } from '@/lib/money'
import type { Money } from '@/lib/api/types'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './CostCard.module.css'

type Props = {
  cost: Money | null
  servings: number
  locale: ApiLocale
  labels: {
    title: string
    perServing: string
    totalForAll: string
    note: string
  }
}

export function CostCard({ cost, servings, locale, labels }: Props) {
  if (!cost) return null
  const perServing = formatMoney(cost, locale)
  const total = formatMoney(
    { amountMinor: cost.amountMinor * servings, currency: cost.currency },
    locale,
  )

  return (
    <section className={styles.card} aria-labelledby="cost-heading">
      <h2 id="cost-heading" className={styles.title}>
        {labels.title}
      </h2>
      <div className={styles.row}>
        <span className={styles.amount}>{perServing}</span>
        <span className={styles.subtext}>{labels.perServing}</span>
      </div>
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>
          {labels.totalForAll.replace('{count}', String(servings))}
        </span>
        <span className={styles.totalValue}>{total}</span>
      </div>
      <p className={styles.note}>{labels.note}</p>
    </section>
  )
}
