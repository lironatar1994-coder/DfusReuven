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
    a: "כן. אפשר לאסוף מבית הדפוס או לקבל משלוח עד הבית או המשרד. עלות המשלוח נקבעת לפי היעד וגודל המשלוח ומופיעה בהצעת המחיר.",
  },
];

export const contactFaq = [
  {
    q: "אפשר להגיע בלי לתאם מראש?",
    a: "אפשר להיכנס אלינו בשעות הפעילות. אם אתם רוצים לשבת עם מעצב או לראות דוגמאות נייר וגימורים, עדיף לתאם מראש כדי שנוכל להקדיש לכם זמן.",
  },
  {
    q: "כמה מהר תחזרו אליי?",
    a: "אנחנו עונים בשעות הפעילות — א׳–ה׳ 07:30–19:30 ובשישי עד 13:00. פנייה שנשלחת אחרי הסגירה מטופלת ביום העסקים הבא.",
  },
  {
    q: "אתם עובדים גם מול לקוחות מחוץ לאזור?",
    a: "כן. חלק גדול מהעבודות מתנהל בוואטסאפ ובמייל, והמוצר המוגמר נשלח בדואר שליחים. לשילוט נדרשת מדידה באתר, ולכן נבדוק מולכם את אזור השירות.",
  },
  {
    q: "יש חניה במקום?",
    a: "אנחנו נמצאים בז׳בוטינסקי 84 בבני ברק. אפשר לתאם איתנו מראש איסוף של עבודה מוכנה.",
  },
];
