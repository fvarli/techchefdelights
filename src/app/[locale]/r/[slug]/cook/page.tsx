import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { localePath } from '@/lib/path'
import { CookHeader } from '@/components/cook/CookHeader'
import { CookExitButton } from '@/components/cook/CookExitButton'
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

  const exitModalLabels = {
    title: t('exitModal.title'),
    description: t('exitModal.description'),
    progress: t('exitModal.progress', { current: '{current}', total: '{total}' }),
    saveAndExit: t('exitModal.saveAndExit'),
    stay: t('exitModal.stay'),
  }

  return (
    <div className={styles.page}>
      <CookHeader
        recipeTitle={recipe.title}
        totalSteps={totalSteps}
        currentStep={stepIndex}
        exitButton={
          <CookExitButton
            slug={recipe.slug}
            recipeHref={exitHref}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            labels={{ exit: t('exit'), modal: exitModalLabels }}
          />
        }
        labels={{ step: t('step'), of: t('of') }}
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
            timer: {
              start: t('timer.start'),
              pause: t('timer.pause'),
              resume: t('timer.resume'),
              reset: t('timer.reset'),
              addMinute: t('timer.addMinute'),
              complete: t('timer.complete'),
            },
          }}
        />
      </main>
      <CookControls
        slug={recipe.slug}
        basePath={cookBasePath}
        recipeHref={exitHref}
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
