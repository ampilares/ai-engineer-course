"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

// Hand-crafted plausible attention pattern for the classic coreference example.
const TOKENS = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"];
// ATT[i][j] = how much token i attends to token j (rows sum to 1).
const ATT: number[][] = [
  [0.55, 0.25, 0.04, 0.03, 0.03, 0.04, 0.02, 0.01, 0.01, 0.01, 0.01],
  [0.18, 0.52, 0.06, 0.06, 0.03, 0.08, 0.02, 0.02, 0.01, 0.01, 0.01],
  [0.04, 0.22, 0.42, 0.16, 0.03, 0.06, 0.03, 0.01, 0.01, 0.01, 0.01],
  [0.03, 0.20, 0.14, 0.38, 0.05, 0.14, 0.02, 0.01, 0.01, 0.01, 0.01],
  [0.06, 0.04, 0.02, 0.06, 0.48, 0.28, 0.02, 0.01, 0.01, 0.01, 0.01],
  [0.03, 0.06, 0.03, 0.16, 0.20, 0.44, 0.03, 0.02, 0.01, 0.01, 0.01],
  [0.02, 0.08, 0.10, 0.12, 0.02, 0.08, 0.42, 0.06, 0.04, 0.02, 0.04],
  [0.02, 0.48, 0.03, 0.04, 0.02, 0.12, 0.06, 0.16, 0.03, 0.01, 0.03],
  [0.01, 0.10, 0.03, 0.03, 0.01, 0.04, 0.05, 0.24, 0.38, 0.04, 0.07],
  [0.01, 0.04, 0.02, 0.02, 0.01, 0.02, 0.03, 0.06, 0.08, 0.42, 0.29],
  [0.01, 0.26, 0.03, 0.03, 0.01, 0.03, 0.06, 0.18, 0.06, 0.09, 0.24],
];

export function AttentionHeatmap() {
  const [row, setRow] = useState(7); // "it"
  const weights = ATT[row];

  return (
    <WidgetFrame
      title="Attention explorer"
      onReset={() => setRow(7)}
      srSummary="Select a token in the sentence 'The animal didn't cross the street because it was too tired' and see which earlier tokens it attends to. The token 'it' attends strongly to 'animal': attention resolves references."
    >
      <p className="text-sm muted mb-2">Click a token to see where its attention goes:</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {TOKENS.map((t, i) => (
          <button key={i} type="button" onClick={() => setRow(i)}
            className={`rounded-lg border px-2 py-1 font-mono text-sm cursor-pointer transition-colors ${
              i === row ? "border-accent bg-accent text-white" : "line hover:border-accent/60"
            }`}
            style={
              i !== row
                ? { background: `color-mix(in srgb, var(--color-accent) ${Math.round(weights[i] * 130)}%, transparent)` }
                : undefined
            }>
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-1" aria-label={`Attention weights for token ${TOKENS[row]}`}>
        {TOKENS.map((t, j) => (
          <div key={j} className="flex items-center gap-2 text-xs font-mono">
            <span className="w-16 shrink-0 text-right muted">{t}</span>
            <div className="flex-1 h-3.5 rounded bg-black/5 dark:bg-white/10 overflow-hidden">
              <div className="h-full rounded transition-all duration-200"
                style={{ width: `${weights[j] * 100}%`, background: "var(--color-accent)" }} />
            </div>
            <span className="w-10 text-right muted">{(weights[j] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <p className="text-xs muted mt-3">
        Select <strong className="text-inherit">“it”</strong>: nearly half its attention goes to
        <strong className="text-inherit"> “animal”</strong>. That mixing of information between
        positions is what a self-attention head computes (here: one plausible head; real models run
        dozens per layer, learned from data).
      </p>
    </WidgetFrame>
  );
}
