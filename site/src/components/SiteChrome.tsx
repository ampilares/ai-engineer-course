"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Lessons run in focus mode: no site header or footer. */
function isLesson(path: string): boolean {
  return /^\/course\/[^/]+\/(?!exam$)[^/]+$/.test(path);
}

export function HideInLesson({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return isLesson(path) ? null : <>{children}</>;
}

const LINKS = [
  { href: "/course", label: "Course" },
  { href: "/placement", label: "Placement quiz" },
  { href: "/resources", label: "Resources" },
  { href: "/graduates", label: "Graduates" },
];

export function NavLinks() {
  const path = usePathname();
  return (
    <>
      {LINKS.map((l) => {
        const active = path === l.href || path.startsWith(l.href + "/");
        return (
          <Link key={l.href} href={l.href}
            className={`px-3 py-1.5 rounded-full transition-colors ${active ? "bg-track text-ink font-semibold" : "muted hover:text-ink"}`}>
            {l.label}
          </Link>
        );
      })}
    </>
  );
}

export function MobileMenu({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}
        className="w-10 h-10 rounded-full grid place-items-center hover:bg-track transition-colors cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {/* Portalled: the header's backdrop-filter would otherwise trap a fixed panel inside it. */}
      {open && createPortal(
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-paper border-t line px-5 pt-4 pb-8 flex flex-col gap-1 menu-in">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-2xl px-4 py-3.5 text-lg font-semibold ${path.startsWith(l.href) ? "bg-track" : "hover:bg-track"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/about" className="rounded-2xl px-4 py-3.5 text-lg font-semibold hover:bg-track">About</Link>
          <div className="mt-auto">
            {signedIn ? (
              <Link href="/profile" className="btn-ghost w-full py-3.5! text-base!">Your profile</Link>
            ) : (
              <div className="grid gap-2.5">
                <Link href="/register" className="btn-primary w-full py-3.5! text-base!">Start learning free</Link>
                <Link href="/signin" className="btn-ghost w-full py-3.5! text-base!">Sign in</Link>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
