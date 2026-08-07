import type { Metadata } from "next";
import Image from "@/components/Img";
import { CtaBand, Crumbs, Reveal, SectionHead } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { clientTypes } from "@/data/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות בית הדפוס",
  // Ends on the capability list. It used to close "— הכול בבניין אחד, לצד
  // מחלקת העיצוב", which is not true of this shop; see the note in
  // data/content.ts. Nothing replaced it, because nothing verified was
  // available to replace it with.
  description:
    "דפוס ראובן, ז'בוטינסקי 84 בבני ברק. דפוס אופסט, דפוס דיגיטלי, הדפסה רחבה ומחלקת גימור.",
};

/**
 * This page was three times longer and said less.
 *
 * It opened with "יותר מבית דפוס", then a section headed הסיפור שלנו whose first
 * sentence was copy-pasted verbatim from the hero 25 lines above it and whose
 * second was "יצירתיות, ניסיון, חומרי גלם איכותיים וטכנולוגיות דפוס מתקדמות…
 * מקצועית, מדויקת ומרשימה" — ten abstract nouns and not one fact. Below that sat
 * three "values" cards, one of them titled שירות אישי, restating the homepage
 * benefits in weaker words.
 *
 * All of it is gone. What is left is only what is true and checkable: where the
 * shop is, what is in the building, and what those machines can make. A short
 * honest page beats a long empty one, and on a site with no prices, no
 * portfolio and no testimonials, this page cannot afford to bluff.
 *
 * To make it genuinely good it needs facts only Reuven has — the year the shop
 * opened, who Reuven is, the make of the press on the floor, one category of
 * regular customer. Those go here when they arrive. Nothing gets invented in
 * the meantime.
 */

const capabilities = [
  { title: "דפוס אופסט", text: "דיוק צבע גבוה, ומחיר שיורד ככל שהכמות עולה." },
  { title: "דפוס דיגיטלי", text: "כמויות קטנות, התאמה אישית, וזמן ביצוע קצר." },
  { title: "הדפסה רחבה", text: "שמשוניות, רולאפים, קאפות ומדבקות בגדלים גדולים." },
  { title: "מחלקת גימור", text: "פויל, הבלטה, למינציה, חיתוך צורני, כריכה ומספור." },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "אודות" }]} />
          {/* "יותר מבית דפוס" apologised for the noun the homepage is proud of.
              This one names the street instead — a thing no competitor can copy
              and the one detail a Bnei Brak local will recognise. */}
          <h1>בית הדפוס ברחוב ז׳בוטינסקי</h1>
          {/* The second sentence — "מכונות הדפוס, מחלקת הגימור והמעצבים נמצאים
              באותו בניין" — is gone. It is the same claim the hero was carrying
              and it is not true. What is left is the address and who we print
              for, both of which are. */}
          <p>
            אנחנו יושבים ב{site.addressShort} ב{site.city}, ומדפיסים לעסקים, למוסדות ולמשפחות
            באזור.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split split--wide-media">
          <Reveal className="media-stack">
            <Image
              src="/images/about-studio.webp"
              alt="מעצב עובד בסטודיו של דפוס ראובן לצד מכונת הדפוס"
              width={800}
              height={600}
            />
            <Image
              className="media-stack__sm"
              src="/images/machine.webp"
              alt="מכונת דפוס אופסט בעבודה"
              width={800}
              height={600}
            />
          </Reveal>
          <Reveal delay={100}>
            {/* No lead. It read "ארבע יכולות בבניין אחד. זה מה שמאפשר להגיד לכם
                בטלפון אם משהו אפשרי, בלי לבדוק מול ספק" — both sentences are the
                one-building claim, the second one explicitly ("without checking
                with a supplier"). The four capabilities below say what there is;
                they do not need a sentence in front of them making a claim about
                where they sit. */}
            <SectionHead title="מה יש כאן" ruled />
            <ul className="benefits">
              {capabilities.map((item) => (
                <li key={item.title}>
                  <span className="ico" aria-hidden>
                    <CheckIcon />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <Reveal>
            <SectionHead
              title="לבוא לראות"
              lead="דוגמאות הנייר, הפויל והגימורים נמצאות אצלנו על הדלפק. אם אתם מתלבטים בין שני ניירות, זו שיחה של חמש דקות כאן ולא שלושה מיילים."
              ruled
            />
            <p style={{ color: "var(--ink-soft)" }}>
              אנחנו פתוחים {site.hours[0]?.days} {site.hours[0]?.time}. אפשר להיכנס בלי לתאם, ואם
              אתם רוצים לשבת עם מעצב — עדיפה שיחה קצרה מראש כדי שנפנה לכם זמן.
            </p>
          </Reveal>
          <Reveal delay={100} className="media-stack">
            <Image
              src="/images/finishes.webp"
              alt="דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים"
              width={800}
              height={600}
            />
          </Reveal>
        </div>
      </section>

      {/* The trust argument this page was missing. Not adjectives — a list of
          who actually prints here. */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מי מדפיס אצלנו"
              lead="לאורך השנים הדפסנו לגופים ציבוריים, למוסדות חינוך, לחברות ולעסקים קטנים. אלה סוגי הלקוחות שחוזרים אלינו."
              ruled
            />
          </Reveal>
          <Reveal delay={60}>
            <ul className="client-list">
              {clientTypes.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="יש לכם עבודה בראש?"
        text="ספרו לנו מה אתם צריכים ונגיד לכם מה אפשרי, בכמה זמן, ומה כדאי לשנות לפני שמדפיסים."
      />
    </>
  );
}
