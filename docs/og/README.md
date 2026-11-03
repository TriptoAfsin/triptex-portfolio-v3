# Share image previews

Snapshots of the Open Graph / X card images the site generates at build time (1200×630 PNG).
The live versions are produced by `src/app/**/opengraph-image.tsx` with the shared layouts in
`src/lib/og.tsx`; these files are only previews and are not served by the site.

| File | Used for |
|---|---|
| `home.png` | `https://triptex.me` (also the X card) |
| `writing.png` | `https://triptex.me/writing` |
| `article-*.png` | each article, generated per post |

To check how a link unfurls after deploying:

- Facebook / WhatsApp / Instagram: https://developers.facebook.com/tools/debug/ (click "Scrape Again")
- LinkedIn: https://www.linkedin.com/post-inspector/
- X: paste the link into a draft post (the old Card Validator preview was retired)
- Slack and Discord: paste the link in a message; they re-fetch after their cache expires

Regenerate these previews after a design change with `npm run build` and copy
`.next/server/app/**/opengraph-image.body` over the files here.
