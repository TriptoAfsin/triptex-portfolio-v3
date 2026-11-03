"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { slug: string; title: string; summary: string; date: string; dateLabel: string; minutes: number; tags: string[]; external?: string; source?: string };

/** Writing archive: every post grouped by year, filterable by topic. */
export function Archive({ posts }: { posts: Item[] }) {
  const [tag, setTag] = useState("all");
  const tags = [...new Set(posts.flatMap(p => p.tags))].sort();
  const list = posts.filter(p => tag === "all" || p.tags.includes(tag));
  const years = [...new Set(list.map(p => p.date.slice(0, 4)))];
  return (
    <>
      <div className="filters" role="group" aria-label="Filter by topic">
        <button className="f" type="button" aria-pressed={tag === "all"} onClick={() => setTag("all")}>All <span>{posts.length}</span></button>
        {tags.map(t => <button key={t} className="f" type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
      </div>
      {years.map(y => (
        <div className="arc-year" key={y}>
          <h2 className="arc-yh">{y}</h2>
          <div className="posts">
            {list.filter(p => p.date.startsWith(y)).map(p => (
              <Link className="post" href={p.external ?? `/writing/${p.slug}`} key={p.slug} {...(p.external ? { target: "_blank", rel: "noopener" } : {})}>
                <time dateTime={p.date}>{p.dateLabel}</time>
                <div><h3>{p.external && <span className="press">Press · {p.source}</span>}{p.title}</h3><p>{p.summary}</p></div>
                <span className="m">{p.minutes} min</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
