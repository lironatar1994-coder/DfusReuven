import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, Crumbs, Marker, Reveal, SectionHead } from "@/components/ui";
import { services } from "@/data/catalog";
import { processSteps } from "@/data/content";

export const metadata: Metadata = {
  title: "שירותי דפוס ועיצוב",
  description:
    "דפוס לעסקים, הזמנות לאירועים, שילוט ומיתוג, מדבקות ואריזות, מוצרי פרסום ועיצוב גרפי – כל שירותי בית הדפוס תחת קורת גג אחת.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Crumbs trail={[{ label: "שירותים" }]} />
          <h1>כל שירותי הדפוס והעיצוב במקום אחד</h1>
          <p>
            בית דפוס מלא הכולל עיצוב גרפי, דפוס אופסט ודפוס דיגיטלי, שילוט לעסקים, מדבקות, אריזות
            ומוצרי פרסום – עם ליווי אישי בכל שלב.
          </p>
        </div>
      </section>

      {services.map((service, i) => (
        <section
          className={`section${i % 2 === 1 ? " section--paper" : ""}`}
          id={service.slug}
          key={service.slug}
        >
          <div className="container split">
            <Reveal className={i % 2 === 1 ? "media-stack" : undefined}>
              {i % 2 === 1 ? (
                <Image src={service.image} alt={service.alt} width={800} height={500} />
              ) : (
                <div>
                  <Marker label={service.title} num={String(i + 1).padStart(2, "0")} />
                  <h2>{service.title}</h2>
                  <p style={{ color: "var(--muted)", fontSize: "1.04rem" }}>{service.short}</p>
                  <p>{service.body}</p>
                  <ul className="chips" style={{ margin: "20px 0 26px" }}>
                    {service.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                  <div className="btn-row">
                    <Link className="btn btn--primary" href="/quote">
                      בקשת הצעת מחיר
                    </Link>
                    <Link className="btn btn--secondary" href="/products">
                      לקטלוג המוצרים
                    </Link>
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal delay={100} className={i % 2 === 1 ? undefined : "media-stack"}>
              {i % 2 === 1 ? (
                <div>
                  <Marker label={service.title} num={String(i + 1).padStart(2, "0")} />
                  <h2>{service.title}</h2>
                  <p style={{ color: "var(--muted)", fontSize: "1.04rem" }}>{service.short}</p>
                  <p>{service.body}</p>
                  <ul className="chips" style={{ margin: "20px 0 26px" }}>
                    {service.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                  <div className="btn-row">
                    <Link className="btn btn--primary" href="/quote">
                      בקשת הצעת מחיר
                    </Link>
                    <Link className="btn btn--secondary" href="/portfolio">
                      לדוגמאות
                    </Link>
                  </div>
                </div>
              ) : (
                <Image src={service.image} alt={service.alt} width={800} height={500} />
              )}
            </Reveal>
          </div>
        </section>
      ))}

      <section className="section section--tint">
        <div className="container">
          <Reveal>
            <SectionHead title="איך זה עובד?" center />
          </Reveal>
          <Reveal>
            <ol className="steps">
              {processSteps.map((step, i) => (
                <li className="step" key={step.title}>
                  <div className="step__num" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="לא בטוחים איזה שירות מתאים לכם?"
        text="ספרו לנו מה המטרה ואנחנו נמליץ על המוצר, החומר והכמות הנכונים."
      />
    </>
  );
}
