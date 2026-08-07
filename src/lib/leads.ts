import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Read side of the quote inbox.
 *
 * `/api/quote` has always been able to write and never able to read: the
 * documented way to see enquiries was `tail -f` on the server over SSH. That
 * is fine for a developer and useless for the shop, which is the actual
 * audience for its own leads.
 *
 * Deliberately still a flat file. A few hundred JSON lines parse in
 * single-digit milliseconds, and keeping this dependency-free is what lets the
 * inbox ship today rather than behind a database migration. When there are
 * orders and money this moves to Postgres — reading is not the reason to go
 * there, durability and backups are.
 */

const STORAGE_DIR = process.env.QUOTE_STORAGE_DIR || path.join(process.cwd(), "storage", "quotes");

export type LeadFile = { original: string; stored: string; size: number };

export type Lead = {
  id: string;
  receivedAt: string;
  fullname: string;
  phone: string;
  email: string;
  product: string;
  qty: string;
  size: string;
  design: string;
  date: string;
  budget: string;
  details: string;
  source: string;
  ip: string;
  files: LeadFile[];
  artworkHints?: { file: string; level: string; headline: string }[];
};

export const filesDirFor = (id: string) => path.join(STORAGE_DIR, "files", id);

/**
 * Both deploy scripts POST a real submission to the live endpoint as a health
 * check, on every deploy. Those rows are indistinguishable from customers in
 * the raw file, and after a few months of deploys they are most of it.
 */
export function isSmokeTest(lead: Lead): boolean {
  return lead.phone.replace(/\D/g, "") === "0500000000" || lead.fullname === "בדיקת דיפלוי";
}

/**
 * Newest first. A truncated or malformed line is skipped rather than thrown
 * on: a half-written record at the tail must never take out the whole inbox.
 */
export async function readLeads(): Promise<Lead[]> {
  let raw: string;
  try {
    raw = await readFile(path.join(STORAGE_DIR, "quotes.jsonl"), "utf8");
  } catch (error) {
    // No file yet is the normal state of a fresh install, not a failure.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const leads: Lead[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line) as Lead;
      if (parsed && typeof parsed.id === "string") {
        leads.push({ ...parsed, files: Array.isArray(parsed.files) ? parsed.files : [] });
      }
    } catch {
      // Skip and keep going.
    }
  }
  return leads.reverse();
}

export async function getLead(id: string): Promise<Lead | undefined> {
  return (await readLeads()).find((lead) => lead.id === id);
}
