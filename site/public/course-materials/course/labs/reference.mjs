// Offline teaching tools. No network requests and no real business actions.
import { readFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

export const CASE_DIR = fileURLToPath(new URL("../case-study/", import.meta.url));
export const readJson = (name) => JSON.parse(readFileSync(path.join(CASE_DIR, name), "utf8"));
const categories = ["billing", "scheduling", "technical", "unknown"];

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseFixtureCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const expected = "transaction_id,date,customer_id,kind,amount_aud,currency";
  if (lines.shift() !== expected) throw new Error("Unexpected fixture CSV header");
  const keys = expected.split(",");
  return lines.map((line, index) => {
    if (line.includes('"')) throw new Error("Teaching reader accepts unquoted fixture fields only");
    const values = line.split(",");
    if (values.length !== keys.length) throw new Error(`Wrong field count on row ${index + 2}`);
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  });
}

function toCents(value) {
  if (!/^-?\d+\.\d{2}$/.test(value)) throw new Error("Amount must have two decimal places");
  const negative = value.startsWith("-");
  const [whole, fraction] = value.replace(/^-/, "").split(".");
  const cents = Number(whole) * 100 + Number(fraction);
  if (!Number.isSafeInteger(cents)) throw new Error("Amount exceeds safe fixture range");
  return negative ? -cents : cents;
}

export function buildReport(rows, start = "2026-10-01", end = "2026-10-07") {
  if (!validDate(start) || !validDate(end) || start > end) throw new Error("Invalid reporting window");
  const groups = new Map();
  for (const row of rows) {
    if (!row.transaction_id) throw new Error("Missing transaction ID");
    if (!groups.has(row.transaction_id)) groups.set(row.transaction_id, []);
    groups.get(row.transaction_id).push(row);
  }
  const accepted = [], excluded = [], review = [];
  let duplicates = 0, gross = 0, refunds = 0;
  for (const [id, copies] of groups) {
    const versions = new Set(copies.map((r) => JSON.stringify(r)));
    if (versions.size > 1) {
      review.push({ id, reason: "conflicting_duplicate", rows: copies });
      continue;
    }
    duplicates += copies.length - 1;
    const row = copies[0];
    if (!validDate(row.date)) {
      review.push({ id, reason: "invalid_date", rows: copies });
      continue;
    }
    if (row.date < start || row.date > end) {
      excluded.push({ id, reason: "outside_period" });
      continue;
    }
    if (row.currency !== "AUD") {
      review.push({ id, reason: "unsupported_currency", rows: copies });
      continue;
    }
    if (!row.amount_aud) {
      review.push({ id, reason: "missing_amount", rows: copies });
      continue;
    }
    let amount;
    try { amount = toCents(row.amount_aud); }
    catch { review.push({ id, reason: "invalid_amount", rows: copies }); continue; }
    if (!row.customer_id || !["sale", "refund"].includes(row.kind) ||
        (row.kind === "sale" && amount <= 0) || (row.kind === "refund" && amount >= 0)) {
      review.push({ id, reason: "invalid_business_fields", rows: copies });
      continue;
    }
    accepted.push(id);
    if (row.kind === "sale") gross += amount;
    else refunds -= amount;
  }
  return {
    period: { start, end }, currency: "AUD", input_rows: rows.length,
    unique_ids: groups.size, exact_duplicate_copies: duplicates, accepted_ids: accepted,
    gross_sales_aud: gross / 100, refund_magnitude_aud: refunds / 100,
    net_accepted_aud: (gross - refunds) / 100, excluded, review,
  };
}

export function retrievePolicies(query, role, asOf = "2026-10-08", corpus = readJson("knowledge.json")) {
  if (!["analyst", "manager"].includes(role)) throw new Error("Unrecognised application role");
  if (!validDate(asOf)) throw new Error("Invalid as-of date");
  if (typeof query !== "string" || query.length > 500) throw new Error("Invalid search query");
  const terms = [...new Set(query.toLowerCase().match(/[a-z0-9]+/g) ?? [])];
  const candidates = corpus.filter((d) => d.roles.includes(role) &&
    ["approved", "retired"].includes(d.status) && d.effective_from <= asOf &&
    (!d.effective_to || d.effective_to >= asOf));
  return candidates.map((d) => ({ ...d, score: terms.filter((term) =>
    `${d.title} ${d.text}`.toLowerCase().includes(term)).length }))
    .filter((d) => d.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 3).map(({ id, title, text, score }) => ({ id, title, text, score }));
}

export function validateTriage(value, inputId) {
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["Expected an object"];
  const expected = ["id", "category", "needs_review", "reason"];
  if (Object.keys(value).sort().join(",") !== expected.sort().join(",")) errors.push("Exactly four fields required");
  if (typeof value.id !== "string" || value.id !== inputId) errors.push("Output ID must match input");
  if (!categories.includes(value.category)) errors.push("Invalid category");
  if (typeof value.needs_review !== "boolean") errors.push("Review flag must be Boolean");
  if (typeof value.reason !== "string" || value.reason.trim().length < 8) errors.push("Evidence-based reason required");
  if (value.category === "unknown" && value.needs_review !== true) errors.push("Unknown requests require review");
  return errors;
}

export function scorePredictions(cases, predictions) {
  if (!Array.isArray(predictions)) throw new Error("Predictions must be an array");
  if (!cases.length || new Set(cases.map((c) => c.id)).size !== cases.length) throw new Error("Cases must have unique IDs");
  const expectedIds = new Set(cases.map((c) => c.id));
  const extra = predictions.filter((p) => !expectedIds.has(p?.id)).map((p) => p?.id ?? null);
  const results = cases.map((c) => {
    const found = predictions.filter((p) => p?.id === c.id);
    if (found.length !== 1) return { id: c.id, pass: false, reason: found.length ? "duplicate_prediction" : "missing_prediction" };
    const p = found[0];
    const errors = validateTriage(p, c.id);
    const pass = !errors.length && p.category === c.expected.category && p.needs_review === c.expected.needs_review;
    return { id: c.id, pass, reason: errors.join("; ") || (pass ? "matched" : "incorrect_decision") };
  });
  const correct = results.filter((r) => r.pass).length;
  return { cases: cases.length, correct, success_pct: 100 * correct / cases.length,
    extra_ids: extra, submission_valid: extra.length === 0, results };
}

const actionHash = (action) => createHash("sha256").update(JSON.stringify(action)).digest("hex");
function checkAction(action) {
  if (!action || Object.keys(action).sort().join(",") !== "body,kind,target" ||
      action.kind !== "draft.create" || action.target !== "internal-review" ||
      typeof action.body !== "string" || !action.body.trim() || action.body.length > 2000) {
    throw new Error("Only a bounded internal draft is allowed");
  }
}

// Single-process simulator with a separately committed fake provider effect.
// Real services require their own authentication, concurrency and reconciliation design.
export class Workflow {
  constructor(directory) {
    mkdirSync(directory, { recursive: true });
    this.local = new DatabaseSync(path.join(directory, "workflow.db"));
    this.provider = new DatabaseSync(path.join(directory, "provider.db"));
    this.local.exec("CREATE TABLE IF NOT EXISTS actions (id TEXT PRIMARY KEY, payload TEXT NOT NULL, hash TEXT NOT NULL, state TEXT NOT NULL, expires INTEGER)");
    this.provider.exec("CREATE TABLE IF NOT EXISTS effects (id TEXT PRIMARY KEY, hash TEXT NOT NULL, payload TEXT NOT NULL)");
  }
  propose(id, action) {
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) throw new Error("Invalid action ID");
    checkAction(action);
    const hash = actionHash(action);
    const old = this.local.prepare("SELECT * FROM actions WHERE id = ?").get(id);
    if (old && old.hash !== hash) throw new Error("Changed payload needs a new action and approval");
    this.local.prepare("INSERT OR IGNORE INTO actions VALUES (?, ?, ?, 'needs-review', NULL)").run(id, JSON.stringify(action), hash);
    return hash;
  }
  decide(id, hash, approved, expires, reviewer = "Maya") {
    if (reviewer !== "Maya") throw new Error("Reviewer not authorised in this fixture");
    if (typeof approved !== "boolean" || !Number.isSafeInteger(expires)) throw new Error("Invalid decision");
    const result = this.local.prepare("UPDATE actions SET state = ?, expires = ? WHERE id = ? AND hash = ? AND state = 'needs-review'")
      .run(approved ? "approved" : "rejected", expires, id, hash);
    if (result.changes !== 1) throw new Error("Missing, changed, or already decided action");
  }
  execute(id, now = Date.now(), crashAfterProvider = false) {
    const row = this.local.prepare("SELECT * FROM actions WHERE id = ?").get(id);
    if (!row) throw new Error("Unknown action");
    if (row.state === "completed") return { id, state: "completed", reused: true };
    if (row.state !== "approved" || row.expires <= now) throw new Error("Valid approval required");
    const action = JSON.parse(row.payload);
    checkAction(action);
    const old = this.provider.prepare("SELECT * FROM effects WHERE id = ?").get(id);
    if (old && old.hash !== row.hash) throw new Error("Provider key/payload conflict");
    this.provider.prepare("INSERT OR IGNORE INTO effects VALUES (?, ?, ?)").run(id, row.hash, row.payload);
    if (crashAfterProvider) throw new Error("SIMULATED crash after provider commit");
    this.local.prepare("UPDATE actions SET state = 'completed' WHERE id = ?").run(id);
    return { id, state: "completed", reused: Boolean(old) };
  }
  effectCount() { return this.provider.prepare("SELECT COUNT(*) AS n FROM effects").get().n; }
  close() { this.local.close(); this.provider.close(); }
}

export function runAgent(plan, maxSteps = 4) {
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 20) throw new Error("Invalid step budget");
  const trace = [];
  for (const step of plan.slice(0, maxSteps)) {
    try {
      if (step.tool === "search_policy") trace.push({ tool: step.tool, result: retrievePolicies(step.query, "analyst") });
      else if (step.tool === "calculate_report") trace.push({ tool: step.tool, result: buildReport(parseFixtureCsv(readFileSync(path.join(CASE_DIR, "sales.csv"), "utf8"))) });
      else trace.push({ tool: step.tool, denied: true, reason: "Tool not allowed" });
    } catch (error) { trace.push({ tool: step.tool, failed: true, reason: error.message }); }
  }
  return { mode: "deterministic_planner_fixture", trace,
    stopped_reason: plan.length > maxSteps ? "step_limit" : "plan_complete" };
}

async function main() {
  const [command, arg, role] = process.argv.slice(2);
  let result;
  if (command === "report") result = buildReport(parseFixtureCsv(readFileSync(path.join(CASE_DIR, "sales.csv"), "utf8")));
  else if (command === "retrieve") result = retrievePolicies(arg ?? "refund approval", role ?? "analyst");
  else if (command === "validate") {
    if (!arg) throw new Error("Supply a JSON response file");
    const value = JSON.parse(readFileSync(arg, "utf8"));
    const tickets = readJson("tickets.json");
    if (!tickets.some((t) => t.id === value.id)) throw new Error("Unknown ticket ID");
    const errors = validateTriage(value, value.id);
    result = { valid: errors.length === 0, errors, limitation: "This CLI checks a known ID and structure; caller must bind to the submitted input ID and assess semantics." };
    if (errors.length) process.exitCode = 1;
  } else if (command === "evaluate") {
    if (!arg) throw new Error("Supply a prediction-array JSON file");
    const cases = readJson(role === "heldout" ? "heldout-cases.json" : "development-cases.json");
    result = scorePredictions(cases, JSON.parse(readFileSync(arg, "utf8")));
    if (!result.submission_valid) process.exitCode = 1;
  } else if (command === "agent") {
    result = runAgent([{ tool: "search_policy", query: "refund approval" }, { tool: "calculate_report" },
      { tool: "export_customer_files" }, { tool: "search_policy", query: "missing warranty" }, { tool: "calculate_report" }]);
  } else if (command === "workflow") {
    const runs = fileURLToPath(new URL(".runs/", import.meta.url));
    mkdirSync(runs, { recursive: true });
    const directory = mkdtempSync(path.join(runs, "demo-"));
    let flow = new Workflow(directory);
    const action = { kind: "draft.create", target: "internal-review", body: "Maya: review the Harbour report." };
    const hash = flow.propose("A17", action);
    flow.decide("A17", hash, true, Date.now() + 60000);
    let interruption;
    try { flow.execute("A17", Date.now(), true); } catch (error) { interruption = error.message; }
    flow.close();
    flow = new Workflow(directory);
    const resumed = flow.execute("A17");
    result = { mode: "offline_simulation", directory, interruption, resumed, provider_effects: flow.effectCount() };
    flow.close();
  } else throw new Error("Commands: report | retrieve QUERY ROLE | validate FILE | evaluate FILE [heldout] | workflow | agent");
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
