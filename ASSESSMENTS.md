# Assessments and evidence

The course grades engineering evidence, not hours watched.

## Entry diagnostic

Complete without an LLM generating the whole solution. Documentation and AI tutoring are allowed if every borrowed idea can be explained.

Build a small service that:

1. fetches JSON from a public API;
2. validates and normalizes at least three fields;
3. stores results in SQLite;
4. exposes one filtered endpoint;
5. has tests for success, invalid input, upstream failure, and duplicates;
6. includes a README with setup and trade-offs.

Then answer in your own words:

- What is the difference between training, validation, and test data?
- Why is accuracy a poor metric for some problems?
- What does an embedding represent?
- Why should an LLM output be treated as untrusted input?
- When is a rules-based workflow preferable to an agent?

**Routing:** If the build is difficult, start at Module 1. If the build is comfortable but the data/ML questions are not, begin at Module 2 or 3. If both are comfortable, start at Module 5 and take the fast-track foundation gate.

## Weekly evidence checklist

Every project submission includes:

- runnable code/workflow and setup instructions;
- a diagram or concise description of inputs, state, boundaries, and outputs;
- a representative test/eval set;
- measured results, including failures rather than cherry-picked successes;
- cost and latency notes where models are called;
- a decision log explaining at least one rejected alternative;
- a 3–5 minute demo or live walkthrough;
- a short retrospective: what broke, what changed, and what remains risky.

## Progression gates

### Foundation gate: before Module 5

- write and test typed Python functions;
- consume REST APIs and explain authentication, status codes, and timeouts;
- query a relational database;
- use Git branches and review a diff;
- publish a versioned dataset with provenance and a data-quality check;
- create a valid ML split and calculate precision, recall, and F1.
- diagnose overfitting or optimization failure from training/validation curves.

### Application gate: before Module 8

- explain tokens, context windows, embeddings, and attention at an intuitive level;
- make a model return schema-valid output;
- separate retrieval evaluation from answer evaluation;
- demonstrate citations and an abstention path;
- compare at least two configurations on a fixed dataset.

### Product gate: before Module 11

- preserve evidence and route uncertainty in a document, image, or speech workflow;
- define an eligible user population, measurable outcome, guardrails, and non-goals;
- prototype error, correction, cancellation, approval, and human-escalation states;
- document architecture boundaries and a build/buy decision;
- design a limited pilot with stop conditions and an owner.

### Production gate: before capstone launch

- test happy paths and failure paths;
- implement timeouts, retries with limits, idempotency, and rate/cost limits;
- apply least-privilege tool permissions and human approval for consequential actions;
- version prompts, schemas, datasets, and model configuration;
- capture traces/metrics without leaking secrets or sensitive content;
- write rollback and incident procedures.

## Scoring rubric

Score each category from 0–4.

| Category | 0 | 2 | 4 |
|---|---|---|---|
| Problem/value | no user or metric | plausible use case | measured baseline, clear owner, valuable target |
| Correctness | demo only | basic tests | representative evals plus edge/failure cases |
| Engineering | cannot reproduce | works locally | typed, tested, observable, documented, recoverable |
| AI judgment | model used decoratively | reasonable design | simpler alternatives tested; model used only where justified |
| Data/RAG | unknown provenance | usable corpus | access, freshness, lineage, retrieval evals, citations |
| Product/UX | demo exposes raw output | basic review path | tested uncertainty, evidence, correction, approval, accessibility, and fallback states |
| Safety | risks ignored | basic validation | threat model, least privilege, approvals, red-team evidence |
| Operations | no deployment story | deployed prototype | SLOs, monitoring, budgets, runbook, rollback |
| Communication | unclear demo | understandable | concise decision narrative for technical and business audiences |

Passing is 25/36 with no zero in Correctness, Product/UX, Safety, or Operations. Portfolio quality is 30/36 or higher.

## Oral defense prompts

- Which component causes the largest share of errors, and how do you know?
- What happens if the model, vector store, or downstream API is unavailable?
- Which action has the highest blast radius? Who authorizes it?
- Why is this an LLM problem rather than a database query or rules problem?
- What metric could improve while the user experience gets worse?
- How would you cut cost by 50% without violating the quality target?
- What new data would most improve the system?
