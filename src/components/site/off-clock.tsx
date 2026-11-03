"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./icons";

/**
 * Easter egg: a small "Off the clock" tab slides in from the bottom-left once the
 * contact section is on screen. Clicking it opens a native popover, which gives us
 * Esc and click-outside dismissal for free.
 */
export function OffClock({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <button type="button" className="egg-btn" data-shown={shown || undefined} inert={!shown} popoverTarget="egg" aria-label="Off the clock: what I do outside work">
        <Icon id="i-game" /><span>Off the clock</span>
      </button>
      <div id="egg" popover="auto" className="egg" role="dialog" aria-labelledby="egg-t">
        <div className="egg-h">
          <h2 id="egg-t"><Icon id="i-game" />Off the clock</h2>
          <button type="button" className="egg-x" popoverTarget="egg" popoverTargetAction="hide" aria-label="Close"><Icon id="i-x" /></button>
        </div>
        {children}
      </div>
    </>
  );
}
