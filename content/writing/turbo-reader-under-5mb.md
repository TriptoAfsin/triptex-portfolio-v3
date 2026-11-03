---
title: "Building an RSS reader that fits under 5 MB"
slug: turbo-reader-under-5mb
date: 2026-10-24
summary: "How I built Turbo Reader with a Rust core, SQLite and Tauri 2, kept the installer under 5 MB, and what broke along the way."
readingMinutes: 8
tags: [rust, tauri, sqlite, desktop, rss]
cover: /writing/turbo-reader-under-5mb/1.webp
---

I read a lot of feeds, and the readers I tried got slower the more I used them. My library would grow, startup would drag, and eventually one malformed article would leave me staring at a blank window. So at t21 dev I built my own. Turbo Reader is a desktop RSS reader with a Rust core and a React shell, packaged with Tauri 2. The README makes three claims I hold myself to: an installer under 5 MB, a window that opens in under a second, and 20,000 articles held in a 14 MB core process. Here's how those numbers happen, and where I got it wrong first.

<figure><img src="/writing/turbo-reader-under-5mb/1.webp" alt="Turbo Reader's home view with the sidebar, article list and reader pane." width="1400" height="910" loading="lazy" decoding="async"><figcaption>Turbo Reader's home view with the sidebar, article list and reader pane.</figcaption></figure>

## The bug that picked the architecture

The project started from one specific failure. Fluent Reader, whose feature design I borrowed from openly, parsed raw feed HTML inside the renderer. The comment at the top of `feed.rs` describes what that costs: an article containing a `<geolocation>` tag made Blink instantiate the element, and the renderer process was terminated outright. The article was already stored, so the window came back blank on every launch.

You can't catch that with `try/catch` or an error boundary. When the engine kills its own renderer, your JavaScript dies with it.

That decided the shape of the app before I had picked a framework. Fetching, parsing and sanitising all happen in Rust, through `ammonia` with an explicit tag allowlist, and only clean HTML is stored. The webview renders it and does nothing else. There's a test in the repo whose whole job is to check that `<geolocation>` and `<script>` cannot survive `sanitise()`.

```
 feeds ──> reqwest (12 at a time) ──> feed-rs ──> ammonia allowlist
                                                       │
                                                       v
 React shell <── typed Tauri commands <── SQLite + FTS5 (paged)
```

Once the important work lives in a native process, Electron makes less sense. Shipping a second copy of Chromium to draw a list of headlines felt silly. Tauri 2 uses the webview the operating system already has (WebView2 on Windows, WebKit on macOS and Linux), so the binary is mostly my code.

<figure><img src="/writing/turbo-reader-under-5mb/2.webp" alt="The reading view. Fonts, width and theme are per-reader settings." width="1400" height="910" loading="lazy" decoding="async"><figcaption>The reading view. Fonts, width and theme are per-reader settings.</figcaption></figure>

## Staying under 5 MB on purpose

The size didn't just happen. It's written into `AGENTS.md` as a rule: the Windows installer must stay under 5 MB, and anyone adding dependencies, fonts or assets checks the NSIS setup file afterwards. The current table in the README says 4.7 MB for the installer and 11 MB installed.

Some of that is plain compiler settings. The release profile in `Cargo.toml` uses `opt-level = "s"`, `lto = true`, `codegen-units = 1`, `panic = "abort"` and `strip = true`. HTTP goes through `reqwest` with default features off and `rustls-tls` on, so there's no OpenSSL to bundle.

The budget also shapes product decisions. The app bundles six open-source reading fonts so reading works offline, and every one is cut down to Latin glyphs. A Bangla article renders in whatever font the OS has, and I'm fine with that trade for now. Anything new that would push the installer past 5 MB has to make room first.

## Where 14 MB comes from, and where 270 MB comes from

"14 MB" on its own would be misleading, so the README splits it out. With 500 feeds and 20,000 articles, the Rust process holding the library, the database and the fetcher uses about 14 MB. The whole app, system webview included, is around 270 MB. About half of that total is WebView2's GPU process, the page takes about 60 MB, and the app's JavaScript heap is under 5 MB.

So the webview is the expensive part, and I can't do much about that. What I can control is that the 14 MB barely moves as the library grows. That comes down to one decision: articles never get loaded into the renderer. They stay in SQLite, every list query is paged (the `list_items` command clamps its limit between 1 and 1000), and search goes through an FTS5 index.

The database setup is short:

```rust
let conn = Connection::open(path)?;
conn.pragma_update(None, "journal_mode", "WAL")?;
conn.pragma_update(None, "synchronous", "NORMAL")?;
conn.pragma_update(None, "foreign_keys", "ON")?;
conn.pragma_update(None, "busy_timeout", 5000)?;
// After a checkpoint the write-ahead log is cut back to this size. Without
// a limit it stays as large as the biggest write it ever held: 95 MB after
// importing 20,000 articles, sitting on disk next to a 92 MB database.
conn.pragma_update(None, "journal_size_limit", 8 * 1024 * 1024)?;
migrate(&conn)?;
```

That comment is a scar. I didn't know SQLite leaves the WAL file at its high-water mark until I imported a big library and found a 95 MB log sitting next to the database. Now the journal is capped at 8 MB, and any refresh that stores more than 1000 new articles runs `wal_checkpoint(TRUNCATE)` afterwards.

The FTS5 table is external-content, kept in sync with `items` by triggers, so article text isn't stored twice. Since 0.10.0 the last word matches as a prefix, so "kuber" finds "kubernetes".

## Version 0.5.0 was mostly me fixing my own slowness

I tested with small libraries at first, which was a mistake. When I loaded 500 feeds and 20,000 articles, the sidebar took over 30 seconds to appear. Every feed's unread count was walking the whole article table. The fix was one index, `idx_items_source_state` on `(source_id, read, hidden)`, and the comment in `db.rs` records the result: 32 seconds down to a millisecond. There's now a test that runs `EXPLAIN QUERY PLAN` on the sidebar query and fails if SQLite stops using that index.

The same release fixed refresh. Storing articles used to commit once per article, and refresh also waited on favicons before showing anything. Now the whole refresh is one transaction, icons fill in afterwards on their own task, and a site without an icon isn't asked again every time. Per the changelog, a first refresh of 500 local feeds went from over four minutes to about two seconds. The README now measures 0.2 s for refreshing 500 feeds from a local test server.

## Fetching feeds without hammering anyone

Feed fetching runs on Tokio with a semaphore. Refresh polls up to 12 feeds at once, and favicon lookups get their own cap of 8. Unbounded fetching would flood the connection pool, and fetching one at a time would be slow, so I picked a number and moved on.

Every request is conditional. The `sources` table stores each feed's `etag` and `last_modified`, and the fetcher sends `If-None-Match` and `If-Modified-Since`. An unchanged feed costs one `304` and no parsing at all. I got this wrong at first: a feed that answered 304 wasn't getting its `last_fetched` updated, so it looked stale forever. The fix is a three-line `UPDATE` with a comment saying "Unchanged is still checked."

Parsing goes through `feed-rs`, which covers RSS 0.9x, 1.0, 2.0, Atom and JSON Feed. The client sends a real browser User-Agent string, because FeedBurner and a few CDNs reject anything that looks like a bot. That was Fluent Reader issue #629, and it's also why two of my own feeds silently failed to import during testing.

## OPML yes, sync no

OPML import and export live in `opml.rs`, built on `quick-xml`, and they keep folder nesting in both directions.

Sync is the feature people want most. In the Fluent Reader tracker, the Feedly request alone has 87 votes. I haven't built it, and the README says why: a sync that loses your read state once is worse than no sync. Each sync service is its own integration with its own ways to corrupt someone's library, and I'd rather leave it out than ship it half done.

## Portable mode is three lines

Portable mode on Windows took less code than any other feature in the app:

```rust
pub fn portable_data_dir() -> Option<std::path::PathBuf> {
    let dir = std::env::current_exe().ok()?.parent()?.to_path_buf();
    dir.join("portable").is_file().then(|| dir.join("data"))
}
```

If a file named `portable` sits next to the exe, everything goes into a `data` folder beside it. That includes the webview's own storage, which is why the main window is built in Rust during setup instead of from `tauri.conf.json`: the builder needs `data_directory()` pointed at the portable folder. Delete the marker file and the app goes back to the normal per-user folder.

## Packaging for four platforms

Releases come from one GitHub Actions workflow. A first job creates a single draft release. I added that after v0.4.0 came out as three separate drafts with the files split between them, because parallel build jobs each found no release and each made one. Then a matrix builds on Windows, macOS (Apple silicon and Intel separately) and Ubuntu 22.04 through `tauri-action`, which produces the `.msi` and setup `.exe`, the `.dmg` files, and the `.AppImage`, `.deb` and `.rpm`.

Flatpak arrived in 0.29.0 and needed the most care. It builds from source inside Flathub's GNOME 51 builder image, fully offline, so `generate-sources.sh` has to list every npm package and crate in advance. Inside the sandbox, Start at login is hidden and the agent skill is offered as a file to save. A last job hashes every download into `SHA256SUMS.txt`. The builds aren't code-signed yet, and the checksums are the best I can offer until they are.

## Letting agents read my feeds

The newest piece is MCP support, so Claude Code, Codex, Cursor and others can use my library as a news source. There are two ways in. One is a local HTTP server inside the app, with API keys that are read-only or read-write and stored only as a SHA-256 hash. The other is `turbo-reader --mcp`, which `main.rs` checks for before any window is created: the agent starts the binary itself, it opens the same database (the portable one if the marker is there), and it only reads unless started with `--allow-write`.

Version 0.27.0 added a versioned `SKILL.md` that ships inside the binary through `include_str!`. It tells the agent to call a `get_skill` tool with its own version and replace itself when the app has a newer one. Then I noticed that agents can only reach the HTTP server while the app is running, so 0.28.0 offers to keep it in the tray when you turn agents on.

## What I'd tell myself at 0.1.0

Test with a big library from day one, because most of my real bugs only showed up at 500 feeds. Window geometry was the other time sink: `tauri-plugin-window-state` grew the window 43px per launch, my first hand-rolled fix shrank it by the same amount, and in the end I read the size straight from the OS through `windows-sys`.

The size budget turned out to be the most useful rule in the repo. It forces a decision every time I want to add something, and so far that has kept Turbo Reader small. The code is MIT licensed at github.com/t21dev/turbo-reader if you want to read it.
