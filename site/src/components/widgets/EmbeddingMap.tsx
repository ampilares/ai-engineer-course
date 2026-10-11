"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

// Hand-placed 2-D positions standing in for a projection of real embeddings.
const WORDS: { w: string; x: number; y: number; g: string }[] = [
  { w: "cat", x: 90, y: 60, g: "animals" }, { w: "dog", x: 110, y: 75, g: "animals" },
  { w: "kitten", x: 75, y: 78, g: "animals" }, { w: "puppy", x: 122, y: 92, g: "animals" },
  { w: "horse", x: 150, y: 55, g: "animals" }, { w: "lion", x: 60, y: 42, g: "animals" },
  { w: "Paris", x: 420, y: 60, g: "places" }, { w: "France", x: 445, y: 80, g: "places" },
  { w: "Berlin", x: 400, y: 92, g: "places" }, { w: "Germany", x: 430, y: 110, g: "places" },
  { w: "Tokyo", x: 470, y: 50, g: "places" }, { w: "city", x: 385, y: 65, g: "places" },
  { w: "happy", x: 120, y: 230, g: "feelings" }, { w: "joyful", x: 100, y: 250, g: "feelings" },
  { w: "sad", x: 175, y: 262, g: "feelings" }, { w: "angry", x: 200, y: 240, g: "feelings" },
  { w: "delighted", x: 88, y: 222, g: "feelings" },
  { w: "python", x: 430, y: 235, g: "code" }, { w: "function", x: 465, y: 255, g: "code" },
  { w: "variable", x: 415, y: 268, g: "code" }, { w: "compile", x: 480, y: 228, g: "code" },
  { w: "snake", x: 300, y: 150, g: "ambiguous" },
];

const GROUP_COLORS: Record<string, string> = {
  animals: "#0d9488", places: "#2563eb", feelings: "#e11d48", code: "#7c3aed", ambiguous: "#d97706",
};

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function EmbeddingMap() {
  const [sel, setSel] = useState<string | null>("cat");
  const selected = WORDS.find((p) => p.w === sel) ?? null;
  const neighbors = selected
    ? [...WORDS].filter((p) => p.w !== selected.w).sort((a, b) => dist(a, selected) - dist(b, selected)).slice(0, 4)
    : [];

  return (
    <WidgetFrame
      title="Embedding space explorer"
      onReset={() => setSel("cat")}
      srSummary="A 2-D map where words with similar meanings sit close together. Click a word to highlight its nearest neighbors: this closeness is what embedding similarity search uses."
    >
      <svg viewBox="0 0 560 300" className="w-full select-none" role="img"
        aria-label="Two-dimensional embedding map with word clusters for animals, places, feelings, and code">
        {selected &&
          neighbors.map((n) => (
            <line key={n.w} x1={selected.x} y1={selected.y} x2={n.x} y2={n.y}
              stroke="var(--color-accent)" strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="4 3" />
          ))}
        {WORDS.map((p) => {
          const isSel = sel === p.w;
          const isNb = neighbors.some((n) => n.w === p.w);
          return (
            <g key={p.w} onClick={() => setSel(p.w)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={isSel ? 8 : 5}
                fill={GROUP_COLORS[p.g]} opacity={isSel || isNb || !sel ? 1 : 0.35}
                stroke={isSel ? "currentColor" : "none"} strokeWidth={2} />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={12}
                fontWeight={isSel || isNb ? 700 : 400} opacity={isSel || isNb || !sel ? 1 : 0.45}
                fill="currentColor">
                {p.w}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-1 mt-1" role="listbox" aria-label="Pick a word">
        {WORDS.map((p) => (
          <button key={p.w} type="button" onClick={() => setSel(p.w)}
            className={`text-xs rounded px-1.5 py-0.5 border line cursor-pointer ${sel === p.w ? "border-accent text-accent font-semibold" : "muted"}`}>
            {p.w}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-sm muted mt-3">
          Nearest to <strong className="text-inherit">{selected.w}</strong>:{" "}
          {neighbors.map((n) => n.w).join(", ")}. “Nearest neighbors in embedding space” is exactly
          what a vector search returns. Notice <em>snake</em> floats between animals and code: embeddings capture ambiguity too.
        </p>
      )}
    </WidgetFrame>
  );
}
