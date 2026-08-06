import Link from "next/link";
import { services } from "@/data/catalog";
import { navLinks, site, waLink } from "@/lib/site";
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
              <span className="brand-mark" aria-hidden>
                ד
              </span>
              <span className="brand-text">
                <span className="brand-name">{site.name}</span>
                <span className="brand-sub">{site.tagline}</span>
              </span>
            </div>
            <p>{site.description}</p>
            <div className="socials">
              <a href={site.facebook} aria-label={`${site.name} בפייסבוק`}>
                <FacebookIcon />
              </a>
              <a href={site.instagram} aria-label={`${site.name} באינסטגרם`}>
                <InstagramIcon />
              </a>
              <a href={waLink()} target="_blank" rel="noopener" aria-label={`${site.name} בוואטסאפ`}>
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <nav aria-label="ניווט בתחתית האתר">
            <h3>ניווט מהיר</h3>
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

          <div>
            <h3>השירותים שלנו</h3>
            <ul>
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services#${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>יצירת קשר</h3>
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
