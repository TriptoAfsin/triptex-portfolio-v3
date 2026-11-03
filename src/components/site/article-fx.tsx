"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { closeDialog, onCancelAnimated } from "./close-dialog";

/**
 * Article enhancements, mounted once per post:
 * - Mermaid diagrams: the library is loaded only when the post has a diagram, themed to match the site,
 *   and re-drawn when the theme changes. Diagrams scroll inside their own box on narrow screens.
 * - Zoom viewer: article images and diagrams open in a viewer you can zoom (wheel, pinch, buttons,
 *   + / - / 0 keys, double-click) and drag around. Esc, the close button or a click outside closes it.
 */
export function ArticleFx() {
  const { resolvedTheme } = useTheme();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const blocks = [...document.querySelectorAll<HTMLElement>(".md-body pre.mermaid")];
    if (!blocks.length) return;
    let cancelled = false;
    blocks.forEach(b => { if (!b.dataset.src) b.dataset.src = b.textContent ?? ""; b.removeAttribute("data-processed"); b.textContent = b.dataset.src; });
    (async () => {
      const { default: mermaid } = await import("mermaid");
      if (cancelled) return;
      // Mermaid only understands hex/rgb, and browsers report oklch tokens as lab(); resolve each to hex via canvas
      const css = getComputedStyle(document.documentElement);
      const cv = document.createElement("canvas"); cv.width = cv.height = 1;
      const cx = cv.getContext("2d", { willReadFrequently: true })!;
      const v = (n: string) => {
        const raw = css.getPropertyValue(n).trim();
        if (n.startsWith("--f-")) return raw;
        cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = raw; cx.fillRect(0, 0, 1, 1);
        const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
      };
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        fontFamily: v("--f-body"),
        themeVariables: {
          background: v("--card"), primaryColor: v("--paper-2"), primaryBorderColor: v("--rule"), primaryTextColor: v("--ink"),
          secondaryColor: v("--card"), tertiaryColor: v("--paper-2"), lineColor: v("--viz"), textColor: v("--ink-2"),
          clusterBkg: v("--card"), clusterBorder: v("--rule"), edgeLabelBackground: v("--card"), fontSize: "14px",
        },
        flowchart: { curve: "basis", padding: 12, useMaxWidth: true },
      });
      await mermaid.run({ nodes: blocks });
      // a zoom button on each drawn diagram
      blocks.forEach(b => {
        const fig = b.closest("figure");
        if (!fig || fig.querySelector(".mmd-zoom")) return;
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "mmd-zoom"; btn.setAttribute("aria-label", "Zoom diagram");
        btn.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-expand"/></svg>';
        fig.append(btn);
      });
    })();
    return () => { cancelled = true; };
  }, [resolvedTheme]);

  useEffect(() => {
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement;
      const el = t.closest<HTMLImageElement>(".md-body figure img");
      if (el) { setItem({ kind: "img", src: el.currentSrc || el.src, alt: el.alt }); return; }
      const fig = t.closest<HTMLElement>(".md-body figure.mmd");
      const svg = fig?.querySelector("pre.mermaid svg");
      if (svg) setItem({ kind: "svg", html: svg.outerHTML, alt: fig?.querySelector("figcaption")?.textContent || "Diagram" });
    };
    const body = document.querySelector(".md-body");
    body?.addEventListener("click", onClick);
    return () => body?.removeEventListener("click", onClick);
  }, []);

  return <Zoomer item={item} onClosed={() => setItem(null)} />;
}

type Item = { kind: "img"; src: string; alt: string } | { kind: "svg"; html: string; alt: string };
const MIN = 0.5, MAX = 6;

function Zoomer({ item, onClosed }: { item: Item | null; onClosed: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0 });
  const [pct, setPct] = useState(100);

  // the transform is written straight to the element, so drags and wheel zoom never re-render
  const apply = useCallback((smooth = false) => {
    const el = layer.current; if (!el) return;
    const { s, x, y } = view.current;
    el.style.transition = smooth ? "transform .22s cubic-bezier(.23,1,.32,1)" : "none";
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    setPct(Math.round(s * 100));
  }, []);
  // zoom while keeping the point (px, py), relative to the stage centre, where it is
  const zoomAt = useCallback((factor: number, px = 0, py = 0, smooth = false) => {
    const v = view.current;
    const s = Math.min(MAX, Math.max(MIN, v.s * factor)), k = s / v.s;
    v.x = px - (px - v.x) * k; v.y = py - (py - v.y) * k; v.s = s;
    apply(smooth);
  }, [apply]);
  const reset = () => { view.current = { s: 1, x: 0, y: 0 }; apply(true); };
  const local = useCallback((cx: number, cy: number) => {
    const r = stage.current!.getBoundingClientRect();
    return [cx - r.left - r.width / 2, cy - r.top - r.height / 2] as const;
  }, []);

  useEffect(() => {
    if (!item) return;
    view.current = { s: 1, x: 0, y: 0 }; apply();
    dlg.current?.showModal();
  }, [item, apply]);

  useEffect(() => {
    const el = stage.current; if (!el || !item) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * 0.0015), ...local(e.clientX, e.clientY)); };
    const pts = new Map<number, { x: number; y: number }>();
    let last: { d: number; mx: number; my: number } | null = null;
    const down = (e: PointerEvent) => { el.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); last = null; el.classList.add("is-drag"); };
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId); if (!p) return;
      if (pts.size === 1) { view.current.x += e.clientX - p.x; view.current.y += e.clientY - p.y; apply(); }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (last) { view.current.x += mx - last.mx; view.current.y += my - last.my; zoomAt(d / last.d, ...local(mx, my)); }
        last = { d, mx, my };
      }
    };
    const up = (e: PointerEvent) => { pts.delete(e.pointerId); last = null; if (!pts.size) el.classList.remove("is-drag"); };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("wheel", onWheel); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
    };
  }, [item, apply, zoomAt, local]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(1.25, 0, 0, true); }
    else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomAt(0.8, 0, 0, true); }
    else if (e.key === "0") { e.preventDefault(); reset(); }
  };

  const label = item?.alt || (item?.kind === "svg" ? "Diagram" : "Image");
  return (
    <dialog ref={dlg} className="zoomer" aria-label={label} onClose={onClosed} onCancel={onCancelAnimated} onKeyDown={onKey}
      onClick={e => { if (e.target === dlg.current) closeDialog(dlg.current); }}>
      {item && (
        <>
          <div className="zm-bar">
            <span className="zm-t">{label}</span>
            <div className="zm-ctl">
              <button type="button" aria-label="Zoom out" onClick={() => zoomAt(0.8, 0, 0, true)}><svg className="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg></button>
              <output aria-live="polite">{pct}%</output>
              <button type="button" aria-label="Zoom in" onClick={() => zoomAt(1.25, 0, 0, true)}><svg className="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
              <button type="button" aria-label="Reset zoom" onClick={reset}><svg className="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></svg></button>
              <button type="button" className="zm-x" aria-label="Close" onClick={() => closeDialog(dlg.current)}><svg className="i" aria-hidden="true"><use href="#i-x" /></svg></button>
            </div>
          </div>
          <div ref={stage} className="zm-stage" onDoubleClick={e => { if (view.current.s > 1.01) reset(); else zoomAt(2, ...local(e.clientX, e.clientY), true); }}>
            <div ref={layer} className={`zm-layer ${item.kind}`}>
              {item.kind === "img"
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={item.src} alt={item.alt} draggable={false} />
                : <div className="zm-svg" dangerouslySetInnerHTML={{ __html: item.html }} />}
            </div>
          </div>
          <p className="zm-hint">Scroll or pinch to zoom · drag to move · double-click to zoom in</p>
        </>
      )}
    </dialog>
  );
}
