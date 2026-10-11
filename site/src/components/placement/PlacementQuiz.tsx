"use client";

import Link from "next/link";
import { useState } from "react";

// Each question tests readiness for a stage. The first stage with a wrong/no
// answer determines the recommended starting module.
type Q = {
  stage: number; // index into STAGES
  prompt: string;
  options: string[];
  correct: number; // index of the "ready" answer
};

const STAGES: { module: string; slug: string; label: string }[] = [
  { module: "Week 1 · AI Foundations", slug: "practical-foundations", label: "Start with task selection, verification, and a manual baseline." },
  { module: "Week 2 · Context and Research", slug: "practical-context", label: "Practise source checking and testable task briefs." },
  { module: "Week 4 · AI-Assisted Engineering", slug: "practical-coding", label: "Review a small change and verify its behaviour. Complete earlier practical evidence too." },
  { module: "Week 5 · Model Interfaces", slug: "practical-apis", label: "Build validated model interfaces and handle failures." },
  { module: "Week 6 · Retrieval", slug: "practical-retrieval", label: "Work with authorised, effective sources and measure retrieval quality." },
  { module: "Week 8 · Agents and Tools", slug: "practical-agents", label: "Start reviewing tool boundaries and bounded agent execution. Earlier gates still apply." },
];

const QUESTIONS: Q[] = [
  { stage: 1, prompt: "A report draft takes one minute and needs fifteen minutes of correction. What staff time counts?", options: ["One minute", "Sixteen minutes", "Only correction time"], correct: 1 },
  { stage: 1, prompt: "Where should refund authority be enforced?", options: ["In the customer's wording", "By model confidence", "In application permissions and review controls"], correct: 2 },
  { stage: 2, prompt: "A citation exists but does not support the claim. The claim is...", options: ["Unsupported", "Verified", "Probably safe to accept"], correct: 0 },
  { stage: 2, prompt: "Two identical copies share a transaction ID. How many events count?", options: ["Two", "One", "Zero"], correct: 1 },
  { stage: 3, prompt: "What makes a regression check useful?", options: ["It agrees with the generated code", "It only checks that output exists", "It fails on the defect and passes on the required behaviour"], correct: 2 },
  { stage: 3, prompt: "Does reverting code necessarily undo a message already sent?", options: ["Yes", "No", "Only if the message was AI-written"], correct: 1 },
  { stage: 4, prompt: "Schema-valid JSON proves...", options: ["Every business claim is correct", "The checked structure is valid", "The action is authorised"], correct: 1 },
  { stage: 4, prompt: "An incomplete model response should...", options: ["Enter an explicit failure or review path", "Be treated as complete", "Trigger unlimited retries"], correct: 0 },
  { stage: 5, prompt: "When should document access be filtered?", options: ["After showing the answer", "Only if the user complains", "Before restricted content reaches the model"], correct: 2 },
  { stage: 5, prompt: "The recipient commits an action, then the worker crashes. What supports a safe retry?", options: ["A new action ID", "A stable key and recipient-enforced deduplication for the same payload", "A promise in the prompt"], correct: 1 },
];

export function PlacementQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [done, setDone] = useState(false);

  const answered = answers.filter((a) => a !== null).length;

  function recommend(): (typeof STAGES)[number] {
    // Find the first stage where any question was missed; readiness for stage k
    // unlocks starting at STAGES[k].
    let readyThrough = 0;
    for (let stage = 1; stage <= 5; stage++) {
      const qs = QUESTIONS.map((q, i) => ({ q, i })).filter((x) => x.q.stage === stage);
      const allRight = qs.every(({ q, i }) => answers[i] === q.correct);
      if (allRight) readyThrough = stage;
      else break;
    }
    return STAGES[readyThrough];
  }

  if (done) {
    const rec = recommend();
    return (
      <div className="card p-6 text-center" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wider muted">Recommended starting point</p>
        <p className="text-2xl font-bold mt-2">{rec.module}</p>
        <p className="muted mt-2">{rec.label}</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href={`/course/${rec.slug}`} className="btn-primary">Start there →</Link>
          <Link href="/course" className="btn-ghost">See the full course</Link>
        </div>
        <button type="button" onClick={() => { setAnswers(Array(QUESTIONS.length).fill(null)); setDone(false); }}
          className="text-xs muted underline mt-4 cursor-pointer">
          retake
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {QUESTIONS.map((q, i) => (
        <div key={i} className="card p-4">
          <p className="font-medium mb-2 text-[15px]">{i + 1}. {q.prompt}</p>
          <div className="space-y-1.5">
            {q.options.map((opt, j) => (
              <button key={j} type="button"
                onClick={() => setAnswers((a) => a.map((v, k) => (k === i ? j : v)))}
                className={`w-full text-left rounded-lg border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                  answers[i] === j ? "border-accent bg-accent/10 font-medium" : "line hover:border-accent/50"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => setDone(true)} disabled={answered < QUESTIONS.length} className="btn-primary">
          Get my starting point
        </button>
        <span className="text-sm muted">{answered}/{QUESTIONS.length} answered</span>
      </div>
    </div>
  );
}
