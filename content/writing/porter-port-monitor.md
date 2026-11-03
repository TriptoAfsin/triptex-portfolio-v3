---
title: "Who is sitting on port 3000? Building Porter, a desktop port monitor"
slug: porter-port-monitor
date: 2026-10-12
summary: "How I built Porter with Tauri and React: reading socket tables on three OSes, killing processes safely, and cutting idle CPU by a factor of ten."
readingMinutes: 7
tags: [tauri, rust, react, desktop, devtools]
cover: /writing/porter-port-monitor/1.webp
---

Something is always sitting on port 3000. A Next.js server I forgot in a terminal tab two days ago, a Docker container that came back after a reboot, a Vite instance that crashed without releasing its socket. The fix is always the same ritual: `netstat -ano | findstr 3000` on Windows, `lsof -i :3000` on my Mac, squint at a PID, kill it, hope it was the right one.

<figure><img src="/writing/porter-port-monitor/1.webp" alt="Porter in dark mode: every listening port, the process behind it, and a kill button." width="1054" height="1354" loading="lazy" decoding="async"><figcaption>Porter in dark mode: every listening port, the process behind it, and a kill button.</figcaption></figure>

I got tired of the ritual, so at t21 dev I built Porter. It's a small desktop app that shows the ports I care about, who owns each one, and a button to free it. It runs on Windows, macOS and Linux, and it's built with Tauri 2, React 19, TypeScript and Tailwind v4. The code is public at [t21dev/porter-app](https://github.com/t21dev/porter-app).

The UI was the easy half. Most of the interesting problems were in the Rust side, and a few of them I only understood after shipping the wrong answer first.

## Why Tauri

A port monitor sits open all day in a corner of the screen. It shouldn't ship its own copy of Chromium to show a table. Tauri uses the system webview and gives me Rust for the part that talks to the operating system, which is where the real work lives.

The cost is three webviews with three sets of quirks. The Linux AppImage once aborted at launch on Arch with `EGL_BAD_PARAMETER` because an older bundler had packed an old Wayland client library.

## Three operating systems, three ways to ask the same question

The question is "which sockets are listening, and which process owns each one?" Every OS answers it differently.

```
            get_network_connections(include_connections)
                              |
      +-----------------------+------------------------+
      |                       |                        |
   Windows                  macOS                    Linux
 GetExtendedTcpTable        lsof            /proc/net/tcp{,6} + /proc/<pid>/fd
 (IPv4 + IPv6, owner PID)   (-iTCP -sTCP:LISTEN)    (inode -> PID match)
                                                   Flatpak: host `ss` via flatpak-spawn
```

On Windows I call `GetExtendedTcpTable` from IP Helper through the `windows` crate. The table can grow between the size query and the read, so the code retries on `ERROR_INSUFFICIENT_BUFFER`. The buffer is a `Vec<u32>` instead of `Vec<u8>` so it stays aligned for the table structs. Small detail, easy to miss.

macOS shells out to `lsof`. It's slower than a syscall, but it's always there. One early bug: for a connection, `lsof` prints `local->remote`, and I was splitting on the last colon of the whole field, so connections showed up under their remote port. Taking the part before `->` fixed it.

Linux was the most fun. `/proc/net/tcp` lists sockets with hex addresses and an inode number, but no PID. To find the owner you walk `/proc/<pid>/fd`, read each symlink, and look for `socket:[inode]`. The kernel also prints each 32-bit word of the address in host byte order, so IPv6 addresses come out scrambled unless you read each 8-digit group back little-endian. I put that parser in the shared `platform/mod.rs` so its unit tests run on every OS, including my Windows machine.

The Flatpak build added one more twist. Inside the sandbox, `/proc` only contains Porter's own processes, so the fd walk finds nothing. There, Porter runs the host's `ss -Htanpe` through `flatpak-spawn --host` and reads owners straight from its output. Killing goes through the host the same way.

## The refresh loop that was eating a core

The first version worked, and it was heavy. Every 3 seconds it called `System::refresh_all()` from the `sysinfo` crate, which reloads every process on the machine with its command line, working directory, CPU and memory, just so I could print a name next to a few ports. On Linux, the owner lookup walked every open file of every process once per connection.

The fix in 0.3.0 had several parts:

- Ask the OS for listeners only. On Windows that's `TCP_TABLE_OWNER_PID_LISTENER`; on macOS it's `lsof -iTCP -sTCP:LISTEN`. The full connection table is mostly the local ends of browser tabs and sync clients, and none of those are ports you'd ever want to free.
- Refresh only the PIDs that own a port, and only their names.
- On Linux, do one `/proc` walk per scan for all sockets together, and stop as soon as every inode has an owner.
- Run scans on Tauri's blocking pool instead of inline on an async worker while holding a lock.
- Stop polling while the window is minimised.

That last one was sneakier than it looks. TanStack Query has `refetchIntervalInBackground: false`, which I assumed would handle it. It doesn't, because the webview keeps reporting itself as visible when the window is minimised. The only reliable signal is the native window:

```ts
function useMinimized() {
  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    const win = getCurrentWindow();
    const check = () => {
      win.isMinimized().then(setMinimized).catch(() => undefined);
    };
    const offs = [win.onResized(check), win.onFocusChanged(check)];
    return () => { offs.forEach((p) => void p.then((off) => off())); };
  }, []);
  return minimized;
}
```

When it comes back, I invalidate the query right away so the list catches up immediately and doesn't wait for the next tick.

I measured before and after on Windows with about 525 processes running. Idle CPU went from 15.5% of a core to 1.5%, and while minimised from 13% to 0%. A scan dropped from 29 ms to 16 ms, first data from 586 ms to 357 ms, and the payload sent to the window each refresh from about 120 KB to about 6 KB. That smaller payload had a side benefit I didn't plan: once I dropped the per-scan timestamps, unchanged rows kept their identity, so memoised React rows stopped re-rendering.

## Bringing outgoing connections back, as an option

Switching to listeners only was the right default, but sometimes I do want to see which local ports my clients have open, the way versions before 0.3.0 showed them. So 0.3.1 added "Show outgoing connections" in settings, off by default. It flips one boolean that travels all the way down to the platform layer:

```rust
let class = if include_connections {
    TCP_TABLE_OWNER_PID_ALL
} else {
    TCP_TABLE_OWNER_PID_LISTENER
};
```

When a listener and connections share a local port, a one-line `sort_by_key` puts listeners first, so a dev server isn't labelled as whatever client connected to it.

## Killing processes, and the admin question

On Windows, `is_elevated` reads `TokenElevation` from the process token. If Porter isn't elevated, a banner offers "Restart as admin", which relaunches the exe through PowerShell's `Start-Process -Verb RunAs` and exits the current instance. Elevating one kill at a time would need a separate elevated helper, and a restart is far less code.

macOS and Linux don't need a restart. Porter sends SIGTERM, waits 500 ms, sends SIGKILL if the process is still there, and only then falls back to an elevated kill: `osascript ... with administrator privileges` on macOS, `pkexec kill -9` on Linux. Both show the native password dialog, and both report a cancelled prompt as a cancel instead of a vague failure.

I got this wrong at first. The frontend checked for admin rights before even attempting a kill and blocked the button when it found none. On Windows that's roughly right. On macOS and Linux it meant the password prompt could never appear, because we never asked. The fix was deleting nine lines from `App.tsx` and letting the backend try.

Another bug lived in the "did it die?" check. `sysinfo` lets you refresh specific PIDs, but a targeted refresh never removes processes that have exited, so a killed process looked alive forever. Now `is_running` takes a fresh, empty snapshot each time.

One shortcut I'm less proud of: "System" status is a PID threshold, under 1000 on Windows and Linux and under 500 on macOS. It's a heuristic, and it's wrong sometimes. It's also good enough to stop me from killing `svchost` by accident, which was the point.

## A frameless window that still feels native

Since 0.2.0 the window has `decorations: false` and a custom title bar with the app actions and window buttons, marked `data-tauri-drag-region` so it drags like a real one. On macOS I refused to draw fake traffic lights. A separate `tauri.macos.conf.json` turns decorations back on with `titleBarStyle: "Overlay"` and a hidden title, so the real buttons float over my bar. The React side skips its own controls on Mac and pads the left edge by 84px to clear them.

The window also starts hidden, painted with the theme's background colour, and React reveals it after two animation frames, so launch has no white flash. If the frontend never gets that far, Rust shows the window after 3 seconds anyway.

## The theme crossfade

Switching themes used to snap. Now it crossfades over 260 ms using the View Transitions API, and skips the animation if the user prefers reduced motion or the webview doesn't support it:

```ts
const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
if (doc.startViewTransition && !reduced) {
  doc.startViewTransition(apply);
} else {
  apply();
}
```

`apply` also calls `setBackgroundColor` on the native window, so resizing in light mode doesn't flash the dark canvas behind the webview.

## What I'd tell myself at the start

Read less. Almost every performance win came from asking the OS a narrower question. The other lesson is that the webview isn't the window. Visibility, minimised state and background colour all live in the native layer, and each time I trusted the browser's version of those I shipped a bug.

Porter is on version 0.7.0 now, with a Flatpak, a portable Windows zip and a Docker image. It's still the first thing I open when something won't start, and port 3000 still has a squatter most days.
