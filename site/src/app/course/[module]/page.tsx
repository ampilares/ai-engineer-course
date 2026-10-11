import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCourse, getModule, getPhaseTitle, getQuestionPool, PHASE_COLORS } from "@/lib/content";
import { getProgress } from "@/lib/progress";
import { bestScores } from "@/lib/grading";
import { getDb } from "@/lib/db";

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const course = getCourse();
  const user = await getCurrentUser();
  const progress = user ? getProgress(user.id) : {};
  const done = progress[mod.slug] ?? new Set();
  const score = user ? bestScores(user.id)[mod.slug] : undefined;
  const passed = score !== undefined && score >= course.passPct;
  const poolSize = getQuestionPool(mod.slug).length;
  const attemptsUsed = user
    ? (getDb()
        .prepare("SELECT COUNT(*) AS c FROM exam_attempts WHERE user_id = ? AND module_slug = ? AND status = 'submitted'")
        .get(user.id, mod.slug) as { c: number }).c
    : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm muted mb-4">
        <Link href="/course" className="hover:underline">Course</Link> /{" "}
        <span style={{ color: PHASE_COLORS[mod.phase] }}>{getPhaseTitle(mod.phase)}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight">
        Module {mod.number}: {mod.title}
      </h1>
      <p className="muted mt-3">{mod.summary}</p>

      <h2 className="text-sm font-semibold uppercase tracking-wider muted mt-8 mb-2">You will be able to</h2>
      <ul className="list-disc pl-5 space-y-1 text-[15px]">
        {mod.outcomes.map((o) => <li key={o}>{o}</li>)}
      </ul>

      <h2 className="text-sm font-semibold uppercase tracking-wider muted mt-8 mb-3">Lessons</h2>
      <ol className="space-y-2">
        {mod.lessons.map((l, i) => {
          const isDone = done.has(l.slug);
          return (
            <li key={l.slug}>
              <Link href={`/course/${mod.slug}/${l.slug}`}
                className="card p-3.5 flex items-center gap-3 hover:border-accent/60 transition-colors">
                <span className={`w-7 h-7 rounded-full grid place-items-center text-sm font-semibold shrink-0 ${
                  isDone ? "bg-ok text-white" : "border line"}`}>
                  {isDone ? "✓" : i + 1}
                </span>
                <span className="flex-1 font-medium">{l.title}</span>
                <span className="text-xs muted shrink-0">{l.minutes} min</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="card p-5 mt-8" style={{ borderColor: passed ? "var(--color-ok)" : undefined }}>
        <h2 className="font-semibold text-lg">Module exam</h2>
        <p className="text-sm muted mt-1">
          {mod.examCount} questions drawn from a pool of {poolSize}. Pass mark {course.passPct}%.
          Up to {course.maxAttempts} attempts: your best score counts toward your final grade.
          Open book: understanding is what&apos;s tested.
        </p>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          {user ? (
            <>
              <Link href={`/course/${mod.slug}/exam`} className={passed ? "btn-ghost" : "btn-primary"}>
                {score === undefined ? "Start exam" : attemptsUsed >= course.maxAttempts ? "Review attempts" : "Retake exam"}
              </Link>
              {score !== undefined && (
                <span className={`text-sm font-medium ${passed ? "text-ok" : "text-bad"}`}>
                  Best score: {score}% {passed ? "· passed ✓" : "· below pass mark"}
                </span>
              )}
              <span className="text-xs muted">{attemptsUsed}/{course.maxAttempts} attempts used</span>
            </>
          ) : (
            <Link href="/register" className="btn-primary">Register free to take the exam</Link>
          )}
        </div>
      </div>
    </div>
  );
}
