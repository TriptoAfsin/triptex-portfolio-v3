"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789{}[]<>/=+*#$%ΣΔλ∂";
const WORDS = ["agent.plan()", "retrieve(ctx)", "memory.write()", "tool_call", "embed(doc)", "ship()", "await queue", "rerank(k=8)"];

/**
 * The hero's token rain: columns of glyphs fall and, every few seconds, one row decodes into an
 * agent call. Canvas only, capped at 30fps, paused off screen and in hidden tabs, drawn once and held
 * still for reduced motion. Phones get bigger cells (fewer glyphs) and a 1.5x resolution cap.
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
    let word: { w: string; row: number; col: number; t: number } | null = null;
    let mx = -999, my = -999, last = 0, nextWord = 0, raf = 0, running = false, visible = true;
    const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    let rain = "", head = "";
    const readColors = () => { const s = getComputedStyle(document.documentElement); rain = s.getPropertyValue("--rain").trim(); head = s.getPropertyValue("--rain-head").trim(); };

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
      word = { w, row: 2 + ((Math.random() * Math.max(1, rows - 4)) | 0), col: Math.max(1, ((cols - w.length) * (0.45 + Math.random() * 0.45)) | 0), t: 0 };
    }
    function draw(step: boolean) {
      if (!W) return;
      ctx!.clearRect(0, 0, W, H);
      ctx!.font = `500 ${CELL - 2}px ${getComputedStyle(cv!).getPropertyValue("--f-mono") || "monospace"}`;
      ctx!.textBaseline = "top";
      for (let c = 0; c < cols; c++) {
        const d = drops[c], near = Math.max(0, 1 - Math.hypot(c - mx, d.y - my) / 8);
        if (step) {
          d.y += d.v * (1 + near * 2);
          if (d.y > rows + 14) { d.y = rnd(-12, -2); d.v = rnd(0.18, 0.53); }
          if (Math.random() < 0.03) d.trail[(Math.random() * rows) | 0] = pick();
        }
        const hy = Math.floor(d.y);
        for (let k = 0; k < TRAIL; k++) {
          const y = hy - k; if (y < 0 || y >= rows) continue;
          if (word && y === word.row && c >= word.col && c < word.col + word.w.length) continue;
          ctx!.globalAlpha = k === 0 ? 0.95 : Math.max(0, (1 - k / TRAIL) * (0.5 + near * 0.5));
          ctx!.fillStyle = k === 0 ? head : rain;
          ctx!.fillText(d.trail[y], c * CELL, y * CELL);
        }
      }
      if (word) {
        const { w, row, col, t } = word;
        for (let i = 0; i < w.length; i++) {
          const solved = t < 1 ? Math.random() < t : t < 2 ? true : Math.random() > t - 2;
          ctx!.globalAlpha = t > 2.6 ? Math.max(0, (3 - t) / 0.4) : 1;
          ctx!.fillStyle = solved ? head : rain;
          ctx!.fillText(solved ? w[i] : pick(), (col + i) * CELL, row * CELL);
        }
        if (step) { word.t += t < 1 ? 0.06 : t < 2 ? 0.018 : 0.05; if (word.t >= 3) word = null; }
      }
      ctx!.globalAlpha = 1;
    }
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / 30) return;
      last = t;
      if (!word && t > nextWord) { newWord(); nextWord = t + 3800 + Math.random() * 2000; }
      draw(true);
    }
    function sync() {
      const want = visible && !document.hidden && !still.matches;
      if (want && !running) { running = true; raf = requestAnimationFrame(loop); }
      if (!want && running) { running = false; cancelAnimationFrame(raf); }
      if (!want) { if (!word) { newWord(); if (word) (word as { t: number }).t = 1.5; } draw(false); }
    }
    const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) / CELL; my = (e.clientY - r.top) / CELL; };
    const onResize = () => { seed(); draw(false); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
    const mo = new MutationObserver(() => { readColors(); draw(false); });

    seed(); draw(false); sync();
    io.observe(cv);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);
    still.addEventListener("change", sync);
    document.fonts?.ready.then(() => draw(false));
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); mo.disconnect();
      removeEventListener("pointermove", onMove); removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync); still.removeEventListener("change", sync);
    };
  }, []);

  return <div className="rain" aria-hidden="true"><canvas ref={ref} /></div>;
}
