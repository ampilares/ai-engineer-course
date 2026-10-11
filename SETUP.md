# Setup

Start with a browser, an approved general assistant if available, and this repository. No account or API key is needed to read the material or run the offline JavaScript labs.

## Engineering route

Use an editor, Git, and Node.js 24.12 or a newer compatible release with `node:sqlite`. Reference labs use built-in modules and need no package installation. Node.js 24.12.0 was used for verification. This is not a statement that the same version meets OpenClaw's current requirements.

From the repository root:

```sh
node --version
node course/labs/reference.mjs report
node --test course/labs/reference.test.mjs
node course/labs/reference.mjs evaluate course/case-study/recorded-predictions.json
```

Expect AUD 6,300 net from eight accepted events, passing tests, and 18/20 correct authored predictions. The tested runtime's SQLite experimental warning is expected. See [lab instructions](course/labs/README.md).

The optional MCP server uses Python and the [official MCP SDK](https://github.com/modelcontextprotocol/python-sdk). Use a supported Python version, install `mcp` in an isolated environment, and record its version. Configure a compatible client to launch `course/labs/mcp_server.py` with that environment's Python executable over stdio. The server has a fixed analyst role; it is not an authentication service.

## Business-owner route

Open [the review prototype](course/labs/review-prototype.html) in a browser. It is a local rule-based demonstration: no AI call, messaging, or persistence after reload. Practise preparing, correcting, approving, rejecting, and recording a draft. Check it against [the case pack](course/case-study/README.md).

Use an approved spreadsheet or calculator for the data and value exercises. For n8n and agent-platform labs, use test accounts or prepared environments with an implementation partner.

## Optional live work

Choose one general assistant and one implementation route. Add accounts as each lab requires them. Record product version or retrieval date, plan, visible model, access, budget, and stop procedure. Subscription access and API billing can differ.

The optional [live extraction sample](course/labs/live-extract.mjs) sends one fictional ticket to the OpenAI Responses API. Privately configure `OPENAI_API_KEY` and `OPENAI_MODEL` in an environment or approved secret store. Choose a model supporting the linked structured-output interface.

```sh
node course/labs/live-extract.mjs T09
```

This can incur usage charges. Record actual usage and semantic correctness. Authored fixture predictions are offline examples, not outputs from this call.

Follow current official instructions linked in the [OpenClaw](course/weeks/09.md), [Hermes](course/weeks/10.md), and [Grok Bot](course/weeks/11.md) chapters. Use dedicated environments and fictional files. Stop schedules and revoke test integrations after the lab.

## Data and access

Use `course/case-study/agent-inputs/` for direct file uploads. Keep review answers, labelled cases, recorded predictions, assessments, and private policy fixtures outside agent context. The retrieval reference reads the complete corpus specifically to demonstrate application-enforced filtering.

Real workplace exercises require authorised data and accounts. Define the owner and allowed outputs before connecting integrations. A prompt cannot remove permissions the underlying account already possesses.

The [site README](site/README.md) covers the learning platform. These labs run independently of its database and email configuration. Updating local curriculum files does not deploy them or migrate learner records.
