"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { closeDialog, onCancelAnimated } from "./close-dialog";

/**
 * Article enhancements, mounted once per post:
 * - Mermaid diagrams: the library is loaded only when the post has a diagram, themed to match the site,
 *   and re-drawn when the theme changes. Diagrams scroll inside their own box on narrow screens.
 * - Image lightbox: any article image opens full-size; Esc or a click outside closes it.
 */
export function ArticleFx() {
  const { resolvedTheme } = useTheme();
  const [img, setImg] = useState<{ src: string; alt: string } | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);

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
    })();
    return () => { cancelled = true; };
  }, [resolvedTheme]);

  useEffect(() => {
    const onClick = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLImageElement>(".md-body figure img");
      if (!el) return;
      setImg({ src: el.currentSrc || el.src, alt: el.alt });
    };
    const body = document.querySelector(".md-body");
    body?.addEventListener("click", onClick);
    return () => body?.removeEventListener("click", onClick);
  }, []);

  useEffect(() => { if (img) dlg.current?.showModal(); }, [img]);

  return (
    <dialog ref={dlg} className="lightbox" aria-label={img?.alt || "Image"} onClose={() => setImg(null)} onCancel={onCancelAnimated} onClick={() => closeDialog(dlg.current)}>
      {img && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt={img.alt} />
          {img.alt && <p>{img.alt}</p>}
          <button className="wk-x" type="button" aria-label="Close image" onClick={e => { e.stopPropagation(); closeDialog(dlg.current); }}>
            <svg className="i" aria-hidden="true"><use href="#i-x" /></svg>
          </button>
        </>
      )}
    </dialog>
  );
}
