import Link from "next/link";
import { isSmokeTest, readLeads } from "@/lib/leads";

/* Reads a file that changes between requests, so it can never be prerendered. */
export const dynamic = "force-dynamic";

const formatWhen = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : new Intl.DateTimeFormat("he-IL", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Jerusalem",
      }).format(date);
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ all?: string }>;
}) {
  const { all } = await searchParams;
  const showAll = all === "1";

  const everything = await readLeads();
  const smokeCount = everything.filter(isSmokeTest).length;
  const leads = showAll ? everything : everything.filter((lead) => !isSmokeTest(lead));

  return (
    <>
      <div className="admin__head">
        <h1>פניות</h1>
        <p className="admin__count">
          {leads.length} פניות
          {smokeCount > 0 ? (
            <>
              {" · "}
              {showAll ? (
                <Link href="/admin/leads">הסתרת {smokeCount} בדיקות דיפלוי</Link>
              ) : (
                <Link href="/admin/leads?all=1">הצגת {smokeCount} בדיקות דיפלוי</Link>
              )}
            </>
          ) : null}
        </p>
      </div>

      {leads.length === 0 ? (
        <p className="admin__empty">אין פניות עדיין.</p>
      ) : (
        <div className="admin__scroll">
          <table className="admin__table">
            <thead>
              <tr>
                <th>התקבל</th>
                <th>שם</th>
                <th>טלפון</th>
                <th>מוצר</th>
                <th>כמות</th>
                <th>קבצים</th>
                <th>מקור</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="admin__when">
                    <Link href={`/admin/leads/${lead.id}`}>{formatWhen(lead.receivedAt)}</Link>
                  </td>
                  <td>{lead.fullname}</td>
                  {/* The phone is the reason this page exists — make it tappable. */}
                  <td>
                    <a href={`tel:${lead.phone}`} dir="ltr">
                      {lead.phone}
                    </a>
                  </td>
                  <td>{lead.product}</td>
                  <td>{lead.qty || "—"}</td>
                  <td>{lead.files.length || "—"}</td>
                  <td>{lead.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
