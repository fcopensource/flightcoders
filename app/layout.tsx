import type { Metadata, Viewport } from "next";
import {Manrope} from "next/font/google";
import { JsonLd, ogImage, siteName, siteUrl } from "../lib/seo";
import "./globals.css";
import "./flightcoders.css";
import "./finishing.css";
import "./theme.css";
import "./company.css";
import "./glass.css";


const manrope=Manrope({subsets:["latin"],variable:"--font-flight-sans",display:"swap"});
const description = "FlightCoders is a software development company building artificial intelligence systems, intelligent software, web platforms, and custom digital products.";

// No site-wide canonical here: each page declares its own, otherwise every page would canonicalize to the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — AI Systems & Software Development", template: "%s · FlightCoders" },
  description,
  applicationName: siteName,
  keywords: ["software development company", "artificial intelligence systems", "intelligent software systems", "custom software", "web development", "AI agents", "FlightCoders"],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: { url: "/brand/flightcoders-green-icon.png", type: "image/png" }, shortcut: "/brand/flightcoders-green-icon.png", apple: "/brand/flightcoders-green-icon.png" },
  openGraph: { type: "website", locale: "en_US", url: siteUrl, siteName, title: "FlightCoders — Build what's next", description: "Artificial intelligence systems, intelligent software, and custom product development.", images: [ogImage] },
  twitter: { card: "summary_large_image", title: "FlightCoders — Build what's next", description: "Hire FlightCoders to build AI systems, intelligent software, and digital products.", images: [ogImage.url] },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6faf7" };

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl, logo: `${siteUrl}/brand/flightcoders-green-icon.png`, image: `${siteUrl}${ogImage.url}`, description, sameAs: ["https://github.com/fcopensource"] },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName, url: siteUrl, description, publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body><JsonLd data={organization}/>{children}</body></html>;
}
