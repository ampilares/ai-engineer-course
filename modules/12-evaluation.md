# Module 12: Evaluation, testing, and observability

**Time:** 2 weeks

**Outcome:** Create a repeatable evaluation system that catches regressions and connects offline quality to production outcomes.

## Learn

- Evaluation-driven development: specify → measure → inspect errors → improve.
- Dataset construction from task taxonomy, real traffic, edge cases, adversarial cases, and abstentions.
- Deterministic checks, reference-based metrics, semantic similarity, rubric/LLM judges, human review, and pairwise comparison.
- Calibrating model graders, avoiding leakage/contamination, and reporting uncertainty.
- Component versus end-to-end evals: retrieval, generation, tools, trajectory, and final task state.
- Offline, shadow, canary, A/B, and online evaluation; feedback bias and business outcomes.
- Traces, spans, prompt/model versions, tokens, cost, latency, errors, user feedback, and privacy-aware logs.

## Core resources

- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents): practical multi-turn evaluation design.
- [OpenAI evaluation guide](https://developers.openai.com/api/docs/guides/evals): official evaluation workflow.
- [Google Cloud: Deploy and operate generative AI applications](https://docs.cloud.google.com/architecture/deploy-operate-generative-ai-applications): versioning, end-to-end logging, and continuous evaluation.
- [LangSmith Evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts): datasets, experiments, evaluators, and online evaluation.
- [promptfoo documentation](https://www.promptfoo.dev/docs/intro/): open-source model/prompt testing and red teaming.

## Labs

1. Define a task taxonomy and create 50 representative, versioned test cases.
2. Add exact/schema checks first, then a rubric grader only for qualities that require judgment.
3. Double-label a sample manually; compare human agreement and LLM-judge agreement.
4. Run a prompt/model/retrieval change as an experiment and publish a before/after table.
5. Trace a multi-step workflow; identify whether failures originate in retrieval, reasoning, tool execution, or orchestration.
6. Define production quality, latency, cost, and safety alerts.

## Project acceptance

- dataset provenance and inclusion criteria are documented;
- pass/fail thresholds are chosen before viewing the candidate result;
- critical failures cannot be hidden by a strong average;
- LLM graders are calibrated against human examples;
- versions allow a result to be reproduced;
- production feedback can be turned into reviewed regression cases;
- logs minimize/obscure sensitive content.

## Evaluation report template

State hypothesis, fixed dataset/version, configurations, metrics/thresholds, segment results, confidence/variance, regressions, representative failures, cost/latency, decision, and next experiment.
