import type { RecipeSeed } from '../../types'

export const classicBaklava: RecipeSeed = {
  seedId: 'recipe_classic-baklava_seed',
  cuisineSlug: 'turkish',
  authorSlug: 'ferzender',
  skill: 'ADVANCED',
  servings: 16,
  prepMinutes: 60,
  cookMinutes: 30,
  totalMinutes: 90,
  heroImageCloudinary: 'tcd/seed/classic-baklava/hero',
  heroBlurhash: null,
  costPerServingCents: 6000,
  costCurrency: 'TRY',

  translations: {
    EN: {
      slug: 'classic-baklava',
      title: 'Classic Baklava',
      tagline: 'Paper-thin pastry, walnut, butter, syrup',
      description:
        'Layers of buttered phyllo and ground walnut–pistachio crumb, baked golden, then drenched in lemon-scented syrup the moment it leaves the oven. The Turkish dessert that defines patience.',
      story:
        'Baklava is the queen of Turkish dessert tables — paper-thin layers of phyllo, ground nuts, and clarified butter, drenched in lemon-bright sugar syrup the moment it leaves the oven. The technique is simple in steps but demanding in patience: every sheet brushed, every fold deliberate. We tested countless ratios to land on the version that\'s neither cloying nor dry — just shatteringly crisp and deeply nutty. The cardinal rule: cool syrup over hot pastry, never the other way around.',
      seoTitle: 'Classic Baklava — Turkish Walnut Pistachio Recipe',
      seoDescription:
        'Authentic Turkish baklava with paper-thin phyllo, walnut–pistachio filling, and lemon syrup. 16 servings, 90 minutes, the patience-rewarding classic.',
    },
    TR: {
      slug: 'klasik-baklava',
      title: 'Klasik Baklava',
      tagline: 'Kâğıt inceliğinde yufka, ceviz, tereyağı, şerbet',
      description:
        'Yağlanmış yufka katmanları arasına ceviz–fıstık harcı; altın renginde pişirildikten sonra hâlâ sıcakken limonlu şerbete bürünür. Sabırla yapılan Türk tatlısının zirvesi.',
      story:
        'Baklava, Türk tatlı sofrasının kraliçesi — kâğıt inceliğinde yufka katmanları, dövülmüş kuruyemiş ve sade tereyağı; fırından çıkar çıkmaz limon kokulu şerbete dökülen. Adımları basit, ama sabır gerektiren bir teknik: her yufka yağlanmalı, her kat özenli olmalı. Sayısız oranı deneyerek ne fazla şerbetli ne kuru olan, sadece kıtır kıtır ve dolgun fındık tatlı bu versiyona ulaştık. Ana kural: soğuk şerbet sıcak hamura, asla tersi.',
      seoTitle: 'Klasik Baklava — Geleneksel Türk Tarifi',
      seoDescription:
        'Kâğıt inceliğinde yufka, ceviz–fıstık harcı ve limonlu şerbetle gerçek Türk baklavası. 16 porsiyon, 90 dakika, sabrın ödülü.',
    },
    ES: {
      slug: 'baklava-clasico',
      title: 'Baklava Clásico',
      tagline: 'Masa filo fina, nuez, mantequilla, almíbar',
      description:
        'Capas de masa filo con mantequilla y relleno molido de nueces y pistachos, horneado dorado y empapado en almíbar de limón al salir del horno. El postre turco que define la paciencia.',
      story:
        'El baklava es la reina de la mesa de postres turca — capas de masa filo finas como el papel, frutos secos molidos y mantequilla clarificada, empapados en almíbar de limón en el momento en que sale del horno. La técnica es simple en pasos pero exigente en paciencia: cada lámina pincelada, cada doblez deliberado. Probamos innumerables proporciones para llegar a la versión que no es ni empalagosa ni seca — simplemente crujiente y profundamente a frutos secos. La regla cardinal: almíbar frío sobre pasta caliente, nunca al revés.',
      seoTitle: 'Baklava Clásico — Receta Turca de Nueces y Pistachos',
      seoDescription:
        'Auténtico baklava turco con masa filo finísima, relleno de nueces y pistachos, y almíbar de limón. 16 raciones, 90 minutos, el clásico que recompensa la paciencia.',
    },
  },

  ingredientGroups: [
    {
      position: 0,
      translations: {
        EN: { label: 'For the syrup' },
        TR: { label: 'Şerbet için' },
        ES: { label: 'Para el almíbar' },
      },
      items: [
        {
          ref: 'syrup-sugar',
          position: 0,
          metric: { quantity: 400, unit: 'G' },
          us: { quantity: 2, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Granulated sugar', prep: null, substitutes: [] },
            TR: { name: 'Toz şeker', prep: null, substitutes: [] },
            ES: { name: 'Azúcar granulada', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'syrup-water',
          position: 1,
          metric: { quantity: 300, unit: 'ML' },
          us: { quantity: 1.25, unit: 'CUP' },
          optional: false,
          aisle: 'OTHER',
          translations: {
            EN: { name: 'Water', prep: null, substitutes: [] },
            TR: { name: 'Su', prep: null, substitutes: [] },
            ES: { name: 'Agua', prep: null, substitutes: [] },
          },
        },
        {
          ref: 'lemon-juice',
          position: 2,
          metric: { quantity: 15, unit: 'ML' },
          us: { quantity: 1, unit: 'TBSP' },
          optional: false,
          aisle: 'PRODUCE',
          translations: {
            EN: { name: 'Fresh lemon juice', prep: null, substitutes: [] },
            TR: { name: 'Taze limon suyu', prep: null, substitutes: [] },
            ES: { name: 'Zumo de limón fresco', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 1,
      translations: {
        EN: { label: 'For the filling' },
        TR: { label: 'İç harç için' },
        ES: { label: 'Para el relleno' },
      },
      items: [
        {
          ref: 'walnuts',
          position: 0,
          metric: { quantity: 200, unit: 'G' },
          us: { quantity: 1.75, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Walnuts', prep: 'finely chopped', substitutes: ['pecans'] },
            TR: { name: 'Ceviz içi', prep: 'iri çekilmiş', substitutes: [] },
            ES: { name: 'Nueces', prep: 'picadas finas', substitutes: ['pacanas'] },
          },
        },
        {
          ref: 'pistachios',
          position: 1,
          metric: { quantity: 100, unit: 'G' },
          us: { quantity: 0.75, unit: 'CUP' },
          optional: false,
          aisle: 'PANTRY',
          translations: {
            EN: { name: 'Unsalted pistachios', prep: 'finely chopped', substitutes: [] },
            TR: { name: 'Tuzsuz Antep fıstığı', prep: 'iri çekilmiş', substitutes: [] },
            ES: { name: 'Pistachos sin sal', prep: 'picados finos', substitutes: [] },
          },
        },
        {
          ref: 'cinnamon',
          position: 2,
          metric: { quantity: 5, unit: 'ML' },
          us: { quantity: 1, unit: 'TSP' },
          optional: true,
          aisle: 'SPICES',
          translations: {
            EN: { name: 'Ground cinnamon', prep: null, substitutes: [] },
            TR: { name: 'Toz tarçın', prep: null, substitutes: [] },
            ES: { name: 'Canela molida', prep: null, substitutes: [] },
          },
        },
      ],
    },
    {
      position: 2,
      translations: {
        EN: { label: 'For assembly' },
        TR: { label: 'Yufka ve yağ için' },
        ES: { label: 'Para el montaje' },
      },
      items: [
        {
          ref: 'phyllo',
          position: 0,
          metric: { quantity: 500, unit: 'G' },
          us: { quantity: 1, unit: 'LB' },
          optional: false,
          aisle: 'FROZEN',
          translations: {
            EN: { name: 'Phyllo pastry sheets', prep: 'thawed if frozen', substitutes: [] },
            TR: { name: 'Baklavalık yufka', prep: 'donmuşsa çözülmüş', substitutes: [] },
            ES: { name: 'Láminas de masa filo', prep: 'descongeladas si están congeladas', substitutes: [] },
          },
        },
        {
          ref: 'butter',
          position: 1,
          metric: { quantity: 250, unit: 'G' },
          us: { quantity: 1.1, unit: 'CUP' },
          optional: false,
          aisle: 'DAIRY',
          translations: {
            EN: { name: 'Unsalted butter', prep: 'melted (clarified is best)', substitutes: ['ghee'] },
            TR: { name: 'Tuzsuz tereyağı', prep: 'eritilmiş (sade yağ ideal)', substitutes: ['sade yağ'] },
            ES: { name: 'Mantequilla sin sal', prep: 'derretida (clarificada es ideal)', substitutes: ['ghee'] },
          },
        },
      ],
    },
  ],

  steps: [
    {
      index: 0,
      timerSeconds: 600,
      ingredientRefs: ['syrup-sugar', 'syrup-water', 'lemon-juice'],
      translations: {
        EN: {
          title: 'Make the syrup',
          body: 'Combine sugar and water in a saucepan over medium heat. Stir until the sugar dissolves, then bring to a boil. Add the lemon juice and reduce to a low simmer. Cook for 10 minutes without stirring, then remove from heat and cool completely. Refrigerate while you work.',
          note: 'The syrup must be cold when it meets the hot baklava — this is the entire secret.',
          timerLabel: '10 min — simmer',
        },
        TR: {
          title: 'Şerbeti hazırla',
          body: 'Bir tencerede şeker ve suyu orta ateşte birleştir. Şeker eriyene kadar karıştır, sonra kaynat. Limon suyunu ekle, ateşi kıs ve karıştırmadan 10 dakika pişir. Ateşten al ve tamamen soğut. Çalışırken buzdolabında bekle.',
          note: 'Şerbet sıcak baklavayla buluştuğunda soğuk olmalı — bütün sır bu.',
          timerLabel: '10 dk — pişirme',
        },
        ES: {
          title: 'Hacer el almíbar',
          body: 'Combina azúcar y agua en una cacerola a fuego medio. Remueve hasta que el azúcar se disuelva, luego lleva a ebullición. Añade el zumo de limón y reduce a fuego lento. Cocina 10 minutos sin remover, retira del fuego y enfría completamente. Refrigera mientras trabajas.',
          note: 'El almíbar debe estar frío cuando se encuentre con el baklava caliente — ese es todo el secreto.',
          timerLabel: '10 min — cocer',
        },
      },
    },
    {
      index: 1,
      timerSeconds: null,
      ingredientRefs: ['walnuts', 'pistachios', 'cinnamon'],
      translations: {
        EN: {
          title: 'Prepare the filling',
          body: 'Combine the chopped walnuts, pistachios, and cinnamon in a bowl. Toss with a fork to distribute. The mix should be coarse, not powdery — pieces of nut should still be visible.',
          note: null,
          timerLabel: null,
        },
        TR: {
          title: 'İç harcı hazırla',
          body: 'Bir kâsede iri çekilmiş ceviz, fıstık ve tarçını birleştir. Çatalla karıştır. Karışım iri taneli olmalı, toz değil — fındık parçaları görünmeli.',
          note: null,
          timerLabel: null,
        },
        ES: {
          title: 'Preparar el relleno',
          body: 'Combina las nueces picadas, los pistachos y la canela en un cuenco. Mezcla con un tenedor. La mezcla debe ser gruesa, no polvorosa — los trozos de fruto seco deben seguir siendo visibles.',
          note: null,
          timerLabel: null,
        },
      },
    },
    {
      index: 2,
      timerSeconds: null,
      ingredientRefs: ['phyllo', 'butter'],
      translations: {
        EN: {
          title: 'Layer the bottom',
          body: 'Brush a 23×33 cm baking pan with melted butter. Lay a phyllo sheet, brush with butter, and repeat for half the sheets (about 8–10). Keep the unused phyllo covered with a damp towel — it dries out in seconds.',
          note: 'Don\'t panic if a sheet tears — patch it. The layers hide everything.',
          timerLabel: null,
        },
        TR: {
          title: 'Alt katmanları diz',
          body: '23×33 cm fırın tepsisini erimiş tereyağı ile yağla. Bir yufka yay, üzerini yağla ve yufkaların yarısı (yaklaşık 8–10 adet) için tekrarla. Kullanmadığın yufkaları nemli bir bezle ört — saniyeler içinde kurur.',
          note: 'Bir yufka yırtılırsa panik yapma — yamala. Katmanlar her şeyi gizler.',
          timerLabel: null,
        },
        ES: {
          title: 'Hacer la base',
          body: 'Pincela un molde de 23×33 cm con mantequilla derretida. Coloca una lámina de filo, pincela con mantequilla y repite con la mitad de las láminas (unas 8–10). Cubre la masa filo no usada con un paño húmedo — se seca en segundos.',
          note: 'Si una lámina se rompe, no entres en pánico — parchea. Las capas lo ocultan todo.',
          timerLabel: null,
        },
      },
    },
    {
      index: 3,
      timerSeconds: null,
      ingredientRefs: ['walnuts', 'phyllo', 'butter'],
      translations: {
        EN: {
          title: 'Add filling and top layers',
          body: 'Spread the nut mixture evenly over the layered phyllo. Top with the remaining phyllo sheets, brushing each with butter as before. Brush the very top with a generous final coat of butter.',
          note: null,
          timerLabel: null,
        },
        TR: {
          title: 'Harcı ve üst katmanları ekle',
          body: 'Fındık harcını yufkaların üzerine eşit şekilde yay. Kalan yufkalarla üstü kapat, her birini önceki gibi yağla. En üst yufkayı bol miktarda son bir kat yağ ile yağla.',
          note: null,
          timerLabel: null,
        },
        ES: {
          title: 'Añadir relleno y capas superiores',
          body: 'Extiende la mezcla de frutos secos uniformemente sobre la masa filo en capas. Cubre con las láminas de filo restantes, pincelando cada una con mantequilla como antes. Pincela la última capa con una capa generosa final de mantequilla.',
          note: null,
          timerLabel: null,
        },
      },
    },
    {
      index: 4,
      timerSeconds: null,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Score into diamonds',
          body: 'Using a sharp knife, score the top layers (not all the way through) into a diamond pattern: parallel cuts about 4 cm apart, then diagonal cuts to form 16 diamonds. Score firmly enough that the pattern survives baking.',
          note: 'Cutting through only the top half lets the syrup soak in evenly.',
          timerLabel: null,
        },
        TR: {
          title: 'Baklava şeklinde kes',
          body: 'Keskin bir bıçakla üst katmanları (en alta inmeden) baklava şeklinde kes: yaklaşık 4 cm aralıklı paralel çizgiler, sonra çapraz kesimlerle 16 baklava parça. Pişirme sırasında desen korunsun diye kararlı kes.',
          note: 'Sadece üst yarıyı kesmek şerbetin eşit dağılmasını sağlar.',
          timerLabel: null,
        },
        ES: {
          title: 'Marcar en rombos',
          body: 'Con un cuchillo afilado, marca las capas superiores (no hasta el fondo) en forma de rombos: cortes paralelos a unos 4 cm de distancia, luego cortes diagonales para formar 16 rombos. Marca con firmeza para que el patrón sobreviva al horneado.',
          note: 'Cortar solo la mitad superior permite que el almíbar se absorba uniformemente.',
          timerLabel: null,
        },
      },
    },
    {
      index: 5,
      timerSeconds: 1800,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Bake until deep golden',
          body: 'Bake at 180°C (350°F) for 30 minutes, then increase to 200°C (400°F) for 5–10 minutes more, until the top is deep amber and the kitchen smells of roasted nuts and butter.',
          note: 'If it browns unevenly, rotate the pan halfway through.',
          timerLabel: '30 min — bake',
        },
        TR: {
          title: 'Derin altın rengine pişir',
          body: '180°C\'de 30 dakika pişir, sonra 200°C\'ye çıkar ve 5–10 dakika daha, üst kahveleşene ve mutfak kavrulmuş fındık ve tereyağı kokana kadar pişir.',
          note: 'Eşit kahverengileşmiyorsa yarıda tepsiyi döndür.',
          timerLabel: '30 dk — pişirme',
        },
        ES: {
          title: 'Hornear hasta dorado profundo',
          body: 'Hornea a 180°C durante 30 minutos, luego sube a 200°C por 5–10 minutos más, hasta que la superficie esté ámbar profundo y la cocina huela a frutos secos tostados y mantequilla.',
          note: 'Si se dora de forma desigual, gira el molde a la mitad.',
          timerLabel: '30 min — hornear',
        },
      },
    },
    {
      index: 6,
      timerSeconds: null,
      ingredientRefs: [],
      translations: {
        EN: {
          title: 'Pour cold syrup over hot baklava',
          body: 'The instant the baklava emerges from the oven, slowly pour the cold syrup evenly over the entire surface. You\'ll hear it crackle. Let it sit at room temperature for at least 4 hours — overnight is better — for the layers to drink in the syrup.',
          note: 'Cutting hot baklava with no syrup or warm baklava with cold syrup produces a soggy mess. Trust the rest.',
          timerLabel: null,
        },
        TR: {
          title: 'Sıcak baklavanın üzerine soğuk şerbeti dök',
          body: 'Baklava fırından çıktığı anda, soğuk şerbeti yavaşça tüm yüzeye eşit şekilde dök. Çıtırtısını duyacaksın. Oda sıcaklığında en az 4 saat — bir gece ideal — bekle ki katmanlar şerbeti emsin.',
          note: 'Şerbetsiz sıcak baklavayı veya soğuk şerbetli ılık baklavayı kesmek ıslak bir karmaşa yaratır. Dinlenmesine izin ver.',
          timerLabel: null,
        },
        ES: {
          title: 'Verter almíbar frío sobre baklava caliente',
          body: 'En cuanto el baklava salga del horno, vierte lentamente el almíbar frío de manera uniforme sobre toda la superficie. Escucharás el crujido. Déjalo a temperatura ambiente al menos 4 horas — toda la noche es mejor — para que las capas absorban el almíbar.',
          note: 'Cortar baklava caliente sin almíbar o baklava tibio con almíbar frío produce un desastre empapado. Confía en el reposo.',
          timerLabel: null,
        },
      },
    },
  ],

  equipmentSlugs: ['oven', 'saucepan', 'baking-sheet', 'stovetop'],

  variations: [
    {
      position: 0,
      translations: {
        EN: {
          title: 'Pistachio-only (Antep style)',
          body: 'Replace all walnuts with 300 g of unsalted pistachios for the bright green Gaziantep version. The flavor is sweeter and more floral; serve with a strong Turkish coffee.',
        },
        TR: {
          title: 'Sadece fıstıklı (Antep usulü)',
          body: 'Tüm cevizi 300 g tuzsuz Antep fıstığı ile değiştir — parlak yeşil Gaziantep versiyonu için. Tat daha tatlı ve çiçeksi; koyu bir Türk kahvesi ile servis et.',
        },
        ES: {
          title: 'Solo pistacho (estilo Antep)',
          body: 'Reemplaza todas las nueces con 300 g de pistachos sin sal para la versión verde brillante de Gaziantep. El sabor es más dulce y floral; sirve con un café turco fuerte.',
        },
      },
    },
  ],

  faq: [
    {
      position: 0,
      translations: {
        EN: {
          q: 'My phyllo keeps tearing. What am I doing wrong?',
          a: 'Phyllo is unforgiving when dry. Keep the unused stack covered with a damp (not wet) towel at all times. Tears in middle layers don\'t matter — the buttered layers above and below will hide them.',
        },
        TR: {
          q: 'Yufkam sürekli yırtılıyor. Ne yanlış yapıyorum?',
          a: 'Yufka kuruyken affetmez. Kullanmadığın yığını her zaman nemli (ıslak değil) bir bezle ört. Orta katlarda yırtılmaların önemi yok — üst ve altındaki yağlı katmanlar gizleyecek.',
        },
        ES: {
          q: 'Mi masa filo se sigue rompiendo. ¿Qué estoy haciendo mal?',
          a: 'La masa filo es implacable cuando está seca. Mantén la pila no usada cubierta con un paño húmedo (no mojado) en todo momento. Las roturas en las capas centrales no importan — las capas con mantequilla arriba y abajo las ocultarán.',
        },
      },
    },
    {
      position: 1,
      translations: {
        EN: {
          q: 'How long does baklava keep?',
          a: 'At room temperature, well covered, up to 5 days — the texture is best in the first 48 hours. Don\'t refrigerate; the cold ruins the crisp layers. To freeze, do so before adding syrup; bake from frozen, then syrup as usual.',
        },
        TR: {
          q: 'Baklava ne kadar dayanır?',
          a: 'Oda sıcaklığında, iyi kapalı bir şekilde 5 güne kadar — doku ilk 48 saatte en iyi. Buzdolabında saklama; soğuk çıtır katmanları mahveder. Dondurmak için şerbeti eklemeden önce dondur; donmuş hâlde pişir, sonra her zamanki gibi şerbet dök.',
        },
        ES: {
          q: '¿Cuánto dura el baklava?',
          a: 'A temperatura ambiente, bien cubierto, hasta 5 días — la textura es mejor en las primeras 48 horas. No refrigeres; el frío arruina las capas crujientes. Para congelar, hazlo antes de añadir el almíbar; hornea desde congelado y luego añade el almíbar como de costumbre.',
        },
      },
    },
  ],

  nutrition: {
    calories: 340,
    proteinG: 5,
    proteinDailyPct: 10,
    carbsG: 35,
    carbsDailyPct: 13,
    fatG: 22,
    fatDailyPct: 28,
    fiberG: 2,
    fiberDailyPct: 7,
    sugarG: 22,
    sodiumMg: 80,
    sodiumDailyPct: 4,
  },

  categorySlugs: ['desserts', 'bakery'],
  tagSlugs: ['holiday', 'comfort-food', 'make-ahead'],
  dietSlugs: ['vegetarian', 'halal'],
  allergens: [
    { slug: 'gluten', presence: 'CONTAINS' },
    { slug: 'milk', presence: 'CONTAINS' },
    { slug: 'tree-nuts', presence: 'CONTAINS' },
    { slug: 'eggs', presence: 'FREE' },
    { slug: 'fish', presence: 'FREE' },
    { slug: 'crustaceans', presence: 'FREE' },
    { slug: 'peanuts', presence: 'FREE' },
    { slug: 'soybeans', presence: 'FREE' },
    { slug: 'sesame', presence: 'FREE' },
    { slug: 'celery', presence: 'FREE' },
    { slug: 'mustard', presence: 'FREE' },
    { slug: 'sulphites', presence: 'MAY_CONTAIN' },
    { slug: 'lupin', presence: 'FREE' },
    { slug: 'molluscs', presence: 'FREE' },
  ],

  gallery: [
    {
      cloudinaryId: 'tcd/seed/classic-baklava/gallery-1',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 0,
      translations: {
        EN: { alt: 'Diamond-cut baklava in golden phyllo, sprinkled with crushed pistachios on a brass tray' },
        TR: { alt: 'Pirinç tepside altın renkli yufkayla baklava şeklinde kesilmiş, üzerine çekilmiş Antep fıstığı serpilmiş baklava' },
        ES: { alt: 'Baklava cortado en rombos con masa filo dorada, espolvoreado con pistachos triturados en una bandeja de latón' },
      },
    },
    {
      cloudinaryId: 'tcd/seed/classic-baklava/gallery-2',
      w: 1600,
      h: 1200,
      blurhash: null,
      position: 1,
      translations: {
        EN: { alt: 'Macro view of layered baklava cross-section showing crisp phyllo and walnut–pistachio filling' },
        TR: { alt: 'Çıtır yufkayı ve ceviz–fıstık iç harcını gösteren baklava enine kesitinin makro görüntüsü' },
        ES: { alt: 'Vista macro de la sección transversal del baklava mostrando masa filo crujiente y relleno de nueces y pistachos' },
      },
    },
  ],

  reviews: [
    {
      rating: 5,
      authorLocale: 'TR',
      body: {
        EN: 'My family said it tastes like the baklava from Gaziantep. The cold-syrup-on-hot-baklava rule is everything.',
        TR: 'Ailem Antep baklavası gibi olduğunu söyledi. Sıcak baklavaya soğuk şerbet kuralı her şey.',
        ES: 'Mi familia dijo que sabe como el baklava de Gaziantep. La regla del almíbar frío sobre baklava caliente lo es todo.',
      },
    },
    {
      rating: 5,
      authorLocale: 'EN',
      body: {
        EN: 'First-time baklava maker. The damp towel tip saved me. Result was crackly, syrup-soaked, perfect.',
        TR: 'İlk kez baklava yaptım. Nemli bez ipucu beni kurtardı. Sonuç çıtır, şerbete batmış, mükemmel oldu.',
        ES: 'Mi primer baklava. El consejo del paño húmedo me salvó. El resultado fue crujiente, empapado en almíbar, perfecto.',
      },
    },
    {
      rating: 4,
      authorLocale: 'ES',
      body: {
        EN: 'Took longer than 90 minutes for me — closer to 2 hours including waiting. Worth it but plan ahead.',
        TR: 'Bende 90 dakikadan uzun sürdü — bekleme dâhil 2 saate yakın. Değer ama önceden planla.',
        ES: 'Me llevó más de 90 minutos — más cerca de 2 horas incluyendo la espera. Vale la pena pero planifica con antelación.',
      },
    },
  ],
}
