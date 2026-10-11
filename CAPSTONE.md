# Capstone: production AI workflow

The four-week capstone is a small, defensible production pilot, not a broad “AI platform.” Choose one workflow, one primary user, one measurable outcome, and a narrow permission boundary. The final result may recommend stopping or redesigning; an honest negative pilot can meet the standard when its evidence and engineering are strong.

## Good capstone options

### Customer-support resolution copilot

Retrieve policy and product knowledge, draft a cited response, classify intent, suggest an action, and require agent approval before sending or changing an account.

### Accounts-payable document worker

Extract invoice fields, validate totals and supplier data, detect exceptions, match against structured records, and route approval. Never allow the model to authorize payment.

### Sales research and CRM assistant

Combine approved sources, summarize account changes with citations, propose CRM updates, and require review before writing or contacting anyone.

### Internal policy and onboarding assistant

Answer questions from permission-filtered documents, cite exact sources, detect missing evidence, and measure successful self-service without inventing policy.

### Meeting-to-execution workflow

Process a transcript, extract decisions and owners, reconcile them with the project system, draft tasks, and request approval before creation.

### Software operations triage

Summarize incidents or issues, retrieve runbooks, classify severity, suggest next steps, and restrict all mutating operations behind approval.

## Proposal

Before implementation, submit:

1. user, owner, and workflow boundary;
2. current-state map with volume, cycle time, error/rework rate, and cost;
3. target metric and minimum acceptable quality;
4. a baseline that does not use an LLM;
5. data sources, permissions, retention, and prohibited data;
6. source contracts, versioning/lineage, correction, and deletion behavior;
7. highest-risk action and human control;
8. user-visible uncertainty, correction, accessibility, and fallback paths;
9. estimated model calls, latency, unit cost, and review capacity;
10. acceptance tests, pilot stop conditions, and rollback plan.

Reject or narrow a proposal when it lacks representative data, a process owner, measurable value, or a safe pilot boundary.

## Required architecture

- deterministic orchestration for known steps;
- schemas and validation at every model boundary;
- source contracts, quality gates, provenance, and reproducible data/index versions;
- retrieval or tools only where they add evidence/capability;
- durable state for long-running work;
- timeouts, bounded retries, idempotency, and dead-letter/manual recovery;
- least-privilege credentials and tenant/user access filtering;
- approval for external communication, deletion, finance, account changes, or other high-impact actions;
- evidence-linked output, clear abstention, user correction, cancellation, and human escalation;
- versioned prompts, models, schemas, and eval data;
- traces, metrics, and alerts with sensitive-data controls.

## Evaluation package

Create at least 75 representative cases, including common, difficult, malformed, adversarial, “should abstain/escalate,” and protected-segment/operating-condition examples. Report:

- task success and critical-error rate;
- field-level or step-level accuracy where applicable;
- retrieval recall/precision and citation correctness where applicable;
- approval/escalation rate and false automation rate;
- p50/p95 latency, tokens, and cost per completed task;
- results by important segment, not only the average;
- data/media quality, provenance, and deletion/permission tests where applicable;
- product completion, correction, abandonment, adoption, and reviewer workload;
- comparison with the manual and non-LLM baselines;
- top failure categories and the next experiment.

Do not use an LLM judge alone for consequential claims. Calibrate automated graders against human-reviewed samples.

## Business case

Use transparent assumptions:

    monthly_value =
      (tasks_per_month × minutes_saved_per_task ÷ 60 × loaded_hourly_cost)
      + avoided_rework
      + incremental_value
      - model_and_infrastructure_cost
      - review_and_maintenance_cost

Also report adoption, quality, and risk. “Time saved” is not realized value if staff must redo outputs or the workflow is not used.

## Deliverables

- source code/workflow export and reproducible setup;
- architecture and data-flow diagram;
- process map and baseline measurements;
- source/data contract, dataset or index manifest, quality report, and lineage/lifecycle evidence;
- user-flow/state map with tested success, uncertainty, error, correction, approval, and fallback states;
- eval dataset, grader definitions, and results;
- threat model, privacy/data notes, and red-team report;
- deployment configuration, monitoring view, runbook, and rollback procedure;
- five-minute user demo;
- ten-minute technical/business defense;
- one-page case study suitable for a portfolio.

## Four-week studio cadence

1. **Week 1: scope and skeleton:** approve the proposal, freeze the baseline and initial eval set, and complete one end-to-end path with durable state.
2. **Week 2: quality and user control:** improve the largest measured failure bucket; complete evidence, validation, review, and correction UX.
3. **Week 3: hardening and pilot:** threat-model, red-team, load-test, deploy, rehearse rollback/incident response, and run the bounded pilot.
4. **Week 4: decision and defense:** analyze outcome/adoption/guardrail results, close reproducibility gaps, and rehearse the technical and business defense.

## Capstone rubric (100 points)

| Area | Points |
|---|---:|
| Problem selection, workflow map, baseline, and target | 10 |
| Data quality, provenance, permissions, and lifecycle | 10 |
| Functional correctness, evidence, and user control | 15 |
| Evaluation quality and honest error analysis | 20 |
| Architecture, code/workflow quality, and reproducibility | 10 |
| Security, privacy, approvals, and failure containment | 15 |
| Reliability, observability, cost, and operations | 10 |
| Pilot outcomes, adoption, business impact, and communication | 10 |

Passing: 70. Portfolio distinction: 85, with at least half the available points in every area.
