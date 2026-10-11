"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";

/**
 * Tracks every interactive element in a lesson and which step it belongs to,
 * so the lesson player can gate "Continue" on the current step being answered.
 */
type Entry = { step: number; done: boolean };

type Ctx = {
  register: (id: string, step: number) => void;
  setDone: (id: string, done: boolean) => void;
  entries: Record<string, Entry>;
};

const LessonCtx = createContext<Ctx | null>(null);
const StepCtx = createContext<number>(-1);

export function LessonInteractionsProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<string, Entry>>({});

  const register = useCallback((id: string, step: number) => {
    setEntries((s) => (id in s ? s : { ...s, [id]: { step, done: false } }));
  }, []);

  const setDone = useCallback((id: string, done: boolean) => {
    setEntries((s) => (s[id]?.done === done ? s : { ...s, [id]: { step: s[id]?.step ?? -1, done } }));
  }, []);

  const value = useMemo<Ctx>(() => ({ register, setDone, entries }), [register, setDone, entries]);
  return <LessonCtx.Provider value={value}>{children}</LessonCtx.Provider>;
}

export function StepScope({ index, children }: { index: number; children: React.ReactNode }) {
  return <StepCtx.Provider value={index}>{children}</StepCtx.Provider>;
}

export function useLessonInteractions(): Ctx | null {
  return useContext(LessonCtx);
}

/** Registers one interactive element; call `complete()` once it is answered. */
export function useInteraction(): { complete: () => void } {
  const id = useId();
  const step = useContext(StepCtx);
  const ctx = useContext(LessonCtx);
  useEffect(() => {
    ctx?.register(id, step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, step]);
  return { complete: () => ctx?.setDone(id, true) };
}

/** True when every interaction registered in `step` has been answered. */
export function stepSatisfied(entries: Record<string, Entry>, step: number): boolean {
  return Object.values(entries).every((e) => e.step !== step || e.done);
}
