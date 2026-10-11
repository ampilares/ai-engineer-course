# Module 6: LLM application primitives

**Time:** 2 weeks

**Outcome:** Build a provider-portable service that produces validated, evaluated structured results.

## Learn

- Model/API selection across quality, latency, context, modalities, privacy, and price.
- Message roles, instructions, examples, delimiters, constraints, and context engineering.
- Structured outputs with JSON Schema; extraction, classification, summarization, and transformation.
- Tool/function calling as a request to application code, not model-side execution.
- Streaming, retries, rate limits, caching, batching, fallbacks, and token/cost accounting.
- Prompt injection boundaries; treating model outputs as untrusted.
- When deterministic code, search, or classical ML is a better solution.

## Core resources

- [OpenAI developer documentation](https://developers.openai.com/api/docs/): Responses, prompting, structured outputs, tools, embeddings, and evals.
- [Anthropic API learning hub](https://www.anthropic.com/learn/build-with-claude): prompt engineering, tool use, and context engineering.
- [Google Gemini tools guide](https://ai.google.dev/gemini-api/docs/tools): tool calling and structured output distinctions.
- [DeepLearning.AI short courses](https://www.deeplearning.ai/short-courses/): use the prompt engineering and API systems courses as guided practice.
- [Full Stack Deep Learning LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/): application lifecycle perspective.

Provider pages change. Use current official SDK docs and keep your own adapter interface stable.

## Labs

1. Build the same simple classification request against a hosted or local model and a fake test client.
2. Create a strict schema for an email, invoice, or support ticket; reject invalid output.
3. Construct 30–50 examples before tuning the prompt. Include ambiguity and missing fields.
4. Compare zero-shot, few-shot, and decomposition approaches on the fixed dataset.
5. Add timeout, bounded retry, cost/latency logging, and a human-review route.

## Project acceptance

- model output is parsed into a typed schema;
- application authorization is not delegated to the model;
- configuration and prompts are versioned;
- the eval dataset includes difficult and abstention cases;
- results compare at least two configurations;
- no secrets or personal data appear in traces;
- the README documents provider/local substitution.

## Decision exercise

For five proposed features, choose among rules, SQL/search, classical ML, one LLM call, RAG, workflow, or agent. Defend the least complex option that meets the target.
