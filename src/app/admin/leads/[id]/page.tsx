import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/lib/leads";
import { assetPath, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

const kb = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export default async function AdminLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const rows: [string, string][] = [
    ["שם", lead.fullname],
    ["טלפון", lead.phone],
    ["אימייל", lead.email],
    ["מוצר", lead.product],
    ["כמות", lead.qty],
    ["מידה", lead.size],
    ["עיצוב", lead.design],
    ["תאריך יעד", lead.date],
    ["תקציב", lead.budget],
    ["מקור", lead.source],
    ["התקבל", lead.receivedAt],
    ["כתובת IP", lead.ip],
  ];

  return (
    <>
      <p className="admin__back">
        <Link href="/admin/leads">‹ חזרה לפניות</Link>
      </p>

      <h1>{lead.fullname}</h1>

      {/* The two actions the shop actually takes on a lead, at the top. */}
      <div className="btn-row" style={{ marginBottom: 24 }}>
        <a className="btn btn--primary btn--sm" href={`tel:${lead.phone}`}>
          חיוג
        </a>
        <a
          className="btn btn--secondary btn--sm"
          href={waLink(`היי ${lead.fullname}, מדפוס ראובן — קיבלנו את הפנייה שלכם`)}
          target="_blank"
          rel="noopener"
        >
          וואטסאפ
        </a>
      </div>

      <dl className="admin__dl">
        {rows.map(([label, value]) =>
          value ? (
            <div key={label}>
              <dt>{label}</dt>
              <dd dir={/[A-Za-z0-9@+]/.test(value) && !/[֐-׿]/.test(value) ? "ltr" : undefined}>
                {value}
              </dd>
            </div>
          ) : null,
        )}
      </dl>

      {lead.details ? (
        <>
          <h2>פרטים</h2>
          <p className="admin__details">{lead.details}</p>
        </>
      ) : null}

      {lead.files.length ? (
        <>
          <h2>קבצים</h2>
          <ul className="admin__files">
            {lead.files.map((file) => {
              const hint = lead.artworkHints?.find((h) => h.file === file.original);
              return (
                <li key={file.stored}>
                  {/* Served through a route handler: these live outside the
                      webroot, and must never become a public URL. */}
                  <a
                    href={assetPath(
                      `/api/admin/leads/${lead.id}/file/${encodeURIComponent(file.stored)}`,
                    )}
                  >
                    {file.original}
                  </a>
                  <span className="admin__filemeta">{kb(file.size)}</span>
                  {hint ? (
                    <span className={`admin__hint admin__hint--${hint.level}`}>{hint.headline}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p className="admin__note">
            בדיקת הקבצים היא הערכה אוטומטית לפי מידות הפיקסלים בלבד — היא אינה בודקת בליד, צבע או
            גופנים, ואינה מחליפה בדיקה לפני הדפסה.
          </p>
        </>
      ) : null}
    </>
  );
}
