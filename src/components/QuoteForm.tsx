"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { products } from "@/data/catalog";
import { checkArtwork, type ArtworkVerdict } from "@/lib/artwork";
import { assetPath, waLink } from "@/lib/site";
import { UploadIcon, WhatsAppIcon } from "./icons";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 5;

const phoneRe = /^0(5\d|[2-4]|[8-9]|7\d)-?\d{3}-?\d{4}$/;
const mailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Record<string, string>;

function formatSize(bytes: number) {
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

export default function QuoteForm({
  presetProduct,
  compact = false,
  short = false,
  waMessage,
}: {
  presetProduct?: string;
  /** Drops the date and budget fields. Used on product detail pages. */
  compact?: boolean;
  /**
   * Three fields: name, phone, and what you need.
   *
   * The full form is thirteen inputs and 1,932px — 18% of the homepage and the
   * longest unbroken stretch on it. That is the wrong ask on a brand site whose
   * job is to look established enough to phone: anyone ready to act already has
   * חיוג and וואטסאפ pinned to the bottom of every screen. Someone who arrives
   * ready to spec a job goes to /quote, where the full form lives along with
   * the three reassurances the homepage version never had.
   */
  short?: boolean;
  waMessage?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // A link may carry a product, quantity or spec (e.g. from a campaign URL) so
  // the visitor doesn't retype what they already told us.
  const params = useSearchParams();
  const urlProduct = params.get("product") ?? "";
  const urlQty = params.get("qty") ?? "";
  const urlSpec = params.get("spec") ?? "";
  const carriedSpec = [
    urlSpec ? `מפרט: ${urlSpec}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [verdicts, setVerdicts] = useState<Record<string, ArtworkVerdict>>({});
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("fullname") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const product = String(data.get("product") || "").trim();

    if (!name) next.fullname = "שדה חובה — נא למלא שם מלא";
    else if (name.length < 2) next.fullname = "נא להזין שם מלא";

    if (!phone) next.phone = "שדה חובה — נא למלא מספר טלפון";
    else if (!phoneRe.test(phone.replace(/\s/g, ""))) next.phone = "נא להזין מספר טלפון תקין, לדוגמה 050-1234567";

    if (email && !mailRe.test(email)) next.email = "נא להזין כתובת אימייל תקינה, לדוגמה name@example.com";

    // The short form never renders the product select, so it cannot require it.
    if (!short && !product) next.product = "נא לבחור את סוג המוצר";

    return next;
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const accepted: File[] = [];
    let rejected = "";

    Array.from(incoming).forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        rejected = `הקובץ "${file.name}" גדול מ-25MB. שלחו אותו בוואטסאפ או בקישור להורדה.`;
        return;
      }
      accepted.push(file);
    });

    setFiles((prev) => {
      const merged = [...prev, ...accepted].slice(0, MAX_FILES);
      if (prev.length + accepted.length > MAX_FILES) {
        rejected = `אפשר לצרף עד ${MAX_FILES} קבצים בפנייה אחת.`;
      }
      return merged;
    });

    setErrors((prev) => {
      const next = { ...prev };
      if (rejected) next.file = rejected;
      else delete next.file;
      return next;
    });

    // Tell the customer now whether the artwork will actually print, instead of
    // a day later after a human opens it.
    accepted.forEach(async (file) => {
      const verdict = await checkArtwork(file);
      if (verdict) setVerdicts((prev) => ({ ...prev, [file.name]: verdict }));
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0];
      const el = form.elements.namedItem(firstKey) as HTMLElement | null;
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    data.delete("file");
    files.forEach((file) => data.append("files", file));

    setStatus("sending");
    try {
      // assetPath keeps this correct when the app is served under a basePath.
      const res = await fetch(assetPath("/api/quote"), { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        setStatus("error");
        setServerMessage(body.message || "לא הצלחנו לשלוח את הבקשה. נסו שוב או צרו קשר בוואטסאפ.");
      } else {
        setStatus("ok");
        setServerMessage(body.message || "");
        form.reset();
        setFiles([]);
      }
    } catch {
      setStatus("error");
      setServerMessage("אין חיבור לשרת כרגע. נסו שוב בעוד רגע או שלחו לנו הודעה בוואטסאפ.");
    }

    requestAnimationFrame(() => {
      alertRef.current?.focus();
      alertRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  };

  const fieldClass = (key: string) => `field${errors[key] ? " is-invalid" : ""}`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      {status === "ok" ? (
        <div className="form-alert form-alert--ok" role="status" tabIndex={-1} ref={alertRef}>
          {serverMessage || "תודה! הבקשה נשלחה. נחזור אליכם עם הצעת מחיר תוך יום עסקים אחד."}
        </div>
      ) : null}
      {status === "error" ? (
        <div className="form-alert form-alert--err" role="alert" tabIndex={-1} ref={alertRef}>
          {serverMessage}
        </div>
      ) : null}

      <div className="form-grid form-grid--2">
        <div className={fieldClass("fullname")}>
          <label htmlFor="fullname">
            שם מלא <span className="req" aria-hidden>*</span>
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            autoComplete="name"
            placeholder="ישראל ישראלי"
            aria-describedby="err-fullname"
            aria-invalid={errors.fullname ? true : undefined}
          />
          <span className="error" id="err-fullname" role="alert">
            {errors.fullname}
          </span>
        </div>

        <div className={fieldClass("phone")}>
          <label htmlFor="phone">
            טלפון <span className="req" aria-hidden>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="050-1234567"
            aria-describedby="err-phone"
            aria-invalid={errors.phone ? true : undefined}
          />
          <span className="error" id="err-phone" role="alert">
            {errors.phone}
          </span>
        </div>

        {short ? null : (
        <div className={fieldClass("email")}>
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            aria-describedby="err-email"
            aria-invalid={errors.email ? true : undefined}
          />
          <span className="error" id="err-email" role="alert">
            {errors.email}
          </span>
        </div>
        )}

        {short ? null : (
        <div className={fieldClass("product")}>
          <label htmlFor="product">
            סוג המוצר <span className="req" aria-hidden>*</span>
          </label>
          <select
            id="product"
            name="product"
            defaultValue={presetProduct || urlProduct || ""}
            aria-describedby="err-product"
            aria-invalid={errors.product ? true : undefined}
          >
            <option value="">בחרו מוצר…</option>
            {products.map((product) => (
              <option key={product.slug} value={product.name}>
                {product.name}
              </option>
            ))}
            <option value="עיצוב גרפי בלבד">עיצוב גרפי בלבד</option>
            <option value="אחר / לא בטוח">אחר / לא בטוח</option>
          </select>
          <span className="error" id="err-product" role="alert">
            {errors.product}
          </span>
        </div>
        )}

        {short ? null : (
        <div className="field">
          <label htmlFor="qty">כמות</label>
          <input type="text" id="qty" name="qty" inputMode="numeric" placeholder="לדוגמה: 500" defaultValue={urlQty} />
        </div>
        )}

        {short ? null : (
        <div className="field">
          <label htmlFor="size">גודל או מידות</label>
          <input type="text" id="size" name="size" placeholder="לדוגמה: A5 או 90×50 מ״מ" />
        </div>
        )}

        {short ? null : (
        <fieldset className="field field--full">
          <legend className="field__legend">האם נדרש עיצוב גרפי?</legend>
          <div className="chips-row" style={{ marginTop: 8 }}>
            {["כן, צריך עיצוב", "יש לי קובץ מוכן", "צריך התאמות לקובץ"].map((option) => (
              <label className="chip-radio" key={option}>
                <input type="radio" name="design" value={option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        )}

        {compact || short ? null : (
          <div className="field">
            <label htmlFor="date">תאריך רצוי</label>
            <input type="date" id="date" name="date" />
          </div>
        )}

        {compact || short ? null : (
          <div className="field">
            <label htmlFor="budget">תקציב משוער</label>
            <input type="text" id="budget" name="budget" placeholder="לא חובה — אם יש לכם תקציב בראש" />
          </div>
        )}

        <div className="field field--full">
          <label htmlFor="details">{short ? "מה אתם צריכים?" : "תיאור הבקשה"}</label>
          <textarea
            id="details"
            name="details"
            defaultValue={carriedSpec}
            placeholder={
              short
                ? "לדוגמה: 500 כרטיסי ביקור, או שלט לחזית החנות."
                : "ספרו לנו בקצרה מה אתם צריכים – סוג הנייר, גימור, צבעים, למה זה מיועד ומתי אתם צריכים את זה."
            }
          />
        </div>

        {short ? null : (
        <div className={`${fieldClass("file")} field--full`}>
          <label htmlFor="file">קבצים מצורפים</label>
          <label
            className={`dropzone${dragging ? " is-drag" : ""}`}
            onDragEnter={(e: DragEvent) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragOver={(e: DragEvent) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e: DragEvent) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer?.files ?? null);
            }}
          >
            <UploadIcon />
            <strong>העלאת קובץ, לוגו או דוגמה</strong>
            <small>גררו לכאן קובץ או לחצו לבחירה · PDF, AI, PSD, JPG, PNG · עד 25MB לקובץ</small>
            <input
              type="file"
              id="file"
              name="file"
              multiple
              accept=".pdf,.ai,.psd,.eps,.jpg,.jpeg,.png,.tif,.tiff,.zip"
              onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
            />
          </label>
          <span className="error" role="alert">
            {errors.file}
          </span>
          {files.length ? (
            <ul className="file-list">
              {files.map((file, i) => {
                const verdict = verdicts[file.name];
                return (
                  <li key={`${file.name}-${i}`}>
                    <div className="file-list__row">
                      <span>
                        {file.name} · {formatSize(file.size)}
                      </span>
                      <button
                        type="button"
                        aria-label={`הסרת הקובץ ${file.name}`}
                        onClick={() => {
                          setFiles((prev) => prev.filter((_, index) => index !== i));
                          setVerdicts((prev) => {
                            const next = { ...prev };
                            delete next[file.name];
                            return next;
                          });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    {verdict ? (
                      <p className={`artwork artwork--${verdict.level}`}>
                        <strong>{verdict.headline}</strong>
                        <span>{verdict.detail}</span>
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        )}
      </div>

      {/* The reassurance that used to live only on /quote — the page far fewer
          people reach. One line, next to the ask, where the doubt actually is. */}
      {short ? (
        <p className="form-assure">
          <span>מענה תוך יום עסקים</span>
          <span>בדיקת קובץ ללא עלות</span>
          <span>בלי התחייבות</span>
        </p>
      ) : null}

      <div className="btn-row" style={{ marginTop: 26 }}>
        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "שולח…" : "שלחו את הבקשה"}
        </button>
        <a className="btn btn--wa" href={waLink(waMessage)} target="_blank" rel="noopener">
          <WhatsAppIcon />
          שלחו לנו ישירות ב-WhatsApp
        </a>
      </div>
      <p className="form-note" style={{ marginTop: 14 }}>
        {short ? (
          <>
            צריכים לצרף קובץ או לפרט מידות וגימור?{" "}
            <Link href="/quote">לטופס המלא</Link>.
          </>
        ) : (
          <>
            הפרטים שלכם נשמרים אצלנו בלבד ומשמשים למענה על הפנייה. ראו{" "}
            <Link href="/privacy">מדיניות פרטיות</Link>.
          </>
        )}
      </p>
    </form>
  );
}
