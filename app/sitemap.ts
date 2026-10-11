import type { MetadataRoute } from "next";
import type { RowDataPacket } from "mysql2";
import { getDb } from "../lib/db";
import { siteUrl as base } from "../lib/seo";

// Regenerate hourly so new blog posts, jobs, and projects are discovered without a redeploy.
export const revalidate = 3600;

interface Entry extends RowDataPacket { slug: string; updated_at: Date }

async function rows(sql: string) {
  try { const [result] = await getDb().execute<Entry[]>(sql); return result; } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = new Date("2026-10-12");
  const [posts, jobs, projects] = await Promise.all([
    rows("SELECT slug,updated_at FROM blog_posts WHERE published=TRUE"),
    rows("SELECT slug,updated_at FROM jobs WHERE is_open=TRUE"),
    rows("SELECT slug,updated_at FROM projects WHERE featured=TRUE"),
  ]);
  const dynamic = (path: string, items: Entry[], priority: number): MetadataRoute.Sitemap =>
    items.map(item => ({ url: `${base}/${path}/${item.slug}`, lastModified: new Date(item.updated_at), changeFrequency: "monthly", priority }));
  return [
    { url: base, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tracks`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/community`, lastModified: updated, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/jobs`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/register`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    ...dynamic("blog", posts, 0.8),
    ...dynamic("projects", projects, 0.8),
    ...dynamic("jobs", jobs, 0.6),
  ];
}
