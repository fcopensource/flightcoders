import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { GlobalControls } from "./components/GlobalControls";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-flight-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — Hackathons for builders", template: "%s · FlightCoders" },
  description:
    "Join FlightCoders hackathons, open-source challenges, technical meetups, and builder projects. Build real software, ship in public, and connect with developers.",
  applicationName: "FlightCoders",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "FlightCoders",
    title: "FlightCoders — Build bold ideas. Ship real projects.",
    description:
      "A developer community for hackathons, open-source challenges, technical meetups, and projects that become visible proof of work.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "FlightCoders hackathon community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlightCoders — Hackathons for builders",
    description: "Build real software. Ship in public. Connect with developers.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        {children}
        <GlobalControls />
      </body>
    </html>
  );
}
