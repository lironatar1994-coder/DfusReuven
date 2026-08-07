import Link from "next/link";
import { services } from "@/data/catalog";
import { navLinks, site, waLink } from "@/lib/site";
import { BrandLogo } from "./Header";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  PressStrip,
  WhatsAppIcon,
} from "./icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <PressStrip />
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-brand">
              <BrandLogo light />
            </div>
            <p>{site.description}</p>
            {/* Each icon renders only if there is somewhere for it to go. */}
            <div className="socials">
              {site.facebook ? (
                <a href={site.facebook} target="_blank" rel="noopener" aria-label={`${site.name} בפייסבוק`}>
                  <FacebookIcon />
                </a>
              ) : null}
              {site.instagram ? (
                <a href={site.instagram} target="_blank" rel="noopener" aria-label={`${site.name} באינסטגרם`}>
                  <InstagramIcon />
                </a>
              ) : null}
              <a href={waLink()} target="_blank" rel="noopener" aria-label={`${site.name} בוואטסאפ`}>
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* h2, not h3. These are the top-level headings inside the footer
              landmark, and on pages with no h2 of their own — the 404 — an h3
              here produced an h1→h3 skip on every render. */}
          {/* footer-col--* exists so the phone layout can pair the two link
              lists side by side and keep contact full width, without the
              stylesheet counting children. */}
          <nav className="footer-col footer-col--nav" aria-label="ניווט בתחתית האתר">
            <h2>ניווט מהיר</h2>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/quote">בקשת הצעת מחיר</Link>
              </li>
              <li>
                <Link href="/reorder">הזמנה חוזרת</Link>
              </li>
            </ul>
          </nav>

          <div className="footer-col footer-col--services">
            <h2>השירותים שלנו</h2>
            <ul>
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services#${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-col--contact">
            <h2>יצירת קשר</h2>
            <ul className="footer-contact">
              <li>
                <PhoneIcon />
                <a href={`tel:${site.phoneHref}`} dir="ltr">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <MailIcon />
                <a href={`mailto:${site.email}`} dir="ltr">
                  {site.email}
                </a>
              </li>
              <li>
                <PinIcon />
                <span>{site.address}</span>
              </li>
              <li>
                <ClockIcon />
                <span>
                  {site.hours.map((h) => (
                    <span key={h.days} style={{ display: "block" }}>
                      {h.days} {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="legal">
            © {new Date().getFullYear()} כל הזכויות שמורות ל{site.name}
          </span>
          <ul>
            <li>
              <Link href="/privacy">מדיניות פרטיות</Link>
            </li>
            <li>
              <Link href="/accessibility">הצהרת נגישות</Link>
            </li>
            <li>
              <Link href="/terms">תנאי שימוש</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
