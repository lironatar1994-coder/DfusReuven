"use client";

import { useRef, useState, type FormEvent } from "react";
import { assetPath, site, waLink } from "@/lib/site";
import { PhoneIcon, WhatsAppIcon } from "./icons";

const phoneRe = /^0(5\d|[2-4]|[8-9]|7\d)-?\d{3}-?\d{4}$/;

/**
 * Reorders are the bulk of a print shop's revenue and the one flow the site
 * had no path for. Three fields, no account, no file: the shop already has
 * the artwork on record — the customer only has to identify themselves.
 */
export default function ReorderForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const phone = String(data.get("phone") || "").trim();
    const what = String(data.get("details") || "").trim();
    const next: Record<string, string> = {};

    if (!phone) next.phone = "שדה חובה — נא למלא מספר טלפון";
    else if (!phoneRe.test(phone.replace(/\s/g, "")))
      next.phone = "נא להזין מספר טלפון תקין, לדוגמה 050-1234567";
    if (!what) next.details = "נא לכתוב מה אתם צריכים שוב";

    setErrors(next);
    if (Object.keys(next).length) {
      (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null)?.focus();
      return;
    }

    // Reuse the quote endpoint; `source` tells the shop this is a reorder.
    data.set("source", "reorder");
    data.set("product", "הזמנה חוזרת");
    if (!data.get("fullname")) data.set("fullname", "לקוח חוזר");

    setStatus("sending");
    try {
      const res = await fetch(assetPath("/api/quote"), { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(body.message || "לא הצלחנו לשלוח. נסו שוב או שלחו הודעה בוואטסאפ.");
      } else {
        setStatus("ok");
        setMessage("קיבלנו. נאתר את העבודה הקודמת ונחזור אליכם לאישור כמות ומחיר.");
        form.reset();
      }
    } catch {
      setStatus("error");
      setMessage("אין חיבור לשרת כרגע. נסו שוב או שלחו הודעה בוואטסאפ.");
    }

    requestAnimationFrame(() => alertRef.current?.focus());
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      {status === "ok" ? (
        <div className="form-alert form-alert--ok" role="status" tabIndex={-1} ref={alertRef}>
          {message}
        </div>
      ) : null}
      {status === "error" ? (
        <div className="form-alert form-alert--err" role="alert" tabIndex={-1} ref={alertRef}>
          {message}
        </div>
      ) : null}

      <div className="form-grid">
        <div className={`field${errors.phone ? " is-invalid" : ""}`}>
          <label htmlFor="phone">
            הטלפון שאיתו הזמנתם <span className="req" aria-hidden>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="050-1234567"
            aria-invalid={errors.phone ? true : undefined}
          />
          <span className="error" role="alert">
            {errors.phone}
          </span>
        </div>

        <div className={`field${errors.details ? " is-invalid" : ""}`}>
          <label htmlFor="details">
            מה אתם צריכים שוב? <span className="req" aria-hidden>*</span>
          </label>
          <textarea
            id="details"
            name="details"
            placeholder="לדוגמה: אותם כרטיסי ביקור כמו בפעם שעברה, 500 יחידות. או: פנקסי קבלות, אבל עם הכתובת החדשה."
            aria-invalid={errors.details ? true : undefined}
          />
          <span className="error" role="alert">
            {errors.details}
          </span>
        </div>

        <div className="field">
          <label htmlFor="fullname">שם או שם העסק</label>
          <input type="text" id="fullname" name="fullname" autoComplete="name" placeholder="לא חובה — יעזור לנו לאתר מהר יותר" />
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 24 }}>
        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "שולח…" : "שלחו בקשה להזמנה חוזרת"}
        </button>
        <a
          className="btn btn--wa"
          href={waLink("היי, אני לקוח חוזר ורוצה להזמין שוב")}
          target="_blank"
          rel="noopener"
        >
          <WhatsAppIcon />
          בוואטסאפ
        </a>
        <a className="btn btn--secondary" href={`tel:${site.phoneHref}`}>
          <PhoneIcon />
          חיוג
        </a>
      </div>
      <p className="form-note" style={{ marginTop: 14 }}>
        לא זוכרים בדיוק מה הזמנתם? זה בסדר — נאתר לפי הטלפון ונשלח לכם את מה שמצאנו.
      </p>
    </form>
  );
}
