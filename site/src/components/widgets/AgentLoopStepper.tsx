"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

type Step = { kind: "thought" | "tool" | "result" | "approval" | "final"; text: string };

const STEPS_SAFE: Step[] = [
  { kind: "thought", text: "Goal: refund order #4821 if it qualifies. First I need the order details." },
  { kind: "tool", text: "get_order(id=4821)" },
  { kind: "result", text: "{status: 'delivered', days_ago: 12, amount: €89, policy_window: 30}" },
  { kind: "thought", text: "Delivered 12 days ago, inside the 30-day window. Amount €89: refunds over €50 need human approval per my constraints." },
  { kind: "approval", text: "→ APPROVAL REQUESTED: 'Refund €89 for order #4821 (within policy)?' … approved by agent operator." },
  { kind: "tool", text: "issue_refund(order=4821, amount=89)" },
  { kind: "result", text: "{ok: true, refund_id: 'r_991'}" },
  { kind: "final", text: "Done: refund r_991 issued and customer notified. Loop ends: goal state reached." },
];

const STEPS_BAD: Step[] = [
  { kind: "thought", text: "Goal: refund order #4821. I'll just issue it." },
  { kind: "tool", text: "issue_refund(order=4821, amount=89)" },
  { kind: "result", text: "{error: 'order not found in refund system'}" },
  { kind: "thought", text: "Strange. Maybe the ID needs a prefix. I'll try variations." },
  { kind: "tool", text: "issue_refund(order='ORD-4821', amount=89)" },
  { kind: "result", text: "{error: 'order not found'}" },
  { kind: "thought", text: "Still failing. I'll try the customer's other orders…" },
  { kind: "tool", text: "issue_refund(order=4820, amount=89)" },
  { kind: "final", text: "⚠ Refunded the WRONG order. No verification step, no approval gate, no loop budget: this agent burned money and trust." },
];

const STYLE: Record<Step["kind"], { label: string; cls: string }> = {
  thought: { label: "model reasoning", cls: "border-line" },
  tool: { label: "tool call", cls: "border-accent/60 bg-accent/5 font-mono text-sm" },
  result: { label: "tool result", cls: "border-line bg-black/[.03] dark:bg-white/5 font-mono text-sm" },
  approval: { label: "human approval gate", cls: "border-amber-500/60 bg-amber-500/10" },
  final: { label: "outcome", cls: "border-ok/60 bg-ok/5" },
};

export function AgentLoopStepper() {
  const [bounded, setBounded] = useState(true);
  const [n, setN] = useState(1);
  const steps = bounded ? STEPS_SAFE : STEPS_BAD;
  const shown = steps.slice(0, n);

  return (
    <WidgetFrame
      title="Agent loop stepper"
      onReset={() => setN(1)}
      srSummary="Step through an agent's loop of reasoning, tool calls, and results. The bounded version verifies state and pauses for human approval before the consequential action; the unbounded version blindly retries and refunds the wrong order."
    >
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => { setBounded(true); setN(1); }}
          className={`btn-ghost text-sm ${bounded ? "border-ok! text-ok" : ""}`}>✓ Bounded agent</button>
        <button type="button" onClick={() => { setBounded(false); setN(1); }}
          className={`btn-ghost text-sm ${!bounded ? "border-bad! text-bad" : ""}`}>✗ Unbounded agent</button>
      </div>
      <ol className="space-y-2" aria-live="polite">
        {shown.map((s, i) => (
          <li key={i} className={`rounded-lg border p-3 ${STYLE[s.kind].cls} ${s.kind === "final" && !bounded ? "border-bad/60! bg-bad/5!" : ""}`}>
            <span className="block text-[10px] uppercase tracking-wider muted mb-1">
              step {i + 1} · {STYLE[s.kind].label}
            </span>
            {s.text}
          </li>
        ))}
      </ol>
      <div className="flex gap-2 mt-4">
        <button type="button" onClick={() => setN((v) => Math.max(1, v - 1))} disabled={n <= 1} className="btn-ghost text-sm">← Back</button>
        <button type="button" onClick={() => setN((v) => Math.min(steps.length, v + 1))} disabled={n >= steps.length} className="btn-primary text-sm">
          {n >= steps.length ? "Loop finished" : "Next step →"}
        </button>
        <span className="self-center text-xs muted">{n}/{steps.length}</span>
      </div>
    </WidgetFrame>
  );
}
