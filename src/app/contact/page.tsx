import type { Metadata } from "next";
import ContactBlock from "@/components/ContactBlock";
import { CtaBand, Crumbs, Faq, Reveal, SectionHead } from "@/components/ui";
import { contactFaq } from "@/data/content";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "טלפון, וואטסאפ, אימייל, כתובת ושעות פעילות של דפוס ראובן. נשמח לענות על כל שאלה ולהכין לכם הצעת מחיר.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "צור קשר" }]} />
          <h1>נשמח לשמוע מכם</h1>
          <p>
            אפשר להתקשר, לשלוח וואטסאפ, לכתוב לנו מייל או פשוט לקפוץ אלינו לבית הדפוס. אנחנו כאן כדי
            לעזור לכם להוציא את העבודה בצורה הטובה ביותר.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ContactBlock />
        </div>
      </section>

      <section className="section section--paper section--tight">
        <div className="container">
          <Reveal>
            <SectionHead title="לפני שפונים אלינו" center />
          </Reveal>
          <Reveal>
            <Faq items={contactFaq} />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="מעדיפים שנחזור אליכם?"
        text="השאירו פרטים בטופס הצעת המחיר ונחזור אליכם עם המלצה ומחיר."
        primaryLabel="לטופס הצעת מחיר"
      />
    </>
  );
}
