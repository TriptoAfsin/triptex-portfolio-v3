import type { MetadataRoute } from "next";

const SITE_URL = "https://triptex.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/cv/Afshin%20Nahian%20Tripto-Software%20Engineer.pdf`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
