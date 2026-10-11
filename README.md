# Practical AI Engineer

An open, project-based course for becoming an AI engineer: from Python and machine learning foundations to LLM applications, agents, workflow automation, evaluation, security, and production operations.

**Edition:** July 2026

**Core duration:** 32 weeks at 8–10 hours per week

**Fast track:** 16 weeks at 15–20 hours per week

**Cost:** Course materials are free. Most labs can use local models or free tiers; paid API credits are optional.

## What an AI engineer does

An AI engineer turns a useful but probabilistic model into a dependable product or business process. That means more than prompting: problem selection, data and APIs, retrieval, tools, evaluation, security, deployment, monitoring, cost control, and change management all belong in the job.

By the end, a learner can:

- identify workflows where AI creates measurable value, and reject poor use cases;
- build typed Python services that call model APIs and local models;
- explain tokens, embeddings, attention, transformers, pretraining, post-training, and inference;
- design prompts, structured outputs, retrieval systems, tools, and agent loops;
- automate business processes with APIs, webhooks, queues, and n8n;
- evaluate quality, safety, latency, and cost before and after deployment;
- apply least privilege, human approval, privacy controls, and threat modeling;
- deploy, observe, improve, and communicate the ROI of an AI system.

## Start here

1. Read the [course syllabus](COURSE.md).
2. If you are new to programming or need a math refresher, begin with the interactive Python and math on-ramps in `site/`.
3. Take the [entry diagnostic](ASSESSMENTS.md#entry-diagnostic) and choose a route.
4. Set up the free tooling in [SETUP.md](SETUP.md).
5. Work through the [core module guides](modules/) in order.
6. Record evidence in a learning log: decisions, experiments, evaluation results, failures, and demonstrations.
7. Complete one capstone using [the project brief and rubric](CAPSTONE.md).
8. Finish with the interactive career module on portfolio, interviews, and the first ninety days.

## Repository map

| File | Purpose |
|---|---|
| [COURSE.md](COURSE.md) | Outcomes, schedule, routes, projects, and teaching model |
| [SETUP.md](SETUP.md) | Free/local toolchain and accounts |
| [ASSESSMENTS.md](ASSESSMENTS.md) | Diagnostic, weekly evidence, gates, and grading |
| [CAPSTONE.md](CAPSTONE.md) | Production capstone options, deliverables, and rubric |
| [RESOURCES.md](RESOURCES.md) | Curated, annotated free courses, articles, docs, and videos |
| [TEACHING.md](TEACHING.md) | Guidance for cohorts, mentors, and self-directed learners |
| [modules/](modules/) | Fifteen core learning modules, labs, and acceptance criteria |

## Curriculum numbering

The repository syllabus numbers the fifteen core modules from 1 to 15. The interactive platform in `site/` contains eighteen modules: Python and math on-ramps are platform Modules 1 and 2, the fifteen core modules are platform Modules 3 through 17, and the career module is platform Module 18. Lesson references inside the interactive platform use platform numbers; the root syllabus and `modules/` guides use core numbers.

## The learning path

| Phase | Weeks | Build |
|---|---:|---|
| Software and data foundations | 1–4 | tested API/data worker plus a versioned, replayable dataset |
| ML and deep learning | 5–9 | trained, evaluated prediction service with reproducible experiments |
| LLM foundations and applications | 10–13 | typed, evaluated model service with cost and latency budgets |
| Retrieval and agents | 14–17 | cited knowledge assistant plus bounded tools and durable state |
| Multimodal and product engineering | 18–21 | evidence-preserving media workflow and tested AI product prototype |
| Automation and evaluation | 22–25 | reliable business workflow, pilot baseline, regression suite, and traces |
| Security and production operations | 26–27 | threat model, guarded deployment, SLOs, rollback, and incident rehearsal |
| Expert experiment and capstone | 28–32 | controlled optimization plus production pilot and ROI decision |

## Course principles

- **Build before framework.** Learn the primitive, HTTP call, retrieval, loop, state, before adding an abstraction.
- **Evals before optimization.** A change is not an improvement until a representative test set says so.
- **Workflow before agent.** Use deterministic code for known paths and model judgment only where ambiguity earns its cost.
- **Human authority for consequential actions.** Irreversible, financial, sensitive, or high-impact steps require explicit controls.
- **Business outcome over demo quality.** Track cycle time, error rate, throughput, adoption, and unit economics.
- **Provider portability.** Concepts and interfaces matter more than one model or orchestration library.

## Keeping it current

AI APIs and frameworks change quickly. The concepts, outcomes, and evaluation criteria are stable; version-specific snippets are not. Resources were checked during July 2026. Before teaching, verify provider documentation and replace any retired interface while preserving the learning objective.

## License note

This repository links to external resources; each remains under its owner’s terms and license. Do not copy third-party course content into commercial materials without checking its license.
