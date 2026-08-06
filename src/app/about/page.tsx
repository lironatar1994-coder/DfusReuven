import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, Crumbs, Reveal, SectionHead, SpecLine } from "@/components/ui";
import { CheckIcon, PaletteIcon, ShieldIcon, UsersIcon } from "@/components/icons";
import { stats } from "@/data/content";

export const metadata: Metadata = {
  title: "אודות — יותר מבית דפוס",
  description:
    "דפוס ראובן מלווה עסקים ולקוחות פרטיים משלב הרעיון ועד למוצר המודפס, בשילוב יצירתיות, ניסיון וטכנולוגיות דפוס מתקדמות.",
};

const values = [
  {
    Icon: ShieldIcon,
    title: "אחריות על התוצאה",
    text: "אנחנו בודקים כל קובץ לפני ההדפסה – רזולוציה, בליד, צבעים וטקסטים. אם משהו לא ייראה טוב בדפוס, נגיד לכם לפני ולא אחרי.",
  },
  {
    Icon: UsersIcon,
    title: "שירות אישי",
    text: "לא מוקד ולא טפסים אינסופיים. מדברים איתנו ישירות, בטלפון או בוואטסאפ, ומקבלים תשובה מהאדם שמטפל בעבודה שלכם.",
  },
  {
    Icon: PaletteIcon,
    title: "עיצוב שמבין דפוס",
    text: "המעצבים שלנו יושבים ליד מכונות הדפוס. זה אומר עיצוב שיודע מראש איך ייראה הצבע על הנייר, איפה החיתוך עובר ומה יעבוד בגימור.",
  },
];

const capabilities = [
  { title: "דפוס אופסט", text: "דיוק צבע גבוה ומחיר משתלם בכמויות גדולות." },
  { title: "דפוס דיגיטלי", text: "כמויות קטנות, התאמה אישית וזמן ביצוע קצר." },
  { title: "הדפסה רחבה", text: "שמשוניות, רולאפים, קאפות ומדבקות בגדלים גדולים." },
  { title: "מחלקת גימור", text: "פויל, הבלטה, למינציה, חיתוך צורני, כריכה ומספור." },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "אודות" }]} />
          <h1>יותר מבית דפוס</h1>
          <p>
            בדפוס ראובן אנחנו מלווים עסקים ולקוחות פרטיים משלב הרעיון הראשוני ועד למוצר המודפס.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split split--wide-media">
          <Reveal className="media-stack">
            <Image
              src="/images/about-studio.svg"
              alt="מעצב עובד בסטודיו של דפוס ראובן לצד מכונת הדפוס"
              width={800}
              height={600}
            />
            <Image
              className="media-stack__sm"
              src="/images/machine.svg"
              alt="מכונת דפוס אופסט בעבודה"
              width={800}
              height={600}
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHead title="מבית דפוס שכונתי לבית הפקה מלא" />
            <p style={{ color: "var(--ink-soft)", fontSize: "1.05rem" }}>
              בדפוס ראובן אנחנו מלווים עסקים ולקוחות פרטיים משלב הרעיון הראשוני ועד למוצר המודפס. אנו
              משלבים יצירתיות, ניסיון, חומרי גלם איכותיים וטכנולוגיות דפוס מתקדמות, כדי שכל עבודה
              תיראה מקצועית, מדויקת ומרשימה.
            </p>
            <p>
              התחלנו כבית דפוס קטן שנתן שירות לעסקים בשכונה, והיום אנחנו מפיקים מדי שנה אלפי עבודות –
              מכרטיס ביקור בודד ועד פרויקטי מיתוג ושילוט מלאים. מה שלא השתנה זה היחס: כל לקוח מקבל איש
              קשר אחד שמלווה אותו לאורך כל הדרך.
            </p>
            <SpecLine items={["+15 שנות ניסיון", "אופסט ודיגיטלי", "מדידה והתקנה"]} />
          </Reveal>
        </div>
      </section>

      <section className="section section--paper section--tight">
        <div className="container">
          <Reveal className="stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead title="הערכים שמנחים כל עבודה" center />
          </Reveal>
          <div className="grid grid--3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="card" style={{ height: "100%", padding: 30 }}>
                  <span
                    className="ico"
                    aria-hidden
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--trim)",
                      background: "var(--blue-tint)",
                      color: "var(--blue)",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <value.Icon />
                  </span>
                  <h3>{value.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: ".97rem", margin: 0 }}>{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <Reveal>
            <SectionHead
              title="טכנולוגיה וחומרים"
              lead="בית הדפוס שלנו משלב דפוס אופסט לכמויות גדולות ודפוס דיגיטלי לכמויות קטנות ולזמני ביצוע קצרים, לצד מכונות גימור, חיתוך והדפסה רחבה לשילוט."
            />
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
          <Reveal delay={100} className="media-stack">
            <Image
              src="/images/finishes.svg"
              alt="דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים"
              width={800}
              height={600}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="בואו נתחיל לעבוד יחד"
        text="נשמח לשמוע על הפרויקט שלכם ולהציע את הדרך הנכונה לבצע אותו."
      />
    </>
  );
}
