import { NextResponse, type NextRequest } from "next/server";

function acceptsMarkdown(accept: string): boolean {
  return accept.split(",").some(entry => {
    const mediaType = entry.trim().split(";")[0].toLowerCase();
    return mediaType === "text/markdown";
  });
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept") ?? "";

  if (!acceptsMarkdown(accept)) {
    const response = NextResponse.next();
    response.headers.set("Vary", "Accept");
    return response;
  }

  const markdownUrl = new URL("/llms.txt", request.nextUrl.origin);
  const upstream = await fetch(markdownUrl, {
    headers: { accept: "text/plain" },
  });
  const body = await upstream.text();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "Cache-Control": "public, max-age=300",
      "Link": [
        '</llms.txt>; rel="describedby"; type="text/plain"',
        '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      ].join(", "),
    },
  });
}

export const config = {
  matcher: ["/"],
};
