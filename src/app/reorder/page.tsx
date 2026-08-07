import type { Metadata } from "next";
import ReorderForm from "@/components/ReorderForm";
import { Crumbs, Reveal, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "הזמנה חוזרת",
  description:
    "הזמנתם אצלנו כבר? השאירו טלפון ומה אתם צריכים שוב — נאתר את העבודה הקודמת ונדפיס אותה מחדש בלי למלא טפסים.",
};

export default function ReorderPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "הזמנה חוזרת" }]} />
          <h1>אותו דבר, עוד פעם</h1>
          <p>
            אם כבר הדפסתם אצלנו, אין צורך למלא שום דבר מחדש. השאירו טלפון ומה אתם צריכים —
            נאתר את הקובץ והמפרט מהפעם הקודמת ונחזור אליכם לאישור.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <SectionHead
              title="שני פרטים וסיימנו"
              lead="בלי חשבון, בלי סיסמה, בלי להעלות קובץ מחדש."
            />
          </Reveal>
          <div className="form-wrap">
            <ReorderForm />
          </div>
        </div>
      </section>
    </>
  );
}
