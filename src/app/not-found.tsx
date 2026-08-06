import Link from "next/link";

export const metadata = { title: "העמוד לא נמצא" };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container container--narrow" style={{ textAlign: "center" }}>
        <h1>העמוד הזה לא קיים</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.06rem", maxWidth: 520, margin: "0 auto 30px" }}>
          ייתכן שהקישור השתנה או שהעמוד הוסר. אפשר לחזור לעמוד הבית, לעיין בקטלוג המוצרים או פשוט
          לשלוח לנו הודעה ונעזור לכם למצוא את מה שחיפשתם.
        </p>
        <div className="btn-row btn-row--center">
          <Link className="btn btn--primary" href="/">
            חזרה לעמוד הבית
          </Link>
          <Link className="btn btn--secondary" href="/products">
            לקטלוג המוצרים
          </Link>
          <Link className="btn btn--secondary" href="/contact">
            צור קשר
          </Link>
        </div>
      </div>
    </section>
  );
}
