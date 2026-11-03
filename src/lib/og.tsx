import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#141414", CARD = "#191919", WHITE = "#f2f2f2", SOFT = "#c9c9c9", MUTE = "#9c9c9c", MINT = "#6fe0bd", RULE = "#292929";
const GLYPHS = "ｱｲｳｴｵｶｷｸｹ0123456789{}[]<>/=+*#λ";

/** Geist from Google Fonts as TTF (Satori can't read woff2). Cached per build. */
const fontCache = new Map<number, Promise<ArrayBuffer | null>>();
function geist(weight: number) {
  if (!fontCache.has(weight)) {
    fontCache.set(weight, (async () => {
      try {
        const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`, { headers: { "User-Agent": "Mozilla/4.0" } })).text();
        const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
        return url ? await (await fetch(url)).arrayBuffer() : null;
      } catch { return null; }
    })());
  }
  return fontCache.get(weight)!;
}
async function fonts() {
  const [w5, w7] = await Promise.all([geist(500), geist(700)]);
  return [
    ...(w5 ? [{ name: "Geist", data: w5, weight: 500 as const, style: "normal" as const }] : []),
    ...(w7 ? [{ name: "Geist", data: w7, weight: 700 as const, style: "normal" as const }] : []),
  ];
}

/** Deterministic token-rain columns, a faint texture on the right edge. */
function rainLayer({ from = 760, cols = 20, strength = 0.45 }: { from?: number; cols?: number; strength?: number } = {}) {
  let seed = 11;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  return (
    <>
      {Array.from({ length: cols }, (_, i) => {
        const len = 6 + Math.floor(rnd() * 12), top = Math.floor(rnd() * 420) - 60, o = (0.12 + rnd() * 0.5) * strength;
        return (
          <div key={i} style={{ position: "absolute", left: from + i * 22, top, display: "flex", flexDirection: "column", fontSize: 17, lineHeight: "21px", color: MINT, opacity: o, fontFamily: "monospace" }}>
            {Array.from({ length: len }, (_, j) => <span key={j} style={{ opacity: (j + 1) / len, color: j === len - 1 ? "#e8fff7" : MINT }}>{GLYPHS[Math.floor(rnd() * GLYPHS.length)]}</span>)}
          </div>
        );
      })}
      <div style={{ position: "absolute", inset: 0, display: "flex", background: `linear-gradient(90deg, ${INK} 0%, ${INK} 58%, rgba(20,20,20,0.6) 82%, rgba(20,20,20,0.85) 100%)` }} />
    </>
  );
}

/** Home / profile card: photo, name, roles, one-line pitch, scale figures. */
export async function ogProfile({ name, roles, pitch, photo, stats }: { name: string; roles: string[]; pitch: string; photo: string; stats: { value: string; label: string }[] }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, padding: "60px 72px", position: "relative", fontFamily: "Geist" }}>
        {rainLayer()}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 13, height: 13, borderRadius: 4, background: MINT, boxShadow: `0 0 18px ${MINT}` }} />
          <span style={{ color: WHITE, fontSize: 26, fontWeight: 700 }}>triptex.</span>
          <span style={{ color: MUTE, fontSize: 22, marginLeft: 10, fontWeight: 500 }}>triptex.me</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} width={168} height={168} style={{ borderRadius: 40, border: `2px solid ${RULE}`, objectFit: "cover" }} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", fontSize: 66, fontWeight: 700, letterSpacing: "-0.035em", color: WHITE, lineHeight: 1 }}>{name}</div>
            <div style={{ display: "flex", gap: 14, fontSize: 26, fontWeight: 500, color: MINT }}>
              {roles.map((r, i) => <span key={r} style={{ display: "flex", gap: 14 }}>{i > 0 && <span style={{ color: MUTE }}>·</span>}{r}</span>)}
            </div>
            <div style={{ display: "flex", fontSize: 27, fontWeight: 500, color: SOFT, maxWidth: 760, lineHeight: 1.3 }}>{pitch}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {stats.map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "14px 22px", borderRadius: 16, border: `1px solid ${RULE}`, background: CARD }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: MINT, letterSpacing: "-0.02em" }}>{s.value}</span>
              <span style={{ fontSize: 18, color: MUTE, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** Article card: kicker, title, byline. */
export async function ogImage({ kicker, title, accent, footer }: { kicker: string; title: string; accent?: string; footer: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, padding: "64px 72px", position: "relative", fontFamily: "Geist" }}>
        {rainLayer({ from: 700, cols: 24, strength: 0.8 })}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 13, height: 13, borderRadius: 4, background: MINT, boxShadow: `0 0 18px ${MINT}` }} />
          <span style={{ color: WHITE, fontSize: 26, fontWeight: 700 }}>triptex.</span>
          <span style={{ color: MINT, fontSize: 20, marginLeft: 12, fontWeight: 500, border: `1px solid ${RULE}`, borderRadius: 999, padding: "4px 14px" }}>{kicker}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 840, fontSize: title.length > 60 ? 56 : 66, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: WHITE }}>
          {title}{accent ? <span style={{ color: MINT, marginLeft: 16 }}>{accent}</span> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${RULE}`, paddingTop: 22, color: MUTE, fontSize: 22, fontWeight: 500 }}>
          <span>{footer}</span><span style={{ color: WHITE }}>triptex.me</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
