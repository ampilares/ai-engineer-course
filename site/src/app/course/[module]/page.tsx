import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAllModules, getCourse, getModule, getPhaseTitle, getQuestionPool, phaseColor } from "@/lib/content";
import { getProgress } from "@/lib/progress";
import { bestScores } from "@/lib/grading";
import { getDb } from "@/lib/db";

const LESSON_KIND = ["Concepts", "Worked example", "Studio"];
const LESSON_ICON = ["◐", "✎", "⚒"];

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  return { title: getModule(slug)?.title ?? "Module" };
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const course = getCourse();
  const all = getAllModules();
  const pos = all.findIndex((m) => m.slug === slug);
  const prevMod = all[pos - 1];
  const nextMod = all[pos + 1];
  const user = await getCurrentUser();
  const done = user ? (getProgress(user.id)[mod.slug] ?? new Set<string>()) : new Set<string>();
  const score = user ? bestScores(user.id)[mod.slug] : undefined;
  const passed = score !== undefined && score >= course.passPct;
  const poolSize = getQuestionPool(mod.slug).length;
  const attemptsUsed = user
    ? (getDb()
        .prepare("SELECT COUNT(*) AS c FROM exam_attempts WHERE user_id = ? AND module_slug = ? AND status = 'submitted'")
        .get(user.id, mod.slug) as { c: number }).c
    : 0;

  const col = phaseColor(mod.phase, 0.55, 0.13);
  const tint = `color-mix(in oklab, ${col} 11%, var(--color-paper))`;
  const firstOpen = mod.lessons.find((l) => !done.has(l.slug));
  const allDone = !firstOpen;
  const minutes = mod.lessons.reduce((n, l) => n + l.minutes, 0);
  const pct = Math.round((done.size / mod.lessons.length) * 100);
  const ctaHref = firstOpen ? `/course/${mod.slug}/${firstOpen.slug}` : `/course/${mod.slug}/exam`;
  const ctaLabel = !user
    ? "Start the first lesson"
    : firstOpen
      ? done.size ? `Continue: ${firstOpen.title}` : "Start lesson 1"
      : passed ? "Review the exam" : "Take the module exam";
  const week = String(mod.number).padStart(2, "0");

  return (
    <div>
      <section className="border-b line" style={{ background: `linear-gradient(180deg, ${tint}, transparent)` }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-10">
          <nav className="text-sm muted flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/course" className="hover:text-ink">Course</Link>
            <span aria-hidden>›</span>
            <span style={{ color: col }} className="font-semibold">{getPhaseTitle(mod.phase)}</span>
          </nav>
          <div className="mt-6 grid md:grid-cols-[1fr_260px] gap-8 items-center">
            <div>
              <p className="kicker" style={{ color: col }}>Week {mod.number} of {all.length}</p>
              <h1 className="text-[32px] sm:text-[42px] font-extrabold tracking-tight leading-[1.08] mt-2 text-pretty">{mod.title}</h1>
              <p className="text-lg muted mt-3 max-w-xl text-pretty">{mod.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={ctaHref} className="btn-primary px-6! py-3.5! text-base!">{ctaLabel} →</Link>
                <span className="text-sm faint">{mod.lessons.length} lessons · ~{minutes} min · {mod.examCount}-question exam</span>
              </div>
            </div>
            <div className="hidden md:grid place-items-center">
              <div className="relative w-[200px] h-[200px] rounded-full grid place-items-center"
                style={{ background: `conic-gradient(${passed ? "var(--color-ok)" : col} 0 ${user ? pct : 0}%, var(--color-line) 0 100%)` }}>
                <div className="w-[164px] h-[164px] rounded-full bg-paper grid place-items-center text-center">
                  <div>
                    <div className="text-[44px] font-extrabold leading-none tracking-tight" style={{ color: passed ? "var(--color-ok-deep)" : col }}>
                      {passed ? "✓" : user ? `${pct}%` : mod.number}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.1em] faint mt-1.5">
                      {passed ? `Exam ${score}%` : user ? "complete" : "week"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_300px] gap-10">
        <section aria-labelledby="path-h">
          <h2 id="path-h" className="kicker mb-5">Your path</h2>
          <ol className="relative">
            {mod.lessons.map((l, i) => {
              const isDone = done.has(l.slug);
              const isNext = firstOpen?.slug === l.slug;
              return (
                <li key={l.slug} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <span className={`w-12 h-12 rounded-2xl grid place-items-center text-lg font-extrabold transition-transform ${isNext ? "scale-110" : ""}`}
                      style={{
                        background: isDone ? "var(--color-ok)" : isNext ? col : "var(--color-card)",
                        color: isDone || isNext ? "#fff" : "var(--color-ink-faint)",
                        border: isDone || isNext ? "none" : "2px solid var(--color-line-strong)",
                        boxShadow: isNext ? `0 8px 20px color-mix(in oklab, ${col} 35%, transparent)` : undefined,
                      }}>
                      {isDone ? "✓" : LESSON_ICON[i] ?? i + 1}
                    </span>
                    <span className="w-[3px] flex-1 min-h-4 my-1 rounded-full" style={{ background: isDone ? "var(--color-ok)" : "var(--color-line)" }} />
                  </div>
                  <Link href={`/course/${mod.slug}/${l.slug}`}
                    className={`flex-1 min-w-0 mb-4 card px-4 sm:px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(38,32,25,0.07)] ${isNext ? "border-2" : ""}`}
                    style={isNext ? { borderColor: col } : undefined}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] faint">
                          Lesson {i + 1} · {LESSON_KIND[i] ?? "Lesson"} · {l.minutes} min
                        </p>
                        <p className="font-bold text-[17px] mt-1 leading-snug">{l.title}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold mt-0.5" style={{ color: isDone ? "var(--color-ok-deep)" : col }}>
                        {isDone ? "Review" : isNext ? "Start →" : !user && i > 0 ? "🔒" : ""}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li className="flex gap-4">
              <div className="shrink-0">
                <span className="w-12 h-12 rounded-2xl grid place-items-center text-xl font-extrabold"
                  style={{ background: passed ? "var(--color-ok)" : "#262019", color: passed ? "#fff" : "var(--color-gold)" }}>
                  {passed ? "✓" : "★"}
                </span>
              </div>
              <div className="flex-1 min-w-0 card px-4 sm:px-5 py-4" style={{ borderColor: passed ? "var(--color-ok)" : undefined }}>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] faint">Module exam · open book</p>
                <p className="font-bold text-[17px] mt-1">Show what you know</p>
                <p className="text-sm muted mt-1.5 leading-relaxed">
                  {mod.examCount} questions from a pool of {poolSize}. Pass at {course.passPct}%; best of {course.maxAttempts} attempts counts.
                </p>
                <div className="mt-3.5 flex items-center gap-3 flex-wrap">
                  {user ? (
                    <>
                      <Link href={`/course/${mod.slug}/exam`} className={passed || !allDone ? "btn-ghost" : "btn-primary"}>
                        {score === undefined ? "Start exam" : attemptsUsed >= course.maxAttempts ? "Review attempts" : "Retake exam"}
                      </Link>
                      {score !== undefined && (
                        <span className={`text-sm font-semibold ${passed ? "text-ok-deep" : "text-bad"}`}>
                          Best {score}% {passed ? "· passed" : "· below pass mark"}
                        </span>
                      )}
                      <span className="text-xs faint">{attemptsUsed}/{course.maxAttempts} attempts</span>
                    </>
                  ) : (
                    <Link href="/register" className="btn-primary">Register free to take the exam</Link>
                  )}
                </div>
              </div>
            </li>
          </ol>
        </section>

        <aside className="grid gap-5 content-start">
          <div className="card p-5">
            <h2 className="kicker mb-3">By the end you can</h2>
            <ul className="grid gap-2.5">
              {mod.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-[15px] leading-snug">
                  <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full grid place-items-center text-[11px] font-extrabold text-white" style={{ background: col }}>✓</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="kicker mb-3">Materials</h2>
            <ul className="grid gap-2 text-[15px]">
              <li><a className="text-accent hover:text-accent-deep font-semibold" href={`/course-materials/course/weeks/${week}.md`}>Full week chapter ↗</a></li>
              <li><a className="text-accent hover:text-accent-deep font-semibold" href="/course-materials/course/case-study/README.md">Harbour Services case ↗</a></li>
              <li><a className="text-accent hover:text-accent-deep font-semibold" href="/course-materials/course/labs/README.md">Lab instructions ↗</a></li>
            </ul>
          </div>
          <div className="flex justify-between gap-3 text-sm font-semibold">
            {prevMod ? <Link href={`/course/${prevMod.slug}`} className="muted hover:text-ink truncate">← Week {prevMod.number}</Link> : <span />}
            {nextMod && <Link href={`/course/${nextMod.slug}`} className="muted hover:text-ink truncate">Week {nextMod.number} →</Link>}
          </div>
        </aside>
      </div>
    </div>
  );
}
