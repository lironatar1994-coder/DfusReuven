# Ready-to-paste image prompts — דפוס ראובן, בני ברק

Copy a block, paste it into your image generator, done. Full reasoning lives in
[IMAGE-BRIEF.md](./IMAGE-BRIEF.md); this file is just the prompts.

**Regenerating the first batch?** The invitations, the hero and anything with dried flowers,
silk ribbon, marble or lace edges need redoing — they were styled for a secular European
wedding market. Everything below is corrected for a בני ברק חרדי customer.

---

## Paste this once, before anything else

Most tools let you set a system or style prompt that applies to every generation. Put this
there. It carries the constraints that got the first batch 80% right, plus the correction.

```
STYLE CONTRACT — apply to every image in this set.

SUBJECT WORLD: a working print shop in Bnei Brak, Israel, serving a Haredi
(ultra-Orthodox Jewish) community — businesses, institutions, and families printing for
weddings, bar mitzvahs and community events. The register is a trusted neighbourhood press:
warm, exact, respectable, unpretentious. NOT a luxury European stationery boutique.

TEXT — read this carefully, the first batch got it wrong.

No generated Hebrew or Latin lettering. Image models cannot render Hebrew and will produce
garbled characters, which is worse than none. That constraint stands.

But the first batch obeyed it by filling every printed surface with rows of solid navy
bars, dead centre and in sharp focus. The result reads as a REDACTED DOCUMENT, and across
the whole site it means a print shop whose website shows no evidence it has ever printed a
word. Do not do that again.

Instead, hide the absence with photography rather than announcing it:
- Angle printed pieces steeply, or crop them at the frame edge, so the text area is
  foreshortened and only partly visible.
- Throw the text area out of focus with a shallow depth of field and keep the sharp plane
  on an edge, a fold, a foil ornament or a paper stack.
- Let a hand, an envelope or another sheet overlap and cover most of the copy block.
- Where marks do show, make them fine and irregular like distant body copy — never even
  rows of thick solid blocks.

Where a piece is unusable without real Hebrew — a shop's front sign, a wedding invitation
seen head-on — do not generate it. Photograph the real thing.

PALETTE: deep navy, royal blue, pale blue, cream, warm off-white paper, with gold or silver
foil as the metallic accent. Burgundy or deep wine as an occasional second accent. No
orange. No pastel pink or blush. No heavily saturated multicolour designs.

LIGHT: one large soft key from the upper left, gentle falloff, soft-edged natural shadows,
slightly warm daylight around 5200K. No hard specular hotspots on paper.

SURFACES: plain warm off-white paper, simple light wood, an ordinary worktable. Never
marble, never terrazzo, never polished designer concrete, never a pure white void.

BANNED PROPS: dried flowers, hydrangeas, gypsophila, eucalyptus or olive branches, draped
silk or chiffon ribbon, wax seals with botanical motifs, lace or doily edges, marble slabs,
Islamic-geometry rosettes or mandalas. These read as secular wedding-blog styling and are
wrong for this customer.

PEOPLE: only where specified. When a person appears, show a modestly dressed man — long
sleeves, white shirt, often a kippah or hat and a beard — or, preferably, hands only.

MEDIUM: real photography. Visible paper fibre and thickness, honest shadows, believable
depth of field. Not a 3D render, no plastic surfaces, no impossible symmetry, no lens flare.

COMPOSITION: keep the subject inside the central square of the frame — these images get
centre-cropped to 1:1 elsewhere on the site, so anything near the left or right edge is
liable to be cut off.
```

---

## Tier 1 — do these first

### `hero-collage.webp` — 1800×1440

> **Regenerate.** The first version was good but its empty space is on the wrong side: the
> site overlays a label at the **bottom right**, and the previous frame left the calm area
> bottom left. If you would rather keep that image, just mirror it horizontally instead.

```
Overhead flat lay showing the range of a Bnei Brak print shop's work, arranged with
editorial care on a warm off-white paper surface: a stack of deep navy business cards, a
cream invitation card with an ornate symmetrical gold foil border, a folded flyer, a small
kraft cardboard box, a partially unwound roll of labels, and a fan of paper swatches in
navy, royal blue, pale blue and cream. Deep navy, royal blue, cream and metallic gold
palette. Soft large window light from the upper left with gentle natural shadows. Generous
calm empty surface in the LOWER RIGHT of the frame, kept clear of objects. Every printed
surface carries abstract marks and foil ornament only — absolutely no readable text.
Tactile, precise, premium editorial print photography. Not a 3D render.
```

### `prod-invitations.webp` — 1600×1200 · must survive 1:1 and 3:4 crops

> **Regenerate — this is the worst image on the site.** The first versions used dried
> flowers, silk ribbon and lace edges. The replacement fixed the props but filled the card
> with even rows of solid navy bars inside a gold Victorian frame, which reads as a
> **redacted classified document**, and kept a European art-deco ornament that is not the
> Bnei Brak invitation vernacular. Shoot this one for real if you possibly can — an actual
> invitation the shop printed, with permission, is worth more than any generation.

```
Close three-quarter photograph of a formal Jewish wedding invitation on heavy cream card
stock, lying at a steep angle on plain light wood so the printed panel is strongly
foreshortened and recedes from the camera. The sharp focal plane sits on the NEAR EDGE of
the card — its thickness, its cut edge, and a gold foil ornament in the corner. The body of
the card falls away out of focus. A matching cream envelope overlaps and covers the lower
half of the card. Only faint, fine, irregular marks are suggested where copy would be,
softened by the shallow depth of field — no rows of solid blocks, no readable letters.
Restrained geometric or floral-scroll foil ornament of the kind used on Israeli religious
simcha invitations; NOT art-deco, NOT Victorian filigree, NOT a heavy full-perimeter frame.
Warm directional light raking across the surface so the foil catches a genuine metallic
highlight and the paper fibre shows. Formal, respectable, unpretentious. Precise editorial
stationery photography, not a 3D render.
```

### `finishes.webp` — 1600×1200

```
Macro photograph of a fanned array of premium paper stock swatches and print finishing
samples on a plain light wood surface: gold foil stamping, silver foil, blind deboss with
visible relief shadow, soft-touch matte lamination, and spot gloss UV varnish catching the
light. Raking side light revealing every surface texture and the depth of the emboss. Rich
tactile detail, shallow depth of field, navy and cream and metallic palette. Ornamental
geometric borders only — no readable text.
```

### `about-studio.webp` — 1600×1200

> **Use a real photograph of Reuven if at all possible.** A genuine photo of the actual
> owner beats anything generated here, and this is the image carrying the "personal service"
> claim. Generate only as a stopgap.

```
Documentary photograph inside a working print shop. A man's hands — long white shirt
sleeves, no face in frame — hold a freshly printed proof sheet up to the light, checking it.
A large printing press sits softly out of focus behind. Warm practical workshop lighting,
stacks of paper and simple tools around, an honest working environment rather than a styled
set. The proof sheet is angled away so nothing on it is readable. Candid, unposed, warm.
Real photography, natural tones.
```

### `prod-business-cards.webp` — 1600×1200

```
Macro photograph of a stack of premium deep navy business cards with soft-touch matte
lamination, one card lifted and angled off the top of the stack. Thick 400gsm card edges
clearly visible showing the paper core. A small abstract geometric mark in royal blue on the
face — no readable text. Raking soft light revealing the velvety matte surface. Shallow
depth of field, plain warm neutral background, precise print photography.
```

### `machine.webp` — 1600×1200

```
Photograph of a working offset printing press mid-run in a busy print shop, showing the
inking rollers with visible cyan, magenta, yellow and black ink, the control console, and
printed sheets stacking in the delivery tray with slight motion blur. Industrial workshop
lighting, authentic machinery with honest wear and ink marks. Documentary realism, deep
colour. Nothing on the printed sheets is readable.
```

### `og-image.webp` — 1200×630 exactly

```
Wide overhead flat lay of printed products on a warm off-white surface — navy business
cards, a cream invitation with an ornate gold foil border, and a fan of paper swatches —
arranged along the RIGHT side of the frame, leaving the LEFT THIRD as clean empty surface
for a text overlay. Soft window light, gentle shadows, navy, cream and gold palette. No text
anywhere in the image. Precise editorial print photography.
```

---

## Tier 2 — service cards (1600×1000) and remaining products (1600×1200)

### `svc-business.webp`
```
Overhead flat lay of a complete branded office stationery set on a warm off-white desk:
letterhead sheets, a printed envelope, a presentation folder and a stack of business cards.
Deep navy and royal blue on cream paper. All text rendered as clean abstract typographic
bars — no readable letters. Soft window light from the upper left, gentle natural shadows,
subtle paper texture. Precise print-studio photography, neutral grade, real photography.
```

### `svc-invitations.webp`
```
Overhead photograph of a formal Jewish event invitation suite on plain light wood: a cream
card with an ornate symmetrical gold foil frame, its matching envelope, and a small bentcher
style booklet with a gold foil border. Layout structure suggested by abstract typographic
bars — no readable text. Warm raking light catching the foil. Formal and respectable, no
floral props, no ribbon. Precise stationery photography.
```

### `svc-signage.webp`
```
Photograph of finished large-format signage in a print workshop: an aluminium roll-up banner
stand displaying a bold abstract navy and blue graphic, a rolled PVC banner leaning beside
it, and a flat rigid sign panel against a plain wall. Slight three-quarter angle so nothing
is readable. Clean industrial workshop, soft daylight, realistic environment.
```

### `svc-stickers.webp`
```
Overhead photograph of a roll of glossy die-cut labels partially unwound across a warm
off-white surface, with loose circular and rectangular stickers nearby and a small kraft
cardboard box behind. Navy and royal blue abstract label designs, no readable text. Visible
label backing paper and die-cut lines. Soft even studio light, crisp detail.
```

### `svc-promo.webp`
```
Overhead flat lay of branded merchandise on a warm neutral surface: a neatly folded navy
cotton polo shirt, a white ceramic mug, two pens and a hardcover notebook, all carrying the
same small abstract geometric mark in royal blue — no readable words. Soft daylight, natural
fabric texture, realistic merchandise photography.
```

### `svc-design.webp`
```
A designer's workspace photographed from a slight overhead angle: a monitor at the back
showing an abstract layout of shapes and blocks, slightly out of focus and unreadable; an
opened paper swatch fan in blues and creams across the desk; printed proofs and a pencil.
Warm daylight from a window, authentic working desk, not styled to perfection.
```

### `prod-flyers.webp`
```
Overhead photograph of a fan of freshly printed A5 flyers spread across a warm off-white
surface, one folded to show the reverse. Clean editorial layout of navy and blue colour
blocks and abstract typographic bars — no readable text. Glossy coated paper catching soft
light. Bright, crisp, realistic print-shop photography.
```

### `prod-stickers.webp`
```
Close-up overhead photograph of glossy vinyl die-cut stickers on a white backing sheet —
circles, rounded squares and a custom shape — with one peeled halfway up at the corner
showing the adhesive and the cut line. Navy and royal blue abstract designs, no readable
text. Sharp detail on the die-cut edges, soft even light.
```

### `prod-receipts.webp`
```
Photograph of an open carbonless receipt book on a plain wooden desk, showing the three NCR
copies in white, yellow and pink, the ruled table grid, empty unfilled fields and the glued
cardboard top binding. Blank form — ruled lines and boxes only, no readable text. A pen
resting beside it. Natural desk light, authentic small-business feel.
```

### `prod-rollup.webp` — must also survive a 3:4 crop
```
Photograph of a professional roll-up banner stand fully extended in a clean bright hall,
shot from a slightly low angle. The banner displays a bold abstract composition of large
shapes in navy and royal blue — no readable text. Aluminium base on a polished floor. Soft
even ambient light, subtle floor shadow, plain out-of-focus background.
```

### `prod-banner.webp`
```
Photograph of a printed PVC vinyl banner stretched taut and secured with brass eyelets
against a plain wall in overcast daylight, framed CLOSE so the eyelet hardware, hemmed edge
and vinyl weave fill the centre of the frame. Bold abstract navy and blue graphic, no
readable text. Natural outdoor light, realistic.
```

### `prod-signs.webp`

> **Regenerate.** What shipped is a Haussmann-style Parisian street at dusk — European
> stonework, a café interior, wrought-iron balconies — captioned in the site's alt text as
> `שלט חזית מותקן על חנות שכונתית`. Nobody in Bnei Brak will read that as a neighbourhood
> shop. This is the other image worth photographing for real: one honest shot of a sign the
> shop actually installed does more than any generation.

```
Photograph of an illuminated shopfront fascia sign, shot from a steep side angle close to
the wall so the dimensional acrylic letters read as abstract illuminated shapes rather than
words. Warm halo backlighting against a deep navy panel. The building is a plain modern
Israeli street-level shopfront: flat rendered or stone-clad facade, a simple aluminium
window frame, a roller shutter housing above, air-conditioning units, no ornament. Late
afternoon daylight, not blue-hour dusk. ABSOLUTELY NOT European: no Haussmann stonework, no
wrought-iron balconies, no cafe terrace, no cobblestones, no awnings. Realistic
architectural photography.
```

---

## Worth adding — products the catalogue is missing

A בני ברק press almost certainly prints these, and they are among the highest-volume חרדי
print jobs. If Reuven confirms, tell me and I will add catalogue entries so these images
have somewhere to live.

### `prod-bentchers.webp` — ברכונים / זמירונים
```
Overhead photograph of a stack of small saddle-stitched booklets in cream card with an
ornate gold foil border on the cover, one open to show the inner pages set as abstract
typographic bars — no readable text. On plain light wood. Warm raking light catching the
foil. The booklets are the kind handed out at a Jewish wedding. Precise, formal, respectable
print photography.
```

### `prod-posters.webp` — פשקווילים / wall posters
```
Photograph of large printed paper wall posters freshly pasted in overlapping layers on an
urban wall, shot slightly from the side. Bold black and navy layout blocks and abstract
typographic bars standing in for dense text — nothing readable. Daylight, ordinary street
wall, honest documentary realism.
```

### `prod-calendars.webp` — לוחות שנה
```
Overhead photograph of a printed wall calendar on cream stock with a gold foil header,
the date grid rendered as clean empty ruled boxes with no readable numbers or text, beside a
rolled second copy. Plain wood surface, soft window light, precise print photography.
```

---

## Before you accept a batch

- Zoom to 100% and check **every printed surface for readable characters**. This is the one
  failure that cannot be fixed in post.
- Check the subject survives a **centre crop to square** — cover the outer third of each
  side and see whether the point of the image is still there.
- Check there are **no dried flowers, ribbon, marble or lace** anywhere in frame.
- Check the palette has **no orange and no blush pink**.
- Check it looks **photographed, not rendered** — plastic surfaces and impossible symmetry
  are the tell.
