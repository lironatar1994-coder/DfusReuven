import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PortfolioGallery from "@/components/PortfolioGallery";
import QuoteForm from "@/components/QuoteForm";
import ContactBlock from "@/components/ContactBlock";
import Estimator from "@/components/Estimator";
import { CtaBand, Reveal, SectionHead, SpecLine } from "@/components/ui";
import { benefitIcons, CheckIcon, PressStrip, ShieldIcon, Stars } from "@/components/icons";
import { featuredProducts, services } from "@/data/catalog";
import { benefits, portfolio, processSteps, stats, testimonials } from "@/data/content";
import { situations } from "@/data/situations";

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <h1>
              הופכים כל רעיון <em>למוצר מודפס</em>
            </h1>
            <p className="hero__lead">
              עיצוב גרפי, דפוס אופסט ודיגיטלי, שילוט, הזמנות ומוצרי פרסום – משלב הרעיון ועד למוצר
              המוגמר.
            </p>
            <div className="btn-row">
              <Link className="btn btn--primary" href="/quote">
                לקבלת הצעת מחיר
              </Link>
              <Link className="btn btn--secondary" href="/portfolio">
                צפו בעבודות שלנו
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
                בני ברק · א׳–ה׳ עד 19:30
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
              <span>ז׳בוטינסקי 84 · א׳–ה׳ 07:30–19:30</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Estimator ----------------
          Price is the first question a print customer asks. Answering it before
          asking for anything is the single biggest conversion lever on mobile. */}
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

      {/* ---------------- Situations ---------------- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              title="מה מביא אתכם אלינו?"
              lead="רוב הלקוחות שלנו לא מחפשים מוצר בודד אלא ערכה שלמה. אלה הצירופים הנפוצים."
              center
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

      {/* ---------------- Services ---------------- */}
      <section className="section section--paper" id="services">
        <div className="container">
          <Reveal>
            <SectionHead
              title="כל מה שהעסק שלכם צריך להדפיס"
              lead="מכרטיס ביקור בודד ועד פרויקט מיתוג שלם – אצלנו הכול נעשה תחת קורת גג אחת, מהעיצוב הראשוני ועד למוצר המוגמר."
              center
            />
          </Reveal>

          <div className="grid grid--3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 80}>
                <article className="card" style={{ height: "100%" }}>
                  <div className="card__media">
                    <Image src={service.image} alt={service.alt} width={800} height={500} />
                  </div>
                  <div className="card__body">
                    <h3>{service.title}</h3>
                    <p>{service.short}</p>
                    <div className="card__foot">
                      <Link className="link-arrow" href={`/services#${service.slug}`}>
                        לפרטים נוספים
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Products ---------------- */}
      <section className="section" id="products">
        <div className="container">
          <Reveal>
            <SectionHead
              title="המוצרים המבוקשים ביותר"
              lead="המחירים המוצגים הם מחירי פתיחה להמחשה. המחיר הסופי נקבע לפי כמות, סוג הנייר והגימור."
              center
            />
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

      {/* ---------------- Portfolio ---------------- */}
      {portfolio.length > 0 ? (
        <section className="section section--paper" id="portfolio">
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

      {/* ---------------- Process ---------------- */}
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

      {/* ---------------- Why us ---------------- */}
      <section className="section" id="why">
        <div className="container split">
          <Reveal>
            <SectionHead
              title="למה דפוס ראובן?"
              lead="אנחנו לא מוכרים הדפסות – אנחנו אחראים על התוצאה. מבחירת הנייר ועד הגימור האחרון, כל פרט נבדק לפני שהעבודה יוצאת מהדלת."
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
          </Reveal>

          <Reveal delay={100} className="media-stack">
            <Image
              src="/images/finishes.svg"
              alt="דוגמאות נייר וגימורים: פויל, הבלטה, למינציה וצבעים"
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
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section className="section section--paper" id="about">
        <div className="container split split--wide-media">
          <Reveal className="media-stack">
            <Image
              src="/images/about-studio.svg"
              alt="מעצב עובד בסטודיו של דפוס ראובן לצד מכונת הדפוס"
              width={800}
              height={600}
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHead title="יותר מבית דפוס" />
            <p style={{ color: "var(--ink-soft)", fontSize: "1.06rem" }}>
              בדפוס ראובן אנחנו מלווים עסקים ולקוחות פרטיים משלב הרעיון הראשוני ועד למוצר המודפס. אנו
              משלבים יצירתיות, ניסיון, חומרי גלם איכותיים וטכנולוגיות דפוס מתקדמות, כדי שכל עבודה
              תיראה מקצועית, מדויקת ומרשימה.
            </p>
            <SpecLine items={["דפוס אופסט", "דפוס דיגיטלי", "הדפסה רחבה", "מחלקת גימור"]} />
            <div className="btn-row" style={{ marginTop: 26 }}>
              <Link className="btn btn--secondary" href="/about">
                קראו עוד עלינו
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      {testimonials.length > 0 ? (
        <section className="section" id="testimonials">
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

      {/* ---------------- Quote form ---------------- */}
      <section className="section section--tint" id="quote">
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

      {/* ---------------- Contact ---------------- */}
      <section className="section" id="contact">
        <div className="container">
          <Reveal>
            <SectionHead
              title="נשמח לשמוע מכם"
              lead="אפשר להתקשר, לשלוח וואטסאפ או פשוט לקפוץ אלינו לבית הדפוס."
            />
          </Reveal>
          <ContactBlock />
        </div>
      </section>

      <CtaBand
        title="יש לכם פרויקט באוויר?"
        text="ספרו לנו מה אתם צריכים ונחזור אליכם עם הצעה, המלצה על חומרים ולוח זמנים מדויק."
      />
    </>
  );
}
