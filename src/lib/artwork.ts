/**
 * Client-side artwork sanity check.
 *
 * The most expensive mistake in printing is discovering a bad file after the
 * job is on press. Customers on phones typically attach a photo from the camera
 * roll, which is exactly the file that fails. Reading pixel dimensions in the
 * browser lets us say something true and useful in about a second, before the
 * customer has waited a day for a human to look.
 *
 * We deliberately do NOT claim to inspect PDF/AI/PSD internals — colour space,
 * bleed and embedded image resolution need a real prepress check. For those we
 * say so plainly rather than implying a check we did not perform.
 */

export type ArtworkVerdict = {
  level: "ok" | "warn" | "info";
  headline: string;
  detail: string;
};

const PRINT_DPI = 300;
const ACCEPTABLE_DPI = 150;

const RASTER = /\.(jpe?g|png|tiff?|webp|gif|bmp)$/i;
const PREPRESS = /\.(pdf|ai|eps|psd|indd)$/i;

/** Longest edge in mm this pixel count can hold at a given dpi. */
function mmAt(px: number, dpi: number): number {
  return (px / dpi) * 25.4;
}

function formatSize(mm: number): string {
  return mm >= 100 ? `${(mm / 10).toFixed(0)} ס״מ` : `${mm.toFixed(0)} מ״מ`;
}

async function readImageSize(file: File): Promise<{ w: number; h: number } | null> {
  // createImageBitmap is the cheap path and avoids decoding into the DOM.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const size = { w: bitmap.width, h: bitmap.height };
      bitmap.close?.();
      return size;
    } catch {
      /* fall through to the <img> path */
    }
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export async function checkArtwork(file: File): Promise<ArtworkVerdict | null> {
  if (PREPRESS.test(file.name)) {
    return {
      level: "info",
      headline: "נבדוק את הקובץ ידנית",
      detail:
        "קובצי PDF, AI, EPS ו-PSD נבדקים אצלנו בפועל — בליד, צבעי CMYK, גופנים מוטבעים ורזולוציה. נעדכן אתכם אם צריך תיקון לפני ההדפסה.",
    };
  }

  if (!RASTER.test(file.name)) return null;

  const size = await readImageSize(file);
  if (!size) return null;

  const longEdge = Math.max(size.w, size.h);
  const shortEdge = Math.min(size.w, size.h);
  const maxPrintMm = mmAt(longEdge, PRINT_DPI);
  const usablePrintMm = mmAt(longEdge, ACCEPTABLE_DPI);
  const dims = `${size.w}×${size.h} פיקסלים`;

  // Too small for anything but a very small print.
  if (longEdge < 1000) {
    return {
      level: "warn",
      headline: "התמונה קטנה מדי לדפוס",
      detail: `הקובץ הוא ${dims}. באיכות דפוס מלאה הוא מתאים עד ${formatSize(
        maxPrintMm,
      )} בלבד. אם צריך גדול יותר — שלחו קובץ מקור גדול יותר, או שנתאים לכם עיצוב חדש.`,
    };
  }

  // Fine for small formats, risky for large ones.
  if (maxPrintMm < 210) {
    return {
      level: "info",
      headline: "מתאים לגדלים קטנים",
      detail: `הקובץ הוא ${dims} — מספיק לכרטיס ביקור או מדבקה (עד ${formatSize(
        maxPrintMm,
      )}), ובאיכות סבירה עד ${formatSize(
        usablePrintMm,
      )}. לפלייר A4 או לשילוט נצטרך קובץ גדול יותר.`,
    };
  }

  return {
    level: "ok",
    headline: "הקובץ נראה טוב",
    detail: `${dims} — מספיק לדפוס איכותי עד ${formatSize(maxPrintMm)}${
      shortEdge < 800 ? ". שימו לב שהצד הקצר יחסית — ודאו שהמידות תואמות למוצר." : "."
    }`,
  };
}
