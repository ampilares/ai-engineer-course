"use client";

import { useMemo, useState } from "react";
import { useInteraction } from "./LessonInteractions";

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

type Tone = "check" | "sort" | "order" | "numeric" | "reveal";

const KICKERS: Record<Tone, { label: string; icon: string }> = {
  check: { label: "Your turn", icon: "?" },
  sort: { label: "Sort it", icon: "⇄" },
  order: { label: "Put it in order", icon: "↕" },
  numeric: { label: "Work it out", icon: "#" },
  reveal: { label: "Think first", icon: "💭" },
};

function Card({ tone, title, children }: { tone: Tone; title: string; children: React.ReactNode }) {
  const k = KICKERS[tone];
  return (
    <section className="interaction not-prose" aria-label={`${k.label}: ${title}`} data-check>
      <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-accent mb-2.5">
        <span aria-hidden className="w-5 h-5 rounded-md bg-accent-tint grid place-items-center text-[11px]">{k.icon}</span>
        {k.label}
      </p>
      <p className="font-bold text-[17px] leading-snug mb-4 text-pretty">{title}</p>
      {children}
    </section>
  );
}

function Feedback({ state, explanation, hint }: { state: "idle" | "right" | "wrong" | "revealed"; explanation?: string; hint?: string }) {
  if (state === "idle") return <div aria-live="polite" />;
  const right = state === "right";
  const revealed = state === "revealed";
  return (
    <div aria-live="polite"
      className={`feedback mt-4 rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
        right ? "bg-ok-tint text-ok-deep" : revealed ? "bg-accent-tint text-ink" : "bg-bad-tint text-bad-deep"}`}>
      <p className="font-bold">
        {right ? pick(["Nice — that's it.", "Correct!", "Exactly right."], explanation) : revealed ? "Here's the answer." : "Not quite — have another go."}
      </p>
      {(right || revealed) && explanation && <p className="mt-1 text-ink-soft">{explanation}</p>}
      {state === "wrong" && hint && <p className="mt-1 text-ink-soft">Hint: {hint}</p>}
    </div>
  );
}

/** Stable pseudo-random choice so server and client render the same text. */
function pick<T>(list: T[], seed = ""): T {
  return list[hash(seed) % list.length];
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Deterministic shuffle that never returns the original order (when n > 1). */
function shuffled<T>(items: T[], seed: string): number[] {
  const idx = items.map((_, i) => i);
  let h = hash(seed) || 1;
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  if (idx.length > 1 && idx.every((v, i) => v === i)) idx.push(idx.shift()!);
  return idx;
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center gap-2.5">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Multiple choice                                                     */
/* ------------------------------------------------------------------ */

export function Check({ question, options, answer, explanation, hint }: {
  question: string; options: string[]; answer: number; explanation: string; hint?: string;
}) {
  const { complete } = useInteraction();
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "right" | "wrong" | "revealed">("idle");
  const [misses, setMisses] = useState(0);
  const locked = state === "right" || state === "revealed";

  function submit() {
    if (selected === null) return;
    if (selected === answer) { setState("right"); complete(); }
    else { setState("wrong"); setMisses((m) => m + 1); }
  }

  return (
    <Card tone="check" title={question}>
      <div className="grid gap-2.5" role="radiogroup" aria-label={question}>
        {options.map((opt, i) => {
          const isSel = selected === i;
          const cls = locked
            ? i === answer ? "border-ok bg-ok-tint" : "opacity-50 border-line"
            : state === "wrong" && isSel ? "border-bad bg-bad-tint shake"
            : isSel ? "border-accent bg-accent-tint" : "border-line hover:border-accent-soft";
          return (
            <button key={i} type="button" role="radio" aria-checked={isSel} disabled={locked}
              onClick={() => { setSelected(i); if (state === "wrong") setState("idle"); }}
              className={`option ${cls}`}>
              <span className={`option-key ${isSel || (locked && i === answer) ? "bg-accent text-white border-accent" : ""} ${locked && i === answer ? "bg-ok! border-ok!" : ""}`}>
                {locked && i === answer ? "✓" : "ABCD"[i]}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
      {!locked && (
        <Actions>
          <button type="button" className="btn-primary" disabled={selected === null || state === "wrong"} onClick={submit}>Check</button>
          {misses >= 2 && (
            <button type="button" className="btn-ghost" onClick={() => { setSelected(answer); setState("revealed"); complete(); }}>Show answer</button>
          )}
        </Actions>
      )}
      <Feedback state={state} explanation={explanation} hint={hint} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Sort items into buckets (tap an item, then tap a bucket)            */
/* ------------------------------------------------------------------ */

export function Sort({ prompt, buckets, items, explanation }: {
  prompt: string; buckets: string[]; items: { text: string; bucket: number }[]; explanation: string;
}) {
  const { complete } = useInteraction();
  const order = useMemo(() => shuffled(items, prompt), [items, prompt]);
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const [active, setActive] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [state, setState] = useState<"idle" | "right" | "wrong" | "revealed">("idle");
  const [misses, setMisses] = useState(0);
  const locked = state === "right" || state === "revealed";
  const pool = order.filter((i) => placed[i] === undefined);
  const allPlaced = pool.length === 0;

  function drop(b: number) {
    if (active === null || locked) return;
    setPlaced((p) => ({ ...p, [active]: b }));
    setActive(pool.find((i) => i !== active) ?? null);
    setChecked(false);
    setState("idle");
  }
  function unplace(i: number) {
    if (locked) return;
    setPlaced((p) => { const n = { ...p }; delete n[i]; return n; });
    setActive(i);
    setChecked(false);
    setState("idle");
  }
  function submit() {
    setChecked(true);
    const ok = items.every((it, i) => placed[i] === it.bucket);
    if (ok) { setState("right"); complete(); }
    else {
      setState("wrong");
      setMisses((m) => m + 1);
    }
  }
  function retry() {
    setPlaced((p) => Object.fromEntries(Object.entries(p).filter(([i, b]) => items[+i].bucket === b)));
    setChecked(false);
    setState("idle");
    setActive(null);
  }
  function reveal() {
    setPlaced(Object.fromEntries(items.map((it, i) => [i, it.bucket])));
    setChecked(true);
    setState("revealed");
    complete();
  }

  return (
    <Card tone="sort" title={prompt}>
      <p className="text-sm muted -mt-2 mb-3">{locked ? "All sorted." : active !== null ? "Now tap the group it belongs in." : "Tap an item, then tap the group it belongs in."}</p>
      {pool.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4" aria-label="Items to sort">
          {pool.map((i) => (
            <button key={i} type="button" onClick={() => setActive(active === i ? null : i)} aria-pressed={active === i}
              className={`chip ${active === i ? "border-accent bg-accent text-white shadow-[0_6px_16px_rgba(59,91,219,0.3)] -translate-y-0.5" : ""}`}>
              {items[i].text}
            </button>
          ))}
        </div>
      )}
      <div className={`grid gap-2.5 ${buckets.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {buckets.map((b, bi) => (
          <div key={bi} role="button" tabIndex={0} onClick={() => drop(bi)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); drop(bi); } }}
            aria-label={`Place in ${b}`}
            className={`bucket ${active !== null && !locked ? "border-accent border-dashed bg-accent-tint/60 cursor-pointer" : ""}`}>
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-ink-soft mb-2">{b}</p>
            <div className="flex flex-wrap gap-1.5 min-h-9">
              {order.filter((i) => placed[i] === bi).map((i) => {
                const wrong = checked && items[i].bucket !== bi;
                const right = checked && !wrong;
                return (
                  <button key={i} type="button" onClick={(e) => { e.stopPropagation(); unplace(i); }} disabled={locked}
                    className={`chip text-[13.5px]! py-1.5! ${right ? "border-ok bg-ok-tint" : wrong ? "border-bad bg-bad-tint" : ""}`}>
                    {right && "✓ "}{items[i].text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!locked && (
        <Actions>
          {state === "wrong"
            ? <button type="button" className="btn-primary" onClick={retry}>Try again</button>
            : <button type="button" className="btn-primary" disabled={!allPlaced} onClick={submit}>Check</button>}
          {misses >= 2 && <button type="button" className="btn-ghost" onClick={reveal}>Show answer</button>}
        </Actions>
      )}
      <Feedback state={state} explanation={explanation} hint={state === "wrong" ? "Items marked red are in the wrong group." : undefined} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Put steps in order                                                  */
/* ------------------------------------------------------------------ */

export function Order({ prompt, steps, explanation }: { prompt: string; steps: string[]; explanation: string }) {
  const { complete } = useInteraction();
  const initial = useMemo(() => shuffled(steps, prompt), [steps, prompt]);
  const [seq, setSeq] = useState<number[]>(initial);
  const [checked, setChecked] = useState(false);
  const [state, setState] = useState<"idle" | "right" | "wrong" | "revealed">("idle");
  const [misses, setMisses] = useState(0);
  const locked = state === "right" || state === "revealed";

  function move(pos: number, delta: number) {
    const to = pos + delta;
    if (to < 0 || to >= seq.length || locked) return;
    const next = [...seq];
    [next[pos], next[to]] = [next[to], next[pos]];
    setSeq(next);
    setChecked(false);
    setState("idle");
  }
  function submit() {
    setChecked(true);
    if (seq.every((v, i) => v === i)) { setState("right"); complete(); }
    else { setState("wrong"); setMisses((m) => m + 1); }
  }

  return (
    <Card tone="order" title={prompt}>
      <p className="text-sm muted -mt-2 mb-3">Use the arrows to move each step into place.</p>
      <ol className="grid gap-2">
        {seq.map((v, pos) => {
          const right = checked && v === pos;
          const wrong = checked && v !== pos;
          return (
            <li key={v} className={`order-row ${right ? "border-ok bg-ok-tint" : wrong ? "border-bad bg-bad-tint" : ""}`}>
              <span className={`option-key ${right ? "bg-ok! border-ok! text-white" : ""}`}>{right ? "✓" : pos + 1}</span>
              <span className="flex-1 text-[15px] leading-snug">{steps[v]}</span>
              {!locked && (
                <span className="flex flex-col sm:flex-row gap-1 shrink-0">
                  <button type="button" className="arrow-btn" onClick={() => move(pos, -1)} disabled={pos === 0} aria-label={`Move “${steps[v]}” up`}>↑</button>
                  <button type="button" className="arrow-btn" onClick={() => move(pos, 1)} disabled={pos === seq.length - 1} aria-label={`Move “${steps[v]}” down`}>↓</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!locked && (
        <Actions>
          <button type="button" className="btn-primary" disabled={state === "wrong"} onClick={submit}>Check order</button>
          {misses >= 2 && (
            <button type="button" className="btn-ghost" onClick={() => { setSeq(steps.map((_, i) => i)); setChecked(true); setState("revealed"); complete(); }}>Show answer</button>
          )}
        </Actions>
      )}
      <Feedback state={state} explanation={explanation} hint={state === "wrong" ? "Green steps are already in the right place." : undefined} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Numeric answer                                                      */
/* ------------------------------------------------------------------ */

export function NumericCheck({ question, answer, tolerance = 0, unit, explanation }: {
  question: string; answer: number; tolerance?: number; unit?: string; explanation: string;
}) {
  const { complete } = useInteraction();
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "right" | "wrong" | "revealed">("idle");
  const [misses, setMisses] = useState(0);
  const locked = state === "right" || state === "revealed";

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const n = Number(value.replace(/[,\s$%]/g, ""));
    if (value.trim() === "" || Number.isNaN(n)) return;
    if (Math.abs(n - answer) <= Math.max(tolerance, 1e-9)) { setState("right"); complete(); }
    else { setState("wrong"); setMisses((m) => m + 1); }
  }

  return (
    <Card tone="numeric" title={question}>
      <form onSubmit={submit} className="flex flex-wrap items-center gap-2.5">
        <label className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
          <span className="sr-only">Your answer</span>
          <input inputMode="decimal" className={`input text-lg! font-semibold ${state === "wrong" ? "border-bad! shake" : locked ? "border-ok!" : ""}`}
            value={locked && state === "revealed" ? String(answer) : value} disabled={locked}
            onChange={(e) => { setValue(e.target.value); if (state === "wrong") setState("idle"); }} placeholder="Your answer" />
          {unit && <span className="muted font-semibold whitespace-nowrap">{unit}</span>}
        </label>
        {!locked && <button type="submit" className="btn-primary" disabled={!value.trim() || state === "wrong"}>Check</button>}
        {!locked && misses >= 2 && (
          <button type="button" className="btn-ghost" onClick={() => { setState("revealed"); complete(); }}>Show answer</button>
        )}
      </form>
      <Feedback state={state} explanation={explanation} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Think first, then reveal (ungraded)                                 */
/* ------------------------------------------------------------------ */

export function Reveal({ prompt, answer }: { prompt: string; answer: string }) {
  const { complete } = useInteraction();
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Card tone="reveal" title={prompt}>
      <textarea className="input min-h-20 resize-y text-[15px]!" placeholder="Jot down your answer first (optional, not saved)…"
        value={note} onChange={(e) => setNote(e.target.value)} disabled={open} aria-label="Your thoughts" />
      {!open ? (
        <Actions>
          <button type="button" className="btn-primary" onClick={() => { setOpen(true); complete(); }}>Reveal a model answer</button>
        </Actions>
      ) : (
        <div aria-live="polite" className="feedback mt-4 rounded-xl px-4 py-3 bg-accent-tint text-[15px] leading-relaxed">
          <p className="font-bold">A strong answer</p>
          <p className="mt-1 text-ink-soft">{answer}</p>
          {note.trim() && <p className="mt-2 text-sm faint">Compare it with what you wrote: what did you include, and what did you miss?</p>}
        </div>
      )}
    </Card>
  );
}
