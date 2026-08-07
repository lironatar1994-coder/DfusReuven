import { Suspense } from "react";
import Image from "@/components/Img";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PortfolioGallery from "@/components/PortfolioGallery";
import QuoteForm from "@/components/QuoteForm";
import ContactBlock from "@/components/ContactBlock";
import WhatsAppProofStrip from "@/components/WhatsAppProof";
import { Reveal, SectionHead, SpecLine } from "@/components/ui";
import { benefitIcons, CheckIcon, PressStrip, ShieldIcon, situationIcons, Stars } from "@/components/icons";
import { featuredProducts, products, services } from "@/data/catalog";
import { benefits, clientTypes, portfolio, stats, testimonials } from "@/data/content";
import { situations } from "@/data/situations";
import { whatsappProof } from "@/data/proof";

/**
 * Homepage section order, and why.
 *
 * This is an אתר תדמית first: its job is to make the shop look established and
 * worth trusting so that someone calls, not to run a self-serve pricing funnel.
 * Order follows that.
 *
 * 1  Hero          who this is and what they make
 * 2  Catalogue     the range and the craft — the identity argument
 * 3  Situations    how people actually arrive ("I'm opening a shop")
 * 4  Why here      the differentiators and who we are
 * 5  Proof         real customer messages (renders once they exist)
 * 6  Process       how a job runs — reassurance before the ask
 * 7  Quote form    the ask
 * 8  Contact       reach a human instead
 *
 * No prices anywhere on the site. A print price is a function of quantity,
 * paper, finish and size, so any number published here is either wrong or a
 * figure a competitor can undercut. Every product ends at "לפרטים והצעה".
 */
export default function HomePage() {
  return (
    <>
      {/* ---------------- 1 · Hero ---------------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__head">
            {/* Names the two ends of the range instead of claiming "everything".
                Same message, concrete, and keeps בית דפוס + בני ברק for search. */}
            <h1>
              בית דפוס וגרפיקה בבני ברק <em>מכרטיס ביקור ועד שלט חזית</em>
            </h1>
            <p className="hero__lead">
              עיצוב גרפי, דפוס אופסט ודיגיטלי, הזמנות, מדבקות, שילוט ומוצרי פרסום. הכול נעשה
              בבניין אחד בז׳בוטינסקי, מול האנשים שמדפיסים בפועל.
            </p>
          </div>

          <div className="hero__actions">
            <div className="btn-row">
              {/* Was "דברו איתנו" pointing at a form. One action carried eight
                  labels across the site; there are two now — "בקשת הצעת מחיר"
                  goes to the form, "דברו איתנו" reaches a person. A button
                  should say where it lands. */}
              <Link className="btn btn--primary" href="/quote">
                בקשת הצעת מחיר
              </Link>
              <Link className="btn btn--secondary" href="#products">
                מה אנחנו מדפיסים
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
              {/* Was "בני ברק · א׳–ה׳ עד 18:30". The address and the hours
                  already appear on the job ticket a few pixels above, in the
                  fixed bottom bar, in the contact section and in the footer —
                  five times on one page. A trust line has three slots; spending
                  one of them on a sixth restatement is a slot that argues
                  nothing. This is the differentiator the other two are not. */}
              <span>
                <CheckIcon />
                גם 100 יחידות זו הזמנה
              </span>
            </p>
          </div>

          {/* sheet = crop marks at the trim edge. The first thing on the page
              is now a printed sheet, not a photo in a rounded frame. */}
          <div className="hero__media sheet">
            <Image
              src="/images/hero-collage.webp"
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

      {/* ---------------- 4 · Catalogue ----------------
          Services used to be a six-card section of its own, immediately above a
          product grid containing the same inventory. It is now a compact strip
          of links into the services page, so the page offers one catalogue
          rather than two overlapping ones. */}
      <section className="section section--paper" id="products">
        <div className="container">
          {/* The counts are counted, not typed. This lead said "שנים־עשר
              מוצרים" and went stale the moment five products were added. */}
          <Reveal>
            <SectionHead
              title="מה אנחנו מדפיסים"
              lead={`${services.length} תחומים, ${products.length} מוצרים. לא מצאתם? כנראה שאנחנו עושים את זה בכל זאת.`}
              ruled
            />
          </Reveal>

          {/* The six-pill services strip that sat here is gone. Between it, the
              product grid and the situations section, the first quarter of the
              page offered three different ways to browse one inventory — by
              category, by thing, and by occasion. Three is one too many, and
              the strip was the weakest: /services is in the header nav and all
              six are listed in the footer. */}

          {/* Six, not eight. Past four options the extra ones stop informing and
              start costing — and eight cards was also eight identical buttons,
              half of every CTA on the page. */}
          <div className="grid grid--catalog">
            {featuredProducts.slice(0, 6).map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 60}>
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

      {/* ---------------- 3 · Who prints here ----------------
          Straight after the catalogue: this is what we make, and this is who
          trusts us to make it. With no prices, no portfolio and no
          testimonials on the site, this list carries the trust argument
          almost single-handed — so it sits high, not buried on /about. */}
      {/* Ink, not white.
          Between here and the quote form the page ran four consecutive white
          sections — 3,341px, 40% of a phone's scroll, with nothing but a 1px
          #E2E4E7 hairline to say a new argument had started. This band splits
          that run in half, and it lands on the right section: with no prices,
          no portfolio and no testimonials, this list carries the trust
          argument single-handed and was getting the quietest treatment on the
          page to do it with. */}
      <section className="section section--tight section--ink" id="clients">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מי מדפיס אצלנו"
              lead="גופים ציבוריים, מוסדות חינוך, חברות ועסקים קטנים — אלה סוגי הלקוחות שחוזרים אלינו."
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

      {/* ---------------- 3 · Situations ---------------- */}
      <section className="section" id="situations">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מה מביא אתכם אלינו?"
              lead="רוב הלקוחות שלנו לא מחפשים מוצר בודד אלא ערכה שלמה. אלה הצירופים הנפוצים."
              ruled
            />
          </Reveal>
          <div className="grid grid--4">
            {situations.map((situation, i) => {
              const Icon = situationIcons[situation.slug];
              return (
                <Reveal key={situation.slug} delay={(i % 4) * 70}>
                  <Link className="situation" href={`/for/${situation.slug}`}>
                    {/* Four cards of the same size differing only in their
                        words. Aria-hidden: the title says which situation this
                        is, and a briefcase does not need announcing twice. */}
                    {Icon ? (
                      <span className="situation__ico" aria-hidden>
                        <Icon />
                      </span>
                    ) : null}
                    <span className="situation__title">{situation.title}</span>
                    <span className="situation__tagline">{situation.tagline}</span>
                    <span className="situation__count">
                      {situation.products.length} מוצרים בערכה
                    </span>
                  </Link>
                </Reveal>
              );
            })}
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
                ruled
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
      <section className="section section--paper" id="why">
        <div className="container split">
          {/* No lead here on purpose. The one that was — "כל עבודה נבדקת לפני
              שהיא נכנסת למכונה, וכל לקוח מדבר עם מי שמטפל בה בפועל" — was the
              first and third benefit restated in advance, so a reader met the
              same two claims twice before reaching the list, and a scanner read
              a paragraph that said nothing the titles below did not. */}
          <Reveal>
            <SectionHead
              title="למה דפוס ראובן?"
              ruled
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
              src="/images/about-studio.webp"
              alt="מעצב עובד בסטודיו של דפוס ראובן לצד מכונת הדפוס"
              width={800}
              height={600}
            />
            <Image
              className="media-stack__sm"
              src="/images/finishes.webp"
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
                ruled
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
              <SectionHead title="לקוחות מספרים" ruled />
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

      {/* The "איך זה עובד" section stood here and is gone.
          Four steps — tell us what you need, get a quote, approve, we print —
          that are true of every print shop in the country, for 923px and 8% of
          the page. It differentiated nothing, and on a brand site every pixel
          has to earn its place. The reassurance it was really providing now
          sits as one line directly under the form, which is where the doubt
          actually is. processSteps still runs on /services and /quote, where a
          visitor has asked for the detail. */}

      {/* ---------------- 6 · Quote form ---------------- */}
      <section className="section" id="quote">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מה תרצו להדפיס?"
              lead="שם, טלפון, ומה אתם צריכים. נחזור אליכם עם המלצה והצעת מחיר."
              ruled
            />
          </Reveal>
          {/* No Reveal here. A form should never be waiting on a fade. */}
          <div className="form-wrap">
            <Suspense fallback={null}>
              <QuoteForm short />
            </Suspense>
          </div>
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
