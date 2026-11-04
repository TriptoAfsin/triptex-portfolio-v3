import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { IconSprite } from "@/components/site/icons";
import { Header, Footer } from "@/components/site/chrome";
import { person, SITE_URL } from "@/data/site";
import "./globals.css";
import "../styles/site.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const description =
  "Founder, product engineer and AI engineer. I turn messy problems into AI-native products that people and their agents can both use, and run them at scale.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${person.name} · Founder, Product & AI Engineer`, template: `%s · ${person.name}` },
  description,
  keywords: ["Afshin Nahian Tripto", "Tripto Afsin", "product engineer", "AI engineer", "founder", "AI agents", "MCP", "RAG", "full-stack", "Next.js", "Dhaka"],
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  alternates: { canonical: "/", types: { "text/plain": "/llms.txt", "text/markdown": "/agents.md" } },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: person.name, title: `${person.name} · Founder, Product & AI Engineer`, description },
  twitter: { card: "summary_large_image", creator: "@Tripto_Afsin", site: "@Tripto_Afsin", title: `${person.name} · Founder, Product & AI Engineer`, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#141414" }, { media: "(prefers-color-scheme: light)", color: "#fcfcfc" }],
  viewportFit: "cover",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  alternateName: "Tripto Afsin",
  url: SITE_URL,
  image: person.photo,
  jobTitle: "Founder, Product Engineer and AI Engineer",
  worksFor: { "@type": "Organization", name: "Provision Capital" },
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  email: `mailto:${person.email}`,
  sameAs: [person.social.github, person.social.linkedin, person.social.x],
  knowsAbout: ["AI agents", "Model Context Protocol", "RAG", "Product engineering", "Next.js", "TypeScript", "Automation"],
};

const revealScript = `(function(){var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js");setTimeout(function(){if(!d.classList.contains("reveal-ready"))d.classList.remove("js")},4000)})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${mono.variable}`}>
      <head>
        {/* runs before first paint so home sections start hidden instead of flashing; shows them anyway if hydration never lands */}
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body>
        <a href="#top" className="skip">Skip to content</a>
        <IconSprite />
        <ThemeProvider>
          <div className="page">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}
