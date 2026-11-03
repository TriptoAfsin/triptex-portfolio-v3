import { NextResponse, type NextRequest } from "next/server";

const LINKS = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</agents.md>; rel="describedby"; type="text/markdown"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(", ");

function wantsMarkdown(accept: string) {
  return accept.split(",").some(e => e.trim().split(";")[0].toLowerCase() === "text/markdown");
}

/**
 * Markdown for agents:
 * - /blog/<slug>.md          -> the article as markdown
 * - Accept: text/markdown on /  -> /llms.txt
 * - Accept: text/markdown on /blog/<slug> -> the article as markdown
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const md = pathname.match(/^\/blog\/([a-z0-9-]+)\.md$/);
  if (md) return NextResponse.rewrite(new URL(`/md/blog/${md[1]}`, request.url));

  const accept = request.headers.get("accept") ?? "";
  if (wantsMarkdown(accept)) {
    if (pathname === "/") return withLinks(NextResponse.rewrite(new URL("/llms.txt", request.url)));
    const post = pathname.match(/^\/blog\/([a-z0-9-]+)$/);
    if (post) return withLinks(NextResponse.rewrite(new URL(`/md/blog/${post[1]}`, request.url)));
    if (pathname === "/blog") return withLinks(NextResponse.rewrite(new URL("/llms.txt", request.url)));
  }
  return withLinks(NextResponse.next());
}

function withLinks(res: NextResponse) {
  res.headers.set("Vary", "Accept");
  res.headers.set("Link", LINKS);
  return res;
}

export const config = {
  matcher: ["/", "/blog", "/blog/:path*"],
};
