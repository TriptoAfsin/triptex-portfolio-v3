"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Line = { lead: string; accent: string };

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Rotating hero headline. Each line arrives word by word (blur + rise), holds ~4s, then hands off.
 * The box reserves the tallest line so nothing below moves. Pauses off screen and in hidden tabs;
 * reduced-motion users get the first line, static. Screen readers get one stable line.
 */
export function Headline({ lines }: { lines: Line[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => {
      const probe = el.cloneNode() as HTMLElement;
      probe.style.cssText = "position:absolute;visibility:hidden;left:0;right:0;min-height:0";
      el.parentElement!.appendChild(probe);
      let h = 0;
      for (const l of lines) { probe.textContent = `${l.lead} ${l.accent}`; h = Math.max(h, probe.getBoundingClientRect().height); }
      probe.remove();
      el.style.minHeight = `${h}px`;
    };
    measure();
    document.fonts?.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [lines]);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    if (still.matches) return;
    let visible = true, timer = 0, out = 0;
    const tick = () => {
      setPhase("out");
      out = window.setTimeout(() => { setI(v => (v + 1) % lines.length); setPhase("in"); }, 420);
    };
    const sync = () => { clearInterval(timer); timer = 0; if (visible && !document.hidden) timer = window.setInterval(tick, 4200); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
    io.observe(el); document.addEventListener("visibilitychange", sync); sync();
    return () => { clearInterval(timer); clearTimeout(out); io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [lines.length]);

  const line = lines[i];
  let k = 0;
  // spaces live between the inline-block words; a trailing space inside an inline-block collapses
  const words = (text: string, acc: boolean) => text.split(/\s+/).filter(Boolean).flatMap(w => {
    const d = k++;
    return [d > 0 ? " " : null, <span key={`${i}-${d}`} className={`w${acc ? " acc" : ""}`} style={{ ["--d" as string]: d }}>{w}</span>];
  });

  return (
    <>
      <span className="sr-only">{lines[0].lead} {lines[0].accent}</span>
      <p ref={ref} className={`lede ${phase === "in" ? "anim" : "out"}`} aria-hidden="true">
        {words(line.lead, false)}{words(line.accent, true)}
      </p>
    </>
  );
}
