import type { ApiRecipeEquipment } from '@/lib/api/types'
import styles from './EquipmentList.module.css'

type Props = {
  equipment: ApiRecipeEquipment[]
  title: string
  optionalLabel: string
}

export function EquipmentList({ equipment, title, optionalLabel }: Props) {
  if (equipment.length === 0) return null
  return (
    <section id="equipment" className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.grid}>
        {equipment.map((item) => (
          <li key={item.slug} className={styles.item}>
            <span className={styles.name}>{item.name}</span>
            {item.quantity !== null && item.quantity > 1 && (
              <span className={styles.quantity} aria-label={`Quantity ${item.quantity}`}>
                ×{item.quantity}
              </span>
            )}
            {!item.required && <span className={styles.optional}>{optionalLabel}</span>}
            {item.note && <span className={styles.note}>{item.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}
