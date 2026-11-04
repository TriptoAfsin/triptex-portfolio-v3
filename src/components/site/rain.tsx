"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789{}[]<>/=+*#$%ΣΔλ∂";
const WORDS = ["agent.plan()", "retrieve(ctx)", "memory.write()", "tool_call", "embed(doc)", "ship()", "await queue", "rerank(k=8)"];

/**
 * The hero's token rain: columns of glyphs fall and, every few seconds, one row decodes into an
 * agent call. Canvas only, runs at the display's frame rate with motion scaled by elapsed time, and the
 * leading cell fades in by how far the drop has travelled into it, so columns glide instead of stepping.
 * Paused off screen and in hidden tabs, drawn once and held still for reduced motion. Phones get bigger cells (fewer glyphs) and a 1.5x resolution cap.
 */
export function Rain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const small = matchMedia("(max-width: 640px)").matches;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
    const CELL = small ? 15 : 13, TRAIL = small ? 10 : 14;
    type Drop = { y: number; v: number; trail: string[] };
    let W = 0, H = 0, cols = 0, rows = 0, drops: Drop[] = [];
    let word: { w: string; row: number; col: number; t: number; g: string[]; sv: boolean[] } | null = null;
    let mx = -999, my = -999, last = 0, nextWord = 0, raf = 0, running = false, visible = true;
    const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    let rain = "", head = "", font = "", flick = 0;
    const readColors = () => { const s = getComputedStyle(document.documentElement); rain = s.getPropertyValue("--rain").trim(); head = s.getPropertyValue("--rain-head").trim(); font = `500 ${CELL - 2}px ${s.getPropertyValue("--f-mono").trim() || "monospace"}`; };

    function seed() {
      const r = cv!.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return;
      cv!.width = W * dpr; cv!.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(W / CELL); rows = Math.ceil(H / CELL);
      drops = Array.from({ length: cols }, () => ({ y: rnd(-rows, rows), v: rnd(0.18, 0.53), trail: Array.from({ length: rows }, pick) }));
      word = null; readColors();
    }
    function newWord() {
      const w = WORDS[(Math.random() * WORDS.length) | 0];
      if (w.length > cols - 2) return;
      word = { w, g: [], sv: [], row: 2 + ((Math.random() * Math.max(1, rows - 4)) | 0), col: Math.max(1, ((cols - w.length) * (0.45 + Math.random() * 0.45)) | 0), t: 0 };
    }
    // s = elapsed time in 30fps frames (the speeds below were tuned at 30fps); 0 redraws without moving
    function draw(s: number) {
      if (!W) return;
      ctx!.clearRect(0, 0, W, H);
      ctx!.font = font;
      ctx!.textBaseline = "top";
      // undecoded word glyphs reshuffle at ~15Hz whatever the frame rate, so the decode doesn't strobe
      flick += s; const shuffle = flick >= 2; if (shuffle) flick = 0;
      for (let c = 0; c < cols; c++) {
        const d = drops[c], near = Math.max(0, 1 - Math.hypot(c - mx, d.y - my) / 8);
        if (s) {
          d.y += d.v * (1 + near * 2) * s;
          if (d.y > rows + 14) { d.y = rnd(-12, -2); d.v = rnd(0.18, 0.53); }
          if (Math.random() < 0.03 * s) d.trail[(Math.random() * rows) | 0] = pick();
        }
        const hy = Math.floor(d.y), f = d.y - hy;
        // k = -1 is the cell the drop is moving into: it fades in as f grows, while the tail's
        // brightness follows the drop's exact position rather than its whole-cell index
        for (let k = -1; k < TRAIL; k++) {
          const y = hy - k; if (y < 0 || y >= rows) continue;
          if (word && y === word.row && c >= word.col && c < word.col + word.w.length) continue;
          const x = c * CELL, py = y * CELL;
          if (k < 0) { if (f > 0.02) { ctx!.globalAlpha = 0.95 * f; ctx!.fillStyle = head; ctx!.fillText(d.trail[y], x, py); } continue; }
          const tail = Math.max(0, (1 - (k + 1 - f) / TRAIL) * (0.5 + near * 0.5));
          if (tail > 0.01) { ctx!.globalAlpha = k === 0 ? tail * f : tail; ctx!.fillStyle = rain; ctx!.fillText(d.trail[y], x, py); }
          // the old head hands its colour over to the tail as the next cell lights up
          if (k === 0) { ctx!.globalAlpha = 0.95 * (1 - f); ctx!.fillStyle = head; ctx!.fillText(d.trail[y], x, py); }
        }
      }
      if (word) {
        const { w, row, col, t } = word;
        for (let i = 0; i < w.length; i++) {
          if (shuffle || word.sv[i] === undefined) word.sv[i] = t < 1 ? Math.random() < t : t < 2 ? true : Math.random() > t - 2;
          const solved = word.sv[i];
          ctx!.globalAlpha = t > 2.6 ? Math.max(0, (3 - t) / 0.4) : 1;
          ctx!.fillStyle = solved ? head : rain;
          ctx!.fillText(solved ? w[i] : (shuffle || !word.g[i] ? (word.g[i] = pick()) : word.g[i]), (col + i) * CELL, row * CELL);
        }
        if (s) { word.t += (t < 1 ? 0.06 : t < 2 ? 0.018 : 0.05) * s; if (word.t >= 3) word = null; }
      }
      ctx!.globalAlpha = 1;
    }
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      // 60fps ceiling: on 120/144Hz screens this settles into every other frame, still smooth, half the draw cost
      if (last && t - last < 1000 / 65) return;
      // clamp so a stalled frame (tab switch, GC) doesn't teleport the drops
      const s = last ? Math.min(t - last, 100) / (1000 / 30) : 1;
      last = t;
      if (!word && t > nextWord) { newWord(); nextWord = t + 3800 + Math.random() * 2000; }
      draw(s);
    }
    function sync() {
      const want = visible && !document.hidden && !still.matches;
      if (want && !running) { running = true; last = 0; raf = requestAnimationFrame(loop); }
      if (!want && running) { running = false; cancelAnimationFrame(raf); }
      if (!want) { if (!word) { newWord(); if (word) (word as { t: number }).t = 1.5; } draw(0); }
    }
    const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) / CELL; my = (e.clientY - r.top) / CELL; };
    const onResize = () => { seed(); draw(0); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
    const mo = new MutationObserver(() => { readColors(); draw(0); });

    seed(); draw(0); sync();
    io.observe(cv);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
    document.fonts?.ready.then(() => draw(0));
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); mo.disconnect();
      removeEventListener("pointermove", onMove); removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync); still.removeEventListener("change", sync);
    };
  }, []);

  return <div className="rain" aria-hidden="true"><canvas ref={ref} /></div>;
}
