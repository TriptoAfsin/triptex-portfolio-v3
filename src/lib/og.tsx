import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#141414", WHITE = "#f2f2f2", MUTE = "#9c9c9c", MINT = "#6fe0bd", RULE = "#292929";
const GLYPHS = "ｱｲｳｴｵｶｷｸｹ0123456789{}[]<>/=+*#λ";

/** Deterministic "token rain" columns so every OG image matches the site's hero. */
function rainColumns() {
  const cols = [] as { x: number; chars: string[]; top: number; o: number }[];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 26; i++) {
    const len = 6 + Math.floor(rnd() * 12);
    cols.push({ x: 640 + i * 22, top: Math.floor(rnd() * 380) - 60, o: 0.15 + rnd() * 0.5, chars: Array.from({ length: len }, () => GLYPHS[Math.floor(rnd() * GLYPHS.length)]) });
  }
  return cols;
}

/** Shared OG card: onyx base, white type, mint for the one highlighted phrase. */
export function ogImage({ kicker, title, accent, footer }: { kicker: string; title: string; accent?: string; footer: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, padding: "64px 72px", position: "relative", fontFamily: "sans-serif" }}>
        {rainColumns().map((c, i) => (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.top, display: "flex", flexDirection: "column", fontSize: 18, lineHeight: "22px", color: MINT, opacity: c.o, fontFamily: "monospace" }}>
            {c.chars.map((ch, j) => <span key={j} style={{ opacity: (j + 1) / c.chars.length, color: j === c.chars.length - 1 ? "#e8fff7" : MINT }}>{ch}</span>)}
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, #141414 0%, #141414 46%, rgba(20,20,20,0.55) 75%, rgba(20,20,20,0.85) 100%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: MINT, boxShadow: `0 0 18px ${MINT}` }} />
          <span style={{ color: WHITE, fontSize: 28, fontWeight: 700 }}>tripto.</span>
          <span style={{ color: MUTE, fontSize: 24, marginLeft: 12 }}>{kicker}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: title.length > 60 ? 58 : 70, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", color: WHITE }}>
            {title}{accent ? <span style={{ color: MINT, marginLeft: 16 }}>{accent}</span> : null}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${RULE}`, paddingTop: 22, color: MUTE, fontSize: 24 }}>
          <span>{footer}</span><span style={{ color: WHITE }}>triptex.me</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
