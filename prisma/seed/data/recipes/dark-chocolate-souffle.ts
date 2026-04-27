import type { RecipeSeed } from '../../types'

export const darkChocolateSouffle: RecipeSeed = {
  seedId: 'recipe_dark-chocolate-souffle_seed',
  cuisineSlug: 'french',
  authorSlug: 'ferzender',
  skill: 'ADVANCED',
  servings: 4,
  prepMinutes: 15,
  cookMinutes: 15,
  totalMinutes: 30,
  heroImageCloudinary: 'tcd/seed/dark-chocolate-souffle/hero',
  heroBlurhash: null,
  costPerServingCents: 2200,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'dark-chocolate-souffle',
      title: 'Dark Chocolate Soufflé',
      tagline: 'Restaurant theatre at home, in 30 minutes',
      description:
        '70% dark chocolate folded into airy whipped whites, baked tall in cocoa-dusted ramekins, dusted with powdered sugar, served the second they emerge.',
      story:
        'A chocolate soufflé is restaurant theatre at home: it rises in fifteen minutes, collapses in five, and tastes like the most luxurious thing you\'ve ever made. The technique is unforgiving — soft-peak whites, deliberate folding, a hot oven, served immediately — but each step is short. Make this when you want to feel like a chef and have someone to amaze.',
      seoTitle: 'Dark Chocolate Soufflé — French Restaurant Recipe',
      seoDescription:
        '70% dark chocolate soufflé that rises tall in 12 minutes. Classic French technique, four servings, served straight from the oven.',
    },
    TR: {
      slug: 'bitter-cikolatali-sufle',
      title: 'Bitter Çikolatalı Sufle',
      tagline: 'Evde restoran gösterisi, 30 dakikada',
      description:
        '70% bitter çikolata, çırpılmış yumurta akına katlanır; kakao serpilmiş kâselerde uzunca pişirilir, pudra şekeri ile çıkar çıkmaz servis edilir.',
      story:
        'Çikolatalı sufle evde yapılan restoran gösterisidir: on beş dakikada kabarır, beşinde söner ve hayatında yaptığın en lüks şey gibi tat verir. Teknik affetmez — yumuşak tepeli yumurta akı, özenli katlama, sıcak fırın, hemen servis — ama her adım kısadır. Şef gibi hissetmek istediğinde, etkileyecek birileri varken yap.',
      seoTitle: 'Bitter Çikolatalı Sufle — Klasik Fransız Tarifi',
      seoDescription:
        '70% bitter çikolatalı, 12 dakikada kabaran sufle. Klasik Fransız tekniği, dört porsiyon, fırından çıkar çıkmaz servis.',
    },
    ES: {
      slug: 'sufle-chocolate-negro',
      title: 'Suflé de Chocolate Negro',
      tagline: 'Teatro de restaurante en casa, en 30 minutos',
      description:
        'Chocolate negro al 70% incorporado en claras montadas a punto suave, horneado alto en moldes espolvoreados con cacao, terminado con azúcar glas y servido al segundo de salir del horno.',
      story:
        'Un suflé de chocolate es teatro de restaurante en casa: sube en quince minutos, se desinfla en cinco, y sabe como lo más lujoso que has hecho. La técnica es implacable — claras a punto suave, doblado deliberado, horno caliente, servido inmediatamente — pero cada paso es corto. Hazlo cuando quieras sentirte un chef y tengas a alguien a quien impresionar.',
      seoTitle: 'Suflé de Chocolate Negro — Receta Francesa de Restaurante',
      seoDescription:
        'Suflé de chocolate negro al 70% que sube alto en 12 minutos. Técnica francesa clásica, cuatro raciones, servido directo del horno.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'For the ramekins' },
        TR: { label: 'Kâseler için' },
        ES: { label: 'Para los moldes' },
      },
      items: [
        {
          ref: 'butter-prep',
          position: 0,
          metric: { quantity: 15, unit: 'G' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Softened butter (for ramekins)', prep: null, substitutes: [] },
            TR: { name: 'Yumuşatılmış tereyağı (kâseler için)', prep: null, substitutes: [] },
            ES: { name: 'Mantequilla blanda (para moldes)', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'cocoa-prep',
          position: 1,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Cocoa powder (for dusting)', prep: null, substitutes: [] },
            TR: { name: 'Kakao tozu (serpmek için)', prep: null, substitutes: [] },
            ES: { name: 'Cacao en polvo (para espolvorear)', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'For the soufflé' },
        TR: { label: 'Sufle için' },
        ES: { label: 'Para el suflé' },
      },
      items: [
        {
          ref: 'chocolate',
          position: 0,
          metric: { quantity: 100, unit: 'G' },
          us: { quantity: 3.5, unit: 'OZ' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Dark chocolate, 70%', prep: 'finely chopped', substitutes: [] },
            TR: { name: '%70 bitter çikolata', prep: 'iri parçalanmış', substitutes: [] },
            ES: { name: 'Chocolate negro al 70%', prep: 'picado fino', substitutes: [] },
          },
        },
        {
          ref: 'butter',
          position: 1,
          metric: { quantity: 40, unit: 'G' },
          us: { quantity: 3, unit: 'TBSP' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Unsalted butter', prep: 'cubed', substitutes: [] },
            TR: { name: 'Tuzsuz tereyağı', prep: 'küp doğranmış', substitutes: [] },
            ES: { name: 'Mantequilla sin sal', prep: 'en cubos', substitutes: [] },
          },
        },
        {
          ref: 'yolks',
          position: 2,
          metric: { quantity: 3, unit: 'PIECE' },
          us: { quantity: 3, unit: 'PIECE' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Egg yolks', prep: 'room temperature', substitutes: [] },
            TR: { name: 'Yumurta sarısı', prep: 'oda sıcaklığında', substitutes: [] },
            ES: { name: 'Yemas de huevo', prep: 'a temperatura ambiente', substitutes: [] },
          },
        },
        {
          ref: 'sugar-yolks',
          position: 3,
          metric: { quantity: 20, unit: 'G' },
          us: { quantity: 1.5, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Granulated sugar (for the yolks)', prep: null, substitutes: [] },
            TR: { name: 'Toz şeker (sarılar için)', prep: null, substitutes: [] },
            ES: { name: 'Azúcar granulada (para las yemas)', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'whites',
          position: 4,
          metric: { quantity: 4, unit: 'PIECE' },
          us: { quantity: 4, unit: 'PIECE' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Egg whites', prep: 'room temperature', substitutes: [] },
            TR: { name: 'Yumurta akı', prep: 'oda sıcaklığında', substitutes: [] },
            ES: { name: 'Claras de huevo', prep: 'a temperatura ambiente', substitutes: [] },
          },
        },
        {
          ref: 'sugar-whites',
          position: 5,
          metric: { quantity: 40, unit: 'G' },
          us: { quantity: 3, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Granulated sugar (for the whites)', prep: null, substitutes: [] },
            TR: { name: 'Toz şeker (akları için)', prep: null, substitutes: [] },
            ES: { name: 'Azúcar granulada (para las claras)', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'cream-of-tartar',
          position: 6,
          metric: { quantity: null, unit: null },
          us: { quantity: null, unit: null },
          optional: true,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Cream of tartar (a pinch)', prep: null, substitutes: ['lemon juice (1/4 tsp)'] },
            TR: { name: 'Krem tartar (bir tutam)', prep: null, substitutes: ['limon suyu (1/4 çay kaşığı)'] },
            ES: { name: 'Crémor tártaro (una pizca)', prep: null, substitutes: ['zumo de limón (1/4 cdta)'] },
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
            EN: { name: 'Salt', prep: 'a pinch', substitutes: [] },
            TR: { name: 'Tuz', prep: 'bir tutam', substitutes: [] },
            ES: { name: 'Sal', prep: 'una pizca', substitutes: [] },
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
          ref: 'powdered-sugar',
          position: 0,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Powdered sugar', prep: 'for dusting', substitutes: [] },
            TR: { name: 'Pudra şekeri', prep: 'serpmek için', substitutes: [] },
            ES: { name: 'Azúcar glas', prep: 'para espolvorear', substitutes: [] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: null,
      ingredientRefs: ['butter-prep', 'cocoa-prep'],
      translations: {
        EN: {
          title: 'Prepare the ramekins',
          body: 'Preheat oven to 200°C (400°F) with a baking sheet inside. Brush four 200 ml ramekins with softened butter using upward strokes (this helps the soufflé climb). Dust each with cocoa, tapping out the excess.',
          note: 'The upward brushstrokes are not optional — they create grip for the rising mixture.',
          timerLabel: null,
        },
        TR: {
          title: 'Kâseleri hazırla',
          body: 'Fırını 200°C\'ye ısıt, içine bir tepsi koy. Dört adet 200 ml kâseyi yukarıdan aşağı fırça hareketleriyle yumuşatılmış tereyağı ile yağla (bu suflenin yükselmesine yardım eder). Her birine kakao tozu serp, fazlasını dökerek çıkar.',
          note: 'Yukarı doğru fırça hareketleri opsiyonel değil — kabaran karışıma tutunma noktası verir.',
          timerLabel: null,
        },
        ES: {
          title: 'Prepara los moldes',
          body: 'Precalienta el horno a 200°C con una bandeja dentro. Pincela cuatro moldes de 200 ml con mantequilla blanda haciendo trazos hacia arriba (esto ayuda a que el suflé suba). Espolvorea cada uno con cacao, golpeando suavemente para retirar el exceso.',
          note: 'Los trazos hacia arriba no son opcionales — crean agarre para la mezcla que sube.',
          timerLabel: null,
        },
      },
    },
    {
      index: 1,
      timerSeconds: 120,
      ingredientRefs: ['chocolate', 'butter'],
      translations: {
        EN: {
          title: 'Melt the chocolate',
          body: 'Melt the chocolate and butter in a heatproof bowl set over (not touching) simmering water, stirring until smooth. Or microwave in 30-second bursts at 50% power. Cool slightly.',
          note: null,
          timerLabel: '2 min — melt',
        },
        TR: {
          title: 'Çikolatayı erit',
          body: 'Çikolata ve tereyağını, kaynar suya değmeden duran ısıya dayanıklı bir kâsede pürüzsüz olana kadar karıştırarak erit. Veya mikrodalgada %50 güçte 30 saniyelik aralıklarla erit. Hafifçe soğut.',
          note: null,
          timerLabel: '2 dk — eritme',
        },
        ES: {
          title: 'Derrite el chocolate',
          body: 'Derrite el chocolate y la mantequilla en un cuenco resistente al calor sobre (sin tocar) agua a fuego lento, removiendo hasta que esté liso. O microondas en intervalos de 30 segundos al 50% de potencia. Deja enfriar ligeramente.',
          note: null,
          timerLabel: '2 min — derretir',
        },
      },
    },
    {
      index: 2,
      timerSeconds: 60,
      ingredientRefs: ['yolks', 'sugar-yolks'],
      translations: {
        EN: {
          title: 'Whisk the yolks',
          body: 'In a separate bowl, whisk the egg yolks with 20 g of sugar until pale and slightly thickened, about 1 minute. Whisk the cooled chocolate into the yolks until fully combined.',
          note: null,
          timerLabel: '1 min — yolks',
        },
        TR: {
          title: 'Sarıları çırp',
          body: 'Ayrı bir kâsede yumurta sarılarını 20 g şeker ile soluk renge gelene ve hafif kıvam alana kadar yaklaşık 1 dakika çırp. Soğuyan çikolatayı sarılara çırparak ekle, tamamen birleşene kadar karıştır.',
          note: null,
          timerLabel: '1 dk — sarılar',
        },
        ES: {
          title: 'Bate las yemas',
          body: 'En un cuenco aparte, bate las yemas con 20 g de azúcar hasta que palidezcan y espesen ligeramente, aproximadamente 1 minuto. Incorpora el chocolate enfriado a las yemas hasta que esté completamente combinado.',
          note: null,
          timerLabel: '1 min — yemas',
        },
      },
    },
    {
      index: 3,
      timerSeconds: 240,
      ingredientRefs: ['whites', 'cream-of-tartar', 'salt', 'sugar-whites'],
      translations: {
        EN: {
          title: 'Whip the whites to soft peaks',
          body: 'In a clean, dry bowl, whip the egg whites with cream of tartar and a pinch of salt to soft peaks. Gradually rain in the 40 g of sugar while whipping, until you reach stiff, glossy peaks that just hold their shape.',
          note: 'Soft peaks first, then sugar — adding sugar too early prevents the whites from reaching full volume.',
          timerLabel: '4 min — whip',
        },
        TR: {
          title: 'Akları yumuşak tepeye çırp',
          body: 'Temiz, kuru bir kâsede yumurta aklarını krem tartar ve bir tutam tuzla yumuşak tepe alana kadar çırp. 40 g şekeri çırparken yavaş yavaş ekle, sıkı ve parlak tepelere ulaşana kadar.',
          note: 'Önce yumuşak tepe, sonra şeker — şekeri erken eklemek akların tam hacme ulaşmasını engeller.',
          timerLabel: '4 dk — çırpma',
        },
        ES: {
          title: 'Monta las claras a punto suave',
          body: 'En un cuenco limpio y seco, monta las claras con crémor tártaro y una pizca de sal a punto suave. Añade gradualmente los 40 g de azúcar mientras montas, hasta alcanzar picos firmes y brillantes que mantengan su forma.',
          note: 'Primero punto suave, luego azúcar — añadir azúcar muy temprano impide que las claras alcancen pleno volumen.',
          timerLabel: '4 min — montar',
        },
      },
    },
    {
      index: 4,
      timerSeconds: null,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Fold and fill',
          body: 'Add a third of the whipped whites to the chocolate-yolk base and stir to lighten. Gently fold in the remaining whites in two additions, using a spatula and a figure-eight motion until just combined — a few streaks are fine. Divide between ramekins, levelling the tops with a knife. Run your thumb around the inside of each rim to create a clean lip.',
          note: 'Stop folding the moment no large streaks remain. Overmixing collapses the whites.',
          timerLabel: null,
        },
        TR: {
          title: 'Katla ve doldur',
          body: 'Çırpılmış akların üçte birini çikolata-sarı tabanına ekle ve hafifletmek için karıştır. Kalan akları iki seferde, spatula ile sekiz şekli çizerek hafifçe katla — birkaç çizgi kalsa olur. Kâselere böl, üstlerini bıçakla düzleştir. Her bir kâsenin iç kenarına başparmağınla temiz bir kenar oluştur.',
          note: 'Büyük çizgiler kaybolur kaybolmaz katlamayı bırak. Aşırı karıştırmak akları söndürür.',
          timerLabel: null,
        },
        ES: {
          title: 'Mezcla y rellena',
          body: 'Añade un tercio de las claras montadas a la base de chocolate y yemas y remueve para aligerar. Incorpora suavemente las claras restantes en dos veces, usando una espátula y movimientos en forma de ocho hasta que apenas se combine — unas vetas están bien. Divide entre los moldes, nivelando las superficies con un cuchillo. Pasa el pulgar por el interior de cada borde para crear un labio limpio.',
          note: 'Deja de mezclar en el momento en que no queden vetas grandes. Mezclar en exceso desinfla las claras.',
          timerLabel: null,
        },
      },
    },
    {
      index: 5,
      timerSeconds: 780,
      ingredientRefs: ['powdered-sugar'],
      translations: {
        EN: {
          title: 'Bake and serve immediately',
          body: 'Place ramekins on the preheated baking sheet. Bake for 12–14 minutes — the soufflés should rise 3 cm above the rim, with a slight wobble in the centre when nudged. Pull from the oven, dust with powdered sugar, and run them to the table. They wait for no one.',
          note: 'Open the oven only once during baking, briefly, to dust if you must. Slamming the door at any point is fatal.',
          timerLabel: '13 min — bake',
        },
        TR: {
          title: 'Pişir ve hemen servis et',
          body: 'Kâseleri ısınmış tepsiye yerleştir. 12–14 dakika pişir — sufleler kenardan 3 cm yükselmeli, hafif itildiğinde merkezde küçük bir titreme olmalı. Fırından çıkar, pudra şekeri serp ve sofraya koş. Hiç kimseyi beklemezler.',
          note: 'Pişirme sırasında fırını sadece bir kez, kısa süreliğine aç. Kapağı çarpmak her zaman ölümcüldür.',
          timerLabel: '13 dk — pişirme',
        },
        ES: {
          title: 'Hornea y sirve inmediatamente',
          body: 'Coloca los moldes en la bandeja precalentada. Hornea 12–14 minutos — los suflés deben subir 3 cm por encima del borde, con un ligero temblor en el centro al moverlos. Saca del horno, espolvorea con azúcar glas y llévalos corriendo a la mesa. No esperan a nadie.',
          note: 'Abre el horno solo una vez durante el horneado, brevemente. Cerrar la puerta de golpe en cualquier momento es fatal.',
          timerLabel: '13 min — hornear',
        },
      },
    },
  ],

  equipmentSlugs: [
    { slug: 'oven', position: 0, required: true },
    { slug: 'mixer', position: 1, required: false, note: 'A balloon whisk works but expect tired arms' },
    { slug: 'whisk', position: 2, required: true, note: 'For folding meringue into the base' },
    { slug: 'baking-sheet', position: 3, quantity: 4, required: true, note: '8 oz ramekins; 4 of them for individual soufflés' },
  ],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Espresso variation',
          body: 'Add 1 tsp of instant espresso powder to the chocolate while melting. Deepens the chocolate without making it taste like coffee — a classic restaurant trick.',
        },
        TR: {
          title: 'Espresso varyasyonu',
          body: 'Çikolatayı eritirken 1 tatlı kaşığı hazır espresso kahve ekle. Kahve tadı vermeden çikolatayı derinleştirir — klasik restoran numarası.',
        },
        ES: {
          title: 'Variación con espresso',
          body: 'Añade 1 cdta de espresso instantáneo al chocolate mientras se derrite. Profundiza el chocolate sin que sepa a café — un truco clásico de restaurante.',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'My soufflé didn\'t rise. What happened?',
          a: 'Most likely the whites were either underwhipped (didn\'t hold air) or overfolded (lost the air). Soft-then-stiff peaks and stop folding when no streaks remain. A cool oven is also a culprit — preheat for at least 15 minutes.',
        },
        TR: {
          q: 'Suflem kabarmadı. Ne oldu?',
          a: 'Büyük olasılıkla aklar yetersiz çırpıldı (havayı tutmadı) veya fazla katlandı (havayı kaybetti). Yumuşaktan sıkıya tepeler ve çizgi kalmayınca katlamayı bırak. Soğuk fırın da bir sebep — en az 15 dakika önceden ısıt.',
        },
        ES: {
          q: 'Mi suflé no subió. ¿Qué pasó?',
          a: 'Lo más probable es que las claras estuvieran poco montadas (no retuvieron el aire) o sobre-mezcladas (perdieron el aire). Picos suaves luego firmes, y deja de mezclar cuando no queden vetas. Un horno frío también es culpable — precalienta al menos 15 minutos.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'Can I prep ahead?',
          a: 'You can fill the ramekins up to 2 hours ahead and refrigerate. Let them sit at room temp for 15 minutes before baking, and add 2 minutes to the bake time. Beyond that, the whites lose loft.',
        },
        TR: {
          q: 'Önceden hazırlayabilir miyim?',
          a: 'Kâseleri 2 saat öncesine kadar doldurup buzdolabına alabilirsin. Pişirmeden önce 15 dakika oda sıcaklığında dinlendir, pişirme süresine 2 dakika ekle. Daha fazlası akların kabarmasına engel olur.',
        },
        ES: {
          q: '¿Puedo preparar con antelación?',
          a: 'Puedes llenar los moldes hasta 2 horas antes y refrigerar. Déjalos a temperatura ambiente 15 minutos antes de hornear y añade 2 minutos al tiempo. Más allá de eso, las claras pierden volumen.',
        },
      },
    },
  ],

  nutrition: {
    calories: 360,
    proteinG: 9,
    proteinDailyPct: 18,
    carbsG: 30,
    carbsDailyPct: 11,
    fatG: 22,
    fatDailyPct: 28,
    fiberG: 3,
    fiberDailyPct: 11,
    sugarG: 25,
    sodiumMg: 110,
    sodiumDailyPct: 5,
  },

  categorySlugs: ['desserts'],
  tagSlugs: ['holiday', 'comfort-food'],
  dietSlugs: ['vegetarian'],
  allergens: [
    { slug: 'gluten', presence: 'FREE' },
    { slug: 'milk', presence: 'CONTAINS' },
    { slug: 'eggs', presence: 'CONTAINS' },
    { slug: 'soybeans', presence: 'MAY_CONTAIN' },
    { slug: 'tree-nuts', presence: 'MAY_CONTAIN' },
    { slug: 'peanuts', presence: 'MAY_CONTAIN' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'sesame', presence: 'FREE' },
    { slug: 'celery', presence: 'FREE' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'FREE' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/dark-chocolate-souffle/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Tall risen chocolate soufflé in white ramekin, dusted with powdered sugar, spoon breaking the dome' },
        TR: { alt: 'Beyaz kâsede yüksek kabarmış çikolatalı sufle, üzerine pudra şekeri serpilmiş, kaşık kubbeye giriyor' },
        ES: { alt: 'Suflé de chocolate alto en molde blanco, espolvoreado con azúcar glas, cuchara rompiendo la cúpula' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/dark-chocolate-souffle/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Cross-section of chocolate soufflé revealing molten centre flowing onto a porcelain plate' },
        TR: { alt: 'Porselen tabağa akan eriyik merkezini gösteren çikolatalı sufle enine kesiti' },
        ES: { alt: 'Sección transversal del suflé de chocolate revelando el centro fundido fluyendo sobre un plato de porcelana' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'My first ever soufflé and it actually rose. The upward butter-brushing tip is real — it climbed three centimetres above the rim.',
        TR: 'Hayatımdaki ilk sufle ve gerçekten kabardı. Yukarı doğru tereyağı sürme ipucu işe yarıyor — kenardan üç santim yükseldi.',
        ES: 'Mi primer suflé y de verdad subió. El consejo de pincelar mantequilla hacia arriba es real — subió tres centímetros por encima del borde.',
      },
    },
    {
      rating: 5,
      authorLocale: 'TR',
      body: {
        EN: 'The espresso variation is the move. Deepens the chocolate without coffee flavour. Will impress dinner guests every time.',
        TR: 'Espresso varyasyonu tam yerinde. Kahve tadı olmadan çikolatayı derinleştirir. Misafirleri her seferinde etkileyecek.',
        ES: 'La variación con espresso es la clave. Profundiza el chocolate sin sabor a café. Impresionará a los invitados cada vez.',
      },
    },
    {
      rating: 4,
      authorLocale: 'ES',
      body: {
        EN: 'Risen perfectly but I overbaked by a minute and lost the molten centre. Set a timer and trust it.',
        TR: 'Mükemmel kabardı ama bir dakika fazla pişirdim ve eriyik merkezi kaybettim. Zamanlayıcı kur ve güven.',
        ES: 'Subió perfectamente pero lo horneé un minuto de más y perdí el centro fundido. Pon un temporizador y confía en él.',
      },
    },
  ],
}
