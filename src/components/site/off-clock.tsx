"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";
import { closeDialog, onCancelAnimated } from "./close-dialog";

const HEAD = "M18 64 C18 46 24 36 30 31 L27 7 L50 22 C56 20 64 20 70 22 L93 7 L90 31 C96 36 102 46 102 64 C102 90 84 106 60 106 C36 106 18 90 18 64 Z";

/**
 * Easter egg: once the footer scrolls into view, a small cat leans in from the
 * bottom-right corner and says psst. Tapping it opens a centered modal with the
 * "Off the clock" note. Its idle moves (blink, head tilt, ear flick, tail swish)
 * play on their own, so nothing depends on hover. It ducks away when the footer
 * leaves the screen.
 */
export function OffClock({ children }: { children: ReactNode }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { rootMargin: "0px 0px 40px 0px" });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const open = () => { setSeen(true); dlg.current?.showModal(); };

  return (
    <>
      <button type="button" className="cat" data-shown={shown || undefined} data-seen={seen || undefined} inert={!shown}
        aria-haspopup="dialog" aria-label="Off the clock: what I do outside work" onClick={open}>
        <span className="cat-bub" aria-hidden="true">psst, I have a life too</span>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <g className="cat-bod">
            <path className="cat-det cat-tail" d="M100 104 C114 98 116 82 108 74" />
            <path className="cat-line" d={HEAD} />
            <path className="cat-glint" pathLength={100} d={HEAD} />
            <path className="cat-pink" d="M35 14 L33 29 L44 24 Z" />
            <path className="cat-pink cat-ear" d="M85 14 L87 29 L76 24 Z" />
            <g className="cat-eyes">
              <ellipse className="cat-eye" cx="44" cy="62" rx="7" ry="8.5" /><ellipse className="cat-eye" cx="76" cy="62" rx="7" ry="8.5" />
              <circle className="cat-hl" cx="46.5" cy="59" r="2.4" /><circle className="cat-hl" cx="78.5" cy="59" r="2.4" />
            </g>
            <ellipse className="cat-blush" cx="33" cy="78" rx="7" ry="4" /><ellipse className="cat-blush" cx="87" cy="78" rx="7" ry="4" />
            <path className="cat-pink" d="M56 72 L64 72 L60 77 Z" />
            <path className="cat-det" d="M53 80 Q56.5 84 60 80 Q63.5 84 67 80" />
            <path className="cat-det" d="M14 70 L28 72 M14 78 L28 77 M106 70 L92 72 M106 78 L92 77" />
            <ellipse className="cat-line" cx="40" cy="108" rx="12" ry="8" /><ellipse className="cat-line" cx="80" cy="108" rx="12" ry="8" />
            <path className="cat-det" d="M36 106 L36 110 M44 106 L44 110 M76 106 L76 110 M84 106 L84 110" />
          </g>
        </svg>
      </button>
      <dialog ref={dlg} className="egg-dlg" aria-labelledby="egg-t" onCancel={onCancelAnimated} onClick={e => { if (e.target === dlg.current) closeDialog(dlg.current); }}>
        <div className="egg-h">
          <span className="egg-ic"><Icon id="i-game" /></span>
          <h2 id="egg-t">Off the clock</h2>
          <button type="button" className="wk-x" aria-label="Close" onClick={() => closeDialog(dlg.current)}><Icon id="i-x" /></button>
        </div>
        {children}
      </dialog>
    </>
  );
}
