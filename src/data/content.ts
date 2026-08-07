import type { CategoryKey } from "./catalog";

export type PortfolioItem = {
  id: string;
  title: string;
  category: CategoryKey;
  categoryLabel: string;
  description: string;
  specs: string[];
  image: string;
  alt: string;
  tall?: boolean;
};

/**
 * Empty on purpose.
 *
 * This previously held 12 invented projects — titles, descriptions and
 * materials specs — presented as completed work for a real business. None of it
 * happened. Removed rather than relabelled.
 *
 * Add real jobs here as photographs become available (see docs/IMAGE-BRIEF.md §7).
 * The portfolio page and the homepage section render an honest empty state while
 * this is empty, and appear automatically once it is not.
 */
export const portfolio: PortfolioItem[] = [];

export const processSteps = [
  {
    title: "מספרים לנו מה אתם צריכים",
    text: "בטלפון, בוואטסאפ או בטופס באתר – גם אם עדיין אין לכם קובץ מוכן.",
  },
  {
    title: "מקבלים הצעה ועיצוב",
    text: "הצעת מחיר ברורה, ואם צריך – גם הצעת עיצוב מותאמת למוצר.",
  },
  {
    title: "מאשרים לפני הדפסה",
    text: "שולחים לכם הדמיה או פרוּפ לבדיקה, ומדפיסים רק אחרי אישור סופי.",
  },
  {
    title: "אנחנו מדפיסים ומספקים",
    text: "הדפסה, גימור ואספקה עד אליכם או איסוף עצמי מבית הדפוס.",
  },
];

/**
 * Every claim here must be something a competitor could not copy verbatim, and
 * something this shop can actually be held to. "איכות ללא פשרות" fails both:
 * no printer claims the opposite, so it carries no information.
 */
export const benefits = [
  {
    icon: "shield" as const,
    title: "בודקים את הקובץ לפני שמדפיסים",
    text: "רזולוציה, בליד וצבעים נבדקים לפני שהמכונה מתחילה. אם משהו ייצא מטושטש — תדעו לפני, לא אחרי.",
  },
  {
    icon: "palette" as const,
    title: "עיצוב והדפסה באותו מקום",
    text: "אין העברות בין מעצב לבית דפוס, ואין על מי להאשים כשמשהו יוצא לא נכון.",
  },
  {
    icon: "users" as const,
    title: "מדברים עם מי שמדפיס",
    text: "לא מוקד ולא טופס אוטומטי — אותו איש קשר מתחילת העבודה ועד המסירה.",
  },
  {
    icon: "check" as const,
    title: "גם 100 יחידות זו הזמנה",
    text: "כמות קטנה מקבלת את אותו יחס. לא צריך להזמין אלפים כדי שנתייחס אליכם.",
  },
  {
    icon: "clock" as const,
    title: "אפשר לבוא לראות ולגעת",
    text: "דוגמאות נייר, פויל וגימור נמצאות אצלנו בחנות בבני ברק. נייר נבחר ביד, לא במסך.",
  },
];

/**
 * Real, and confirmed by the owner.
 *
 * Taken verbatim from the shop's own capabilities flyer ("בין לקוחותינו
 * המרוצים: משרד הביטחון, משטרת ישראל, עיריות, חברות הייטק, בתי ספר, גנים,
 * משרדי רו״ח, משרדי עו״ד ועסקים פרטיים ועוד"), which also carries the same
 * address, phone, fax and email the site uses. Liron confirmed it is current.
 *
 * This is the single strongest trust signal on the property. On a site with no
 * prices, no portfolio and no testimonials, "the police and the Ministry of
 * Defence print here" does work that no amount of copywriting can.
 *
 * These are categories, not named accounts — deliberately. Naming a specific
 * municipality or hi-tech company would need that client's permission.
 */
export const clientTypes = [
  "משרד הביטחון",
  "משטרת ישראל",
  "עיריות ורשויות מקומיות",
  "בתי ספר וגני ילדים",
  "חברות הייטק",
  "משרדי רו״ח ועו״ד",
  "מוסדות וארגונים",
  "עסקים פרטיים",
];

/**
 * Empty on purpose — these were invented quotes shown under five-star ratings.
 * Add real ones only with the customer's permission, using their actual words.
 */
export const testimonials: {
  quote: string;
  name: string;
  business: string;
  initial: string;
}[] = [];

/**
 * Empty on purpose.
 *
 * This previously held invented figures (+2,500 jobs a year, +800 clients,
 * 15 years). Nobody supplied them and they are attached to a real business with
 * a real phone number, so they were removed rather than softened.
 *
 * To bring the band back, fill in numbers Reuven can stand behind. The homepage
 * and about page render it only when this array is non-empty.
 */
export const stats: { value: string; label: string }[] = [];

export const productFaq = [
  {
    q: "כמה זמן לוקחת הדפסה?",
    a: "זה תלוי במוצר, בכמות ובגימור. נמסור לכם זמן ביצוע מדויק יחד עם הצעת המחיר, לפני שאתם מאשרים. אם יש לכם תאריך יעד — אמרו לנו אותו מראש ונגיד בכנות אם הוא אפשרי.",
  },
  {
    q: "אין לי קובץ מוכן – אתם יכולים לעצב?",
    a: "בהחלט. יש לנו מחלקת עיצוב גרפי שמכינה לכם עיצוב חדש או מתאימה קובץ קיים לדרישות הדפוס. תוכלו לבחור באפשרות עיצוב בטופס הצעת המחיר.",
  },
  {
    q: "באילו קבצים כדאי לשלוח?",
    a: "העדיפות היא PDF להדפסה עם בליד של 3 מ״מ, צבעי CMYK ורזולוציה של 300dpi. אנחנו מקבלים גם קבצי AI, PSD, EPS, TIFF ו-JPG באיכות גבוהה, ובודקים כל קובץ לפני ההדפסה.",
  },
  {
    q: "מה ההבדל בין דפוס אופסט לדפוס דיגיטלי?",
    a: "דפוס אופסט משתלם בכמויות גדולות ונותן דיוק צבע גבוה במיוחד. דפוס דיגיטלי מתאים לכמויות קטנות, לזמני ביצוע קצרים ולעבודות שדורשות התאמה אישית. נמליץ לכם על השיטה הנכונה לפי הכמות והתקציב.",
  },
  {
    q: "יש אפשרות למשלוח?",
    a: "כן. אפשר לאסוף מבית הדפוס או לקבל משלוח עד הבית או המשרד. עלות המשלוח נקבעת לפי היעד וגודל המשלוח, ומופיעה בהצעת המחיר שנשלח לכם.",
  },
];

export const contactFaq = [
  {
    q: "אפשר להגיע בלי לתאם מראש?",
    a: "אפשר להיכנס אלינו בשעות הפעילות. אם אתם רוצים לשבת עם מעצב או לראות דוגמאות נייר וגימורים, עדיף לתאם מראש כדי שנוכל להקדיש לכם זמן.",
  },
  {
    q: "כמה מהר תחזרו אליי?",
    a: "אנחנו עונים בשעות הפעילות — ראשון עד חמישי, 09:30–18:30. בשישי ובשבת אנחנו סגורים, ופנייה שנשלחת אז מטופלת ביום ראשון.",
  },
  {
    q: "אתם עובדים גם מול לקוחות מחוץ לאזור?",
    a: "כן. חלק גדול מהעבודות מתנהל בוואטסאפ ובמייל, והמוצר המוגמר נשלח בדואר שליחים. לשילוט נדרשת מדידה באתר, ולכן נבדוק מולכם את אזור השירות.",
  },
  // Was "יש חניה במקום?" — with an answer that talked about pickup and never
  // mentioned parking, while the contact block separately claimed free parking
  // on site. A question the page refuses to answer costs more than it earns,
  // and neither of us can verify the parking, so both are gone.
  {
    q: "אפשר לשלוח קובץ בוואטסאפ?",
    a: "כן, וזו הדרך הכי מהירה. שלחו את הקובץ למספר שבאתר ונחזור אליכם אחרי שנבדוק אותו. אם הקובץ כבד מדי לוואטסאפ, אפשר לצרף אותו לטופס הצעת המחיר או לשלוח בדואר אלקטרוני.",
  },
];
