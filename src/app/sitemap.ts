import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/posts";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getArticles();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: posts[0] ? new Date(posts[0].date) : now, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/agents.md`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/cv/afshin-nahian-tripto-resume.pdf`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
