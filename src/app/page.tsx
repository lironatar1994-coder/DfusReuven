import { Suspense } from "react";
import Image from "@/components/Img";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PortfolioGallery from "@/components/PortfolioGallery";
import QuoteForm from "@/components/QuoteForm";
import ContactBlock from "@/components/ContactBlock";
import WhatsAppProofStrip from "@/components/WhatsAppProof";
import Estimator from "@/components/Estimator";
import { Reveal, SectionHead, SpecLine } from "@/components/ui";
import { benefitIcons, CheckIcon, PressStrip, ShieldIcon, Stars } from "@/components/icons";
import { featuredProducts, services } from "@/data/catalog";
import { benefits, portfolio, processSteps, stats, testimonials } from "@/data/content";
import { situations } from "@/data/situations";
import { whatsappProof } from "@/data/proof";

/**
 * Homepage section order, and why.
 *
 * 1  Hero          what this is, and one tap to act
 * 2  Estimator     answers "how much" before asking for anything — the one
 *                  question every print customer opens with
 * 3  Situations    routes by need ("I'm opening a shop"), how people arrive
 * 4  Catalogue     what we print + the products, with real prices
 * 5  Why here      the differentiators and who we are, in one block
 * 6  Proof         real customer messages (renders once they exist)
 * 7  Process       what happens after you send — answers the last doubt
 * 8  Quote form    the ask
 * 9  Contact       reach a human instead
 *
 * Previously this ran to 13 sections with three separate ways to browse the
 * same catalogue, two adjacent trust sections, and three consecutive asks at
 * the end. Each cluster now does its job once.
 */
export default function HomePage() {
  return (
    <>
      {/* ---------------- 1 · Hero ---------------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__head">
            <h1>
              בית דפוס בבני ברק <em>שבודק את הקובץ לפני שמדפיסים</em>
            </h1>
            <p className="hero__lead">
              כרטיסי ביקור, הזמנות, שילוט, מדבקות ומוצרי פרסום — עיצוב והדפסה באותו מקום, מול
              האנשים שמדפיסים בפועל.
            </p>
          </div>

          <div className="hero__actions">
            <div className="btn-row">
              <Link className="btn btn--primary" href="#estimator">
                כמה זה עולה?
              </Link>
              <Link className="btn btn--secondary" href="/quote">
                לקבלת הצעת מחיר
              </Link>
            </div>
            <p className="trust-line">
              <span>
                <CheckIcon />
                בודקים כל קובץ לפני הדפסה
              </span>
              <span>
                <CheckIcon />
                מדברים ישירות עם בית הדפוס
              </span>
              <span>
                <CheckIcon />
                בני ברק · א׳–ה׳ עד 18:30
              </span>
            </p>
          </div>

          <div className="hero__media">
            <Image
              src="/images/hero-collage.svg"
              alt="קולאז' של מוצרי דפוס: כרטיסי ביקור, הזמנה עם פויל זהב, פלייר, אריזה ממותגת ומדבקות בגליל"
              width={900}
              height={720}
              priority
            />
            <div className="ticket-tag">
              <div className="ticket-tag__top">
                <span>בית הדפוס</span>
                <PressStrip />
              </div>
              <strong>בני ברק</strong>
              <span>ז׳בוטינסקי 84 · א׳–ה׳ 09:30–18:30</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2 · Estimator ---------------- */}
      <section className="section section--paper" id="estimator">
        <div className="container container--narrow">
          <Reveal>
            <SectionHead
              title="כמה זה עולה?"
              lead="בחרו מה אתם מדפיסים וקבלו טווח מחיר מיד — בלי למלא טופס ובלי לחכות."
              center
            />
          </Reveal>
          <Reveal delay={60}>
            <Estimator />
          </Reveal>
        </div>
      </section>

      {/* ---------------- 3 · Situations ---------------- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מה מביא אתכם אלינו?"
              lead="רוב הלקוחות שלנו לא מחפשים מוצר בודד אלא ערכה שלמה. אלה הצירופים הנפוצים."
              ruled
            />
          </Reveal>
          <div className="grid grid--4">
            {situations.map((situation, i) => (
              <Reveal key={situation.slug} delay={(i % 4) * 70}>
                <Link className="situation" href={`/for/${situation.slug}`}>
                  <span className="situation__title">{situation.title}</span>
                  <span className="situation__tagline">{situation.tagline}</span>
                  <span className="situation__count">
                    {situation.products.length} מוצרים בערכה
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {stats.length > 0 ? (
        <section className="section section--tight">
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
      ) : null}

      {/* ---------------- 4 · Catalogue ----------------
          Services used to be a six-card section of its own, immediately above a
          product grid containing the same inventory. It is now a compact strip
          of links into the services page, so the page offers one catalogue
          rather than two overlapping ones. */}
      <section className="section section--paper" id="products">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מה אנחנו מדפיסים"
              lead="המחירים הם טווחי פתיחה, לא כולל מע״מ. המחיר הסופי נקבע לפי כמות, נייר וגימור."
              ruled
            />
          </Reveal>

          <Reveal>
            <nav className="print-list" aria-label="תחומי הדפוס שלנו">
              {services.map((service) => (
                <Link key={service.slug} href={`/services#${service.slug}`}>
                  {service.title}
                </Link>
              ))}
            </nav>
          </Reveal>

          <div className="grid grid--4">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <Reveal key={product.slug} delay={(i % 4) * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="btn-row btn-row--center" style={{ marginTop: 40 }}>
            <Link className="btn btn--primary" href="/products">
              לכל המוצרים בקטלוג
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Portfolio (renders once real work exists) ---------------- */}
      {portfolio.length > 0 ? (
        <section className="section" id="portfolio">
          <div className="container">
            <Reveal>
              <SectionHead
                title="עבודות שמדברות בעד עצמן"
                lead="מבחר מתוך הפרויקטים האחרונים שלנו. לחצו על עבודה כדי לראות את החומרים והגימור שבהם השתמשנו."
                center
              />
            </Reveal>
            <PortfolioGallery items={portfolio} />
            <div className="btn-row btn-row--center" style={{ marginTop: 36 }}>
              <Link className="btn btn--secondary" href="/portfolio">
                לתיק העבודות המלא
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- 5 · Why here ----------------
          Was two adjacent sections — "why us" and "about" — both arguing that
          the shop is trustworthy, each with its own image. One block now. */}
      <section className="section" id="why">
        <div className="container split">
          <Reveal>
            <SectionHead
              title="למה דפוס ראובן?"
              lead="אנחנו מדפיסים בבני ברק לעסקים, למוסדות ולמשפחות — מכרטיס ביקור בודד ועד ערכת מיתוג שלמה. כל עבודה נבדקת לפני שהיא נכנסת למכונה, וכל לקוח מדבר עם מי שמטפל בה בפועל."
            />
            <ul className="benefits">
              {benefits.map((benefit) => {
                const Icon = benefitIcons[benefit.icon] ?? ShieldIcon;
                return (
                  <li key={benefit.title}>
                    <span className="ico" aria-hidden>
                      <Icon />
                    </span>
                    <span>
                      <strong>{benefit.title}</strong>
                      <span>{benefit.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <SpecLine items={["דפוס אופסט", "דפוס דיגיטלי", "הדפסה רחבה", "מחלקת גימור"]} />
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn btn--secondary" href="/about">
                קראו עוד עלינו
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100} className="media-stack">
            <Image
              src="/images/about-studio.svg"
              alt="מעצב עובד בסטודיו של דפוס ראובן לצד מכונת הדפוס"
              width={800}
              height={600}
            />
            <Image
              className="media-stack__sm"
              src="/images/finishes.svg"
              alt="דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים"
              width={800}
              height={600}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- 6 · Proof ---------------- */}
      {whatsappProof.length > 0 ? (
        <section className="section section--paper" id="proof">
          <div className="container">
            <Reveal>
              <SectionHead
                title="מה לקוחות כותבים לנו"
                lead="הודעות אמיתיות מלקוחות, מפורסמות באישורם."
                center
              />
            </Reveal>
            <Reveal delay={60}>
              <WhatsAppProofStrip />
            </Reveal>
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section className="section section--paper" id="testimonials">
          <div className="container">
            <Reveal>
              <SectionHead title="לקוחות מספרים" center />
            </Reveal>
            <div className="grid grid--3">
              {testimonials.map((item, i) => (
                <Reveal key={item.quote} delay={i * 80}>
                  <figure className="quote-card" style={{ height: "100%" }}>
                    <Stars />
                    <blockquote>“{item.quote}”</blockquote>
                    <figcaption>
                      <span className="avatar" aria-hidden>
                        {item.initial}
                      </span>
                      <cite>
                        <strong>{item.name}</strong>
                        <span>{item.business}</span>
                      </cite>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- 7 · Process ----------------
          Moved down from the middle of the page. "What happens after I send
          this?" is the doubt that stops a submission, so it belongs next to
          the form rather than stranded between browse sections. */}
      <section className="section section--tint" id="process">
        <div className="container">
          <Reveal>
            <SectionHead
              title="איך זה עובד?"
              lead="ארבעה שלבים מהרעיון ועד למוצר שמגיע אליכם ליד."
              center
            />
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

      {/* ---------------- 8 · Quote form ---------------- */}
      <section className="section" id="quote">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מה תרצו להדפיס?"
              lead="שלחו לנו כמה פרטים ונחזור אליכם עם המלצה והצעת מחיר."
              center
            />
          </Reveal>
          <Reveal className="form-wrap" delay={80}>
            <Suspense fallback={null}>
              <QuoteForm />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* ---------------- 9 · Contact ----------------
          The page ends here. A closing CTA band after a section that already
          carries the phone, WhatsApp, email, address and a form would be the
          fourth ask in a row. */}
      <section className="section section--paper" id="contact">
        <div className="container">
          <Reveal>
            <SectionHead
              title="נשמח לשמוע מכם"
              lead="אפשר להתקשר, לשלוח וואטסאפ או פשוט לקפוץ אלינו לבית הדפוס."
              ruled
            />
          </Reveal>
          <ContactBlock />
        </div>
      </section>
    </>
  );
}
