import type { ApiTaxonomyRef } from '@/lib/api/types'
import styles from './EquipmentList.module.css'

type Props = {
  equipment: ApiTaxonomyRef[]
  title: string
}

export function EquipmentList({ equipment, title }: Props) {
  if (equipment.length === 0) return null
  return (
    <section id="equipment" className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.grid}>
        {equipment.map((item) => (
          <li key={item.slug} className={styles.item}>
            <span className={styles.name}>{item.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
