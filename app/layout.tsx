import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flightcoders.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FlightCoders — Code the future of flight", template: "%s · FlightCoders" },
  description: "Learn the software powering modern aviation through expert-led, project-based learning tracks.",
  applicationName: "FlightCoders",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { type: "website", url: siteUrl, siteName: "FlightCoders", title: "FlightCoders — Code the future of flight", description: "Project-led learning for aviation, autonomy, robotics, and flight data.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "FlightCoders — Code the future of flight" }] },
  twitter: { card: "summary_large_image", title: "FlightCoders", description: "Code the future of flight.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
