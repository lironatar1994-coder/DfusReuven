"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { assetPath, navLinks, site, waLink } from "@/lib/site";
import { PressStrip, WhatsAppIcon } from "./icons";

/**
 * Mark as an image, wordmark as real text.
 *
 * The lockup used to be a single flat SVG with the name baked into it. Setting
 * the name as live text instead keeps it crisp at any size, lets it inherit
 * Miriam Libre (already loaded), and means the shop's name is selectable and
 * translatable rather than a picture of itself. The mark is the only part that
 * has to be an image, because it is a raster with a continuous gradient.
 */
function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <>
      <img
        className="brand-mark-img"
        src={assetPath(light ? "/images/logo-r-light.png" : "/images/logo-r.png")}
        alt=""
        aria-hidden="true"
        width={122}
        height={132}
      />
      <span className="brand-text">
        <span className="brand-name">{site.name}</span>
        <span className="brand-sub">{site.tagline}</span>
      </span>
    </>
  );
}

export { BrandLogo };

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <PressStrip />
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label={`${site.name} – לעמוד הבית`}>
            <BrandLogo />
          </Link>

          <nav className="nav" aria-label="ניווט ראשי">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <a
              className="icon-btn icon-btn--wa"
              href={waLink()}
              target="_blank"
              rel="noopener"
              aria-label={`שליחת הודעת וואטסאפ ל${site.name}`}
            >
              <WhatsAppIcon />
            </a>
            <Link className="btn btn--primary btn--sm header-cta" href="/contact">
              דברו איתנו
            </Link>
            <button
              ref={burgerRef}
              className="burger"
              type="button"
              aria-label={open ? "סגירת תפריט הניווט" : "פתיחת תפריט הניווט"}
              aria-expanded={open}
              aria-controls="drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer${open ? " is-open" : ""}`} id="drawer">
        <div className="drawer__backdrop" onClick={() => setOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-modal="true" aria-label="תפריט ניווט">
          <div className="drawer__head">
            <span className="brand-name">{site.name}</span>
            <button
              className="drawer__close"
              type="button"
              aria-label="סגירת התפריט"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav aria-label="ניווט במובייל">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quote" onClick={() => setOpen(false)}>
                  בקשת הצעת מחיר
                </Link>
              </li>
              <li>
                <Link href="/reorder" onClick={() => setOpen(false)}>
                  הזמנה חוזרת
                </Link>
              </li>
            </ul>
          </nav>
          <div className="drawer__cta">
            <Link className="btn btn--primary btn--block" href="/quote" onClick={() => setOpen(false)}>
              בקשת הצעת מחיר
            </Link>
            <a className="btn btn--wa btn--block" href={waLink()} target="_blank" rel="noopener">
              שיחה ב-WhatsApp
            </a>
          </div>
          <p className="drawer__meta">
            {site.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}
            <br />
            {site.address}
          </p>
        </div>
      </div>
    </>
  );
}
