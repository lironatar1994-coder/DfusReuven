import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { CtaBand, Crumbs, Reveal, SectionHead } from "@/components/ui";
import { getProduct } from "@/data/catalog";
import { getSituation, situations } from "@/data/situations";
import { absoluteUrl, site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return situations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation) return { title: "הדף לא נמצא" };

  return {
    title: `${situation.title} — ${situation.tagline}`,
    description: situation.intro.slice(0, 160),
    alternates: { canonical: `/for/${situation.slug}` },
    openGraph: {
      title: `${situation.title} | ${site.name}`,
      description: situation.tagline,
      images: [{ url: absoluteUrl(situation.image), width: 800, height: 600, alt: situation.alt }],
    },
  };
}

export default async function SituationPage({ params }: Params) {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation) notFound();

  const items = situation.products.map(getProduct).filter((p) => p !== undefined);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "מוצרים", href: "/products" }, { label: situation.title }]} />
          <h1>{situation.title}</h1>
          <p>{situation.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title={`מה בדרך כלל מזמינים ל${situation.title.replace(/^פותחים |^מתחתנים|^יוצאים /, "")}`.trim()}
              lead="אפשר להזמין הכול יחד בעיצוב אחיד, או כל פריט בנפרד."
            />
          </Reveal>
          <div className="grid grid--4">
            {items.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 4) * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper section--tight">
        <div className="container split">
          <Reveal className="media-stack">
            <Image src={situation.image} alt={situation.alt} width={800} height={600} />
          </Reveal>
          <Reveal delay={100}>
            <SectionHead
              title="הזמנה אחת, עיצוב אחד"
              lead="כשכל הפריטים נעשים יחד הם יוצאים באותה שפה עיצובית — ובדרך כלל גם יוצא זול יותר מלהזמין כל דבר בנפרד."
            />
            <div className="btn-row">
              <a className="btn btn--primary" href="/quote">
                קבלו הצעה לערכה מלאה
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="לא בטוחים מה בדיוק צריך?"
        text="ספרו לנו מה אתם פותחים או חוגגים, ונרכיב לכם רשימה עם מחיר."
      />
    </>
  );
}
