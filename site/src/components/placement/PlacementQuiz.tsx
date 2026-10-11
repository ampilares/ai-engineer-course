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
  { module: "Module 1 · Python from Zero", slug: "python-foundations", label: "Start at the very beginning: the course assumes nothing and gets you coding in the browser immediately." },
  { module: "Module 2 · The Math You Actually Need", slug: "math-foundations", label: "You can code: build the four mathematical intuitions everything else uses." },
  { module: "Module 3 · Engineering Foundations", slug: "engineering-foundations", label: "Solid basics: start with APIs, SQL, testing, and Git, the plumbing of every AI system." },
  { module: "Module 5 · Data, Math & Classical ML", slug: "ml-foundations", label: "You're a working developer: start where prediction, metrics, and honest evaluation begin." },
  { module: "Module 7 · How LLMs Work", slug: "llm-foundations", label: "You have ML fundamentals: go straight to the internals of language models." },
  { module: "Module 8 · LLM Application Primitives", slug: "llm-primitives", label: "You know the internals: start building: prompts as specs, schemas, and cost control. (Skim earlier modules anytime.)" },
];

const QUESTIONS: Q[] = [
  { stage: 1, prompt: "What does this produce? [x * 2 for x in [1, 2, 3] if x > 1]", options: ["[4, 6]", "[2, 4, 6]", "An error", "I'm not sure"], correct: 0 },
  { stage: 1, prompt: "A dict lookup d['missing_key'] on an absent key…", options: ["…raises KeyError (use .get() for a safe None)", "…returns an empty string", "…creates the key", "I'm not sure"], correct: 0 },
  { stage: 2, prompt: "Two embedding vectors have cosine similarity 0.95. They are…", options: ["…pointing nearly the same direction: semantically similar", "…nearly identical in length", "…95% likely to be duplicates", "I'm not sure"], correct: 0 },
  { stage: 2, prompt: "Softmax turns a model's raw scores into…", options: ["…a probability distribution that sums to 1", "…binary yes/no decisions", "…gradients", "I'm not sure"], correct: 0 },
  { stage: 3, prompt: "An API call returns HTTP 429. You should…", options: ["…back off and retry with a limit", "…fix your request body", "…retry instantly in a loop", "I'm not sure"], correct: 0 },
  { stage: 3, prompt: "Which SQL clause filters on an aggregated value like AVG(x)?", options: ["HAVING (after GROUP BY)", "WHERE", "ORDER BY", "I'm not sure"], correct: 0 },
  { stage: 4, prompt: "A model scores 99% on training data, 74% on validation. It is…", options: ["…overfitting: memorizing instead of generalizing", "…underfitting", "…perfectly fine; ship it", "I'm not sure"], correct: 0 },
  { stage: 4, prompt: "For a 1%-positive fraud problem, accuracy is a poor metric because…", options: ["…always predicting 'no fraud' scores 99% while catching nothing: you need precision/recall", "…accuracy only works on images", "…it's too hard to compute", "I'm not sure"], correct: 0 },
  { stage: 5, prompt: "Temperature in LLM sampling controls…", options: ["…how sharply probability concentrates on top tokens (low = deterministic, high = diverse)", "…the model's knowledge cutoff", "…the context window size", "I'm not sure"], correct: 0 },
  { stage: 5, prompt: "Your assistant must answer from company docs that change weekly. The right primary tool is…", options: ["…retrieval (RAG) over the current documents", "…fine-tuning on last year's PDF", "…a bigger model", "I'm not sure"], correct: 0 },
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
