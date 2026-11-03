/**
 * Close a <dialog> with its exit animation. CSS styles [data-closing]; once the
 * transition has run, the real close() fires (and with it the dialog's onClose).
 */
export function closeDialog(d: HTMLDialogElement | null | undefined) {
  if (!d?.open || "closing" in d.dataset) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { d.close(); return; }
  d.dataset.closing = "";
  window.setTimeout(() => { delete d.dataset.closing; d.close(); }, 190);
}

/** onCancel handler: Esc plays the same exit instead of closing instantly. */
export function onCancelAnimated(e: React.SyntheticEvent<HTMLDialogElement>) {
  e.preventDefault();
  closeDialog(e.currentTarget);
}
