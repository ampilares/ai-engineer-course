"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

const BASE_RATE = 0.1; // control conversion rate

function simulate(n: number, uplift: number) {
  let a = 0, b = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < BASE_RATE) a++;
    if (Math.random() < BASE_RATE * (1 + uplift)) b++;
  }
  const pa = a / n, pb = b / n;
  const pPool = (a + b) / (2 * n);
  const se = Math.sqrt(pPool * (1 - pPool) * (2 / n));
  const z = se > 0 ? (pb - pa) / se : 0;
  // two-tailed p-value from z (Abramowitz-Stegun approximation of Φ)
  const phi = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  };
  const p = 2 * (1 - phi(Math.abs(z)));
  return { a, b, pa, pb, z, p };
}

export function ABTestSimulator() {
  const [uplift, setUplift] = useState(0);
  const [n, setN] = useState(500);
  const [runs, setRuns] = useState<{ pa: number; pb: number; p: number; sig: boolean }[]>([]);

  function runOnce() {
    const r = simulate(n, uplift);
    setRuns((rs) => [{ pa: r.pa, pb: r.pb, p: r.p, sig: r.p < 0.05 }, ...rs].slice(0, 8));
  }

  const sigCount = runs.filter((r) => r.sig).length;

  return (
    <WidgetFrame
      title="A/B experiment simulator"
      onReset={() => { setRuns([]); setUplift(0); setN(500); }}
      srSummary="Simulate A/B tests with a chosen true effect and sample size. With small samples, random noise produces both false positives and missed real effects; larger samples make results reliable."
    >
      <div className="grid sm:grid-cols-2 gap-4 text-sm mb-3">
        <label>
          True effect of the AI feature:{" "}
          <strong>{uplift === 0 ? "none (0%)" : `+${Math.round(uplift * 100)}% conversions`}</strong>
          <div className="flex gap-2 mt-1">
            {[0, 0.05, 0.15].map((u) => (
              <button key={u} type="button" onClick={() => { setUplift(u); setRuns([]); }}
                className={`btn-ghost py-1! px-2! text-xs ${uplift === u ? "border-accent! text-accent" : ""}`}>
                {u === 0 ? "0% (no real effect)" : `+${u * 100}%`}
              </button>
            ))}
          </div>
        </label>
        <label>
          Users per variant: <strong>{n.toLocaleString()}</strong>
          <input type="range" min={100} max={20000} step={100} value={n}
            onChange={(e) => { setN(parseInt(e.target.value, 10)); }} className="w-full" />
        </label>
      </div>
      <button type="button" onClick={runOnce} className="btn-primary text-sm mb-3">🧪 Run one experiment</button>
      {runs.length > 0 && (
        <div aria-live="polite">
          <div className="space-y-1 font-mono text-xs">
            {runs.map((r, i) => (
              <div key={i} className={`rounded border px-2 py-1.5 flex justify-between gap-2 ${
                r.sig ? "border-accent/60 bg-accent/5" : "border-line"}`}>
                <span>A: {(r.pa * 100).toFixed(1)}% · B: {(r.pb * 100).toFixed(1)}%</span>
                <span>p={r.p < 0.001 ? "<0.001" : r.p.toFixed(3)}: {r.sig ? "“significant!”" : "not significant"}</span>
              </div>
            ))}
          </div>
          <p className="text-sm muted mt-3">
            {uplift === 0
              ? sigCount > 0
                ? `⚠ ${sigCount} of ${runs.length} experiments look “significant”, but you set the true effect to ZERO. That's noise wearing a lab coat. Small samples + repeated peeking manufacture false wins.`
                : "No significant results: correct, since the true effect is zero. Keep running: eventually noise will hand you a false positive (about 1 in 20 at p<0.05)."
              : n < 3000
                ? "With a real effect but a small sample, results swing between 'significant' and 'nothing': an underpowered test can't tell truth from noise. Push the sample size up and re-run."
                : "With a real effect AND enough users per variant, experiments detect it consistently. Sample size is what buys you the right to believe your own dashboard."}
          </p>
        </div>
      )}
    </WidgetFrame>
  );
}
