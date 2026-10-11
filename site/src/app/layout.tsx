import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HideInLesson, MobileMenu, NavLinks } from "@/components/SiteChrome";
import "./globals.css";

/* Runs before paint: applies the saved theme; defaults to light. */
const themeInit = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: { default: "Practical AI Engineer", template: "%s · Practical AI Engineer" },
  description:
    "A practical 16-week AI course for engineers and business owners: research, data, coding, workflows, OpenClaw, Hermes, Grok Bot, evaluation, and a working capstone.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#17140f" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={`${outfit.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] btn-primary">Skip to content</a>
        <HideInLesson>
          <header className="sticky top-0 z-40 border-b line bg-paper/90 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2.5 text-ink shrink-0">
                <span
                  aria-hidden
                  className="w-[26px] h-[26px] rounded-lg"
                  style={{ background: "conic-gradient(from 40deg, #3B5BDB, oklch(0.6 0.13 145), #F5B840, #3B5BDB)" }}
                />
                <span className="font-extrabold tracking-tight text-[17px]">
                  Practical AI<span className="hidden min-[360px]:inline"> Engineer</span>
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-1 text-[15px] font-medium" aria-label="Main">
                <NavLinks />
              </nav>
              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                {user ? (
                  <Link href="/profile" className="flex items-center gap-2 font-semibold text-ink" aria-label="Your profile">
                    <span className="w-[32px] h-[32px] rounded-full grid place-items-center text-[13px] font-extrabold text-white bg-accent">
                      {user.display_name[0]?.toUpperCase()}
                    </span>
                    <span className="hidden lg:inline">{user.display_name.split(" ")[0]}</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/signin" className="hidden md:inline muted hover:text-ink text-[15px] font-medium">Sign in</Link>
                    <Link href="/register" className="btn-primary shadow-none! px-4! py-2! hidden min-[420px]:inline-flex">Start free</Link>
                  </>
                )}
                <MobileMenu signedIn={!!user} />
              </div>
            </div>
          </header>
        </HideInLesson>
        <main id="main" className="flex-1">{children}</main>
        <HideInLesson>
          <footer className="border-t line mt-16 bg-paper-soft">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="font-extrabold tracking-tight">Practical AI Engineer</p>
                <p className="text-sm muted mt-2 max-w-xs leading-relaxed">
                  A free, hands-on course for engineers and business owners who want AI to do useful, checkable work.
                </p>
              </div>
              <div className="text-sm grid gap-2 content-start">
                <p className="kicker mb-1">Learn</p>
                <Link href="/course" className="muted hover:text-ink">Course map</Link>
                <Link href="/placement" className="muted hover:text-ink">Placement quiz</Link>
                <Link href="/capstone" className="muted hover:text-ink">Capstone</Link>
                <Link href="/resources" className="muted hover:text-ink">Resources</Link>
              </div>
              <div className="text-sm grid gap-2 content-start">
                <p className="kicker mb-1">About</p>
                <Link href="/about" className="muted hover:text-ink">About the course</Link>
                <Link href="/graduates" className="muted hover:text-ink">Graduates</Link>
                <Link href="/privacy" className="muted hover:text-ink">Privacy</Link>
              </div>
            </div>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-8 text-xs faint">
              © {new Date().getFullYear()} Practical AI Engineer — free and open.
            </div>
          </footer>
        </HideInLesson>
      </body>
    </html>
  );
}
