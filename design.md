# Design · triptex.me

The locked design system for Afshin Nahian Tripto's portfolio. Every change to the site reads this
file first. Extend or amend it when the system needs to grow; do not redesign page by page.

Tokens live in `src/styles/site.css` (`:root` = dark, the default; `[data-theme="light"]` = light).
Components reference tokens by name, never raw colors or font names.

## Genre and tone

Modern-minimal, editorial calm. One reading column, dense index rows, a single ambient motion moment
(the token rain) and one data moment (the GitHub heatmap). Professional, specific, a little playful in
the micro-interactions, never loud.

Antislop dials: **ENERGY 2 / RHYTHM 2 / MOTION 2**.

## Layout

- One column, `max-width: 872px`, 16px minimum side gutter (safe-area aware).
- Page order: floating nav card → hero → Activity → What I do (bento) → Work → Projects → Writing →
  Log → Education → Certifications → contact CTA → footer.
- Section heads: icon (data color) + title at 19px, an optional quiet aside on the right. No numbered
  eyebrows, no uppercase kickers.
- Rows, not cards, for lists (projects, education, certifications, writing): hairline dividers, hover
  turns the title and divider to the data color.
- Cards only where content is a self-contained object: work entries, bento tiles, the GitHub card,
  the contact CTA.

## Color

Two-tone: white carries the UI, mint carries data and status.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--paper` | `#141414` (Onyx) | `oklch(99.2% 0 0)` | page background |
| `--paper-2` | `#1d1d1d` | `oklch(96.6% .002 150)` | chips, hover fills |
| `--card` | `#191919` | `#fff` | cards |
| `--rule` | `#292929` | `oklch(91% .003 150)` | hairlines, borders |
| `--ink` / `--ink-2` / `--mute` | `#f2f2f2` / `#c9c9c9` / `#9c9c9c` | near-black scale | text |
| `--accent` | `oklch(96% 0 0)` white | `#141414` | primary buttons, focus ring |
| `--viz` | `oklch(82% .12 168)` mint | `oklch(52% .12 168)` | heatmap, stats, status dots, highlighted headline words, icon tiles |
| `--h0..--h4` | mint ramp | mint ramp | heatmap levels |
| `--rain`, `--rain-head` | mint | mint | token rain |

Rules: never introduce a third hue. Semantic colors (error, warning) only if a real state needs one.

## Typography

- Display and body: **Geist** (`next/font`), 600 for headings, 400/500 for text. Chosen over the
  curlier Bricolage after review.
- Mono: **JetBrains Mono** for dates, counts, kbd hints and the rain only.
- Hero name 26px; rotating headline `clamp(28px, 4.6vw, 42px)`, `letter-spacing: -.035em`, max 26ch;
  body 15.5px / 1.6; section titles 19px.
- Headings are always roman. Emphasis is carried by the data color, never italics.

## Motion

Easing: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. UI transitions 120–250ms; only `transform`,
`opacity`, `filter` and color are animated.

| Moment | Behavior |
|---|---|
| Token rain | Katakana + code glyphs, one row decodes into an agent call every ~4s, cursor brightens nearby columns. Canvas, 30fps cap, paused off screen / hidden tab, static for reduced motion, lighter on phones. |
| Headline | Rotates through six lines; words blur-rise in with a 45ms stagger, hold ~4.2s. Box reserves the tallest line. |
| Hero entrance | Children stagger in on load (55ms). |
| Section reveal | Sections below the first screen fade up once (never hidden without JS). |
| Bento | Cursor spotlight; per-card loops (badge flip, scope → cut → ship, Human/Agent/MCP, chip wave, uptime bars, Form → n8n → Slack flow). |
| Dialogs | Search, work details and photo: short scale + fade in with `@starting-style`. |
| Press | Buttons scale to .97 on `:active`. |

All of it respects `prefers-reduced-motion: reduce` (movement removed, opacity/color kept). Hover
effects are gated behind `(hover: hover)`; touch screens get in-view versions.

## Components and voice

- Primary CTA: filled with `--accent` ("Resume", "Email me"). Secondary: outlined chip. Profiles are
  icon-only buttons with a hover label. Copy is specific: "View details", "All writing", "Get in touch".
- Search: Ctrl K / ⌘ K (label follows the OS), keyboard-driven.
- Work: card per role with logo, blurb and tags; "View details" opens a modal whose write-up is
  lazy-loaded. Ownership labels are only Sole engineer, Lead engineer or Contributor. No commit counts.
  Clients are described generically.
- Writing: newest three on home, `/writing` archive by year with topic filters, `/writing/<slug>`
  article pages. Press pieces link out with a "Press · Source" label; their text is never republished.
- Copy: first person, plain and specific. No em dashes, no buzzwords, no invented numbers.

## Agent surface

The site is AI-native too: `/llms.txt`, `/llms-full.txt`, `/agents.md`, `/writing/<slug>.md`, and
markdown for `Accept: text/markdown`. Person and BlogPosting JSON-LD on every page. robots.txt allows
answer-time AI agents and disallows training crawlers.

## Performance budget

Static pages, ISR every 6h for GitHub data (snapshot fallback when the API is down or no token).
Targets on a throttled mobile profile: LCP < 2.5s, CLS < 0.05, INP < 200ms, Lighthouse ≥ 90 across
the board.
