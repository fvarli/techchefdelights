import type { RecipeSeed } from '../../types'

export const avocadoToast: RecipeSeed = {
  seedId: 'recipe_avocado-toast_seed',
  cuisineSlug: 'american',
  authorSlug: 'ferzender',
  skill: 'BEGINNER',
  servings: 2,
  prepMinutes: 5,
  cookMinutes: 7,
  totalMinutes: 12,
  heroImageCloudinary: 'tcd/seed/avocado-toast/hero',
  heroBlurhash: null,
  costPerServingCents: 2500,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'avocado-toast',
      title: 'Avocado Toast with Poached Egg',
      tagline: 'The breakfast that earned its hype',
      description:
        'Crisp sourdough piled with smashed avocado, a perfect poached egg, lemon, chili flakes, and flaky salt. Twelve minutes from fridge to plate.',
      story:
        'Avocado toast became a meme — but the version we make at home, with proper bread and a properly poached egg, is genuinely worth the fuss. The trick is treating each component seriously: a deeply toasted slice with crackle, a ripe avocado smashed not pureed, and an egg with a yolk that erupts on contact with the bread.',
      seoTitle: 'Avocado Toast with Poached Egg — 12-Minute Breakfast',
      seoDescription:
        'Crisp sourdough, smashed avocado, perfectly poached egg, lemon, chili. The avocado toast that\'s actually worth making at home.',
    },
    TR: {
      slug: 'avokadolu-tost',
      title: 'Avokadolu Tost ve Poşe Yumurta',
      tagline: 'Hak ettiği ilgiyi gören kahvaltı',
      description:
        'Çıtır ekşi mayalı ekmek üzerinde ezilmiş avokado, mükemmel poşe yumurta, limon, pul biber ve iri taneli tuz. Buzdolabından tabağa on iki dakika.',
      story:
        'Avokadolu tost bir mizah konusuna dönüştü — ama evde, doğru ekmek ve doğru poşelenmiş yumurta ile yapılan versiyonu gerçekten değer. Sırrı her bileşeni ciddiye almakta: iyice kızarmış çıtır bir dilim, püre yapılmamış sadece ezilmiş bir avokado ve ekmeğe değer değmez patlayan bir yumurta sarısı.',
      seoTitle: 'Avokadolu Tost ve Poşe Yumurta — 12 Dakikalık Kahvaltı',
      seoDescription:
        'Çıtır ekşi mayalı ekmek, ezilmiş avokado, mükemmel poşe yumurta, limon, pul biber. Evde gerçekten yapmaya değen avokadolu tost.',
    },
    ES: {
      slug: 'tostada-aguacate',
      title: 'Tostada de Aguacate con Huevo Pochado',
      tagline: 'El desayuno que se ganó su fama',
      description:
        'Pan de masa madre crujiente cubierto con aguacate machacado, un huevo pochado perfecto, limón, hojuelas de chile y sal en escamas. Doce minutos del refrigerador al plato.',
      story:
        'La tostada de aguacate se volvió un meme — pero la versión que hacemos en casa, con pan de calidad y un huevo bien pochado, vale realmente la pena. El truco es tratar cada componente con seriedad: una rebanada profundamente tostada que crujа, un aguacate maduro machacado pero no triturado, y un huevo con una yema que erupciona al contacto con el pan.',
      seoTitle: 'Tostada de Aguacate con Huevo Pochado — Desayuno en 12 Min',
      seoDescription:
        'Pan de masa madre crujiente, aguacate machacado, huevo pochado perfecto, limón, chile. La tostada de aguacate que vale la pena hacer en casa.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'For the toast' },
        TR: { label: 'Tost için' },
        ES: { label: 'Para la tostada' },
      },
      items: [
        {
          ref: 'sourdough',
          position: 0,
          metric: { quantity: 2, unit: 'PIECE' },
          us: { quantity: 2, unit: 'PIECE' },
          optional: false,
          aisle: 'BAKERY',
          translations: {
            EN: { name: 'Sourdough bread, thick slices', prep: null, substitutes: ['rye bread', 'country loaf'] },
            TR: { name: 'Ekşi mayalı ekmek, kalın dilim', prep: null, substitutes: ['çavdar ekmeği', 'köy ekmeği'] },
            ES: { name: 'Pan de masa madre, rebanadas gruesas', prep: null, substitutes: ['pan de centeno', 'hogaza rústica'] },
          },
        },
        {
          ref: 'avocado',
          position: 1,
          metric: { quantity: 1, unit: 'PIECE' },
          us: { quantity: 1, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Ripe avocado', prep: 'pitted and peeled', substitutes: [] },
            TR: { name: 'Olgun avokado', prep: 'çekirdeği ve kabuğu çıkarılmış', substitutes: [] },
            ES: { name: 'Aguacate maduro', prep: 'sin hueso y pelado', substitutes: [] },
          },
        },
        {
          ref: 'lemon-juice',
          position: 2,
          metric: { quantity: 5, unit: 'ML' },
          us: { quantity: 1, unit: 'TSP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Lemon juice', prep: null, substitutes: ['lime juice'] },
            TR: { name: 'Limon suyu', prep: null, substitutes: ['misket limonu suyu'] },
            ES: { name: 'Zumo de limón', prep: null, substitutes: ['zumo de lima'] },
          },
        },
        {
          ref: 'olive-oil',
          position: 3,
          metric: { quantity: 10, unit: 'ML' },
          us: { quantity: 2, unit: 'TSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Extra virgin olive oil', prep: null, substitutes: [] },
            TR: { name: 'Sızma zeytinyağı', prep: null, substitutes: [] },
            ES: { name: 'Aceite de oliva virgen extra', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'For the eggs' },
        TR: { label: 'Yumurtalar için' },
        ES: { label: 'Para los huevos' },
      },
      items: [
        {
          ref: 'eggs',
          position: 0,
          metric: { quantity: 2, unit: 'PIECE' },
          us: { quantity: 2, unit: 'PIECE' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Fresh large eggs', prep: null, substitutes: [] },
            TR: { name: 'Taze büyük yumurta', prep: null, substitutes: [] },
            ES: { name: 'Huevos grandes frescos', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'vinegar',
          position: 1,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'White vinegar', prep: null, substitutes: ['apple cider vinegar'] },
            TR: { name: 'Beyaz sirke', prep: null, substitutes: ['elma sirkesi'] },
            ES: { name: 'Vinagre blanco', prep: null, substitutes: ['vinagre de manzana'] },
          },
        },
      ],
    },
    {
      position: 2,
      translations: {
        EN: { label: 'To finish' },
        TR: { label: 'Servis için' },
        ES: { label: 'Para terminar' },
      },
      items: [
        {
          ref: 'flaky-salt',
          position: 0,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Flaky sea salt', prep: 'to taste', substitutes: ['kosher salt'] },
            TR: { name: 'İri taneli deniz tuzu', prep: 'damak tadına göre', substitutes: ['kosher tuz'] },
            ES: { name: 'Sal en escamas', prep: 'al gusto', substitutes: ['sal kosher'] },
          },
        },
        {
          ref: 'chili-flakes',
          position: 1,
          metric: { quantity: 2, unit: 'ML' },
          us: { quantity: 0.5, unit: 'TSP' },
          optional: true,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Red chili flakes', prep: null, substitutes: ['Aleppo pepper'] },
            TR: { name: 'Pul biber', prep: null, substitutes: ['kırmızı toz biber'] },
            ES: { name: 'Hojuelas de chile rojo', prep: null, substitutes: ['pimiento de Alepo'] },
          },
        },
        {
          ref: 'pepper',
          position: 2,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Freshly ground black pepper', prep: 'to taste', substitutes: [] },
            TR: { name: 'Taze çekilmiş karabiber', prep: 'damak tadına göre', substitutes: [] },
            ES: { name: 'Pimienta negra recién molida', prep: 'al gusto', substitutes: [] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: null,
      ingredientRefs: ['eggs', 'vinegar'],
      translations: {
        EN: {
          title: 'Set up the poach',
          body: 'Bring a wide saucepan of water to a gentle simmer (the surface should shimmer, not boil). Add the vinegar. Crack each egg into a small ramekin so you can slide them in carefully later.',
          note: 'Use the freshest eggs you can — fresh whites cling tightly to the yolk and poach into a tidy shape.',
          timerLabel: null,
        },
        TR: {
          title: 'Poşe için hazırlık',
          body: 'Geniş bir tencerede suyu hafifçe kaynamaya getir (yüzey titremeli, fokurdamamalı). Sirkeyi ekle. Her bir yumurtayı küçük bir kâseye kır ki sonradan dikkatlice tencereye kaydırabilesin.',
          note: 'En taze yumurtaları kullan — taze beyaz, sarıya sıkıca tutunur ve düzgün bir şekil alır.',
          timerLabel: null,
        },
        ES: {
          title: 'Preparar el pochado',
          body: 'Pon una cacerola ancha de agua a fuego lento (la superficie debe temblar, no hervir). Añade el vinagre. Casca cada huevo en un cuenco pequeño para poder deslizarlos con cuidado después.',
          note: 'Usa los huevos más frescos posibles — las claras frescas se adhieren a la yema y pochan en una forma limpia.',
          timerLabel: null,
        },
      },
    },
    {
      index: 1,
      timerSeconds: 240,
      ingredientRefs: ['sourdough', 'olive-oil'],
      translations: {
        EN: {
          title: 'Toast the bread',
          body: 'Toast the sourdough until deeply golden — almost dark — at the edges. Drizzle each slice with a little olive oil while still warm.',
          note: null,
          timerLabel: '4 min — toast',
        },
        TR: {
          title: 'Ekmeği kızart',
          body: 'Ekşi mayalı ekmeği kenarları derin altın renge — neredeyse koyuya — ulaşana kadar kızart. Hâlâ sıcakken her dilime biraz zeytinyağı gezdir.',
          note: null,
          timerLabel: '4 dk — kızartma',
        },
        ES: {
          title: 'Tuesta el pan',
          body: 'Tuesta el pan de masa madre hasta que esté dorado profundo — casi oscuro — en los bordes. Rocía un poco de aceite de oliva sobre cada rebanada mientras aún esté caliente.',
          note: null,
          timerLabel: '4 min — tostar',
        },
      },
    },
    {
      index: 2,
      timerSeconds: null,
      ingredientRefs: ['avocado', 'lemon-juice'],
      translations: {
        EN: {
          title: 'Smash the avocado',
          body: 'Scoop the avocado into a bowl. Add the lemon juice and a pinch of salt. Smash with a fork — leave it chunky, not pureed. Pile generously on each toast.',
          note: 'A few visible chunks of avocado make the toast feel more honest than a smooth spread.',
          timerLabel: null,
        },
        TR: {
          title: 'Avokadoyu ez',
          body: 'Avokadoyu bir kâseye al. Limon suyu ve bir tutam tuz ekle. Çatalla ez — püreleştirme, parça parça kalsın. Her tostun üzerine cömertçe yığ.',
          note: 'Birkaç görünür parça avokado, pürüzsüz bir sürmeye göre tosta daha doğal bir his verir.',
          timerLabel: null,
        },
        ES: {
          title: 'Machaca el aguacate',
          body: 'Saca la pulpa del aguacate a un cuenco. Añade el zumo de limón y una pizca de sal. Machaca con un tenedor — déjalo con trozos, no triturado. Apila generosamente sobre cada tostada.',
          note: 'Unos trozos visibles de aguacate hacen que la tostada se sienta más honesta que una pasta lisa.',
          timerLabel: null,
        },
      },
    },
    {
      index: 3,
      timerSeconds: 180,
      ingredientRefs: ['eggs'],
      translations: {
        EN: {
          title: 'Poach the eggs',
          body: 'Stir the simmering water into a gentle whirlpool. Slip the first egg from its ramekin into the centre. Cook for 2 ½–3 minutes for a runny yolk. Lift out with a slotted spoon onto a paper towel. Repeat for the second egg.',
          note: 'Don\'t crowd the pan — poach one at a time for the cleanest shape.',
          timerLabel: '3 min — poach',
        },
        TR: {
          title: 'Yumurtaları poşle',
          body: 'Hafifçe kaynayan suyu nazik bir girdaba çevir. İlk yumurtayı kâsesinden ortaya kaydır. Akışkan sarı için 2,5–3 dakika pişir. Delikli kaşıkla çıkar, kâğıt havlu üzerine al. İkinci yumurta için tekrarla.',
          note: 'Tencereyi kalabalıklaştırma — en temiz şekil için tek tek poşle.',
          timerLabel: '3 dk — poşe',
        },
        ES: {
          title: 'Pocha los huevos',
          body: 'Remueve el agua a fuego lento formando un remolino suave. Desliza el primer huevo desde su cuenco al centro. Cocina 2½–3 minutos para una yema líquida. Saca con una espumadera sobre papel absorbente. Repite con el segundo huevo.',
          note: 'No abarrotes la sartén — pocha de uno en uno para la forma más limpia.',
          timerLabel: '3 min — pochar',
        },
      },
    },
    {
      index: 4,
      timerSeconds: null,
      ingredientRefs: ['flaky-salt', 'chili-flakes', 'pepper'],
      translations: {
        EN: {
          title: 'Plate and finish',
          body: 'Top each avocado toast with a poached egg. Crack on flaky salt, black pepper, and chili flakes. Eat immediately while the yolk is still warm.',
          note: null,
          timerLabel: null,
        },
        TR: {
          title: 'Tabağa al ve bitir',
          body: 'Her avokadolu tostun üzerine bir poşe yumurta yerleştir. İri taneli tuz, karabiber ve pul biber serp. Sarı hâlâ sıcakken hemen ye.',
          note: null,
          timerLabel: null,
        },
        ES: {
          title: 'Empla y termina',
          body: 'Coloca un huevo pochado encima de cada tostada de aguacate. Espolvorea con sal en escamas, pimienta negra y hojuelas de chile. Come inmediatamente mientras la yema esté aún caliente.',
          note: null,
          timerLabel: null,
        },
      },
    },
  ],

  equipmentSlugs: ['saucepan', 'stovetop'],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Smoked salmon variation',
          body: 'Top with 50 g of smoked salmon and a sprinkle of capers per toast before adding the egg. Pairs especially well with rye bread instead of sourdough.',
        },
        TR: {
          title: 'Füme somonlu varyasyon',
          body: 'Yumurtayı eklemeden önce her tosta 50 g füme somon ve birkaç kapari serp. Ekşi mayalı yerine çavdar ekmeği ile özellikle iyi gider.',
        },
        ES: {
          title: 'Variación con salmón ahumado',
          body: 'Cubre con 50 g de salmón ahumado y unas alcaparras por tostada antes de añadir el huevo. Combina especialmente bien con pan de centeno en lugar de masa madre.',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'How do I tell if an avocado is ripe?',
          a: 'It should yield gently to a press at the stem end without feeling mushy. If the stem nub flicks off easily and reveals green underneath, you\'re good. Brown means overripe.',
        },
        TR: {
          q: 'Avokadonun olgun olduğunu nasıl anlarım?',
          a: 'Sap kısmından bastırınca yumuşaklığı vermesi gerekir, ezilme hissi olmamalı. Sap çıkıntısı kolay kopuyor ve altında yeşil görünüyorsa hazır. Kahverengi olgunluğun aşıldığı anlamına gelir.',
        },
        ES: {
          q: '¿Cómo sé si un aguacate está maduro?',
          a: 'Debe ceder suavemente al presionar en el extremo del tallo sin sentirse blando. Si la pequeña protuberancia del tallo se desprende fácilmente y revela verde debajo, está perfecto. Marrón significa demasiado maduro.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'Can I make this dairy-free?',
          a: 'It already is — none of the listed ingredients contain dairy. The only "may contain" risk is if your sourdough or olive oil is processed in a facility with butter; check labels if you\'re strict.',
        },
        TR: {
          q: 'Sütsüz hâle getirebilir miyim?',
          a: 'Zaten sütsüz — listedeki hiçbir malzeme süt içermez. Tek "may contain" riski ekşi mayalı ekmeğinin veya zeytinyağının tereyağı bulunan bir tesiste işlenip işlenmediği; sıkıysan etiketleri kontrol et.',
        },
        ES: {
          q: '¿Puedo hacerlo sin lácteos?',
          a: 'Ya lo es — ninguno de los ingredientes listados contiene lácteos. El único riesgo de "puede contener" es si tu masa madre o aceite de oliva se procesa en una instalación con mantequilla; revisa las etiquetas si eres estricto.',
        },
      },
    },
  ],

  nutrition: {
    calories: 380,
    proteinG: 14,
    proteinDailyPct: 28,
    carbsG: 32,
    carbsDailyPct: 12,
    fatG: 22,
    fatDailyPct: 28,
    fiberG: 8,
    fiberDailyPct: 29,
    sugarG: 3,
    sodiumMg: 480,
    sodiumDailyPct: 21,
  },

  categorySlugs: ['breakfast'],
  tagSlugs: ['quick-easy', 'healthy'],
  dietSlugs: ['vegetarian'],
  allergens: [
    { slug: 'gluten', presence: 'CONTAINS' },
    { slug: 'eggs', presence: 'CONTAINS' },
    { slug: 'milk', presence: 'MAY_CONTAIN' },
    { slug: 'soybeans', presence: 'MAY_CONTAIN' },
    { slug: 'sesame', presence: 'MAY_CONTAIN' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'tree-nuts', presence: 'FREE' },
    { slug: 'peanuts', presence: 'FREE' },
    { slug: 'celery', presence: 'FREE' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'FREE' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/avocado-toast/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Two slices of dark sourdough with smashed green avocado, golden poached eggs, chili flakes and flaky salt' },
        TR: { alt: 'Ezilmiş yeşil avokado, altın renkli poşe yumurta, pul biber ve iri taneli tuzlu iki dilim koyu ekşi mayalı ekmek' },
        ES: { alt: 'Dos rebanadas de masa madre oscura con aguacate verde machacado, huevos pochados dorados, hojuelas de chile y sal en escamas' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/avocado-toast/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Close-up of a poached egg cracked open, yolk pouring across smashed avocado' },
        TR: { alt: 'Açılmış poşe yumurtaya yakın çekim, sarısı ezilmiş avokadonun üzerine akan' },
        ES: { alt: 'Primer plano de un huevo pochado abierto, la yema derramándose sobre el aguacate machacado' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'The whirlpool poach trick finally worked for me. Crispy edges on the toast plus runny yolk = exactly what I wanted.',
        TR: 'Girdap poşe tekniği sonunda işime yaradı. Çıtır tost kenarları artı akışkan sarı = tam istediğim.',
        ES: 'El truco del remolino para pochar por fin me funcionó. Bordes crujientes en la tostada más yema líquida = exactamente lo que quería.',
      },
    },
    {
      rating: 5,
      authorLocale: 'ES',
      body: {
        EN: 'Honestly thought avocado toast was overhyped until I made this version. The chunky avocado plus chili flakes is the move.',
        TR: 'Bu versiyonu yapana kadar avokadolu tostun fazla abartıldığını sanıyordum. Parça parça avokado artı pul biber tam zamanında.',
        ES: 'Honestamente pensé que la tostada de aguacate estaba sobrevalorada hasta que hice esta versión. Aguacate con trozos más hojuelas de chile es la clave.',
      },
    },
    {
      rating: 4,
      authorLocale: 'TR',
      body: {
        EN: 'Quick and clean. I used rye bread the second time and preferred it slightly more — the nuttiness pairs well with the avocado.',
        TR: 'Hızlı ve sade. İkinci sefer çavdar ekmeği kullandım, biraz daha çok sevdim — fındıksı tat avokadoyla iyi uyuştu.',
        ES: 'Rápido y limpio. Usé pan de centeno la segunda vez y me gustó un poco más — el sabor a frutos secos combina bien con el aguacate.',
      },
    },
  ],
}
