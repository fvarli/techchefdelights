import type { RecipeSeed } from '../../types'

export const lemonCheesecake: RecipeSeed = {
  seedId: 'recipe_lemon-cheesecake_seed',
  cuisineSlug: 'american',
  authorSlug: 'ferzender',
  skill: 'INTERMEDIATE',
  servings: 10,
  prepMinutes: 30,
  cookMinutes: 60,
  totalMinutes: 240,
  heroImageCloudinary: 'tcd/seed/lemon-cheesecake/hero',
  heroBlurhash: null,
  costPerServingCents: 3500,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'lemon-cheesecake',
      title: 'Lemon Cheesecake',
      tagline: 'Tangy, dense, bright on the tongue',
      description:
        'Buttery digestive crust topped with cream cheese filling spiked with the zest of three lemons and a splash of fresh juice. Baked low, chilled long, served cold.',
      story:
        'A cheesecake should be tangy, dense without being heavy, and bright on the tongue. This version uses three lemons\' worth of zest plus enough juice to lift it from sweet to alive. The biscuit base bakes briefly before the filling goes in — a small step that prevents the dreaded soggy bottom. The wait is the hardest part: four hours minimum, eight hours ideal. Worth it.',
      seoTitle: 'Lemon Cheesecake — Bright Citrus Baked Recipe',
      seoDescription:
        'Tangy lemon cheesecake with digestive crust, cream cheese filling, and three lemons. Baked low and slow, chilled overnight. 10 servings.',
    },
    TR: {
      slug: 'limonlu-cheesecake',
      title: 'Limonlu Cheesecake',
      tagline: 'Mayhoş, yoğun, dilde aydınlık',
      description:
        'Tereyağlı bisküvili taban üzerinde, üç limonun kabuğu ve taze suyu ile zenginleştirilmiş krem peynir harç. Düşük ısıda pişer, uzun süre dinlenir, soğuk servis edilir.',
      story:
        'Bir cheesecake mayhoş, ağır olmadan yoğun ve dilde aydınlık olmalı. Bu versiyon üç limonun kabuğunu ve onu tatlıdan canlıya çeviren miktarda suyunu kullanıyor. Bisküvili taban harç dökülmeden önce kısaca pişiriliyor — korkulan ıslak tabanı önleyen küçük bir adım. En zor kısım bekleme: en az dört saat, ideali sekiz saat. Değer.',
      seoTitle: 'Limonlu Cheesecake — Mayhoş Narenciye Tarifi',
      seoDescription:
        'Tereyağlı bisküvili tabanlı, krem peynirli, üç limonlu mayhoş cheesecake. Düşük ısıda pişer, gece boyu dinlenir. 10 porsiyon.',
    },
    ES: {
      slug: 'tarta-queso-limon',
      title: 'Tarta de Queso al Limón',
      tagline: 'Ácida, densa, brillante al paladar',
      description:
        'Base mantecosa de galletas digestivas cubierta con relleno de queso crema realzado con la ralladura de tres limones y un chorrito de zumo fresco. Horneada a baja temperatura, refrigerada largamente, servida fría.',
      story:
        'Una tarta de queso debe ser ácida, densa sin ser pesada, y brillante en la lengua. Esta versión usa la ralladura de tres limones más zumo suficiente para elevarla de dulce a vivaz. La base de galletas se hornea brevemente antes de añadir el relleno — un pequeño paso que previene el temido fondo blando. La espera es la parte más difícil: cuatro horas mínimo, ocho horas ideal. Vale la pena.',
      seoTitle: 'Tarta de Queso al Limón — Receta Cítrica Brillante',
      seoDescription:
        'Tarta de queso al limón ácida con base de galletas, relleno de queso crema y tres limones. Horneada a fuego lento, refrigerada toda la noche. 10 raciones.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'For the crust' },
        TR: { label: 'Taban için' },
        ES: { label: 'Para la base' },
      },
      items: [
        {
          ref: 'biscuits',
          position: 0,
          metric: { quantity: 200, unit: 'G' },
          us: { quantity: 7, unit: 'OZ' },
          optional: false,
          aisle: 'BAKERY',
          translations: {
            EN: { name: 'Digestive biscuits', prep: 'crushed to fine crumbs', substitutes: ['graham crackers'] },
            TR: { name: 'Burçak veya petibör bisküvi', prep: 'ince ufalanmış', substitutes: [] },
            ES: { name: 'Galletas digestivas', prep: 'machacadas en migas finas', substitutes: ['galletas graham'] },
          },
        },
        {
          ref: 'crust-butter',
          position: 1,
          metric: { quantity: 100, unit: 'G' },
          us: { quantity: 7, unit: 'TBSP' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Unsalted butter', prep: 'melted', substitutes: [] },
            TR: { name: 'Tuzsuz tereyağı', prep: 'eritilmiş', substitutes: [] },
            ES: { name: 'Mantequilla sin sal', prep: 'derretida', substitutes: [] },
          },
        },
        {
          ref: 'crust-sugar',
          position: 2,
          metric: { quantity: 30, unit: 'G' },
          us: { quantity: 2, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Granulated sugar', prep: null, substitutes: [] },
            TR: { name: 'Toz şeker', prep: null, substitutes: [] },
            ES: { name: 'Azúcar granulada', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'For the filling' },
        TR: { label: 'Harç için' },
        ES: { label: 'Para el relleno' },
      },
      items: [
        {
          ref: 'cream-cheese',
          position: 0,
          metric: { quantity: 600, unit: 'G' },
          us: { quantity: 21, unit: 'OZ' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Full-fat cream cheese', prep: 'softened to room temperature', substitutes: [] },
            TR: { name: 'Tam yağlı labne veya krem peynir', prep: 'oda sıcaklığına gelmiş', substitutes: [] },
            ES: { name: 'Queso crema entero', prep: 'a temperatura ambiente', substitutes: [] },
          },
        },
        {
          ref: 'sour-cream',
          position: 1,
          metric: { quantity: 200, unit: 'G' },
          us: { quantity: 7, unit: 'OZ' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Sour cream', prep: null, substitutes: ['Greek yogurt'] },
            TR: { name: 'Ekşi krema', prep: null, substitutes: ['Yunan yoğurdu'] },
            ES: { name: 'Crema agria', prep: null, substitutes: ['yogur griego'] },
          },
        },
        {
          ref: 'filling-sugar',
          position: 2,
          metric: { quantity: 180, unit: 'G' },
          us: { quantity: 0.9, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Granulated sugar', prep: null, substitutes: [] },
            TR: { name: 'Toz şeker', prep: null, substitutes: [] },
            ES: { name: 'Azúcar granulada', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'eggs',
          position: 3,
          metric: { quantity: 3, unit: 'PIECE' },
          us: { quantity: 3, unit: 'PIECE' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Large eggs', prep: 'room temperature', substitutes: [] },
            TR: { name: 'Büyük yumurta', prep: 'oda sıcaklığında', substitutes: [] },
            ES: { name: 'Huevos grandes', prep: 'a temperatura ambiente', substitutes: [] },
          },
        },
        {
          ref: 'egg-yolk',
          position: 4,
          metric: { quantity: 1, unit: 'PIECE' },
          us: { quantity: 1, unit: 'PIECE' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Extra egg yolk', prep: null, substitutes: [] },
            TR: { name: 'Ekstra yumurta sarısı', prep: null, substitutes: [] },
            ES: { name: 'Yema de huevo extra', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'lemon-zest',
          position: 5,
          metric: { quantity: 3, unit: 'PIECE' },
          us: { quantity: 3, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Lemon, zest only (3 lemons)', prep: 'finely zested', substitutes: [] },
            TR: { name: 'Limon, sadece kabuk (3 limon)', prep: 'rendelenmiş', substitutes: [] },
            ES: { name: 'Limón, solo ralladura (3 limones)', prep: 'finamente rallado', substitutes: [] },
          },
        },
        {
          ref: 'lemon-juice',
          position: 6,
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
          ref: 'vanilla',
          position: 7,
          metric: { quantity: 5, unit: 'ML' },
          us: { quantity: 1, unit: 'TSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Vanilla extract', prep: null, substitutes: [] },
            TR: { name: 'Vanilya özü', prep: null, substitutes: ['vanilin'] },
            ES: { name: 'Extracto de vainilla', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'flour',
          position: 8,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Plain flour', prep: null, substitutes: ['cornstarch'] },
            TR: { name: 'Buğday unu', prep: null, substitutes: ['mısır nişastası'] },
            ES: { name: 'Harina común', prep: null, substitutes: ['maicena'] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: 600,
      ingredientRefs: ['biscuits', 'crust-butter', 'crust-sugar'],
      translations: {
        EN: {
          title: 'Bake the crust',
          body: 'Preheat oven to 175°C (350°F). Mix biscuit crumbs, melted butter, and sugar in a bowl until it resembles wet sand. Press firmly into a 23 cm springform pan, going slightly up the sides. Bake for 10 minutes; cool while you make the filling.',
          note: 'Press hard with the bottom of a measuring cup for an even, compact base.',
          timerLabel: '10 min — pre-bake',
        },
        TR: {
          title: 'Tabanı pişir',
          body: 'Fırını 175°C\'ye ısıt. Bisküvi kırıntıları, eritilmiş tereyağı ve şekeri ıslak kum kıvamına gelene kadar karıştır. 23 cm kelepçeli kalıba sıkıca bastır, kenarları biraz yukarı çıkacak şekilde. 10 dakika pişir; harcı yaparken soğut.',
          note: 'Eşit ve sıkı bir taban için ölçü kabının altıyla iyice bastır.',
          timerLabel: '10 dk — ön pişirme',
        },
        ES: {
          title: 'Hornea la base',
          body: 'Precalienta el horno a 175°C. Mezcla las migas de galleta, mantequilla derretida y azúcar en un cuenco hasta que parezca arena mojada. Presiona firmemente en un molde desmontable de 23 cm, subiendo ligeramente por los lados. Hornea 10 minutos; enfría mientras preparas el relleno.',
          note: 'Presiona fuerte con el fondo de una taza medidora para una base uniforme y compacta.',
          timerLabel: '10 min — pre-horneado',
        },
      },
    },
    {
      index: 1,
      timerSeconds: 120,
      ingredientRefs: ['cream-cheese'],
      translations: {
        EN: {
          title: 'Beat the cream cheese',
          body: 'In a stand mixer with paddle attachment, beat the room-temperature cream cheese on medium speed for 2 minutes until completely smooth. Scrape down the bowl frequently — any lumps now will haunt the final cake.',
          note: null,
          timerLabel: '2 min — beat',
        },
        TR: {
          title: 'Krem peyniri çırp',
          body: 'Sabit miksere yaprak çırpıcı tak; oda sıcaklığındaki krem peyniri orta hızda 2 dakika, tamamen pürüzsüz olana kadar çırp. Sık sık kâseyi sıyır — şimdi kalan topaklar son cheesecake\'i bozar.',
          note: null,
          timerLabel: '2 dk — çırpma',
        },
        ES: {
          title: 'Bate el queso crema',
          body: 'En una batidora de pie con paleta, bate el queso crema a temperatura ambiente a velocidad media durante 2 minutos hasta que esté completamente liso. Raspa el cuenco con frecuencia — cualquier grumo ahora aparecerá en la tarta final.',
          note: null,
          timerLabel: '2 min — batir',
        },
      },
    },
    {
      index: 2,
      timerSeconds: null,
      ingredientRefs: ['filling-sugar', 'eggs', 'egg-yolk', 'sour-cream', 'lemon-zest', 'lemon-juice', 'vanilla', 'flour'],
      translations: {
        EN: {
          title: 'Build the filling',
          body: 'Add sugar; beat 1 minute. Add eggs and yolk one at a time, beating just until each is incorporated. Add sour cream, lemon zest, lemon juice, vanilla, and flour. Mix on low until just combined — overmixing introduces air, which causes cracks.',
          note: 'Low and slow is the rule from here on.',
          timerLabel: null,
        },
        TR: {
          title: 'Harcı oluştur',
          body: 'Şekeri ekle; 1 dakika çırp. Yumurtaları ve sarıyı tek tek, her biri karışana kadar ekle. Ekşi krema, limon kabuğu, limon suyu, vanilya ve unu ekle. Düşük hızda, yalnızca birleşene kadar karıştır — fazla çırpma hava katar ve çatlağa neden olur.',
          note: 'Buradan sonra kural: düşük hız ve yavaş.',
          timerLabel: null,
        },
        ES: {
          title: 'Construye el relleno',
          body: 'Añade el azúcar; bate 1 minuto. Añade los huevos y la yema uno a uno, batiendo solo hasta que cada uno se incorpore. Añade crema agria, ralladura de limón, zumo de limón, vainilla y harina. Mezcla a baja velocidad solo hasta que se combine — batir en exceso introduce aire, lo que causa grietas.',
          note: 'Lento y bajo es la regla a partir de aquí.',
          timerLabel: null,
        },
      },
    },
    {
      index: 3,
      timerSeconds: 3600,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Bake low and slow',
          body: 'Reduce oven to 160°C (320°F). Pour the filling over the cooled crust and smooth the top. Bake for 50–60 minutes — the edges should be set but the center should still wobble slightly when the pan is jiggled. Turn the oven off and crack the door; let the cheesecake cool inside for 1 hour.',
          note: 'A water bath (place pan in a larger pan with 2 cm of hot water) gives an even smoother top, but is optional.',
          timerLabel: '60 min — bake',
        },
        TR: {
          title: 'Düşük ısıda yavaşça pişir',
          body: 'Fırını 160°C\'ye düşür. Harcı soğuyan tabanın üzerine dök ve üstünü düzleştir. 50–60 dakika pişir — kenarlar tutmuş ama tepsi sallandığında merkez hafifçe titremeli. Fırını kapat, kapağı arala; cheesecake\'i 1 saat içeride soğut.',
          note: 'Su banyosu (kalıbı 2 cm sıcak su olan daha büyük bir tepsiye yerleştir) daha pürüzsüz bir üst verir; isteğe bağlı.',
          timerLabel: '60 dk — pişirme',
        },
        ES: {
          title: 'Hornea a fuego lento',
          body: 'Reduce el horno a 160°C. Vierte el relleno sobre la base fría y alisa la superficie. Hornea 50–60 minutos — los bordes deben estar firmes pero el centro debe seguir temblando ligeramente al sacudir el molde. Apaga el horno y entreabre la puerta; deja enfriar la tarta dentro durante 1 hora.',
          note: 'Un baño maría (coloca el molde en otro más grande con 2 cm de agua caliente) da una superficie aún más lisa, pero es opcional.',
          timerLabel: '60 min — hornear',
        },
      },
    },
    {
      index: 4,
      timerSeconds: 14400,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Chill thoroughly',
          body: 'Bring the cheesecake to room temperature, then refrigerate uncovered for at least 4 hours, ideally overnight. The texture transforms during this rest — from soft custard to dense, sliceable cheesecake.',
          note: 'Run a thin knife around the inside of the pan before unclipping to prevent cracks as it shrinks.',
          timerLabel: '4+ hours — chill',
        },
        TR: {
          title: 'İyice soğut',
          body: 'Cheesecake oda sıcaklığına gelsin, sonra kapaksız buzdolabında en az 4 saat, ideali bir gece. Doku bu dinlenme sırasında dönüşür — yumuşak muhallebiden yoğun, dilimlenebilir cheesecake\'e.',
          note: 'Kelepçeyi çıkarmadan önce ince bir bıçağı kalıbın iç çevresinde dolaştır; çekilirken çatlamayı önler.',
          timerLabel: '4+ saat — soğutma',
        },
        ES: {
          title: 'Refrigera bien',
          body: 'Lleva la tarta a temperatura ambiente, luego refrigera sin tapar al menos 4 horas, idealmente toda la noche. La textura se transforma durante este reposo — de natilla suave a tarta densa y cortable.',
          note: 'Pasa un cuchillo fino por el interior del molde antes de desmoldar para prevenir grietas al encogerse.',
          timerLabel: '4+ horas — refrigerar',
        },
      },
    },
  ],

  equipmentSlugs: ['oven', 'mixer', 'baking-sheet'],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Berry compote topping',
          body: 'Simmer 200 g mixed berries with 30 g sugar and 1 tbsp lemon juice for 8 minutes until syrupy. Cool and spoon over slices when serving. Cuts through the richness.',
        },
        TR: {
          title: 'Karışık meyve sosu',
          body: '200 g karışık orman meyvesini 30 g şeker ve 1 yemek kaşığı limon suyu ile 8 dakika, kıvam alana kadar pişir. Soğuduktan sonra dilimlerin üzerine kaşıkla. Yoğunluğu dengeler.',
        },
        ES: {
          title: 'Cobertura de compota de frutos rojos',
          body: 'Cocina 200 g de frutos rojos mixtos con 30 g de azúcar y 1 cda de zumo de limón a fuego lento 8 minutos hasta que tenga consistencia de almíbar. Enfría y sirve con cuchara sobre las porciones. Equilibra la riqueza.',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'Why did my cheesecake crack?',
          a: 'Three usual culprits: cream cheese was cold (lumps), filling was overbeaten (too much air), or the cooldown was too fast. Following the room-temp ingredients and oven-off cooldown steps eliminates 90% of cracks.',
        },
        TR: {
          q: 'Cheesecake\'im neden çatladı?',
          a: 'Üç olası sebep: krem peynir soğuktu (topaklı), harç fazla çırpıldı (çok hava), veya soğuma çok hızlıydı. Oda sıcaklığında malzemeler ve fırın kapalı soğutma adımları çatlakların %90\'ını önler.',
        },
        ES: {
          q: '¿Por qué se agrietó mi tarta de queso?',
          a: 'Tres culpables habituales: el queso crema estaba frío (grumos), el relleno se batió en exceso (demasiado aire), o el enfriamiento fue muy rápido. Seguir los pasos de ingredientes a temperatura ambiente y enfriamiento con horno apagado elimina el 90% de las grietas.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'Can I freeze cheesecake?',
          a: 'Yes — wrap whole or sliced cheesecake tightly in cling film and freeze for up to 2 months. Thaw overnight in the fridge before serving. The texture survives surprisingly well.',
        },
        TR: {
          q: 'Cheesecake\'i dondurabilir miyim?',
          a: 'Evet — bütün veya dilim hâlinde streç filmle sıkıca sar ve 2 aya kadar dondur. Servisten önce buzdolabında bir gece çözdür. Doku şaşırtıcı derecede iyi korunur.',
        },
        ES: {
          q: '¿Puedo congelar la tarta de queso?',
          a: 'Sí — envuelve la tarta entera o en porciones bien con film transparente y congela hasta 2 meses. Descongela toda la noche en el refrigerador antes de servir. La textura se conserva sorprendentemente bien.',
        },
      },
    },
  ],

  nutrition: {
    calories: 420,
    proteinG: 8,
    proteinDailyPct: 16,
    carbsG: 30,
    carbsDailyPct: 11,
    fatG: 30,
    fatDailyPct: 38,
    fiberG: 1,
    fiberDailyPct: 4,
    sugarG: 22,
    sodiumMg: 280,
    sodiumDailyPct: 12,
  },

  categorySlugs: ['desserts'],
  tagSlugs: ['make-ahead', 'comfort-food', 'summer'],
  dietSlugs: ['vegetarian'],
  allergens: [
    { slug: 'gluten', presence: 'CONTAINS' },
    { slug: 'milk', presence: 'CONTAINS' },
    { slug: 'eggs', presence: 'CONTAINS' },
    { slug: 'tree-nuts', presence: 'MAY_CONTAIN' },
    { slug: 'soybeans', presence: 'MAY_CONTAIN' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
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
      cloudinaryId: 'tcd/seed/lemon-cheesecake/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Slice of lemon cheesecake on white plate, fork breaking into the dense pale interior, lemon zest scattered' },
        TR: { alt: 'Beyaz tabakta limonlu cheesecake dilimi, çatal yoğun açık renkli iç kısma giriyor, limon kabuğu serpilmiş' },
        ES: { alt: 'Porción de tarta de queso al limón en plato blanco, tenedor rompiendo el interior denso y pálido, ralladura de limón esparcida' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/lemon-cheesecake/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Whole lemon cheesecake on a marble cake stand, top dusted with lemon zest, three lemons beside' },
        TR: { alt: 'Mermer pasta tabakası üzerinde bütün limonlu cheesecake, üstüne limon kabuğu serpilmiş, yanında üç limon' },
        ES: { alt: 'Tarta de queso al limón entera sobre soporte de mármol, superficie espolvoreada con ralladura de limón, tres limones al lado' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'The three-lemon ratio is the move. Tangy without being sour. Made it for a dinner party and got asked for the recipe twice.',
        TR: 'Üç limon oranı tam yerinde. Mayhoş ama ekşi değil. Yemek için yaptım, tarifi iki kez sordular.',
        ES: 'La proporción de tres limones es la clave. Ácida sin ser agria. La hice para una cena y me pidieron la receta dos veces.',
      },
    },
    {
      rating: 5,
      authorLocale: 'ES',
      body: {
        EN: 'No cracks for the first time ever. The oven-off cooldown trick works. Worth the overnight wait.',
        TR: 'İlk kez hiç çatlamadı. Fırın kapalı soğutma püf noktası işe yarıyor. Gece bekleyişe değer.',
        ES: 'Sin grietas por primera vez en mi vida. El truco del enfriado con el horno apagado funciona. Vale la pena la espera nocturna.',
      },
    },
    {
      rating: 4,
      authorLocale: 'TR',
      body: {
        EN: 'Loved it. The base could have been a touch thicker for my taste — next time I\'ll use 250 g of biscuits.',
        TR: 'Çok beğendim. Tabanı benim için biraz daha kalın olabilirdi — bir dahaki sefere 250 g bisküvi kullanacağım.',
        ES: 'Me encantó. La base podría haber sido un poco más gruesa para mi gusto — la próxima vez usaré 250 g de galletas.',
      },
    },
  ],
}
