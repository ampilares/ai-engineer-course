"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SanitizedQuestion = {
  id: string;
  type: "single" | "multi" | "numeric" | "short";
  prompt: string;
  code?: string;
  options?: { id: string; text: string }[];
  unit?: string;
};

type Answer = string | string[] | number;

type Result = {
  scorePct: number;
  passed: boolean;
  passPct: number;
  attemptsLeft: number;
  results: { qid: string; correct: boolean; explanation: string; correctAnswer: string }[];
  graduated: boolean;
  certificateId: string | null;
};

export function ExamRunner({
  moduleSlug,
  moduleTitle,
  attemptsLeft,
  hasOpenAttempt,
  examCount,
  poolSize,
  passPct,
  maxAttempts,
}: {
  moduleSlug: string;
  moduleTitle: string;
  attemptsLeft: number;
  hasOpenAttempt: boolean;
  examCount: number;
  poolSize: number;
  passPct: number;
  maxAttempts: number;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<SanitizedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [cursor, setCursor] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start the exam.");
        return;
      }
      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setAnswers(data.answers ?? {});
      setCursor(0);
      setPhase("running");
    } finally {
      setBusy(false);
    }
  }

  function setAnswer(qid: string, value: Answer) {
    setAnswers((a) => ({ ...a, [qid]: value }));
    // Fire-and-forget autosave.
    fetch("/api/exam/answer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, questionId: qid, answer: value }),
    }).catch(() => {});
  }

  async function submit() {
    if (!attemptId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not submit.");
        return;
      }
      setResult(data);
      setPhase("done");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (phase === "idle") {
    return (
      <div className="card rounded-[20px] px-10 py-9 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto grid place-items-center" style={{ background: "oklch(0.95 0.03 300)" }}>
          <span aria-hidden className="w-[22px] h-[22px] rotate-45" style={{ background: "oklch(0.6 0.12 300)" }} />
        </div>
        <h1 className="mt-4.5 text-[28px] font-extrabold tracking-tight">{moduleTitle} — the exam</h1>
        <p className="mt-2.5 mx-auto max-w-md text-base muted leading-relaxed">
          {examCount} questions drawn from the {poolSize}-question module pool. Pass at {passPct}%.
          Open book — understanding is what&apos;s tested, not memory.
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-5 text-sm faint font-semibold">
          <span>✓ Best of {maxAttempts} attempts counts</span>
          <span>✓ Answers autosave</span>
          <span>✓ No time limit</span>
        </div>
        {error && <p role="alert" className="text-bad text-sm mt-4">{error}</p>}
        {attemptsLeft > 0 || hasOpenAttempt ? (
          <button onClick={start} disabled={busy} className="btn-primary mt-6 px-8! py-3.5! text-base!">
            {busy ? "Preparing…" : hasOpenAttempt ? "Resume your attempt →" : "Start the exam →"}
          </button>
        ) : (
          <p className="mt-6 text-sm muted">
            You&apos;ve used all attempts for this module. Your best score stands.
          </p>
        )}
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div aria-live="polite">
        <div
          className="bg-card rounded-[20px] px-10 py-9 text-center border-2"
          style={{ borderColor: result.passed ? "var(--color-ok)" : "var(--color-bad)" }}
        >
          <div
            className="text-[56px] font-extrabold tracking-tighter leading-none"
            style={{ color: result.passed ? "var(--color-ok)" : "var(--color-bad)" }}
          >
            {result.scorePct}%
          </div>
          <p className="mt-2.5 font-bold text-lg">
            {result.passed
              ? `Passed — the ${moduleTitle} exam is in the bag. 🎉`
              : `Below the ${result.passPct}% pass mark.`}
          </p>
          <p className="text-[15px] muted mt-2 mx-auto max-w-sm">
            {result.passed
              ? "Retaking can still raise your final grade."
              : result.attemptsLeft > 0
                ? `${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? "" : "s"} left — review below, revisit the lessons, then try again.`
                : "No attempts left for this module."}
          </p>
          {result.graduated && result.certificateId && (
            <p className="mt-4 rounded-xl bg-ok-tint border border-ok/40 p-3 text-sm">
              🎓 <strong>You just graduated!</strong>{" "}
              <Link href={`/certificate/${result.certificateId}`} className="text-accent underline">
                View your certificate
              </Link>
            </p>
          )}
          <div className="mt-5 flex justify-center gap-3">
            {!result.passed && result.attemptsLeft > 0 && (
              <button onClick={() => { setPhase("idle"); setResult(null); }} className="btn-ghost">
                Retake exam
              </button>
            )}
            <Link href={`/course/${moduleSlug}`} className="btn-primary">Back to the course</Link>
          </div>
        </div>
        <h2 className="font-extrabold text-xl tracking-tight mt-9 mb-3.5">Review</h2>
        <ol className="space-y-3.5">
          {result.results.map((r, i) => {
            const q = questions.find((x) => x.id === r.qid);
            return (
              <li
                key={r.qid}
                className="bg-card rounded-[14px] px-5 py-4.5 border"
                style={{ borderColor: r.correct ? "oklch(0.85 0.06 145)" : "oklch(0.85 0.07 25)" }}
              >
                <p className="text-[15px] font-semibold leading-normal">
                  <span className={`font-extrabold ${r.correct ? "text-ok" : "text-bad"}`}>
                    {r.correct ? "✓" : "✗"}
                  </span>{" "}
                  Q{i + 1}. {q?.prompt}
                </p>
                {!r.correct && (
                  <p className="text-sm mt-2">
                    <span className="faint">Correct answer:</span> <strong>{r.correctAnswer}</strong>
                  </p>
                )}
                <p className="text-sm muted mt-1.5 leading-relaxed">{r.explanation}</p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const q = questions[cursor];
  const answered = questions.filter((x) => answers[x.id] !== undefined && answers[x.id] !== "").length;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-5" aria-label={`Question ${cursor + 1} of ${questions.length}`}>
        {questions.map((x, i) => (
          <button key={x.id} onClick={() => setCursor(i)} aria-label={`Go to question ${i + 1}`}
            className={`h-2.5 flex-1 rounded-full cursor-pointer transition-colors ${
              i === cursor ? "bg-accent" : answers[x.id] !== undefined ? "bg-accent-soft" : "bg-track"}`} />
        ))}
      </div>
      <div className="card rounded-[18px] px-8 py-7">
        <p className="text-xs font-extrabold tracking-[0.1em] faint uppercase mb-2.5">
          Question {cursor + 1} of {questions.length}
        </p>
        <p className="font-bold text-[19px] leading-snug text-pretty">{q.prompt}</p>
        {q.code && (
          <pre className="mt-3 rounded-xl border line p-3.5 text-sm overflow-x-auto font-mono" style={{ background: "var(--pre-bg)" }}>
            {q.code}
          </pre>
        )}
        <div className="mt-4.5 space-y-2.5">
          {q.type === "single" &&
            q.options!.map((o) => (
              <button key={o.id} type="button" onClick={() => setAnswer(q.id, o.id)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 text-[15.5px] leading-snug transition-colors cursor-pointer ${
                  answers[q.id] === o.id
                    ? "border-accent bg-accent-tint font-semibold"
                    : "border-line bg-card hover:border-accent-soft"}`}>
                {o.text}
              </button>
            ))}
          {q.type === "multi" &&
            q.options!.map((o) => {
              const sel = Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(o.id);
              return (
                <button key={o.id} type="button"
                  onClick={() => {
                    const cur = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                    setAnswer(q.id, sel ? cur.filter((x) => x !== o.id) : [...cur, o.id]);
                  }}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 text-[15.5px] leading-snug transition-colors cursor-pointer ${
                    sel
                      ? "border-accent bg-accent-tint font-semibold"
                      : "border-line bg-card hover:border-accent-soft"}`}>
                  <span className="mr-2">{sel ? "☑" : "☐"}</span>{o.text}
                </button>
              );
            })}
          {q.type === "numeric" && (
            <input type="number" step="any" className="input font-mono"
              value={typeof answers[q.id] === "number" ? String(answers[q.id]) : ""}
              placeholder={q.unit ? `Answer in ${q.unit}` : "Numeric answer"}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (Number.isFinite(v)) setAnswer(q.id, v);
              }} />
          )}
          {q.type === "short" && (
            <input type="text" className="input font-mono" placeholder="Short answer"
              value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
              onChange={(e) => setAnswer(q.id, e.target.value)} />
          )}
        </div>
        {q.type === "multi" && <p className="text-xs muted mt-2">Select all that apply.</p>}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <button onClick={() => setCursor((c) => Math.max(0, c - 1))} disabled={cursor === 0} className="btn-ghost">
          ← Prev
        </button>
        <span className="text-sm faint font-semibold">{answered}/{questions.length} answered</span>
        {cursor < questions.length - 1 ? (
          <button onClick={() => setCursor((c) => c + 1)} className="btn-primary shadow-none!">Next →</button>
        ) : (
          <button
            onClick={submit}
            disabled={busy}
            className="btn-primary bg-ok! hover:bg-ok-deep! shadow-[0_6px_16px_rgba(60,140,80,0.3)]!"
          >
            {busy ? "Grading…" : "Submit exam"}
          </button>
        )}
      </div>
      {error && <p role="alert" className="text-bad text-sm mt-3">{error}</p>}
      {answered < questions.length && cursor === questions.length - 1 && (
        <p className="text-[13px] faint mt-2.5 text-right">Unanswered questions count as incorrect.</p>
      )}
    </div>
  );
}
