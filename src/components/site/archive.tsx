"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, type Transition } from "framer-motion";

type Item = { slug: string; title: string; summary: string; date: string; dateLabel: string; minutes: number; tags: string[]; external?: string; source?: string };

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SHUFFLE: Transition = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 };

/** Blog archive: every post grouped by year, filterable by topic. */
export function Archive({ posts }: { posts: Item[] }) {
  const [tag, setTag] = useState("all");
  // first paint gets a slower staggered entrance; later filter changes get a quicker shuffle
  const [shuffled, setShuffled] = useState(false);
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

  const pick = (t: string) => {
    if (t === tag) return;
    setShuffled(true);
    setTag(t);
  };

  const enterDelay = (i: number) => (!shuffled ? 0.18 + i * 0.05 : 0.06 + i * 0.035);
  let idx = 0;

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className="filters" role="group" aria-label="Filter by topic">
          {[["all", "All", posts.length] as const, ...tags.map(t => [t, t, posts.filter(p => inCat(p, t)).length] as const)].map(([key, label, count], i) => (
            <motion.button
              key={key}
              className="f"
              type="button"
              aria-pressed={tag === key}
              onClick={() => pick(key)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.08 + i * 0.04 }}
            >
              {tag === key && <motion.i className="f-pill" layoutId="arc-pill" transition={SHUFFLE} aria-hidden="true" />}
              <b>{label} <span>{count}</span></b>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="popLayout" initial={true}>
          {years.map(y => (
            <motion.div
              className="arc-year"
              key={y}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ layout: SHUFFLE, duration: 0.3, ease: EASE }}
            >
              <motion.h2 className="arc-yh" layout="position" transition={SHUFFLE}>{y}</motion.h2>
              <div className="posts">
                <AnimatePresence mode="popLayout" initial={true}>
                  {list.filter(p => p.date.startsWith(y)).map(p => {
                    const delay = enterDelay(idx++);
                    return (
                      <motion.div
                        key={p.slug}
                        layout="position"
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: EASE, delay } }}
                        exit={{ opacity: 0, scale: 0.96, y: -6, transition: { duration: 0.18, ease: "easeIn" } }}
                        transition={{ layout: SHUFFLE }}
                      >
                        <Link className="post" href={p.external ?? `/blog/${p.slug}`} {...(p.external ? { target: "_blank", rel: "noopener" } : {})}>
                          <time dateTime={p.date}>{p.dateLabel}</time>
                          <div><h3>{p.external && <span className="press">Press · {p.source}</span>}{p.title}</h3><p>{p.summary}</p></div>
                          <span className="m">{p.minutes} min</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}
