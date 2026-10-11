import type { Metadata, Viewport } from "next";
import {Manrope} from "next/font/google";
import { JsonLd, ogImage, siteName, siteUrl } from "../lib/seo";
import "./globals.css";
import "./flightcoders.css";
import "./finishing.css";


const manrope=Manrope({subsets:["latin"],variable:"--font-flight-sans",display:"swap"});
const description = "FlightCoders is the global developer community for hackathons, coding challenges, learning tracks, and open-source projects. Meet builders, sharpen your skills, and ship what's next.";

// No site-wide canonical here: each page declares its own, otherwise every page would canonicalize to the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — Global Developer Community, Hackathons & Coding Challenges", template: "%s · FlightCoders" },
  description,
  applicationName: siteName,
  keywords: ["developer community", "hackathons", "coding challenges", "learn to code", "open source projects", "programming community", "software engineering", "AI agents", "Rust", "flight software", "drone autonomy", "FlightCoders"],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: { url: "/brand/flightcoders-icon.png", type: "image/png" }, shortcut: "/brand/flightcoders-icon.png", apple: "/brand/flightcoders-icon.png" },
  openGraph: { type: "website", locale: "en_US", url: siteUrl, siteName, title: "FlightCoders — Build what's next", description: "Meet frontier technology, ambitious builders, and projects worth shipping.", images: [ogImage] },
  twitter: { card: "summary_large_image", title: "FlightCoders — Build what's next", description: "The global developer community for hackathons, coding challenges, and projects worth shipping.", images: [ogImage.url] },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b0b0f" };

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl, logo: `${siteUrl}/brand/flightcoders-icon.png`, image: `${siteUrl}${ogImage.url}`, description, sameAs: ["https://github.com/fcopensource"] },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName, url: siteUrl, description, publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body><JsonLd data={organization}/>{children}</body></html>;
}
