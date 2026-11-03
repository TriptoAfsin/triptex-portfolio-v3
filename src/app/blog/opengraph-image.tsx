import { getArticles } from "@/lib/posts";
import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Blog by Afshin Nahian Tripto";

export default function Image() {
  return ogImage({
    kicker: "Blog",
    title: "How things got built: the architecture, the tradeoffs, and what broke.",
    footer: `Afshin Nahian Tripto · ${getArticles().length} articles`,
  });
}
