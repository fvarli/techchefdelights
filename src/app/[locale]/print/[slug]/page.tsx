import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { formatScaledQuantity } from '@/lib/scaling'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import type { ApiIngredient } from '@/lib/api/types'
import styles from './print.module.css'

export const revalidate = 3600

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://techchefdelights.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const recipe = await loadRecipeBySlug(slug, locale)
  if (!recipe) return { title: 'Not found' }
  return {
    title: `${recipe.title} — Print`,
    description: recipe.description,
    robots: { index: false, follow: false },
  }
}

function formatIngredient(ing: ApiIngredient): string {
  const qty = formatScaledQuantity(ing.metric.quantity)
  const unit = ing.metric.unit && ing.metric.unit !== 'piece' ? ing.metric.unit : ''
  const head = [qty, unit].filter(Boolean).join(' ').trim()
  const main = head ? `${head} ${ing.name}` : ing.name
  const prep = ing.prep ? `, ${ing.prep}` : ''
  return main + prep
}

export default async function PrintRecipePage({
  params,
}: {
  params: Promise<{ locale: ApiLocale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const recipe = await loadRecipeBySlug(slug, locale)
  if (!recipe) notFound()

  const t = await getTranslations('Print')
  const tRecipe = await getTranslations('Recipe')

  const sourceUrl = `${BASE_URL}${localePath(locale, `/recipes/${recipe.slug}`)}`

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>TechChefDelights</p>
        <h1 className={styles.title}>{recipe.title}</h1>
        {recipe.tagline && <p className={styles.tagline}>{recipe.tagline}</p>}
      </header>

      <dl className={styles.meta}>
        <div className={styles.metaCell}>
          <dt>{tRecipe('signalBar.serves')}</dt>
          <dd>{recipe.meta.servings}</dd>
        </div>
        <div className={styles.metaCell}>
          <dt>{tRecipe('signalBar.prep')}</dt>
          <dd>
            {recipe.meta.prepMinutes} {tRecipe('signalBar.minutes')}
          </dd>
        </div>
        <div className={styles.metaCell}>
          <dt>{tRecipe('signalBar.cook')}</dt>
          <dd>
            {recipe.meta.cookMinutes} {tRecipe('signalBar.minutes')}
          </dd>
        </div>
        <div className={styles.metaCell}>
          <dt>{tRecipe('signalBar.total')}</dt>
          <dd>
            {recipe.meta.totalMinutes} {tRecipe('signalBar.minutes')}
          </dd>
        </div>
        <div className={styles.metaCell}>
          <dt>{tRecipe('signalBar.difficulty')}</dt>
          <dd>{tRecipe(`skill.${recipe.meta.skill}`)}</dd>
        </div>
        {recipe.cuisine && (
          <div className={styles.metaCell}>
            <dt>{t('cuisine')}</dt>
            <dd>{recipe.cuisine.name}</dd>
          </div>
        )}
      </dl>

      {recipe.description && <p className={styles.description}>{recipe.description}</p>}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{tRecipe('sections.ingredients')}</h2>
        {recipe.ingredientGroups.map((group, gi) => (
          <div key={gi} className={styles.group}>
            {group.label && <h3 className={styles.groupTitle}>{group.label}</h3>}
            <ul className={styles.ingredientList}>
              {group.items.map((ing) => (
                <li key={ing.id} className={styles.ingredient}>
                  <span className={styles.checkbox} aria-hidden>
                    □
                  </span>
                  <span className={styles.ingredientText}>
                    {formatIngredient(ing)}
                    {ing.optional && (
                      <span className={styles.optional}> ({tRecipe('ingredients.optional')})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{tRecipe('sections.instructions')}</h2>
        <ol className={styles.steps}>
          {recipe.steps.map((step) => (
            <li key={step.index} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>
                  {tRecipe('instructions.step')} {step.index}
                </span>
                {step.timer && (
                  <span className={styles.stepTimer}>
                    {Math.round(step.timer.seconds / 60)} {tRecipe('signalBar.minutes')}
                  </span>
                )}
              </div>
              {step.title && <h3 className={styles.stepTitle}>{step.title}</h3>}
              <p className={styles.stepBody}>{step.body}</p>
              {step.note && (
                <p className={styles.stepNote}>
                  <em>{tRecipe('instructions.chefNote')}:</em> {step.note}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {recipe.nutrition && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{tRecipe('nutrition.title')}</h2>
          <p className={styles.nutritionLine}>
            <strong>
              {recipe.nutrition.calories} {tRecipe('nutrition.calories')}
            </strong>
            {' · '}
            {tRecipe('nutrition.protein')} {recipe.nutrition.macros.proteinG}g
            {' · '}
            {tRecipe('nutrition.carbs')} {recipe.nutrition.macros.carbsG}g
            {' · '}
            {tRecipe('nutrition.fat')} {recipe.nutrition.macros.fatG}g
            {recipe.nutrition.macros.fiberG !== null && (
              <>
                {' · '}
                {tRecipe('nutrition.fiber')} {recipe.nutrition.macros.fiberG}g
              </>
            )}
          </p>
          <p className={styles.nutritionFootnote}>{tRecipe('nutrition.basedOn')}</p>
        </section>
      )}

      <footer className={styles.footer}>
        <p className={styles.source}>
          {t('source')}: <span className={styles.sourceUrl}>{sourceUrl}</span>
        </p>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} TechChefDelights · {t('printedOn')}{' '}
          {new Date().toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </footer>
    </article>
  )
}
