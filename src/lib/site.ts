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
  // TODO: החליפו במספרים ובכתובת האמיתיים לפני העלייה לאוויר
  whatsapp: "972500000000",
  phoneDisplay: "050-000-0000",
  phoneHref: "+972500000000",
  email: "info@dfusreuven.co.il",
  address: "רחוב התעשייה 00, שם היישוב",
  addressShort: "רחוב התעשייה 00",
  city: "שם היישוב",
  hours: [
    { days: "ראשון–חמישי", time: "08:30–17:30" },
    { days: "שישי", time: "08:30–13:00" },
  ],
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
