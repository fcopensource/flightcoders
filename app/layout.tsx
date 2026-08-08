import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { GlobalControls } from "./components/GlobalControls";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-flight-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FlightCoders | Level Up Your Coding Skills",
    template: "%s | FlightCoders",
  },
  description:
    "Build practical coding skills through structured, project-based flight levels designed for computer science and engineering students.",
  applicationName: "FlightCoders",
  keywords: [
    "coding practice for students",
    "project based coding",
    "computer science learning platform",
    "engineering coding skills",
    "gamified coding challenges",
  ],
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "FlightCoders",
    title: "FlightCoders | Level Up Your Coding Skills",
    description:
      "Advance through project-based flight levels built for computer science and engineering students.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "FlightCoders coding skill progression platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlightCoders | Level Up Your Coding Skills",
    description:
      "Structured coding challenges and projects for computer science and engineering students.",
    images: ["/og.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/#organization`,
  name: "FlightCoders",
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  description:
    "A project-based coding learning platform for computer science and engineering students.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "FlightCoders",
  description:
    "Structured coding skill progression through practical challenges and projects.",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        {children}
        <GlobalControls />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      </body>
    </html>
  );
}
