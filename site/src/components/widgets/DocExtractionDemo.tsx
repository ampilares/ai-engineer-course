"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

type Field = { name: string; value: string; clean: number; blurry: number; blurryValue?: string };
const FIELDS: Field[] = [
  { name: "vendor", value: "Nordwind Logistics GmbH", clean: 0.98, blurry: 0.91 },
  { name: "invoice_number", value: "INV-88213", clean: 0.97, blurry: 0.63, blurryValue: "1NV-88Z13" },
  { name: "date", value: "2026-07-02", clean: 0.96, blurry: 0.88 },
  { name: "total", value: "€ 4,180.00", clean: 0.95, blurry: 0.58, blurryValue: "€ 4,780.00" },
  { name: "iban", value: "DE89 3704 0044 0532 0130 00", clean: 0.93, blurry: 0.41, blurryValue: "DE89 3704 0044 0532 0730 00" },
];

export function DocExtractionDemo() {
  const [blurry, setBlurry] = useState(false);
  const [threshold, setThreshold] = useState(0.9);
  const [showBoxes, setShowBoxes] = useState(true);

  const rows = FIELDS.map((f) => {
    const conf = blurry ? f.blurry : f.clean;
    const value = blurry && f.blurryValue ? f.blurryValue : f.value;
    return { ...f, conf, shown: value, autoAccept: conf >= threshold };
  });
  const review = rows.filter((r) => !r.autoAccept).length;
  const wrongAccepted = rows.filter((r) => r.autoAccept && blurry && r.blurryValue).length;

  return (
    <WidgetFrame
      title="Document extraction: confidence is the product"
      onReset={() => { setBlurry(false); setThreshold(0.9); setShowBoxes(true); }}
      srSummary="An invoice is OCR'd and fields extracted with confidence scores. A blurry scan lowers confidence and introduces character errors; the confidence threshold decides which fields are auto-accepted versus sent to human review."
    >
      <div className="flex flex-wrap gap-4 mb-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={blurry} onChange={(e) => setBlurry(e.target.checked)} />
          Blurry re-scanned copy (real-world quality)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showBoxes} onChange={(e) => setShowBoxes(e.target.checked)} />
          Show detected regions
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Mock document */}
        <svg viewBox="0 0 280 360" className="w-full rounded-lg border line" role="img"
          aria-label="Mock invoice document with detected field regions"
          style={{ background: "var(--color-card)", filter: blurry ? "blur(0.6px) contrast(0.85)" : undefined }}>
          <text x={20} y={36} fontSize={15} fontWeight={700} fill="currentColor">Nordwind Logistics GmbH</text>
          <text x={20} y={54} fontSize={9} fill="currentColor" opacity={0.6}>Hafenstraße 12 · 20457 Hamburg</text>
          <text x={20} y={92} fontSize={11} fontWeight={600} fill="currentColor">INVOICE  INV-88213</text>
          <text x={20} y={110} fontSize={10} fill="currentColor" opacity={0.8}>Date: 2026-07-02</text>
          <line x1={20} y1={130} x2={260} y2={130} stroke="currentColor" strokeOpacity={0.3} />
          <text x={20} y={152} fontSize={10} fill="currentColor">Freight services June</text>
          <text x={220} y={152} fontSize={10} fill="currentColor">3,900.00</text>
          <text x={20} y={170} fontSize={10} fill="currentColor">Fuel surcharge</text>
          <text x={220} y={170} fontSize={10} fill="currentColor">280.00</text>
          <line x1={20} y1={190} x2={260} y2={190} stroke="currentColor" strokeOpacity={0.3} />
          <text x={20} y={214} fontSize={12} fontWeight={700} fill="currentColor">TOTAL  € 4,180.00</text>
          <text x={20} y={300} fontSize={9} fill="currentColor" opacity={0.7}>Pay to: DE89 3704 0044 0532 0130 00</text>
          {showBoxes && (
            <>
              <rect x={16} y={22} width={190} height={20} fill="none" stroke="var(--color-accent)" strokeDasharray="4 2" />
              <rect x={16} y={80} width={150} height={18} fill="none" stroke="var(--color-accent)" strokeDasharray="4 2" />
              <rect x={16} y={98} width={120} height={18} fill="none" stroke="var(--color-accent)" strokeDasharray="4 2" />
              <rect x={16} y={200} width={160} height={20} fill="none" stroke="var(--color-accent)" strokeDasharray="4 2" />
              <rect x={16} y={288} width={230} height={18} fill="none" stroke="var(--color-accent)" strokeDasharray="4 2" />
            </>
          )}
        </svg>
        {/* Extraction result */}
        <div>
          <label className="block text-sm mb-2">
            Auto-accept threshold: <strong>{Math.round(threshold * 100)}%</strong>
            <input type="range" min={0.3} max={0.99} step={0.01} value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full" />
          </label>
          <div className="space-y-1.5 font-mono text-xs">
            {rows.map((r) => (
              <div key={r.name}
                className={`rounded border px-2 py-1.5 flex items-center justify-between gap-2 ${
                  r.autoAccept
                    ? blurry && r.blurryValue ? "border-bad/60 bg-bad/10" : "border-ok/50 bg-ok/5"
                    : "border-amber-500/60 bg-amber-500/10"}`}>
                <span className="truncate"><span className="muted">{r.name}:</span> {r.shown}</span>
                <span className="shrink-0">{Math.round(r.conf * 100)}% {r.autoAccept ? "auto" : "→ review"}</span>
              </div>
            ))}
          </div>
          <p className="text-sm muted mt-3" aria-live="polite">
            {blurry
              ? wrongAccepted > 0
                ? `⚠ ${wrongAccepted} corrupted field${wrongAccepted > 1 ? "s were" : " was"} auto-accepted: a wrong IBAN or total is now headed for the payment system. Raise the threshold until every damaged field routes to review.`
                : `✓ All ${review} damaged fields route to human review; only trustworthy fields pass automatically. That's confidence routing doing its job on messy real-world scans.`
              : "Clean scan: everything extracts with high confidence. Now toggle the blurry copy: the real world ships blurry."}
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}
