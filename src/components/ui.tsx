"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site, waLink } from "@/lib/site";
import { getOpenState, type OpenState } from "@/lib/hours";
import { PhoneIcon, PressStrip, WhatsAppIcon } from "./icons";

/* ---------- Reveal on scroll ---------- */
/**
 * Fades content in as it enters the viewport.
 *
 * Content is visible by default and only ever hidden once JS has confirmed it
 * can reveal it again — so a failed script, a bot, or a slow phone shows a
 * complete page rather than a blank one. Anything already on screen at mount
 * is never hidden at all, which also avoids a flash above the fold.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  // useEffect is enough: only off-screen elements are ever armed, so arming a
  // frame after paint is invisible — and it avoids a server/client hook split.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen: leave it visible.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // reveal-wrap is stable so grid layout never depends on the animation state.
  const classes = ["reveal-wrap", armed ? "reveal" : "", visible ? "is-visible" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} style={armed ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

/* ---------- Section marker ---------- */
export function Marker({ label, num }: { label: string; num?: string }) {
  return (
    <div className="marker">
      <span className="marker__label">{label}</span>
      {num ? <span className="marker__num">{num}</span> : null}
    </div>
  );
}

/**
 * Section heading. Deliberately has no eyebrow/kicker: a label that only
 * restates the heading below it is decoration. The hairline rule stays —
 * it does the structural work of dividing the sheet.
 */
export function SectionHead({
  title,
  lead,
  center = false,
  ruled = false,
}: {
  title: string;
  lead?: string;
  center?: boolean;
  /**
   * Runs a hairline the full width of the container with a short blue tick at
   * its start, like a rule across a press sheet. Used on some sections so the
   * page does not repeat one identical centred header eight times.
   */
  ruled?: boolean;
}) {
  const variant = center ? " section-head--center" : ruled ? " section-head--ruled" : "";
  return (
    <div className={`section-head${variant}`}>
      <span className="head-rule" aria-hidden />
      <h2>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}

/* ---------- Spec line (the job-ticket vernacular) ---------- */
export function SpecLine({ items }: { items: string[] }) {
  return (
    <p className="spec">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </p>
  );
}

/* ---------- Breadcrumbs ---------- */
export function Crumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="מיקום בעמוד">
      <ol>
        <li>
          <Link href="/">ראשי</Link>
        </li>
        {trail.map((item) => (
          <li key={item.label}>{item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- CTA band ---------- */
export function CtaBand({
  title,
  text,
  primaryLabel = "לקבלת הצעת מחיר",
  primaryHref = "/quote",
}: {
  title: string;
  text: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <section className="section section--tight">
      <div className="container">
        <Reveal className="cta-band">
          <PressStrip />
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="btn-row btn-row--center">
            <Link className="btn btn--primary" href={primaryHref}>
              {primaryLabel}
            </Link>
            <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener">
              <WhatsAppIcon />
              שיחה ב-WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- Fixed mobile action bar ----------
   Which action leads depends on whether anyone is there to answer. During
   opening hours a phone call is the fastest path; after hours it is a dead
   end, so WhatsApp leads and the bar says when a reply will actually come. */
export function MobileBar() {
  const [state, setState] = useState<OpenState | null>(null);

  // Opening state is computed on the client: a prerendered page would otherwise
  // serve a stale "open now" from whenever the build ran.
  useEffect(() => {
    const tick = () => setState(getOpenState());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const open = state?.open ?? false;

  return (
    <>
      <div className="mobile-bar">
        {state ? (
          <p className={`mobile-bar__status${open ? " is-open" : ""}`}>
            <span className="dot" aria-hidden />
            <strong>{state.badge}</strong>
            <span>· {state.short}</span>
          </p>
        ) : null}
        <div className="mobile-bar__actions">
          {open ? (
            <>
              <a className="btn btn--primary" href={`tel:${site.phoneHref}`}>
                <PhoneIcon />
                התקשרו עכשיו
              </a>
              <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener">
                <WhatsAppIcon />
                WhatsApp
              </a>
            </>
          ) : (
            <>
              <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener">
                <WhatsAppIcon />
                שלחו הודעה
              </a>
              <a className="btn btn--secondary" href={`tel:${site.phoneHref}`}>
                <PhoneIcon />
                חיוג
              </a>
            </>
          )}
        </div>
      </div>
      <a
        className="wa-float"
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="שליחת הודעה בוואטסאפ"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
