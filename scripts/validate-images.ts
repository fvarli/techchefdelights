/**
 * Image manifest validator. Read-only: never uploads, deletes, renames,
 * or mutates any Cloudinary asset.
 *
 * Default mode: warns about unfinished launch state but exits 0.
 * Strict mode (IMAGES_STRICT=1): treats any of the documented production
 * blockers as a hard failure (exit 1).
 *
 * Optional Cloudinary remote check runs only when CLOUDINARY_CLOUD_NAME
 * + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET are present in the env.
 * Without them the script logs a clear notice and skips the remote check.
 */

import 'dotenv/config'
import { recipes } from '../prisma/seed/data/recipes'
import {
  imageManifest,
  type ImageRole,
  type ImageStatus,
  type ManifestEntry,
  type ManifestImage,
} from '../content/image-manifest'

const STRICT = process.env.IMAGES_STRICT === '1'
const VALID_ROLES: ImageRole[] = ['hero', 'gallery', 'step', 'og']
const VALID_STATUSES: ImageStatus[] = ['planned', 'generated', 'uploaded', 'approved']
const ALT_MAX = 125
const PUBLIC_ID_RE =
  /^recipes\/[a-z0-9][a-z0-9-]*[a-z0-9]\/(hero|og|gallery-[1-9][0-9]*|step-[1-9][0-9]*)$/

type Severity = 'error' | 'warn'
type Finding = { severity: Severity; recipeSlug: string; publicId?: string; message: string }

const findings: Finding[] = []

function add(sev: Severity, recipeSlug: string, message: string, publicId?: string) {
  findings.push({ severity: sev, recipeSlug, publicId, message })
}

// ── Cross-checks: manifest ↔ seeded recipes ─────────────────────────
const seededSlugs = new Set(recipes.map((r) => r.translations.EN.slug))
const manifestBySlug = new Map<string, ManifestEntry>()

for (const entry of imageManifest) {
  if (manifestBySlug.has(entry.slug)) {
    add('error', entry.slug, `duplicate manifest entry for slug '${entry.slug}'`)
  }
  manifestBySlug.set(entry.slug, entry)
  if (!seededSlugs.has(entry.slug)) {
    add('error', entry.slug, `manifest references unknown recipe slug '${entry.slug}'`)
  }
}

for (const slug of seededSlugs) {
  if (!manifestBySlug.has(slug)) {
    add('error', slug, `seeded recipe '${slug}' has no manifest entry`)
  }
}

// Track every publicId across the entire manifest for global uniqueness.
const seenPublicIds = new Map<string, string>()

// ── Per-recipe + per-image validations ──────────────────────────────
for (const entry of imageManifest) {
  let heroCount = 0
  let ogCount = 0
  const galleryNumbers: number[] = []

  for (const img of entry.images) {
    validatePublicId(entry.slug, img)
    validateRole(entry.slug, img)
    validateStatus(entry.slug, img)
    validateAlt(entry.slug, img)
    validateTitle(entry.slug, img)

    if (seenPublicIds.has(img.publicId)) {
      add(
        'error',
        entry.slug,
        `duplicate publicId '${img.publicId}' (also used by '${seenPublicIds.get(img.publicId)}')`,
        img.publicId,
      )
    } else {
      seenPublicIds.set(img.publicId, entry.slug)
    }

    if (img.role === 'hero') heroCount++
    if (img.role === 'og') ogCount++
    if (img.role === 'gallery') {
      const m = img.publicId.match(/gallery-(\d+)$/)
      if (m) galleryNumbers.push(Number(m[1]))
    }
  }

  if (heroCount === 0) {
    add('error', entry.slug, `recipe has no required hero image`)
  } else if (heroCount > 1) {
    add('error', entry.slug, `recipe has ${heroCount} hero images, exactly 1 allowed`)
  }
  if (ogCount > 1) {
    add('error', entry.slug, `recipe has ${ogCount} og images, ≤ 1 allowed`)
  }

  // Sequential gallery numbering: must be 1, 2, 3, ... no gaps, no dupes
  if (galleryNumbers.length > 0) {
    galleryNumbers.sort((a, b) => a - b)
    for (let i = 0; i < galleryNumbers.length; i++) {
      if (galleryNumbers[i] !== i + 1) {
        add(
          'error',
          entry.slug,
          `gallery numbering not sequential: expected ${i + 1}, got ${galleryNumbers[i]}`,
        )
        break
      }
    }
  }

  // Required-hero-not-yet-approved is a launch blocker, downgraded to a
  // warn outside strict mode so dev iteration isn't gated.
  const heroes = entry.images.filter((img) => img.role === 'hero')
  for (const hero of heroes) {
    if (!hero.required) {
      add(
        'error',
        entry.slug,
        `hero image must be required=true (got false) for ${hero.publicId}`,
        hero.publicId,
      )
    }
    if (hero.status !== 'approved') {
      add(
        'warn',
        entry.slug,
        `required hero status is '${hero.status}' (not 'approved') — production blocker`,
        hero.publicId,
      )
    }
  }
}

// ── Seed integration: detect placeholder heroes still in seed ───────
for (const recipe of recipes) {
  const enSlug = recipe.translations.EN.slug
  const heroPath = recipe.heroImageCloudinary
  if (heroPath.startsWith('tcd/seed/')) {
    add(
      'warn',
      enSlug,
      `seed Recipe.heroImageCloudinary still uses placeholder '${heroPath}' — replace with 'recipes/${enSlug}/hero' before promoting to production`,
    )
  }
  // Also check the manifest hero publicId matches what's in the seed (if seed
  // is on the production prefix already)
  if (heroPath.startsWith('recipes/')) {
    const manifestEntry = manifestBySlug.get(enSlug)
    const manifestHero = manifestEntry?.images.find((i) => i.role === 'hero')
    if (manifestHero && manifestHero.publicId !== heroPath) {
      add(
        'error',
        enSlug,
        `seed heroImageCloudinary='${heroPath}' does not match manifest hero '${manifestHero.publicId}'`,
      )
    }
  }
}

// ── Optional Cloudinary remote check ────────────────────────────────
async function cloudinaryRemoteCheck() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloud || !apiKey || !apiSecret) {
    console.log(
      '⚠  Cloudinary env not configured (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET) — skipping remote existence check.',
    )
    return
  }

  console.log(`✓ Cloudinary remote check: cloud='${cloud}'`)
  const auth = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  for (const entry of imageManifest) {
    for (const img of entry.images) {
      // Only check assets the manifest claims are uploaded — 'planned' /
      // 'generated' assets aren't expected on Cloudinary yet.
      if (img.status === 'planned' || img.status === 'generated') continue

      const url = `https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload/${encodeURIComponent(img.publicId)}`
      try {
        const r = await fetch(url, { headers: { Authorization: auth } })
        if (r.status === 404) {
          add(
            'error',
            entry.slug,
            `Cloudinary asset missing: '${img.publicId}' (manifest status='${img.status}', expected to exist)`,
            img.publicId,
          )
        } else if (!r.ok) {
          add(
            'warn',
            entry.slug,
            `Cloudinary check returned ${r.status} for '${img.publicId}'`,
            img.publicId,
          )
        }
      } catch (err) {
        add(
          'warn',
          entry.slug,
          `Cloudinary check failed for '${img.publicId}': ${err instanceof Error ? err.message : 'unknown'}`,
          img.publicId,
        )
      }
    }
  }
}

// ── Helpers ─────────────────────────────────────────────────────────
function validatePublicId(recipeSlug: string, img: ManifestImage) {
  if (img.publicId.startsWith('tcd/seed/')) {
    add(
      'error',
      recipeSlug,
      `publicId '${img.publicId}' uses placeholder 'tcd/seed/' prefix — production manifest must use 'recipes/<slug>/<role>'`,
      img.publicId,
    )
    return
  }
  if (!PUBLIC_ID_RE.test(img.publicId)) {
    add(
      'error',
      recipeSlug,
      `publicId '${img.publicId}' does not match recipes/<en-slug>/<hero|og|gallery-N|step-N>`,
      img.publicId,
    )
    return
  }
  // Slug in the publicId must match the manifest entry
  const expectedPrefix = `recipes/${recipeSlug}/`
  if (!img.publicId.startsWith(expectedPrefix)) {
    add(
      'error',
      recipeSlug,
      `publicId '${img.publicId}' should start with '${expectedPrefix}'`,
      img.publicId,
    )
  }
  // Role suffix must match the declared role
  const suffix = img.publicId.slice(expectedPrefix.length)
  const declared = img.role
  const ok =
    (declared === 'hero' && suffix === 'hero') ||
    (declared === 'og' && suffix === 'og') ||
    (declared === 'gallery' && /^gallery-\d+$/.test(suffix)) ||
    (declared === 'step' && /^step-\d+$/.test(suffix))
  if (!ok) {
    add(
      'error',
      recipeSlug,
      `publicId suffix '${suffix}' inconsistent with declared role='${declared}'`,
      img.publicId,
    )
  }
}

function validateRole(recipeSlug: string, img: ManifestImage) {
  if (!VALID_ROLES.includes(img.role)) {
    add('error', recipeSlug, `invalid role '${img.role}' for ${img.publicId}`, img.publicId)
  }
}

function validateStatus(recipeSlug: string, img: ManifestImage) {
  if (!VALID_STATUSES.includes(img.status)) {
    add('error', recipeSlug, `invalid status '${img.status}' for ${img.publicId}`, img.publicId)
  }
}

function validateAlt(recipeSlug: string, img: ManifestImage) {
  for (const locale of ['en', 'tr', 'es'] as const) {
    const v = img.alt?.[locale]
    if (!v || v.trim().length === 0) {
      add(
        'error',
        recipeSlug,
        `alt.${locale} missing or empty for ${img.publicId}`,
        img.publicId,
      )
      continue
    }
    if (v.length > ALT_MAX) {
      add(
        'error',
        recipeSlug,
        `alt.${locale} length ${v.length} > ${ALT_MAX} for ${img.publicId}`,
        img.publicId,
      )
    }
  }
}

function validateTitle(recipeSlug: string, img: ManifestImage) {
  if (!img.title) return
  for (const locale of ['en', 'tr', 'es'] as const) {
    const v = img.title[locale]
    if (typeof v !== 'string' || v.trim().length === 0) {
      add(
        'error',
        recipeSlug,
        `title.${locale} present but empty for ${img.publicId}`,
        img.publicId,
      )
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(`▸ image manifest: ${imageManifest.length} recipes, seeded recipes: ${recipes.length}`)
  console.log(
    `▸ mode: ${STRICT ? 'STRICT (errors AND warns fail)' : 'default (warns are advisory)'}`,
  )

  await cloudinaryRemoteCheck()

  const errors = findings.filter((f) => f.severity === 'error')
  const warns = findings.filter((f) => f.severity === 'warn')

  if (warns.length > 0) {
    console.log(`\n⚠  ${warns.length} warning(s):`)
    for (const f of warns) {
      console.log(`   [${f.recipeSlug}] ${f.message}`)
    }
  }
  if (errors.length > 0) {
    console.log(`\n✖  ${errors.length} error(s):`)
    for (const f of errors) {
      console.log(`   [${f.recipeSlug}] ${f.message}`)
    }
  }

  const failureCount = STRICT ? errors.length + warns.length : errors.length

  if (failureCount === 0) {
    console.log(`\n✓ image manifest validation passed`)
    process.exit(0)
  }

  console.log(
    `\n${STRICT ? '✖ STRICT MODE' : '✖'}: ${errors.length} error(s)${
      STRICT ? `, ${warns.length} warning(s) (fatal in strict)` : ''
    }`,
  )
  process.exit(1)
}

main().catch((err) => {
  console.error('validator crashed:', err)
  process.exit(2)
})
