import { businessHours } from "./hours";
import { portfolio } from "@/data/content";

const configuredDomain = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const site = {
  name: "דפוס ראובן",
  nameEn: "DFUS REUVEN",
  tagline: "עיצוב • דפוס • שילוט",
  // Renders in the footer, the meta description and the OG card — so it is the
  // most-read sentence on the property. It used to end "עם ליווי אישי משלב
  // הרעיון ועד למוצר המוגמר", which is true of every print shop in the country
  // and therefore says nothing. Every clause here is one this shop can be held to.
  description:
    "בית דפוס בבני ברק — עיצוב גרפי, דפוס אופסט ודיגיטלי, שילוט, הזמנות, מדבקות ומוצרי פרסום. עיצוב והדפסה באותו מקום, ומדברים ישירות עם מי שמדפיס.",
  domain: (configuredDomain || "https://www.dfusreuven.co.il").replace(/\/+$/, ""),
  locale: "he_IL",
  language: "he-IL",
  country: "IL",
  currency: "ILS",
  serviceArea: "ישראל",
  socialImage: "/images/og-image.webp",

  // Verified from the business's public listings (InPrint, דפי זהב), בני ברק.
  phoneDisplay: "03-5785651",
  phoneHref: "+97235785651",
  fax: "03-5798656",
  address: "ז'בוטינסקי 84, בני ברק",
  addressShort: "ז'בוטינסקי 84",
  city: "בני ברק",

  // Supplied by the business owner: 052-721-0118.
  whatsapp: "972527210118",
  whatsappDisplay: "052-721-0118",

  // Verified: printed on two of the shop's own flyers (the "כל סוגי ההדפסות
  // במקום אחד" capabilities sheet and the מבצעי PRINT price sheet), alongside
  // the same phone, fax and address the site already carries. Replaces
  // info@dfusreuven.co.il, which was a placeholder for a mailbox nobody had
  // confirmed exists — a contact page that bounces is worse than a Gmail.
  email: "R88000@gmail.com",

  // Display hours come from lib/hours.ts so they can never disagree with the
  // open/closed badge on the mobile bar.
  hours: businessHours,

  // null, not "#". Two icons that scroll the page back to the top are worse
  // than no icons: they sit in the footer, which is exactly where a visitor
  // goes to check whether a business is real.
  facebook: null as string | null,
  instagram: null as string | null,
} as const;

export function absoluteUrl(path = ""): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path) return site.domain;
  return `${site.domain}${path.startsWith("/") ? path : `/${path}`}`;
}

export function waLink(message: string = defaultWaMessage): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!basePath || !path.startsWith("/")) {
    return path;
  }
  return `${basePath}${path}`;
}

export const defaultWaMessage = "היי, אשמח לקבל הצעת מחיר מדפוס ראובן";

/**
 * "תיק עבודות" only appears once there is one.
 *
 * It sat fourth in the primary nav while `portfolio` was an empty array, so the
 * one link a stranger clicks to check whether this shop is real led to "העבודות
 * בדרך לכאן". On a site whose whole job is looking established, advertising
 * proof and then apologising is worse than never mentioning it.
 *
 * Derived, not commented out, so the link returns by itself the day real work
 * lands in data/content.ts. The route stays reachable from the footer.
 */
export const navLinks = [
  { href: "/", label: "ראשי" },
  { href: "/services", label: "שירותים" },
  { href: "/products", label: "מוצרים" },
  ...(portfolio.length > 0 ? [{ href: "/portfolio", label: "תיק עבודות" }] : []),
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
];
