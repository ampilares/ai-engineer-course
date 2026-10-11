"use client";

import { useMemo, useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

// Fixed synthetic dataset: model score (0..1) and true label. Seeded, deterministic.
function makeData(): { score: number; positive: boolean }[] {
  const pts: { score: number; positive: boolean }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 60; i++) {
    const positive = i < 24; // 40% positives (fraud-ish imbalance)
    // positives skew to high scores, negatives to low, with overlap
    const base = positive ? 0.68 : 0.32;
    const score = Math.min(0.99, Math.max(0.01, base + (rand() - 0.5) * 0.55));
    pts.push({ score, positive });
  }
  return pts.sort((a, b) => a.score - b.score);
}

const DATA = makeData();

export function SplitAndThreshold() {
  const [threshold, setThreshold] = useState(0.5);

  const { tp, fp, fn, tn, precision, recall, f1, accuracy } = useMemo(() => {
    let tp = 0, fp = 0, fn = 0, tn = 0;
    for (const p of DATA) {
      const pred = p.score >= threshold;
      if (pred && p.positive) tp++;
      else if (pred && !p.positive) fp++;
      else if (!pred && p.positive) fn++;
      else tn++;
    }
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const accuracy = (tp + tn) / DATA.length;
    return { tp, fp, fn, tn, precision, recall, f1, accuracy };
  }, [threshold]);

  return (
    <WidgetFrame
      title="Classification threshold playground"
      onReset={() => setThreshold(0.5)}
      srSummary="Move the decision threshold over model scores and watch precision, recall, F1, and the confusion matrix change. Precision and recall trade off."
    >
      <svg viewBox="0 0 600 110" className="w-full" role="img" aria-label="Model scores strip chart with threshold line">
        <line x1={20} y1={80} x2={580} y2={80} stroke="currentColor" strokeOpacity={0.3} />
        {DATA.map((p, i) => (
          <circle
            key={i}
            cx={20 + p.score * 560}
            cy={p.positive ? 45 : 66}
            r={5}
            fill={p.positive ? "var(--color-ok)" : "var(--color-bad)"}
            opacity={0.75}
          />
        ))}
        <line
          x1={20 + threshold * 560} y1={15} x2={20 + threshold * 560} y2={95}
          stroke="var(--color-accent)" strokeWidth={2.5} strokeDasharray="5 3"
        />
        <text x={20 + threshold * 560} y={12} textAnchor="middle" fontSize={11} fill="var(--color-accent)">
          threshold {threshold.toFixed(2)}
        </text>
        <text x={22} y={48} fontSize={10} fill="var(--color-ok)">● positive</text>
        <text x={22} y={70} fontSize={10} fill="var(--color-bad)">● negative</text>
        <text x={578} y={104} textAnchor="end" fontSize={10} opacity={0.6}>model score →</text>
      </svg>
      <input
        type="range" min={0} max={1} step={0.01} value={threshold}
        onChange={(e) => setThreshold(parseFloat(e.target.value))}
        className="w-full" aria-label="Decision threshold"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center text-sm">
        <div className="card p-2"><div className="text-lg font-bold">{(precision * 100).toFixed(0)}%</div><div className="text-xs muted">precision</div></div>
        <div className="card p-2"><div className="text-lg font-bold">{(recall * 100).toFixed(0)}%</div><div className="text-xs muted">recall</div></div>
        <div className="card p-2"><div className="text-lg font-bold">{(f1 * 100).toFixed(0)}%</div><div className="text-xs muted">F1</div></div>
        <div className="card p-2"><div className="text-lg font-bold">{(accuracy * 100).toFixed(0)}%</div><div className="text-xs muted">accuracy</div></div>
      </div>
      <table className="mt-3 text-xs w-full text-center">
        <tbody>
          <tr><td></td><td className="font-medium p-1">predicted +</td><td className="font-medium p-1">predicted −</td></tr>
          <tr><td className="font-medium p-1 text-left">actual +</td><td className="p-1 bg-ok/10 rounded">TP {tp}</td><td className="p-1 bg-bad/10 rounded">FN {fn}</td></tr>
          <tr><td className="font-medium p-1 text-left">actual −</td><td className="p-1 bg-bad/10 rounded">FP {fp}</td><td className="p-1 bg-ok/10 rounded">TN {tn}</td></tr>
        </tbody>
      </table>
    </WidgetFrame>
  );
}
