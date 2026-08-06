import { NextResponse } from "next/server";
import { mkdir, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Quote requests land here.
 *
 * Storage is always local and always first: submissions append to
 * `<QUOTE_STORAGE_DIR>/quotes.jsonl` and attachments go to `<QUOTE_STORAGE_DIR>/files/`.
 * Set QUOTE_WEBHOOK_URL to also forward each submission (e.g. to email, CRM or Slack) —
 * a webhook failure never loses the submission, it is only logged.
 */

const STORAGE_DIR = process.env.QUOTE_STORAGE_DIR || path.join(process.cwd(), "storage", "quotes");
const WEBHOOK_URL = process.env.QUOTE_WEBHOOK_URL;

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 5;
const MAX_TEXT = 4000;

const ALLOWED_EXT = new Set([
  ".pdf", ".ai", ".psd", ".eps", ".jpg", ".jpeg", ".png", ".tif", ".tiff", ".zip",
]);

const phoneRe = /^0(5\d|[2-4]|[8-9]|7\d)-?\d{3}-?\d{4}$/;
const mailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Simple in-memory throttle. Resets on restart; enough to stop casual abuse.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: FormDataEntryValue | null, limit = 200): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function safeName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const stem = path
    .basename(name, path.extname(name))
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || "file";
  return `${stem}${ext}`;
}

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return fail("נשלחו יותר מדי בקשות מהכתובת הזו. נסו שוב בעוד מספר דקות או התקשרו אלינו.", 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("לא הצלחנו לקרוא את הטופס. ייתכן שהקבצים גדולים מדי — נסו לשלוח עד 25MB לקובץ.", 413);
  }

  // Honeypot: real users never fill this.
  if (clean(form.get("company"))) {
    return NextResponse.json({ ok: true, message: "תודה! הבקשה נשלחה." });
  }

  const submission = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    fullname: clean(form.get("fullname"), 120),
    phone: clean(form.get("phone"), 40),
    email: clean(form.get("email"), 160),
    product: clean(form.get("product"), 120),
    qty: clean(form.get("qty"), 60),
    size: clean(form.get("size"), 120),
    design: clean(form.get("design"), 60),
    date: clean(form.get("date"), 40),
    budget: clean(form.get("budget"), 60),
    details: clean(form.get("details"), MAX_TEXT),
    source: clean(form.get("source"), 80) || "website",
    ip,
    files: [] as { original: string; stored: string; size: number }[],
  };

  if (!submission.fullname || submission.fullname.length < 2) {
    return fail("נא להזין שם מלא.");
  }
  if (!phoneRe.test(submission.phone.replace(/\s/g, ""))) {
    return fail("נא להזין מספר טלפון תקין, לדוגמה 050-1234567.");
  }
  if (submission.email && !mailRe.test(submission.email)) {
    return fail("נא להזין כתובת אימייל תקינה.");
  }
  if (!submission.product) {
    return fail("נא לבחור את סוג המוצר.");
  }

  const uploads = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (uploads.length > MAX_FILES) {
    return fail(`אפשר לצרף עד ${MAX_FILES} קבצים בפנייה אחת.`);
  }

  for (const file of uploads) {
    if (file.size > MAX_FILE_BYTES) {
      return fail(`הקובץ "${file.name}" גדול מ-25MB. שלחו אותו בוואטסאפ או בקישור להורדה.`, 413);
    }
    if (!ALLOWED_EXT.has(path.extname(file.name).toLowerCase())) {
      return fail(`סוג הקובץ "${file.name}" אינו נתמך. אפשר לשלוח PDF, AI, PSD, EPS, JPG, PNG, TIFF או ZIP.`);
    }
  }

  try {
    const filesDir = path.join(STORAGE_DIR, "files", submission.id);
    if (uploads.length) await mkdir(filesDir, { recursive: true });
    else await mkdir(STORAGE_DIR, { recursive: true });

    for (const file of uploads) {
      const stored = safeName(file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(filesDir, stored), buffer);
      submission.files.push({ original: file.name, stored, size: file.size });
    }

    await appendFile(
      path.join(STORAGE_DIR, "quotes.jsonl"),
      `${JSON.stringify(submission)}\n`,
      "utf8",
    );
  } catch (error) {
    console.error("[quote] failed to persist submission", error);
    return fail("לא הצלחנו לשמור את הבקשה. נסו שוב או שלחו לנו הודעה בוואטסאפ.", 500);
  }

  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...submission, ip: undefined }),
      });
    } catch (error) {
      // The submission is already safely on disk; a webhook outage must not fail the request.
      console.error("[quote] webhook delivery failed", error);
    }
  }

  return NextResponse.json({
    ok: true,
    id: submission.id,
    message: "תודה! הבקשה נשלחה. נחזור אליכם עם הצעת מחיר בהקדם, בדרך כלל תוך יום עסקים אחד.",
  });
}
