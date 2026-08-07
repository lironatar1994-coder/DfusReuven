/**
 * Entry by situation rather than by SKU.
 *
 * Nobody wakes up needing "a product from the business-print category". They
 * are opening a shop, getting married, or running out of receipt books. These
 * map the way customers actually arrive onto the catalog.
 */

export type Situation = {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  /**
   * Written out, not derived. The page used to build this heading by stripping
   * a prefix off `title` with a regex — which for "מתחתנים" removed the entire
   * word and shipped "מה בדרך כלל מזמינים ל", a heading ending on a dangling
   * preposition. Hebrew inflects; four strings are cheaper than a rule that
   * has to know that.
   */
  kitHeading: string;
  /** Product slugs from catalog.ts, in the order they matter for this situation. */
  products: string[];
  image: string;
  alt: string;
};

export const situations: Situation[] = [
  {
    slug: "new-business",
    title: "פותחים עסק חדש",
    tagline: "כל מה שצריך ביום הראשון",
    kitHeading: "מה מזמינים כשפותחים עסק",
    intro:
      "פתיחת עסק דורשת ערכה בסיסית שמלווה אתכם מהיום הראשון: כרטיסי ביקור לחלק ללקוחות, שילוט שיביא אנשים פנימה, פנקס קבלות לרשויות וניירת אחידה שמשדרת מקצועיות. אפשר להזמין הכול יחד בעיצוב אחד — זה גם זול יותר וגם נראה טוב יותר.",
    products: ["business-cards", "business-signs", "receipt-books", "office-stationery", "stickers"],
    image: "/images/situation-new-business.webp",
    alt: "ערכת פתיחת עסק: כרטיסי ביקור, ניירת ושילוט",
  },
  {
    slug: "wedding",
    title: "מתחתנים",
    tagline: "מההזמנה ועד שלט הברכה",
    kitHeading: "מה מזמינים לחתונה",
    intro:
      "ההזמנה היא הדבר הראשון שהאורחים רואים מהאירוע שלכם. אנחנו מעצבים ומדפיסים את כל הסדרה באותה שפה — הזמנות ומעטפות, שילוט לכניסה ולשולחנות, וכרטיסי תודה לאחרי. הכול מתואם, בלי לרוץ בין ספקים.",
    products: ["invitations", "thank-you-cards", "business-signs", "stickers"],
    image: "/images/situation-wedding.webp",
    alt: "הזמנת חתונה עם פויל זהב, מעטפה וכרטיסי תודה",
  },
  {
    slug: "storefront",
    title: "פותחים חנות או משפצים",
    tagline: "שילוט שמביא אנשים פנימה",
    kitHeading: "מה מזמינים לחזית של חנות",
    intro:
      "אנחנו מגיעים למדוד באתר, ממליצים על החומר והתאורה שמתאימים לחזית ולתקציב, ומתקינים בעצמנו. אפשר להוסיף מדבקות לחלון, שמשונית לפתיחה ורולאפ לדלפק.",
    products: ["business-signs", "banners", "roll-ups", "stickers"],
    image: "/images/situation-storefront.webp",
    alt: "שלט חזית מואר, שמשונית ורולאפ לחנות",
  },
  {
    slug: "campaign",
    title: "יוצאים בקמפיין",
    tagline: "לחלק, לתלות, לחלק שוב",
    kitHeading: "מה מזמינים לקמפיין",
    intro:
      // The line that used to close this promised "מסלול מזורז של 48 שעות".
      // It appeared exactly once on the whole site, while all twelve products
      // say lead time comes with the quote — a specific promise made in one
      // place and honoured nowhere is the kind of thing a customer quotes back.
      "מבצע, השקה או אירוע — צריך חומר שיוצא לרחוב מהר. פליירים לחלוקה, שמשונית לחזית, רולאפ לדוכן ומוצרי פרסום ממותגים שנשארים אצל הלקוח. אם יש לכם תאריך, תגידו לנו אותו בשיחה הראשונה ונגיד בכנות אם הוא אפשרי.",
    products: ["flyers", "banners", "roll-ups", "promotional"],
    image: "/images/situation-campaign.webp",
    alt: "פליירים, שמשונית ומוצרי פרסום לקמפיין",
  },
];

export function getSituation(slug: string): Situation | undefined {
  return situations.find((s) => s.slug === slug);
}
