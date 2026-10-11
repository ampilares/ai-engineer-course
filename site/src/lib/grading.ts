import "server-only";
import { randomInt } from "node:crypto";
import { getCourse, getQuestionPool, type Question } from "./content";
import { getDb } from "./db";

export type SanitizedQuestion = {
  id: string;
  type: Question["type"];
  prompt: string;
  code?: string;
  options?: { id: string; text: string }[];
  unit?: string;
};

export type AnswerValue = string | string[] | number;

/** Draw `count` random questions from a module pool; shuffle option order per question. */
export function drawExam(moduleSlug: string, count: number): { qids: string[]; sanitized: SanitizedQuestion[] } {
  const pool = getQuestionPool(moduleSlug);
  if (pool.length === 0) throw new Error(`No question pool for ${moduleSlug}`);
  const n = Math.min(count, pool.length);
  const idx = shuffle(pool.map((_, i) => i)).slice(0, n);
  const chosen = idx.map((i) => pool[i]);
  return { qids: chosen.map((q) => q.id), sanitized: chosen.map(sanitize) };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Strip everything that reveals the answer. */
export function sanitize(q: Question): SanitizedQuestion {
  const base: SanitizedQuestion = { id: q.id, type: q.type, prompt: q.prompt };
  if (q.code) base.code = q.code;
  if (q.type === "single" || q.type === "multi") base.options = shuffle(q.options.map((o) => ({ ...o })));
  if (q.type === "numeric" && q.unit) base.unit = q.unit;
  return base;
}

export function gradeAnswer(q: Question, answer: AnswerValue | undefined | null): boolean {
  if (answer === undefined || answer === null) return false;
  switch (q.type) {
    case "single":
      return typeof answer === "string" && answer === q.answer;
    case "multi": {
      if (!Array.isArray(answer)) return false;
      const got = [...new Set(answer)].sort();
      const want = [...q.answer].sort();
      return got.length === want.length && got.every((v, i) => v === want[i]);
    }
    case "numeric": {
      const num = typeof answer === "number" ? answer : parseFloat(String(answer).replace(",", "."));
      if (!Number.isFinite(num)) return false;
      return Math.abs(num - q.answer) <= q.tolerance;
    }
    case "short": {
      if (typeof answer !== "string") return false;
      const norm = answer.trim().toLowerCase().replace(/\s+/g, " ");
      return q.accept.some((a) => a.trim().toLowerCase().replace(/\s+/g, " ") === norm);
    }
  }
}

export function gradeAttempt(
  moduleSlug: string,
  qids: string[],
  answers: Record<string, AnswerValue>
): { scorePct: number; results: { qid: string; correct: boolean; explanation: string; correctAnswer: string }[] } {
  const pool = getQuestionPool(moduleSlug);
  const byId = new Map(pool.map((q) => [q.id, q]));
  // Questions removed from the pool while an attempt was open are excluded from
  // scoring rather than counted against the learner.
  const present = qids.filter((qid) => byId.has(qid));
  const results = present.map((qid) => {
    const q = byId.get(qid)!;
    return {
      qid,
      correct: gradeAnswer(q, answers[qid]),
      explanation: q.explanation,
      correctAnswer: describeAnswer(q),
    };
  });
  const correct = results.filter((r) => r.correct).length;
  const denom = Math.max(present.length, 1);
  return { scorePct: Math.round((correct / denom) * 1000) / 10, results };
}

function describeAnswer(q: Question): string {
  switch (q.type) {
    case "single":
      return q.options.find((o) => o.id === q.answer)?.text ?? q.answer;
    case "multi":
      return q.answer.map((id) => q.options.find((o) => o.id === id)?.text ?? id).join(" · ");
    case "numeric":
      return `${q.answer}${q.unit ? " " + q.unit : ""} (±${q.tolerance})`;
    case "short":
      return q.accept[0];
  }
}

/** Best exam score per module for a user. */
export function bestScores(userId: number): Record<string, number> {
  const rows = getDb()
    .prepare(
      "SELECT module_slug, MAX(score_pct) AS best FROM exam_attempts WHERE user_id = ? AND status = 'submitted' GROUP BY module_slug"
    )
    .all(userId) as { module_slug: string; best: number }[];
  return Object.fromEntries(rows.map((r) => [r.module_slug, r.best]));
}

export function computeFinalGrade(userId: number): { pct: number | null; allPassed: boolean } {
  const course = getCourse();
  const best = bestScores(userId);
  let wsum = 0;
  let acc = 0;
  let allPassed = true;
  for (const m of course.modules) {
    const s = best[m.slug];
    if (s === undefined || s < course.passPct) allPassed = false;
    if (s !== undefined) {
      acc += m.weight * s;
      wsum += m.weight;
    }
  }
  return { pct: wsum > 0 ? Math.round((acc / wsum) * 10) / 10 : null, allPassed };
}

export function gradeBand(pct: number): string {
  const bands = getCourse().bands;
  for (const b of bands) if (pct >= b.min) return b.name;
  return "N/A";
}

/** Recompute + persist final grade; create graduation if newly eligible. Returns certificate id if graduated. */
export function refreshGradeAndGraduation(userId: number): string | null {
  const d = getDb();
  const { pct, allPassed } = computeFinalGrade(userId);
  d.prepare("UPDATE users SET final_grade_pct = ? WHERE id = ?").run(pct, userId);
  const attested = !!d.prepare("SELECT user_id FROM attestations WHERE user_id = ?").get(userId);
  const existing = d.prepare("SELECT id FROM graduations WHERE user_id = ?").get(userId) as
    | { id: string }
    | undefined;
  if (allPassed && attested && pct !== null) {
    if (existing) {
      d.prepare("UPDATE graduations SET grade_pct = ? WHERE user_id = ?").run(pct, userId);
      return existing.id;
    }
    const id = crypto.randomUUID();
    d.prepare("INSERT INTO graduations (id, user_id, grade_pct) VALUES (?, ?, ?)").run(id, userId, pct);
    return id;
  }
  return existing?.id ?? null;
}
