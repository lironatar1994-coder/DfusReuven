# Image production manifest

This manifest records how the files commissioned in `IMAGE-BRIEF.md` avoid generated
pseudo-text and how speculative portfolio material is handled.

## Text strategies

- **Strategy A — out of legible range:** `svc-signage`, `svc-design`, `machine`,
  `prod-rollup`, `prod-banner`, `prod-signs`, all corresponding signage detail/context
  frames, and `situation-storefront`. Printed surfaces are angled, distant, cropped, or
  motion-softened so no words can be read.
- **Strategy B — abstract text blocks:** all other service, product, gallery, situation,
  and portfolio-concept photographs. The compositions use clean bars, rules, blocks,
  formal borders, and non-linguistic geometric marks instead of letterforms.
- **Strategy C — real type composited after generation:** `og-image`. The base photograph
  contains no generated type; the Hebrew name and tagline are drawn afterward with the
  local Miriam Libre and Heebo font files. `hero-collage` uses the brief's explicitly
  permitted alternative of abstract marks and foil ornament only, so it contains no type
  requiring compositing.

## Cultural and authenticity controls

- Invitations and event stationery use dense, formal, symmetrical certificate-like
  borders on cream stock, with navy, burgundy, gold, or silver accents.
- Props are limited to the printed work, plain wood, warm paper, ordinary work surfaces,
  workshop tools, envelopes, and seforim in the background where appropriate.
- The set excludes dried florals, ribbon, marble, terrazzo, decorative concrete, botanical
  wax seals, lace edges, Islamic rosettes or mandalas, eucalyptus, and olive branches.
- The only human-presence frame, `about-studio`, uses modestly dressed male hands in a
  white long-sleeved shirt; no face or woman is depicted.
- No real or realistic invented company brand appears. Product graphics use simple,
  deliberately generic marks.

## Portfolio quarantine

The 12 `portfolio-*` images are delivered as visual concepts in
`assets/portfolio-concepts/`, but they are deliberately not copied to `public/images/`
and are not referenced by `src/data/content.ts`. Publishing generated concepts as proof
of completed client work would be misleading. Replace them with real archive photographs
and populate the portfolio data only after Reuven confirms each job.

## Source and output locations

- Lossless PNG masters: `assets/image-masters/`
- Web-ready live imagery: `public/images/`
- Web-ready portfolio concepts: `assets/portfolio-concepts/`
- Vector identity variants: `public/images/logo*.svg`
- iOS icon: `src/app/apple-icon.png`

The reproducible conversion and logo-build script is `scripts/build_image_assets.py`.
