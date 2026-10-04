import type { Metadata } from "next";
import {Manrope} from "next/font/google";
import "./globals.css";
import "./flightcoders.css";
import "./finishing.css";


const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";
const manrope=Manrope({subsets:["latin"],variable:"--font-flight-sans",display:"swap"});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — Build what's next", template: "%s · FlightCoders" },
  description: "The global network for hackathons, frontier technology, world-class developers, and projects worth shipping.",
  applicationName: "FlightCoders",
  alternates: { canonical: "/" },
  icons: { icon: { url: "/brand/flightcoders-icon.png", type: "image/png" }, shortcut: "/brand/flightcoders-icon.png", apple: "/brand/flightcoders-icon.png" },
  openGraph: { type: "website", url: siteUrl, siteName: "FlightCoders", title: "FlightCoders — Build what's next", description: "Meet frontier technology, ambitious builders, and projects worth shipping.", images: [{ url: "/brand/flightcoders-banner.png", width: 1672, height: 941, alt: "FlightCoders — Build what's next" }] },
  twitter: { card: "summary_large_image", title: "FlightCoders", description: "Build what's next. Together.", images: ["/brand/flightcoders-banner.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body>{children}</body></html>;
}
