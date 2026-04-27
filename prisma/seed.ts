import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

import { allergens } from './seed/data/allergens'
import { diets } from './seed/data/diets'
import { categories } from './seed/data/categories'
import { cuisines } from './seed/data/cuisines'
import { tags } from './seed/data/tags'
import { equipment } from './seed/data/equipment'
import { authors } from './seed/data/authors'
import { recipes } from './seed/data/recipes'
import { seedRecipe } from './seed/recipes'
import { seedIngredientMasters } from './seed/ingredient-masters'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function seedAllergens() {
  for (const a of allergens) {
    const row = await prisma.allergen.upsert({
      where: { slug: a.slug },
      update: {},
      create: { slug: a.slug },
    })
    for (const t of a.translations) {
      await prisma.allergenTranslation.upsert({
        where: { allergenId_locale: { allergenId: row.id, locale: t.locale } },
        update: { name: t.name },
        create: { allergenId: row.id, locale: t.locale, name: t.name },
      })
    }
  }
}

async function seedDiets() {
  for (const d of diets) {
    const row = await prisma.diet.upsert({
      where: { slug: d.slug },
      update: {},
      create: { slug: d.slug },
    })
    for (const t of d.translations) {
      await prisma.dietTranslation.upsert({
        where: { dietId_locale: { dietId: row.id, locale: t.locale } },
        update: { name: t.name, description: t.description },
        create: { dietId: row.id, locale: t.locale, name: t.name, description: t.description },
      })
    }
  }
}

async function seedCategories() {
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { iconKey: c.iconKey, popularityRank: c.popularityRank },
      create: { slug: c.slug, iconKey: c.iconKey, popularityRank: c.popularityRank },
    })
    for (const t of c.translations) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: row.id, locale: t.locale } },
        update: { name: t.name, description: t.description, slug: t.slug },
        create: {
          categoryId: row.id,
          locale: t.locale,
          name: t.name,
          description: t.description,
          slug: t.slug,
        },
      })
    }
  }
}

async function seedCuisines() {
  for (const c of cuisines) {
    const row = await prisma.cuisine.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug },
    })
    for (const t of c.translations) {
      await prisma.cuisineTranslation.upsert({
        where: { cuisineId_locale: { cuisineId: row.id, locale: t.locale } },
        update: { name: t.name },
        create: { cuisineId: row.id, locale: t.locale, name: t.name },
      })
    }
  }
}

async function seedTags() {
  for (const tag of tags) {
    const row = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: { slug: tag.slug },
    })
    for (const t of tag.translations) {
      await prisma.tagTranslation.upsert({
        where: { tagId_locale: { tagId: row.id, locale: t.locale } },
        update: { name: t.name },
        create: { tagId: row.id, locale: t.locale, name: t.name },
      })
    }
  }
}

async function seedEquipment() {
  for (const e of equipment) {
    const row = await prisma.equipment.upsert({
      where: { slug: e.slug },
      update: { iconKey: e.iconKey },
      create: { slug: e.slug, iconKey: e.iconKey },
    })
    for (const t of e.translations) {
      await prisma.equipmentTranslation.upsert({
        where: { equipmentId_locale: { equipmentId: row.id, locale: t.locale } },
        update: { name: t.name },
        create: { equipmentId: row.id, locale: t.locale, name: t.name },
      })
    }
  }
}

async function seedAuthors() {
  for (const a of authors) {
    const row = await prisma.author.upsert({
      where: { slug: a.slug },
      update: { name: a.name, avatar: a.avatar },
      create: { slug: a.slug, name: a.name, avatar: a.avatar },
    })
    for (const t of a.translations) {
      await prisma.authorTranslation.upsert({
        where: { authorId_locale: { authorId: row.id, locale: t.locale } },
        update: { title: t.title, bio: t.bio },
        create: { authorId: row.id, locale: t.locale, title: t.title, bio: t.bio },
      })
    }
  }
}

async function main() {
  console.log('▸ allergens (EU FIC 14)')
  await seedAllergens()
  console.log('▸ diets (6)')
  await seedDiets()
  console.log('▸ categories (8)')
  await seedCategories()
  console.log('▸ cuisines (12)')
  await seedCuisines()
  console.log('▸ tags (10)')
  await seedTags()
  console.log('▸ equipment (12)')
  await seedEquipment()
  console.log('▸ authors (1)')
  await seedAuthors()
  console.log('✓ reference data seeded')

  console.log('▸ ingredient masters (derived from recipes)')
  const masterCount = await seedIngredientMasters(prisma, recipes)
  console.log(`✓ ${masterCount} ingredient masters seeded`)

  console.log(`▸ recipes (${recipes.length})`)
  for (const r of recipes) {
    await seedRecipe(prisma, r)
    console.log(`  ✓ ${r.translations.EN.title}`)
  }
  console.log('✓ recipes seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
