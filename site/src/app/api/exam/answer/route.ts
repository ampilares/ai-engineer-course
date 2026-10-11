import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { attemptId?: number; questionId?: string; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (typeof body.attemptId !== "number" || typeof body.questionId !== "string")
    return NextResponse.json({ error: "bad request" }, { status: 400 });

  const d = getDb();
  const attempt = d
    .prepare("SELECT id, user_id, status, question_set, answers FROM exam_attempts WHERE id = ?")
    .get(body.attemptId) as
    | { id: number; user_id: number; status: string; question_set: string; answers: string }
    | undefined;
  if (!attempt || attempt.user_id !== user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  if (attempt.status !== "in_progress")
    return NextResponse.json({ error: "attempt closed" }, { status: 409 });
  const qids = JSON.parse(attempt.question_set) as string[];
  if (!qids.includes(body.questionId))
    return NextResponse.json({ error: "question not in attempt" }, { status: 400 });

  if (JSON.stringify(body.answer ?? null).length > 2000)
    return NextResponse.json({ error: "answer too large" }, { status: 400 });

  const answers = JSON.parse(attempt.answers) as Record<string, unknown>;
  answers[body.questionId] = body.answer;
  d.prepare("UPDATE exam_attempts SET answers = ? WHERE id = ?").run(JSON.stringify(answers), attempt.id);
  return NextResponse.json({ ok: true });
}
