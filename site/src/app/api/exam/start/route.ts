import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb, rateLimit } from "@/lib/db";
import { getCourse, getModule, getQuestionPool } from "@/lib/content";
import { drawExam, sanitize, type SanitizedQuestion } from "@/lib/grading";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { module?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const mod = body.module ? getModule(body.module) : null;
  if (!mod) return NextResponse.json({ error: "unknown module" }, { status: 400 });
  if (!rateLimit(`exam:${user.id}`, 20, 3600))
    return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const d = getDb();
  const course = getCourse();

  // Resume an in-progress attempt if one exists.
  const open = d
    .prepare(
      "SELECT id, question_set, answers FROM exam_attempts WHERE user_id = ? AND module_slug = ? AND status = 'in_progress' ORDER BY id DESC LIMIT 1"
    )
    .get(user.id, mod.slug) as { id: number; question_set: string; answers: string } | undefined;
  if (open) {
    const qids = JSON.parse(open.question_set) as string[];
    const pool = new Map(getQuestionPool(mod.slug).map((q) => [q.id, q]));
    const questions: SanitizedQuestion[] = qids
      .map((id) => pool.get(id))
      .filter((q) => q !== undefined)
      .map((q) => sanitize(q));
    return NextResponse.json({
      attemptId: open.id,
      questions,
      answers: JSON.parse(open.answers),
      resumed: true,
    });
  }

  const used = (
    d.prepare(
      "SELECT COUNT(*) AS c FROM exam_attempts WHERE user_id = ? AND module_slug = ? AND status = 'submitted'"
    ).get(user.id, mod.slug) as { c: number }
  ).c;
  if (used >= course.maxAttempts)
    return NextResponse.json({ error: "no attempts left" }, { status: 403 });

  if (getQuestionPool(mod.slug).length === 0)
    return NextResponse.json({ error: "exam not available for this module yet" }, { status: 400 });

  const { qids, sanitized } = drawExam(mod.slug, mod.examCount);
  const res = d
    .prepare("INSERT INTO exam_attempts (user_id, module_slug, question_set) VALUES (?, ?, ?)")
    .run(user.id, mod.slug, JSON.stringify(qids));
  return NextResponse.json({
    attemptId: Number(res.lastInsertRowid),
    questions: sanitized,
    answers: {},
    resumed: false,
  });
}
