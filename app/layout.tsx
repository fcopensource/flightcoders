import type { Metadata } from "next";
import {Manrope} from "next/font/google";
import "./globals.css";
import { GlobalControls } from "./components/GlobalControls";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";
const manrope=Manrope({subsets:["latin"],variable:"--font-flight-sans",display:"swap"});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — Code the future of flight", template: "%s · FlightCoders" },
  description: "Learn programming by building and testing real aviation, drone, autonomy, telemetry, and flight-safety software.",
  applicationName: "FlightCoders",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { type: "website", url: siteUrl, siteName: "FlightCoders", title: "FlightCoders — Code the future of flight", description: "Project-led learning for aviation, autonomy, robotics, and flight data.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "FlightCoders — Code the future of flight" }] },
  twitter: { card: "summary_large_image", title: "FlightCoders", description: "Code the future of flight.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body>{children}<GlobalControls/></body></html>;
}
