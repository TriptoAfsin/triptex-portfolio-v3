"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "./icons";
import { closeDialog, onCancelAnimated } from "./close-dialog";

/** Avatar that opens a larger photo in a dialog. */
export function Photo({ src, name }: { src: string; name: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="av-btn" type="button" onClick={() => dlg.current?.showModal()} aria-label={`View a larger photo of ${name}`}>
        <Image className="av" src={src} alt={name} width={64} height={64} priority sizes="64px" />
        <span className="av-hint" aria-hidden="true"><Icon id="i-expand" /></span>
      </button>
      <dialog ref={dlg} className="photo-dlg" aria-label={`Photo of ${name}`} onCancel={onCancelAnimated} onClick={e => { if (e.target === dlg.current) closeDialog(dlg.current); }}>
        <Image src={src} alt={name} width={380} height={380} sizes="380px" />
        <figcaption>{name} · Dhaka</figcaption>
        <button className="wk-x" type="button" aria-label="Close photo" onClick={() => closeDialog(dlg.current)}><Icon id="i-x" /></button>
      </dialog>
    </>
  );
}
