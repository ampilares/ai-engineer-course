"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

// Loss surface: valley at x≈2 with a bump creating a local minimum near x≈-1.5.
export function loss(x: number): number {
  return 0.08 * (x - 2) ** 2 + 0.9 * Math.exp(-((x + 1.5) ** 2)) * -0.0 + 0.35 * Math.sin(1.5 * x) + 1.2;
}
export function grad(x: number): number {
  return 0.16 * (x - 2) + 0.525 * Math.cos(1.5 * x);
}

const X_MIN = -5, X_MAX = 7;

function sx(x: number) { return ((x - X_MIN) / (X_MAX - X_MIN)) * 560 + 20; }
function sy(y: number) { return 190 - (y / 3) * 150; }

export function GradientDescentPlayground() {
  const [lr, setLr] = useState(0.5);
  const [trail, setTrail] = useState<number[]>([-4]);

  const x = trail[trail.length - 1];

  function step(n = 1) {
    setTrail((t) => {
      const out = [...t];
      for (let i = 0; i < n; i++) {
        const cur = out[out.length - 1];
        let next = cur - lr * grad(cur) * 6; // scaled for visible steps
        next = Math.max(X_MIN, Math.min(X_MAX, next));
        out.push(next);
      }
      return out.slice(-60);
    });
  }

  const curve: string = Array.from({ length: 121 }, (_, i) => {
    const xv = X_MIN + (i / 120) * (X_MAX - X_MIN);
    return `${i === 0 ? "M" : "L"}${sx(xv).toFixed(1)},${sy(loss(xv)).toFixed(1)}`;
  }).join(" ");

  return (
    <WidgetFrame
      title="Gradient descent playground"
      onReset={() => setTrail([-4])}
      srSummary="Step a parameter downhill on a loss curve. Small learning rates converge slowly; large ones overshoot and oscillate or diverge."
    >
      <svg viewBox="0 0 600 210" className="w-full" role="img" aria-label="Loss curve with the current parameter position and its step trail">
        <path d={curve} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={2} />
        {trail.map((tx, i) =>
          i < trail.length - 1 ? (
            <line key={i} x1={sx(tx)} y1={sy(loss(tx))} x2={sx(trail[i + 1])} y2={sy(loss(trail[i + 1]))}
              stroke="var(--color-accent)" strokeOpacity={0.35 + (i / trail.length) * 0.5} strokeWidth={1.5} />
          ) : null
        )}
        <circle cx={sx(x)} cy={sy(loss(x))} r={7} fill="var(--color-accent)" />
        <text x={sx(x)} y={sy(loss(x)) - 12} textAnchor="middle" fontSize={11} fill="var(--color-accent)">
          loss {loss(x).toFixed(2)}
        </text>
      </svg>
      <div className="flex flex-wrap items-end gap-4 mt-2">
        <label className="text-sm grow max-w-60">
          Learning rate: <strong>{lr.toFixed(2)}</strong>
          <input type="range" min={0.02} max={2.2} step={0.02} value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))} className="w-full" />
        </label>
        <button type="button" onClick={() => step(1)} className="btn-ghost text-sm">Step ↓</button>
        <button type="button" onClick={() => step(15)} className="btn-primary text-sm">Run 15 steps</button>
      </div>
      <p className="text-xs muted mt-3">
        Try 0.1 (slow but steady), 0.8 (fast), and 2.0 (bouncing over the valley). Real training does
        this in millions of dimensions at once: same rule, one gradient per parameter.
      </p>
    </WidgetFrame>
  );
}
