import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
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
            המוצרים הנפוצים ביותר בבית הדפוס שלנו. לכל מוצר יש מגוון מידות, ניירות וגימורים —
            ספרו לנו מה אתם צריכים ונכין לכם הצעה מדויקת.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title="כל המוצרים"
              lead="סננו לפי קטגוריה, או דברו איתנו ונכוון אתכם למוצר הנכון."
              ruled
            />
          </Reveal>
          <ProductGrid products={products} />
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
