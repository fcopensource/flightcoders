import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep production builds from replacing files used by the active dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  async headers() {
    return [{
      source: "/",
      headers: [
        { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
        { key: "CDN-Cache-Control", value: "no-store" },
        { key: "Surrogate-Control", value: "no-store" },
      ],
    }, {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      ],
    }];
  },
};

export default nextConfig;
