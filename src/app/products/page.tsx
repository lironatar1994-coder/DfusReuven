import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import Estimator from "@/components/Estimator";
import { CtaBand, Crumbs, Faq, Reveal, SectionHead } from "@/components/ui";
import { products } from "@/data/catalog";
import { productFaq } from "@/data/content";

export const metadata: Metadata = {
  title: "קטלוג מוצרי דפוס",
  description:
    "קטלוג מוצרי הדפוס שלנו: כרטיסי ביקור, פליירים, הזמנות, מדבקות, פנקסי קבלות, רולאפים, שמשוניות ושלטים לעסקים.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "מוצרים" }]} />
          <h1>קטלוג מוצרי דפוס</h1>
          <p>
            המוצרים הנפוצים ביותר בבית הדפוס שלנו. המחירים המוצגים הם מחירי פתיחה להמחשה – המחיר
            הסופי נקבע לפי כמות, סוג הנייר והגימור שתבחרו.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title="כל המוצרים"
              lead="סננו לפי קטגוריה. לאומדן מהיר לפי כמות וגימור, גללו לסוף העמוד."
              ruled
            />
          </Reveal>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* The estimator lives here rather than on the homepage: prices belong on
          the catalogue page, where someone is already shopping. */}
      <section className="section section--paper" id="estimator">
        <div className="container container--narrow">
          <Reveal>
            <SectionHead
              title="אומדן מהיר"
              lead="בחרו מוצר, כמות וגימור וקבלו טווח מחיר להתרשמות. ההצעה המחייבת נשלחת אחרי שנראה את הקובץ."
              center
            />
          </Reveal>
          <Reveal delay={60}>
            <Estimator />
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <SectionHead title="הזמנת מוצרי דפוס" center />
          </Reveal>
          <Reveal>
            <Faq items={productFaq} />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="לא מצאתם את המוצר שחיפשתם?"
        text="אנחנו מפיקים גם עבודות דפוס בהתאמה אישית. ספרו לנו מה אתם צריכים ונבדוק עבורכם."
      />
    </>
  );
}
