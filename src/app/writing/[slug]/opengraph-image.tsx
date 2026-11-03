import { getArticles, getPost } from "@/lib/posts";
import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Article by Afshin Nahian Tripto";

export function generateStaticParams() {
  return getArticles().map(p => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({
    kicker: "Writing",
    title: post?.title ?? "Writing",
    footer: post ? `Afshin Nahian Tripto · ${post.dateLabel} · ${post.minutes} min read` : "Afshin Nahian Tripto",
  });
}
