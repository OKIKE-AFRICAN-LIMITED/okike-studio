"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function MobileMenu({ logo, children }: { logo: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    dialogRef.current?.close();
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    // Fix the body as well as hiding overflow, including on mobile Safari.
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%", overflow: "hidden" });
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => { if (desktop.matches) closeMenu(); };
    desktop.addEventListener("change", onResize);

    return () => {
      Object.assign(body.style, previous);
      window.scrollTo(0, scrollY);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="flex h-12 w-[104px] items-center justify-between bg-action px-3 text-[14px] font-semibold text-primary"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-haspopup="dialog"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
          closeRef.current?.focus();
        }}
      >
        Menu <Image src="/navigation/menu.svg" alt="" width={18} height={18} />
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-label="Site menu"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-action p-0 text-primary backdrop:bg-action"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a[href]")) closeMenu();
        }}
        onKeyDown={(event) => {
          // Native modal behavior makes the background inert; wrap Tab within it.
          if (event.key !== "Tab") return;
          const elements = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)");
          const first = elements[0];
          const last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first?.focus();
          }
        }}
      >
        <div className="flex h-[84px] items-center justify-between border-b border-[#d9d9d4] px-5 [&_img]:h-auto">
          {logo}
          <button ref={closeRef} type="button" onClick={closeMenu} className="flex h-12 w-[104px] items-center justify-between bg-surface px-[14px] text-[14px] font-semibold text-primary">
            Close <Image src="/navigation/close.svg" alt="" width={18} height={18} />
          </button>
        </div>
        {children}
      </dialog>
    </div>
  );
}
