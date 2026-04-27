/**
 * Recipe image manifest — pre-production tracking.
 *
 * One entry per published recipe. Each `images[]` item describes a single
 * planned/generated/uploaded/approved Cloudinary asset. The validator
 * (`scripts/validate-images.ts`) reads this file and asserts:
 *   - every seeded recipe has a manifest entry
 *   - every manifest recipe maps to a real seeded slug
 *   - exactly one hero per recipe, ≤ 1 og per recipe
 *   - publicId follows recipes/<en-slug>/<role>(-N)? convention
 *   - alt EN/TR/ES present, ≤ 125 chars each
 *   - no duplicate publicIds, gallery numbering sequential
 *
 * The DB never sees this file. It's the source of truth for the
 * AI-generation → review → Cloudinary upload → seed-update workflow
 * documented in IMAGE_WORKFLOW.md. The seed file's
 * `Recipe.heroImageCloudinary` is updated **after** the manifest hero
 * status flips to `approved`.
 */

export type ImageRole = 'hero' | 'gallery' | 'step' | 'og'
export type ImageStatus = 'planned' | 'generated' | 'uploaded' | 'approved'

export type ManifestImage = {
  role: ImageRole
  publicId: string
  required: boolean
  alt: { en: string; tr: string; es: string }
  title?: { en: string; tr: string; es: string }
  prompt: string
  negativePrompt: string
  status: ImageStatus
}

export type ManifestEntry = {
  slug: string
  images: ManifestImage[]
}

const STYLE = `Natural food photography, soft daylight, slight overhead angle (~35°),
shallow depth of field. Hand-thrown ceramic plate or wooden surface.
Muted earthy palette: warm whites, terra-cotta, sage green, deep rust.
Realistic ingredients in their natural state. No utensils unless the
dish requires them. No text, no logos, no watermarks. Centered
composition with breathing room.`

const NEG = `no text, no captions, no watermarks, no logos, no brand marks,
no impossible food shapes, no stock-photo plastic gloss, no overhead
flat-lay (for hero), no garnish that doesn't appear in the recipe,
no extra hands, no plastic packaging.`

export const imageManifest: ManifestEntry[] = [
  {
    slug: 'red-lentil-soup',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/red-lentil-soup/hero',
        required: true,
        alt: {
          en: 'Bowl of red lentil soup with lemon wedge and dried mint',
          tr: 'Limon ve kuru naneli bir kâse mercimek çorbası',
          es: 'Cuenco de sopa de lentejas rojas con limón y menta seca',
        },
        prompt: `${STYLE} Subject: a steaming bowl of velvety red lentil soup garnished with a lemon wedge and a sprinkle of dried mint. Plating: rustic ceramic bowl on a linen-lined wooden table.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'miso-butter-spaghetti',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/miso-butter-spaghetti/hero',
        required: true,
        alt: {
          en: 'Plate of glossy spaghetti tossed in miso butter with chives',
          tr: 'Frenk soğanı ile miso tereyağında karıştırılmış parlak spagetti tabağı',
          es: 'Plato de espaguetis brillantes con mantequilla de miso y cebollino',
        },
        prompt: `${STYLE} Subject: a twirled mound of glossy spaghetti coated in golden miso butter, finished with thinly sliced chives. Plating: shallow ceramic plate, fork half-tucked into the noodles.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'avocado-toast',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/avocado-toast/hero',
        required: true,
        alt: {
          en: 'Slice of sourdough toast with smashed avocado and a poached egg',
          tr: 'Ezilmiş avokado ve poşe yumurta ile ekşi maya tost dilimi',
          es: 'Rebanada de pan de masa madre con aguacate machacado y huevo escalfado',
        },
        prompt: `${STYLE} Subject: a thick slice of sourdough toast topped with smashed avocado, a poached egg with a runny yolk just breaking, chili flakes and flaky salt. Plating: small ceramic plate on a wooden board.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'mediterranean-quinoa-salad',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/mediterranean-quinoa-salad/hero',
        required: true,
        alt: {
          en: 'Bowl of quinoa salad with cherry tomatoes, cucumber, feta and herbs',
          tr: 'Kiraz domates, salatalık, beyaz peynir ve otlarla kinoa salatası',
          es: 'Cuenco de ensalada de quinoa con tomates cherry, pepino, queso feta y hierbas',
        },
        prompt: `${STYLE} Subject: a bright bowl of fluffy quinoa tossed with halved cherry tomatoes, diced cucumber, crumbled feta, parsley and mint, glistening with olive oil. Plating: wide shallow ceramic bowl.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'classic-baklava',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/classic-baklava/hero',
        required: true,
        alt: {
          en: 'Tray of golden baklava squares topped with crushed pistachios',
          tr: 'Üzeri kıyılmış antep fıstığı serpilmiş altın rengi baklava tepsisi',
          es: 'Bandeja de baklava dorado cortado en cuadrados, con pistachos picados encima',
        },
        prompt: `${STYLE} Subject: a tray of freshly cut golden baklava squares glistening with syrup, generously topped with crushed pistachios. Plating: matte tray on a linen-lined wooden surface.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'lemon-cheesecake',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/lemon-cheesecake/hero',
        required: true,
        alt: {
          en: 'Slice of lemon cheesecake with a lemon zest curl on top',
          tr: 'Üzeri limon kabuğu kıvrımlı bir dilim limonlu cheesecake',
          es: 'Porción de cheesecake de limón con una espiral de cáscara de limón encima',
        },
        prompt: `${STYLE} Subject: a clean slice of pale yellow lemon cheesecake on a small ceramic plate, a thin curl of lemon zest as garnish, golden biscuit base just visible. Plating: small ceramic plate on a wooden surface, fork resting beside it.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'dark-chocolate-souffle',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/dark-chocolate-souffle/hero',
        required: true,
        alt: {
          en: 'Individual dark chocolate soufflé in a ramekin, dusted with cocoa',
          tr: 'Kakao ile süslenmiş, ramekinde tek kişilik bitter çikolata sufle',
          es: 'Suflé individual de chocolate negro en ramekin, espolvoreado con cacao',
        },
        prompt: `${STYLE} Subject: a freshly baked dark chocolate soufflé just out of the oven, risen above the rim of a small white ceramic ramekin, dusted with cocoa powder. Plating: ramekin on a small saucer with a spoon.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
  {
    slug: 'margherita-pizza',
    images: [
      {
        role: 'hero',
        publicId: 'recipes/margherita-pizza/hero',
        required: true,
        alt: {
          en: 'Margherita pizza with bubbled crust, fresh mozzarella, tomato and basil',
          tr: 'Kabarmış hamuru, taze mozzarella, domates ve fesleğenli margherita pizza',
          es: 'Pizza margarita con corteza burbujeante, mozzarella fresca, tomate y albahaca',
        },
        prompt: `${STYLE} Subject: a freshly baked margherita pizza with a charred bubbled crust, pools of melted fresh mozzarella, bright red tomato, and whole basil leaves. Plating: pizza on a wooden peel.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
]
