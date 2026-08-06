import { site, waLink } from "@/lib/site";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";
import { Reveal } from "./ui";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;

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
                {site.phoneDisplay}
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

        <div className="quick-actions">
          <a className="btn btn--primary btn--sm" href={`tel:${site.phoneHref}`}>
            התקשרו
          </a>
          <a className="btn btn--wa btn--sm" href={waLink()} target="_blank" rel="noopener">
            WhatsApp
          </a>
          <a className="btn btn--secondary btn--sm" href={`mailto:${site.email}`}>
            אימייל
          </a>
          <a className="btn btn--secondary btn--sm" href={mapsUrl} target="_blank" rel="noopener">
            ניווט
          </a>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="map">
          <div>
            <span className="pin" aria-hidden>
              <PinIcon />
            </span>
            <strong>מפת Google תוטמע כאן</strong>
            <span>
              {site.address} · חניה חופשית במקום
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
