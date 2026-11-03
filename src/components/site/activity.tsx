"use client";

import { useMemo, useRef, useState } from "react";
import type { Calendars, CalWeek } from "@/lib/github";

const RANGES = [["12m", "Last 12 months"], ["2026", "2026"], ["2025", "2025"], ["2024", "2024"]] as const;
const nf = new Intl.NumberFormat("en");
const fmtDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

function stats(cal: CalWeek[], key: string, today: string) {
  const days = cal.flat().filter(d => d[0] <= today);
  const total = days.reduce((a, d) => a + d[1], 0), active = days.filter(d => d[1] > 0).length;
  let best = days[0] ?? ["", 0, 0], longest = 0, run = 0;
  for (const d of days) { if (d[1] > best[1]) best = d; run = d[1] > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  let current = 0; for (let i = days.length - 1; i >= 0 && days[i][1] > 0; i--) current++;
  const byMonth: Record<string, number> = {};
  for (const d of days) byMonth[d[0].slice(0, 7)] = (byMonth[d[0].slice(0, 7)] ?? 0) + d[1];
  const top = Object.entries(byMonth).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  const live = key === "12m" || key === today.slice(0, 4);
  const bd = best[0] ? new Date(best[0] + "T00:00").toLocaleDateString("en", { month: "short", day: "numeric" }) : "";
  const tm = top[0] ? new Date(top[0] + "-01T00:00").toLocaleDateString("en", { month: "long" }) : "";
  return [
    [nf.format(total), "contributions"], [String(active), "active days"], [`${longest} days`, "longest streak"],
    live ? [`${current} days`, "current streak"] : [tm, `busiest month · ${nf.format(top[1])}`],
    [String(best[1]), `best day · ${bd}`],
  ] as [string, string][];
}

/** GitHub heatmap with a period switcher, stats strip and day tooltips. */
export function Activity({ calendars, today }: { calendars: Calendars; today: string }) {
  const [key, setKey] = useState<string>("12m");
  const [animate, setAnimate] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; text: string; instant: boolean } | null>(null);
  const tipTimer = useRef(0);
  const cal = calendars[key] ?? calendars["12m"];
  const s = useMemo(() => stats(cal, key, today), [cal, key, today]);
  const months = useMemo(() => {
    const labels: string[] = [];
    for (let i = 0; i < cal.length; i++) {
      const dt = new Date(cal[i][0][0] + "T00:00");
      const prev = i > 0 ? new Date(cal[i - 1][0][0] + "T00:00").getMonth() : -1;
      labels.push(dt.getMonth() !== prev && i < 51 ? dt.toLocaleString("en", { month: "short" }) : "");
    }
    return labels;
  }, [cal]);
  const ranges = RANGES.filter(([k]) => calendars[k]);

  const onOver = (e: React.PointerEvent) => {
    const c = (e.target as HTMLElement).closest("i"); if (!c) return;
    const n = Number(c.dataset.c), r = c.getBoundingClientRect();
    const text = `${n === 0 ? "No" : n} contribution${n === 1 ? "" : "s"} on ${fmtDay.format(new Date(c.dataset.d + "T00:00"))}`;
    clearTimeout(tipTimer.current);
    if (tip) setTip({ x: r.left + r.width / 2, y: r.top, text, instant: true });
    else tipTimer.current = window.setTimeout(() => setTip({ x: r.left + r.width / 2, y: r.top, text, instant: false }), 250);
  };

  return (
    <section id="activity" aria-labelledby="h-activity">
      <div className="sh">
        <h2 id="h-activity"><svg className="i" aria-hidden="true"><use href="#i-commit" /></svg>Activity</h2>
        <div className="gh-range" role="group" aria-label="Choose a period">
          {ranges.map(([k, label]) => (
            <button key={k} type="button" aria-pressed={k === key} onClick={() => { if (k !== key) { setKey(k); setAnimate(true); } }}>{label}</button>
          ))}
        </div>
      </div>
      <div className="gh">
        <div className={`gh-stats${animate ? " swap" : ""}`} key={`s-${key}`}>
          {s.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
        <div className="heat-wrap">
          <div className="months" aria-hidden="true">{months.map((m, i) => <span key={i} style={{ gridColumn: i + 1 }}>{m}</span>)}</div>
          <div className={`heat${animate ? " swap" : ""}`} key={`h-${key}`} role="img"
            aria-label={`GitHub contributions, ${key === "12m" ? "last 12 months" : key}: ${s[0][0]} contributions.`}
            onPointerOver={onOver} onPointerLeave={() => { clearTimeout(tipTimer.current); setTip(null); }}>
            {cal.map((w, wi) => w.map(([d, c, l]) => (
              <i key={d} data-l={d > today ? 0 : l} data-d={d} data-c={c} className={d > today ? "future" : undefined} style={{ ["--c" as string]: wi }} />
            )))}
          </div>
        </div>
        <div className="legend">Less <i style={{ background: "var(--h0)" }} /><i style={{ background: "var(--h1)" }} /><i style={{ background: "var(--h2)" }} /><i style={{ background: "var(--h3)" }} /><i style={{ background: "var(--h4)" }} /> More</div>
      </div>
      {tip && <div className={`tip on${tip.instant ? " instant" : ""}`} role="tooltip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div>}
    </section>
  );
}
