import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { CASE_DIR, readJson, parseFixtureCsv, buildReport, retrievePolicies,
  validateTriage, scorePredictions, Workflow, runAgent } from "./reference.mjs";

const rows = () => parseFixtureCsv(readFileSync(path.join(CASE_DIR, "sales.csv"), "utf8"));

test("report reconciles the known fixture and preserves unknown values", () => {
  const report = buildReport(rows());
  assert.equal(report.input_rows, 12);
  assert.equal(report.unique_ids, 11);
  assert.equal(report.exact_duplicate_copies, 1);
  assert.equal(report.accepted_ids.length, 8);
  assert.equal(report.gross_sales_aud, 6500);
  assert.equal(report.refund_magnitude_aud, 200);
  assert.equal(report.net_accepted_aud, 6300);
  assert.deepEqual(report.excluded.map((x) => x.id), ["S009"]);
  assert.deepEqual(report.review.map((x) => x.id), ["S010", "S011"]);
});
test("a conflicting duplicate cannot silently retain the first amount", () => {
  const input = rows();
  input.push({ ...input[0], amount_aud: "1.00" });
  const report = buildReport(input);
  assert.equal(report.net_accepted_aud, 5100);
  assert.equal(report.review.find((x) => x.id === "S001").reason, "conflicting_duplicate");
  assert.equal(report.review.find((x) => x.id === "S001").rows.length, 2);
});
test("invalid dates and positive refunds go to review", () => {
  const input = rows();
  input[0].date = "2026-02-30";
  input[3].amount_aud = "200.00";
  const report = buildReport(input);
  assert.equal(report.review.find((x) => x.id === "S001").reason, "invalid_date");
  assert.equal(report.review.find((x) => x.id === "S004").reason, "invalid_business_fields");
  assert.throws(() => buildReport(rows(), "not-a-date"));
});
test("retrieval filters role, draft status, and effective date before returning passages", () => {
  assert.deepEqual(retrievePolicies("refund approval", "analyst").map((x) => x.id), ["P01-v2"]);
  assert.deepEqual(retrievePolicies("refund approval", "analyst", "2026-10-03").map((x) => x.id), ["P01-v1"]);
  assert.equal(retrievePolicies("negotiation supplier", "analyst").length, 0);
  assert.equal(retrievePolicies("negotiation supplier", "manager")[0].id, "P04-private");
  assert.throws(() => retrievePolicies("refund", "administrator"));
  const removed = readJson("knowledge.json").filter((d) => d.id !== "P01-v2");
  assert.equal(retrievePolicies("refund approval", "analyst", "2026-10-08", removed).length, 0);
});
test("validation binds the output to the input and refuses unknown without review", () => {
  const value = readJson("example-triage.json");
  assert.deepEqual(validateTriage(value, "T09"), []);
  assert.ok(validateTriage(value, "T01").length);
  assert.ok(validateTriage({ ...value, needs_review: false }, "T09").length);
  assert.ok(validateTriage({ ...value, needs_review: "true" }, "T09").length);
  assert.ok(validateTriage({ ...value, extra: 1 }, "T09").length);
});
test("evaluation counts missing and duplicate predictions and exposes extra IDs", () => {
  const cases = [{ id: "D01", expected: { category: "billing", needs_review: true } },
    { id: "D02", expected: { category: "scheduling", needs_review: false } }];
  const prediction = { id: "D01", category: "billing", needs_review: true, reason: "A refund is requested." };
  assert.equal(scorePredictions(cases, [prediction]).success_pct, 50);
  assert.equal(scorePredictions(cases, [prediction, prediction]).correct, 0);
  assert.equal(scorePredictions(cases, [prediction, { ...prediction, id: "EXTRA" }]).submission_valid, false);
});
function withFlow(t) {
  const tempRoot = realpathSync(tmpdir());
  const directory = mkdtempSync(path.join(tempRoot, "harbour-course-test-"));
  const flow = new Workflow(directory);
  t.after(() => {
    try { flow.close(); } catch { /* A restart test may already have closed these handles. */ }
    const resolved = realpathSync(directory);
    assert.equal(path.dirname(resolved), tempRoot);
    assert.ok(path.basename(resolved).startsWith("harbour-course-test-"));
    rmSync(resolved, { recursive: true, force: true });
  });
  return { flow, directory };
}
const action = { kind: "draft.create", target: "internal-review", body: "Review fictional report." };
test("crash after provider commit is recovered without a second effect", (t) => {
  const { flow, directory } = withFlow(t);
  const hash = flow.propose("A17", action);
  flow.decide("A17", hash, true, 1000);
  assert.throws(() => flow.execute("A17", 100, true), /SIMULATED/);
  assert.equal(flow.effectCount(), 1);
  flow.close();
  const resumed = new Workflow(directory);
  try {
    assert.equal(resumed.execute("A17", 200).reused, true);
    assert.equal(resumed.execute("A17", 300).state, "completed");
    assert.equal(resumed.effectCount(), 1);
  } finally { resumed.close(); }
});
test("approval denial, expiry and changed payload prevent effects", (t) => {
  const { flow } = withFlow(t);
  let hash = flow.propose("DENIED", action);
  flow.decide("DENIED", hash, false, 1000);
  assert.throws(() => flow.execute("DENIED", 100));
  hash = flow.propose("EXPIRED", action);
  flow.decide("EXPIRED", hash, true, 100);
  assert.throws(() => flow.execute("EXPIRED", 101));
  assert.throws(() => flow.propose("EXPIRED", { ...action, body: "Changed draft." }));
  assert.throws(() => flow.propose("SEND", { ...action, kind: "customer.send" }));
  assert.equal(flow.effectCount(), 0);
});
test("agent fixture enforces tool allowlist and step budget", () => {
  const result = runAgent([{ tool: "export_customer_files" }, { tool: "search_policy", query: "refund" }], 1);
  assert.equal(result.trace[0].denied, true);
  assert.equal(result.trace.length, 1);
  assert.equal(result.stopped_reason, "step_limit");
  assert.throws(() => runAgent([], 0));
});
