import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "content");
let errors = 0;
const err = (m) => { console.error("  ✗ " + m); errors++; };

function validateStyle(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) validateStyle(target);
    else if (/\.(?:json|mdx)$/.test(entry.name)) {
      const text = readFileSync(target, "utf8");
      if (text.includes("\u2014")) err(`em dash found: ${path.relative(ROOT, target)}`);
    }
  }
}

validateStyle(ROOT);

const course = JSON.parse(readFileSync(path.join(ROOT, "course.json"), "utf8"));
console.log(`Course: ${course.title}: ${course.modules.length} modules`);

let totalLessons = 0, totalQuestions = 0;
const seenQ = new Set();

for (const m of course.modules) {
  const dir = path.join(ROOT, "modules", m.slug);
  if (!existsSync(dir)) { err(`module dir missing: ${m.slug}`); continue; }
  const mj = path.join(dir, "module.json");
  if (!existsSync(mj)) { err(`module.json missing: ${m.slug}`); continue; }
  const mod = JSON.parse(readFileSync(mj, "utf8"));

  if (mod.slug !== m.slug) err(`slug mismatch: ${m.slug} vs ${mod.slug}`);
  if (!mod.lessons?.length) err(`no lessons: ${m.slug}`);

  for (const l of mod.lessons) {
    totalLessons++;
    const f = path.join(dir, "lessons", `${l.slug}.mdx`);
    if (!existsSync(f)) err(`lesson mdx missing: ${m.slug}/${l.slug}`);
  }

  const qf = path.join(dir, "questions.json");
  if (!existsSync(qf)) { err(`questions.json missing: ${m.slug}`); continue; }
  const pool = JSON.parse(readFileSync(qf, "utf8"));
  if (pool.length < mod.examCount) err(`pool ${pool.length} < examCount ${mod.examCount}: ${m.slug}`);

  for (const q of pool) {
    totalQuestions++;
    if (seenQ.has(q.id)) err(`duplicate question id: ${q.id}`);
    seenQ.add(q.id);
    if (!q.explanation) err(`no explanation: ${q.id}`);
    if (q.type === "single") {
      if (!q.options?.some((o) => o.id === q.answer)) err(`single answer not in options: ${q.id}`);
    } else if (q.type === "multi") {
      if (!Array.isArray(q.answer) || q.answer.length === 0) err(`multi missing answer array: ${q.id}`);
      for (const a of q.answer || []) if (!q.options?.some((o) => o.id === a)) err(`multi answer ${a} not in options: ${q.id}`);
    } else if (q.type === "numeric") {
      if (typeof q.answer !== "number" || typeof q.tolerance !== "number") err(`numeric bad answer/tolerance: ${q.id}`);
    } else if (q.type === "short") {
      if (!Array.isArray(q.accept) || q.accept.length === 0) err(`short missing accept: ${q.id}`);
    } else {
      err(`unknown type ${q.type}: ${q.id}`);
    }
  }
}

// weight sum sanity
const wsum = course.modules.reduce((a, m) => a + m.weight, 0);
console.log(`Lessons: ${totalLessons} · Questions: ${totalQuestions} · weight sum: ${wsum.toFixed(1)}`);
if (errors) { console.error(`\n${errors} error(s) found.`); process.exit(1); }
console.log("\n✓ Content valid.");
