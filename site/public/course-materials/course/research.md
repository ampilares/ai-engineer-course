# Research register

**Documentation checked: 11 October 2026.** Sources below are primary product documentation, original research, or the responsible standards/security organisation. Lesson explanations, Harbour data, rubrics, and numerical examples are original teaching designs. They are not vendor performance claims.

The research verifies documented capabilities, not live account availability, installation success, or model quality. Runtime requirements, plans, routing, and prices can change. Record the actual environment and rerun the relevant cases before teaching or choosing a product.

## Foundations and implementation

| Primary source | Supports | Applied in |
|---|---|---|
| [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Workflow/agent distinction and simple composable patterns | Weeks 1, 8 |
| [ChatGPT learning best practices](https://learn.chatgpt.com/guides/best-practices) | Clear instructions, context, and iterative work | Week 2 |
| [Python CSV reference](https://docs.python.org/3/library/csv.html) | Real CSV parsing concerns beyond the small fixture parser | Week 3 |
| [Codex learning resources](https://developers.openai.com/learn/codex) | Coding-agent workflow and product learning references | Week 4 |
| [Claude Code overview](https://code.claude.com/docs/en/overview) | Alternative coding-agent interface and capabilities | Week 4 |
| [Cursor Agent overview](https://cursor.com/docs/agent/overview) | Repository-oriented coding assistance | Week 4 |
| [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) | Responses JSON-schema interface, refusals, incomplete output | Week 5 and optional live sample |
| [Lewis et al., Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) | Original retrieval-augmented generation architecture | Week 6 |
| [SQLite transactions](https://sqlite.org/lang_transaction.html) | Local commit boundaries and transaction behaviour | Week 7 |
| [n8n Edit Fields](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/) and [If node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/) | Preparing fields and branching | Week 7 |
| [n8n human review for tools](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/) | Reviewed agent tool execution | Week 7 |
| [MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro), [versioned tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools), and [Python SDK](https://github.com/modelcontextprotocol/python-sdk) | Hosts/clients/servers, tool interfaces, FastMCP example | Week 8 |

The MCP tool reference above is explicitly the 2025-06-18 specification. Check the protocol version negotiated by the actual client and SDK; the sample does not establish compatibility with every later version.

## Required platform research

### OpenClaw

Sources: [getting started](https://docs.openclaw.ai/start/getting-started), [gateway CLI](https://docs.openclaw.ai/cli/gateway), [security CLI](https://docs.openclaw.ai/cli/security), [tool permissions](https://docs.openclaw.ai/gateway/security/tool-permissions), [sandboxing](https://docs.openclaw.ai/gateway/sandboxing), and [Telegram channel](https://docs.openclaw.ai/channels/telegram).

These support the dedicated gateway/channel lab, gateway status and dashboard checks, security audit, and inspection of tool/sandbox boundaries. The course's Node.js lab version must not be assumed to satisfy current OpenClaw requirements. Confirm sender access and available tools in the installed configuration. A successful setup or audit alone does not prove safe behaviour under all inputs.

### Hermes Agent

Sources: [documentation](https://hermes-agent.nousresearch.com/docs/), [quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart), [memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory), [skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [security](https://hermes-agent.nousresearch.com/docs/user-guide/security), and [Nous Portal integration](https://hermes-agent.nousresearch.com/docs/integrations/nous-portal).

These support setup/model configuration, memory-file inspection, reusable SKILL.md procedures, and security review. Hermes Agent is the application; Hermes-branded models and the inference provider are distinct choices. A model saying it remembered something is not evidence of a persistent write. Test a fresh session and inspect the actual state.

### Grok Bot

Here, "Grokbot" refers to **Cursor's Grok Bot**, the agent product documented by Cursor, rather than Grok chat or an unrelated community bot. Sources: [overview](https://cursor.com/docs/grok-bot), [work tasks](https://cursor.com/docs/grok-bot/work), [security](https://cursor.com/docs/grok-bot/security), [FAQ](https://cursor.com/help/grok-bot/faqs), [routines](https://cursor.com/help/grok-bot/routines), and [models](https://cursor.com/help/grok-bot/models).

The documented account-wide sharing of the cloud computer, files, and signed-in sessions informs the dedicated-account lab. The routine documentation supports testing and pausing recurring work. The model FAQ states that per-request model selection and model visibility are not exposed. Compare complete systems; do not claim a controlled same-model benchmark across all three products. Check actual plan and administrator capabilities before teaching.

## Evaluation and operation

- [OpenAI evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices): structured evaluation and grader practice; applied in Week 12.
- [OWASP prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/): instruction/data confusion and risks; applied in Weeks 8 and 12.
- [Google SRE service-level objectives](https://sre.google/sre-book/service-level-objectives/): indicators, objectives, and measurement windows; applied in Week 13.
- [Ollama documentation](https://docs.ollama.com/): optional local inference setup; applied in the extensions.

The course's 30-case minimum, practical weights, pass threshold, timing estimates, and Harbour economics are curriculum choices. They are not empirical guarantees. Public fixture results establish the behaviour of the supplied examples, not comparative performance of OpenClaw, Hermes, Grok Bot, or a live model.
