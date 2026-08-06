import type { Metadata } from "next";
import Image from "@/components/Img";
import Link from "next/link";
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
          {portfolio.length > 0 ? (
            <PortfolioGallery items={portfolio} />
          ) : (
            <Reveal>
              <div className="empty-state">
                <h2>העבודות בדרך לכאן</h2>
                <p>
                  אנחנו מצלמים כרגע מבחר עבודות שיצאו מבית הדפוס — ניירת עסקית, הזמנות עם פויל,
                  שילוט ואריזות — ונעלה אותן לכאן. בינתיים, אם יש משהו מסוים שאתם רוצים לראות,
                  דברו איתנו ונשלח לכם דוגמאות של עבודות דומות שביצענו.
                </p>
                <div className="btn-row btn-row--center">
                  <Link className="btn btn--primary" href="/quote">
                    בקשו לראות דוגמאות
                  </Link>
                  <Link className="btn btn--secondary" href="/products">
                    לקטלוג המוצרים
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
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
