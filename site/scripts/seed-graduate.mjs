// Seeds a graduated state for a user to verify the graduates/certificate display path.
// Inserts a passing submitted attempt for every module, an attestation, computes the
// weighted final grade exactly as src/lib/grading.ts does, and creates the graduation row.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const email = process.argv[2] || "ada@example.com";
const db = new DatabaseSync(path.join(process.cwd(), "data", "app.db"));
const course = JSON.parse(readFileSync(path.join(process.cwd(), "content", "course.json"), "utf8"));

const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
if (!user) { console.error(`No user ${email}. Register first.`); process.exit(1); }

// Give each module a passing score (varied, all >= 70).
const scores = {};
course.modules.forEach((m, i) => { scores[m.slug] = 78 + (i % 5) * 4; }); // 78..94

db.prepare("DELETE FROM exam_attempts WHERE user_id = ?").run(user.id);
for (const m of course.modules) {
  db.prepare(
    "INSERT INTO exam_attempts (user_id, module_slug, status, question_set, answers, score_pct, submitted_at) VALUES (?, ?, 'submitted', '[]', '{}', ?, datetime('now'))"
  ).run(user.id, m.slug, scores[m.slug]);
}

db.prepare(
  "INSERT INTO attestations (user_id, payload) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload"
).run(user.id, JSON.stringify({ title: "Invoice Triage Copilot", summary: "A guarded workflow that extracts, validates, and routes vendor invoices with human approval on payments.", url: "https://github.com/example/invoice-triage" }));

// Compute weighted final grade (mirror of computeFinalGrade).
let wsum = 0, acc = 0, allPassed = true;
for (const m of course.modules) {
  const s = scores[m.slug];
  if (s < course.passPct) allPassed = false;
  acc += m.weight * s; wsum += m.weight;
}
const pct = Math.round((acc / wsum) * 10) / 10;

db.prepare("UPDATE users SET final_grade_pct = ?, consent_public_listing = 1, consent_show_score = 1 WHERE id = ?").run(pct, user.id);

let grad = db.prepare("SELECT id FROM graduations WHERE user_id = ?").get(user.id);
if (!grad) {
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO graduations (id, user_id, grade_pct) VALUES (?, ?, ?)").run(id, user.id, pct);
  grad = { id };
}

const band = course.bands.find((b) => pct >= b.min)?.name ?? "N/A";
console.log(`Seeded graduate ${email}: allPassed=${allPassed} grade=${pct}% band=${band}`);
console.log(`Certificate: /certificate/${grad.id}`);
