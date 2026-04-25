import type { RecipeSeed } from '../../types'

export const redLentilSoup: RecipeSeed = {
  seedId: 'recipe_red-lentil-soup_seed',
  cuisineSlug: 'turkish',
  authorSlug: 'ferzender',
  skill: 'BEGINNER',
  servings: 6,
  prepMinutes: 10,
  cookMinutes: 25,
  totalMinutes: 35,
  heroImageCloudinary: 'tcd/seed/red-lentil-soup/hero',
  heroBlurhash: null,
  costPerServingCents: 800,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'red-lentil-soup',
      title: 'Red Lentil Soup',
      tagline: 'The bowl that built every Turkish kitchen',
      description:
        'Velvety red lentils simmered with onion, carrot, tomato paste, and a whisper of cumin, finished with lemon and dried mint. One pot, six servings, thirty-five minutes.',
      story:
        'In Turkey it is simply called mercimek çorbası — the lentil soup — and it appears on tables from breakfast counters to wedding banquets. The brilliance is in restraint: five pantry staples, gently cooked, then blended until silken. A bright squeeze of lemon at the table is non-negotiable. We tested this version a dozen times to land on the ratio that tastes like home, no matter where home is.',
      seoTitle: 'Red Lentil Soup — Classic Turkish Mercimek Çorbası',
      seoDescription:
        'Velvety Turkish red lentil soup in 35 minutes. One pot, six servings, no allergens — the recipe that warms every kitchen.',
    },
    TR: {
      slug: 'mercimek-corbasi',
      title: 'Mercimek Çorbası',
      tagline: 'Her Türk mutfağının kalbindeki çorba',
      description:
        'Soğan, havuç, salça ve bir tutam kimyon ile pişirilmiş kadifemsi kırmızı mercimek; limon ve nane ile servis edilir. Tek tencere, altı kişilik, otuz beş dakika.',
      story:
        'Mercimek çorbası, Türk sofrasının en sade ama en tartışmasız kahramanıdır. Kahvaltı tezgâhından düğün masasına kadar her yerde aynı sıcaklıkla karşılar. Sırrı sadeliğindedir: beş kiler malzemesi, sabırla pişirilir ve ipeksi olana kadar blendırdan geçirilir. Sofrada bir dilim limon şart. Bu tarifi, evden uzakta bile evi hatırlatan oranı bulmak için defalarca pişirdik.',
      seoTitle: 'Mercimek Çorbası — Klasik Türk Tarifi',
      seoDescription:
        'Kadifemsi mercimek çorbası 35 dakikada. Tek tencere, altı kişilik, alerjen içermez — her mutfağı ısıtan tarif.',
    },
    ES: {
      slug: 'sopa-lentejas-rojas',
      title: 'Sopa de Lentejas Rojas',
      tagline: 'El cuenco que sostiene cada cocina turca',
      description:
        'Lentejas rojas aterciopeladas cocinadas a fuego lento con cebolla, zanahoria, concentrado de tomate y un toque de comino, terminadas con limón y menta seca. Una olla, seis raciones, treinta y cinco minutos.',
      story:
        'En Turquía se llama simplemente mercimek çorbası — la sopa de lentejas — y aparece en mesas desde las barras de desayuno hasta los banquetes de boda. Su brillo está en la moderación: cinco ingredientes de despensa, cocinados suavemente, luego batidos hasta quedar sedosos. Un buen apretón de limón en la mesa es imprescindible. Probamos esta versión una docena de veces para acertar con la proporción que sabe a casa.',
      seoTitle: 'Sopa de Lentejas Rojas — Mercimek Çorbası Turca',
      seoDescription:
        'Sopa turca de lentejas rojas aterciopelada en 35 minutos. Una olla, seis raciones, sin alérgenos — la receta que reconforta cada cocina.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'Soup base' },
        TR: { label: 'Çorba tabanı' },
        ES: { label: 'Base de la sopa' },
      },
      items: [
        {
          ref: 'lentils',
          position: 0,
          metric: { quantity: 250, unit: 'G' },
          us: { quantity: 1.25, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Red lentils', prep: 'rinsed', substitutes: ['yellow lentils'] },
            TR: { name: 'Kırmızı mercimek', prep: 'yıkanmış', substitutes: ['sarı mercimek'] },
            ES: { name: 'Lentejas rojas', prep: 'enjuagadas', substitutes: ['lentejas amarillas'] },
          },
        },
        {
          ref: 'onion',
          position: 1,
          metric: { quantity: 1, unit: 'PIECE' },
          us: { quantity: 1, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Yellow onion', prep: 'finely diced', substitutes: [] },
            TR: { name: 'Sarı soğan', prep: 'küçük doğranmış', substitutes: [] },
            ES: { name: 'Cebolla amarilla', prep: 'cortada en cubos pequeños', substitutes: [] },
          },
        },
        {
          ref: 'carrot',
          position: 2,
          metric: { quantity: 1, unit: 'PIECE' },
          us: { quantity: 1, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Carrot', prep: 'peeled and grated', substitutes: [] },
            TR: { name: 'Havuç', prep: 'soyulmuş ve rendelenmiş', substitutes: [] },
            ES: { name: 'Zanahoria', prep: 'pelada y rallada', substitutes: [] },
          },
        },
        {
          ref: 'tomato-paste',
          position: 3,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Tomato paste', prep: null, substitutes: ['red pepper paste'] },
            TR: { name: 'Domates salçası', prep: null, substitutes: ['biber salçası'] },
            ES: { name: 'Concentrado de tomate', prep: null, substitutes: ['pasta de pimiento rojo'] },
          },
        },
        {
          ref: 'cumin',
          position: 4,
          metric: { quantity: 5, unit: 'ML' },
          us: { quantity: 1, unit: 'TSP' },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Ground cumin', prep: null, substitutes: [] },
            TR: { name: 'Toz kimyon', prep: null, substitutes: [] },
            ES: { name: 'Comino molido', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'olive-oil',
          position: 5,
          metric: { quantity: 30, unit: 'ML' },
          us: { quantity: 2, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Olive oil', prep: null, substitutes: ['neutral oil'] },
            TR: { name: 'Zeytinyağı', prep: null, substitutes: ['ayçiçek yağı'] },
            ES: { name: 'Aceite de oliva', prep: null, substitutes: ['aceite neutro'] },
          },
        },
        {
          ref: 'water',
          position: 6,
          metric: { quantity: 1500, unit: 'ML' },
          us: { quantity: 6.25, unit: 'CUP' },
          optional: false,
          aisle: 'OTHER',
          translations: {
            EN: { name: 'Water or vegetable broth', prep: null, substitutes: [] },
            TR: { name: 'Su veya sebze suyu', prep: null, substitutes: [] },
            ES: { name: 'Agua o caldo de verduras', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'salt',
          position: 7,
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
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'To finish' },
        TR: { label: 'Servis için' },
        ES: { label: 'Para terminar' },
      },
      items: [
        {
          ref: 'butter',
          position: 0,
          metric: { quantity: 30, unit: 'G' },
          us: { quantity: 2, unit: 'TBSP' },
          optional: true,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Butter (vegan butter for vegan)', prep: null, substitutes: ['olive oil'] },
            TR: { name: 'Tereyağı (vegan için vegan tereyağı)', prep: null, substitutes: ['zeytinyağı'] },
            ES: { name: 'Mantequilla (mantequilla vegana para versión vegana)', prep: null, substitutes: ['aceite de oliva'] },
          },
        },
        {
          ref: 'dried-mint',
          position: 1,
          metric: { quantity: 5, unit: 'ML' },
          us: { quantity: 1, unit: 'TSP' },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Dried mint', prep: null, substitutes: ['fresh mint'] },
            TR: { name: 'Kuru nane', prep: null, substitutes: ['taze nane'] },
            ES: { name: 'Menta seca', prep: null, substitutes: ['menta fresca'] },
          },
        },
        {
          ref: 'aleppo-pepper',
          position: 2,
          metric: { quantity: 2, unit: 'ML' },
          us: { quantity: 0.5, unit: 'TSP' },
          optional: true,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Aleppo pepper', prep: null, substitutes: ['paprika'] },
            TR: { name: 'Pul biber', prep: null, substitutes: ['kırmızı toz biber'] },
            ES: { name: 'Pimiento de Alepo', prep: null, substitutes: ['pimentón'] },
          },
        },
        {
          ref: 'lemon',
          position: 3,
          metric: { quantity: 1, unit: 'PIECE' },
          us: { quantity: 1, unit: 'PIECE' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Lemon', prep: 'cut into wedges', substitutes: [] },
            TR: { name: 'Limon', prep: 'dilimlere bölünmüş', substitutes: [] },
            ES: { name: 'Limón', prep: 'cortado en gajos', substitutes: [] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: 480,
      ingredientRefs: ['onion', 'carrot', 'olive-oil'],
      translations: {
        EN: {
          title: 'Soften aromatics',
          body: 'Warm the olive oil in a heavy saucepan over medium heat. Add the onion and a pinch of salt; cook until translucent, about 6–8 minutes. Stir in the grated carrot and cook for 2 more minutes until the pan smells sweet.',
          note: 'Don\'t rush this step — the onion needs to lose its bite for the soup to taste round.',
          timerLabel: '8 min — softening',
        },
        TR: {
          title: 'Sebzeleri yumuşat',
          body: 'Kalın bir tencerede zeytinyağını orta ateşte ısıt. Soğan ve bir tutam tuzu ekle; yaklaşık 6–8 dakika, şeffaflaşana kadar pişir. Rendelenmiş havucu ekleyip 2 dakika daha, tatlı bir koku gelene kadar pişir.',
          note: 'Bu adımı acele etme — soğanın keskinliği gitmeli ki çorbanın tadı yuvarlak olsun.',
          timerLabel: '8 dk — yumuşatma',
        },
        ES: {
          title: 'Ablandar los aromáticos',
          body: 'Calienta el aceite de oliva en una cacerola gruesa a fuego medio. Añade la cebolla y una pizca de sal; cocina hasta que esté translúcida, unos 6–8 minutos. Incorpora la zanahoria rallada y cocina 2 minutos más hasta que la cocina huela dulce.',
          note: 'No apresures este paso — la cebolla debe perder su mordiente para que la sopa tenga un sabor redondo.',
          timerLabel: '8 min — ablandar',
        },
      },
    },
    {
      index: 1,
      timerSeconds: 120,
      ingredientRefs: ['tomato-paste', 'cumin'],
      translations: {
        EN: {
          title: 'Bloom the spices',
          body: 'Push the vegetables to the side. Add the tomato paste and cumin to the cleared spot and let them sizzle for 30 seconds, then stir into the vegetables. The paste should turn brick red and smell roasted, not raw.',
          note: null,
          timerLabel: '2 min — bloom',
        },
        TR: {
          title: 'Baharatları kavur',
          body: 'Sebzeleri yana it. Açılan boş yere salça ve kimyonu ekle, 30 saniye cızırdamasına izin ver, sonra sebzelerle karıştır. Salça çiğ değil, kavrulmuş kokmalı ve tuğla kırmızısı olmalı.',
          note: null,
          timerLabel: '2 dk — kavurma',
        },
        ES: {
          title: 'Tostar las especias',
          body: 'Aparta las verduras a un lado. Añade el concentrado de tomate y el comino al espacio libre y deja que chisporroteen durante 30 segundos, luego mézclalos con las verduras. El concentrado debe tornarse rojo ladrillo y oler a tostado, no a crudo.',
          note: null,
          timerLabel: '2 min — tostar',
        },
      },
    },
    {
      index: 2,
      timerSeconds: 1200,
      ingredientRefs: ['lentils', 'water', 'salt'],
      translations: {
        EN: {
          title: 'Simmer the soup',
          body: 'Add the rinsed lentils and water (or broth). Bring to a boil, then reduce to a gentle simmer. Cook uncovered for 18–20 minutes, until the lentils have completely broken down. Season with salt to taste.',
          note: 'Skim off any foam that rises in the first 5 minutes.',
          timerLabel: '20 min — simmer',
        },
        TR: {
          title: 'Çorbayı pişir',
          body: 'Yıkanmış mercimekleri ve suyu (veya sebze suyunu) ekle. Önce kaynat, sonra ateşi kıs. Kapağı açık 18–20 dakika, mercimekler tamamen dağılana kadar pişir. Tuzla tatlandır.',
          note: 'İlk 5 dakikada yüzeye çıkan köpüğü kaşıkla al.',
          timerLabel: '20 dk — pişirme',
        },
        ES: {
          title: 'Cocer la sopa',
          body: 'Añade las lentejas enjuagadas y el agua (o caldo). Lleva a ebullición, luego reduce a fuego lento. Cocina destapado 18–20 minutos, hasta que las lentejas se hayan deshecho por completo. Sazona con sal al gusto.',
          note: 'Retira con una espumadera la espuma que suba en los primeros 5 minutos.',
          timerLabel: '20 min — cocer',
        },
      },
    },
    {
      index: 3,
      timerSeconds: null,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Blend until silken',
          body: 'Use an immersion blender directly in the pot until the soup is completely smooth, about 1 minute. If using a stand blender, work in batches and crack the lid to vent steam.',
          note: 'For an even silkier texture, pass the soup through a fine sieve.',
          timerLabel: null,
        },
        TR: {
          title: 'İpeksi kıvama getir',
          body: 'Doğrudan tencerede el blendırı kullanarak çorba tamamen pürüzsüz olana kadar (yaklaşık 1 dk) blendır. Sabit blendır kullanıyorsan partiler hâlinde çalış ve buharı bırakmak için kapağı aralık tut.',
          note: 'Daha da pürüzsüz bir doku için ince bir süzgeçten geçirebilirsin.',
          timerLabel: null,
        },
        ES: {
          title: 'Triturar hasta sedoso',
          body: 'Usa una batidora de inmersión directamente en la olla hasta que la sopa esté completamente lisa, alrededor de 1 minuto. Si usas batidora de vaso, trabaja por tandas y deja la tapa entreabierta para liberar el vapor.',
          note: 'Para una textura aún más sedosa, pasa la sopa por un colador fino.',
          timerLabel: null,
        },
      },
    },
    {
      index: 4,
      timerSeconds: 60,
      ingredientRefs: ['butter', 'dried-mint', 'aleppo-pepper', 'lemon'],
      translations: {
        EN: {
          title: 'Make the mint butter',
          body: 'In a small skillet, melt the butter over low heat. Stir in the dried mint and Aleppo pepper, and remove from heat the moment they sizzle. Drizzle over each bowl. Serve with a wedge of lemon.',
          note: 'For a vegan version, use vegan butter or warmed olive oil.',
          timerLabel: '1 min — finish',
        },
        TR: {
          title: 'Naneli yağı hazırla',
          body: 'Küçük bir tavada tereyağını kısık ateşte erit. Kuru nane ve pul biberi ekle, cızırdar cızırdamaz ateşten al. Her kâsenin üzerine gezdir. Limon dilimi ile servis et.',
          note: 'Vegan versiyon için vegan tereyağı veya ısıtılmış zeytinyağı kullan.',
          timerLabel: '1 dk — son rötuş',
        },
        ES: {
          title: 'Preparar la mantequilla a la menta',
          body: 'En una sartén pequeña, derrite la mantequilla a fuego lento. Incorpora la menta seca y el pimiento de Alepo, y retira del fuego en el momento en que chisporroteen. Rocía sobre cada cuenco. Sirve con una rodaja de limón.',
          note: 'Para una versión vegana, usa mantequilla vegana o aceite de oliva calentado.',
          timerLabel: '1 min — terminar',
        },
      },
    },
  ],

  equipmentSlugs: ['saucepan', 'blender', 'stovetop'],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Spicy ezogelin variation',
          body: 'Add 30 g of bulgur and 50 g of rice with the lentils, plus 1 tsp of dried mint and 1 tsp of red pepper paste. The result is a thicker, more substantial soup popular in central Anatolia. (Note: bulgur adds gluten — no longer gluten-free.)',
        },
        TR: {
          title: 'Acılı ezogelin varyasyonu',
          body: 'Mercimekle birlikte 30 g bulgur ve 50 g pirinç, ek olarak 1 tatlı kaşığı kuru nane ve 1 tatlı kaşığı biber salçası ekle. Sonuç: İç Anadolu\'da sevilen daha koyu kıvamlı bir çorba. (Not: bulgur gluten içerir — artık glutensiz değildir.)',
        },
        ES: {
          title: 'Variación picante ezogelin',
          body: 'Añade 30 g de bulgur y 50 g de arroz junto con las lentejas, además de 1 cdta de menta seca y 1 cdta de pasta de pimiento rojo. El resultado es una sopa más espesa y sustanciosa, popular en Anatolia central. (Nota: el bulgur añade gluten — ya no es sin gluten.)',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'Can I freeze this soup?',
          a: 'Yes — freeze in airtight containers for up to 3 months. Thaw overnight in the fridge and reheat over low heat, adding a splash of water if it has thickened. Add the mint butter fresh when serving.',
        },
        TR: {
          q: 'Bu çorbayı dondurabilir miyim?',
          a: 'Evet — hava almayan kaplarda 3 aya kadar dondurulabilir. Buzdolabında bir gece çözdür, kısık ateşte ısıt; koyulaşmışsa biraz su ekle. Naneli yağı servis sırasında taze hazırla.',
        },
        ES: {
          q: '¿Puedo congelar esta sopa?',
          a: 'Sí — congélala en recipientes herméticos hasta 3 meses. Descongela una noche en el refrigerador y recalienta a fuego bajo, añadiendo un chorrito de agua si se ha espesado. Prepara la mantequilla a la menta fresca al servir.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'My soup turned out grainy. What went wrong?',
          a: 'The lentils probably needed a few more minutes — they should completely lose their shape before blending. Simmer a further 5 minutes and reblend. A fine sieve also rescues a stubborn batch.',
        },
        TR: {
          q: 'Çorbam grenli çıktı. Ne oldu?',
          a: 'Mercimeklerin biraz daha pişmesi gerekiyordu — blendırdan önce şekillerini tamamen kaybetmeliler. 5 dakika daha pişirip tekrar blendırla. İnce bir süzgeç de inatçı bir partiyi kurtarır.',
        },
        ES: {
          q: 'Mi sopa quedó arenosa. ¿Qué pasó?',
          a: 'Las lentejas probablemente necesitaban unos minutos más — deben perder su forma por completo antes de triturar. Cocina 5 minutos más y vuelve a batir. Un colador fino también rescata una tanda difícil.',
        },
      },
    },
    {
      position: 2,
      translations: {
        EN: {
          q: 'Is this recipe really gluten-free?',
          a: 'Yes — the base recipe contains no gluten. If you make the ezogelin variation with bulgur, it becomes a wheat-containing dish. Always check your tomato paste and broth labels if you are highly sensitive.',
        },
        TR: {
          q: 'Bu tarif gerçekten glutensiz mi?',
          a: 'Evet — temel tarif gluten içermez. Bulgurlu ezogelin varyasyonunu yaparsan buğday içeren bir yemeğe dönüşür. Yüksek duyarlılığın varsa salça ve sebze suyu etiketlerini her zaman kontrol et.',
        },
        ES: {
          q: '¿Esta receta es realmente sin gluten?',
          a: 'Sí — la receta base no contiene gluten. Si haces la variación ezogelin con bulgur, se convierte en un plato con trigo. Revisa siempre las etiquetas del concentrado de tomate y del caldo si tienes alta sensibilidad.',
        },
      },
    },
  ],

  nutrition: {
    calories: 220,
    proteinG: 12,
    proteinDailyPct: 24,
    carbsG: 30,
    carbsDailyPct: 11,
    fatG: 7,
    fatDailyPct: 9,
    fiberG: 8,
    fiberDailyPct: 29,
    sugarG: 4,
    sodiumMg: 380,
    sodiumDailyPct: 17,
  },

  categorySlugs: ['soups'],
  tagSlugs: ['comfort-food', 'healthy', 'winter', 'make-ahead'],
  dietSlugs: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'halal'],
  allergens: [
    { slug: 'gluten', presence: 'FREE' },
    { slug: 'milk', presence: 'FREE' },
    { slug: 'eggs', presence: 'FREE' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'tree-nuts', presence: 'FREE' },
    { slug: 'peanuts', presence: 'FREE' },
    { slug: 'soybeans', presence: 'FREE' },
    { slug: 'sesame', presence: 'FREE' },
    { slug: 'celery', presence: 'MAY_CONTAIN' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'FREE' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/red-lentil-soup/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Bowl of velvety red lentil soup with mint butter swirl and lemon wedge on a cream linen' },
        TR: { alt: 'Naneli yağ ile süslenmiş kadifemsi mercimek çorbası ve limon dilimi, krem keten zemin üzerinde' },
        ES: { alt: 'Cuenco de sopa aterciopelada de lentejas rojas con remolino de mantequilla a la menta y rodaja de limón sobre lino crema' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/red-lentil-soup/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Overhead of a cast-iron pot with golden lentil soup mid-simmer, scattered with fresh mint' },
        TR: { alt: 'Pişme aşamasında altın renkli mercimek çorbası bulunan döküm tencereye tepeden bakış, taze nane serpiştirilmiş' },
        ES: { alt: 'Vista cenital de una olla de hierro fundido con sopa dorada de lentejas a fuego lento, esparcida con menta fresca' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'TR',
      body: {
        EN: 'Tastes exactly like my grandmother\'s — the mint butter at the end is the secret. Made it twice this week.',
        TR: 'Tıpkı anneannemin yaptığı gibi — sondaki naneli yağ tüm sırrı. Bu hafta iki kez yaptım.',
        ES: 'Sabe exactamente como la de mi abuela — la mantequilla a la menta del final es el secreto. La he hecho dos veces esta semana.',
      },
    },
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'The simmer-then-blend technique is everything. Silky, warming, and we ate the entire pot in one sitting.',
        TR: 'Önce kaynat, sonra blendırla tekniği harika. İpeksi, ısıtıcı, tüm tencereyi tek seferde bitirdik.',
        ES: 'La técnica de cocer a fuego lento y luego triturar lo es todo. Sedosa, reconfortante, y nos comimos toda la olla de una sentada.',
      },
    },
    {
      rating: 4,
      authorLocale: 'ES',
      body: {
        EN: 'Hearty and clean. I added a splash more lemon than the recipe suggests — recommend tasting at the table.',
        TR: 'Doyurucu ve sade. Tarifte söylenenden biraz daha fazla limon ekledim — sofrada tatmanı öneririm.',
        ES: 'Sustanciosa y limpia. Añadí un chorrito más de limón del que sugiere la receta — recomiendo probar en la mesa.',
      },
    },
  ],
}
