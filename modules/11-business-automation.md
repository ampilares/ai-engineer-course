# Module 11: Business workflow automation

**Time:** 2 weeks

**Outcome:** Redesign and automate a real workflow with measurable value, reliable handoffs, and clear ownership.

## Learn

- Process discovery: trigger, actors, steps, systems, inputs, decisions, exceptions, controls, and outcome.
- Baselines: volume, wait/work time, error/rework, SLA, cost, conversion, and user satisfaction.
- Use-case scoring: value, feasibility, data readiness, ambiguity, integration effort, adoption, and risk.
- Deterministic automation versus LLM judgment versus agentic control.
- APIs, webhooks, schedules, queues, credentials, OAuth, transformations, and state.
- Reliability: idempotency keys, retries/backoff, deduplication, compensating action, dead-letter/manual queues.
- Change management, process ownership, adoption, and benefits realization.

## Core resources

- [n8n Foundations](https://learn.n8n.io/programs/2a2aae4a-aebd-4366-993b-70eaf0024670/about): free workflows, integrations, APIs, AI, and production practices.
- [n8n documentation](https://docs.n8n.io/) and [workflow templates](https://n8n.io/workflows/): official reference and examples.
- [Zapier AI quick-start guide](https://help.zapier.com/hc/en-us/articles/18590756459277-AI-quick-start-guide-in-Zapier): accessible low-code comparison.
- [OpenAI: Identifying and scaling AI use cases](https://openai.com/business/guides-and-resources/identifying-and-scaling-ai-use-cases/): workflow-oriented use-case discovery.
- [Microsoft Learn: Business value of generative AI](https://learn.microsoft.com/en-us/training/paths/explore-business-value-generative-ai-solutions/): free leader-focused learning path.

## Labs

1. Shadow/interview a process owner and map the current workflow, including exceptions and approvals.
2. Rank five opportunities using value, feasibility, risk, and learning value.
3. Automate a deterministic “happy path” in n8n or code before inserting an LLM.
4. Add one model decision for unstructured input and a confidence/validation-based review route.
5. Simulate duplicates, downstream outage, expired credentials, malformed input, and partial completion.
6. Pilot on low-risk examples and measure against the manual baseline.

## Project acceptance

- one named process owner and primary user validate the map;
- the workflow has a measurable before/after target;
- AI is confined to steps that need language/ambiguity handling;
- credentials use minimum scopes and no secret is embedded in an export;
- retries do not duplicate external actions;
- every failure has a visible recovery path;
- ROI includes review, maintenance, model, and infrastructure cost.

## Suggested starter workflows

Daily operations brief, inbound request triage, meeting action drafting, document extraction and exception routing, or cited account research. Avoid unsupervised outbound messages, payments, hiring decisions, or legal/medical determinations.
