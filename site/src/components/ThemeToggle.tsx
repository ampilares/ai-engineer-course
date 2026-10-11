"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  // Rendered as a placeholder until mounted; the real theme lives on <html>,
  // set pre-paint by the inline script in layout.tsx.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="w-9 h-9 rounded-full grid place-items-center border-[1.5px] border-line-strong text-[15px] cursor-pointer hover:border-ink transition-colors"
    >
      <span aria-hidden>{theme === null ? "◐" : theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
