"use client";

import { useRef, useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

const CX = 200, CY = 160, SCALE = 55;

function toScreen(v: { x: number; y: number }) {
  return { x: CX + v.x * SCALE, y: CY - v.y * SCALE };
}

const PRESETS: Record<string, { a: { x: number; y: number }; b: { x: number; y: number } }> = {
  similar: { a: { x: 2.2, y: 1.2 }, b: { x: 1.8, y: 1.6 } },
  orthogonal: { a: { x: 2.4, y: 0.4 }, b: { x: -0.4, y: 2.4 } },
  opposite: { a: { x: 2, y: 1.4 }, b: { x: -1.8, y: -1.2 } },
};

export function VectorExplorer() {
  const [a, setA] = useState(PRESETS.similar.a);
  const [b, setB] = useState(PRESETS.similar.b);
  const dragging = useRef<"a" | "b" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.hypot(a.x, a.y);
  const magB = Math.hypot(b.x, b.y);
  const cos = magA && magB ? dot / (magA * magB) : 0;
  const angle = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;

  function pointerToVec(e: React.PointerEvent): { x: number; y: number } {
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * 400;
    const sy = ((e.clientY - rect.top) / rect.height) * 320;
    return {
      x: Math.max(-3.4, Math.min(3.4, (sx - CX) / SCALE)),
      y: Math.max(-2.6, Math.min(2.6, (CY - sy) / SCALE)),
    };
  }

  const sa = toScreen(a), sb = toScreen(b);
  const verdict =
    cos > 0.85 ? "very similar: these would be near neighbors in a vector search"
    : cos > 0.4 ? "somewhat related"
    : cos > -0.4 ? "roughly unrelated (near right angles)"
    : "pointing in opposing directions: dissimilar";

  return (
    <WidgetFrame
      title="Vectors & similarity explorer"
      onReset={() => { setA(PRESETS.similar.a); setB(PRESETS.similar.b); }}
      srSummary="Drag two 2-D vectors and watch their dot product and cosine similarity change. Vectors pointing the same way have cosine near 1; perpendicular vectors near 0; opposite vectors near -1."
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.entries(PRESETS).map(([name, p]) => (
          <button key={name} type="button" onClick={() => { setA(p.a); setB(p.b); }} className="btn-ghost py-1! px-2! text-xs">
            {name}
          </button>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 400 320"
        className="w-full select-none touch-none"
        role="img"
        aria-label="Two draggable vectors from the origin"
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const v = pointerToVec(e);
          if (dragging.current === "a") setA(v);
          else setB(v);
        }}
        onPointerUp={() => (dragging.current = null)}
        onPointerLeave={() => (dragging.current = null)}
      >
        <line x1={0} y1={CY} x2={400} y2={CY} stroke="currentColor" strokeOpacity={0.15} />
        <line x1={CX} y1={0} x2={CX} y2={320} stroke="currentColor" strokeOpacity={0.15} />
        <defs>
          <marker id="arrA" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="var(--color-accent)" />
          </marker>
          <marker id="arrB" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="var(--color-ok)" />
          </marker>
        </defs>
        <line x1={CX} y1={CY} x2={sa.x} y2={sa.y} stroke="var(--color-accent)" strokeWidth={3} markerEnd="url(#arrA)" />
        <line x1={CX} y1={CY} x2={sb.x} y2={sb.y} stroke="var(--color-ok)" strokeWidth={3} markerEnd="url(#arrB)" />
        <circle cx={sa.x} cy={sa.y} r={14} fill="var(--color-accent)" fillOpacity={0.25} className="cursor-grab"
          onPointerDown={(e) => { dragging.current = "a"; (e.target as Element).setPointerCapture(e.pointerId); }} />
        <circle cx={sb.x} cy={sb.y} r={14} fill="var(--color-ok)" fillOpacity={0.25} className="cursor-grab"
          onPointerDown={(e) => { dragging.current = "b"; (e.target as Element).setPointerCapture(e.pointerId); }} />
        <text x={sa.x + 10} y={sa.y - 10} fontSize={14} fontWeight={700} fill="var(--color-accent)">a</text>
        <text x={sb.x + 10} y={sb.y - 10} fontSize={14} fontWeight={700} fill="var(--color-ok)">b</text>
      </svg>
      <div className="grid grid-cols-3 gap-2 text-center text-sm mt-2">
        <div className="card p-2"><div className="text-lg font-bold font-mono">{dot.toFixed(2)}</div><div className="text-xs muted">dot product a·b</div></div>
        <div className="card p-2"><div className="text-lg font-bold font-mono">{cos.toFixed(3)}</div><div className="text-xs muted">cosine similarity</div></div>
        <div className="card p-2"><div className="text-lg font-bold font-mono">{angle.toFixed(0)}°</div><div className="text-xs muted">angle</div></div>
      </div>
      <p className="text-sm muted mt-3">
        Drag the arrowheads. Cosine {cos.toFixed(2)} means these vectors are <strong className="text-inherit">{verdict}</strong>.
        Embedding search (Module 7) is exactly this computation in ~1,000 dimensions.
      </p>
    </WidgetFrame>
  );
}
