"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

// A deterministic batch: 10 records: 7 clean, 2 malformed, plus record #3
// delivered twice (webhook retry).
type Rec = { id: number; label: string; malformed: boolean; duplicate?: boolean };
const BATCH: Rec[] = [
  { id: 1, label: "order-1001", malformed: false },
  { id: 2, label: "order-1002", malformed: false },
  { id: 3, label: "order-1003", malformed: false },
  { id: 3, label: "order-1003 (redelivered)", malformed: false, duplicate: true },
  { id: 4, label: "order-1004 · missing total", malformed: true },
  { id: 5, label: "order-1005", malformed: false },
  { id: 6, label: "order-1006 · bad date format", malformed: true },
  { id: 7, label: "order-1007", malformed: false },
  { id: 8, label: "order-1008", malformed: false },
  { id: 9, label: "order-1009", malformed: false },
];

export function PipelineSimulator() {
  const [qualityGate, setQualityGate] = useState(false);
  const [idempotent, setIdempotent] = useState(false);
  const [ran, setRan] = useState(false);

  const seen = new Set<number>();
  const results = BATCH.map((r) => {
    if (idempotent && r.duplicate && seen.has(r.id)) return { r, outcome: "skipped" as const };
    seen.add(r.id);
    if (r.malformed) return { r, outcome: qualityGate ? ("dlq" as const) : ("loaded-bad" as const) };
    if (!idempotent && r.duplicate) return { r, outcome: "loaded-dup" as const };
    return { r, outcome: "loaded" as const };
  });

  const loaded = results.filter((x) => x.outcome.startsWith("loaded")).length;
  const badLoaded = results.filter((x) => x.outcome === "loaded-bad").length;
  const dupLoaded = results.filter((x) => x.outcome === "loaded-dup").length;
  const dlq = results.filter((x) => x.outcome === "dlq").length;

  const STYLE: Record<string, string> = {
    loaded: "border-ok/50 bg-ok/5",
    "loaded-bad": "border-bad/60 bg-bad/10",
    "loaded-dup": "border-bad/60 bg-bad/10",
    dlq: "border-amber-500/60 bg-amber-500/10",
    skipped: "border-line opacity-60",
  };
  const LABEL: Record<string, string> = {
    loaded: "loaded ✓",
    "loaded-bad": "loaded CORRUPT ✗",
    "loaded-dup": "loaded TWICE ✗",
    dlq: "→ dead-letter queue",
    skipped: "duplicate skipped",
  };

  return (
    <WidgetFrame
      title="Pipeline simulator: one batch, two safeguards"
      onReset={() => { setQualityGate(false); setIdempotent(false); setRan(false); }}
      srSummary="Run a batch of records through an ingestion pipeline. Without a quality gate, malformed records corrupt the dataset; without idempotency, a redelivered record is loaded twice. Enabling each safeguard fixes its failure mode."
    >
      <div className="flex flex-wrap gap-4 mb-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={qualityGate} onChange={(e) => { setQualityGate(e.target.checked); }} />
          Quality gate (validate before load; failures → DLQ)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={idempotent} onChange={(e) => { setIdempotent(e.target.checked); }} />
          Idempotent load (dedupe on record ID)
        </label>
      </div>
      <button type="button" onClick={() => setRan(true)} className="btn-primary text-sm mb-3">
        ▶ Run the batch (10 deliveries)
      </button>
      {ran && (
        <div aria-live="polite">
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            {results.map(({ r, outcome }, i) => (
              <div key={i} className={`rounded border px-2 py-1 flex justify-between gap-2 ${STYLE[outcome]}`}>
                <span className="truncate">{r.label}</span>
                <span className="shrink-0">{LABEL[outcome]}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm mt-3">
            <div className="card p-2"><div className="text-lg font-bold">{loaded}</div><div className="text-xs muted">rows loaded</div></div>
            <div className={`card p-2 ${badLoaded + dupLoaded > 0 ? "border-bad/60" : "border-ok/50"}`}>
              <div className="text-lg font-bold">{badLoaded + dupLoaded}</div>
              <div className="text-xs muted">corrupt/duplicate rows</div>
            </div>
            <div className="card p-2"><div className="text-lg font-bold">{dlq}</div><div className="text-xs muted">held for review (DLQ)</div></div>
          </div>
          <p className="text-sm muted mt-3">
            {badLoaded + dupLoaded === 0
              ? "✓ Clean dataset: bad records are quarantined where a human can inspect them, and the redelivery was harmless. This is what 'trustworthy pipeline' means mechanically."
              : "The dataset now silently contains " +
                (badLoaded ? `${badLoaded} corrupt row${badLoaded > 1 ? "s" : ""}` : "") +
                (badLoaded && dupLoaded ? " and " : "") +
                (dupLoaded ? "a double-counted order" : "") +
                ", and every model, report, and RAG index downstream inherits the damage. Toggle the safeguards and re-run."}
          </p>
        </div>
      )}
    </WidgetFrame>
  );
}
