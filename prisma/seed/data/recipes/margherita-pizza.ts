import type { RecipeSeed } from '../../types'

export const margheritaPizza: RecipeSeed = {
  seedId: 'recipe_margherita-pizza_seed',
  cuisineSlug: 'italian',
  authorSlug: 'ferzender',
  skill: 'INTERMEDIATE',
  servings: 4,
  prepMinutes: 30,
  cookMinutes: 90,
  totalMinutes: 120,
  heroImageCloudinary: 'tcd/seed/margherita-pizza/hero',
  heroBlurhash: null,
  costPerServingCents: 2800,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'margherita-pizza',
      title: 'Homemade Margherita Pizza',
      tagline: 'Three colors, three ingredients, one screaming oven',
      description:
        'Cold-fermented dough, hand-crushed San Marzano tomato, torn fresh mozzarella, fragrant basil, finishing olive oil. Two hours start to finish; thirty real minutes of work.',
      story:
        'Pizza Margherita — three colors, three ingredients on a properly hot crust. Get the dough right and everything else falls into place: a long bulk ferment for flavor, a screaming oven for blistered char, San Marzano tomatoes hand-crushed, no shortcut sauces. We bake on steel for restaurant-style bottom; a stone or even an inverted heavy tray works in a pinch. The flag of Italy on a plate.',
      seoTitle: 'Homemade Margherita Pizza — Italian Classic Recipe',
      seoDescription:
        'Cold-fermented dough, San Marzano tomato, fresh mozzarella, basil. Authentic Margherita pizza for four in 2 hours.',
    },
    TR: {
      slug: 'margherita-pizza',
      title: 'Ev Yapımı Margherita Pizza',
      tagline: 'Üç renk, üç malzeme, kızgın bir fırın',
      description:
        'Uzun mayalı hamur, elle ezilmiş San Marzano domates, koparılmış taze mozzarella, kokulu fesleğen, son zeytinyağı. Baştan sona iki saat; gerçek iş otuz dakika.',
      story:
        'Margherita Pizza — doğru kızgınlıkta hamur üzerinde üç renk, üç malzeme. Hamuru doğru ayarla, gerisi kendiliğinden yerine oturur: tat için uzun fermentasyon, çıtır kabuk için yangın gibi fırın, elle ezilmiş San Marzano domatesleri, hiç kısayol sosu yok. Restoran tabanı için çelik üzerinde pişiriyoruz; taş ya da hatta ters çevrilmiş ağır bir tepsi de iş görür. Tabakta İtalyan bayrağı.',
      seoTitle: 'Ev Yapımı Margherita Pizza — Klasik İtalyan Tarifi',
      seoDescription:
        'Uzun mayalı hamur, San Marzano domates, taze mozzarella, fesleğen. Dört kişilik gerçek Margherita pizza, 2 saatte.',
    },
    ES: {
      slug: 'pizza-margarita',
      title: 'Pizza Margarita Casera',
      tagline: 'Tres colores, tres ingredientes, un horno ardiente',
      description:
        'Masa de fermentación larga, tomate San Marzano machacado a mano, mozzarella fresca rota, albahaca aromática, aceite de oliva final. De principio a fin dos horas; treinta minutos reales de trabajo.',
      story:
        'Pizza Margarita — tres colores, tres ingredientes sobre una masa bien caliente. Logra la masa correcta y todo lo demás encaja: una fermentación larga por sabor, un horno ardiente para el borde tostado, tomates San Marzano machacados a mano, sin atajos de salsa. La horneamos sobre acero para un fondo de restaurante; una piedra o incluso una bandeja pesada invertida funciona en un apuro. La bandera de Italia en un plato.',
      seoTitle: 'Pizza Margarita Casera — Receta Clásica Italiana',
      seoDescription:
        'Masa de fermentación larga, tomate San Marzano, mozzarella fresca, albahaca. Auténtica pizza margarita para cuatro en 2 horas.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'For the dough' },
        TR: { label: 'Hamur için' },
        ES: { label: 'Para la masa' },
      },
      items: [
        {
          ref: 'flour',
          position: 0,
          metric: { quantity: 500, unit: 'G' },
          us: { quantity: 4, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Strong bread flour (00 or 12% protein)', prep: null, substitutes: [] },
            TR: { name: 'Güçlü ekmeklik un (00 veya %12 protein)', prep: null, substitutes: [] },
            ES: { name: 'Harina de fuerza para pan (00 o 12% proteína)', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'water',
          position: 1,
          metric: { quantity: 325, unit: 'ML' },
          us: { quantity: 1.4, unit: 'CUP' },
          optional: false,
          aisle: 'OTHER',
          translations: {
            EN: { name: 'Lukewarm water', prep: null, substitutes: [] },
            TR: { name: 'Ilık su', prep: null, substitutes: [] },
            ES: { name: 'Agua tibia', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'salt',
          position: 2,
          metric: { quantity: 10, unit: 'G' },
          us: { quantity: 1.75, unit: 'TSP' },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Fine sea salt', prep: null, substitutes: [] },
            TR: { name: 'İnce deniz tuzu', prep: null, substitutes: [] },
            ES: { name: 'Sal marina fina', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'yeast',
          position: 3,
          metric: { quantity: 3, unit: 'G' },
          us: { quantity: 1, unit: 'TSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Instant yeast', prep: null, substitutes: ['active dry (use 4 g, bloom in water first)'] },
            TR: { name: 'İnstant kuru maya', prep: null, substitutes: ['kuru aktif maya (4 g, önce suda canlandır)'] },
            ES: { name: 'Levadura instantánea', prep: null, substitutes: ['levadura seca activa (4 g, activar en agua primero)'] },
          },
        },
        {
          ref: 'dough-oil',
          position: 4,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Olive oil (for the dough)', prep: null, substitutes: [] },
            TR: { name: 'Zeytinyağı (hamur için)', prep: null, substitutes: [] },
            ES: { name: 'Aceite de oliva (para la masa)', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'For the topping' },
        TR: { label: 'Üzeri için' },
        ES: { label: 'Para la cobertura' },
      },
      items: [
        {
          ref: 'tomatoes',
          position: 0,
          metric: { quantity: 400, unit: 'G' },
          us: { quantity: 14, unit: 'OZ' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'San Marzano whole peeled tomatoes', prep: 'hand-crushed', substitutes: ['quality whole peeled tomatoes'] },
            TR: { name: 'San Marzano bütün soyulmuş domates', prep: 'elle ezilmiş', substitutes: ['kaliteli bütün soyulmuş domates'] },
            ES: { name: 'Tomates San Marzano enteros pelados', prep: 'machacados a mano', substitutes: ['tomates enteros pelados de calidad'] },
          },
        },
        {
          ref: 'mozzarella',
          position: 1,
          metric: { quantity: 250, unit: 'G' },
          us: { quantity: 9, unit: 'OZ' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Fresh mozzarella (preferably bufala)', prep: 'torn into pieces, drained', substitutes: ['fior di latte'] },
            TR: { name: 'Taze mozzarella (tercihen bufala)', prep: 'parçalara koparılmış, suyu süzülmüş', substitutes: ['fior di latte'] },
            ES: { name: 'Mozzarella fresca (preferiblemente de búfala)', prep: 'rota en trozos, escurrida', substitutes: ['fior di latte'] },
          },
        },
        {
          ref: 'basil',
          position: 2,
          metric: { quantity: 15, unit: 'G' },
          us: { quantity: 0.5, unit: 'CUP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Fresh basil leaves', prep: null, substitutes: [] },
            TR: { name: 'Taze fesleğen yaprakları', prep: null, substitutes: [] },
            ES: { name: 'Hojas de albahaca fresca', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'finishing-oil',
          position: 3,
          metric: { quantity: 30, unit: 'ML' },
          us: { quantity: 2, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Extra virgin olive oil (for finishing)', prep: null, substitutes: [] },
            TR: { name: 'Sızma zeytinyağı (servis için)', prep: null, substitutes: [] },
            ES: { name: 'Aceite de oliva virgen extra (para terminar)', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'topping-salt',
          position: 4,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: false,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Salt', prep: 'a pinch', substitutes: [] },
            TR: { name: 'Tuz', prep: 'bir tutam', substitutes: [] },
            ES: { name: 'Sal', prep: 'una pizca', substitutes: [] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: 480,
      ingredientRefs: ['flour', 'water', 'salt', 'yeast', 'dough-oil'],
      translations: {
        EN: {
          title: 'Mix and knead the dough',
          body: 'In a large bowl, combine flour, salt, and yeast. Add water and olive oil. Mix with a wooden spoon until a shaggy dough forms, then turn out and knead by hand for 8 minutes (or 5 minutes in a stand mixer with a dough hook) until smooth and elastic. The dough should pass the windowpane test.',
          note: 'A windowpane test: stretch a small piece of dough — if it stretches thin enough to see light through without tearing, it\'s ready.',
          timerLabel: '8 min — knead',
        },
        TR: {
          title: 'Hamuru karıştır ve yoğur',
          body: 'Büyük bir kâsede un, tuz ve mayayı birleştir. Su ve zeytinyağını ekle. Tahta kaşıkla pürüzlü bir hamur oluşana kadar karıştır, sonra tezgâha al ve elle 8 dakika (sabit mikserde hamur kancası ile 5 dakika) pürüzsüz ve elastik olana kadar yoğur. Hamur pencere camı testini geçmeli.',
          note: 'Pencere camı testi: küçük bir parçayı çek — yırtılmadan ışığı görecek kadar incelirse hamur hazır.',
          timerLabel: '8 dk — yoğurma',
        },
        ES: {
          title: 'Mezcla y amasa',
          body: 'En un cuenco grande, combina harina, sal y levadura. Añade agua y aceite de oliva. Mezcla con cuchara de madera hasta formar una masa rugosa, luego vuelca y amasa a mano 8 minutos (o 5 minutos en batidora de pie con gancho) hasta que esté lisa y elástica. La masa debe pasar la prueba de la membrana.',
          note: 'Prueba de la membrana: estira un trozo pequeño — si se estira lo suficientemente fino para ver la luz a través sin romperse, está lista.',
          timerLabel: '8 min — amasar',
        },
      },
    },
    {
      index: 1,
      timerSeconds: 3600,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Bulk ferment',
          body: 'Place the dough in a lightly oiled bowl, cover with a damp towel, and let rise at room temperature for 1 hour, until doubled. For deeper flavor, refrigerate the bulk-fermented dough for 24–48 hours; bring to room temp 1 hour before shaping.',
          note: null,
          timerLabel: '60 min — bulk',
        },
        TR: {
          title: 'Toplu fermentasyon',
          body: 'Hamuru hafif yağlanmış bir kâseye koy, nemli bir bezle ört, oda sıcaklığında 1 saat, iki katına çıkana kadar mayalan. Daha derin tat için 24–48 saat buzdolabında dinlendir; şekillendirmeden 1 saat önce oda sıcaklığına çıkar.',
          note: null,
          timerLabel: '60 dk — fermentasyon',
        },
        ES: {
          title: 'Fermentación en bloque',
          body: 'Coloca la masa en un cuenco ligeramente engrasado, cubre con un paño húmedo y deja levar a temperatura ambiente 1 hora, hasta que doble. Para más sabor, refrigera la masa fermentada 24–48 horas; saca a temperatura ambiente 1 hora antes de dar forma.',
          note: null,
          timerLabel: '60 min — bloque',
        },
      },
    },
    {
      index: 2,
      timerSeconds: 1800,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Divide and rest',
          body: 'Divide the dough into 4 equal balls (about 220 g each). Tuck the edges underneath each ball to form tight rounds. Place on a floured tray, cover, and rest for 30 minutes. Meanwhile, set your oven to its highest setting (250°C / 480°F minimum) with a baking steel, stone, or inverted heavy tray on the top rack.',
          note: 'A pizza steel preheated for 45 minutes outperforms most home ovens for crust.',
          timerLabel: '30 min — rest',
        },
        TR: {
          title: 'Böl ve dinlendir',
          body: 'Hamuru 4 eşit topa böl (her biri yaklaşık 220 g). Sıkı yuvarlak şekiller oluşturmak için kenarları altına sıkıştır. Unlu bir tepsiye koy, ört, 30 dakika dinlendir. Bu sırada fırını en yüksek ayara getir (en az 250°C) ve üst rafa pizza çeliği, taşı veya ters çevrilmiş ağır bir tepsi yerleştir.',
          note: '45 dakika ısıtılan pizza çeliği, kabuk için çoğu ev fırınından daha iyi performans gösterir.',
          timerLabel: '30 dk — dinlenme',
        },
        ES: {
          title: 'Divide y reposa',
          body: 'Divide la masa en 4 bolas iguales (unos 220 g cada una). Mete los bordes debajo de cada bola para formar redondos apretados. Colócalas en una bandeja enharinada, cubre y deja reposar 30 minutos. Mientras tanto, pon el horno al máximo (250°C / 480°F mínimo) con una placa de acero, piedra o bandeja pesada invertida en la rejilla superior.',
          note: 'Una placa de acero precalentada 45 minutos supera a la mayoría de hornos caseros para la corteza.',
          timerLabel: '30 min — reposar',
        },
      },
    },
    {
      index: 3,
      timerSeconds: null,
      ingredientRefs: ['tomatoes', 'mozzarella', 'topping-salt'],
      translations: {
        EN: {
          title: 'Stretch and top',
          body: 'On a floured surface, stretch one ball into a 25 cm round, leaving a 1 cm border. Hand-crush 100 g of tomatoes per pizza, season with a pinch of salt, and spread thinly over the dough. Tear mozzarella into pieces and dot evenly. Drizzle with a little olive oil.',
          note: 'No rolling pin — pressing from the center outwards keeps the gas in the crust edges, giving you that puffy "cornicione".',
          timerLabel: null,
        },
        TR: {
          title: 'Aç ve üzerini hazırla',
          body: 'Unlu yüzeyde bir topu 25 cm yuvarlak hâle aç, 1 cm kenar bırak. Pizza başına 100 g domatesi elle ez, bir tutam tuzla tatlandır ve hamurun üzerine ince yay. Mozzarellayı parçalara kopar ve eşit serpiştir. Biraz zeytinyağı gezdir.',
          note: 'Oklava yok — merkezden dışa bastırmak gaz kabuğun kenarlarında kalmasını sağlar; o kabarık "cornicione" böyle olur.',
          timerLabel: null,
        },
        ES: {
          title: 'Estira y cubre',
          body: 'Sobre una superficie enharinada, estira una bola en un redondo de 25 cm, dejando un borde de 1 cm. Machaca a mano 100 g de tomate por pizza, sazona con una pizca de sal y extiende fino sobre la masa. Rompe la mozzarella en trozos y distribuye uniformemente. Rocía con un poco de aceite de oliva.',
          note: 'Sin rodillo — presionar desde el centro hacia fuera mantiene el gas en los bordes de la masa, dándote ese "cornicione" hinchado.',
          timerLabel: null,
        },
      },
    },
    {
      index: 4,
      timerSeconds: 420,
      ingredientRefs: ['basil', 'finishing-oil'],
      translations: {
        EN: {
          title: 'Bake and finish',
          body: 'Slide the pizza onto the preheated steel/stone using a peel dusted with semolina (or parchment paper). Bake 6–8 minutes, until the crust is blistered and charred in spots and the cheese is bubbling. Top with fresh basil leaves and a final drizzle of olive oil. Slice and serve immediately. Repeat for the remaining balls.',
          note: 'The first pizza is always the test — adjust the bake time on the second.',
          timerLabel: '7 min — bake',
        },
        TR: {
          title: 'Pişir ve bitir',
          body: 'İrmik serpilmiş bir küreğe (veya pişirme kağıdına) alarak pizzayı ısınmış çelik/taş üzerine kaydır. 6–8 dakika, kabuk kabarana ve yer yer karararak çıtırlaşana, peynir kabaracana kadar pişir. Üzerine taze fesleğen ve son bir defa zeytinyağı gezdir. Hemen dilimle ve servis et. Kalan toplar için tekrarla.',
          note: 'İlk pizza her zaman testtir — ikincide pişirme süresini ayarla.',
          timerLabel: '7 dk — pişirme',
        },
        ES: {
          title: 'Hornea y termina',
          body: 'Desliza la pizza sobre el acero/piedra precalentado usando una pala espolvoreada con sémola (o papel de horno). Hornea 6–8 minutos, hasta que la corteza esté ampollada y chamuscada por zonas y el queso burbujee. Cubre con hojas frescas de albahaca y un chorrito final de aceite de oliva. Corta y sirve inmediatamente. Repite con las bolas restantes.',
          note: 'La primera pizza siempre es la prueba — ajusta el tiempo de horneado en la segunda.',
          timerLabel: '7 min — hornear',
        },
      },
    },
  ],

  equipmentSlugs: ['oven', 'mixer', 'rolling-pin', 'baking-sheet'],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Marinara (vegan) variation',
          body: 'Skip the mozzarella entirely. Top with crushed tomato, sliced garlic, dried oregano, and finish with olive oil. The original pizza, predating the Margherita — and naturally vegan.',
        },
        TR: {
          title: 'Marinara (vegan) varyasyonu',
          body: 'Mozzarellayı tamamen atla. Ezilmiş domates, dilimlenmiş sarımsak, kuru kekik ekle, zeytinyağı ile bitir. Margherita\'dan önceki orijinal pizza — ve doğal olarak vegan.',
        },
        ES: {
          title: 'Variación marinara (vegana)',
          body: 'Omite la mozzarella por completo. Cubre con tomate machacado, ajo en láminas, orégano seco y termina con aceite de oliva. La pizza original, anterior a la Margarita — y naturalmente vegana.',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'My oven only goes to 220°C. Can I still make this?',
          a: 'Yes, but preheat for 60 minutes with a steel or stone, and bake closer to the top element. The crust will be slightly less charred but still excellent. Avoid opening the oven during baking — heat recovery is your enemy.',
        },
        TR: {
          q: 'Fırınım sadece 220°C\'ye çıkıyor. Yine de yapabilir miyim?',
          a: 'Evet, ama 60 dakika çelik veya taş ile önceden ısıt ve üst ısıtma elemanına yakın pişir. Kabuk biraz daha az kararmış olur ama yine de mükemmel olur. Pişirme sırasında fırını açma — ısı kaybı düşmanın.',
        },
        ES: {
          q: 'Mi horno solo llega a 220°C. ¿Puedo hacerla igual?',
          a: 'Sí, pero precalienta 60 minutos con acero o piedra, y hornea más cerca del elemento superior. La corteza estará un poco menos chamuscada pero aún excelente. Evita abrir el horno durante el horneado — la recuperación de calor es tu enemiga.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'Can I freeze the dough balls?',
          a: 'Yes — after dividing into balls, oil each lightly and freeze in individual containers for up to 1 month. Thaw overnight in the fridge, then bring to room temperature for 1 hour before stretching.',
        },
        TR: {
          q: 'Hamur toplarını dondurabilir miyim?',
          a: 'Evet — toplara böldükten sonra her birini hafifçe yağla ve ayrı kaplarda 1 aya kadar dondur. Buzdolabında bir gece çözdür, sonra şekillendirmeden 1 saat önce oda sıcaklığına getir.',
        },
        ES: {
          q: '¿Puedo congelar las bolas de masa?',
          a: 'Sí — después de dividir en bolas, engrasa cada una ligeramente y congela en recipientes individuales hasta 1 mes. Descongela una noche en el refrigerador, luego deja a temperatura ambiente 1 hora antes de estirar.',
        },
      },
    },
  ],

  nutrition: {
    calories: 580,
    proteinG: 22,
    proteinDailyPct: 44,
    carbsG: 78,
    carbsDailyPct: 28,
    fatG: 18,
    fatDailyPct: 23,
    fiberG: 3,
    fiberDailyPct: 11,
    sugarG: 4,
    sodiumMg: 950,
    sodiumDailyPct: 41,
  },

  categorySlugs: ['main-courses', 'bakery'],
  tagSlugs: ['comfort-food', 'kid-friendly'],
  dietSlugs: ['vegetarian'],
  allergens: [
    { slug: 'gluten', presence: 'CONTAINS' },
    { slug: 'milk', presence: 'CONTAINS' },
    { slug: 'eggs', presence: 'FREE' },
    { slug: 'soybeans', presence: 'MAY_CONTAIN' },
    { slug: 'tree-nuts', presence: 'FREE' },
    { slug: 'peanuts', presence: 'FREE' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'sesame', presence: 'FREE' },
    { slug: 'celery', presence: 'FREE' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'MAY_CONTAIN' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/margherita-pizza/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Margherita pizza with charred crust, white mozzarella pools, red tomato, scattered basil leaves on a wooden board' },
        TR: { alt: 'Tahta tabakta kararmış kabuklu Margherita pizza, beyaz mozzarella, kırmızı domates, serpilmiş fesleğen yaprakları' },
        ES: { alt: 'Pizza margarita con corteza chamuscada, mozzarella blanca derretida, tomate rojo, hojas de albahaca esparcidas sobre tabla de madera' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/margherita-pizza/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Hands stretching pizza dough into a thin round on a floured marble counter' },
        TR: { alt: 'Unlu mermer tezgâh üzerinde ince bir yuvarlağa pizza hamurunu açan eller' },
        ES: { alt: 'Manos estirando masa de pizza en un redondo fino sobre encimera de mármol enharinada' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'Closest I\'ve come to Naples at home. Cold-fermented for 36 hours and used a steel — the crust was unreal.',
        TR: 'Evde Napoli\'ye en çok yaklaştığım versiyon. 36 saat soğukta fermente ettim ve çelik kullandım — kabuk inanılmazdı.',
        ES: 'Lo más cerca que he llegado a Nápoles en casa. Fermenté en frío 36 horas y usé acero — la corteza fue irreal.',
      },
    },
    {
      rating: 5,
      authorLocale: 'TR',
      body: {
        EN: 'Made the marinara variation for our vegan friend and it was the surprise hit of the night. Hand-crushed tomatoes are the move.',
        TR: 'Vegan arkadaşımız için marinara varyasyonunu yaptık, gecenin sürprizi oldu. Elle ezilmiş domates tam yerinde.',
        ES: 'Hice la variación marinara para nuestro amigo vegano y fue el éxito sorpresa de la noche. Los tomates machacados a mano son la clave.',
      },
    },
    {
      rating: 4,
      authorLocale: 'ES',
      body: {
        EN: 'My oven maxes at 220°C and the crust still came out great with the 60-minute preheat. Worth the patience.',
        TR: 'Fırınım 220°C\'ye çıkıyor ve 60 dakika ön ısıtma ile kabuk yine de harika oldu. Sabra değer.',
        ES: 'Mi horno llega a 220°C máximo y la corteza salió genial con los 60 minutos de precalentamiento. Vale la paciencia.',
      },
    },
  ],
}
