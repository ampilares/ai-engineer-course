"use client";

import { useMemo, useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

const CONTEXTS: Record<string, { token: string; logit: number }[]> = {
  "The capital of France is": [
    { token: " Paris", logit: 9.1 },
    { token: " the", logit: 5.2 },
    { token: " a", logit: 4.4 },
    { token: " located", logit: 4.1 },
    { token: " known", logit: 3.6 },
    { token: " Lyon", logit: 2.8 },
    { token: " beautiful", logit: 2.5 },
    { token: " home", logit: 2.2 },
    { token: " France", logit: 1.4 },
    { token: " Berlin", logit: 0.9 },
  ],
  "Once upon a time,": [
    { token: " there", logit: 7.2 },
    { token: " a", logit: 6.5 },
    { token: " in", logit: 6.1 },
    { token: " the", logit: 5.4 },
    { token: " long", logit: 4.9 },
    { token: " when", logit: 4.3 },
    { token: " far", logit: 4.0 },
    { token: " deep", logit: 3.4 },
    { token: " two", logit: 3.0 },
    { token: " nobody", logit: 2.2 },
  ],
  "import numpy as": [
    { token: " np", logit: 11.5 },
    { token: " numpy", logit: 3.2 },
    { token: " n", logit: 2.8 },
    { token: " nm", logit: 1.5 },
    { token: " pd", logit: 1.2 },
    { token: " npy", logit: 0.8 },
    { token: " N", logit: 0.5 },
    { token: " num", logit: 0.4 },
    { token: " ny", logit: -0.5 },
    { token: " x", logit: -1.0 },
  ],
};

export function softmaxWithTemp(logits: number[], temp: number): number[] {
  const t = Math.max(temp, 0.01);
  const scaled = logits.map((l) => l / t);
  const m = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function applyTopP(probs: number[], topP: number): number[] {
  const idx = probs.map((p, i) => i).sort((a, b) => probs[b] - probs[a]);
  const kept = new Set<number>();
  let acc = 0;
  for (const i of idx) {
    kept.add(i);
    acc += probs[i];
    if (acc >= topP) break;
  }
  const masked = probs.map((p, i) => (kept.has(i) ? p : 0));
  const sum = masked.reduce((a, b) => a + b, 0);
  return masked.map((p) => p / sum);
}

export function SamplingSimulator() {
  const [ctxKey, setCtxKey] = useState(Object.keys(CONTEXTS)[0]);
  const [temp, setTemp] = useState(1.0);
  const [topP, setTopP] = useState(1.0);
  const [samples, setSamples] = useState<Record<string, number> | null>(null);

  const entries = CONTEXTS[ctxKey];
  const probs = useMemo(
    () => applyTopP(softmaxWithTemp(entries.map((e) => e.logit), temp), topP),
    [entries, temp, topP]
  );

  function sample100() {
    const counts: Record<string, number> = {};
    for (let n = 0; n < 100; n++) {
      let r = Math.random();
      for (let i = 0; i < probs.length; i++) {
        r -= probs[i];
        if (r <= 0) {
          counts[entries[i].token] = (counts[entries[i].token] ?? 0) + 1;
          break;
        }
      }
    }
    setSamples(counts);
  }

  return (
    <WidgetFrame
      title="Sampling simulator"
      onReset={() => {
        setTemp(1.0);
        setTopP(1.0);
        setSamples(null);
      }}
      srSummary="Adjust temperature and top-p to reshape the next-token probability distribution. Low temperature concentrates probability on the top token; high temperature flattens it."
    >
      <label className="block text-sm mb-2">
        Context:{" "}
        <select
          value={ctxKey}
          onChange={(e) => {
            setCtxKey(e.target.value);
            setSamples(null);
          }}
          className="input w-auto! inline-block py-1!"
        >
          {Object.keys(CONTEXTS).map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </label>
      <div className="grid sm:grid-cols-2 gap-4 my-3 text-sm">
        <label>
          Temperature: <strong>{temp.toFixed(2)}</strong>
          <input
            type="range" min={0.05} max={2} step={0.05} value={temp}
            onChange={(e) => { setTemp(parseFloat(e.target.value)); setSamples(null); }}
            className="w-full"
          />
        </label>
        <label>
          Top-p: <strong>{topP.toFixed(2)}</strong>
          <input
            type="range" min={0.05} max={1} step={0.05} value={topP}
            onChange={(e) => { setTopP(parseFloat(e.target.value)); setSamples(null); }}
            className="w-full"
          />
        </label>
      </div>
      <div className="space-y-1" aria-label="Next-token probabilities">
        {entries.map((e, i) => (
          <div key={e.token} className="flex items-center gap-2 text-sm font-mono">
            <span className="w-24 shrink-0 truncate">{e.token}</span>
            <div className="flex-1 h-5 rounded bg-black/5 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded transition-all duration-200"
                style={{ width: `${probs[i] * 100}%`, background: probs[i] > 0 ? "var(--color-accent)" : "transparent" }}
              />
            </div>
            <span className="w-14 text-right muted">{(probs[i] * 100).toFixed(1)}%</span>
            {samples && <span className="w-12 text-right text-xs muted">{samples[e.token] ?? 0}×</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={sample100} className="btn-ghost text-sm">🎲 Sample 100 times</button>
        {samples && <span className="text-xs muted">counts shown on the right</span>}
      </div>
    </WidgetFrame>
  );
}
