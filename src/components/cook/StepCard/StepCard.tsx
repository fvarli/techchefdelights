import { TimerModule } from '@/components/cook/TimerModule'
import type { ApiRecipe } from '@/lib/api/types'
import styles from './StepCard.module.css'

type Step = ApiRecipe['steps'][number]
type Ingredient = ApiRecipe['ingredientGroups'][number]['items'][number]

type Props = {
  step: Step
  stepIndex: number
  totalSteps: number
  ingredients: Ingredient[]
  labels: {
    step: string
    chefNote: string
    ingredientsUsed: string
    noIngredients: string
    timer: {
      start: string
      pause: string
      resume: string
      reset: string
      addMinute: string
      complete: string
    }
  }
}

export function StepCard({ step, stepIndex, totalSteps, ingredients, labels }: Props) {
  const refs = step.ingredientRefs ?? []
  const usedIngredients = refs
    .map((id) => ingredients.find((i) => i.id === id))
    .filter((i): i is Ingredient => Boolean(i))

  return (
    <article className={styles.card}>
      <div className={styles.numCol}>
        <span className={styles.numLabel}>{labels.step}</span>
        <span className={styles.num}>{String(stepIndex + 1).padStart(2, '0')}</span>
        <span className={styles.numTotal}>of {String(totalSteps).padStart(2, '0')}</span>
      </div>

      <div className={styles.body}>
        {step.title && <h2 className={styles.title}>{step.title}</h2>}
        <p className={styles.text}>{step.body}</p>

        {step.note && (
          <aside className={styles.note}>
            <span className={styles.noteLabel}>{labels.chefNote}</span>
            <p className={styles.noteText}>{step.note}</p>
          </aside>
        )}

        {step.timer && (
          <TimerModule
            key={`step-${stepIndex}`}
            seconds={step.timer.seconds}
            customLabel={step.timer.label}
            labels={labels.timer}
          />
        )}

        <section className={styles.ingredientsSection}>
          <h3 className={styles.ingredientsLabel}>{labels.ingredientsUsed}</h3>
          {usedIngredients.length === 0 ? (
            <p className={styles.noIngredients}>{labels.noIngredients}</p>
          ) : (
            <ul className={styles.ingredientsList}>
              {usedIngredients.map((item) => (
                <li key={item.id} className={styles.ingredientRow}>
                  <span className={styles.ingredientQty}>
                    {item.metric.quantity !== null && item.metric.quantity}
                    {item.metric.unit && (
                      <span className={styles.ingredientUnit}> {item.metric.unit}</span>
                    )}
                  </span>
                  <span className={styles.ingredientName}>{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  )
}
