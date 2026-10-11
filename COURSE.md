# Course syllabus

## Audience and prerequisites

This course supports three entry points:

- **New programmer:** complete the interactive Python and math on-ramps, then begin core Module 1. Allow 36–40 weeks, including the capstone and career module.
- **Working developer or data analyst:** complete the diagnostic, use either on-ramp as needed, then follow the standard 32-week core plan.
- **Experienced ML or software engineer:** use the diagnostic to enter at core Module 5 or 6 and follow the 16-week fast track.

No degree is required. Algebra, basic statistics, and comfort using a computer are enough to begin. Advanced learners can take the optional “from scratch” and fine-tuning work.

## Weekly learning rhythm

Each standard week uses approximately 8–10 hours:

1. **Learn (2 hours):** selected reading/video; make concept notes.
2. **Reproduce (2 hours):** follow a small example without copying blindly.
3. **Build (3–4 hours):** complete the lab on a different problem or dataset.
4. **Evaluate (1 hour):** create tests, inspect failures, and record metrics.
5. **Explain (1 hour):** demo the artifact and write a short decision log.

Watching resources is preparation, not completion. A week is complete only when its evidence is in the portfolio.

## How module numbers map

This syllabus numbers the fifteen core modules from 1 to 15. The interactive platform adds Python and math before the core, so core Module 1 appears there as platform Module 3 and core Module 15 appears as platform Module 17. The platform then adds Getting Hired as Module 18. References inside interactive lessons use platform numbers.

## Standard 32-week plan

| Week | Module | Key question | Evidence |
|---:|---|---|---|
| 1–2 | [1. Engineering foundations](modules/01-engineering-foundations.md) | Can I reliably move data between files, APIs, and a database? | tested Python data/API worker |
| 3–4 | [2. Data engineering for AI systems](modules/02-data-engineering.md) | Can I reproduce, validate, trace, update, and delete the data behind an AI system? | versioned data/knowledge pipeline + quality report |
| 5–6 | [3. Data, math, and classical ML](modules/03-ml-foundations.md) | Can I frame and evaluate a prediction problem without leakage? | model card + baseline model |
| 7–9 | [4. Deep learning](modules/04-deep-learning.md) | How do neural networks learn representations, and how do I diagnose training? | reproducible fine-tuning experiment + error analysis |
| 10–11 | [5. How LLMs work](modules/05-llm-foundations.md) | What happens between input tokens and generated tokens? | tokenizer/attention/inference experiments |
| 12–13 | [6. LLM application primitives](modules/06-llm-application-primitives.md) | How do I make model behavior useful and machine-consumable? | typed extraction/classification service + eval |
| 14–15 | [7. Retrieval-augmented generation](modules/07-rag.md) | How do I ground answers in changing private knowledge? | cited assistant + stage-level retrieval benchmark |
| 16–17 | [8. Tools, agents, and MCP](modules/08-agents-and-tools.md) | When should a model control a workflow? | crash-tested bounded agent with guarded tools |
| 18–19 | [9. Multimodal AI systems](modules/09-multimodal-ai.md) | How do I preserve evidence across documents, images, audio, and realtime interaction? | evaluated document/vision/speech worker |
| 20–21 | [10. AI product engineering and UX](modules/10-ai-product-engineering.md) | Does the system improve a user decision and remain understandable and controllable? | tested prototype + architecture/pilot decision pack |
| 22–23 | [11. Business workflow automation](modules/11-business-automation.md) | Where does AI improve an actual operating process? | crash-tested workflow + ROI baseline |
| 24–25 | [12. Evaluation and observability](modules/12-evaluation.md) | How do I know a probabilistic system is improving? | regression gate + validated grader + trace review |
| 26 | [13. Safety, security, and governance](modules/13-safety-security.md) | How can this system fail, get attacked, or cause harm? | threat model + red-team and impact reports |
| 27 | [14. Production and LLMOps](modules/14-production-llmops.md) | Can it run reliably at an acceptable unit cost? | deployed service + SLO/dashboard/runbook |
| 28 | [15. Expert topics](modules/15-expert-topics.md) | Does an advanced optimization beat the strongest simple baseline? | controlled optimization experiment |
| 29–32 | [Capstone](CAPSTONE.md) | Can I produce and defend a production-shaped pilot? | working system + evaluation + security + operational and business case |

## Fast-track 16-week plan

Use only after passing the foundation gate in [ASSESSMENTS.md](ASSESSMENTS.md).

| Week | Focus |
|---:|---|
| 1 | Python/API/SQL diagnostic build plus source contracts, lineage, and data-quality gates |
| 2 | Classical ML framing, splits, metrics, baselines, and error analysis |
| 3 | Deep learning training diagnosis and transformer internals |
| 4 | Model APIs, prompts, schemas, context, caching, cost, and latency |
| 5 | RAG ingestion, hybrid retrieval, citations, permissions, and stage evaluation |
| 6 | Tool calling, durable agent state, workflow-vs-agent judgment, and MCP |
| 7 | Document/vision/speech architecture and modality-specific evaluation |
| 8 | Product discovery, AI UX, architecture decisions, and pilot design |
| 9 | API/workflow automation, queues, idempotency, approvals, and ROI baseline |
| 10 | Dataset design, graders, regression gates, traces, and production feedback |
| 11 | Prompt injection, privacy, least privilege, threat modeling, and governance |
| 12 | Deployment, capacity, reliability, observability, cost, and incident rehearsal |
| 13 | Advanced retrieval, fine-tuning, quantization, or local inference experiment |
| 14–16 | Capstone implementation, pilot, evaluation, hardening, and defense |

## Project ladder

Use one domain throughout when possible, customer support, sales operations, finance operations, legal knowledge, HR operations, software delivery, or a nonprofit workflow. Each project should build on the previous artifact.

### Project 1: Reliable data worker

Ingest records from a public API, validate them, store them in SQLite/PostgreSQL, expose a small API, and test failure paths. No LLM.

### Project 2: Trustworthy data release

Write a source contract, ingest changing deliveries idempotently, add dataset-level quality gates and lineage, publish a version atomically, and prove that correction, permission revocation, and deletion reach every active derivative.

### Project 3: Predictive baseline

Frame a supervised ML problem, create a naive baseline, split data correctly, train a model, inspect errors by segment, and publish a model card.

### Project 4: Structured AI worker

Turn emails, forms, transcripts, or invoices into a strict schema. Compare prompt/model configurations on at least 30 representative examples. Route low-confidence or invalid results to a human.

### Project 5: Knowledge assistant

Ingest a small, permission-safe document set; implement hybrid or semantic retrieval; answer with citations; evaluate retrieval separately from answer quality; return “insufficient evidence” when appropriate.

### Project 6: Multimodal product prototype

Process a document, image, or recording while preserving region/timestamp evidence, then place the result in a tested interface with uncertainty, correction, cancellation, and human escalation. Compare native and staged architectures and write a pilot decision pack.

### Project 7: Guarded workflow

Connect triggers, deterministic steps, an LLM decision, external tools, a durable state store, retry/idempotency logic, and a human approval step. Measure the manual baseline and the pilot.

### Project 8: Production capstone

Deploy the workflow with versioned data, an eval suite, threat and privacy assessment, observability, cost/latency budget, SLO, rollback, incident runbook, adoption evidence, and an honest ROI decision. See [CAPSTONE.md](CAPSTONE.md).

## Competency map

| Competency | Beginner | Practitioner | Expert evidence |
|---|---|---|---|
| Software | scripts and Git | tested APIs and databases | reliable distributed workflow |
| ML | metrics and splits | baseline and error analysis | controlled training/optimization |
| LLMs | tokens and prompts | schemas, retrieval, tools | model/system trade-off analysis |
| Data | load and clean | provenance and pipelines | governance, freshness, access isolation |
| Multimodal | identify perception task | preserve layout/region/time evidence | realtime, accessibility, and stage-local evaluation |
| Evaluation | manual examples | versioned regression set | online/offline evaluation loop |
| Automation | trigger/action | retries, idempotency, approvals | process redesign and measurable ROI |
| Safety | recognize risks | threat model and least privilege | defense-in-depth and incident response |
| Product | demo a feature | define users, boundaries, and recovery UX | controlled pilot, adoption, accessibility, and unit economics |

## What is deliberately not required

- Training a frontier model. An AI engineer usually builds systems around models, not frontier pretraining clusters.
- Memorizing every framework. Learn one deeply enough to understand its abstractions.
- Expensive GPUs or subscriptions. Use small datasets, local runtimes, Colab/Kaggle, and free tiers.
- Autonomous agents for every task. Reliability often comes from deterministic orchestration plus narrow model decisions.
