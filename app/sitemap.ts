import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: base + "/register", changeFrequency: "monthly", priority: 0.7 },
    { url: base + "/login", changeFrequency: "monthly", priority: 0.5 },
  ];
}
