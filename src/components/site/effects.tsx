"use client";

import { useEffect, useState } from "react";

/**
 * Page-level motion, all opt-out for reduced motion:
 * - the hero staggers in on load
 * - sections below the first screen fade up once as they arrive (never hidden if JS fails)
 * - bento cards get a cursor spotlight on desktop, and play their loops when in view on touch screens
 */
export function Effects() {
  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const pending = new Set(document.querySelectorAll<HTMLElement>(".stack > section, main > .contact-cta"));
    if (still || !root.classList.contains("js")) pending.forEach(el => el.classList.add("shown"));
    else {
      // sections on screen at load follow the hero's stagger, timed from navigation start so a slow
      // hydration doesn't stack extra delay on top; later ones fade up as they scroll in
      let batch = 0;
      const show = (el: HTMLElement, rise: boolean, delay = 0) => {
        if (!pending.delete(el)) return;
        io.unobserve(el);
        if (rise) { el.style.animationDelay = `${delay}ms`; el.classList.add("rise"); }
        el.classList.add("shown");
      };
      const io = new IntersectionObserver(es => es.forEach(e => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) show(el, true, Math.max(0, 380 + batch++ * 110 - performance.now()));
        else if (e.boundingClientRect.bottom < 0) show(el, false);
      }), { rootMargin: "0px 0px -6% 0px" });
      pending.forEach(el => io.observe(el));
      // a restored scroll position can jump past sections without them ever intersecting
      const passed = () => {
        pending.forEach(el => { if (el.getBoundingClientRect().bottom < 0) show(el, false); });
        if (!pending.size) removeEventListener("scroll", passed);
      };
      addEventListener("scroll", passed, { passive: true });
      cleanups.push(() => { io.disconnect(); removeEventListener("scroll", passed); });
    }

    const grid = document.getElementById("bento");
    if (grid) {
      grid.querySelectorAll<HTMLElement>(".bars i").forEach((b, i) => b.style.setProperty("--k", String(i)));
      if (matchMedia("(hover: hover)").matches) {
        const move = (e: PointerEvent) => {
          const c = (e.target as HTMLElement).closest<HTMLElement>(".bx"); if (!c) return;
          const r = c.getBoundingClientRect();
          c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        grid.addEventListener("pointermove", move, { passive: true });
        cleanups.push(() => grid.removeEventListener("pointermove", move));
      } else {
        // touch screens: a tap plays the card's hover animation; tap again (or another card) to switch
        const tap = (e: MouseEvent) => {
          const c = (e.target as HTMLElement).closest<HTMLElement>(".bx"); if (!c) return;
          const r = c.getBoundingClientRect();
          c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
          const on = c.classList.contains("tap");
          grid.querySelectorAll(".bx.tap").forEach(x => x.classList.remove("tap"));
          if (!on) { void c.offsetWidth; c.classList.add("tap"); }
        };
        grid.addEventListener("click", tap);
        cleanups.push(() => grid.removeEventListener("click", tap));
      }
    }
    return () => cleanups.forEach(f => f());
  }, []);
  return null;
}

type Entry = { t: string; c: string; n: string; d: string; ship?: boolean };
const CATS = [["all", "All"], ["work", "Work"], ["oss", "Open source"], ["notebot", "NoteBot"], ["edu", "Education"]] as const;

/** Filterable changelog with a "show all" toggle. */
export function Log({ entries }: { entries: Entry[] }) {
  const [cat, setCat] = useState("all");
  const [all, setAll] = useState(false);
  const [tick, setTick] = useState(0);
  const match = entries.filter(e => cat === "all" || e.c === cat);
  const shown = all ? match : match.slice(0, 6);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter the log">
        {CATS.map(([k, l]) => (
          <button key={k} className="f" type="button" aria-pressed={cat === k} onClick={() => { setCat(k); setAll(false); setTick(t => t + 1); }}>
            {l}<span>{k === "all" ? entries.length : entries.filter(e => e.c === k).length}</span>
          </button>
        ))}
      </div>
      <div className="log">
        {shown.map((e, i) => (
          <div className={`ent${tick ? " in" : ""}`} key={`${tick}-${e.n}-${e.t}`} data-ship={e.ship ? "" : undefined} style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
            <time>{e.t}</time><div><b>{e.n}</b><p>{e.d}</p></div>
          </div>
        ))}
      </div>
      {match.length > 6 && (
        <button className="more" type="button" aria-expanded={all} onClick={() => { setAll(a => !a); setTick(t => t + 1); }}>
          <span>{all ? "Show less" : `Show all ${match.length}`}</span>
          <svg className="i" aria-hidden="true"><use href="#i-chev" /></svg>
        </button>
      )}
    </>
  );
}
