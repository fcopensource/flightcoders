import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";
  const updated = new Date("2026-07-12");
  return [
    { url: base, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tracks`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/community`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/jobs`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/register`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/login`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
  ];
}
