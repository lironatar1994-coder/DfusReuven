import type { Metadata } from "next";
import Image from "next/image";
import PortfolioGallery from "@/components/PortfolioGallery";
import { CtaBand, Crumbs, Reveal, SectionHead } from "@/components/ui";
import { portfolio } from "@/data/content";

export const metadata: Metadata = {
  title: "תיק עבודות",
  description:
    "מבחר עבודות דפוס, עיצוב גרפי ושילוט שביצענו – דפוס לעסקים, הזמנות לאירועים, שילוט, מדבקות ואריזות ומוצרי פרסום.",
};

export default function PortfolioPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "תיק עבודות" }]} />
          <h1>עבודות שמדברות בעד עצמן</h1>
          <p>
            מבחר מתוך הפרויקטים שביצענו. לחצו על עבודה כדי לראות אילו חומרים, ניירות וגימורים
            השתמשנו בה.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <PortfolioGallery items={portfolio} />
        </div>
      </section>

      <section className="section section--paper section--tight">
        <div className="container">
          <Reveal>
            <SectionHead
              title="הגימור הוא ההבדל"
              lead="פויל, הבלטה, למינציה סופט-טאץ׳, חיתוך צורני וניירות מיוחדים – זה מה שהופך עבודת דפוס רגילה למוצר שנעים להחזיק ביד."
              center
            />
          </Reveal>
          <div className="grid grid--2">
            <Reveal className="media-stack">
              <Image
                src="/images/finishes.svg"
                alt="דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים"
                width={800}
                height={600}
              />
            </Reveal>
            <Reveal delay={100} className="media-stack">
              <Image
                src="/images/machine.svg"
                alt="מכונת דפוס אופסט בעבודה בבית הדפוס"
                width={800}
                height={600}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        title="ראיתם משהו שאהבתם?"
        text="נשמח להתאים לכם עבודה דומה – בסגנון, בחומרים ובתקציב שמתאימים לכם."
      />
    </>
  );
}
