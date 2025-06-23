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
  title: "Afshin Nahian Tripto",
  description: "Crafting intelligent web experiences with AI & TypeScript. Passionate about RAG applications and full-stack innovation 🚀",
  keywords: "software engineer, AI, RAG, retrieval-augmented generation, typescript, javascript, react, nextjs, nodejs, dhaka, bangladesh, fullstack developer, frontend, backend, mysql, postgresql, docker, github actions",
  openGraph: {
    images: [
      {
        url: "/opengraph-image.png",
        width: 1152,
        height: 605,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1152,
        height: 605,
        type: "image/png",
      },
    ],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
