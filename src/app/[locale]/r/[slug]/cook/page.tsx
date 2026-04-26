import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { localePath } from '@/lib/path'
import { CookHeader } from '@/components/cook/CookHeader'
import { StepCard } from '@/components/cook/StepCard'
import { CookControls } from '@/components/cook/CookControls'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './cook.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const recipe = await loadRecipeBySlug(slug, locale as ApiLocale)
  return {
    title: recipe ? `${recipe.title} — Cook` : 'Cook',
    robots: { index: false, follow: false },
  }
}

function clampStep(value: string | undefined, max: number): number {
  const n = value ? parseInt(value, 10) : 0
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(n, max - 1))
}

export default async function CookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const sp = await searchParams
  const locale = rawLocale as ApiLocale
  setRequestLocale(locale)

  const recipe = await loadRecipeBySlug(slug, locale)
  if (!recipe) notFound()
  if (recipe.steps.length === 0) notFound()

  const totalSteps = recipe.steps.length
  const stepIndex = clampStep(sp.step, totalSteps)
  const step = recipe.steps[stepIndex]
  const ingredients = recipe.ingredientGroups.flatMap((g) => g.items)

  const t = await getTranslations('Cook')
  const exitHref = localePath(locale, `/r/${recipe.slug}`)
  const cookBasePath = localePath(locale, `/r/${recipe.slug}/cook`)

  return (
    <div className={styles.page}>
      <CookHeader
        recipeTitle={recipe.title}
        totalSteps={totalSteps}
        currentStep={stepIndex}
        exitHref={exitHref}
        labels={{ exit: t('exit'), step: t('step'), of: t('of') }}
      />
      <main className={styles.main}>
        <StepCard
          step={step}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          ingredients={ingredients}
          labels={{
            step: t('step'),
            chefNote: t('chefNote'),
            ingredientsUsed: t('ingredientsUsed'),
            noIngredients: t('noIngredients'),
          }}
        />
      </main>
      <CookControls
        basePath={cookBasePath}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        labels={{
          previous: t('previous'),
          next: t('next'),
          complete: t('complete'),
        }}
      />
    </div>
  )
}
