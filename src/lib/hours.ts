/**
 * Opening-hours state, evaluated in Israel time regardless of the visitor's
 * device timezone. Used to decide whether "call now" is a live action or a
 * dead end, and to tell the visitor when they'll actually get an answer.
 */

export type OpenState = {
  open: boolean;
  /** e.g. "סוגרים ב-17:30" or "נחזור אליכם מחר ב-8:30" */
  message: string;
  /** Short badge label */
  badge: string;
};

/**
 * Opening hours — the single source of truth.
 *
 * Both the footer/contact display and the open-closed logic on the mobile bar
 * read from here, so the badge can never say "open now" while the footer shows
 * different hours.
 *
 * Source: supplied directly by the business owner. This supersedes the Dapey
 * Zahav listing, which was last updated in 2014 and showed Friday as open.
 * Sunday = 0 … Saturday = 6. null means closed.
 */
const SCHEDULE: Record<number, { from: string; to: string } | null> = {
  0: { from: "09:30", to: "18:30" },
  1: { from: "09:30", to: "18:30" },
  2: { from: "09:30", to: "18:30" },
  3: { from: "09:30", to: "18:30" },
  4: { from: "09:30", to: "18:30" },
  5: null,
  6: null,
};

/** Human-readable hours for the footer and contact block. */
export const businessHours: { days: string; time: string }[] = [
  { days: "ראשון–חמישי", time: `${SCHEDULE[0]!.from}–${SCHEDULE[0]!.to}` },
  { days: "שישי–שבת", time: "סגור" },
];

/** Opening hours in schema.org form for the JSON-LD block. */
export const openingHoursSchema = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: SCHEDULE[0]!.from,
    closes: SCHEDULE[0]!.to,
  },
];

const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Current weekday + minutes-since-midnight in Asia/Jerusalem. */
function israelNow(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jerusalem",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const day = weekdayMap[get("weekday")] ?? 0;
  // Intl can render midnight as "24" in some ICU versions.
  const hour = Number(get("hour")) % 24;
  const minutes = hour * 60 + Number(get("minute"));
  return { day, minutes };
}

function nextOpening(day: number): { day: number; from: string } {
  for (let step = 1; step <= 7; step += 1) {
    const candidate = (day + step) % 7;
    const slot = SCHEDULE[candidate];
    if (slot) return { day: candidate, from: slot.from };
  }
  return { day: 0, from: "08:30" };
}

export function getOpenState(now: Date = new Date()): OpenState {
  const { day, minutes } = israelNow(now);
  const today = SCHEDULE[day];

  if (today) {
    const from = toMinutes(today.from);
    const to = toMinutes(today.to);

    if (minutes >= from && minutes < to) {
      const closingSoon = to - minutes <= 60;
      return {
        open: true,
        badge: "פתוח עכשיו",
        message: closingSoon
          ? `סוגרים בעוד ${to - minutes} דקות, ב-${today.to}`
          : `פתוח עד ${today.to}`,
      };
    }

    if (minutes < from) {
      return {
        open: false,
        badge: "סגור",
        message: `נפתחים היום ב-${today.from}. אפשר לשלוח הודעה ונחזור אליכם.`,
      };
    }
  }

  const next = nextOpening(day);
  const dayLabel = next.day === (day + 1) % 7 ? "מחר" : `ביום ${DAY_NAMES[next.day]}`;
  return {
    open: false,
    badge: "סגור",
    // "ראשון" here would collide with "ביום ראשון" above and read as Sunday twice.
    message: `נחזור אליכם ${dayLabel} מ-${next.from}. שלחו הודעה עכשיו ונטפל בה ראשונה.`,
  };
}
