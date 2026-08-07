/**
 * De-vignette the generated image set.
 *
 * Every file carries a soft feathered border in a flat colour that is not part
 * of the scene — a generation artifact. This finds where the real content
 * starts on each edge and crops past it.
 *
 * Two rules keep this safe:
 *   1. The output keeps the input's exact pixel dimensions and aspect ratio, so
 *      no width/height prop anywhere in the JSX has to change.
 *   2. Per-edge inset is capped. Anything that hits the cap is reported rather
 *      than silently mangled.
 *
 * Run with --apply to write. Without it, it only reports.
 */
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = process.argv[2];
const APPLY = process.argv.includes("--apply");
const MAX_INSET = 0.14;   // never eat more than 14% of an edge
const SAFETY = 0.012;     // crop a little past the detected edge; the fade is soft

/** Column/row is "content" once its spread exceeds this share of the image's own spread. */
const REL_THRESHOLD = 0.18;
const ABS_FLOOR = 6;

/**
 * Takes the file's bytes, never its path. sharp keeps a path-backed input open
 * for the lifetime of the pipeline, and on Windows that makes writing the same
 * path back an unrecoverable open error rather than a warning.
 */
async function analyse(input) {
  const img = sharp(input);
  const meta = await img.metadata();
  // Work on a small greyscale copy: we want structure, not detail.
  const W = 240;
  const H = Math.max(1, Math.round((meta.height / meta.width) * W));
  const { data } = await img
    .clone()
    .resize(W, H, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const at = (x, y) => data[y * W + x];

  const spread = (vals) => {
    const n = vals.length;
    const mean = vals.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  };

  // Global spread over the middle half — the content region, roughly.
  const mid = [];
  for (let y = Math.floor(H * 0.25); y < Math.floor(H * 0.75); y++)
    for (let x = Math.floor(W * 0.25); x < Math.floor(W * 0.75); x++) mid.push(at(x, y));
  const globalSpread = spread(mid);
  const threshold = Math.max(ABS_FLOOR, globalSpread * REL_THRESHOLD);

  // Sample each row/column over its central 60% so the perpendicular vignette
  // does not mask the moment content appears.
  const rowSpread = (y) => {
    const v = [];
    for (let x = Math.floor(W * 0.2); x < Math.floor(W * 0.8); x++) v.push(at(x, y));
    return spread(v);
  };
  const colSpread = (x) => {
    const v = [];
    for (let y = Math.floor(H * 0.2); y < Math.floor(H * 0.8); y++) v.push(at(x, y));
    return spread(v);
  };

  const scan = (n, fn) => {
    for (let i = 0; i < Math.floor(n * MAX_INSET); i++) if (fn(i) > threshold) return i / n;
    return MAX_INSET;
  };
  const scanRev = (n, fn) => {
    for (let i = 0; i < Math.floor(n * MAX_INSET); i++) if (fn(n - 1 - i) > threshold) return i / n;
    return MAX_INSET;
  };

  const top = scan(H, rowSpread);
  const bottom = scanRev(H, rowSpread);
  const left = scan(W, colSpread);
  const right = scanRev(W, colSpread);

  return { meta, top, bottom, left, right, cappedEdges:
    [["top", top], ["bottom", bottom], ["left", left], ["right", right]]
      .filter(([, v]) => v >= MAX_INSET - 1e-9).map(([k]) => k) };
}

/** Largest centred rect with the original aspect ratio that clears every edge. */
function cropBox(meta, a) {
  const pad = SAFETY;
  const x0 = Math.round((a.left + pad) * meta.width);
  const x1 = Math.round(meta.width - (a.right + pad) * meta.width);
  const y0 = Math.round((a.top + pad) * meta.height);
  const y1 = Math.round(meta.height - (a.bottom + pad) * meta.height);

  const availW = x1 - x0;
  const availH = y1 - y0;
  const ar = meta.width / meta.height;

  let w = availW;
  let h = Math.round(w / ar);
  if (h > availH) { h = availH; w = Math.round(h * ar); }

  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  let left = Math.round(cx - w / 2);
  let top = Math.round(cy - h / 2);
  left = Math.max(0, Math.min(left, meta.width - w));
  top = Math.max(0, Math.min(top, meta.height - h));
  return { left, top, width: w, height: h };
}

const files = (await readdir(DIR)).filter((f) => f.endsWith(".webp")).sort();
let changed = 0;
const warnings = [];

for (const f of files) {
  const full = path.join(DIR, f);
  const input = await readFile(full);
  const a = await analyse(input);
  const box = cropBox(a.meta, a);
  const keptPct = Math.round((box.width / a.meta.width) * 100);

  if (a.cappedEdges.length) warnings.push(`${f} — hit the cap on: ${a.cappedEdges.join(", ")}`);

  const pct = (v) => (v * 100).toFixed(1).padStart(5);
  console.log(
    `${f.padEnd(42)} ${a.meta.width}x${a.meta.height}  ` +
    `T${pct(a.top)} B${pct(a.bottom)} L${pct(a.left)} R${pct(a.right)}  → keep ${keptPct}%`
  );

  if (APPLY && keptPct < 100) {
    // Encode to a buffer, then write with fs. sharp cannot write back to a file
    // it still has open for reading — on Windows that is an EINVAL, not a warning.
    const buf = await sharp(input)
      .extract(box)
      .resize(a.meta.width, a.meta.height, { fit: "fill", kernel: "lanczos3" })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    await writeFile(full, buf);
    changed++;
  }
}

console.log(`\n${files.length} files analysed${APPLY ? `, ${changed} rewritten` : " (dry run)"}`);
if (warnings.length) {
  console.log("\nEdges that hit the cap — check these by eye:");
  warnings.forEach((w) => console.log("  " + w));
}
