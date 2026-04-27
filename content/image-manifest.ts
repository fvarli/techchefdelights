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
export type AspectRatio = '16:9' | '4:3' | '1:1' | '1200x630'

export type ManifestImage = {
  role: ImageRole
  publicId: string
  required: boolean
  alt: { en: string; tr: string; es: string }
  title?: { en: string; tr: string; es: string }
  prompt: string
  negativePrompt: string
  status: ImageStatus
  width?: number
  height?: number
  aspectRatio?: AspectRatio
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
      {
        role: 'gallery',
        publicId: 'recipes/red-lentil-soup/gallery-1',
        required: false,
        alt: {
          en: 'Wider table view: bowl of soup, lemon halves, mint sprig, spoon resting on linen',
          tr: 'Geniş masa görüntüsü: çorba kâsesi, limon yarımları, nane dalı, kaşık keten üzerinde',
          es: 'Vista amplia de la mesa: cuenco de sopa, mitades de limón, ramita de menta, cuchara sobre lino',
        },
        prompt: `${STYLE} Subject: wider table-top scene: the same bowl of red lentil soup with two lemon halves, a small ramekin of dried mint and a fresh mint sprig, an old silver spoon resting on a linen napkin. Composition: 4:3 with breathing room around the bowl.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/red-lentil-soup/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of soup texture with mint flecks and a glistening drizzle of olive oil',
          tr: 'Çorba dokusunun yakın çekimi: nane kırıkları ve parlayan zeytinyağı damlaları',
          es: 'Primer plano de la textura de la sopa con motas de menta y un hilo brillante de aceite de oliva',
        },
        prompt: `${STYLE} Subject: tight square close-up of the soup's velvety surface, showing flecks of dried mint and a thin drizzle of olive oil catching the light. Composition: 1:1, fills the frame.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/miso-butter-spaghetti/gallery-1',
        required: false,
        alt: {
          en: 'Skillet view: spaghetti being tossed with a wooden spatula, butter pooling at the edges',
          tr: 'Tava görüntüsü: spagetti tahta spatula ile karıştırılırken kenarlarda eriyen tereyağı',
          es: 'Vista en sartén: espaguetis revueltos con espátula de madera y mantequilla derretida en los bordes',
        },
        prompt: `${STYLE} Subject: a skillet on the stovetop with the spaghetti mid-toss, a wooden spatula lifting strands, golden miso butter pooling at the edges. Composition: 4:3, slightly higher angle to show the pan contents.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/miso-butter-spaghetti/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of glossy noodles wrapped around a fork with chives clinging to the strands',
          tr: 'Çatala sarılmış parlak makarnanın yakın çekimi, ipliklere yapışmış frenk soğanı parçaları',
          es: 'Primer plano de fideos brillantes enrollados en un tenedor con cebollino adherido',
        },
        prompt: `${STYLE} Subject: square close-up of glossy spaghetti strands wrapped around a fork mid-twirl, chives clinging visibly. Composition: 1:1, focus on the texture.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/avocado-toast/gallery-1',
        required: false,
        alt: {
          en: 'Yolk break: a knife cutting into the poached egg, golden yolk running across the avocado',
          tr: 'Yumurta sarısı akıyor: bıçak poşe yumurtayı keserken sarının avokadoya yayılışı',
          es: 'Yema rota: un cuchillo cortando el huevo escalfado, yema dorada corriendo sobre el aguacate',
        },
        prompt: `${STYLE} Subject: action shot of a small kitchen knife cutting into the poached egg on the toast, the runny golden yolk just starting to spread over the smashed avocado. Composition: 4:3, slightly closer in than the hero.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/avocado-toast/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of avocado texture with chili flakes and flaky salt scattered on top',
          tr: 'Avokado dokusunun yakın çekimi: üzerine serpilmiş kırmızı pul biber ve iri taneli tuz',
          es: 'Primer plano de la textura del aguacate con copos de chile y sal en escamas espolvoreados encima',
        },
        prompt: `${STYLE} Subject: square close-up of the smashed avocado surface showing fork-mark texture, scattered chili flakes and flaky salt crystals catching the light. Composition: 1:1.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/mediterranean-quinoa-salad/gallery-1',
        required: false,
        alt: {
          en: 'Hand drizzling olive oil over the salad bowl from a small ceramic jug',
          tr: 'Küçük seramik bir sürahiden salata kâsesinin üzerine zeytinyağı dökülüyor',
          es: 'Mano vertiendo aceite de oliva sobre el cuenco de ensalada desde una pequeña jarra de cerámica',
        },
        prompt: `${STYLE} Subject: a hand pouring a thin stream of olive oil from a small ceramic jug over the salad bowl, droplets caught mid-fall. Composition: 4:3.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/mediterranean-quinoa-salad/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of cherry tomato halves, cucumber dice and feta crumbles in fluffy quinoa',
          tr: 'Yakın çekim: kabarık kinoa içinde kiraz domates yarımları, salatalık küpleri ve beyaz peynir kırıkları',
          es: 'Primer plano de mitades de tomate cherry, dados de pepino y feta desmenuzado entre quinoa esponjosa',
        },
        prompt: `${STYLE} Subject: square close-up of the salad showing the texture of cooked quinoa with cherry tomato halves, cucumber dice and feta crumbles. Composition: 1:1.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/classic-baklava/gallery-1',
        required: false,
        alt: {
          en: 'Two baklava squares plated with a small espresso cup and a fork',
          tr: 'İki dilim baklava, küçük bir espresso fincanı ve çatal ile servis edildi',
          es: 'Dos cuadrados de baklava emplatados con una pequeña taza de espresso y un tenedor',
        },
        prompt: `${STYLE} Subject: two baklava squares lifted onto a small ceramic plate next to a tiny espresso cup and a brass fork, telling the after-dinner story. Composition: 4:3.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/classic-baklava/gallery-2',
        required: false,
        alt: {
          en: 'Macro of layered phyllo edges visible at the cut, syrup soaking into the layers',
          tr: 'Kesilmiş kenarda görünen yufka katlarının makro görüntüsü, şerbet katlara işliyor',
          es: 'Macro de los bordes de las capas de pasta filo visibles en el corte, con almíbar empapando las capas',
        },
        prompt: `${STYLE} Subject: square macro shot of a baklava cross-section showing the many thin phyllo layers, syrup glistening between them, a few pistachio fragments on top. Composition: 1:1, very tight crop.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/lemon-cheesecake/gallery-1',
        required: false,
        alt: {
          en: 'Whole cheesecake on a stand with one slice removed, showing the soft yellow filling',
          tr: 'Standın üzerinde, bir dilimi alınmış bütün cheesecake; içindeki yumuşak sarı dolgu görünüyor',
          es: 'Cheesecake entero en un soporte con una porción retirada, mostrando el relleno amarillo suave',
        },
        prompt: `${STYLE} Subject: a whole pale-yellow lemon cheesecake on a low ceramic stand with one wedge already removed, the cross-section showing the smooth filling above the golden biscuit base. Composition: 4:3.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/lemon-cheesecake/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of the lemon zest curl glistening on the smooth cheesecake surface',
          tr: 'Pürüzsüz cheesecake yüzeyinde parlayan limon kabuğu kıvrımının yakın çekimi',
          es: 'Primer plano de la espiral de cáscara de limón brillando sobre la superficie suave del cheesecake',
        },
        prompt: `${STYLE} Subject: square close-up of the smooth pale-yellow surface of the cheesecake with a single thin curl of lemon zest catching the light. Composition: 1:1.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/dark-chocolate-souffle/gallery-1',
        required: false,
        alt: {
          en: 'Spoon breaking into the soufflé top, revealing the molten dark chocolate centre',
          tr: 'Kaşık suflenin üstünü kırarken ortaya çıkan akışkan bitter çikolata',
          es: 'Cuchara rompiendo la parte superior del suflé, dejando ver el centro de chocolate negro fundente',
        },
        prompt: `${STYLE} Subject: a small dessert spoon mid-break into the top of the soufflé, exposing the dark molten centre, steam still curling up. Composition: 4:3, slight angle from above.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/dark-chocolate-souffle/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of cocoa-dusted soufflé top with cracked surface and risen edges',
          tr: 'Kakao ile süslenmiş sufle üstünün yakın çekimi: çatlamış yüzey ve yükselmiş kenarlar',
          es: 'Primer plano de la parte superior del suflé espolvoreada con cacao, superficie agrietada y bordes elevados',
        },
        prompt: `${STYLE} Subject: square close-up of the dark, cocoa-dusted top of the soufflé showing the crackled surface and the risen edges above the ramekin rim. Composition: 1:1.`,
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
      {
        role: 'gallery',
        publicId: 'recipes/margherita-pizza/gallery-1',
        required: false,
        alt: {
          en: 'Slice being lifted with melted mozzarella stretching back to the pie',
          tr: 'Bir dilim kaldırılırken erimiş mozzarella iplerinin pizzayla bağlanışı',
          es: 'Porción siendo levantada con mozzarella fundida estirándose hacia la pizza',
        },
        prompt: `${STYLE} Subject: a single slice being lifted away from the pizza, hot mozzarella stretching back to the rest of the pie in long strings. Composition: 4:3, slight angle.`,
        negativePrompt: NEG,
        status: 'planned',
      },
      {
        role: 'gallery',
        publicId: 'recipes/margherita-pizza/gallery-2',
        required: false,
        alt: {
          en: 'Close-up of charred crust edge with bubbles and a basil leaf draped over melted mozzarella',
          tr: 'Yakın çekim: kabarcıklı, ateşte hafif kararmış hamur kenarı ve erimiş mozzarella üzerinde fesleğen',
          es: 'Primer plano del borde de corteza chamuscada con burbujas y una hoja de albahaca sobre mozzarella fundida',
        },
        prompt: `${STYLE} Subject: square close-up of the pizza edge showing the charred bubbled crust and a single fresh basil leaf draped over a pool of melted mozzarella. Composition: 1:1.`,
        negativePrompt: NEG,
        status: 'planned',
      },
    ],
  },
]
