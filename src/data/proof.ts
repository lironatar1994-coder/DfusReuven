/**
 * WhatsApp message screenshots used as social proof.
 *
 * In Israel this is the most credible form of testimonial a local business has:
 * everyone recognises the interface, and an unedited screenshot is visibly
 * harder to fake than a styled quote card.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEFORE ADDING ANY ENTRY
 *
 * 1. ASK THE CUSTOMER. Publishing someone's message — and their name, photo or
 *    number — without permission is a privacy problem, not a grey area. A short
 *    WhatsApp asking "אפשר לפרסם את ההודעה באתר?" and a "כן" is enough.
 *
 * 2. REDACT BEFORE UPLOADING. Crop or blur, in the image itself:
 *      • the phone number in the header
 *      • the profile photo
 *      • the surname (a first name or "לקוח מבני ברק" is plenty)
 *      • anything in the thread that isn't the quote
 *    The site cannot redact for you — whatever is in the file is published.
 *
 * 3. `quote` must be the real text of the message, transcribed. It is the
 *    accessible alternative for anyone using a screen reader, and it is what
 *    search engines read. Do not paraphrase or improve it.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Leave this array empty until real, permitted screenshots exist. The homepage
 * section renders only when it is non-empty.
 */

export type WhatsAppProof = {
  id: string;
  /** Redacted screenshot in public/images/proof/ — portrait, ~3:4 or taller */
  image: string;
  /** Real transcribed text of the message. Serves as the alt text. */
  quote: string;
  /** First name, or a description like "לקוח מבני ברק". Never a full name. */
  name: string;
  /** Optional context: "הזמנות לחתונה", "כרטיסי ביקור" */
  context?: string;
};

export const whatsappProof: WhatsAppProof[] = [];
