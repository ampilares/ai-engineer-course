"use client";

import { useEffect, useId, useState } from "react";
import { useLessonInteractions } from "./LessonInteractions";

/**
 * Inline formative knowledge check. Unlimited retries; instant feedback;
 * counts toward lesson completion via LessonInteractionsProvider.
 */
export function Check({
  question,
  options,
  answer,
  explanation,
  hint,
}: {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  hint?: string;
}) {
  const id = useId();
  const ctx = useLessonInteractions();
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [wrongOnce, setWrongOnce] = useState(false);

  useEffect(() => {
    ctx?.register(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function choose(i: number) {
    if (solved) return;
    setSelected(i);
    if (i === answer) {
      setSolved(true);
      ctx?.setCorrect(id, true);
    } else {
      setWrongOnce(true);
    }
  }

  return (
    <div className="bg-card border-2 border-accent rounded-2xl p-5 my-6 not-prose" data-check>
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-accent mb-2">
        ✦ Quick check
      </p>
      <p className="font-bold mb-3">{question}</p>
      <div className="space-y-2" role="radiogroup" aria-label={question}>
        {options.map((opt, i) => {
          const isSel = selected === i;
          const cls = solved
            ? i === answer
              ? "border-ok bg-ok-tint"
              : "opacity-55 border-line"
            : isSel && i !== answer
              ? "border-bad bg-bad-tint"
              : "border-line hover:border-accent-soft";
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={solved}
              className={`w-full text-left rounded-[10px] border-2 bg-card px-3.5 py-2.5 text-[15px] transition-colors cursor-pointer ${cls}`}
              aria-pressed={isSel}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="mt-3 text-sm">
        {solved && (
          <p className="text-ok font-medium">
            ✓ Correct. <span className="text-inherit font-normal muted">{explanation}</span>
          </p>
        )}
        {!solved && wrongOnce && selected !== null && (
          <p className="text-bad">
            Not quite: try again.{hint ? ` Hint: ${hint}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
