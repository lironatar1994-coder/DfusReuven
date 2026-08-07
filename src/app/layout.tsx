import type { Metadata, Viewport } from "next";
import { Heebo, Miriam_Libre } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileBar } from "@/components/ui";
import { absoluteUrl, allowIndexing, site } from "@/lib/site";
import { openingHoursSchema } from "@/lib/hours";
import "./globals.css";

// Miriam Libre: the sturdy Hebrew workhorse — ink presence for a print house.
const display = Miriam_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

// Heebo: clean and highly readable for body copy and UI.
const body = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover lets env(safe-area-inset-*) actually report the notch
  viewportFit: "cover",
  themeColor: "#102033",
};

const defaultTitle = `${site.name} | בית דפוס, עיצוב גרפי ושילוט לעסקים`;

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  applicationName: site.name,
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description:
    "דפוס ראובן – בית דפוס לעיצוב גרפי, דפוס אופסט ודיגיטלי, הדפסת כרטיסי ביקור, פליירים, הזמנות לחתונה, מדבקות, שילוט לעסקים ומוצרי פרסום. שירות אישי וזמני ביצוע מהירים.",
  authors: [{ name: site.name, url: site.domain }],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description:
      "עיצוב גרפי, דפוס אופסט ודיגיטלי, שילוט, הזמנות ומוצרי פרסום – משלב הרעיון ועד למוצר המוגמר.",
    siteName: site.name,
    url: site.domain,
    locale: site.locale,
    type: "website",
    images: [{ url: absoluteUrl(site.socialImage), width: 1200, height: 630, alt: site.description }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    images: [absoluteUrl(site.socialImage)],
  },
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "PrintShop",
  name: site.name,
  description: site.description,
  image: absoluteUrl(site.socialImage),
  url: site.domain,
  telephone: site.phoneHref,
  email: site.email,
  priceRange: "₪₪",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.addressShort,
    addressLocality: site.city,
    addressCountry: "IL",
  },
  // Derived from lib/hours.ts so structured data never drifts from the site.
  openingHoursSpecification: openingHoursSchema,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          דילוג לתוכן הראשי
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </body>
    </html>
  );
}
