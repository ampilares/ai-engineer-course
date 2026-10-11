# Module 14: Production engineering and LLMOps

**Time:** 1 week

**Outcome:** Deploy an observable, recoverable, cost-aware AI service with explicit reliability targets.

## Learn

- Architecture boundaries: API, workers, queues, databases, object/vector stores, model providers, and workflow engines.
- Containers, environments, configuration, secrets, migrations, CI/CD, and infrastructure basics.
- Synchronous versus asynchronous work, streaming, concurrency, backpressure, and rate limiting.
- Timeouts, retry policy, circuit breakers, fallbacks, idempotency, durable checkpoints, and dead letters.
- SLOs/SLIs for availability, task success, critical error, latency, freshness, and unit cost.
- Prompt/model/data versioning, tracing, drift, continuous evaluation, canaries, rollback, and incident response.
- Cost levers: smaller models, routing, caching, prompt/context reduction, batching, retrieval, quantization, and local inference.

## Core resources

- [Full Stack Deep Learning](https://fullstackdeeplearning.com/): free end-to-end product and LLMOps courses.
- [Google Cloud: Deploy and operate generative AI applications](https://docs.cloud.google.com/architecture/deploy-operate-generative-ai-applications): production lifecycle guidance.
- [Docker Get Started](https://docs.docker.com/get-started/): container fundamentals.
- [FastAPI deployment concepts](https://fastapi.tiangolo.com/deployment/concepts/): service deployment concerns.
- [OpenTelemetry documentation](https://opentelemetry.io/docs/): vendor-neutral traces, metrics, and logs.
- [GitHub Actions documentation](https://docs.github.com/en/actions/get-started/understand-github-actions): CI/CD foundation.

## Labs

1. Containerize the service and deploy it to a free/local target.
2. Move a long-running model workflow behind a queue/worker or durable workflow mechanism.
3. Add request IDs, structured logs, traces, token/cost metrics, and a minimal health view.
4. Define SLOs and alert thresholds; inject provider timeout and database outage.
5. Add a canary configuration and demonstrate rollback.
6. Profile cost/latency; reduce one by 30% while preserving the eval threshold.

## Project acceptance

- deployment is reproducible from version control;
- secrets are externally managed;
- readiness/health do not falsely report success;
- failure/retry behavior is bounded and avoids duplicate side effects;
- prompts, models, datasets, and schema versions appear in traces;
- dashboards/alerts reflect user outcomes, not only server uptime;
- the runbook covers degradation, rollback, data repair, and escalation.
