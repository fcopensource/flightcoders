import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-flight-sans", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — Built for builders who finish", template: "%s · FlightCoders" },
  description: "A focused developer community for hackathons and build sprints. Build real software, ship it, and prove what you can do.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { type: "website", url: siteUrl, siteName: "FlightCoders", title: "FlightCoders — Built for builders who finish", description: "Build real software. Ship it. Prove what you can do.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "FlightCoders" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body>{children}</body></html>;
}
