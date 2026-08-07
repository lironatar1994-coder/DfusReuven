import type { Metadata } from "next";
import Link from "next/link";

/**
 * Belt and braces against indexing. robots.txt disallows /admin/, but
 * robots.txt is a request and this is an instruction — and a leaked lead
 * inbox in a search index is not a mistake you get to take back.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container admin">
      <header className="admin__bar">
        <strong>ניהול</strong>
        <nav>
          <Link href="/admin/leads">פניות</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
