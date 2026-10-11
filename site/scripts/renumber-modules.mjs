// One-shot migration: renumber modules for the 18-module course and remap
// "Module N" prose references in all lesson MDX and module.json files.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "content", "modules");

// slug → new number
const NUMBERS = {
  "python-foundations": 1,
  "math-foundations": 2,
  "engineering-foundations": 3,
  "data-engineering": 4,
  "ml-foundations": 5,
  "deep-learning": 6,
  "llm-foundations": 7,
  "llm-primitives": 8,
  rag: 9,
  "agents-and-tools": 10,
  "multimodal-ai": 11,
  "ai-product-engineering": 12,
  "business-automation": 13,
  evaluation: 14,
  "safety-security": 15,
  "production-llmops": 16,
  "expert-topics": 17,
  "getting-hired": 18,
};

// old (15-scheme) module number → new (18-scheme)
const REMAP = Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, i + 3]));

function remapText(text) {
  // Singular "Module N" only: plural "Modules X, Y" references are fixed by hand.
  return text.replace(/\bModule\s+(\d{1,2})\b/g, (m, num) => {
    const n = parseInt(num, 10);
    return REMAP[n] ? `Module ${REMAP[n]}` : m;
  });
}

let filesChanged = 0;
for (const slug of readdirSync(ROOT)) {
  const dir = path.join(ROOT, slug);
  const mj = path.join(dir, "module.json");
  if (existsSync(mj)) {
    const mod = JSON.parse(readFileSync(mj, "utf8"));
    const newNum = NUMBERS[slug];
    let raw = readFileSync(mj, "utf8");
    raw = remapText(raw);
    const parsed = JSON.parse(raw);
    if (newNum && parsed.number !== newNum) parsed.number = newNum;
    writeFileSync(mj, JSON.stringify(parsed, null, 2) + "\n");
    filesChanged++;
    console.log(`${slug}: number ${mod.number} → ${parsed.number}`);
  }
  const lessons = path.join(dir, "lessons");
  if (existsSync(lessons)) {
    for (const f of readdirSync(lessons)) {
      const p = path.join(lessons, f);
      const before = readFileSync(p, "utf8");
      const after = remapText(before);
      if (after !== before) {
        writeFileSync(p, after);
        filesChanged++;
      }
    }
  }
  const qf = path.join(dir, "questions.json");
  if (existsSync(qf)) {
    const before = readFileSync(qf, "utf8");
    const after = remapText(before);
    if (after !== before) {
      writeFileSync(qf, after);
      filesChanged++;
    }
  }
}
console.log(`\n${filesChanged} files updated.`);
