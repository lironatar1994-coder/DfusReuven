import { businessHours } from "./hours";

const configuredDomain = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const site = {
  name: "דפוס ראובן",
  nameEn: "DFUS REUVEN",
  tagline: "עיצוב • דפוס • שילוט",
  description:
    "בית דפוס לעיצוב גרפי, דפוס אופסט ודיגיטלי, שילוט לעסקים, הזמנות, מדבקות ומוצרי פרסום – עם ליווי אישי משלב הרעיון ועד למוצר המוגמר.",
  domain: (configuredDomain || "https://www.dfusreuven.co.il").replace(/\/+$/, ""),
  locale: "he_IL",
  language: "he-IL",
  country: "IL",
  currency: "ILS",
  serviceArea: "ישראל",
  socialImage: "/images/hero-collage.svg",

  // Verified from the business's public listings (InPrint, דפי זהב), בני ברק.
  phoneDisplay: "03-5785651",
  phoneHref: "+97235785651",
  fax: "03-5798656",
  address: "ז'בוטינסקי 84, בני ברק",
  addressShort: "ז'בוטינסקי 84",
  city: "בני ברק",

  // ⚠️ STILL PLACEHOLDERS — the public listings carry neither.
  // WhatsApp is the site's primary call to action (header, mobile bar, every
  // product page, the quote form). 03-5785651 is a landline and cannot receive
  // WhatsApp, so this must be a mobile number before launch.
  whatsapp: "972500000000",
  email: "info@dfusreuven.co.il",

  // Display hours come from lib/hours.ts so they can never disagree with the
  // open/closed badge on the mobile bar.
  hours: businessHours,
  facebook: "#",
  instagram: "#",
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

export const navLinks = [
  { href: "/", label: "ראשי" },
  { href: "/services", label: "שירותים" },
  { href: "/products", label: "מוצרים" },
  { href: "/portfolio", label: "תיק עבודות" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
] as const;
