"use client";

import { useMemo, useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

const DOC = [
  "Employees may work remotely up to three days per week with manager approval.",
  "Remote work requests must be submitted through the HR portal at least one week in advance.",
  "The company reimburses home office equipment up to 500 EUR per calendar year.",
  "Reimbursement claims require an itemized receipt and are processed within 30 days.",
  "All company data must be accessed through the corporate VPN when working outside the office.",
  "Security incidents must be reported to the IT service desk within 24 hours of discovery.",
  "Annual leave accrues at 2.5 days per month for full-time employees.",
  "Unused annual leave may be carried over into the first quarter of the following year.",
  "Parental leave extends to 16 weeks fully paid for primary caregivers.",
  "Sabbaticals of up to three months are available after five years of continuous service.",
];

const STOP = new Set(["the", "a", "an", "of", "to", "in", "for", "is", "are", "and", "or", "with", "at", "be", "may", "must", "up", "per"]);

function words(s: string): Set<string> {
  return new Set(
    s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w && !STOP.has(w))
  );
}

export function scoreChunk(query: string, chunk: string): number {
  const q = words(query);
  const c = words(chunk);
  if (q.size === 0) return 0;
  let overlap = 0;
  for (const w of q) if (c.has(w)) overlap++;
  return overlap / q.size;
}

export function ChunkAndRetrieve() {
  const [size, setSize] = useState(2);
  const [query, setQuery] = useState("how much home office equipment can I expense");

  const chunks = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < DOC.length; i += size) out.push(DOC.slice(i, i + size).join(" "));
    return out;
  }, [size]);

  const ranked = useMemo(
    () =>
      chunks
        .map((c, i) => ({ i, c, s: scoreChunk(query, c) }))
        .sort((a, b) => b.s - a.s),
    [chunks, query]
  );
  const best = ranked[0]?.s ?? 0;

  return (
    <WidgetFrame
      title="Chunking & retrieval explorer"
      onReset={() => { setSize(2); setQuery("how much home office equipment can I expense"); }}
      srSummary="Split a policy document into chunks of different sizes and see which chunk a query retrieves. Chunk size changes what is findable: too small loses context, too large dilutes relevance."
    >
      <label className="block text-sm mb-2">
        Query
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="input mt-1" />
      </label>
      <label className="block text-sm mb-3">
        Chunk size: <strong>{size} sentence{size > 1 ? "s" : ""}</strong> → {chunks.length} chunks
        <input type="range" min={1} max={5} step={1} value={size}
          onChange={(e) => setSize(parseInt(e.target.value, 10))} className="w-full" />
      </label>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {ranked.map(({ i, c, s }) => (
          <div key={i}
            className={`rounded-lg border p-2.5 text-sm ${s === best && s > 0 ? "border-accent bg-accent/5" : "line"}`}>
            <div className="flex justify-between text-xs muted mb-1">
              <span>chunk {i + 1}</span>
              <span>relevance {(s * 100).toFixed(0)}%{s === best && s > 0 ? " · retrieved" : ""}</span>
            </div>
            {c}
          </div>
        ))}
      </div>
      <p className="text-xs muted mt-3">
        Scoring here is simple word overlap; real systems use embedding similarity (and often both,
        “hybrid retrieval”), but the chunking trade-off is identical.
      </p>
    </WidgetFrame>
  );
}
