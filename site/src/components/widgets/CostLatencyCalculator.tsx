"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

const PRESETS = [
  { name: "Frontier model", inPrice: 3.0, outPrice: 15.0, latencyMs: 40 },
  { name: "Mid-tier model", inPrice: 0.8, outPrice: 4.0, latencyMs: 18 },
  { name: "Small/fast model", inPrice: 0.1, outPrice: 0.4, latencyMs: 6 },
];

export function CostLatencyCalculator() {
  const [preset, setPreset] = useState(0);
  const [inTok, setInTok] = useState(2000);
  const [outTok, setOutTok] = useState(500);
  const [reqPerDay, setReqPerDay] = useState(1000);
  const [cacheHit, setCacheHit] = useState(0);

  const p = PRESETS[preset];
  const cachedShare = cacheHit / 100;
  // Cached input typically billed ~10% of normal input price
  const effInPrice = p.inPrice * (1 - cachedShare) + p.inPrice * 0.1 * cachedShare;
  const perReq = (inTok / 1e6) * effInPrice + (outTok / 1e6) * p.outPrice;
  const monthly = perReq * reqPerDay * 30;
  const latency = 300 + outTok * p.latencyMs; // TTFT + per-token generation, illustrative

  const num = (v: number, set: (n: number) => void, label: string, max: number, step: number) => (
    <label className="block text-sm">
      {label}: <strong>{v.toLocaleString()}</strong>
      <input type="range" min={step} max={max} step={step} value={v}
        onChange={(e) => set(parseInt(e.target.value, 10))} className="w-full" />
    </label>
  );

  return (
    <WidgetFrame
      title="Cost & latency calculator"
      onReset={() => { setPreset(0); setInTok(2000); setOutTok(500); setReqPerDay(1000); setCacheHit(0); }}
      srSummary="Estimate monthly cost and response latency from token counts, request volume, model tier, and cache hit rate. Output tokens dominate both cost and latency."
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map((pr, i) => (
          <button key={pr.name} type="button" onClick={() => setPreset(i)}
            className={`btn-ghost py-1! px-2! text-xs ${i === preset ? "border-accent! text-accent" : ""}`}>
            {pr.name} (${pr.inPrice}/${pr.outPrice} per 1M)
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
        {num(inTok, setInTok, "Input tokens per request", 50000, 250)}
        {num(outTok, setOutTok, "Output tokens per request", 8000, 50)}
        {num(reqPerDay, setReqPerDay, "Requests per day", 100000, 100)}
        <label className="block text-sm">
          Prompt-cache hit rate: <strong>{cacheHit}%</strong>
          <input type="range" min={0} max={95} step={5} value={cacheHit}
            onChange={(e) => setCacheHit(parseInt(e.target.value, 10))} className="w-full" />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="card p-3"><div className="text-xl font-bold">${perReq < 0.01 ? perReq.toFixed(5) : perReq.toFixed(3)}</div><div className="text-xs muted">per request</div></div>
        <div className="card p-3"><div className="text-xl font-bold">${monthly < 100 ? monthly.toFixed(2) : Math.round(monthly).toLocaleString()}</div><div className="text-xs muted">per month</div></div>
        <div className="card p-3"><div className="text-xl font-bold">{(latency / 1000).toFixed(1)}s</div><div className="text-xs muted">≈ response time</div></div>
      </div>
      <p className="text-xs muted mt-3">
        Illustrative prices. Note how output tokens cost ~5× input and dominate latency: the cheapest
        optimization is usually “generate less.”
      </p>
    </WidgetFrame>
  );
}
