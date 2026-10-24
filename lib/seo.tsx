import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com").replace(/\/$/, "");
export const siteName = "FlightCoders";
export const ogImage = { url: "/brand/flightcoders-purple-logo.png", width: 1944, height: 809, alt: "FlightCoders — Build what's next" };

/** Per-page metadata with its own canonical URL and matching Open Graph / Twitter tags. */
export function pageMetadata({ title, description, path, type = "website", noIndex = false }: { title: string; description: string; path: string; type?: "website" | "article"; noIndex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName, title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Private / account pages that should never appear in search results. */
export const noIndexMetadata: Metadata = { robots: { index: false, follow: false } };

/** Renders schema.org structured data. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbs(items: [name: string, path: string][]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${siteUrl}${path}` })) };
}
