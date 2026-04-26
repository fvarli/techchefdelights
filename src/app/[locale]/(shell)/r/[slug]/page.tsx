import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { recipeJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { fromApiLocale } from '@/lib/api/enums'
import { RecipeHero } from '@/components/recipe/RecipeHero'
import { SignalBar } from '@/components/recipe/SignalBar'
import { StickyTOC } from '@/components/recipe/StickyTOC'
import {
  IngredientsSection,
  IngredientsSectionFallback,
} from '@/components/recipe/IngredientsSection'
import { AllergyAlert } from '@/components/recipe/AllergyAlert'
import { EquipmentList } from '@/components/recipe/EquipmentList'
import { InstructionsSection } from '@/components/recipe/InstructionsSection'
import { VariationsList } from '@/components/recipe/VariationsList'
import { FAQList } from '@/components/recipe/FAQList'
import { ReviewsSection } from '@/components/recipe/ReviewsSection'
import { RelatedRecipes, type RelatedRecipeItem } from '@/components/recipe/RelatedRecipes'
import { RightRail } from '@/components/recipe/RightRail'
import { ResumeBanner } from '@/components/recipe/ResumeBanner'
import { TocAccordion } from '@/components/recipe/TocAccordion'
import { StickyCookCTA } from '@/components/recipe/StickyCookCTA'
import { localePath } from '@/lib/path'
import type { ApiLocale } from '@/lib/api/enums'
import styles from './recipe.module.css'

export const revalidate = 3600

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? 'https://techchefdelights.com'

export async function generateStaticParams() {
  const translations = await db.recipeTranslation.findMany({
    where: { recipe: { isDraft: false } },
    select: { locale: true, slug: true },
  })
  return translations.map((t) => ({
    locale: t.locale.toLowerCase(),
    slug: t.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ApiLocale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const recipe = await loadRecipeBySlug(slug, locale)
  if (!recipe) return { title: 'Recipe not found' }

  const path = locale === 'en' ? `/r/${recipe.slug}` : `/${locale}/r/${recipe.slug}`

  return {
    title: recipe.seo.title ?? recipe.title,
    description: recipe.seo.description ?? recipe.description,
    alternates: {
      canonical: path,
      languages: {
        en: `/r/${recipe.slugByLocale.en}`,
        tr: `/tr/r/${recipe.slugByLocale.tr}`,
        es: `/es/r/${recipe.slugByLocale.es}`,
      },
    },
    openGraph: {
      title: recipe.seo.title ?? recipe.title,
      description: recipe.seo.description ?? recipe.description,
      type: 'article',
      url: `${BASE_URL}${path}`,
    },
  }
}

async function loadRelated(
  recipeId: string,
  cuisineId: string | null,
  locale: ApiLocale,
): Promise<RelatedRecipeItem[]> {
  if (!cuisineId) return []
  const prismaLocale = fromApiLocale(locale)
  const candidates = await db.recipe.findMany({
    where: {
      cuisineId,
      id: { not: recipeId },
      isDraft: false,
    },
    take: 4,
    orderBy: { publishedAt: 'desc' },
    include: {
      translations: { where: { locale: prismaLocale } },
      cuisine: { include: { translations: { where: { locale: prismaLocale } } } },
    },
  })
  return candidates
    .filter((c) => c.translations[0])
    .map((c) => ({
      slug: c.translations[0].slug,
      title: c.translations[0].title,
      tagline: c.translations[0].tagline,
      totalMinutes: c.totalMinutes,
      cuisine: c.cuisine?.translations[0]?.name ?? null,
    }))
}

async function loadReviews(recipeId: string) {
  return db.review.findMany({
    where: { recipeId },
    take: 10,
    orderBy: [{ isPlaceholder: 'asc' }, { createdAt: 'desc' }],
  })
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: ApiLocale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const recipe = await loadRecipeBySlug(slug, locale)
  if (!recipe) notFound()

  const recipeRow = await db.recipe.findUnique({
    where: { id: recipe.id },
    select: { cuisineId: true },
  })

  const [related, reviews, t, tCook] = await Promise.all([
    loadRelated(recipe.id, recipeRow?.cuisineId ?? null, locale),
    loadReviews(recipe.id),
    getTranslations('Recipe'),
    getTranslations('Cook'),
  ])

  const tocItems = [
    { id: 'story', label: t('toc.story') },
    { id: 'ingredients', label: t('toc.ingredients') },
    { id: 'equipment', label: t('toc.equipment') },
    { id: 'instructions', label: t('toc.instructions') },
    { id: 'variations', label: t('toc.variations') },
    { id: 'faq', label: t('toc.faq') },
    { id: 'reviews', label: t('toc.reviews') },
  ]

  const breadcrumbLabels = { home: t('breadcrumb.home'), recipes: t('breadcrumb.recipes') }
  const signalLabels = {
    prep: t('signalBar.prep'),
    cook: t('signalBar.cook'),
    total: t('signalBar.total'),
    serves: t('signalBar.serves'),
    difficulty: t('signalBar.difficulty'),
    rating: t('signalBar.rating'),
    minutes: t('signalBar.minutes'),
    skill: {
      beginner: t('skill.beginner'),
      intermediate: t('skill.intermediate'),
      advanced: t('skill.advanced'),
    },
  }
  const ingredientsLabels = {
    title: t('sections.ingredients'),
    scaleLabel: t('ingredients.scaleLabel'),
    optional: t('ingredients.optional'),
    containsAllergen: t('ingredients.containsAllergen'),
    toTaste: t('ingredients.toTaste'),
  }
  const allergyAlertLabels = {
    title: t('allergyAlert.title'),
    contains: t('allergyAlert.contains'),
  }
  const instructionsLabels = {
    title: t('sections.instructions'),
    step: t('instructions.step'),
    chefNote: t('instructions.chefNote'),
    minutes: t('signalBar.minutes'),
  }
  const reviewsLabels = {
    title: t('sections.reviews'),
    summary: t('reviews.summary'),
    placeholder: t('reviews.placeholder'),
    noReviews: t('reviews.noReviews'),
    signInToReview: t('reviews.signInToReview'),
  }
  const relatedLabels = { title: t('sections.related'), minutes: t('signalBar.minutes') }

  const rightRailLabels = {
    nutrition: {
      title: t('nutrition.title'),
      servingSize: t('nutrition.servingSize'),
      calories: t('nutrition.calories'),
      protein: t('nutrition.protein'),
      carbs: t('nutrition.carbs'),
      fat: t('nutrition.fat'),
      fiber: t('nutrition.fiber'),
      sodium: t('nutrition.sodium'),
      basedOn: t('nutrition.basedOn'),
    },
    dietary: {
      title: t('dietary.title'),
      diets: t('dietary.diets'),
      contains: t('dietary.contains'),
      mayContain: t('dietary.mayContain'),
      none: t('dietary.none'),
    },
    cost: {
      title: t('cost.title'),
      perServing: t('cost.perServing'),
      totalForAll: t('cost.totalForAll'),
      note: t('cost.note'),
    },
    utilities: {
      title: t('utilities.title'),
      save: t('utilities.save'),
      saved: t('utilities.saved'),
      addToList: t('utilities.addToList'),
      inList: t('utilities.inList'),
      plan: t('utilities.plan'),
      planSoon: t('utilities.planSoon'),
      print: t('utilities.print'),
      share: t('utilities.share'),
      shareCopied: t('utilities.shareCopied'),
      units: t('utilities.units'),
      unitMetric: t('utilities.unitMetric'),
      unitUS: t('utilities.unitUS'),
    },
  }

  const cookHref = localePath(locale, `/r/${recipe.slug}/cook`)
  const resumeBannerLabels = {
    title: tCook('resumeBanner.title'),
    body: tCook('resumeBanner.body'),
    resume: tCook('resumeBanner.resume'),
    dismiss: tCook('resumeBanner.dismiss'),
  }

  const jsonLdRecipe = recipeJsonLd(recipe, locale, BASE_URL)
  const jsonLdFaq = faqJsonLd(recipe.faq)
  const jsonLdBreadcrumb = breadcrumbJsonLd(recipe, locale, BASE_URL, breadcrumbLabels)

  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRecipe) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <RecipeHero recipe={recipe} locale={locale} breadcrumb={breadcrumbLabels} />
      <SignalBar recipe={recipe} labels={signalLabels} />

      <ResumeBanner slug={recipe.slug} cookHref={cookHref} labels={resumeBannerLabels} />

      <div className={styles.grid}>
        <aside className={styles.leftRail}>
          <StickyTOC items={tocItems} title={t('toc.title')} />
        </aside>

        <div className={styles.body}>
          <TocAccordion items={tocItems} title={t('toc.mobileTitle')} />

          <section id="story" className={styles.story}>
            <h2 className={styles.storyTitle}>{t('sections.story')}</h2>
            {recipe.story.split('\n\n').map((para, i) => (
              <p key={i} className={styles.storyPara}>
                {para}
              </p>
            ))}
          </section>

          <AllergyAlert allergens={recipe.allergens} labels={allergyAlertLabels} />

          <Suspense
            fallback={
              <IngredientsSectionFallback
                recipe={recipe}
                labels={{
                  title: ingredientsLabels.title,
                  optional: ingredientsLabels.optional,
                  containsAllergen: ingredientsLabels.containsAllergen,
                  toTaste: ingredientsLabels.toTaste,
                }}
              />
            }
          >
            <IngredientsSection recipe={recipe} labels={ingredientsLabels} />
          </Suspense>

          <EquipmentList equipment={recipe.equipment} title={t('sections.equipment')} />

          <InstructionsSection steps={recipe.steps} labels={instructionsLabels} />

          <VariationsList variations={recipe.variations} title={t('sections.variations')} />

          <FAQList faq={recipe.faq} title={t('sections.faq')} />

          <ReviewsSection
            rating={recipe.rating}
            reviews={reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              body: r.body,
              authorName: r.authorName,
              isPlaceholder: r.isPlaceholder,
              createdAt: r.createdAt.toISOString(),
            }))}
            labels={reviewsLabels}
          />
        </div>

        <aside className={styles.rightRail}>
          <RightRail recipe={recipe} locale={locale} labels={rightRailLabels} />
        </aside>
      </div>

      <RelatedRecipes items={related} locale={locale} labels={relatedLabels} />

      <StickyCookCTA
        cookHref={cookHref}
        label={t('startCooking')}
        totalMinutes={recipe.meta.totalMinutes}
        minutesLabel={t('signalBar.minutes')}
      />
    </article>
  )
}
