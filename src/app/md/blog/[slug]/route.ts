import { getArticles } from "@/lib/posts";
import { postMarkdown } from "@/lib/agent-docs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map(p => ({ slug: p.slug }));
}

/** Served at /blog/<slug>.md (rewritten by the proxy) and for Accept: text/markdown. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const md = postMarkdown((await params).slug);
  if (!md) return new Response("Not found", { status: 404 });
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
