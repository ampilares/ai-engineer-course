"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

// Simplified subword vocabulary (greedy longest-match). Teaching approximation of BPE.
const SUBWORDS = [
  "the", "ing", "tion", "and", "that", "have", "for", "not", "with", "this", "ation",
  "you", "are", "was", "were", "from", "they", "will", "would", "there", "their",
  "what", "about", "which", "when", "make", "like", "time", "just", "know", "take",
  "import", "def", "return", "print", "self", "class", "None", "True", "False",
  "er", "ly", "ed", "es", "re", "in", "on", "at", "en", "an", "or", "al", "de",
  "le", "un", "st", "ar", "ou", "it", "is", "to", "of", "as", "he", "we", "be",
];
const VOCAB = new Set(SUBWORDS);

function tokenizeWord(word: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < word.length) {
    let matched = "";
    for (let len = Math.min(word.length - i, 8); len >= 2; len--) {
      const cand = word.slice(i, i + len);
      if (VOCAB.has(cand.toLowerCase())) {
        matched = cand;
        break;
      }
    }
    if (matched) {
      tokens.push(matched);
      i += matched.length;
    } else {
      tokens.push(word[i]);
      i += 1;
    }
  }
  return tokens;
}

export function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const parts = text.split(/(\s+)/);
  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push(part);
    } else {
      // split off punctuation/digits as single tokens
      const segs = part.match(/[a-zA-Z]+|[0-9]|[^a-zA-Z0-9]/g) ?? [];
      for (const seg of segs) {
        if (/^[a-zA-Z]+$/.test(seg)) tokens.push(...tokenizeWord(seg));
        else tokens.push(seg);
      }
    }
  }
  return tokens;
}

const PALETTE = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#e0e7ff", "#ccfbf1"];
const PALETTE_DARK = ["#1e3a8a", "#14532d", "#78350f", "#831843", "#312e81", "#134e4a"];

const SAMPLES: Record<string, string> = {
  prose: "The quick brown fox jumps over the lazy dog.",
  code: "def greet(name):\n    print(f\"Hello {name}\")",
  numbers: "The invoice total is 1234.56 EUR, due 2026-08-01.",
  german: "Donaudampfschifffahrtsgesellschaft",
};

export function TokenizerExplorer() {
  const [text, setText] = useState(SAMPLES.prose);
  const tokens = tokenize(text);
  const nonWs = tokens.filter((t) => !/^\s+$/.test(t));
  const chars = text.length;
  const costPerM = 3; // $/1M input tokens, illustrative
  const cost = ((nonWs.length / 1_000_000) * costPerM).toFixed(7);

  return (
    <WidgetFrame
      title="Tokenizer explorer (simplified BPE)"
      onReset={() => setText(SAMPLES.prose)}
      srSummary="Type text and see how a subword tokenizer splits it into tokens. Code and rare words need more tokens than common English."
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.entries(SAMPLES).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setText(v)} className="btn-ghost py-1! px-2! text-xs">
            {k}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="input font-mono text-sm"
        aria-label="Text to tokenize"
      />
      <div className="mt-3 p-3 rounded-lg border line font-mono text-sm leading-8 break-words">
        {tokens.map((t, i) =>
          /^\s+$/.test(t) ? (
            <span key={i}>{t}</span>
          ) : (
            <span
              key={i}
              className="rounded px-0.5 mx-px whitespace-pre-wrap"
              style={{
                background: `light-dark(${PALETTE[i % PALETTE.length]}, ${PALETTE_DARK[i % PALETTE.length]})`,
              }}
            >
              {t}
            </span>
          )
        )}
      </div>
      <p className="mt-3 text-sm muted">
        <strong className="text-inherit">{nonWs.length} tokens</strong> from {chars} characters (~
        {nonWs.length ? (chars / nonWs.length).toFixed(1) : "0"} chars/token). At $3 per million input
        tokens this text costs ≈ ${cost} per call. This demo uses a tiny vocabulary: real tokenizers
        (e.g. ~100k merges) split common English less and rare strings more.
      </p>
    </WidgetFrame>
  );
}
