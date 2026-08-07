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
          {/* The heading has to know whether there is anything below it. It used
              to promise "עבודות שמדברות בעד עצמן" over an empty page — a title
              that speaks for work that isn't there. */}
          {portfolio.length > 0 ? (
            <>
              <h1>עבודות שמדברות בעד עצמן</h1>
              <p>
                מבחר מתוך הפרויקטים שביצענו. לחצו על עבודה כדי לראות אילו חומרים, ניירות וגימורים
                השתמשנו בה.
              </p>
            </>
          ) : (
            <>
              <h1>תיק העבודות בהכנה</h1>
              <p>
                אנחנו מצלמים עבודות שיצאו מבית הדפוס. עד שהן כאן — אפשר לבוא לראות אותן על הדלפק
                בבני ברק, או לבקש שנשלח דוגמאות של עבודה דומה למה שאתם מתכננים.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {portfolio.length > 0 ? (
            <PortfolioGallery items={portfolio} />
          ) : (
            <Reveal>
              <div className="empty-state">
                <h2>מה כן אפשר לראות עכשיו</h2>
                <p>
                  דוגמאות נייר, פויל וגימורים נמצאות אצלנו בחנות בז׳בוטינסקי 84, ואפשר להיכנס
                  ולגעת בהן בשעות הפעילות. אם אתם מתכננים משהו מסוים, כתבו לנו מה — ונשלח תמונות
                  של עבודה דומה שיצאה מכאן.
                </p>
                <div className="btn-row btn-row--center">
                  <Link className="btn btn--primary" href="/quote">
                    בקשת הצעת מחיר
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
              lead="פויל, הבלטה, למינציה סופט-טאץ׳, חיתוך צורני וניירות מיוחדים. זה השלב שבו שתי עבודות עם אותו קובץ יוצאות שונות לגמרי."
              ruled
            />
          </Reveal>
          <div className="grid grid--2">
            <Reveal className="media-stack">
              <Image
                src="/images/finishes.webp"
                alt="דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים"
                width={800}
                height={600}
              />
            </Reveal>
            <Reveal delay={100} className="media-stack">
              <Image
                src="/images/machine.webp"
                alt="מכונת דפוס אופסט בעבודה בבית הדפוס"
                width={800}
                height={600}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* "ראיתם משהו שאהבתם?" on a page that shows nothing. Asks a question the
          page has made impossible to answer. */}
      <CtaBand
        title="יש לכם עבודה בראש?"
        text="תארו לנו מה אתם מתכננים ונגיד לכם באילו חומרים וגימורים זה נעשה בדרך כלל."
      />
    </>
  );
}
