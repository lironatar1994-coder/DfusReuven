/**
 * Rate table for the price estimator.
 *
 * Follows the Israeli market convention (see printfix / כרטא פרינט / ארגון בתי דפוס):
 * ranges rather than exact figures, excluding VAT, explicitly non-binding.
 * Ranges answer the customer's question without handing a competitor a number
 * to undercut, and without committing the shop before the spec is final.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  THE NUMBERS BELOW ARE SAMPLE RATES, BENCHMARKED FROM PUBLISHED ISRAELI
 *     PRICE LISTS. REPLACE THEM WITH דפוס ראובן'S OWN BEFORE GOING LIVE.
 *     Everything else on the site derives from this file — nothing else to edit.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Tier = {
  /** Quantity for this tier */
  qty: number;
  label: string;
  /** Total price range for the whole run, in ₪, excluding VAT */
  min: number;
  max: number;
};

export type OptionChoice = {
  id: string;
  label: string;
  /** Multiplier applied to the tier range. 1 = no change. */
  factor: number;
  note?: string;
};

export type OptionGroup = {
  id: string;
  label: string;
  choices: OptionChoice[];
};

export type PricedProduct = {
  /** Matches a slug in catalog.ts */
  slug: string;
  label: string;
  tiers: Tier[];
  options: OptionGroup[];
};

export const VAT_RATE = 0.18;

export const pricedProducts: PricedProduct[] = [
  {
    slug: "business-cards",
    label: "כרטיסי ביקור",
    tiers: [
      { qty: 100, label: "100 יח׳", min: 70, max: 110 },
      { qty: 250, label: "250 יח׳", min: 95, max: 150 },
      { qty: 500, label: "500 יח׳", min: 120, max: 200 },
      { qty: 1000, label: "1,000 יח׳", min: 170, max: 260 },
      { qty: 2500, label: "2,500 יח׳", min: 320, max: 480 },
    ],
    options: [
      {
        id: "paper",
        label: "נייר וגימור",
        choices: [
          { id: "300", label: "300 גרם", factor: 1 },
          { id: "350-mat", label: "350 גרם + למינציה מטית", factor: 1.15 },
          { id: "400-soft", label: "400 גרם + סופט-טאץ׳", factor: 1.45 },
          { id: "foil", label: "הטבעת פויל", factor: 1.9, note: "כולל הכנת מטריצה" },
        ],
      },
      {
        id: "sides",
        label: "צדדים",
        choices: [
          { id: "1", label: "צד אחד", factor: 1 },
          { id: "2", label: "דו-צדדי", factor: 1.25 },
        ],
      },
    ],
  },
  {
    slug: "flyers",
    label: "פליירים",
    tiers: [
      { qty: 250, label: "250 יח׳", min: 110, max: 170 },
      { qty: 500, label: "500 יח׳", min: 150, max: 230 },
      { qty: 1000, label: "1,000 יח׳", min: 190, max: 300 },
      { qty: 2500, label: "2,500 יח׳", min: 330, max: 500 },
      { qty: 5000, label: "5,000 יח׳", min: 550, max: 850 },
    ],
    options: [
      {
        id: "size",
        label: "גודל",
        choices: [
          { id: "a6", label: "A6", factor: 0.75 },
          { id: "a5", label: "A5", factor: 1 },
          { id: "a4", label: "A4", factor: 1.6 },
        ],
      },
      {
        id: "paper",
        label: "נייר",
        choices: [
          { id: "135", label: "כרומו 135 גרם", factor: 1 },
          { id: "170", label: "כרומו 170 גרם", factor: 1.18 },
          { id: "250", label: "כרומו 250 גרם", factor: 1.4 },
        ],
      },
      {
        id: "sides",
        label: "צדדים",
        choices: [
          { id: "1", label: "צד אחד", factor: 1 },
          { id: "2", label: "דו-צדדי", factor: 1.3 },
        ],
      },
    ],
  },
  {
    slug: "invitations",
    label: "הזמנות לאירועים",
    tiers: [
      { qty: 50, label: "50 יח׳", min: 220, max: 340 },
      { qty: 100, label: "100 יח׳", min: 320, max: 500 },
      { qty: 150, label: "150 יח׳", min: 420, max: 650 },
      { qty: 250, label: "250 יח׳", min: 620, max: 950 },
      { qty: 400, label: "400 יח׳", min: 900, max: 1400 },
    ],
    options: [
      {
        id: "finish",
        label: "גימור",
        choices: [
          { id: "plain", label: "הדפסה רגילה", factor: 1 },
          { id: "texture", label: "נייר טקסטורה", factor: 1.2 },
          { id: "foil", label: "הטבעת פויל", factor: 1.55 },
          { id: "diecut", label: "חיתוך צורני", factor: 1.4 },
        ],
      },
      {
        id: "envelope",
        label: "מעטפה",
        choices: [
          { id: "none", label: "בלי מעטפה", factor: 1 },
          { id: "plain", label: "מעטפה חלקה", factor: 1.15 },
          { id: "printed", label: "מעטפה מודפסת", factor: 1.35 },
        ],
      },
      {
        id: "design",
        label: "עיצוב",
        choices: [
          { id: "ready", label: "יש לי קובץ מוכן", factor: 1 },
          { id: "new", label: "צריך עיצוב", factor: 1.35, note: "עיצוב מקורי לאירוע" },
        ],
      },
    ],
  },
  {
    slug: "stickers",
    label: "מדבקות",
    tiers: [
      { qty: 100, label: "100 יח׳", min: 90, max: 150 },
      { qty: 250, label: "250 יח׳", min: 130, max: 210 },
      { qty: 500, label: "500 יח׳", min: 190, max: 300 },
      { qty: 1000, label: "1,000 יח׳", min: 290, max: 460 },
      { qty: 5000, label: "5,000 יח׳", min: 950, max: 1500 },
    ],
    options: [
      {
        id: "material",
        label: "חומר",
        choices: [
          { id: "paper", label: "נייר מבריק", factor: 1 },
          { id: "vinyl", label: "ויניל עמיד במים", factor: 1.35 },
          { id: "clear", label: "מדבקה שקופה", factor: 1.5 },
        ],
      },
      {
        id: "cut",
        label: "גזירה",
        choices: [
          { id: "square", label: "עגול / מרובע", factor: 1 },
          { id: "diecut", label: "גזירה בצורה חופשית", factor: 1.3, note: "כולל סכין" },
        ],
      },
    ],
  },
  {
    slug: "receipt-books",
    label: "פנקסי קבלות",
    tiers: [
      { qty: 5, label: "5 פנקסים", min: 180, max: 260 },
      { qty: 10, label: "10 פנקסים", min: 280, max: 420 },
      { qty: 25, label: "25 פנקסים", min: 600, max: 900 },
      { qty: 50, label: "50 פנקסים", min: 1050, max: 1600 },
    ],
    options: [
      {
        id: "copies",
        label: "העתקים",
        choices: [
          { id: "2", label: "2 העתקים", factor: 1 },
          { id: "3", label: "3 העתקים", factor: 1.3 },
        ],
      },
      {
        id: "pages",
        label: "דפים לפנקס",
        choices: [
          { id: "50", label: "50 דפים", factor: 1 },
          { id: "100", label: "100 דפים", factor: 1.7 },
        ],
      },
    ],
  },
  {
    slug: "roll-ups",
    label: "רולאפים",
    tiers: [
      { qty: 1, label: "יחידה אחת", min: 240, max: 380 },
      { qty: 2, label: "2 יחידות", min: 450, max: 700 },
      { qty: 5, label: "5 יחידות", min: 1050, max: 1600 },
      { qty: 10, label: "10 יחידות", min: 1950, max: 3000 },
    ],
    options: [
      {
        id: "size",
        label: "מידה",
        choices: [
          { id: "60", label: "60×160 ס״מ", factor: 0.8 },
          { id: "85", label: "85×200 ס״מ", factor: 1 },
          { id: "100", label: "100×200 ס״מ", factor: 1.2 },
        ],
      },
      {
        id: "stand",
        label: "מעמד",
        choices: [
          { id: "standard", label: "מעמד סטנדרטי", factor: 1 },
          { id: "premium", label: "מעמד פרימיום", factor: 1.4 },
          { id: "graphic", label: "החלפת גרפיקה בלבד", factor: 0.55 },
        ],
      },
    ],
  },
  {
    slug: "banners",
    label: "שמשוניות",
    tiers: [
      { qty: 2, label: "2 מ״ר", min: 120, max: 190 },
      { qty: 4, label: "4 מ״ר", min: 210, max: 330 },
      { qty: 6, label: "6 מ״ר", min: 300, max: 470 },
      { qty: 10, label: "10 מ״ר", min: 470, max: 750 },
    ],
    options: [
      {
        id: "material",
        label: "בד",
        choices: [
          { id: "440", label: "PVC 440 גרם", factor: 1 },
          { id: "510", label: "PVC 510 גרם", factor: 1.2 },
          { id: "mesh", label: "בד מיש (מחורר לרוח)", factor: 1.35 },
        ],
      },
      {
        id: "finish",
        label: "גימור",
        choices: [
          { id: "eyelets", label: "עיניות + מכפלת", factor: 1 },
          { id: "pocket", label: "כיס למוט", factor: 1.15 },
        ],
      },
    ],
  },
];

export function getPricedProduct(slug: string): PricedProduct | undefined {
  return pricedProducts.find((p) => p.slug === slug);
}

/** Rounds outward to a clean number so a range never looks falsely precise. */
function roundTo(value: number, step: number, dir: "down" | "up") {
  return dir === "down"
    ? Math.floor(value / step) * step
    : Math.ceil(value / step) * step;
}

export function estimate(
  product: PricedProduct,
  tierQty: number,
  selections: Record<string, string>,
): { min: number; max: number } | null {
  const tier = product.tiers.find((t) => t.qty === tierQty);
  if (!tier) return null;

  const factor = product.options.reduce((acc, group) => {
    const chosen = group.choices.find((c) => c.id === selections[group.id]);
    return acc * (chosen ? chosen.factor : 1);
  }, 1);

  const step = tier.max * factor > 800 ? 50 : 10;
  return {
    min: roundTo(tier.min * factor, step, "down"),
    max: roundTo(tier.max * factor, step, "up"),
  };
}

export function formatShekels(value: number): string {
  return `₪${value.toLocaleString("he-IL")}`;
}
