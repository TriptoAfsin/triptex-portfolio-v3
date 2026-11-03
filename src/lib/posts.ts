import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  minutes: number;
  tags: string[];
  cover?: string;
  /** Press or external pieces link out instead of having a page here. */
  external?: string;
  source?: string;
  markdown: string;
};

const DIR = join(process.cwd(), "content", "writing");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(file: string): Post {
  const raw = readFileSync(join(DIR, file), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
  }
  const [y, m] = meta.date.split("-");
  return {
    slug: meta.slug,
    title: meta.title,
    summary: meta.summary,
    date: meta.date,
    dateLabel: `${MONTHS[Number(m) - 1]} ${y}`,
    minutes: Number(meta.readingMinutes ?? 6),
    tags: (meta.tags ?? "").replace(/[[\]]/g, "").split(",").map(t => t.trim()).filter(Boolean),
    cover: meta.cover,
    external: meta.external,
    source: meta.source,
    markdown: match[2],
  };
}

/** All posts, newest first. Read once per build. */
export const getPosts = cache((): Post[] =>
  readdirSync(DIR).filter(f => f.endsWith(".md")).map(parse).sort((a, b) => b.date.localeCompare(a.date)),
);

/** Articles hosted on this site (excludes press links). */
export const getArticles = cache(() => getPosts().filter(p => !p.external));

export const getPost = cache((slug: string) => getArticles().find(p => p.slug === slug));

/** Where a list item should link. */
export const postHref = (p: Pick<Post, "slug" | "external">) => p.external ?? `/writing/${p.slug}`;

/** Markdown to HTML. Content is first-party, written in this repo. */
export function renderPost(post: Post): string {
  const html = marked.parse(post.markdown, { gfm: true, async: false }) as string;
  // ASCII diagrams (unlabelled code blocks with box-drawing or arrows) get their own style
  return html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (all, body: string) =>
    /[│┌└─▶→|+>]/.test(body) ? `<pre class="diagram"><code>${body}</code></pre>` : all,
  ).replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
}
