import type { ApiRecipe } from '@/lib/api/types'
import styles from './NutritionCard.module.css'

type Props = {
  nutrition: ApiRecipe['nutrition']
  labels: {
    title: string
    servingSize: string
    calories: string
    protein: string
    carbs: string
    fat: string
    fiber: string
    sodium: string
    basedOn: string
  }
}

type Macro = {
  label: string
  value: number
  unit: string
  pct: number | null
  tone: 'protein' | 'carbs' | 'fat' | 'fiber' | 'sodium'
}

function NutrientBar({ macro }: { macro: Macro }) {
  return (
    <div className={styles.bar}>
      <div className={styles.barTop}>
        <span className={styles.barLabel}>{macro.label}</span>
        <span className={styles.barRight}>
          <span className={styles.barValue}>
            {macro.value}
            <span className={styles.barUnit}>{macro.unit}</span>
          </span>
          {macro.pct !== null && <span className={styles.barPct}>{macro.pct}%</span>}
        </span>
      </div>
      <div className={styles.barTrack} aria-hidden>
        <div
          className={`${styles.barFill} ${styles[`fill-${macro.tone}`]}`}
          style={{ width: `${Math.min(macro.pct ?? 0, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function NutritionCard({ nutrition, labels }: Props) {
  if (!nutrition) return null

  const macros: Macro[] = [
    {
      label: labels.protein,
      value: nutrition.macros.proteinG,
      unit: 'g',
      pct: nutrition.macros.proteinDailyPct,
      tone: 'protein',
    },
    {
      label: labels.carbs,
      value: nutrition.macros.carbsG,
      unit: 'g',
      pct: nutrition.macros.carbsDailyPct,
      tone: 'carbs',
    },
    {
      label: labels.fat,
      value: nutrition.macros.fatG,
      unit: 'g',
      pct: nutrition.macros.fatDailyPct,
      tone: 'fat',
    },
    ...(nutrition.macros.fiberG !== null
      ? [
          {
            label: labels.fiber,
            value: nutrition.macros.fiberG,
            unit: 'g',
            pct: nutrition.macros.fiberDailyPct,
            tone: 'fiber' as const,
          },
        ]
      : []),
    ...(nutrition.macros.sodiumMg !== null
      ? [
          {
            label: labels.sodium,
            value: nutrition.macros.sodiumMg,
            unit: 'mg',
            pct: nutrition.macros.sodiumDailyPct,
            tone: 'sodium' as const,
          },
        ]
      : []),
  ]

  return (
    <section className={styles.card} aria-labelledby="nutrition-heading">
      <header className={styles.head}>
        <h2 id="nutrition-heading" className={styles.title}>
          {labels.title}
        </h2>
        <span className={styles.servingSize}>{labels.servingSize}</span>
      </header>
      <div className={styles.calorieBlock}>
        <span className={styles.calorieNum}>{nutrition.calories}</span>
        <span className={styles.calorieUnit}>{labels.calories}</span>
      </div>
      <div className={styles.bars}>
        {macros.map((m) => (
          <NutrientBar key={m.tone} macro={m} />
        ))}
      </div>
      <p className={styles.note}>{labels.basedOn}</p>
    </section>
  )
}
