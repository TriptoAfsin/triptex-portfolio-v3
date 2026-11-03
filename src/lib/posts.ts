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
  // normalise Windows line endings so the frontmatter regex works on any checkout
  const raw = readFileSync(join(DIR, file), "utf8").replace(/\r\n/g, "\n");
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

const LANGS = ["ts", "tsx", "js", "jsx", "json", "rust", "bash", "sh", "yaml", "sql", "python", "go", "css", "html"];
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** One Shiki highlighter per build, with a light and a dark theme emitted as CSS variables. */
const getHighlighter = cache(async () => {
  const { createHighlighter } = await import("shiki");
  return createHighlighter({ themes: ["github-light", "github-dark-dimmed"], langs: LANGS });
});

/**
 * Markdown to HTML at build time. Content is first-party, written in this repo.
 * - code blocks are syntax-highlighted by Shiki (no client JS), with a language label
 * - ```mermaid blocks become <pre class="mermaid"> and are drawn on the client, only on posts that have one
 */
export async function renderPost(post: Post): Promise<string> {
  const hl = await getHighlighter();
  const tokens = marked.lexer(post.markdown, { gfm: true });
  marked.walkTokens(tokens, token => {
    if (token.type !== "code") return;
    const t = token as unknown as { type: string; raw: string; text: string; lang?: string; pre?: boolean };
    const lang = (t.lang ?? "").trim().toLowerCase();
    let html: string;
    if (lang === "mermaid") {
      html = `<figure class="mmd"><pre class="mermaid">${escapeHtml(t.text)}</pre></figure>`;
    } else if (LANGS.includes(lang)) {
      const code = hl.codeToHtml(t.text, { lang, themes: { light: "github-light", dark: "github-dark-dimmed" }, defaultColor: false });
      html = `<div class="code"><span class="code-lang">${lang}</span>${code}</div>`;
    } else {
      html = `<div class="code"><pre class="shiki plain"><code>${escapeHtml(t.text)}</code></pre></div>`;
    }
    Object.assign(t, { type: "html", raw: html, text: html, pre: false, block: true });
  });
  const html = marked.parser(tokens);
  return html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
}
