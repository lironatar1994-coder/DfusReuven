# Image production brief — דפוס ראובן

**Audience for this document: an AI agent (or photographer) producing the final imagery.**

The site currently ships 18 hand-built SVG mock-ups as placeholders. They load fast and
read as intentional, but they are illustrations of products, not products. Replacing them
with real imagery is the single largest remaining quality upgrade to the site.

Everything in §4 drops straight into `public/images/` with no code changes. §5–§8 cover
assets the site needs but does not yet have a slot for — those require small code edits,
noted per item.

---

## 0. Coverage — read this first

There are two different questions, and they have different answers.

**"Does replacing the 19 files in §4 fix every image path in the code?"** Yes.

**"Is 19 images enough for this site?"** No. The site currently reuses a small pool of
images very heavily, because it was built with 18 placeholders wired into 60+ usages.
Measured from the code:

| Reuse problem | Measured |
|---|---|
| `svc-business` appears across the site | **8 times** |
| `machine` appears inside product galleries | **10 of 12 products** |
| `finishes` appears inside product galleries | **11 of 12 products** |
| Distinct images used across all 12 product galleries | **13** (ideal: 48) |
| Portfolio items drawn from the same shared pool | **12 of 12** |

The practical consequence: a visitor who opens three product pages sees the *same two
photographs* in half of every gallery, and the same business-stationery shot on the service
card, the situation page, and the portfolio grid. No amount of quality in an individual
frame fixes that — it needs more frames.

### What this document now covers

| § | Group | Count | Status |
|---|---|---|---|
| 4A–4E | Replacements for the existing 18 + `og-image` | 19 | Fixes all current paths |
| 5 | Brand & icon assets | 4 | **Missing entirely today** |
| 6 | Product gallery depth | 24 | Removes the repeated press/finish shots |
| 7 | Portfolio project photography | 12 | Removes portfolio/product duplication |
| 8 | Situation-page images | 4 | Currently reuse product shots |

**Minimum viable set: 19** (§4 only) — every path filled, repetition still visible.
**Recommended set: 35** (§4 + §5 + §7) — kills the two most noticeable duplications.
**Complete set: 63** — every slot has a purpose-shot frame.

### Not an image problem — don't try to generate these

- **The Google Map** on the contact page is a placeholder `<div>`, not an image. It needs a
  real embed (code), not a generated picture of a map. A fake map is worse than none.
- **Testimonial avatars** are CSS circles with a Hebrew initial. That is a deliberate
  choice — generated headshots of fake customers next to fabricated testimonials would be
  dishonest. Replace with real customer photos only if you have permission, otherwise leave.

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

## 3. Cultural register — בני ברק, קהל חרדי

**This is the section that most changes the output, and the one the first batch got wrong.**

The shop is on ז'בוטינסקי in בני ברק. Its customers are largely חרדי — businesses, gemachim,
mosdot, and families printing for a chasuna, bar mitzvah, brit or sheva brachos. The imagery
has to look like it was made for them, not for a wedding magazine.

### The register to aim for

Not *luxury European stationery boutique*. Aim for **a trusted neighbourhood press that
prints for the whole kehilla** — warm, exact, respectable, unpretentious. Quality shown
through craft and precision, not through expensive styling props.

### Styling that must go

The first batch leaned on a secular Pinterest-wedding vocabulary. Remove all of it:

| Do not use | Why |
|---|---|
| Dried hydrangeas, gypsophila, floral sprigs | Secular wedding-blog styling; not the visual world of a chasuna invitation |
| Draped silk / chiffon ribbon | Same |
| Marble slabs, terrazzo, designer concrete props | Reads as a design studio in Tel Aviv, not a press in בני ברק |
| Wax seals with botanical motifs | Not a convention in this market |
| Doily / scalloped lace edges | Reads Victorian-European |
| Islamic-geometry rosettes and mandalas | Wrong cultural reference for this customer |
| Eucalyptus, olive branches as decoration | Secular-Israeli design cliché |

### Styling that belongs

- **Surfaces:** plain wood, warm off-white paper, a simple worktable. Ordinary, clean, real.
- **Props:** the printed items themselves, envelopes, a stack of the same item, a plain
  paper guillotine or ruler, seforim on a shelf in the background, a simple silver tray.
- **Ornament:** symmetrical gold or silver foil borders and corner ornaments — formal and
  balanced rather than organic and scattered. Think a formal certificate frame, not a
  botanical wreath.
- **Palette:** cream and ivory with gold or silver foil; navy; burgundy or deep wine as an
  occasional second accent. Less pastel, less blush, less dusty blue.
- **Density:** חרדי invitations are text-dense and formal — a large ornate frame with a
  full block of text inside. Compose the *shape* of that layout even though the text itself
  stays non-readable (§1.1). A near-empty card with one tiny ornament looks secular.

### People in images

In חרדי advertising, photographs of women are conventionally not published. Any image
showing a person should show **a man, modestly dressed** — long sleeves, typically a white
shirt, often a kippah or hat and a beard — or, better and simpler, **hands only**: hands
holding a proof sheet, hands feeding paper into a guillotine, hands checking a foil edge.

Hands-only solves several problems at once: it avoids the question entirely, it avoids the
uncanny faces that image models still produce, and it puts the focus on the craft.

**Confirm this with Reuven before publishing** — practice varies between kehillos, and he
knows his customers.

### Products the catalogue is missing

Worth noting while you are commissioning imagery: the current catalogue is generic
Israeli-secular and omits some of the highest-volume חרדי print products —

- **ברכונים / זמירונים** (bentchers) — printed in the hundreds for every chasuna
- **פשקווילים** — wall posters, an iconic בני ברק product
- **שטר תנאים / כתובה** printing
- **הזמנות לברית, לבר מצווה, לשבע ברכות** as distinct products, not one "events" bucket
- **לוחות שנה** and מודעות for mosdot

If Reuven prints these — and a בני ברק press almost certainly does — they deserve both
catalogue entries and product photography. Tell me and I will add them to `catalog.ts`.

---

## 4. Global art direction

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

## 5. Image-by-image specification

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

## 6. Brand and icon assets — missing entirely today

The site has **no logo file**. The mark in the header is a CSS-styled Hebrew letter `ד` in a
rounded navy square with a CMYK strip underneath (`src/components/Header.tsx`, `.brand-mark`).
It looks deliberate, but it is a placeholder standing in for an identity.

For a print shop that sells **graphic design as a service**, shipping without a real logo is
a credibility problem — it is the one thing a prospective client will judge the design
capability by.

These are **design tasks, not photography**. A generative image model is the wrong tool;
these need a vector designer (human or an agent producing real SVG).

#### `logo.svg` — primary wordmark
- **Content:** דפוס ראובן, with the `עיצוב • דפוס • שילוט` tagline as an optional lock-up variant.
- **Constraints:** Hebrew letterforms must be correct — this is the one asset where a wrong
  glyph is fatal. Set in a real Hebrew typeface (Miriam Libre matches the site's display face).
- **Deliver:** horizontal lock-up, stacked lock-up, and mark-only, each in SVG, in full
  colour / all-navy / all-white (reversed).
- **Must work:** at 24px tall in a browser tab, and at 3 metres on a shop sign — this business
  puts its own logo on signage.

#### `icon.svg` — favicon *(exists, 496 bytes — review, may be fine)*
- Currently the `ד` mark with a CMYK strip. Genuinely distinctive at small size. Keep it
  unless the new logo supersedes it, in which case regenerate to match.

#### `apple-icon.png` — **missing**
- **Size:** 180×180 PNG, no transparency, no rounded corners (iOS applies its own mask).
- **Why it matters here:** this is a mobile-first site aimed at people who will save it to a
  home screen. Without this file iOS renders a blurry screenshot of the page instead.
- **Where:** `src/app/apple-icon.png` — Next.js picks it up by filename, no code change.

#### `opengraph-image` — see §4E
- The `og-image.webp` in §4E covers this. Alternatively place it at
  `src/app/opengraph-image.png` (1200×630) and Next wires it automatically, which is cleaner
  than the current `site.socialImage` reference.

---

## 7. Product gallery depth — 24 additional frames

Each product page shows a four-thumbnail gallery. Today slots 3 and 4 are almost always the
same two shared images (`machine` in 10 of 12 galleries, `finishes` in 11 of 12), so the
gallery stops being about the product.

**Target: 2 additional product-specific frames per product**, replacing the two shared shots.
Same art direction and technical spec as §4B.

For each of the 12 products, shoot:

| Slot | What it shows | Why |
|---|---|---|
| 1 | The hero product shot *(already specified in §4B)* | What it is |
| 2 | **Detail / macro** — the edge, the foil, the die-cut, the eyelet, the binding | Proves quality |
| 3 | **In context / in use** — on a desk, in a hand, on a shopfront, at an event | Proves it's real |
| 4 | Shared press or finishing shot *(keep only if 2 and 3 don't exist yet)* | Filler |

Naming: `prod-<slug>-detail.webp`, `prod-<slug>-context.webp`
Products (slugs from `src/data/catalog.ts`): `business-cards`, `flyers`, `invitations`,
`stickers`, `receipt-books`, `roll-ups`, `banners`, `business-signs`, `office-stationery`,
`packaging`, `promotional`, `thank-you-cards`.

**Code change required:** edit each product's `gallery: [...]` array in
`src/data/catalog.ts`, replacing `pressShot` / `finishShot` with the new entries and giving
each a Hebrew `alt` and `label`.

---

## 8. Portfolio photography — 12 frames

`src/data/content.ts` defines 12 portfolio projects, each with a real title, description and
materials list — but all 12 currently point at the shared product/service images. So the
"portfolio" shows the same pictures as the catalogue, which undercuts the whole section's
claim of being actual completed work.

Shoot one frame per project, matching the spec already written in the data file. The
`specs` array on each item tells you exactly what the photo must show:

| id | Project | Must visibly show (from its `specs`) |
|---|---|---|
| `accounting-branding` | מיתוג משרד רואי חשבון | 350gsm chromo, matte lamination, blind emboss on the logo |
| `gold-foil-wedding` | הזמנת חתונה בפויל זהב | 300gsm textured stock, hot gold foil, laser-cut edge, matching envelope |
| `storefront-sign` | שלט חזית לחנות | 8mm perspex, 3D letters, LED backlight |
| `cosmetics-labels` | תוויות למותג קוסמטיקה | white polypropylene, matte lam, die-cut, roll on a 76mm core |
| `employee-gift-kit` | ערכת מתנה לעובדים | embroidered shirt, laser-etched pen, ceramic mug, branded carton |
| `product-catalog` | קטלוג מוצרים 32 עמודים | 170gsm gloss, 250gsm laminated cover, thread sewn |
| `expo-rollup` | רולאפ לתערוכה | 220gsm poly fabric, aluminium stand, carry bag |
| `receipt-books` | פנקסי קבלות ממותגים | 3-part NCR, running numbering, glued head binding |
| `food-packaging` | אריזת קרטון למותג מזון | 400gsm board, custom die, matte lam, machine glued |
| `bar-mitzvah` | הזמנות לבר מצווה | 300gsm, shaped cut, royal blue, matching card |
| `launch-banner` | שמשונית לאירוע השקה | 510gsm PVC, eyelets every 50cm, UV print |
| `foil-business-cards` | כרטיסי ביקור עם פויל | 400gsm, soft-touch lam, foil, rounded corners |

**These should be real jobs where possible.** A portfolio of generated images is a claim
about work that was never done. If real archive photos exist, use them and skip generation
entirely — this is the section where authenticity matters most and where a generated
substitute is closest to a lie.

Naming: `portfolio-<id>.webp`, 1600×1200, must survive 1:1 and 3:4 crops (§1.3).
**Code change:** update the `image` field on each item in `src/data/content.ts`.

---

## 9. Situation-page images — 4 frames

`src/data/situations.ts` drives four landing pages that currently borrow product shots.
Each deserves a wider, more editorial "scene" frame than a product shot gives.

| File | Page | Scene |
|---|---|---|
| `situation-new-business.webp` | פותחים עסק חדש | A full opening-day kit laid out together: cards, stamp, receipt book, folder, small sign |
| `situation-wedding.webp` | מתחתנים | Invitation suite spread with envelopes, seating card and a thank-you card |
| `situation-storefront.webp` | פותחים חנות | A finished shopfront exterior with fascia sign, window decal and A-frame |
| `situation-campaign.webp` | יוצאים בקמפיין | Flyers, a roll-up and branded merch staged as a launch-day set |

1600×1200. Same direction as §3. **Code change:** update `image` in `src/data/situations.ts`.

---

## 10. Acceptance checklist

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

## 11. Priority order

Ordered by what each frame actually buys, across all four groups.

**Tier 1 — do these first (9 assets).** Without these the site looks unfinished.

1. `logo.svg` (§5) — **the single biggest gap.** A design studio with no logo undercuts
   everything else on the page. Not photography; needs a vector designer.
2. `hero-collage` (§4D) — first thing every visitor sees
3. `prod-invitations` (§4B) — most-reused image on the site and the highest-margin product
4. `finishes` (§4C) — the frame that proves craftsmanship
5. `about-studio` (§4C) — the human behind "שירות אישי". **Use a real photo of Reuven if at
   all possible**; this is where a generated stand-in costs the most credibility.
6. `prod-business-cards` (§4B) — most-requested product
7. `apple-icon.png` (§5) — mobile-first site, currently renders a blurry screenshot when saved
8. `og-image` (§4E) — WhatsApp is a primary sharing channel here and the preview is wrong today
9. `machine` (§4C) — capability proof

**Tier 2 — removes the visible repetition (17 assets).**

10. All 12 portfolio frames (§7) — stops the portfolio showing the same pictures as the catalogue.
    **Use real archive photos of real jobs wherever they exist.**
11. Remaining `prod-*` product shots (§4B)
12. 4 situation scenes (§8)

**Tier 3 — depth (26 assets).**

13. Remaining service cards (§4A)
14. Per-product detail + context frames (§6) — 24 frames, the last thing to do and the
    thing that makes product pages feel genuinely photographed

**If you only ever do Tier 1, the site is credible.** Tier 2 is what makes it stop looking
like it reuses stock. Tier 3 is polish.

## 12. What not to do

- Don't generate a single wide image and slice it into the set — they need distinct subjects.
- Don't upscale a low-resolution generation to hit the 2× requirement.
- Don't add watermarks, borders, drop shadows, or rounded corners. The CSS handles framing;
  baked-in styling fights it.
- Don't include people's faces in product shots — only in `about-studio`.
- Don't deliver PNG-with-transparency expecting the site to composite it; these are
  full-bleed photographs behind `object-fit: cover`.
