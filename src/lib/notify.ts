/**
 * Tell the shop a lead arrived.
 *
 * Until now nothing did. A quote request appended a line to a JSONL file and
 * that was the end of it — the README's own answer to "how do I see new
 * enquiries?" was `tail -f` over SSH. The success message promises a reply
 * "תוך יום עסקים אחד" and there was no mechanism behind it. Every lead that
 * arrived while nobody happened to be watching a terminal was lost.
 *
 * Deliberately not nodemailer: it brings ~15 transitive packages and an SMTP
 * connection lifecycle to own, for a job that is one HTTP POST. This project's
 * three runtime dependencies are an asset worth defending — see README.
 *
 * Everything here is best-effort. The submission is already durable on disk
 * before this is called, so a mail outage must never turn into a 500 for a
 * customer whose request was in fact received. Nothing in this file throws.
 */

const API_KEY = process.env.RESEND_API_KEY;
const TO = process.env.LEAD_NOTIFY_TO;
const FROM = process.env.LEAD_NOTIFY_FROM || "leads@dfusreuven.co.il";

/** Only the fields worth putting in an email. Anything else is in the inbox. */
type Submission = {
  id: string;
  receivedAt: string;
  fullname: string;
  phone: string;
  email: string;
  product: string;
  qty: string;
  size: string;
  details: string;
  source: string;
  files: { original: string; size: number }[];
};

const line = (label: string, value: string) => (value ? `${label}: ${value}\n` : "");

function body(s: Submission): string {
  return (
    line("שם", s.fullname) +
    line("טלפון", s.phone) +
    line("אימייל", s.email) +
    line("מוצר", s.product) +
    line("כמות", s.qty) +
    line("מידה", s.size) +
    line("מקור", s.source) +
    (s.files.length ? `קבצים: ${s.files.map((f) => f.original).join(", ")}\n` : "") +
    (s.details ? `\n${s.details}\n` : "") +
    `\n--\nמזהה פנייה: ${s.id}\nהתקבל: ${s.receivedAt}\n`
  );
}

export async function notifyShop(submission: Submission): Promise<void> {
  // Unconfigured is a normal state, not an error: staging runs without a key,
  // and the site must work identically with or without one.
  if (!API_KEY || !TO) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // The phone number belongs in the subject: it is the only thing the
        // shop needs in order to act, and it is visible from a phone's lock
        // screen without opening anything.
        subject: `פנייה חדשה — ${submission.fullname} ${submission.phone}`,
        text: body(submission),
        // So hitting reply in the mail client reaches the customer, when they
        // left an address. Falls through to the shop's own address otherwise.
        ...(submission.email ? { reply_to: submission.email } : {}),
      }),
      // A hung mail API must not hold the customer's request open.
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error("[notify] provider rejected", res.status, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("[notify] delivery failed", error);
  }
}
