import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

/* Runs before paint: applies the saved theme; defaults to light. */
const themeInit = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: { default: "Practical AI Engineer", template: "%s · Practical AI Engineer" },
  description:
    "A free, interactive course that takes you from beginner to working AI engineer: Python, ML, LLMs, RAG, agents, automation, evaluation, security, and production.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={`${outfit.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-outfit), var(--font-sans)" }}>
        <header className="sticky top-0 z-40 border-b line bg-paper/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 text-ink">
              <span
                aria-hidden
                className="w-[26px] h-[26px] rounded-lg"
                style={{ background: "conic-gradient(from 40deg, #3B5BDB, oklch(0.6 0.13 145), #F5B840, #3B5BDB)" }}
              />
              <span className="font-extrabold tracking-tight text-[17px]">Practical AI Engineer</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-[15px] font-medium">
              <Link href="/course" className="muted hover:text-ink transition-colors">Course</Link>
              <Link href="/graduates" className="muted hover:text-ink transition-colors">Graduates</Link>
              <ThemeToggle />
              {user ? (
                <Link href="/profile" className="flex items-center gap-2 font-semibold text-ink">
                  <span className="w-[30px] h-[30px] rounded-full grid place-items-center text-[13px] font-extrabold text-white bg-phase-ml">
                    {user.display_name[0]?.toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{user.display_name.split(" ")[0]}</span>
                </Link>
              ) : (
                <Link href="/register" className="btn-primary shadow-none! px-4.5! py-2!">Start free</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t line mt-16">
          <div className="mx-auto max-w-6xl px-6 py-7 text-sm faint flex flex-wrap gap-x-6 gap-y-2">
            <span>© {new Date().getFullYear()} Practical AI Engineer — free and open.</span>
            <Link href="/about" className="muted hover:text-ink">About</Link>
            <Link href="/resources" className="muted hover:text-ink">Resources</Link>
            <Link href="/placement" className="muted hover:text-ink">Placement quiz</Link>
            <Link href="/privacy" className="muted hover:text-ink">Privacy</Link>
            <a href="https://github.com" className="muted hover:text-ink" rel="noopener">Community &amp; source</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
