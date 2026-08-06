import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import QuoteForm from "@/components/QuoteForm";
import { Crumbs, Marker, Reveal, SectionHead, SpecLine } from "@/components/ui";
import { TruckIcon } from "@/components/icons";
import { getProduct, products, relatedProducts } from "@/data/catalog";
import { absoluteUrl, site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "המוצר לא נמצא" };

  return {
    title: `הדפסת ${product.name}`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `הדפסת ${product.name} | ${site.name}`,
      description: product.short,
      images: [{ url: absoluteUrl(product.image), width: 800, height: 600, alt: product.alt }],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    category: product.categoryLabel,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: site.name },
    },
  };

  return (
    <>
      <section className="section" style={{ paddingBlock: "28px 0" }}>
        <div className="container">
          <Crumbs trail={[{ label: "מוצרים", href: "/products" }, { label: product.name }]} />
        </div>
      </section>

      <section className="section" style={{ paddingBlock: "16px 0" }}>
        <div className="container split split--wide-media" style={{ alignItems: "start" }}>
          <Reveal>
            <ProductGallery shots={product.gallery} />
          </Reveal>

          <Reveal delay={80}>
            <Marker label={product.categoryLabel} />
            <h1 style={{ fontSize: "clamp(1.9rem, 5vw, 2.8rem)" }}>הדפסת {product.name}</h1>
            <p style={{ color: "var(--ink-soft)", fontSize: "1.05rem" }}>{product.description}</p>

            <div className="pd-price">
              <strong>{product.priceFrom}</strong>
              <span>{product.priceUnit} · המחיר הסופי נקבע לפי כמות, חומר וגימור</span>
            </div>

            <h2 className="pd-spec-heading">מפרט המוצר</h2>

            <div className="spec-block">
              <h3>מידות זמינות</h3>
              <ul className="chips">
                {product.sizes.map((size) => (
                  <li key={size}>{size}</li>
                ))}
              </ul>
            </div>

            <div className="spec-block">
              <h3>חומרים</h3>
              <ul className="chips">
                {product.materials.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </div>

            <div className="spec-block">
              <h3>אפשרויות הדפסה</h3>
              <ul className="chips">
                {product.printing.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </div>

            <div className="spec-block">
              <h3>גימורים</h3>
              <ul className="chips">
                {product.finishes.map((finish) => (
                  <li key={finish}>{finish}</li>
                ))}
              </ul>
            </div>

            <div className="note">
              <TruckIcon />
              <span>
                <strong>אספקה ואיסוף:</strong> {product.leadTime}. אפשר לאסוף מבית הדפוס בשעות
                הפעילות או לקבל משלוח עד הבית או המשרד.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container container--narrow">
          <Reveal>
            <SectionHead
              title={`בקשת הצעת מחיר ל${product.name}`}
              lead="מלאו כמה פרטים ונחזור אליכם עם מחיר מדויק לעבודה שלכם."
              center
            />
          </Reveal>
          <Reveal className="form-wrap" delay={80}>
            <Suspense fallback={null}>
              <QuoteForm
              presetProduct={product.name}
              compact
              waMessage={`היי, מעוניין בהצעת מחיר ל${product.name}`}
            />
            </Suspense>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מוצרים משלימים"
              center
            />
          </Reveal>
          <div className="grid grid--3">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={i * 70}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
