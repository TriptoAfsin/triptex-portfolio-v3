"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Icon, type IconId } from "./icons";
import { closeDialog, onCancelAnimated } from "./close-dialog";

export type SearchItem = { label: string; hint: string; icon: IconId; href: string; external?: boolean; keywords?: string };

const subscribe = () => () => {};
const isMac = () => /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);

/** Floating nav card with Ctrl/⌘ K search and the theme toggle. */
export function SiteHeader({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const mac = useSyncExternalStore(subscribe, isMac, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="nav">
        <Link className="mark" href="/#top" aria-label="Afshin Nahian Tripto, home"><i aria-hidden="true" />triptex.</Link>
        <nav aria-label="Sections">
          <Link href="/#work">Work</Link><Link href="/#projects">Projects</Link><Link href="/blog">Blog</Link><Link href="/#contact">Contact</Link>
        </nav>
        <button className="kbtn" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}>
          <Icon id="i-search" />Search <kbd suppressHydrationWarning>{mac ? "⌘ K" : "Ctrl K"}</kbd>
        </button>
        <button className="iconbtn theme" type="button" aria-label="Switch color theme" onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}>
          <Icon id="i-moon" className="moon" /><Icon id="i-sun" className="sun" />
        </button>
      </header>
      {open && <CommandPalette items={items} onClose={() => setOpen(false)} />}
    </>
  );
}

function CommandPalette({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const hits = useMemo(() => { const s = q.trim().toLowerCase(); return s ? items.filter(i => `${i.label} ${i.hint} ${i.keywords ?? ""}`.toLowerCase().includes(s)) : items; }, [q, items]);

  useEffect(() => { const d = ref.current; d?.showModal(); return () => d?.close(); }, []);

  const run = (it?: SearchItem) => {
    if (!it) return;
    onClose();
    if (it.external || it.href.startsWith("mailto:")) window.open(it.href, it.href.startsWith("mailto:") ? "_self" : "_blank", "noopener");
    else router.push(it.href);
  };

  return (
    <dialog ref={ref} className="cmd" aria-label="Search the site" onClose={onClose} onCancel={onCancelAnimated} onClick={e => { if (e.target === ref.current) closeDialog(ref.current); }}>
      <div className="cmd-in">
        <Icon id="i-search" />
        <input autoFocus value={q} placeholder="Jump to a section, article or link" aria-controls="cmd-list" aria-activedescendant={hits.length ? `o${sel}` : undefined}
          onChange={e => { setQ(e.target.value); setSel(0); }}
          onKeyDown={e => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, hits.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
            if (e.key === "Enter") { e.preventDefault(); run(hits[sel]); }
          }} />
        <kbd>Esc</kbd>
      </div>
      <ul id="cmd-list" role="listbox" aria-label="Results">
        {hits.length ? hits.map((it, i) => (
          <li key={it.href + it.label} id={`o${i}`} role="option" aria-selected={i === sel} onMouseMove={() => setSel(i)} onClick={() => run(it)}>
            <Icon id={it.icon} fill={it.icon === "i-gh" || it.icon === "i-in" || it.icon === "i-x-logo"} />{it.label}<small>{it.hint}</small>
          </li>
        )) : <li className="empty" role="option" aria-selected="false" aria-disabled="true">Nothing matches that. Try &quot;resume&quot; or &quot;blog&quot;.</li>}
      </ul>
    </dialog>
  );
}
