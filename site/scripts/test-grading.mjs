// Validates grading logic against every authored question:
// feeding the correct answer must grade true; a wrong answer must grade false.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "content", "modules");

// Mirror of gradeAnswer in src/lib/grading.ts
function gradeAnswer(q, answer) {
  if (answer === undefined || answer === null) return false;
  switch (q.type) {
    case "single":
      return answer === q.answer;
    case "multi": {
      if (!Array.isArray(answer)) return false;
      const got = [...new Set(answer)].sort();
      const want = [...q.answer].sort();
      return got.length === want.length && got.every((v, i) => v === want[i]);
    }
    case "numeric": {
      const num = typeof answer === "number" ? answer : parseFloat(String(answer).replace(",", "."));
      if (!Number.isFinite(num)) return false;
      return Math.abs(num - q.answer) <= q.tolerance;
    }
    case "short": {
      if (typeof answer !== "string") return false;
      const norm = answer.trim().toLowerCase().replace(/\s+/g, " ");
      return q.accept.some((a) => a.trim().toLowerCase().replace(/\s+/g, " ") === norm);
    }
  }
  return false;
}

let checked = 0, fail = 0;
for (const slug of readdirSync(ROOT)) {
  const qf = path.join(ROOT, slug, "questions.json");
  let pool;
  try { pool = JSON.parse(readFileSync(qf, "utf8")); } catch { continue; }
  for (const q of pool) {
    checked++;
    // 1. Correct answer grades true
    let correctInput;
    if (q.type === "single") correctInput = q.answer;
    else if (q.type === "multi") correctInput = q.answer;
    else if (q.type === "numeric") correctInput = q.answer;
    else if (q.type === "short") correctInput = q.accept[0];
    if (!gradeAnswer(q, correctInput)) { console.error(`  ✗ correct answer graded FALSE: ${q.id}`); fail++; }

    // 2. A wrong answer grades false
    let wrongInput;
    if (q.type === "single") wrongInput = q.options.find((o) => o.id !== q.answer)?.id;
    else if (q.type === "multi") wrongInput = []; // empty set is wrong for any non-empty answer
    else if (q.type === "numeric") wrongInput = q.answer + q.tolerance + 1000;
    else if (q.type === "short") wrongInput = "definitely-not-the-answer-xyz";
    if (gradeAnswer(q, wrongInput)) { console.error(`  ✗ wrong answer graded TRUE: ${q.id}`); fail++; }

    // 3. Undefined grades false
    if (gradeAnswer(q, undefined)) { console.error(`  ✗ undefined graded TRUE: ${q.id}`); fail++; }
  }
}

console.log(`Checked ${checked} questions.`);
if (fail) { console.error(`${fail} grading failures.`); process.exit(1); }
console.log("✓ All questions grade correctly (correct→pass, wrong→fail, blank→fail).");
