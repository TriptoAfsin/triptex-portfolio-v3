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
  title: "Afshin Nahian Tripto | AI & Full-Stack Developer",
  description:
    "Software Engineer specializing in AI/RAG systems, full-stack development with TypeScript, React, and Node.js. Building intelligent web experiences.",
  keywords:
    "software engineer, AI, RAG, retrieval-augmented generation, AI agents, typescript, javascript, react, nextjs, nodejs, fullstack developer, dhaka, bangladesh",
  openGraph: {
    title: "Afshin Nahian Tripto | AI & Full-Stack Developer",
    description:
      "Software Engineer specializing in AI/RAG systems and full-stack development.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afshin Nahian Tripto | AI & Full-Stack Developer",
    description:
      "Software Engineer specializing in AI/RAG systems and full-stack development.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
