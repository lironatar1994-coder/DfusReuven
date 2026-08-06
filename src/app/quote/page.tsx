import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteForm from "@/components/QuoteForm";
import { Crumbs, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "בקשת הצעת מחיר",
  description:
    "מלאו כמה פרטים על העבודה שאתם צריכים ונחזור אליכם עם המלצה והצעת מחיר מותאמת אישית.",
};

const promises = [
  { title: "מענה תוך יום עסקים", text: "רוב הפניות מקבלות הצעת מחיר עוד באותו יום." },
  { title: "בדיקת קובץ ללא עלות", text: "נבדוק את הקובץ שלכם ונגיד אם הוא מוכן לדפוס." },
  { title: "בלי התחייבות", text: "הצעת המחיר היא להתרשמות בלבד – אתם מחליטים." },
];

const checklist = [
  { title: "כמות", text: "כמה יחידות אתם צריכים – זה הפרמטר שמשפיע הכי הרבה על המחיר." },
  { title: "מידות", text: "גודל סופי במ״מ או בס״מ, או שם המידה הסטנדרטית (A4, A5)." },
  { title: "קובץ", text: "PDF עם בליד 3 מ״מ ורזולוציה 300dpi, או כל קובץ שיש לכם." },
  { title: "תאריך יעד", text: "מתי אתם צריכים את העבודה ביד – כדי שנתכנן את לוח הזמנים." },
];

export default function QuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "בקשת הצעת מחיר" }]} />
          <h1>מה תרצו להדפיס?</h1>
          <p>
            שלחו לנו כמה פרטים ונחזור אליכם עם המלצה והצעת מחיר. אם אתם עדיין לא בטוחים מה בדיוק אתם
            צריכים – זה בסדר גמור, פשוט תארו לנו את המטרה ואנחנו נמליץ.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <SectionHead
              title="ספרו לנו מה צריך"
              lead="ככל שתפרטו יותר, כך ההצעה שתקבלו תהיה מדויקת יותר — אבל גם שם וטלפון מספיקים כדי להתחיל."
            />
          </Reveal>
          <Reveal className="form-wrap">
            <Suspense fallback={null}><QuoteForm /></Suspense>
          </Reveal>

          <div className="grid grid--3" style={{ marginTop: 34 }}>
            {promises.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="card" style={{ padding: 22, height: "100%" }}>
                  <h3 style={{ fontSize: "1.02rem" }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: ".94rem", margin: 0 }}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper section--tight">
        <div className="container">
          <Reveal>
            <SectionHead
              title="כדי שנוכל לתמחר מדויק"
              center
            />
          </Reveal>
          <Reveal>
            <ol className="steps">
              {checklist.map((item, i) => (
                <li className="step" key={item.title}>
                  <div className="step__num" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: "1.02rem" }}>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  );
}
