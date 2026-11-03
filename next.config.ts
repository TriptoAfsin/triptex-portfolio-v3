import type { NextConfig } from "next";

const HOMEPAGE_LINK_HEADER = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</robots.txt>; rel="robots"; type="text/plain"',
].join(", ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // /writing was renamed to /blog; keep old links working. Single-segment match only, so the
  // post images that still live at /writing/<slug>/<n>.webp are not redirected.
  async redirects() {
    return [
      { source: "/writing", destination: "/blog", permanent: true },
      { source: "/writing/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Link", value: HOMEPAGE_LINK_HEADER },
          { key: "Vary", value: "Accept" },
        ],
      },
    ];
  },
};

export default nextConfig;
