import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCourse, getModule, getQuestionPool, PHASE_COLORS } from "@/lib/content";
import { getDb } from "@/lib/db";
import { ExamRunner } from "@/components/exam/ExamRunner";

export default async function ExamPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/signin`);
  const course = getCourse();
  const poolSize = getQuestionPool(mod.slug).length;

  const rows = getDb()
    .prepare(
      "SELECT id, status, score_pct, submitted_at FROM exam_attempts WHERE user_id = ? AND module_slug = ? ORDER BY id"
    )
    .all(user.id, mod.slug) as { id: number; status: string; score_pct: number | null; submitted_at: string | null }[];
  const submitted = rows.filter((r) => r.status === "submitted");
  const best = submitted.reduce<number | null>((b, r) => (r.score_pct !== null && (b === null || r.score_pct > b) ? r.score_pct : b), null);
  const hasOpen = rows.some((r) => r.status === "in_progress");
  const attemptsLeft = Math.max(0, course.maxAttempts - submitted.length);

  return (
    <div>
      <div className="flex items-center gap-4 px-7 py-3.5 border-b line bg-card">
        <Link href={`/course/${mod.slug}`} className="font-extrabold text-[15px]"
          style={{ color: PHASE_COLORS[mod.phase] }}>
          ← {mod.title}
        </Link>
        <span className="flex-1 text-center text-[13px] font-bold tracking-[0.08em] faint uppercase">
          Module exam
        </span>
        <span className="text-[13px] font-bold faint shrink-0">
          attempt {Math.min(submitted.length + 1, course.maxAttempts)} of {course.maxAttempts}
        </span>
      </div>
      <div className="mx-auto max-w-[720px] px-6 py-11">
        {best !== null && (
          <div className="card px-4.5 py-3 mb-6 text-sm flex flex-wrap gap-x-6 gap-y-1">
            <span>Attempts used: <strong>{submitted.length}/{course.maxAttempts}</strong></span>
            <span>
              Best score:{" "}
              <strong className={best >= course.passPct ? "text-ok-deep" : "text-bad-deep"}>
                {best}%{best >= course.passPct ? " ✓ passed" : ""}
              </strong>
            </span>
          </div>
        )}
        <ExamRunner
          moduleSlug={mod.slug}
          moduleTitle={mod.title}
          attemptsLeft={attemptsLeft}
          hasOpenAttempt={hasOpen}
          examCount={mod.examCount}
          poolSize={poolSize}
          passPct={course.passPct}
          maxAttempts={course.maxAttempts}
        />
      </div>
    </div>
  );
}
