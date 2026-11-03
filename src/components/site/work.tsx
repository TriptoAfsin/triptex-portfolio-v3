"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { WorkCard, WorkDetail } from "@/data/site";
import { Icon } from "./icons";

type Card = Omit<WorkCard, "detail"> & { hasDetail: boolean };

/** Work cards; "View details" opens a modal whose write-up is loaded only when asked for. */
export function Work({ cards }: { cards: Card[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<{ card: Card; detail: WorkDetail | null } | null>(null);

  async function show(card: Card) {
    setOpen({ card, detail: null });
    dlg.current?.showModal();
    const mod = await import(`@/data/work/${card.key}.json`);
    setOpen({ card, detail: mod.default as WorkDetail });
  }

  return (
    <>
      <div className="jobs">
        {cards.map(w => (
          <article className="job" key={w.key}>
            {w.logo ? <Image className="logo" src={w.logo} alt={`${w.company} logo`} width={44} height={44} sizes="44px" unoptimized={/\.(svg|ico)$/.test(w.logo)} />
              : <span className="logo mono">{w.company.slice(0, 2)}</span>}
            <div>
              <div className="job-h"><h3>{w.company}{w.partTime && <span className="part">Part-time</span>}</h3><span className="when">{w.when}</span></div>
              <div className="r">{w.role} · {w.place}</div>
              <p className="d">{w.blurb}</p>
              <div className="foot">
                <div className="tags">{w.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
                {w.hasDetail && <button className="more-btn" type="button" aria-haspopup="dialog" onClick={() => show(w)}>View details<Icon id="i-right" /></button>}
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog ref={dlg} className="wk" aria-labelledby="wk-title" onClose={() => setOpen(null)} onClick={e => { if (e.target === dlg.current) dlg.current?.close(); }}>
        {open && (
          <>
            <div className="wk-h">
              {open.card.logo && <Image src={open.card.logo} alt="" width={40} height={40} sizes="40px" unoptimized={/\.(svg|ico)$/.test(open.card.logo)} />}
              <div><h3 id="wk-title">{open.card.company}</h3><p>{open.card.role} · {open.card.when}</p></div>
              <button className="wk-x" type="button" aria-label="Close details" onClick={() => dlg.current?.close()}><Icon id="i-x" /></button>
            </div>
            <div className="wk-b">
              {!open.detail ? <p className="wk-loading">Loading the details…</p> : <Detail d={open.detail} />}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

function List({ items }: { items?: string[] }) {
  return items?.length ? <ul>{items.map(x => <li key={x}>{x}</li>)}</ul> : null;
}

function Detail({ d }: { d: WorkDetail }) {
  return (
    <>
      {d.summary && <p>{d.summary}</p>}
      {d.projects?.map(p => (
        <div className="wk-p" key={p.title}>
          <h4>{p.title}{p.ownership && <small>{p.ownership}</small>}</h4>
          {(p.client || p.period) && <div className="meta">{[p.client, p.period].filter(Boolean).join(" · ")}</div>}
          {p.what && <p>{p.what}</p>}
          <List items={p.built} />
          {p.stack?.length ? <div className="tags">{p.stack.map(t => <span className="tag" key={t}>{t}</span>)}</div> : null}
        </div>
      ))}
      {d.ai?.length ? <div className="wk-p"><h4>AI engineering</h4><List items={d.ai} /></div> : null}
      {d.operations?.length ? <div className="wk-p"><h4>Running it in production</h4><List items={d.operations} /></div> : null}
    </>
  );
}
