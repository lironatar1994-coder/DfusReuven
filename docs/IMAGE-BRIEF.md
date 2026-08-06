# Image production brief — דפוס ראובן

**Audience for this document: an AI agent (or photographer) producing the final imagery.**

The site currently ships 18 hand-built SVG mock-ups as placeholders. They load fast and
read as intentional, but they are illustrations of products, not products. Replacing them
with real imagery is the single largest remaining quality upgrade to the site.

Everything below is specified so the output drops straight into `public/images/` with no
code changes.

---

## 1. Non-negotiable constraints

Read this section before generating anything. Violating any of these produces images that
must be thrown away.

### 1.1 Hebrew text will be gibberish — plan around it

This is the most important rule in this document.

The site sells **printed Hebrew text**, and the audience reads Hebrew. Every current
image-generation model renders Hebrew as convincing-looking nonsense: correct letterforms,
meaningless words, often mirrored or with broken final letters (ך ם ן ף ץ). An Israeli
visitor spots this instantly, and on a print shop's website it destroys the credibility
the image was supposed to build.

Use one of these three strategies for **every** image. State which one you used.

| Strategy | When to use | How |
|---|---|---|
| **A — Out of legible range** | Default for most shots | Text is small, at a steep angle, behind shallow depth of field, or partially cropped. Nothing readable at 100% zoom. |
| **B — Abstract text blocks** | Product close-ups where text placement matters | Depict lines of text as clean solid bars / greeked blocks, as a designer's mockup would. Never letterforms. |
| **C — Composite real type afterwards** | **Required** for the hero and any hero-scale close-up | Generate the product blank (paper, foil, lighting, shadows) and composite real Hebrew typography in afterwards in a layout tool. |

**Never** attempt to have the model write: דפוס ראובן, a phone number, an address, or any
Hebrew word intended to be read. Latin text is also risky — avoid it too.

### 1.2 No real brands, no invented ones that look real

Do not depict Coca-Cola, Osem, Super-Pharm, or any actual company's branding. Equally, do
not invent a logo so specific it reads as a real business the shop can't prove it worked
for. Use abstract marks: a geometric monogram, a simple glyph, a colour block.

### 1.3 Every image must survive a square crop

Most images are reused at three different aspect ratios by CSS `object-fit: cover`, which
**centre-crops**. An image composed for 4:3 with the subject at the left edge will have its
subject sliced off in the 1:1 portfolio grid.

**Compose the subject inside the central square.** Treat the outer left/right thirds as
bleed that may vanish. The per-image table below lists exactly which crops each file must
survive.

### 1.4 Colour harmony with the site

Site palette: deep navy `#102033`, royal blue `#1769E0`, pale blue `#EAF2FF`, warm paper
`#F7F7F5`, white.

Depicted printed artwork should sit in the **blue / navy / neutral / warm-paper** family,
with metallic gold or silver foil as the accent. Small amounts of a second accent are fine.

**Avoid orange and red-dominant artwork** — it clashes with the site's blue and was
explicitly excluded from the brand direction. Avoid heavily saturated multi-colour designs;
they fight the interface.

### 1.5 Authenticity over polish

This is a working print shop, not a stock-photo studio. Slight paper curl, a real workbench,
a hand in frame, honest dust on a machine — all good. Avoid: floating products on pure white
voids, lens flares, exaggerated bokeh, glossy 3D-render look, obviously fake reflections,
and the "AI product photo" look of impossible symmetry and plastic surfaces.

---

## 2. Technical delivery spec

| Property | Value |
|---|---|
| Format | WebP (primary). Also keep a lossless PNG/TIFF master. |
| Quality | WebP q80–85 |
| Colour profile | sRGB |
| Delivery size | **2× the listed display size** (retina). See per-image table. |
| Max file weight | 250 KB per WebP; hero may go to 400 KB |
| Filenames | Exactly as listed — keep the `.svg` names but change the extension to `.webp` |
| Location | `public/images/` |

### After delivering the files

The image paths live in three data files. Replace `.svg` with `.webp` in:

- `src/data/catalog.ts` — service and product images, plus each product's 4-shot gallery
- `src/data/content.ts` — portfolio items
- `src/data/situations.ts` — situation pages
- `src/lib/site.ts` — `socialImage`

A single find-and-replace of `.svg"` → `.webp"` across those four files is sufficient.

**Do not change the `alt` text** unless the image no longer matches it. The alt strings are
already written in Hebrew and describe the intended subject — they are quoted per image
below and act as the acceptance criterion. If your image doesn't match the alt, the image
is wrong, not the alt.

---

## 3. Global art direction

**One studio, one day, one photographer.** All 18 images must look like a single shoot.
Consistency matters more than any individual frame being spectacular.

- **Light:** large soft key from the upper left, gentle fall-off, soft-edged shadows.
  Slightly warm daylight (~5200K). No hard specular hotspots on paper.
- **Surfaces:** warm off-white paper `#F7F7F5`-ish, pale concrete, light oak, or brushed
  steel workbench. Never pure `#FFFFFF` seamless.
- **Angle:** mostly flat-lay directly overhead, or a low 15–25° three-quarter view. Keep the
  camera consistent across the set.
- **Depth of field:** moderate. Enough to feel like a real lens; not so shallow that the
  product is unreadable.
- **Colour grade:** neutral to slightly warm, gentle contrast, no crushed blacks, no teal-orange.
- **Negative space:** leave calm areas — several of these sit behind text or beside headings.

---

## 4. Image-by-image specification

Display size is the CSS box; **generate at 2×**.

### Group A — Service cards (6 images)

Shown in a 16:10 card on the services grid, and several are reused in the 1:1 / 3:4
portfolio grid. Native size 800×500 → **generate 1600×1000**.

---

#### `svc-business.webp`
- **Crops to survive:** 16:10, 4:3, 1:1
- **Alt (must match):** ניירת משרדית ממותגת, קטלוג וכרטיסי ביקור מודפסים
- **Subject:** A complete branded office stationery set laid out flat: letterhead sheets, a
  DL envelope, a presentation folder, and a small stack of business cards.
- **Composition:** Overhead flat-lay on warm pale grey. Items overlapping slightly at
  gentle angles, arranged so the business-card stack and folder sit dead centre.
- **Text policy:** B — greeked bars for body copy; abstract navy monogram as the logo.
- **Prompt:** *Overhead flat lay photograph of a complete branded office stationery set on a
  warm off-white desk surface: letterhead sheets, a printed envelope, a presentation folder,
  and a stack of business cards. Deep navy and royal blue brand colours on white paper.
  Text rendered as clean abstract typographic bars, not readable letters. Soft large
  window light from upper left, gentle natural shadows, subtle paper texture. Editorial
  print-studio photography, neutral colour grade, realistic, not a 3D render.*

---

#### `svc-invitations.webp`
- **Crops to survive:** 16:10, 4:3, 1:1
- **Alt:** הזמנה לחתונה עם פויל זהב ומעטפה תואמת
- **Subject:** A wedding invitation with gold foil detailing, its matching envelope, and a
  small RSVP card.
- **Composition:** Overhead, invitation centred, envelope angled beneath it, RSVP card
  peeking from the side. Textured cream paper stock clearly visible.
- **Text policy:** C — generate the card blank with foil ornament only; composite Hebrew
  type afterwards if any is needed. Foil ornament alone is acceptable and preferred.
- **Prompt:** *Overhead photograph of a luxury wedding invitation on thick textured cream
  cotton paper with real gold foil stamping, beside its matching envelope and a small
  reply card. Raking soft light catching the metallic foil so it genuinely shines. Visible
  deckled paper fibre texture. No readable text — decorative gold foil ornament only.
  Elegant, restrained, editorial stationery photography.*

---

#### `svc-signage.webp`
- **Crops to survive:** 16:10, 4:3, 1:1
- **Alt:** שלט חזית לעסק, רולאפ ושמשונית מודפסת
- **Subject:** Signage group — a roll-up banner stand, a rolled PVC banner, and a flat
  panel sign leaning against a wall.
- **Composition:** Eye-level, in a workshop or against a plain concrete wall. Roll-up centred.
- **Text policy:** A — signage graphics as bold abstract colour fields and shapes, viewed at
  enough angle that nothing is readable.
- **Prompt:** *Photograph of finished large-format signage in a print workshop: an aluminium
  roll-up banner stand displaying a bold abstract blue and navy graphic, a rolled PVC banner
  leaning beside it, and a flat rigid sign panel against a pale concrete wall. Slight
  three-quarter angle so graphics are not readable. Industrial but clean, soft daylight,
  realistic workshop environment.*

---

#### `svc-stickers.webp`
- **Crops to survive:** 16:10, 4:3, 1:1
- **Alt:** גליל מדבקות, תוויות מוצר ואריזת קרטון ממותגת
- **Subject:** A roll of die-cut labels, loose product stickers, and a branded kraft carton.
- **Composition:** Overhead, roll partially unwound so the repeating label pitch is visible.
  Carton at the rear providing height.
- **Text policy:** B — labels carry abstract marks and greeked bars.
- **Prompt:** *Overhead photograph of a roll of glossy die-cut product labels partially
  unwound across a warm off-white surface, with loose circular and rectangular stickers
  scattered nearby and a small branded kraft cardboard box behind. Navy and royal blue
  abstract label design, no readable text. Visible label backing paper and cut lines. Soft
  even studio light, crisp detail, realistic product photography.*

---

#### `svc-promo.webp`
- **Crops to survive:** 16:10, 4:3, 1:1
- **Alt:** מוצרי פרסום ממותגים: חולצה, ספל, עטים ומגנט
- **Subject:** Branded merchandise set — folded t-shirt, ceramic mug, pens, notebook.
- **Composition:** Overhead flat-lay, mug centred, shirt folded neatly beneath, pens angled.
- **Text policy:** A/B — small abstract logo mark on mug and shirt, no words.
- **Prompt:** *Overhead flat lay of branded corporate merchandise on a warm neutral surface:
  a neatly folded navy cotton t-shirt, a white ceramic mug, two pens, and a hardcover
  notebook. All carrying the same small abstract geometric logo mark in royal blue — no
  readable words. Soft daylight, natural fabric texture, realistic merchandise photography.*

---

#### `svc-design.webp`
- **Crops to survive:** 16:10, 4:3, 1:1
- **Alt:** עבודת עיצוב לוגו על מסך עם דוגמאות צבע וכלי עיצוב
- **Subject:** A designer's desk mid-project: monitor showing layout work, printed proofs,
  Pantone-style colour swatch fan, pencil.
- **Composition:** Slight overhead three-quarter. Screen at rear, swatch fan opened centre.
- **Text policy:** A — screen content is a layout of shapes and greeked blocks, shot at an
  angle and slightly out of focus.
- **Prompt:** *A graphic designer's workspace photographed from a slight overhead angle: a
  monitor at the back showing an abstract layout of shapes and blocks (screen slightly out
  of focus, nothing readable), an opened colour swatch fan in blues fanned across the desk,
  printed paper proofs, and a pencil. Warm daylight from a window, shallow but usable depth
  of field, authentic working desk, not staged-perfect.*

---

### Group B — Product shots (8 images)

Primary use is the 4:3 product card and the large 4:3 product-page gallery. Several are
reused at 1:1 and 3:4. Native 800×600 → **generate 1600×1200**.

These are the money shots. They must make the product look worth paying for.

---

#### `prod-business-cards.webp`
- **Crops:** 4:3, 1:1, 3:4
- **Alt:** כרטיסי ביקור כהים עם הדפסה בצבע מלא ולמינציה מטית
- **Subject:** A stack of thick dark navy business cards with soft-touch matte lamination,
  one card fanned off the top, edges clearly showing card thickness.
- **Text policy:** C strongly preferred — generate the card face with only an abstract mark,
  composite Hebrew type after if wanted.
- **Prompt:** *Macro photograph of a stack of premium dark navy business cards with soft-touch
  matte lamination, one card lifted and angled off the stack. Thick 400gsm card edges clearly
  visible showing the paper core. Small abstract royal blue geometric mark on the face, no
  readable text. Raking soft light revealing the velvety matte surface texture. Shallow depth
  of field, warm neutral background, premium print photography.*

---

#### `prod-flyers.webp`
- **Crops:** 4:3, 1:1
- **Alt:** פליירים צבעוניים בגודל A5 ו-A4
- **Subject:** A fanned spread of A5 flyers, plus a folded one showing both sides.
- **Text policy:** B — layout blocks and image placeholders, no readable copy.
- **Prompt:** *Overhead photograph of a fan of freshly printed A5 flyers spread across a warm
  off-white surface, one flyer folded to show the reverse side. Clean editorial layout of blue
  and navy colour blocks and abstract typographic bars, no readable text. Glossy coated paper
  catching soft light. Crisp, bright, realistic print-shop photography.*

---

#### `prod-invitations.webp`
- **Crops:** 4:3, 1:1, **3:4 (tall portfolio tile — compose vertically-safe)**
- **Alt:** הזמנה לחתונה עם פויל זהב ומעטפה
- **Subject:** Hero-grade invitation shot. Single invitation, gold foil, envelope, ribbon or
  dried floral sprig.
- **Note:** This is the most-reused image on the site (product card, product gallery,
  portfolio tall tile, wedding situation page). Give it the most attention.
- **Text policy:** C — required.
- **Prompt:** *Elegant overhead photograph of a single wedding invitation on heavy textured
  ecru cotton paper with gold foil stamped border and ornament, resting on its matching
  envelope, with a small dried floral sprig beside it. Warm directional light raking across
  the surface so the foil catches a genuine metallic highlight and the paper texture is
  visible. Composed centrally with generous calm negative space around it. No readable text,
  decorative foil only. Refined, editorial, luxury stationery photography.*

---

#### `prod-stickers.webp`
- **Crops:** 4:3, 1:1
- **Alt:** מדבקות עגולות ומדבקות דייקאט בגזירה אישית
- **Subject:** Die-cut stickers in several shapes on a backing sheet, one peeled up at the corner.
- **Text policy:** B.
- **Prompt:** *Close-up overhead photograph of glossy vinyl die-cut stickers on a white backing
  sheet — circles, rounded squares and a custom shape — with one sticker peeled halfway up at
  the corner to show the adhesive and the cut line. Navy and royal blue abstract designs, no
  readable text. Sharp detail on the die-cut edges, soft even light, subtle glossy reflection.*

---

#### `prod-receipts.webp`
- **Crops:** 4:3, 1:1
- **Alt:** פנקס קבלות ממוספר עם העתקים
- **Subject:** A carbonless receipt book, open, showing the white/yellow/pink NCR copies and
  the glued top binding.
- **Text policy:** B — ruled lines and empty fields only. **This is easy to get right:** a
  blank receipt book is genuinely mostly ruled lines and boxes.
- **Prompt:** *Photograph of an open carbonless receipt book on a wooden desk, showing the
  three NCR copies in white, yellow and pink, the ruled table grid, empty fields, and the
  glued cardboard top binding. Blank unfilled form — ruled lines and boxes only, no readable
  text. A pen resting beside it. Natural desk light, authentic small-business feel, slightly
  worn realistic surface.*

---

#### `prod-rollup.webp`
- **Crops:** 4:3, 1:1, **3:4 (tall tile)**
- **Alt:** רולאפ שיווקי 85 על 200 ס״מ עם מעמד
- **Subject:** A full roll-up banner standing, shot slightly from below, in a clean space.
- **Composition:** Vertical subject — works naturally for the 3:4 tile. Keep the stand base
  and the top of the banner both in frame in the 4:3 version.
- **Text policy:** A — bold abstract graphic, shot at slight angle.
- **Prompt:** *Photograph of a professional roll-up banner stand fully extended in a clean
  bright exhibition space, shot from a slightly low angle. The banner displays a bold abstract
  graphic composition in navy and royal blue with large shapes — no readable text. Aluminium
  base visible on a polished concrete floor. Soft even ambient light, subtle floor shadow,
  realistic trade-show environment with a plain out-of-focus background.*

---

#### `prod-banner.webp`
- **Crops:** 4:3, 1:1
- **Alt:** שמשונית מודפסת עם עיניות מתכת
- **Subject:** A PVC banner with metal eyelets, either tensioned on a fence or held taut.
- **Text policy:** A — abstract graphic, partially angled.
- **Prompt:** *Photograph of a large printed PVC vinyl banner stretched taut and secured with
  brass metal eyelets and cable ties, outdoors against a plain wall in overcast daylight.
  Close enough to show the eyelet hardware, the hemmed edge and the vinyl weave texture.
  Bold abstract blue graphic, no readable text. Natural outdoor light, realistic, slightly
  weathered environment.*

---

#### `prod-signs.webp`
- **Crops:** 4:3, 1:1
- **Alt:** שלט חזית מואר לעסק
- **Subject:** An illuminated storefront fascia sign with dimensional lettering, shot at dusk.
- **Text policy:** **C or A.** Dimensional Hebrew letters are the hardest thing on this list
  for a model to render. Either composite real letters, or shoot the sign at a steep raking
  angle / partially cropped so the letterforms are abstract shapes.
- **Prompt:** *Photograph of an illuminated storefront fascia sign at blue hour, with
  dimensional acrylic letters lit by warm halo backlighting against a dark navy panel. Shot
  from a steep side angle so the letterforms read as abstract illuminated shapes rather than
  words. Clean modern shopfront, glass below, subtle reflections on the pavement. Moody but
  inviting, realistic architectural photography.*

---

### Group C — Atmosphere and craft (3 images)

Displayed at natural ratio inside `.media-stack` — no aggressive cropping, so composition is
freer. Native 800×600 → **generate 1600×1200**.

---

#### `about-studio.webp`
- **Alt:** מעצב עובד בסטודיו של דפוס ראובן לצד מכונת הדפוס
- **Subject:** A person working — the human proof behind "שירות אישי". A designer at a desk
  reviewing a printed proof, press visible behind.
- **Note:** **If a real photo of Reuven or the actual team can be taken, use it instead.**
  A genuine photo of the actual owner beats any generated image for a local business, and
  this is the one slot where that difference is largest.
- **Text policy:** A — proof sheet at an angle, out of legible focus.
- **Prompt:** *Documentary-style photograph of a print professional in their forties standing
  at a workbench examining a freshly printed proof sheet held up to the light, with a large
  offset printing press softly out of focus behind them. Warm practical workshop lighting,
  natural skin tones, a genuine working environment with paper stacks and tools. Candid, not
  posed. The proof sheet is angled away so its content is not readable. Honest editorial
  portrait photography.*

---

#### `finishes.webp`
- **Alt:** דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים
- **Subject:** The craft close-up. A fan of paper swatches and finishing samples: gold foil,
  blind emboss, soft-touch matte, spot UV.
- **Note:** This is the image that proves expertise. Prioritise it after the hero and invitations.
- **Text policy:** A — samples show ornament and texture, not words.
- **Prompt:** *Macro photograph of a fanned array of premium paper stock swatches and print
  finishing samples on a warm neutral surface: gold foil stamping, blind deboss with visible
  relief shadow, soft-touch matte lamination, and spot gloss UV varnish catching the light.
  Raking side light to reveal every surface texture and the depth of the emboss. Rich tactile
  detail, shallow depth of field, blue and navy and metallic palette. No readable text —
  ornamental patterns only.*

---

#### `machine.webp`
- **Alt:** מכונת דפוס אופסט בעבודה
- **Subject:** An offset press running. Ink rollers, CMYK visible, sheets in the delivery.
- **Text policy:** A — printed sheets blurred by motion or angle.
- **Prompt:** *Photograph of a working offset printing press mid-run in a print shop, showing
  the inking rollers with visible cyan, magenta, yellow and black ink, the control console,
  and printed sheets stacking in the delivery tray. Slight motion blur on the moving sheets.
  Industrial workshop lighting, authentic machinery with honest wear, deep colour, realistic
  documentary photography. Printed content not readable.*

---

### Group D — Hero (1 image)

#### `hero-collage.webp`
- **Display:** 900×720 → **generate 1800×1440**
- **Crops:** displayed at natural ratio, but the `.ticket-tag` overlay sits over the
  **bottom-left corner** (in RTL layout) — keep that area visually calm.
- **Alt:** קולאז' של מוצרי דפוס: כרטיסי ביקור, הזמנה עם פויל זהב, פלייר, אריזה ממותגת ומדבקות בגליל
- **Subject:** The single most important image on the site. An overhead spread showing the
  breadth of what the shop makes: business cards, a foiled invitation, a flyer, a branded
  carton, a roll of stickers, paper swatches.
- **Text policy:** **C — required.** This image is seen large, first, by every visitor. Any
  gibberish Hebrew here is fatal. Generate the products blank and composite real type, or
  keep every surface to abstract marks and foil ornament.
- **Composition notes:** Arrange as a considered flat-lay with breathing room, not a cluttered
  pile. Bottom-left quadrant should be the calmest area (overlay sits there). Slight
  overlapping and varied heights give depth.
- **Prompt:** *Overhead flat lay photograph showing the range of a premium print shop's work,
  arranged with editorial care on a warm off-white surface: a stack of dark navy business
  cards, a cream wedding invitation with gold foil, a folded flyer, a small branded kraft
  carton, a partially unwound roll of labels, and a fan of paper swatches. Deep navy, royal
  blue, warm paper white and metallic gold palette. Soft large window light from upper left
  with gentle natural shadows. Generous negative space, especially in the lower left. Every
  printed surface carries abstract marks and foil ornament only — no readable text.
  Sophisticated, tactile, premium editorial print photography. Not a 3D render.*

---

### Group E — New image to add (1)

#### `og-image.webp` — **does not exist yet**
- **Size:** 1200×630 exactly (Open Graph / WhatsApp preview standard)
- **Used by:** `src/lib/site.ts` → `socialImage`. Currently points at the hero, which is the
  wrong aspect ratio and gets badly cropped in WhatsApp previews — which matters here, since
  WhatsApp is a primary sharing channel for this business.
- **Subject:** A simplified version of the hero flat-lay, composed for a wide 1.91:1 frame,
  with clear space on one side where the site name can be composited.
- **Text policy:** C — composite "דפוס ראובן" and "עיצוב • דפוס • שילוט" in real type afterwards
  using the site fonts (Miriam Libre for the name, Heebo for the tagline).
- **Prompt:** *Wide 1200x630 overhead flat lay of premium printed products on a warm off-white
  surface — navy business cards, a gold-foiled invitation, and paper swatches — arranged along
  the right side of the frame, leaving the left third as clean empty surface for text overlay.
  Soft window light, gentle shadows, navy and gold and warm paper palette. No text in the
  image. Premium editorial print photography.*
- **After generating:** composite the Hebrew wordmark into the empty third, then set
  `socialImage: "/images/og-image.webp"` in `src/lib/site.ts`.

---

## 5. Acceptance checklist

Run through this per image before delivering.

- [ ] **No readable Hebrew or Latin text anywhere.** Zoom to 100% and check every surface.
- [ ] Hebrew final letters (ך ם ן ף ץ) do not appear mangled — because no letters appear at all.
- [ ] No real company logos; no invented logo specific enough to read as a real business.
- [ ] Subject survives a centre crop to 1:1 (and 3:4 where listed) without losing its point.
- [ ] Palette sits in navy / blue / neutral / warm paper, with metallic accents. No orange.
- [ ] Lighting direction and colour grade match the rest of the set.
- [ ] Looks photographed, not rendered — no plastic surfaces, no impossible symmetry.
- [ ] Paper thickness, texture and edges are visible where the product is paper.
- [ ] Delivered at 2× at the listed dimensions, WebP, sRGB, under the weight budget.
- [ ] Filename matches exactly.
- [ ] The Hebrew `alt` text in the code is still a truthful description of the image.

## 6. Priority order

If the whole set can't be produced at once, this is the order that buys the most:

1. `hero-collage` — first thing every visitor sees
2. `prod-invitations` — most-reused image on the site, and the highest-margin product
3. `finishes` — the image that proves craftsmanship
4. `about-studio` — the human proof behind "personal service" (**use a real photo if possible**)
5. `prod-business-cards` — most-requested product
6. `machine` — capability proof
7. Remaining product shots
8. Remaining service cards
9. `og-image`

## 7. What not to do

- Don't generate a single wide image and slice it into the set — they need distinct subjects.
- Don't upscale a low-resolution generation to hit the 2× requirement.
- Don't add watermarks, borders, drop shadows, or rounded corners. The CSS handles framing;
  baked-in styling fights it.
- Don't include people's faces in product shots — only in `about-studio`.
- Don't deliver PNG-with-transparency expecting the site to composite it; these are
  full-bleed photographs behind `object-fit: cover`.
