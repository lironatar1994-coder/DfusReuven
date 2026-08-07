import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (allowIndexing) {
    return {
      // /admin holds customers' names, phone numbers and artwork. The real
      // gate is the middleware; this only keeps it out of the index.
      rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
