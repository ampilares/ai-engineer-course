"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Ctx = {
  register: (id: string) => void;
  setCorrect: (id: string, correct: boolean) => void;
  total: number;
  correct: number;
};

const LessonCtx = createContext<Ctx | null>(null);

export function LessonInteractionsProvider({ children }: { children: React.ReactNode }) {
  const ids = useRef(new Set<string>());
  const [state, setState] = useState<Record<string, boolean>>({});

  const register = useCallback((id: string) => {
    if (!ids.current.has(id)) {
      ids.current.add(id);
      setState((s) => (id in s ? s : { ...s, [id]: false }));
    }
  }, []);

  const setCorrect = useCallback((id: string, correct: boolean) => {
    setState((s) => (s[id] === correct ? s : { ...s, [id]: correct }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const entries = Object.values(state);
    return { register, setCorrect, total: entries.length, correct: entries.filter(Boolean).length };
  }, [state, register, setCorrect]);

  return <LessonCtx.Provider value={value}>{children}</LessonCtx.Provider>;
}

export function useLessonInteractions(): Ctx | null {
  return useContext(LessonCtx);
}
