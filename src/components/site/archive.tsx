"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { slug: string; title: string; summary: string; date: string; dateLabel: string; minutes: number; tags: string[]; external?: string; source?: string };

/** Writing archive: every post grouped by year, filterable by topic. */
export function Archive({ posts }: { posts: Item[] }) {
  const [tag, setTag] = useState("all");
  // a few readable categories built from the posts' tags, instead of a wall of raw tags
  const CATEGORIES: [string, string[]][] = [
    ["AI", ["ai", "ai-agents", "ai-engineering", "mcp", "model-routing", "prompt-caching", "llm-cost", "human-in-the-loop"]],
    ["NoteBot", ["notebot"]],
    ["Desktop apps", ["tauri", "rust", "desktop", "rss", "sqlite", "devtools"]],
    ["Architecture", ["software-architecture", "malleable-software", "product", "migrations", "postgresql", "backend", "resilience"]],
    ["Press", ["press"]],
  ];
  const inCat = (p: Item, c: string) => (CATEGORIES.find(([n]) => n === c)?.[1] ?? []).some(t => p.tags.includes(t));
  const tags = CATEGORIES.map(([n]) => n).filter(n => posts.some(p => inCat(p, n)));
  const list = posts.filter(p => tag === "all" || inCat(p, tag));
  const years = [...new Set(list.map(p => p.date.slice(0, 4)))];
  return (
    <>
      <div className="filters" role="group" aria-label="Filter by topic">
        <button className="f" type="button" aria-pressed={tag === "all"} onClick={() => setTag("all")}>All <span>{posts.length}</span></button>
        {tags.map(t => <button key={t} className="f" type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>{t} <span>{posts.filter(p => inCat(p, t)).length}</span></button>)}
      </div>
      {years.map(y => (
        <div className="arc-year" key={y}>
          <h2 className="arc-yh">{y}</h2>
          <div className="wlist">
            {list.filter(p => p.date.startsWith(y)).map(p => (
              <Link className="wpost" href={p.external ?? `/writing/${p.slug}`} key={p.slug} {...(p.external ? { target: "_blank", rel: "noopener" } : {})}>
                <span className="wp-date"><b>{p.dateLabel.split(" ")[0]}</b><span>{p.minutes} min</span></span>
                <span className="wp-body">
                  {p.external && <span className="press">Press · {p.source}</span>}
                  <span className="wp-t">{p.title}</span>
                  <span className="wp-s">{p.summary}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
