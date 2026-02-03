import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://triptex.me"),
  title: {
    default: "Tripto Afsin | AI & Full-Stack Engineer",
    template: "%s | Tripto Afsin",
  },
  description:
    "Software Engineer with 3+ years of experience specializing in AI/RAG systems, AI agents, and full-stack development. Building intelligent web experiences with TypeScript, React, Next.js, and Node.js.",
  keywords: [
    "Tripto Afsin",
    "software engineer",
    "AI engineer",
    "RAG systems",
    "retrieval-augmented generation",
    "AI agents",
    "product engineer",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "full-stack developer",
    "Dhaka",
    "Bangladesh",
  ],
  authors: [{ name: "Tripto Afsin", url: "https://triptex.me" }],
  creator: "Tripto Afsin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://triptex.me",
    siteName: "Tripto Afsin",
    title: "Tripto Afsin | AI & Full-Stack Engineer",
    description:
      "Software Engineer specializing in AI/RAG systems, AI agents, and full-stack development. Building intelligent web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tripto Afsin | AI & Full-Stack Engineer",
    description:
      "Software Engineer specializing in AI/RAG systems, AI agents, and full-stack development.",
    creator: "@triptoafsin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
