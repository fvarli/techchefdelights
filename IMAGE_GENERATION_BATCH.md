# AI Image Generation Batch

Copy-paste-ready prompts for every recipe in `content/image-manifest.ts`. Generated once, kept in sync with the manifest manually — when you change a prompt in this file, also change it in the manifest (and vice versa).

**Read first:** [`IMAGE_WORKFLOW.md`](./IMAGE_WORKFLOW.md) for the full workflow, the brand style guide rationale, the alt-text rules, the upload conventions, and the validator. This document is just the **operational batch** — the actual generation queue.

---

## How to use this document

1. Pick a recipe. Each recipe has three blocks: **hero**, **gallery-1**, **gallery-2**.
2. For each block, paste the **brand style** + **subject prompt** + **negative prompt** into your AI image generator. Set the listed aspect ratio.
3. Generate. Run the **manual review checklist** at the bottom of each block. Regenerate until it passes.
4. **Save the file locally** with the suggested filename — that name maps 1:1 to the Cloudinary `public_id`.
5. Upload to Cloudinary at the listed `target publicId`. Capture width × height from the upload response.
6. Update `content/image-manifest.ts` for that entry: bump `status` to `'uploaded'` (or `'approved'` after final review), set `width`, `height`, `aspectRatio`.
7. Run `IMAGES_STRICT=1 pnpm images:validate`.

## Brand style (paste into every prompt as a prefix)

```
Natural food photography, soft daylight, slight overhead angle (~35°),
shallow depth of field. Hand-thrown ceramic plate or wooden surface.
Muted earthy palette: warm whites, terra-cotta, sage green, deep rust.
Realistic ingredients in their natural state. No utensils unless the
dish requires them. No text, no logos, no watermarks. Centered
composition with breathing room.
```

## Negative prompt (paste into every prompt's negative field)

```
no text, no captions, no watermarks, no logos, no brand marks,
no impossible food shapes, no stock-photo plastic gloss, no overhead
flat-lay (for hero), no garnish that doesn't appear in the recipe,
no extra hands, no plastic packaging.
```

## File naming convention (before Cloudinary upload)

Save downloads as the **last segment** of the target Cloudinary `public_id`, with a recipe-slug prefix so the file system stays sorted. Recommended local pattern:

```
~/tcd-images/<en-slug>/<role>(-N).<ext>

red-lentil-soup-hero.jpg
red-lentil-soup-gallery-1.jpg
red-lentil-soup-gallery-2.jpg
miso-butter-spaghetti-hero.jpg
…
```

When uploading to Cloudinary, set the `public_id` field explicitly to `recipes/<en-slug>/<role>(-N)` (no extension — Cloudinary appends it). Do **not** rely on auto-derived public IDs from the filename; they pick up timestamps and numeric suffixes that break the convention.

## Aspect ratio targets (matches `ASPECT_BY_ROLE` in `scripts/validate-images.ts`)

| Role | Allowed | Pick |
|---|---|---|
| `hero` | `16:9`, `4:3` | **16:9** for cinematic hero block |
| `gallery-1` (wider angle) | `4:3`, `1:1` | **4:3** |
| `gallery-2` (close-up) | `4:3`, `1:1` | **1:1** |
| `step` (future) | `4:3` | 4:3 |
| `og` (override only) | `1200x630` | 1200×630 exact |

## Per-block manual review checklist

Run before flipping `status` from `generated` to `uploaded`:

- [ ] No text, captions, watermarks, or logos visible anywhere
- [ ] Brand palette held: warm whites, terra-cotta, sage green, deep rust
- [ ] Garnishes in the photo actually appear in the recipe (no rogue chillies on the cheesecake, etc.)
- [ ] Lighting is soft daylight, not harsh studio or blue-tinted
- [ ] Plate / bowl / surface is hand-thrown ceramic or natural wood — not white plastic, hospital-style, or printed pattern
- [ ] No impossible food shapes (perfect spheres of soup, geometric noodles, etc.)
- [ ] No extra hands or utensils intruding unless the recipe requires them
- [ ] Aspect ratio matches the role target (16:9 hero / 4:3 gallery-1 / 1:1 gallery-2)
- [ ] Filename follows the local naming convention above

---

## 1. Red Lentil Soup

Slug: `red-lentil-soup`

### 1.1 Hero — `recipes/red-lentil-soup/hero`

- **Aspect ratio:** 16:9 (or 4:3)
- **Local filename:** `red-lentil-soup-hero.jpg`
- **Alt EN:** Bowl of red lentil soup with lemon wedge and dried mint
- **Alt TR:** Limon ve kuru naneli bir kâse mercimek çorbası
- **Alt ES:** Cuenco de sopa de lentejas rojas con limón y menta seca

```
[brand style] Subject: a steaming bowl of velvety red lentil soup
garnished with a lemon wedge and a sprinkle of dried mint. Plating:
rustic ceramic bowl on a linen-lined wooden table.
[negative prompt]
```

### 1.2 Gallery-1 — `recipes/red-lentil-soup/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `red-lentil-soup-gallery-1.jpg`
- **Alt EN:** Wider table view: bowl of soup, lemon halves, mint sprig, spoon resting on linen
- **Alt TR:** Geniş masa görüntüsü: çorba kâsesi, limon yarımları, nane dalı, kaşık keten üzerinde
- **Alt ES:** Vista amplia de la mesa: cuenco de sopa, mitades de limón, ramita de menta, cuchara sobre lino

```
[brand style] Subject: wider table-top scene: the same bowl of red
lentil soup with two lemon halves, a small ramekin of dried mint and
a fresh mint sprig, an old silver spoon resting on a linen napkin.
Composition: 4:3 with breathing room around the bowl.
[negative prompt]
```

### 1.3 Gallery-2 — `recipes/red-lentil-soup/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `red-lentil-soup-gallery-2.jpg`
- **Alt EN:** Close-up of soup texture with mint flecks and a glistening drizzle of olive oil
- **Alt TR:** Çorba dokusunun yakın çekimi: nane kırıkları ve parlayan zeytinyağı damlaları
- **Alt ES:** Primer plano de la textura de la sopa con motas de menta y un hilo brillante de aceite de oliva

```
[brand style] Subject: tight square close-up of the soup's velvety
surface, showing flecks of dried mint and a thin drizzle of olive oil
catching the light. Composition: 1:1, fills the frame.
[negative prompt]
```

---

## 2. Miso Butter Spaghetti

Slug: `miso-butter-spaghetti`

### 2.1 Hero — `recipes/miso-butter-spaghetti/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `miso-butter-spaghetti-hero.jpg`
- **Alt EN:** Plate of glossy spaghetti tossed in miso butter with chives
- **Alt TR:** Frenk soğanı ile miso tereyağında karıştırılmış parlak spagetti tabağı
- **Alt ES:** Plato de espaguetis brillantes con mantequilla de miso y cebollino

```
[brand style] Subject: a twirled mound of glossy spaghetti coated in
golden miso butter, finished with thinly sliced chives. Plating:
shallow ceramic plate, fork half-tucked into the noodles.
[negative prompt]
```

### 2.2 Gallery-1 — `recipes/miso-butter-spaghetti/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `miso-butter-spaghetti-gallery-1.jpg`
- **Alt EN:** Skillet view: spaghetti being tossed with a wooden spatula, butter pooling at the edges
- **Alt TR:** Tava görüntüsü: spagetti tahta spatula ile karıştırılırken kenarlarda eriyen tereyağı
- **Alt ES:** Vista en sartén: espaguetis revueltos con espátula de madera y mantequilla derretida en los bordes

```
[brand style] Subject: a skillet on the stovetop with the spaghetti
mid-toss, a wooden spatula lifting strands, golden miso butter pooling
at the edges. Composition: 4:3, slightly higher angle to show the pan
contents.
[negative prompt]
```

### 2.3 Gallery-2 — `recipes/miso-butter-spaghetti/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `miso-butter-spaghetti-gallery-2.jpg`
- **Alt EN:** Close-up of glossy noodles wrapped around a fork with chives clinging to the strands
- **Alt TR:** Çatala sarılmış parlak makarnanın yakın çekimi, ipliklere yapışmış frenk soğanı parçaları
- **Alt ES:** Primer plano de fideos brillantes enrollados en un tenedor con cebollino adherido

```
[brand style] Subject: square close-up of glossy spaghetti strands
wrapped around a fork mid-twirl, chives clinging visibly. Composition:
1:1, focus on the texture.
[negative prompt]
```

---

## 3. Avocado Toast with Poached Egg

Slug: `avocado-toast`

### 3.1 Hero — `recipes/avocado-toast/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `avocado-toast-hero.jpg`
- **Alt EN:** Slice of sourdough toast with smashed avocado and a poached egg
- **Alt TR:** Ezilmiş avokado ve poşe yumurta ile ekşi maya tost dilimi
- **Alt ES:** Rebanada de pan de masa madre con aguacate machacado y huevo escalfado

```
[brand style] Subject: a thick slice of sourdough toast topped with
smashed avocado, a poached egg with a runny yolk just breaking, chili
flakes and flaky salt. Plating: small ceramic plate on a wooden board.
[negative prompt]
```

### 3.2 Gallery-1 — `recipes/avocado-toast/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `avocado-toast-gallery-1.jpg`
- **Alt EN:** Yolk break: a knife cutting into the poached egg, golden yolk running across the avocado
- **Alt TR:** Yumurta sarısı akıyor: bıçak poşe yumurtayı keserken sarının avokadoya yayılışı
- **Alt ES:** Yema rota: un cuchillo cortando el huevo escalfado, yema dorada corriendo sobre el aguacate

```
[brand style] Subject: action shot of a small kitchen knife cutting
into the poached egg on the toast, the runny golden yolk just starting
to spread over the smashed avocado. Composition: 4:3, slightly closer
in than the hero.
[negative prompt]
```

### 3.3 Gallery-2 — `recipes/avocado-toast/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `avocado-toast-gallery-2.jpg`
- **Alt EN:** Close-up of avocado texture with chili flakes and flaky salt scattered on top
- **Alt TR:** Avokado dokusunun yakın çekimi: üzerine serpilmiş kırmızı pul biber ve iri taneli tuz
- **Alt ES:** Primer plano de la textura del aguacate con copos de chile y sal en escamas espolvoreados encima

```
[brand style] Subject: square close-up of the smashed avocado surface
showing fork-mark texture, scattered chili flakes and flaky salt
crystals catching the light. Composition: 1:1.
[negative prompt]
```

---

## 4. Mediterranean Quinoa Salad

Slug: `mediterranean-quinoa-salad`

### 4.1 Hero — `recipes/mediterranean-quinoa-salad/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `mediterranean-quinoa-salad-hero.jpg`
- **Alt EN:** Bowl of quinoa salad with cherry tomatoes, cucumber, feta and herbs
- **Alt TR:** Kiraz domates, salatalık, beyaz peynir ve otlarla kinoa salatası
- **Alt ES:** Cuenco de ensalada de quinoa con tomates cherry, pepino, queso feta y hierbas

```
[brand style] Subject: a bright bowl of fluffy quinoa tossed with
halved cherry tomatoes, diced cucumber, crumbled feta, parsley and
mint, glistening with olive oil. Plating: wide shallow ceramic bowl.
[negative prompt]
```

### 4.2 Gallery-1 — `recipes/mediterranean-quinoa-salad/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `mediterranean-quinoa-salad-gallery-1.jpg`
- **Alt EN:** Hand drizzling olive oil over the salad bowl from a small ceramic jug
- **Alt TR:** Küçük seramik bir sürahiden salata kâsesinin üzerine zeytinyağı dökülüyor
- **Alt ES:** Mano vertiendo aceite de oliva sobre el cuenco de ensalada desde una pequeña jarra de cerámica

```
[brand style] Subject: a hand pouring a thin stream of olive oil from
a small ceramic jug over the salad bowl, droplets caught mid-fall.
Composition: 4:3.
[negative prompt]
```

### 4.3 Gallery-2 — `recipes/mediterranean-quinoa-salad/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `mediterranean-quinoa-salad-gallery-2.jpg`
- **Alt EN:** Close-up of cherry tomato halves, cucumber dice and feta crumbles in fluffy quinoa
- **Alt TR:** Yakın çekim: kabarık kinoa içinde kiraz domates yarımları, salatalık küpleri ve beyaz peynir kırıkları
- **Alt ES:** Primer plano de mitades de tomate cherry, dados de pepino y feta desmenuzado entre quinoa esponjosa

```
[brand style] Subject: square close-up of the salad showing the
texture of cooked quinoa with cherry tomato halves, cucumber dice
and feta crumbles. Composition: 1:1.
[negative prompt]
```

---

## 5. Classic Baklava

Slug: `classic-baklava`

### 5.1 Hero — `recipes/classic-baklava/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `classic-baklava-hero.jpg`
- **Alt EN:** Tray of golden baklava squares topped with crushed pistachios
- **Alt TR:** Üzeri kıyılmış antep fıstığı serpilmiş altın rengi baklava tepsisi
- **Alt ES:** Bandeja de baklava dorado cortado en cuadrados, con pistachos picados encima

```
[brand style] Subject: a tray of freshly cut golden baklava squares
glistening with syrup, generously topped with crushed pistachios.
Plating: matte tray on a linen-lined wooden surface.
[negative prompt]
```

### 5.2 Gallery-1 — `recipes/classic-baklava/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `classic-baklava-gallery-1.jpg`
- **Alt EN:** Two baklava squares plated with a small espresso cup and a fork
- **Alt TR:** İki dilim baklava, küçük bir espresso fincanı ve çatal ile servis edildi
- **Alt ES:** Dos cuadrados de baklava emplatados con una pequeña taza de espresso y un tenedor

```
[brand style] Subject: two baklava squares lifted onto a small ceramic
plate next to a tiny espresso cup and a brass fork, telling the
after-dinner story. Composition: 4:3.
[negative prompt]
```

### 5.3 Gallery-2 — `recipes/classic-baklava/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `classic-baklava-gallery-2.jpg`
- **Alt EN:** Macro of layered phyllo edges visible at the cut, syrup soaking into the layers
- **Alt TR:** Kesilmiş kenarda görünen yufka katlarının makro görüntüsü, şerbet katlara işliyor
- **Alt ES:** Macro de los bordes de las capas de pasta filo visibles en el corte, con almíbar empapando las capas

```
[brand style] Subject: square macro shot of a baklava cross-section
showing the many thin phyllo layers, syrup glistening between them,
a few pistachio fragments on top. Composition: 1:1, very tight crop.
[negative prompt]
```

---

## 6. Lemon Cheesecake

Slug: `lemon-cheesecake`

### 6.1 Hero — `recipes/lemon-cheesecake/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `lemon-cheesecake-hero.jpg`
- **Alt EN:** Slice of lemon cheesecake with a lemon zest curl on top
- **Alt TR:** Üzeri limon kabuğu kıvrımlı bir dilim limonlu cheesecake
- **Alt ES:** Porción de cheesecake de limón con una espiral de cáscara de limón encima

```
[brand style] Subject: a clean slice of pale yellow lemon cheesecake
on a small ceramic plate, a thin curl of lemon zest as garnish, golden
biscuit base just visible. Plating: small ceramic plate on a wooden
surface, fork resting beside it.
[negative prompt]
```

### 6.2 Gallery-1 — `recipes/lemon-cheesecake/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `lemon-cheesecake-gallery-1.jpg`
- **Alt EN:** Whole cheesecake on a stand with one slice removed, showing the soft yellow filling
- **Alt TR:** Standın üzerinde, bir dilimi alınmış bütün cheesecake; içindeki yumuşak sarı dolgu görünüyor
- **Alt ES:** Cheesecake entero en un soporte con una porción retirada, mostrando el relleno amarillo suave

```
[brand style] Subject: a whole pale-yellow lemon cheesecake on a low
ceramic stand with one wedge already removed, the cross-section
showing the smooth filling above the golden biscuit base.
Composition: 4:3.
[negative prompt]
```

### 6.3 Gallery-2 — `recipes/lemon-cheesecake/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `lemon-cheesecake-gallery-2.jpg`
- **Alt EN:** Close-up of the lemon zest curl glistening on the smooth cheesecake surface
- **Alt TR:** Pürüzsüz cheesecake yüzeyinde parlayan limon kabuğu kıvrımının yakın çekimi
- **Alt ES:** Primer plano de la espiral de cáscara de limón brillando sobre la superficie suave del cheesecake

```
[brand style] Subject: square close-up of the smooth pale-yellow
surface of the cheesecake with a single thin curl of lemon zest
catching the light. Composition: 1:1.
[negative prompt]
```

---

## 7. Dark Chocolate Soufflé

Slug: `dark-chocolate-souffle`

### 7.1 Hero — `recipes/dark-chocolate-souffle/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `dark-chocolate-souffle-hero.jpg`
- **Alt EN:** Individual dark chocolate soufflé in a ramekin, dusted with cocoa
- **Alt TR:** Kakao ile süslenmiş, ramekinde tek kişilik bitter çikolata sufle
- **Alt ES:** Suflé individual de chocolate negro en ramekin, espolvoreado con cacao

```
[brand style] Subject: a freshly baked dark chocolate soufflé just
out of the oven, risen above the rim of a small white ceramic ramekin,
dusted with cocoa powder. Plating: ramekin on a small saucer with a
spoon.
[negative prompt]
```

### 7.2 Gallery-1 — `recipes/dark-chocolate-souffle/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `dark-chocolate-souffle-gallery-1.jpg`
- **Alt EN:** Spoon breaking into the soufflé top, revealing the molten dark chocolate centre
- **Alt TR:** Kaşık suflenin üstünü kırarken ortaya çıkan akışkan bitter çikolata
- **Alt ES:** Cuchara rompiendo la parte superior del suflé, dejando ver el centro de chocolate negro fundente

```
[brand style] Subject: a small dessert spoon mid-break into the top of
the soufflé, exposing the dark molten centre, steam still curling up.
Composition: 4:3, slight angle from above.
[negative prompt]
```

### 7.3 Gallery-2 — `recipes/dark-chocolate-souffle/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `dark-chocolate-souffle-gallery-2.jpg`
- **Alt EN:** Close-up of cocoa-dusted soufflé top with cracked surface and risen edges
- **Alt TR:** Kakao ile süslenmiş sufle üstünün yakın çekimi: çatlamış yüzey ve yükselmiş kenarlar
- **Alt ES:** Primer plano de la parte superior del suflé espolvoreada con cacao, superficie agrietada y bordes elevados

```
[brand style] Subject: square close-up of the dark, cocoa-dusted top
of the soufflé showing the crackled surface and the risen edges above
the ramekin rim. Composition: 1:1.
[negative prompt]
```

---

## 8. Homemade Margherita Pizza

Slug: `margherita-pizza`

### 8.1 Hero — `recipes/margherita-pizza/hero`

- **Aspect ratio:** 16:9
- **Local filename:** `margherita-pizza-hero.jpg`
- **Alt EN:** Margherita pizza with bubbled crust, fresh mozzarella, tomato and basil
- **Alt TR:** Kabarmış hamuru, taze mozzarella, domates ve fesleğenli margherita pizza
- **Alt ES:** Pizza margarita con corteza burbujeante, mozzarella fresca, tomate y albahaca

```
[brand style] Subject: a freshly baked margherita pizza with a charred
bubbled crust, pools of melted fresh mozzarella, bright red tomato,
and whole basil leaves. Plating: pizza on a wooden peel.
[negative prompt]
```

### 8.2 Gallery-1 — `recipes/margherita-pizza/gallery-1`

- **Aspect ratio:** 4:3
- **Local filename:** `margherita-pizza-gallery-1.jpg`
- **Alt EN:** Slice being lifted with melted mozzarella stretching back to the pie
- **Alt TR:** Bir dilim kaldırılırken erimiş mozzarella iplerinin pizzayla bağlanışı
- **Alt ES:** Porción siendo levantada con mozzarella fundida estirándose hacia la pizza

```
[brand style] Subject: a single slice being lifted away from the pizza,
hot mozzarella stretching back to the rest of the pie in long strings.
Composition: 4:3, slight angle.
[negative prompt]
```

### 8.3 Gallery-2 — `recipes/margherita-pizza/gallery-2`

- **Aspect ratio:** 1:1
- **Local filename:** `margherita-pizza-gallery-2.jpg`
- **Alt EN:** Close-up of charred crust edge with bubbles and a basil leaf draped over melted mozzarella
- **Alt TR:** Yakın çekim: kabarcıklı, ateşte hafif kararmış hamur kenarı ve erimiş mozzarella üzerinde fesleğen
- **Alt ES:** Primer plano del borde de corteza chamuscada con burbujas y una hoja de albahaca sobre mozzarella fundida

```
[brand style] Subject: square close-up of the pizza edge showing the
charred bubbled crust and a single fresh basil leaf draped over a
pool of melted mozzarella. Composition: 1:1.
[negative prompt]
```

---

## Batch totals

- **8 recipes** × 3 images each = **24 images** to generate
- **8 hero** images (16:9 or 4:3) — required for production launch
- **8 gallery-1** images (4:3) — recommended, not strict
- **8 gallery-2** images (1:1) — recommended, not strict

When all 8 hero images are uploaded, reviewed, approved, dimensions captured, and the seed file's `Recipe.heroImageCloudinary` paths are flipped from `tcd/seed/<slug>/hero` to `recipes/<slug>/hero`, run:

```bash
IMAGES_STRICT=1 pnpm images:validate
```

It returns exit 0 — production gate clears for the hero requirement. Galleries can roll in across multiple batches without blocking promotion.
