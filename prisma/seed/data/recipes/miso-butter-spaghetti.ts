import type { RecipeSeed } from '../../types'

export const misoButterSpaghetti: RecipeSeed = {
  seedId: 'recipe_miso-butter-spaghetti_seed',
  cuisineSlug: 'japanese',
  authorSlug: 'ferzender',
  skill: 'BEGINNER',
  servings: 2,
  prepMinutes: 5,
  cookMinutes: 15,
  totalMinutes: 20,
  heroImageCloudinary: 'tcd/seed/miso-butter-spaghetti/hero',
  heroBlurhash: null,
  costPerServingCents: 1850,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'miso-butter-spaghetti',
      title: 'Miso Butter Spaghetti',
      tagline: 'Umami-rich pasta in 20 minutes',
      description:
        'Silky spaghetti tossed with white miso, brown butter, garlic, and a kiss of lemon zest. The pantry pasta you make once and never forget.',
      story:
        'Italian technique meets Japanese pantry staple. White miso brings the salt, the depth, and a fermented sweetness that makes brown butter sing. The whole thing comes together in less time than it takes to set the table — perfect for the kind of weeknight where dinner needs to feel like a small celebration.',
      seoTitle: 'Miso Butter Spaghetti — 20 Minute Umami Pasta',
      seoDescription:
        'Silky spaghetti with white miso, brown butter, and lemon zest. A 20-minute pantry pasta that tastes restaurant-worthy.',
    },
    TR: {
      slug: 'miso-tereyagli-spagetti',
      title: 'Miso Tereyağlı Spagetti',
      tagline: '20 dakikada umami dolu makarna',
      description:
        'Beyaz miso, kavrulmuş tereyağı, sarımsak ve bir tutam limon kabuğu ile harmanlanmış ipeksi spagetti. Bir kez yaptığında unutamayacağın kiler makarnası.',
      story:
        'İtalyan tekniği Japon kileriyle buluşuyor. Beyaz miso hem tuzu hem derinliği veriyor; kavrulmuş tereyağına eşlik eden bu fermente tatlılık, sıradan bir akşam yemeğini küçük bir kutlamaya dönüştürüyor. Sofrayı kurmaktan daha kısa sürede hazır.',
      seoTitle: 'Miso Tereyağlı Spagetti — 20 Dakikada Umami',
      seoDescription:
        'Beyaz miso, kavrulmuş tereyağı ve limon kabuğuyla ipeksi spagetti. 20 dakikalık restoran kalitesinde kiler makarnası.',
    },
    ES: {
      slug: 'espaguetis-mantequilla-miso',
      title: 'Espaguetis con Mantequilla de Miso',
      tagline: 'Pasta umami en 20 minutos',
      description:
        'Espaguetis sedosos con miso blanco, mantequilla tostada, ajo y un toque de ralladura de limón. La pasta de despensa que harás una vez y nunca olvidarás.',
      story:
        'La técnica italiana se encuentra con la despensa japonesa. El miso blanco aporta sal, profundidad y un dulzor fermentado que hace cantar a la mantequilla tostada. Todo se reúne en menos tiempo del que tardas en poner la mesa — perfecto para esas noches en que la cena necesita sentirse como una pequeña celebración.',
      seoTitle: 'Espaguetis con Mantequilla de Miso — Pasta Umami en 20 Minutos',
      seoDescription:
        'Espaguetis sedosos con miso blanco, mantequilla tostada y ralladura de limón. Una pasta de despensa de 20 minutos digna de restaurante.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'Pasta' },
        TR: { label: 'Makarna' },
        ES: { label: 'Pasta' },
      },
      items: [
        {
          ref: 'spaghetti',
          position: 0,
          metric: { quantity: 200, unit: 'G' },
          us: { quantity: 7, unit: 'OZ' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Spaghetti', prep: null, substitutes: ['linguine', 'bucatini'] },
            TR: { name: 'Spagetti', prep: null, substitutes: ['linguine', 'bucatini'] },
            ES: { name: 'Espaguetis', prep: null, substitutes: ['linguine', 'bucatini'] },
          },
        },
        {
          ref: 'pasta-salt',
          position: 1,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Salt for the pasta water', prep: null, substitutes: [] },
            TR: { name: 'Makarna suyu için tuz', prep: null, substitutes: [] },
            ES: { name: 'Sal para el agua de la pasta', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'Sauce' },
        TR: { label: 'Sos' },
        ES: { label: 'Salsa' },
      },
      items: [
        {
          ref: 'butter',
          position: 0,
          metric: { quantity: 60, unit: 'G' },
          us: { quantity: 4, unit: 'TBSP' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Unsalted butter', prep: null, substitutes: [] },
            TR: { name: 'Tuzsuz tereyağı', prep: null, substitutes: [] },
            ES: { name: 'Mantequilla sin sal', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'white-miso',
          position: 1,
          metric: { quantity: 30, unit: 'G' },
          us: { quantity: 2, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'White miso paste', prep: null, substitutes: ['yellow miso (use less)'] },
            TR: { name: 'Beyaz miso ezmesi', prep: null, substitutes: ['sarı miso (daha az kullan)'] },
            ES: { name: 'Pasta de miso blanco', prep: null, substitutes: ['miso amarillo (usar menos)'] },
          },
        },
        {
          ref: 'garlic',
          position: 2,
          metric: { quantity: 2, unit: 'PIECE' },
          us: { quantity: 2, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Garlic clove', prep: 'finely grated', substitutes: [] },
            TR: { name: 'Sarımsak dişi', prep: 'rendelenmiş', substitutes: [] },
            ES: { name: 'Diente de ajo', prep: 'finamente rallado', substitutes: [] },
          },
        },
        {
          ref: 'soy-sauce',
          position: 3,
          metric: { quantity: 5, unit: 'ML' },
          us: { quantity: 1, unit: 'TSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Light soy sauce', prep: null, substitutes: ['tamari'] },
            TR: { name: 'Açık soya sosu', prep: null, substitutes: ['tamari'] },
            ES: { name: 'Salsa de soja clara', prep: null, substitutes: ['tamari'] },
          },
        },
        {
          ref: 'lemon',
          position: 4,
          metric: { quantity: 0.5, unit: 'PIECE' },
          us: { quantity: 0.5, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Lemon, zest only', prep: 'zested', substitutes: [] },
            TR: { name: 'Limon, sadece kabuk', prep: 'rendelenmiş', substitutes: [] },
            ES: { name: 'Limón, solo ralladura', prep: 'rallado', substitutes: [] },
          },
        },
        {
          ref: 'chives',
          position: 5,
          metric: { quantity: 5, unit: 'G' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: true,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Fresh chives', prep: 'finely sliced', substitutes: ['scallion greens'] },
            TR: { name: 'Taze frenk soğanı', prep: 'ince doğranmış', substitutes: ['yeşil soğan'] },
            ES: { name: 'Cebollino fresco', prep: 'finamente picado', substitutes: ['parte verde de cebolleta'] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: 540,
      ingredientRefs: ['spaghetti', 'pasta-salt'],
      translations: {
        EN: {
          title: 'Boil the spaghetti',
          body: 'Bring 2 L of water to a rolling boil. Salt it generously — the water should taste like the sea. Cook the spaghetti until 1 minute shy of the package time. Reserve 100 ml of pasta water before draining.',
          note: 'The reserved pasta water is the secret to a glossy sauce. Don\'t skip it.',
          timerLabel: '9 min — al dente',
        },
        TR: {
          title: 'Spagettiyi haşla',
          body: '2 litre suyu güçlü bir şekilde kaynat. Cömertçe tuzla — su deniz gibi tuzlu olmalı. Spagettiyi paket süresinden 1 dakika kısa pişir. Süzmeden önce 100 ml haşlama suyunu ayır.',
          note: 'Ayrılan haşlama suyu sosun parlaklığının sırrıdır. Atlama.',
          timerLabel: '9 dk — al dente',
        },
        ES: {
          title: 'Cuece los espaguetis',
          body: 'Lleva 2 L de agua a hervor fuerte. Salar generosamente — el agua debe saber a mar. Cuece los espaguetis 1 minuto menos del tiempo del paquete. Reserva 100 ml del agua de cocción antes de escurrir.',
          note: 'El agua de cocción reservada es el secreto de una salsa brillante. No la saltes.',
          timerLabel: '9 min — al dente',
        },
      },
    },
    {
      index: 1,
      timerSeconds: 180,
      ingredientRefs: ['butter', 'garlic'],
      translations: {
        EN: {
          title: 'Brown the butter',
          body: 'In a wide skillet over medium heat, melt the butter. Continue cooking, swirling occasionally, until the milk solids turn deep golden and the kitchen smells of caramelized hazelnut, about 3 minutes. Add the garlic off the heat — its residual heat will cook it.',
          note: null,
          timerLabel: '3 min — brown butter',
        },
        TR: {
          title: 'Tereyağını kavur',
          body: 'Geniş bir tavada orta ateşte tereyağını erit. Ara sıra çevirerek, süt katıları derin altın rengine dönene ve mutfak karamelize fındık kokana kadar pişir, yaklaşık 3 dakika. Sarımsağı ateşten alınca ekle — kalan ısı pişirir.',
          note: null,
          timerLabel: '3 dk — kavurma',
        },
        ES: {
          title: 'Tuesta la mantequilla',
          body: 'En una sartén ancha a fuego medio, derrite la mantequilla. Sigue cocinando, removiendo de vez en cuando, hasta que los sólidos lácteos se vuelvan dorados oscuros y la cocina huela a avellana caramelizada, unos 3 minutos. Añade el ajo fuera del fuego — el calor residual lo cocinará.',
          note: null,
          timerLabel: '3 min — tostar',
        },
      },
    },
    {
      index: 2,
      timerSeconds: 60,
      ingredientRefs: ['white-miso', 'soy-sauce'],
      translations: {
        EN: {
          title: 'Whisk in the miso',
          body: 'Add the miso paste and soy sauce to the skillet. Whisk vigorously with a fork or small whisk until you have a smooth, glossy sauce. It will look split at first — keep going.',
          note: 'A splash of pasta water helps the miso emulsify if it resists.',
          timerLabel: '1 min — emulsify',
        },
        TR: {
          title: 'Misoyu çırp',
          body: 'Tavaya miso ezmesi ve soya sosu ekle. Çatal veya küçük çırpıcı ile pürüzsüz, parlak bir sos elde edene kadar güçlüce çırp. Başta ayrılmış görünür — devam et.',
          note: 'Miso direnç gösterirse bir tutam haşlama suyu emülsifikasyona yardım eder.',
          timerLabel: '1 dk — emülsifiye',
        },
        ES: {
          title: 'Bate el miso',
          body: 'Añade la pasta de miso y la salsa de soja a la sartén. Bate con energía con un tenedor o batidor pequeño hasta tener una salsa lisa y brillante. Al principio parecerá cortada — sigue batiendo.',
          note: 'Un chorrito de agua de la pasta ayuda a emulsionar el miso si se resiste.',
          timerLabel: '1 min — emulsionar',
        },
      },
    },
    {
      index: 3,
      timerSeconds: 90,
      ingredientRefs: ['spaghetti', 'lemon', 'chives'],
      translations: {
        EN: {
          title: 'Toss and finish',
          body: 'Add the drained pasta to the skillet along with 50 ml of pasta water. Toss vigorously with tongs over low heat for 90 seconds — the sauce will tighten and coat each strand. Finish with lemon zest and chives. Serve immediately.',
          note: 'If the sauce looks dry, add another splash of pasta water. If it pools at the bottom, toss longer.',
          timerLabel: '1.5 min — toss',
        },
        TR: {
          title: 'Karıştır ve bitir',
          body: 'Süzülmüş makarnayı 50 ml haşlama suyuyla birlikte tavaya ekle. Maşa ile kısık ateşte 90 saniye boyunca güçlüce karıştır — sos sıkılaşacak ve her bir teli kaplayacak. Limon kabuğu ve frenk soğanı ile bitir. Hemen servis et.',
          note: 'Sos kuru görünürse biraz daha haşlama suyu ekle. Tabanda birikiyorsa daha uzun karıştır.',
          timerLabel: '1.5 dk — karıştırma',
        },
        ES: {
          title: 'Mezcla y termina',
          body: 'Añade la pasta escurrida a la sartén junto con 50 ml del agua de cocción. Mezcla enérgicamente con pinzas a fuego bajo durante 90 segundos — la salsa se ajustará y cubrirá cada hebra. Termina con la ralladura de limón y el cebollino. Sirve inmediatamente.',
          note: 'Si la salsa parece seca, añade otro chorrito de agua de pasta. Si se acumula en el fondo, mezcla más tiempo.',
          timerLabel: '1.5 min — mezclar',
        },
      },
    },
  ],

  equipmentSlugs: [
    { slug: 'saucepan', position: 0, required: true, note: 'Wide enough to hold a portion of pasta' },
    { slug: 'skillet', position: 1, required: true, note: 'A 30 cm / 12-inch pan' },
    { slug: 'stovetop', position: 2, required: true },
    { slug: 'whisk', position: 3, required: false, note: 'A fork emulsifies the sauce just as well' },
  ],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Mushroom variant',
          body: 'Sauté 200 g of mixed mushrooms in olive oil until deeply golden, then fold into the finished pasta. Doubles the umami without changing the technique.',
        },
        TR: {
          title: 'Mantarlı varyasyon',
          body: '200 g karışık mantarı zeytinyağında derin altın rengine gelene kadar pişir, sonra hazır makarnaya katla. Tekniği değiştirmeden umami ikiye katlar.',
        },
        ES: {
          title: 'Variación con champiñones',
          body: 'Saltea 200 g de champiñones mixtos en aceite de oliva hasta dorarse profundamente, luego incorpóralos a la pasta terminada. Duplica el umami sin cambiar la técnica.',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'Can I use red miso instead of white?',
          a: 'You can, but reduce the quantity by half — red miso is significantly saltier and more assertive. White miso\'s mellow sweetness is what makes this dish feel balanced.',
        },
        TR: {
          q: 'Beyaz miso yerine kırmızı miso kullanabilir miyim?',
          a: 'Kullanabilirsin, ama miktarı yarıya indir — kırmızı miso çok daha tuzlu ve baskın. Beyaz misonun yumuşak tatlılığı bu yemeği dengeli kılan şey.',
        },
        ES: {
          q: '¿Puedo usar miso rojo en lugar de blanco?',
          a: 'Puedes, pero reduce la cantidad a la mitad — el miso rojo es significativamente más salado y dominante. El dulzor suave del miso blanco es lo que equilibra este plato.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'How do I make this vegan?',
          a: 'Swap the butter for a high-quality plant butter (block style, not spread) and double-check that your miso is unpasteurized but vegan — most are. The brown butter step still works because plant butters with sufficient milk-solid analogues will brown.',
        },
        TR: {
          q: 'Vegan versiyonu nasıl yapılır?',
          a: 'Tereyağını kaliteli bir bitkisel tereyağı (blok formu, sürülebilir değil) ile değiştir ve misonun vegan olduğunu kontrol et — çoğu vegandır. Yeterli süt katı analoğu içeren bitkisel tereyağları kavrulabilir.',
        },
        ES: {
          q: '¿Cómo lo hago vegano?',
          a: 'Cambia la mantequilla por una mantequilla vegetal de calidad (en barra, no untable) y verifica que tu miso sea vegano — la mayoría lo son. El paso de la mantequilla tostada sigue funcionando con mantequillas vegetales que tengan suficientes análogos de sólidos lácteos.',
        },
      },
    },
  ],

  nutrition: {
    calories: 540,
    proteinG: 14,
    proteinDailyPct: 28,
    carbsG: 78,
    carbsDailyPct: 28,
    fatG: 18,
    fatDailyPct: 23,
    fiberG: 3,
    fiberDailyPct: 11,
    sugarG: 2,
    sodiumMg: 920,
    sodiumDailyPct: 40,
  },

  categorySlugs: ['main-courses'],
  tagSlugs: ['quick-easy', 'comfort-food'],
  dietSlugs: ['vegetarian'],
  allergens: [
    { slug: 'gluten', presence: 'CONTAINS' },
    { slug: 'milk', presence: 'CONTAINS' },
    { slug: 'soybeans', presence: 'CONTAINS' },
    { slug: 'eggs', presence: 'FREE' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'tree-nuts', presence: 'FREE' },
    { slug: 'peanuts', presence: 'FREE' },
    { slug: 'sesame', presence: 'FREE' },
    { slug: 'celery', presence: 'FREE' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'FREE' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/miso-butter-spaghetti/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Plate of glossy miso butter spaghetti twirled high, scattered with chives and lemon zest' },
        TR: { alt: 'Yüksek bir tepe halinde sarılmış parlak miso tereyağlı spagetti, frenk soğanı ve limon kabuğu ile süslenmiş' },
        ES: { alt: 'Plato de espaguetis brillantes con mantequilla de miso enrollados alto, espolvoreados con cebollino y ralladura de limón' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/miso-butter-spaghetti/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Pan with brown butter mid-foam, tablespoon of white miso paste ready to whisk in' },
        TR: { alt: 'Köpürmekte olan kavrulmuş tereyağı bulunan tava, kıvamı çırpılmaya hazır beyaz miso ezmesi yemek kaşığıyla' },
        ES: { alt: 'Sartén con mantequilla tostada espumosa, cucharada de pasta de miso blanco lista para incorporar' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'This is now in my weekly rotation. The brown butter + miso combo is unreasonably good for how simple it is.',
        TR: 'Artık haftalık rutinimde. Kavrulmuş tereyağı + miso ikilisi bu kadar basit bir şey için fazla iyi.',
        ES: 'Ahora está en mi rotación semanal. La combinación mantequilla tostada + miso es increíblemente buena para lo simple que es.',
      },
    },
    {
      rating: 5,
      authorLocale: 'TR',
      body: {
        EN: 'I made it with linguine because that\'s what I had. Worked beautifully. Lemon zest at the end is non-negotiable.',
        TR: 'Elimde olan linguine ile yaptım, harika oldu. Sondaki limon kabuğu pazarlık konusu değil.',
        ES: 'La hice con linguine porque es lo que tenía. Funcionó perfectamente. La ralladura de limón al final es innegociable.',
      },
    },
    {
      rating: 4,
      authorLocale: 'ES',
      body: {
        EN: 'Loved the technique. Next time I\'ll add a dash more soy sauce — I like things bolder, but the recipe is well-balanced as written.',
        TR: 'Tekniği çok sevdim. Bir dahaki sefere biraz daha soya sosu ekleyeceğim — ben daha baskın severim, ama tarif olduğu gibi dengeli.',
        ES: 'Me encantó la técnica. La próxima vez añadiré un chorrito más de salsa de soja — me gustan los sabores más intensos, pero la receta está bien equilibrada tal cual.',
      },
    },
  ],
}
