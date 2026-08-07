import { readFile } from "node:fs/promises";
import path from "node:path";
import { filesDirFor, getLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve one attachment from a quote request.
 *
 * Customer artwork lives at `<QUOTE_STORAGE_DIR>/files/<id>/<name>`, outside
 * the release directory and outside `public/`. That is deliberate — the staged
 * deploy swap would otherwise delete it, and nothing here should ever be
 * reachable without going past the middleware. So it has to be streamed by a
 * handler, and this handler is the only thing standing between a path and the
 * filesystem.
 *
 * Two independent defences, because one is never enough for this:
 *
 *   1. The requested name must appear in that lead's recorded `files` list.
 *      This is the strong check — an allowlist of known-good names beats any
 *      amount of cleverness about what characters are dangerous.
 *   2. The resolved absolute path must still sit inside the lead's own
 *      directory. This catches anything the first check somehow lets through,
 *      including whatever the runtime does with encoded separators.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; name: string }> },
) {
  const { id, name } = await params;

  const lead = await getLead(id);
  if (!lead) return new Response("Not found", { status: 404 });

  const decoded = decodeURIComponent(name);

  // Defence 1: allowlist from the record itself.
  const file = lead.files.find((f) => f.stored === decoded);
  if (!file) return new Response("Not found", { status: 404 });

  // Defence 2: confinement, verified after resolution rather than assumed.
  const dir = path.resolve(filesDirFor(id));
  const resolved = path.resolve(dir, file.stored);
  if (resolved !== path.join(dir, file.stored) || !resolved.startsWith(dir + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(resolved);
  } catch {
    // On disk and in the record can disagree — someone may have pruned files.
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(bytes), {
    headers: {
      /* Always a download, never a render. These are files uploaded by
         anonymous strangers; letting one render inline would run it in the
         admin's session, on the same origin as this inbox. The generic
         content-type is part of that, not laziness — an honest image/svg+xml
         here would be an XSS vector. */
      "content-type": "application/octet-stream",
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.original)}`,
      "content-length": String(bytes.byteLength),
      "x-content-type-options": "nosniff",
      "cache-control": "private, no-store",
    },
  });
}
