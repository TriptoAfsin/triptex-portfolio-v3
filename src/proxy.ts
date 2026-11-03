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
 * - /writing/<slug>.md          -> the article as markdown
 * - Accept: text/markdown on /  -> /llms.txt
 * - Accept: text/markdown on /writing/<slug> -> the article as markdown
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const md = pathname.match(/^\/writing\/([a-z0-9-]+)\.md$/);
  if (md) return NextResponse.rewrite(new URL(`/md/writing/${md[1]}`, request.url));

  const accept = request.headers.get("accept") ?? "";
  if (wantsMarkdown(accept)) {
    if (pathname === "/") return withLinks(NextResponse.rewrite(new URL("/llms.txt", request.url)));
    const post = pathname.match(/^\/writing\/([a-z0-9-]+)$/);
    if (post) return withLinks(NextResponse.rewrite(new URL(`/md/writing/${post[1]}`, request.url)));
    if (pathname === "/writing") return withLinks(NextResponse.rewrite(new URL("/llms.txt", request.url)));
  }
  return withLinks(NextResponse.next());
}

function withLinks(res: NextResponse) {
  res.headers.set("Vary", "Accept");
  res.headers.set("Link", LINKS);
  return res;
}

export const config = {
  matcher: ["/", "/writing", "/writing/:path*"],
};
