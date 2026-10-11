# Reference labs

These are runnable teaching examples, not production services. Offline commands need Node.js 24.12 or a compatible newer version with `node:sqlite`, and no external packages. Run from the repository root.

## Commands and expected observations

| Command | What to inspect |
|---|---|
| `node course/labs/reference.mjs report` | 12 source rows, 11 unique IDs, eight accepted events, net AUD 6,300, explicit exclusions/review |
| `node course/labs/reference.mjs retrieve "refund approval" analyst` | Effective authorised policy; no private negotiation record or draft policy |
| `node course/labs/reference.mjs validate course/case-study/example-triage.json` | Shape and ID validation; semantic correctness remains a separate question |
| `node course/labs/reference.mjs evaluate course/case-study/recorded-predictions.json` | 18/20 authored predictions; D09 and D20 fail |
| `node course/labs/reference.mjs workflow` | Simulated provider effect survives crash; retry produces one effect |
| `node course/labs/reference.mjs agent` | Bounded scripted tool loop with trace and denied action |
| `node --test course/labs/reference.test.mjs` | Reporting, filtering, validation, scoring, approval, restart, and budget checks |

The CSV parser intentionally accepts this small unquoted fixture format, not arbitrary CSV. Use a mature parser for quoted or multiline production data. The retrieval function is a keyword baseline. The agent planner is scripted. Neither performs a live model call.

The workflow uses two local SQLite databases to expose the crash window between an external effect and local completion. The fake recipient deduplicates by key and payload hash. A real API must document and enforce equivalent behaviour, or uncertain outcomes need reconciliation. The simulator is single-process; it does not demonstrate distributed locking. Each demo creates a separate directory under `course/labs/.runs/`.

## Browser review prototype

Open [review-prototype.html](review-prototype.html) directly or through the learning site's resources. No server or account is required. It uses rules and in-memory state; all actions are simulated and reload clears state.

Try an empty field, a refund, a mixed-intent request, an edit after approval, a rejected draft, and a repeated event ID. Record what is blocked and why. Compare the interface with a real durable review queue rather than assuming the prototype supplies one.

## Optional live model call

[live-extract.mjs](live-extract.mjs) uses the documented OpenAI Responses structured-output interface. Follow [setup](../../SETUP.md), then run `node course/labs/live-extract.mjs T09`. It sends only a fictional ticket, validates completion/refusal/JSON/schema/ID, and reports usage separately. It does not automatically retry or execute a business action. Model availability, pricing, and account access must be checked at use time.

## Optional MCP server

[mcp_server.py](mcp_server.py) uses the official Python MCP SDK's FastMCP interface. It exposes one read-only `search_policy(query)` tool over stdio. Its role and date are fixed by the application, not supplied by the model. It omits network authentication and production identity infrastructure.

Install the SDK in an isolated environment, configure your MCP client with that Python executable and the script's absolute path, and record the installed version. Test ordinary policy retrieval, an irrelevant query, the private negotiation target, and instruction text asking for broader access. Client configuration differs by product; use its current documentation.

## Evaluation inputs

`development-inputs.json` contains unlabelled task inputs. The corresponding cases and review key are evaluator material. `recorded-predictions.json` is an authored mock with two intentional mistakes. Keep those files out of the model context.

To score your own saved array of predictions, use the evaluate command with its file path. Each prediction needs `id`, `category`, `needs_review`, and `reason`. IDs must match the chosen case set. Missing and duplicate predictions fail their cases; extra IDs make the submission invalid. Add `heldout` as the final argument to score against the public held-out fixture. This public instructional split is not a secure examination set.

Do not claim live API, MCP-client, OpenClaw, Hermes, or Grok Bot compatibility from the offline tests alone. Those integrations need their own current-environment runs.
