import { site, waLink } from "@/lib/site";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";
import { Reveal } from "./ui";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
// Waze first: in Israel it is the default navigation app, not the alternative one.
const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(site.address)}&navigate=yes`;
/**
 * Keyless embed, geocoded from the address string rather than from hardcoded
 * coordinates — a pin dropped on the wrong side of ז'בוטינסקי is worse than no
 * pin, and the address is the one fact we hold. loading="lazy" keeps it off the
 * wire until the reader is nearly at the bottom of the page.
 */
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&hl=iw&z=16&output=embed`;

export default function ContactBlock() {
  return (
    <div className="contact-grid">
      <Reveal>
        <ul className="info-list">
          <li>
            <span className="ico" aria-hidden>
              <PhoneIcon />
            </span>
            <span>
              <strong>טלפון</strong>
              <a href={`tel:${site.phoneHref}`} dir="ltr">
                {site.phoneDisplay}
              </a>
            </span>
          </li>
          <li>
            <span className="ico" aria-hidden>
              <WhatsAppIcon />
            </span>
            <span>
              <strong>WhatsApp</strong>
              <a href={waLink()} target="_blank" rel="noopener" dir="ltr">
                {site.whatsappDisplay}
              </a>
            </span>
          </li>
          <li>
            <span className="ico" aria-hidden>
              <MailIcon />
            </span>
            <span>
              <strong>אימייל</strong>
              <a href={`mailto:${site.email}`} dir="ltr">
                {site.email}
              </a>
            </span>
          </li>
          {site.fax ? (
            <li>
              <span className="ico" aria-hidden>
                <MailIcon />
              </span>
              <span>
                <strong>פקס</strong>
                <p dir="ltr">{site.fax}</p>
              </span>
            </li>
          ) : null}
          <li>
            <span className="ico" aria-hidden>
              <PinIcon />
            </span>
            <span>
              <strong>כתובת</strong>
              <p>{site.address}</p>
            </span>
          </li>
          <li>
            <span className="ico" aria-hidden>
              <ClockIcon />
            </span>
            <span>
              <strong>שעות פעילות</strong>
              <p>{site.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}</p>
            </span>
          </li>
        </ul>

        {/* The four quick-action buttons that used to sit here repeated the four
            rows directly above them, and on a phone two of them are already in
            the fixed bottom bar. Eight ways to make contact in a screen and a
            half is not eight times the chance of contact. */}
      </Reveal>

      <Reveal delay={100}>
        {/* This block's whole argument is that the shop is a physical place you
            can walk into, and it was making it with a 42px pin icon and two
            buttons that navigate somewhere the reader cannot see. The buttons
            still do the work on a phone — they hand the address straight to
            Waze — but a map is what makes the claim before anyone taps. The
            pin disc is gone: it was standing in for exactly this. */}
        <div className="directions sheet">
          <div className="directions__map">
            <iframe
              src={mapEmbedUrl}
              title={`מפה: ${site.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="directions__body">
            <p className="directions__eyebrow">איפה אנחנו</p>
            <p className="directions__address">{site.addressShort}</p>
            <p className="directions__city">{site.city}</p>
            <div className="directions__actions">
              <a className="btn btn--ink btn--sm" href={wazeUrl} target="_blank" rel="noopener">
                פתחו בוויז
              </a>
              <a className="btn btn--secondary btn--sm" href={mapsUrl} target="_blank" rel="noopener">
                פתחו ב-Google Maps
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
