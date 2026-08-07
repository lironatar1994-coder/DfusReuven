import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { situations } from "@/data/situations";
import { portfolio } from "@/data/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/products", priority: 0.9, changeFrequency: "monthly" },
    // Submitting an empty portfolio page for indexing invites Google to rank
    // the shop on a page that says it has nothing to show. Same condition as
    // the nav link, so the two can never disagree.
    ...(portfolio.length > 0
      ? [{ path: "/portfolio", priority: 0.8, changeFrequency: "monthly" as const }]
      : []),
    { path: "/quote", priority: 0.9, changeFrequency: "monthly" },
    { path: "/reorder", priority: 0.7, changeFrequency: "yearly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...situations.map((situation) => ({
      url: absoluteUrl(`/for/${situation.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
