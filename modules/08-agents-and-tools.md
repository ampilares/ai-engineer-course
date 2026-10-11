# Module 8: Tools, workflows, agents, and MCP

**Time:** 2 weeks

**Outcome:** Build a bounded agent loop with safe tools, durable state, evaluation, and human approval.

## Learn

- Distinction: single model call, chain, deterministic workflow, router, and model-directed agent.
- Tool schemas, descriptions, argument validation, execution results, errors, and idempotency.
- The agent loop: observe → decide → act → receive result → stop; explicit exit conditions and budgets.
- Orchestration patterns: routing, parallelization, prompt chaining, evaluator-optimizer, supervisor/worker.
- State, short/long-term memory, resumability, human-in-the-loop, and audit trails.
- Model Context Protocol: clients/hosts, servers, tools, resources, prompts, transport, and authorization.
- Why multi-agent designs increase cost and evaluation surface; start with one agent.

## Core resources

- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents): composable patterns and when not to use agents.
- [OpenAI: A Practical Guide to Building AI Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/): models, tools, instructions, orchestration, and guardrails.
- [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction): free beginner-to-expert course with projects.
- [LangChain Academy: Introduction to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph): free stateful orchestration course.
- [Model Context Protocol: Build a server](https://modelcontextprotocol.io/docs/develop/build-server): official multi-language tutorial.

## Labs

1. Implement a tool loop directly with plain Python before using a framework.
2. Give tools narrow schemas and read-only scope; validate every argument and result.
3. Add max turns, timeout, token/cost budget, duplicate-action prevention, and explicit stop states.
4. Require approval before a simulated write/send/refund action.
5. Build a small MCP server exposing one resource and one safe tool.
6. Compare the agent against a deterministic router on the same tasks.

## Project acceptance

- traces show every decision, tool call, result, and stop reason;
- high-impact tools cannot execute without application-level authorization;
- indirect prompt injection from tool content is tested;
- tool errors and partial completion are recoverable;
- an eval set measures task completion and unsafe/incorrect action rate;
- the architecture explains why an agent beats the simpler workflow.

## Stretch

Add durable checkpoints and resume after interruption. Test a framework upgrade against the same behavioral suite.
