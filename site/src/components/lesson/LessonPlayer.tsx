"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LessonInteractionsProvider, StepScope, stepSatisfied, useLessonInteractions } from "./LessonInteractions";

type Route = "eng" | "owner";
export type PlayerStep = { node: React.ReactNode; interactive: boolean; route?: Route };

type Props = {
  steps: PlayerStep[];
  footer: React.ReactNode;
  moduleSlug: string;
  moduleTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonNumber: number;
  lessonCount: number;
  minutes: number;
  color: string;
  nextHref: string;
  nextLabel: string;
  alreadyDone: boolean;
  signedIn: boolean;
};

const ROUTE_LABEL: Record<Route, string> = { eng: "Engineering", owner: "Business owner" };

export function LessonPlayer(props: Props) {
  return (
    <LessonInteractionsProvider>
      <Player {...props} />
    </LessonInteractionsProvider>
  );
}

function Player({
  steps, footer, moduleSlug, moduleTitle, lessonSlug, lessonTitle, lessonNumber, lessonCount, minutes,
  color, nextHref, nextLabel, alreadyDone, signedIn,
}: Props) {
  const router = useRouter();
  const ctx = useLessonInteractions();
  const storeKey = `lesson:${moduleSlug}/${lessonSlug}`;
  const hasRoutes = steps.some((s) => s.route);

  const [route, setRoute] = useState<Route>("eng");
  const [reached, setReached] = useState(alreadyDone ? steps.length - 1 : 0);
  const [done, setDone] = useState(alreadyDone);
  const [celebrate, setCelebrate] = useState(false);
  const [busy, setBusy] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const restored = useRef(false);

  const eligible = useMemo(
    () => steps.map((s, i) => (!s.route || s.route === route ? i : -1)).filter((i) => i >= 0),
    [steps, route],
  );

  // Restore saved route and position after hydration (browser-only state).
  useEffect(() => {
    try {
      const r = localStorage.getItem("route");
      if (r === "eng" || r === "owner") setRoute(r);
      const saved = Number(localStorage.getItem(storeKey));
      if (!alreadyDone && Number.isFinite(saved) && saved > 0) setReached(Math.min(saved, steps.length - 1));
    } catch { /* storage unavailable */ }
    restored.current = true;
  }, [storeKey, alreadyDone, steps.length]);

  useEffect(() => {
    if (!restored.current) return;
    try { localStorage.setItem(storeKey, String(reached)); } catch { /* ignore */ }
  }, [reached, storeKey]);

  function chooseRoute(r: Route) {
    setRoute(r);
    try { localStorage.setItem("route", r); } catch { /* ignore */ }
  }

  // The step the learner is currently on: last eligible step at or before `reached`.
  const current = [...eligible].reverse().find((i) => i <= reached) ?? eligible[0];
  const position = eligible.indexOf(current);
  const isLast = position === eligible.length - 1;
  // Interactive steps stay locked until their questions have registered and been answered.
  const registered = ctx ? Object.values(ctx.entries).some((e) => e.step === current) : false;
  const satisfied = (ctx ? stepSatisfied(ctx.entries, current) : true) && (!steps[current]?.interactive || registered);
  const progress = done ? 1 : (position + (satisfied && isLast ? 1 : 0)) / eligible.length;

  const advance = useCallback(() => {
    const next = eligible[position + 1];
    if (next === undefined) return;
    setReached((r) => Math.max(r, next));
    requestAnimationFrame(() => {
      stepRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [eligible, position]);

  async function complete() {
    if (!signedIn) return;
    setBusy(true);
    try {
      const res = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleSlug, lesson: lessonSlug }),
      });
      if (res.ok) {
        setDone(true);
        setCelebrate(true);
        try { localStorage.removeItem(storeKey); } catch { /* ignore */ }
        router.refresh();
        requestAnimationFrame(() => document.getElementById("lesson-end")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      }
    } finally {
      setBusy(false);
    }
  }

  // Enter / → continues when nothing interactive has focus.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      if (el && el !== document.body) return;
      if ((e.key === "Enter" || e.key === "ArrowRight") && satisfied && !isLast) {
        e.preventDefault();
        advance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, satisfied, isLast]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar: exit, progress, route */}
      <header className="sticky top-0 z-40 bg-paper/92 backdrop-blur border-b line">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center gap-3 sm:gap-4">
          <Link href={`/course/${moduleSlug}`} aria-label={`Exit to ${moduleTitle}`}
            className="w-9 h-9 -ml-1.5 rounded-full grid place-items-center text-ink-soft hover:bg-track hover:text-ink transition-colors shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="h-2.5 rounded-full bg-track overflow-hidden" role="progressbar" aria-label="Lesson progress"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <div className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(progress * 100, 3)}%`, background: done ? "var(--color-ok)" : color }} />
            </div>
          </div>
          <span className="text-xs font-bold tabular-nums faint shrink-0 hidden sm:inline">
            {Math.min(position + 1, eligible.length)}/{eligible.length}
          </span>
          {hasRoutes && (
            <div className="shrink-0 flex rounded-full bg-track p-0.5 text-[12px] font-bold" role="group" aria-label="Choose your route">
              {(["eng", "owner"] as Route[]).map((r) => (
                <button key={r} type="button" onClick={() => chooseRoute(r)} aria-pressed={route === r}
                  className={`px-2.5 sm:px-3 py-1 rounded-full transition-colors cursor-pointer ${route === r ? "bg-card text-ink shadow-sm" : "text-ink-soft"}`}>
                  <span className="sm:hidden">{r === "eng" ? "Eng" : "Owner"}</span>
                  <span className="hidden sm:inline">{ROUTE_LABEL[r]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[680px] px-4 sm:px-6 pt-8 pb-40">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color }}>
          {moduleTitle} · Lesson {lessonNumber} of {lessonCount} · {minutes} min
        </p>
        <h1 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight leading-[1.15] mt-2 mb-6 text-pretty">{lessonTitle}</h1>

        <div className="flex flex-col gap-5">
          {steps.map((s, i) => {
            const visible = eligible.includes(i) && i <= reached;
            return (
              <div key={i} ref={(el) => { stepRefs.current[i] = el; }} hidden={!visible}
                className={`lesson-step ${i === current && !done ? "is-current" : ""}`}>
                {s.route && (
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-track px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-soft">
                    {s.route === "eng" ? "⚙" : "◆"} {ROUTE_LABEL[s.route]} route
                  </p>
                )}
                <StepScope index={i}>
                  <div className="prose-custom">{s.node}</div>
                </StepScope>
              </div>
            );
          })}
        </div>

        {(done || isLast) && footer && <div className="mt-8 text-sm muted lesson-footer">{footer}</div>}

        {celebrate && (
          <div id="lesson-end" className="mt-10 card p-6 sm:p-8 text-center celebrate">
            <div className="text-5xl" aria-hidden>🎉</div>
            <h2 className="text-2xl font-extrabold tracking-tight mt-3">Lesson complete</h2>
            <p className="muted mt-1.5">You worked through {eligible.length} steps. Progress saved.</p>
            <Link href={nextHref} className="btn-primary mt-5 px-7! py-3! text-base!">{nextLabel} →</Link>
          </div>
        )}
      </main>

      {/* Bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t line bg-paper/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-[680px] px-4 sm:px-6 py-3 flex items-center gap-3">
          <p className="flex-1 text-sm muted min-w-0 truncate hidden sm:block">
            {done
              ? "✓ Lesson complete"
              : !satisfied
                ? "Answer the question above to continue"
                : isLast
                  ? signedIn ? "Nice work — you reached the end." : "Sign up free to save progress."
                  : "Ready when you are."}
          </p>
          {done ? (
            <Link href={nextHref} className="btn-primary continue-btn flex-1 sm:flex-none">{nextLabel} →</Link>
          ) : !isLast ? (
            <button type="button" onClick={advance} disabled={!satisfied} className="btn-primary continue-btn flex-1 sm:flex-none">
              {satisfied ? "Continue" : <><span className="sm:hidden">Answer to continue</span><span className="hidden sm:inline">Continue</span></>}
            </button>
          ) : signedIn ? (
            <button type="button" onClick={complete} disabled={!satisfied || busy}
              className="btn-primary continue-btn flex-1 sm:flex-none bg-ok! hover:bg-ok-deep! shadow-[0_6px_16px_rgba(60,140,80,0.3)]!">
              {busy ? "Saving…" : "Complete lesson"}
            </button>
          ) : (
            <Link href="/register" className="btn-primary continue-btn flex-1 sm:flex-none">Start free</Link>
          )}
        </div>
      </div>
    </div>
  );
}
