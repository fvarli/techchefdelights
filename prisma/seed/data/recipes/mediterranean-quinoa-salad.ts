import type { RecipeSeed } from '../../types'

export const mediterraneanQuinoaSalad: RecipeSeed = {
  seedId: 'recipe_mediterranean-quinoa-salad_seed',
  cuisineSlug: 'mediterranean',
  authorSlug: 'ferzender',
  skill: 'BEGINNER',
  servings: 4,
  prepMinutes: 10,
  cookMinutes: 15,
  totalMinutes: 25,
  heroImageCloudinary: 'tcd/seed/mediterranean-quinoa-salad/hero',
  heroBlurhash: null,
  costPerServingCents: 3000,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'mediterranean-quinoa-salad',
      title: 'Mediterranean Quinoa Salad',
      tagline: 'Bright, crunchy, plant-protein full',
      description:
        'Fluffy quinoa with cucumber, cherry tomatoes, red onion, kalamata olives, parsley, and mint, dressed with lemon and olive oil. Naturally vegan and gluten-free; better the next day.',
      story:
        'A meal-prep workhorse that doesn\'t feel like meal prep. The quinoa absorbs the lemon dressing as it sits, the herbs keep their lift if you add them last, and a sprinkle of feta (or skip for vegan) makes it dinner-worthy. Twenty-five minutes start to finish, four lunches done.',
      seoTitle: 'Mediterranean Quinoa Salad — Vegan, Gluten-Free, 25 Min',
      seoDescription:
        'Fluffy quinoa with cucumber, tomatoes, olives, herbs, lemon, and olive oil. A vegan, gluten-free, high-protein meal-prep salad in 25 minutes.',
    },
    TR: {
      slug: 'akdeniz-kinoa-salatasi',
      title: 'Akdeniz Kinoa Salatası',
      tagline: 'Aydınlık, çıtır, bitki proteini dolu',
      description:
        'Salatalık, kiraz domates, kırmızı soğan, kalamata zeytin, maydanoz ve nane ile karıştırılmış puf gibi kinoa; limon ve zeytinyağı sosu ile servis edilir. Doğal olarak vegan ve glutensiz; ertesi gün daha lezzetli.',
      story:
        'Önceden hazırlık yapıyormuş gibi hissettirmeyen bir önceden hazırlık tarifi. Kinoa beklerken limon sosunu emer, otları en sona katarsan tazeliklerini korurlar, biraz beyaz peynir (vegan için atla) eklersen akşam yemeği bile olur. Yirmi beş dakikada başlar ve dört öğün hazır olur.',
      seoTitle: 'Akdeniz Kinoa Salatası — Vegan, Glutensiz, 25 Dakika',
      seoDescription:
        'Salatalık, domates, zeytin, otlar, limon ve zeytinyağı ile puf gibi kinoa. 25 dakikada vegan, glutensiz, yüksek proteinli önceden hazır salata.',
    },
    ES: {
      slug: 'ensalada-quinoa-mediterranea',
      title: 'Ensalada Mediterránea de Quinoa',
      tagline: 'Brillante, crujiente, llena de proteína vegetal',
      description:
        'Quinoa esponjosa con pepino, tomates cherry, cebolla roja, aceitunas kalamata, perejil y menta, aliñada con limón y aceite de oliva. Naturalmente vegana y sin gluten; mejor al día siguiente.',
      story:
        'Una receta de meal prep que no se siente como meal prep. La quinoa absorbe el aliño de limón mientras reposa, las hierbas mantienen su frescura si las añades al final, y un poco de feta (o saltarlo para versión vegana) la convierte en cena. Veinticinco minutos de principio a fin, cuatro comidas listas.',
      seoTitle: 'Ensalada Mediterránea de Quinoa — Vegana, Sin Gluten, 25 Min',
      seoDescription:
        'Quinoa esponjosa con pepino, tomates, aceitunas, hierbas, limón y aceite de oliva. Ensalada vegana, sin gluten, alta en proteínas en 25 minutos.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'For the salad' },
        TR: { label: 'Salata için' },
        ES: { label: 'Para la ensalada' },
      },
      items: [
        {
          ref: 'quinoa',
          position: 0,
          metric: { quantity: 200, unit: 'G' },
          us: { quantity: 1, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Quinoa', prep: 'rinsed under cold water', substitutes: ['couscous (note: contains gluten)'] },
            TR: { name: 'Kinoa', prep: 'soğuk suda yıkanmış', substitutes: ['kuskus (not: gluten içerir)'] },
            ES: { name: 'Quinoa', prep: 'enjuagada bajo agua fría', substitutes: ['cuscús (nota: contiene gluten)'] },
          },
        },
        {
          ref: 'water',
          position: 1,
          metric: { quantity: 400, unit: 'ML' },
          us: { quantity: 1.75, unit: 'CUP' },
          optional: false,
          aisle: 'OTHER',
          translations: {
            EN: { name: 'Water', prep: null, substitutes: ['vegetable broth'] },
            TR: { name: 'Su', prep: null, substitutes: ['sebze suyu'] },
            ES: { name: 'Agua', prep: null, substitutes: ['caldo de verduras'] },
          },
        },
        {
          ref: 'cucumber',
          position: 2,
          metric: { quantity: 1, unit: 'PIECE' },
          us: { quantity: 1, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'English cucumber', prep: 'diced', substitutes: ['Persian cucumbers'] },
            TR: { name: 'Salatalık', prep: 'küp doğranmış', substitutes: ['mini salatalık'] },
            ES: { name: 'Pepino inglés', prep: 'cortado en cubos', substitutes: ['pepinos persas'] },
          },
        },
        {
          ref: 'cherry-tomatoes',
          position: 3,
          metric: { quantity: 250, unit: 'G' },
          us: { quantity: 1.5, unit: 'CUP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Cherry tomatoes', prep: 'halved', substitutes: ['grape tomatoes'] },
            TR: { name: 'Kiraz domates', prep: 'ikiye bölünmüş', substitutes: ['cherry domates'] },
            ES: { name: 'Tomates cherry', prep: 'cortados por la mitad', substitutes: ['tomates uva'] },
          },
        },
        {
          ref: 'red-onion',
          position: 4,
          metric: { quantity: 0.5, unit: 'PIECE' },
          us: { quantity: 0.5, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Small red onion', prep: 'finely diced', substitutes: ['shallots'] },
            TR: { name: 'Küçük mor soğan', prep: 'küçük doğranmış', substitutes: ['arpacık soğan'] },
            ES: { name: 'Cebolla roja pequeña', prep: 'cortada en cubos pequeños', substitutes: ['chalotas'] },
          },
        },
        {
          ref: 'olives',
          position: 5,
          metric: { quantity: 80, unit: 'G' },
          us: { quantity: 0.5, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Kalamata olives', prep: 'pitted, halved', substitutes: ['black olives'] },
            TR: { name: 'Kalamata zeytin', prep: 'çekirdeksiz, ikiye bölünmüş', substitutes: ['siyah zeytin'] },
            ES: { name: 'Aceitunas kalamata', prep: 'sin hueso, cortadas por la mitad', substitutes: ['aceitunas negras'] },
          },
        },
        {
          ref: 'parsley',
          position: 6,
          metric: { quantity: 30, unit: 'G' },
          us: { quantity: 0.5, unit: 'CUP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Flat-leaf parsley', prep: 'roughly chopped', substitutes: [] },
            TR: { name: 'Maydanoz', prep: 'iri doğranmış', substitutes: [] },
            ES: { name: 'Perejil de hoja plana', prep: 'picado grueso', substitutes: [] },
          },
        },
        {
          ref: 'mint',
          position: 7,
          metric: { quantity: 15, unit: 'G' },
          us: { quantity: 0.25, unit: 'CUP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Fresh mint leaves', prep: 'torn', substitutes: [] },
            TR: { name: 'Taze nane yaprakları', prep: 'koparılmış', substitutes: [] },
            ES: { name: 'Hojas de menta fresca', prep: 'rotas a mano', substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'For the dressing' },
        TR: { label: 'Sos için' },
        ES: { label: 'Para el aliño' },
      },
      items: [
        {
          ref: 'lemon-juice',
          position: 0,
          metric: { quantity: 60, unit: 'ML' },
          us: { quantity: 0.25, unit: 'CUP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Fresh lemon juice', prep: null, substitutes: [] },
            TR: { name: 'Taze limon suyu', prep: null, substitutes: [] },
            ES: { name: 'Zumo de limón fresco', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'olive-oil',
          position: 1,
          metric: { quantity: 80, unit: 'ML' },
          us: { quantity: 0.33, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Extra virgin olive oil', prep: null, substitutes: [] },
            TR: { name: 'Sızma zeytinyağı', prep: null, substitutes: [] },
            ES: { name: 'Aceite de oliva virgen extra', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'salt',
          position: 2,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Salt', prep: 'to taste', substitutes: [] },
            TR: { name: 'Tuz', prep: 'damak tadına göre', substitutes: [] },
            ES: { name: 'Sal', prep: 'al gusto', substitutes: [] },
          },
        },
        {
          ref: 'pepper',
          position: 3,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Black pepper', prep: 'to taste', substitutes: [] },
            TR: { name: 'Karabiber', prep: 'damak tadına göre', substitutes: [] },
            ES: { name: 'Pimienta negra', prep: 'al gusto', substitutes: [] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: 900,
      ingredientRefs: ['quinoa', 'water'],
      translations: {
        EN: {
          title: 'Cook the quinoa',
          body: 'Combine rinsed quinoa with water in a saucepan with a tight lid. Bring to a boil, then reduce to the lowest simmer and cook covered for 12–15 minutes, until the water is absorbed and the grains have unfurled. Off the heat, fluff with a fork and let cool for 5 minutes.',
          note: 'Rinsing is non-negotiable — unrinsed quinoa tastes bitter from the saponin coating.',
          timerLabel: '15 min — simmer',
        },
        TR: {
          title: 'Kinoayı pişir',
          body: 'Yıkanmış kinoa ve suyu sıkı kapaklı bir tencerede birleştir. Kaynat, en düşük ateşe indir ve kapağı kapalı 12–15 dakika, su tamamen emilene ve taneler açılana kadar pişir. Ateşten al, çatalla havalandır, 5 dakika dinlendir.',
          note: 'Yıkamak zorunlu — yıkanmamış kinoa saponin kaplamasından dolayı acı tat verir.',
          timerLabel: '15 dk — pişirme',
        },
        ES: {
          title: 'Cocina la quinoa',
          body: 'Combina la quinoa enjuagada con el agua en una cacerola con tapa hermética. Lleva a ebullición, luego reduce al fuego más bajo y cocina tapado 12–15 minutos, hasta que el agua se absorba y los granos se hayan abierto. Fuera del fuego, esponja con un tenedor y deja enfriar 5 minutos.',
          note: 'Enjuagar no es negociable — la quinoa sin enjuagar sabe amarga por la capa de saponina.',
          timerLabel: '15 min — cocer',
        },
      },
    },
    {
      index: 1,
      timerSeconds: null,
      ingredientRefs: ['cucumber', 'cherry-tomatoes', 'red-onion', 'olives'],
      translations: {
        EN: {
          title: 'Prep the vegetables',
          body: 'While the quinoa cooks, dice the cucumber, halve the tomatoes, finely dice the red onion, and pit the olives. Combine in a large salad bowl.',
          note: 'A quick rinse of the diced red onion in cold water tames its sharpness if you find it strong.',
          timerLabel: null,
        },
        TR: {
          title: 'Sebzeleri hazırla',
          body: 'Kinoa pişerken salatalığı küp doğra, domatesleri ikiye böl, mor soğanı ince doğra ve zeytinlerin çekirdeğini çıkar. Büyük bir salata kâsesinde birleştir.',
          note: 'Mor soğanı ince doğradıktan sonra soğuk suyla kısaca yıkamak keskinliği yumuşatır.',
          timerLabel: null,
        },
        ES: {
          title: 'Prepara las verduras',
          body: 'Mientras se cocina la quinoa, corta el pepino en cubos, parte los tomates por la mitad, corta finamente la cebolla roja y deshuesa las aceitunas. Combina en un cuenco grande.',
          note: 'Un enjuague rápido de la cebolla roja picada en agua fría suaviza su sabor si lo encuentras fuerte.',
          timerLabel: null,
        },
      },
    },
    {
      index: 2,
      timerSeconds: null,
      ingredientRefs: ['lemon-juice', 'olive-oil', 'salt', 'pepper'],
      translations: {
        EN: {
          title: 'Whisk the dressing',
          body: 'In a small bowl or jar, whisk together the lemon juice, olive oil, a generous pinch of salt, and a few grinds of black pepper until emulsified.',
          note: null,
          timerLabel: null,
        },
        TR: {
          title: 'Sosu çırp',
          body: 'Küçük bir kâse veya kavanozda limon suyu, zeytinyağı, cömert bir tutam tuz ve birkaç tur karabiberi emülsifiye olana kadar çırp.',
          note: null,
          timerLabel: null,
        },
        ES: {
          title: 'Bate el aliño',
          body: 'En un cuenco pequeño o frasco, bate el zumo de limón, aceite de oliva, una pizca generosa de sal y unas vueltas de pimienta negra hasta emulsionar.',
          note: null,
          timerLabel: null,
        },
      },
    },
    {
      index: 3,
      timerSeconds: null,
      ingredientRefs: ['parsley', 'mint'],
      translations: {
        EN: {
          title: 'Combine and dress',
          body: 'Add the cooled quinoa to the vegetables. Pour over the dressing and toss thoroughly. Fold in the parsley and mint last to keep them vivid. Taste and adjust salt and lemon. Serve immediately or chill for up to 3 days.',
          note: 'For an even brighter result the next day, add the herbs fresh just before serving leftovers.',
          timerLabel: null,
        },
        TR: {
          title: 'Birleştir ve sosla',
          body: 'Soğuyan kinoayı sebzelere ekle. Sosu üzerine dök ve iyice karıştır. Maydanoz ve naneyi en sona katla, böylece canlılıklarını korurlar. Tat ve gerekiyorsa tuz ve limon ekle. Hemen servis et veya 3 güne kadar buzdolabında sakla.',
          note: 'Ertesi gün daha da canlı olması için, otları arta kalanları servis etmeden hemen önce taze ekle.',
          timerLabel: null,
        },
        ES: {
          title: 'Combina y aliña',
          body: 'Añade la quinoa enfriada a las verduras. Vierte el aliño por encima y mezcla bien. Incorpora el perejil y la menta al final para mantenerlos vivos. Prueba y ajusta sal y limón. Sirve de inmediato o refrigera hasta 3 días.',
          note: 'Para un resultado aún más fresco al día siguiente, añade las hierbas frescas justo antes de servir las sobras.',
          timerLabel: null,
        },
      },
    },
  ],

  equipmentSlugs: ['saucepan', 'stovetop', 'whisk'],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Add chickpeas + feta',
          body: 'Toss in 1 can (240 g drained) of chickpeas and 80 g of crumbled feta. Pushes protein to 18 g per serving and makes the salad a complete dinner. (Note: feta makes it no longer vegan/dairy-free.)',
        },
        TR: {
          title: 'Nohut ve beyaz peynir ekle',
          body: '1 konserve (süzülmüş 240 g) nohut ve 80 g ufalanmış beyaz peyniri ekle. Porsiyon başına proteini 18 g\'a çıkarır ve salatayı tam bir akşam yemeğine dönüştürür. (Not: beyaz peynir vegan/sütsüz olma durumunu sona erdirir.)',
        },
        ES: {
          title: 'Añadir garbanzos + feta',
          body: 'Incorpora 1 lata (240 g escurridos) de garbanzos y 80 g de feta desmenuzada. Eleva la proteína a 18 g por ración y convierte la ensalada en una cena completa. (Nota: la feta hace que ya no sea vegana/sin lácteos.)',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'How long does this keep in the fridge?',
          a: 'Up to 3 days, sealed. The dressing absorbs into the quinoa, so the salad actually tastes better on day 2. Refresh with extra herbs and a squeeze of lemon when serving leftovers.',
        },
        TR: {
          q: 'Bu salata buzdolabında ne kadar dayanır?',
          a: 'Kapalı şekilde 3 güne kadar. Sos kinoaya emilir, bu yüzden salata aslında 2. gün daha lezzetli olur. Artıkları servis ederken ekstra otlar ve bir limon sıkımı ile tazele.',
        },
        ES: {
          q: '¿Cuánto dura en el refrigerador?',
          a: 'Hasta 3 días, sellada. El aliño se absorbe en la quinoa, por lo que la ensalada de hecho sabe mejor el día 2. Refresca con hierbas extra y un chorrito de limón al servir las sobras.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'Can I use a different grain?',
          a: 'Couscous, farro, or pearl barley all work — but they contain gluten, so the salad is no longer gluten-free. For a strict gluten-free swap, try millet or buckwheat.',
        },
        TR: {
          q: 'Farklı bir tahıl kullanabilir miyim?',
          a: 'Kuskus, farro veya inci arpa hepsi işe yarar — ama gluten içerirler, yani salata artık glutensiz olmaz. Sıkı glutensiz alternatif için darı veya karabuğday dene.',
        },
        ES: {
          q: '¿Puedo usar un grano diferente?',
          a: 'Cuscús, farro o cebada perlada funcionan — pero contienen gluten, así que la ensalada ya no es sin gluten. Para una alternativa estricta sin gluten, prueba mijo o trigo sarraceno.',
        },
      },
    },
  ],

  nutrition: {
    calories: 320,
    proteinG: 8,
    proteinDailyPct: 16,
    carbsG: 38,
    carbsDailyPct: 14,
    fatG: 16,
    fatDailyPct: 21,
    fiberG: 6,
    fiberDailyPct: 21,
    sugarG: 4,
    sodiumMg: 420,
    sodiumDailyPct: 18,
  },

  categorySlugs: ['salads'],
  tagSlugs: ['healthy', 'summer', 'make-ahead', 'quick-easy'],
  dietSlugs: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'high-protein', 'halal'],
  allergens: [
    { slug: 'gluten', presence: 'FREE' },
    { slug: 'milk', presence: 'FREE' },
    { slug: 'eggs', presence: 'FREE' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'tree-nuts', presence: 'FREE' },
    { slug: 'peanuts', presence: 'FREE' },
    { slug: 'soybeans', presence: 'FREE' },
    { slug: 'sesame', presence: 'MAY_CONTAIN' },
    { slug: 'celery', presence: 'FREE' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'FREE' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/mediterranean-quinoa-salad/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Wide bowl of quinoa salad with bright tomatoes, cucumber, kalamata olives, and fresh mint' },
        TR: { alt: 'Canlı domates, salatalık, kalamata zeytin ve taze nane ile geniş kinoa salatası kâsesi' },
        ES: { alt: 'Cuenco ancho de ensalada de quinoa con tomates brillantes, pepino, aceitunas kalamata y menta fresca' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/mediterranean-quinoa-salad/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Glass jar of lemon-olive oil dressing on a marble counter beside chopped herbs' },
        TR: { alt: 'Mermer tezgâh üzerinde, doğranmış otların yanında limon-zeytinyağı sosu bulunan cam kavanoz' },
        ES: { alt: 'Frasco de cristal con aliño de limón y aceite de oliva sobre encimera de mármol junto a hierbas picadas' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'Made a double batch for the week and it stayed crisp. Adding the herbs at the end is the difference between fresh and tired.',
        TR: 'Hafta için iki kat hazırladım, çıtırlığını korudu. Otları sona eklemek tazelik ile bayatlık arasındaki fark.',
        ES: 'Hice doble cantidad para la semana y se mantuvo crujiente. Añadir las hierbas al final es la diferencia entre fresco y cansado.',
      },
    },
    {
      rating: 5,
      authorLocale: 'ES',
      body: {
        EN: 'I added the chickpeas + feta variation and it became my favourite lunch. The lemon ratio is exactly right.',
        TR: 'Nohut + beyaz peynir varyasyonunu ekledim, en sevdiğim öğle yemeği oldu. Limon oranı tam yerinde.',
        ES: 'Añadí la variación de garbanzos + feta y se convirtió en mi almuerzo favorito. La proporción de limón es exactamente la correcta.',
      },
    },
    {
      rating: 4,
      authorLocale: 'TR',
      body: {
        EN: 'Light and clean. I doubled the mint because I love it that strong — your call.',
        TR: 'Hafif ve sade. Naneyi ikiye katladım çünkü ben kuvvetli severim — sana kalmış.',
        ES: 'Ligera y limpia. Doblé la menta porque me gusta así de fuerte — depende de ti.',
      },
    },
  ],
}
