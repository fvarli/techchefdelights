# Image Workflow

Single source of truth for how recipe images are produced, stored, named, and served. Audience: anyone adding new recipes or operating the site.

> **Generating images for v1?** This document is the **specification**. The **operational batch** with copy-paste-ready prompts for every seeded recipe — grouped per recipe, with target Cloudinary `public_id`, alt text in EN/TR/ES, aspect-ratio target, local filename, and a per-block review checklist — lives in **[`IMAGE_GENERATION_BATCH.md`](./IMAGE_GENERATION_BATCH.md)**. Use that as the working queue; come back here for the rules.

## Roles & minimum requirements

| Role | Required | Quantity per recipe | Stored on |
|---|---|---|---|
| **Hero** | **yes — production** | exactly 1 | `Recipe.heroImageCloudinary` (required string column) + `Recipe.heroBlurhash` (optional) |
| **Gallery** | optional | 0–N | `RecipeImage` rows |
| **Step** | optional | 0–N per step | `StepImage` rows |
| **OG (Open Graph social card)** | optional | 0–1 | derived from hero by default; explicit override only if needed |

**Production minimum to ship a recipe**: one hero image with valid alt text in **all three locales**. Gallery and step images may be empty.

The hero is the single most important asset. It drives:
- the recipe card on home / search / category / diet pages,
- the recipe detail page hero block,
- OG / Twitter Card / WhatsApp link previews when no override is set,
- the print page header thumbnail (when implemented).

## Production: Cloudinary `public_id` convention

Production assets live in Cloudinary at descriptive, locale-agnostic paths. The convention:

```
recipes/<recipe-slug>/hero
recipes/<recipe-slug>/gallery-1
recipes/<recipe-slug>/gallery-2
recipes/<recipe-slug>/step-1
recipes/<recipe-slug>/step-2
```

Where `<recipe-slug>` is the **EN slug** (e.g. `red-lentil-soup`, not `mercimek-corbasi`). The slug is locale-agnostic on the asset side; only the `alt` text is localized.

Use the **EN slug deliberately** even though the public URL is localized. This keeps a single source of truth on the CDN side, makes it trivial to find an asset by recipe, and avoids breaking asset references when a TR/ES slug is renamed.

### Reserved prefixes
- `recipes/<slug>/hero` — exactly one
- `recipes/<slug>/gallery-N` — N ∈ {1, 2, 3, …}
- `recipes/<slug>/step-N` — N matches `Step.index` (1-based for asset naming)

### Placeholder / seed prefix
Seed data uses `tcd/seed/<slug>/hero` and `tcd/seed/<slug>/gallery-N` so test environments don't collide with real production assets. **Replace these with the production convention before flipping the recipe `isDraft = false` for production.**

### Don't do this
- Don't include locale, language, or translated names in the public_id.
- Don't include date stamps, version numbers, or photographer initials in the public_id (use Cloudinary tags / metadata for that).
- Don't reuse a public_id across recipes — each path is a permanent identifier.

## SEO — alt, title, caption

Where the fields live:

| Field | Schema location | Per-locale | Notes |
|---|---|---|---|
| `alt` | `RecipeImageTranslation.alt`, `StepImageTranslation.alt` | yes | **required**, ≤ 125 characters |
| `title` / `caption` | not yet on schema | (future) | track as v1.1 — see "Future media schema" below |

### Alt-text guidance

The image's job in alt text is to **describe what's in the photo for someone who can't see it**, not to repeat the recipe title or stuff keywords.

Good — describes the photographic content, mentions a key ingredient or two, locale-appropriate:
- EN hero: `Bowl of red lentil soup with lemon wedge and dried mint`
- TR hero: `Limon ve kuru naneli bir kâse mercimek çorbası`
- ES hero: `Cuenco de sopa de lentejas rojas con limón y menta seca`

Bad — keyword spam, repeats the title, or generic:
- `Red lentil soup recipe quick easy turkish recipe vegan` — keyword spam
- `Recipe image` — useless to a screen reader user
- `Mercimek` — too sparse

**Rules of thumb:**
- ≤ 125 characters; one sentence, no period required.
- Describe what the image shows, not what the recipe is.
- Locale-appropriate: TR alt is in Turkish, ES alt is in Spanish; never translate placeholders mechanically.
- Don't start with "Image of" / "Photo of" — screen readers already announce it as an image.
- Don't include "recipe" / "tarif" / "receta" in alt text — those words add no information to a sighted alt-fallback either.

### Title / caption (v1.1 path)

`title` and `caption` aren't on the schema yet. When the time comes to add them:
- Add `title` and `caption` fields to `RecipeImageTranslation` and `StepImageTranslation` (both nullable strings).
- `title` shows on hover (HTML `title` attribute) and in some social previews — keep it short (≤ 60 chars) and editorial, not a duplicate of alt.
- `caption` is the on-page caption under a gallery / step photo — full sentence allowed, may include credits.
- Update `ApiImage` type to expose them.

Track as a v1.1 ticket; **do not block production launch on this**.

## AI image generation — brand consistency rules

We use AI-generated photography to keep a tight, consistent visual brand. The same look-and-feel across every recipe is a brand asset; it's also harder than picking "best of stock" for each one.

### Style guide (use as the system prompt scaffold)

```
Natural food photography, soft daylight, slight overhead angle (~35°),
shallow depth of field. Hand-thrown ceramic plate or wooden surface.
Muted earthy palette: warm whites, terra-cotta, sage green, deep rust.
Realistic ingredients in their natural state. No utensils unless
the dish requires them. No text, no logos, no watermarks. Centered
composition with breathing room. Final plated dish only — no
ingredient flat-lays for hero shots.
```

### Per-image prompt template

For the hero (the only required image):

```
<style guide above>

Subject: <one-line description of the plated dish, e.g.
"a steaming bowl of red lentil soup garnished with lemon and dried mint">

Plating: <bowl/plate description, e.g. "rustic ceramic bowl on a
linen-lined wooden table">

Mood: warm, inviting, home-kitchen finish.
```

For gallery / step images, the same scaffold but:
- gallery: alternate angles or detail shots of the same dish
- step: in-progress kitchen shot showing the action of that step (chopping, deglazing, plating)

### Negative prompt (always include)

```
no text, no captions, no watermarks, no logos, no brand marks,
no impossible food shapes, no stock-photo plastic gloss, no overhead
flat-lay (for hero), no garnish that doesn't appear in the recipe,
no extra hands, no plastic packaging.
```

### Quality gate — reject and regenerate when

- Text or logo is visible anywhere
- A garnish in the photo isn't actually in the recipe
- Lighting is harsh, blue-tinted, or studio-glossy
- The dish has more than 7 visible ingredients (busy / unrealistic)
- Plate / bowl is white plastic, hospital-style, or has a printed pattern
- Hand or utensil enters the frame on a hero shot

### Per-recipe metadata template

Keep one of these per recipe in your media tracking spreadsheet (or a future admin tool — see below). It is the **only place** the AI prompt and source-of-truth alt text live; the DB stores only the `cloudinaryId` and the per-locale alt.

```yaml
recipe: red-lentil-soup
images:
  - role: hero
    cloudinary_public_id: recipes/red-lentil-soup/hero
    alt:
      en: Bowl of red lentil soup with lemon wedge and dried mint
      tr: Limon ve kuru naneli bir kâse mercimek çorbası
      es: Cuenco de sopa de lentejas rojas con limón y menta seca
    title:
      en: Red lentil soup, lemon, mint
      tr: Mercimek çorbası, limon, nane
      es: Sopa de lentejas rojas, limón, menta
    generation_prompt: |
      <style guide block> Subject: a steaming bowl of red lentil
      soup garnished with lemon and dried mint. Plating: rustic
      ceramic bowl on a linen-lined wooden table. Mood: warm.
    negative_prompt: |
      no text, no logos, no watermarks, no flat-lay, no extra hands.
    width: 2400
    height: 1600
    upload_status: uploaded
    uploaded_at: 2026-04-27
  - role: gallery
    cloudinary_public_id: recipes/red-lentil-soup/gallery-1
    alt:
      en: Close-up of red lentils being added to simmering broth
      tr: Kaynayan suya eklenmekte olan kırmızı mercimekler
      es: Lentejas rojas añadidas al caldo hirviendo
    upload_status: pending
```

## Provider abstraction — staying portable

We store **only the Cloudinary `public_id`** in the database (`Recipe.heroImageCloudinary`, `RecipeImage.cloudinaryId`, `StepImage.cloudinaryId`). The DB never stores a Cloudinary URL or transformation string.

This means:
- A future move to imgix, Bunny.net, R2 + Cloudflare Images, or self-hosted S3 + Imgproxy is a **helper change**, not a DB migration. Replace one URL builder; the schema is untouched.
- Today the URL builder is implicit (`next/image` reads the path). The dedicated builder helper (`src/lib/image.ts`) is **deferred** until the first non-Cloudinary use case arrives — adding it now would solve a problem we don't have.
- When the helper is added, the API contract (`ApiImage`) keeps `cloudinaryId` for backwards compatibility but the field becomes "provider-neutral public_id" semantically. Renaming the column at that point is a one-shot migration.

### What's provider-neutral today

| Concern | Status |
|---|---|
| public_id in DB | ✅ Cloudinary-shaped path that works as a key for any provider |
| URL building | 🟡 implicit via `next/image` defaults — works for Cloudinary out of the box; replace at provider switch |
| Image dimensions in DB | ✅ `w`, `h` columns are provider-agnostic |
| Blurhash placeholder | ✅ `blurhash` column is a generic format |
| Alt text | ✅ `*Translation.alt` is per-locale, provider-agnostic |

### What would change at provider switch

- Image URL helper (~30 LOC)
- `next.config.ts` `images.remotePatterns` allowlist
- CSP `img-src` directive in `next.config.ts`
- Cloudinary env vars → new provider's env vars
- One pass to re-upload all assets at the same paths (or a redirect map)

## Image SEO — beyond alt text

| Concern | Where | Notes |
|---|---|---|
| `<picture>`/`<img>` `loading="lazy"` | `next/image` | applied automatically below the fold |
| `<img>` `decoding="async"` | `next/image` | applied automatically |
| Width/height attributes (CLS prevention) | `next/image` | uses the `w`/`h` columns from the schema |
| Modern formats (AVIF/WebP) | Cloudinary | will be served automatically once `f_auto,q_auto` is added to the URL builder |
| Per-image schema.org JSON-LD | `src/lib/jsonld.ts` Recipe builder | already emits `image` from the hero in the Recipe JSON-LD |
| OpenGraph / Twitter Card | `src/app/[locale]/(shell)/recipes/[slug]/page.tsx` `generateMetadata` openGraph | uses the recipe URL today; should reference the hero image once the URL builder lands |

## Future: media schema additions (post-launch)

Track these as v1.1 / v1.2 enhancements; **do not block launch**:

1. `RecipeImageTranslation.title` and `RecipeImageTranslation.caption` (see SEO section above)
2. `RecipeImage.role` enum (`hero` / `gallery` / `og`) — promotes "hero is on Recipe row" + "gallery is on RecipeImage" into a single table; cleaner queries, mild migration cost
3. `RecipeImage.colorPalette` JSON column — extracted dominant colors for theming card backgrounds without a layout shift
4. `RecipeImage.aiGenerated` boolean + `RecipeImage.modelVersion` for AI-content disclosure compliance (some jurisdictions are heading there)
5. Dedicated `MediaAsset` model that decouples assets from recipes entirely — needed when the same asset is reused across multiple recipes (e.g. an ingredient flat-lay shot that appears on the egg ingredient page AND in three recipes that prominently use eggs)

## Future: admin / upload workflow (no v1 implementation)

Today's upload path is **manual**: paste the Cloudinary `public_id` into the recipe seed file and run `pnpm prisma db seed`. That's correct for v1 — content velocity is low and the seed file is the source of truth.

Post-launch, when content velocity grows:

- A small admin route at `/admin/recipes/<slug>/images` (auth-gated) with a drag-drop upload that:
  1. Posts to Cloudinary with a signed upload preset
  2. Validates the returned `public_id` matches `recipes/<slug>/<role>(-N)?` shape
  3. Reads back `width`, `height`, generates a blurhash server-side
  4. Upserts the row into `RecipeImage` / `StepImage` and the per-locale alt translation
- All metadata in the YAML template above is captured in the form; the alt-text editor enforces the SEO rules (≤ 125 chars, no "image of", etc.) with inline warnings.
- AI prompt + negative prompt are stored on the row (new columns) so a regeneration pass keeps brand consistency without re-deriving from scratch.

This is a deliberate v1.x scope item, not v1. The placeholder implementation in this doc and the Cloudinary `public_id` convention are designed to make that admin tool a thin layer on top of an already-correct data model.

## Production pipeline

End-to-end flow for shipping a recipe's images:

```
1. AI generation
   – follow the style guide + per-image prompt template
   – output: image file(s) on disk
2. Manual review
   – run the quality gate (no text/logos, garnish matches recipe, lighting OK)
   – iterate with regeneration if needed
3. Cloudinary upload
   – upload at the canonical path  recipes/<en-slug>/<role>(-N)?
   – capture width/height
4. Manifest update
   – edit content/image-manifest.ts
   – flip status: planned → generated → uploaded → approved
   – fill alt EN/TR/ES (≤ 125 chars)
5. Validation
   – pnpm images:validate                     ← advisory, exit 0 with warns
   – IMAGES_STRICT=1 pnpm images:validate     ← prod gate, exit 1 on any blocker
6. Seed update
   – replace tcd/seed/<slug>/hero with recipes/<slug>/hero in
     prisma/seed/data/recipes/<slug>.ts
   – pnpm prisma db seed
   – /recipes/<slug> renders the new hero
```

## Image manifest

The single source of truth for what we **plan** to ship is **`content/image-manifest.ts`** (not the DB). One entry per published recipe; `images[]` lists every planned asset. The validator script (`scripts/validate-images.ts`) reads it and gates production promotion.

Status values:
- `planned` — entry exists, AI prompt drafted, no asset yet
- `generated` — image generated, awaiting review
- `uploaded` — uploaded to Cloudinary at the canonical `public_id`
- `approved` — review passed, seed file updated, ready for production

The manifest is **read-only** for the validator. The validator never uploads, deletes, renames, or mutates Cloudinary assets.

## Validation script

`pnpm images:validate` runs all of:

| Check | Severity (default) | Severity (strict) |
|---|---|---|
| every seeded recipe has a manifest entry | error | error |
| every manifest recipe maps to a seeded slug | error | error |
| each recipe has exactly 1 hero, ≤ 1 og | error | error |
| publicId matches `recipes/<en-slug>/<role>(-N)?` | error | error |
| publicId NOT prefixed `tcd/seed/` | error | error |
| alt EN/TR/ES present, ≤ 125 chars | error | error |
| no duplicate publicIds across the manifest | error | error |
| gallery numbering sequential (1, 2, 3, …) | error | error |
| `aspectRatio` (when set) is in the role's allowlist | error | error |
| `aspectRatio` set on `uploaded` / `approved` images | warn | error |
| `width` and `height` set together (never one without the other) | error | error |
| `width`/`height` present on `uploaded` / `approved` images | warn | error |
| seed `Recipe.heroImageCloudinary` not `tcd/seed/...` | warn | error |
| required hero status === `approved` | warn | error |
| Cloudinary asset exists for `uploaded` / `approved` (when env set) | error | error |

**Default mode**: warns are advisory; exit 0 unless a hard error is found.
**Strict mode** (`IMAGES_STRICT=1`): warns become fatal; exit 1 on any failure.

The Cloudinary remote check runs only when `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` are set. Without those env vars the script logs a clear "skipping remote check" notice and continues with local-only validation. The check uses the Cloudinary Admin API (`GET /resources/image/upload/<public_id>`) — read-only. Public IDs are encoded **per path segment** so the folder slashes in `recipes/<slug>/hero` are preserved verbatim (encoding the whole id with `encodeURIComponent` would percent-encode `/` and produce false-negative 404s).

## Aspect ratio rules

Each image role has an allowed-set of aspect ratios. The manifest's `aspectRatio` field accepts one of: `'16:9'`, `'4:3'`, `'1:1'`, `'1200x630'`. The validator enforces:

| Role | Allowed | Why |
|---|---|---|
| `hero` | `16:9`, `4:3` | wide for desktop hero block + recipe cards; both crop cleanly |
| `gallery` | `4:3`, `1:1` | recipe-card grids and tighter detail crops |
| `step` | `4:3` | matches in-cook step cards consistently |
| `og` | `1200x630` | OpenGraph spec — exact pixel dimensions, not a ratio |

A non-OG image with `aspectRatio: '1200x630'` is rejected (the OG spec is precise; mixing it with content shots breaks card crops). An OG image with `aspectRatio: '16:9'` is rejected for the same reason — Open Graph crawlers expect 1200×630 exactly.

`width` and `height` columns hold the **actual pixel dimensions** of the rendered asset (CLS-critical) and must be set together. The validator allows them to be unset for `planned` / `generated` images but warns (default) / errors (strict) when they're missing on `uploaded` / `approved` images.

## Verification checklist (before promoting a new recipe to production)

- [ ] One `recipes/<slug>/hero` asset uploaded to Cloudinary
- [ ] `Recipe.heroImageCloudinary` set to that `public_id` (NOT the full URL, NOT a `tcd/seed/...` placeholder)
- [ ] `Recipe.heroBlurhash` populated (run a blurhash generator on the source image; or leave null if you accept the no-placeholder fallback)
- [ ] Per-locale alt text set on every hero / gallery / step image: EN ≤ 125 chars, TR ≤ 125 chars, ES ≤ 125 chars; no keyword spam
- [ ] `width` / `height` columns set to the actual image dimensions (CLS-critical)
- [ ] No text, logo, or watermark visible in any image
- [ ] Hero loads on the recipe detail page in all three locales
- [ ] OG preview check (paste the recipe URL into <https://www.opengraph.xyz/> or a real Slack/iMessage paste): hero shows, alt populated
