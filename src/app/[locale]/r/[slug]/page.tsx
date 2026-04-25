import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { loadRecipeBySlug } from '@/lib/api/recipe-loader'
import { recipeJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { RecipeHero } from '@/components/recipe/RecipeHero'
import { SignalBar } from '@/components/recipe/SignalBar'
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

export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: ApiLocale; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const recipe = await loadRecipeBySlug(slug, locale)
  if (!recipe) notFound()

  const t = await getTranslations('Recipe')
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
    </article>
  )
}
