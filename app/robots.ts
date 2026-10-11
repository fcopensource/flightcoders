import type { MetadataRoute } from "next";
import { siteUrl as base } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/profile", "/flight-lab", "/login", "/verify-email"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
