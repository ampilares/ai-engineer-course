import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCourse } from "@/lib/content";
import { gradeAttempt, refreshGradeAndGraduation, type AnswerValue } from "@/lib/grading";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { attemptId?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const d = getDb();
  const attempt = d
    .prepare("SELECT * FROM exam_attempts WHERE id = ?")
    .get(body.attemptId ?? -1) as
    | { id: number; user_id: number; module_slug: string; status: string; question_set: string; answers: string }
    | undefined;
  if (!attempt || attempt.user_id !== user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  if (attempt.status !== "in_progress")
    return NextResponse.json({ error: "already submitted" }, { status: 409 });

  const qids = JSON.parse(attempt.question_set) as string[];
  const answers = JSON.parse(attempt.answers) as Record<string, AnswerValue>;
  const { scorePct, results } = gradeAttempt(attempt.module_slug, qids, answers);

  d.prepare(
    "UPDATE exam_attempts SET status = 'submitted', score_pct = ?, submitted_at = datetime('now') WHERE id = ?"
  ).run(scorePct, attempt.id);

  const certId = refreshGradeAndGraduation(user.id);
  const course = getCourse();
  const used = (
    d.prepare(
      "SELECT COUNT(*) AS c FROM exam_attempts WHERE user_id = ? AND module_slug = ? AND status = 'submitted'"
    ).get(user.id, attempt.module_slug) as { c: number }
  ).c;

  return NextResponse.json({
    scorePct,
    passed: scorePct >= course.passPct,
    passPct: course.passPct,
    attemptsLeft: Math.max(0, course.maxAttempts - used),
    results,
    graduated: !!certId,
    certificateId: certId,
  });
}
