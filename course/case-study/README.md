# Harbour Services: the shared course case

Harbour Services is a fictional maintenance business. All people, tickets, transactions, policies, and timings in this pack are invented for teaching. Monetary values use AUD; they are simplified operational records, not accounting or tax advice.

The reporting window is **1-7 October 2026 inclusive**, using the dates already recorded in the files. Report as of **8 October 2026 at 09:00 Australia/Sydney**. The operations lead is Maya; the service manager is Leo. The learner acts as an analyst. Agents may read approved inputs and prepare drafts; they cannot contact customers, approve expenditure, or alter the source ledger.

## Files

- [sales.csv](sales.csv): transactions, including a duplicate, an out-of-period row, an unrecognised currency, and a missing amount.
- [tickets.json](tickets.json): ten support records, including ambiguous requests and an embedded instruction that must be treated as untrusted data.
- [knowledge.json](knowledge.json): dated policy passages with role-based visibility and one conflicting draft.
- [meeting.txt](meeting.txt): a short transcript with a corrected date and one unresolved owner.
- [document.txt](document.txt): an intentionally imperfect invoice transcription for extraction exercises.
- [baseline.json](baseline.json): ten fictional manual timings. They are example inputs, not evidence of actual staff performance.
- [development-cases.json](development-cases.json): twenty practice evaluation cases.
- [heldout-cases.json](heldout-cases.json): ten final classroom cases. Keep this file out of agent workspaces during development. Because the repository is public, it is an instructional split, not a secure examination bank.
- [review-key.md](review-key.md): worked results. Attempt the exercises before opening it.
- [agent-inputs/](agent-inputs/README.md): direct-upload package without evaluator labels or the manager-only policy. Draft and retired policy records remain as source-status test cases.
- [development-inputs.json](development-inputs.json): unlabelled inputs for model evaluation; keep the matching labelled cases separate.
- [recorded-predictions.json](recorded-predictions.json): authored evaluator exercise with two intentional errors, not live model output.

## Data contract

Each transaction ID identifies one business event. Exact duplicates may be deduplicated; conflicting rows with the same ID require review. Include only rows dated within the reporting window. Count only complete AUD records. A refund has a negative amount. Do not convert currencies or infer missing amounts. Separate quarantined rows from exclusions and from duplicate copies.

The comparison task is a one-page weekly brief with five sections: scope and data quality; checked transaction totals; service issues; current policy and unresolved questions; proposed actions with owners. Cite transaction, ticket, and document IDs. Drafting an action is separate from executing it.

Use the task in every agent platform, with the same inputs and review rubric. Keep evaluator files and the review key outside the material supplied to an agent. Record any configuration difference, blocked feature, missing source, or manual correction. This case is deliberately small enough to check by hand.

## Starter commands

From the repository root, use Node.js 24.12 or a newer compatible release for the supplied offline lab tools:

```bash
node course/labs/reference.mjs report
node course/labs/reference.mjs retrieve "refund approval" analyst
node course/labs/reference.mjs workflow
node --test course/labs/reference.test.mjs
```

These reference tools exercise calculations, access filtering, validation, and simulated recovery. They do not call a model or establish the quality of OpenClaw, Hermes Agent, or Grok Bot. Platform labs require a live authorised account or an explicitly labelled instructor demonstration.
