import type { PrismaClient } from '../../src/generated/prisma/client'
import type { RecipeSeed, Locale } from './types'
import { ingredientMasterSlug } from './ingredient-masters'

const LOCALES: Locale[] = ['EN', 'TR', 'ES']

export async function seedRecipe(prisma: PrismaClient, recipe: RecipeSeed) {
  const [author, cuisine] = await Promise.all([
    prisma.author.findUnique({ where: { slug: recipe.authorSlug } }),
    prisma.cuisine.findUnique({ where: { slug: recipe.cuisineSlug } }),
  ])
  if (!author) throw new Error(`Author not found: ${recipe.authorSlug}`)
  if (!cuisine) throw new Error(`Cuisine not found: ${recipe.cuisineSlug}`)

  // 1. Upsert base Recipe (without children)
  await prisma.recipe.upsert({
    where: { id: recipe.seedId },
    update: {
      authorId: author.id,
      cuisineId: cuisine.id,
      skill: recipe.skill,
      servings: recipe.servings,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      totalMinutes: recipe.totalMinutes,
      heroImageCloudinary: recipe.heroImageCloudinary,
      heroBlurhash: recipe.heroBlurhash,
      costPerServingCents: recipe.costPerServingCents,
      costCurrency: recipe.costCurrency,
    },
    create: {
      id: recipe.seedId,
      authorId: author.id,
      cuisineId: cuisine.id,
      skill: recipe.skill,
      servings: recipe.servings,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      totalMinutes: recipe.totalMinutes,
      heroImageCloudinary: recipe.heroImageCloudinary,
      heroBlurhash: recipe.heroBlurhash,
      costPerServingCents: recipe.costPerServingCents,
      costCurrency: recipe.costCurrency,
    },
  })

  // 2. Wipe children (cascades handle deeper trees)
  await prisma.recipeTranslation.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.ingredientGroup.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.step.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.recipeEquipment.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.variation.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.fAQ.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.nutrition.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.recipeCategory.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.recipeTag.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.recipeDiet.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.recipeAllergen.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.recipeImage.deleteMany({ where: { recipeId: recipe.seedId } })
  await prisma.review.deleteMany({
    where: { recipeId: recipe.seedId, isPlaceholder: true },
  })

  // 3. Translations
  await prisma.recipeTranslation.createMany({
    data: LOCALES.map((locale) => ({
      recipeId: recipe.seedId,
      locale,
      slug: recipe.translations[locale].slug,
      title: recipe.translations[locale].title,
      tagline: recipe.translations[locale].tagline,
      description: recipe.translations[locale].description,
      story: recipe.translations[locale].story,
      seoTitle: recipe.translations[locale].seoTitle,
      seoDescription: recipe.translations[locale].seoDescription,
    })),
  })

  // 4. Ingredient groups + items (build refToId map)
  const refToId = new Map<string, string>()
  for (const group of recipe.ingredientGroups) {
    const groupRow = await prisma.ingredientGroup.create({
      data: {
        recipeId: recipe.seedId,
        position: group.position,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            label: group.translations[locale].label,
          })),
        },
      },
    })
    for (const item of group.items) {
      // Link to canonical IngredientMaster by deriving the slug from the
      // EN name. The master row is created earlier in the seed run; if a
      // recipe introduces a new ingredient the master must be backfilled
      // — log a warning instead of failing so the recipe still seeds.
      const masterSlug = ingredientMasterSlug(item.translations.EN.name)
      const master = masterSlug
        ? await prisma.ingredientMaster.findUnique({ where: { slug: masterSlug } })
        : null
      if (masterSlug && !master) {
        // eslint-disable-next-line no-console
        console.warn(
          `[seed] missing IngredientMaster for slug='${masterSlug}' (recipe='${recipe.seedId}'). ` +
            `Run seedIngredientMasters first.`,
        )
      }

      const itemRow = await prisma.ingredient.create({
        data: {
          groupId: groupRow.id,
          masterId: master?.id ?? null,
          position: item.position,
          quantity: item.metric.quantity,
          unit: item.metric.unit,
          quantityUS: item.us.quantity,
          unitUS: item.us.unit,
          optional: item.optional,
          aisle: item.aisle,
          translations: {
            create: LOCALES.map((locale) => ({
              locale,
              name: item.translations[locale].name,
              prep: item.translations[locale].prep,
              substitutes: item.translations[locale].substitutes,
            })),
          },
        },
      })
      refToId.set(item.ref, itemRow.id)
    }
  }

  // 5. Steps (resolve ingredient refs to ids)
  for (const step of recipe.steps) {
    await prisma.step.create({
      data: {
        recipeId: recipe.seedId,
        index: step.index,
        timerSeconds: step.timerSeconds,
        ingredientRefs: step.ingredientRefs
          .map((ref) => refToId.get(ref))
          .filter((id): id is string => Boolean(id)),
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: step.translations[locale].title,
            body: step.translations[locale].body,
            note: step.translations[locale].note,
            timerLabel: step.translations[locale].timerLabel,
          })),
        },
      },
    })
  }

  // 6. Equipment joins (with usage metadata)
  for (let i = 0; i < recipe.equipmentSlugs.length; i++) {
    const usage = recipe.equipmentSlugs[i]
    const slug = typeof usage === 'string' ? usage : usage.slug
    const eq = await prisma.equipment.findUnique({ where: { slug } })
    if (!eq) throw new Error(`Equipment not found: ${slug}`)
    await prisma.recipeEquipment.create({
      data: {
        recipeId: recipe.seedId,
        equipmentId: eq.id,
        required: typeof usage === 'string' ? true : (usage.required ?? true),
        quantity: typeof usage === 'string' ? null : (usage.quantity ?? null),
        note: typeof usage === 'string' ? null : (usage.note ?? null),
        position: typeof usage === 'string' ? i : (usage.position ?? i),
      },
    })
  }

  // 7. Variations
  for (const v of recipe.variations) {
    await prisma.variation.create({
      data: {
        recipeId: recipe.seedId,
        position: v.position,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: v.translations[locale].title,
            body: v.translations[locale].body,
          })),
        },
      },
    })
  }

  // 8. FAQ
  for (const f of recipe.faq) {
    await prisma.fAQ.create({
      data: {
        recipeId: recipe.seedId,
        position: f.position,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            q: f.translations[locale].q,
            a: f.translations[locale].a,
          })),
        },
      },
    })
  }

  // 9. Nutrition (1:1)
  await prisma.nutrition.create({
    data: {
      recipeId: recipe.seedId,
      ...recipe.nutrition,
    },
  })

  // 10. Categories / Tags / Diets
  for (const slug of recipe.categorySlugs) {
    const cat = await prisma.category.findUnique({ where: { slug } })
    if (!cat) throw new Error(`Category not found: ${slug}`)
    await prisma.recipeCategory.create({
      data: { recipeId: recipe.seedId, categoryId: cat.id },
    })
  }
  for (const slug of recipe.tagSlugs) {
    const tag = await prisma.tag.findUnique({ where: { slug } })
    if (!tag) throw new Error(`Tag not found: ${slug}`)
    await prisma.recipeTag.create({
      data: { recipeId: recipe.seedId, tagId: tag.id },
    })
  }
  for (const slug of recipe.dietSlugs) {
    const diet = await prisma.diet.findUnique({ where: { slug } })
    if (!diet) throw new Error(`Diet not found: ${slug}`)
    await prisma.recipeDiet.create({
      data: { recipeId: recipe.seedId, dietId: diet.id },
    })
  }

  // 11. Allergens (with presence)
  for (const a of recipe.allergens) {
    const al = await prisma.allergen.findUnique({ where: { slug: a.slug } })
    if (!al) throw new Error(`Allergen not found: ${a.slug}`)
    await prisma.recipeAllergen.create({
      data: { recipeId: recipe.seedId, allergenId: al.id, presence: a.presence },
    })
  }

  // 12. Gallery
  for (const img of recipe.gallery) {
    await prisma.recipeImage.create({
      data: {
        recipeId: recipe.seedId,
        cloudinaryId: img.cloudinaryId,
        w: img.w,
        h: img.h,
        blurhash: img.blurhash,
        position: img.position,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            alt: img.translations[locale].alt,
          })),
        },
      },
    })
  }

  // 13. Placeholder reviews + derive ratingAvg/Count/Dist
  const ratingDist: number[] = [0, 0, 0, 0, 0] // [1*..5*]
  for (const r of recipe.reviews) {
    await prisma.review.create({
      data: {
        recipeId: recipe.seedId,
        rating: r.rating,
        body: r.body[r.authorLocale],
        authorName: 'Demo Reviewer · Sample Data',
        authorLocale: r.authorLocale,
        isPlaceholder: true,
      },
    })
    ratingDist[r.rating - 1] += 1
  }
  const ratingCount = recipe.reviews.length
  const ratingSum = recipe.reviews.reduce((sum, r) => sum + r.rating, 0)
  const ratingAvg = ratingCount > 0 ? ratingSum / ratingCount : 0

  await prisma.recipe.update({
    where: { id: recipe.seedId },
    data: { ratingAvg, ratingCount, ratingDist },
  })
}
