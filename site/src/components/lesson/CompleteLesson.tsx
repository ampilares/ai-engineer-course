"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLessonInteractions } from "./LessonInteractions";

export function CompleteLesson({
  moduleSlug,
  lessonSlug,
  nextHref,
  alreadyDone,
  signedIn,
}: {
  moduleSlug: string;
  lessonSlug: string;
  nextHref: string;
  alreadyDone: boolean;
  signedIn: boolean;
}) {
  const ctx = useLessonInteractions();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(alreadyDone);

  const total = ctx?.total ?? 0;
  const correct = ctx?.correct ?? 0;
  const ready = total === 0 || correct === total;

  async function complete() {
    setBusy(true);
    try {
      const res = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleSlug, lesson: lessonSlug }),
      });
      if (res.ok) {
        setDone(true);
        router.push(nextHref);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  if (!signedIn) {
    return (
      <div className="card p-5 mt-10 text-center">
        <p className="mb-3 font-medium">Create a free account to save your progress and take the exams.</p>
        <a href="/register" className="btn-primary">Start free</a>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-2">
      {!ready && (
        <p className="text-sm muted">
          Answer the {total} check{total === 1 ? "" : "s"} above to finish this lesson ({correct}/{total} solved).
        </p>
      )}
      {done && !busy ? (
        <div className="flex items-center gap-3">
          <span className="text-ok-deep font-semibold">✓ Lesson complete</span>
          <button onClick={() => router.push(nextHref)} className="btn-ghost">Continue →</button>
        </div>
      ) : (
        <button
          onClick={complete}
          disabled={!ready || busy}
          className="btn-primary bg-ok! hover:bg-ok-deep! shadow-[0_6px_16px_rgba(60,140,80,0.3)]!"
        >
          {busy ? "Saving…" : done ? "Continue →" : "Complete & continue →"}
        </button>
      )}
    </div>
  );
}
