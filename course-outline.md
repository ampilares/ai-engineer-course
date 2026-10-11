# Practical AI Engineering and Business Automation

**Course outline: rewritten replacement curriculum**  
**Primary audience:** engineers and technical practitioners  
**Additional audience:** business owners, founders, and operational leaders  
**Duration:** 16 weeks, including a three-week capstone  
**Research checked:** 11 October 2026

Become proficient at using AI to complete useful work, build dependable applications, and improve business processes. Learners progress from everyday assistance to coding, data analysis, private knowledge systems, workflow automation, and supervised agents. Every stage produces a working artifact and evidence of whether it helps.

This is a rewrite of the course structure in this repository. It replaces the previous sequence with earlier practical results, stronger AI-assisted engineering, explicit business-owner exercises, and current agent tooling. Model internals and advanced ML remain available as extensions after learners can build and evaluate a useful system.

## 1. Audience, entry requirements, and format

Everyone follows the same weekly topics. The engineering route is the default; the business-owner route changes the implementation depth while retaining the same standards for evidence, control, and business value.

| | Engineering route | Business-owner route |
|---|---|---|
| Best suited to | Software, data, systems, and domain engineers building tools for their work | Owners, founders, and managers improving a process or commissioning an AI solution |
| Entry requirements | Basic Python or TypeScript, Git, and familiarity with files and APIs | Comfortable with spreadsheets and business software; access to a process they understand |
| Weekly commitment | 8–10 hours; approximately 128–160 hours overall | 5–7 hours; approximately 80–112 hours overall |
| Practical emphasis | Implement, integrate, test, deploy, and maintain | Specify, configure, evaluate, calculate value, and lead adoption |
| Technical support | Independent coding labs with starter fixtures | Guided tools, prepared environments, and low-code templates; engineering pairing where needed |
| Graduation artifact | A tested AI application or automation with an operational runbook | A working automation or supervised assistant, operating procedure, and evidence-based adoption decision |

Allow an optional two-week preparation period for engineers who need Python, Git, JSON, HTTP, or basic SQL. Business owners receive a short primer on APIs, permissions, and data formats. A mathematics or machine-learning degree is unnecessary.

The weekly rhythm is 30 minutes of preparation, a 90-minute workshop, a one-hour review, and route-specific practical work. Learners select a real workflow in Week 1 and develop it throughout the course. Use synthetic or permission-cleared examples until access to real data has been agreed.

## 2. What proficiency means

By the end, every learner should be able to:

1. Select an appropriate approach: ordinary software, a predictive model, an AI assistant, a fixed workflow, or an agent.
2. Give AI a clear task, relevant context, examples, output requirements, and a way to verify completion.
3. Produce and check useful research, documents, spreadsheets, and analyses with traceable evidence.
4. Use AI to build or change a small software tool, then review its behaviour against explicit requirements.
5. Ground answers in authorised business information and recognise missing, stale, or conflicting evidence.
6. Connect tools into a repeatable process with permissions, human review, error handling, and a stop mechanism.
7. Compare AI systems using task success, error severity, latency, cost, and human intervention.
8. Run a bounded pilot and explain whether its measured benefit justifies continued use.

Engineers additionally demonstrate typed interfaces, automated tests, retrieval evaluation, bounded tool execution, deployment, and debugging from logs. Business owners demonstrate process design, vendor assessment, acceptance testing, staff training, and ownership of exceptions.

## 3. Curriculum principles

- **Useful work from the first week.** Begin with the learner's own tasks and introduce theory when it explains behaviour or a failure.
- **A small set of tools used well.** Learn transferable concepts and compare alternatives on the same problem.
- **Evaluation starts early.** Save representative examples before tuning prompts or choosing an agent platform.
- **Match autonomy to the task.** Use fixed steps for predictable processes and bounded agent decisions where flexibility has measurable value.
- **Access is designed deliberately.** Prompts describe boundaries; application permissions and runtime controls must enforce them.
- **Human effort counts.** Measure setup, checking, correction, maintenance, and training alongside the time saved.
- **Deliverables must be explainable.** Learners remain responsible for AI-generated code, calculations, claims, and actions.

## 4. Tool landscape and research findings

The course distinguishes the model, the application used to interact with it, the agent runtime that executes tools, and the workflow that owns the process. Replacing one layer does not automatically replace the others.

| Tool or category | Verified role and reason for inclusion | Course use |
|---|---|---|
| General AI assistants | Use one organisation-approved assistant, such as ChatGPT, Claude, Gemini, or Grok, for the shared exercises. Tool selection is based on the course's task evaluations. | Research, drafting, analysis, and comparing the effect of context |
| Codex, Claude Code, or Cursor | Coding environments are a practical route into repository exploration, implementation, debugging, and review. See the official [Codex learning resources](https://developers.openai.com/learn/codex), [Claude Code overview](https://code.claude.com/docs/en/overview), and [Cursor Agent overview](https://cursor.com/docs/agent/overview). | Choose one for the engineering labs; compare a second on a small task |
| n8n | A visual automation option with documented human approval for selected agent tools. See [n8n's human-review documentation](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/). | Shared automation exercises and the business-owner implementation route |
| **OpenClaw** | A self-hosted assistant and gateway connecting messaging channels to agents. It provides a useful setting for learning deployment, channel access, and tool permissions. See [OpenClaw's documentation](https://docs.openclaw.ai/). | Week 9: operate a bounded assistant through one channel |
| **Hermes Agent** | Nous Research's agent system, with persistent memory, reusable skills, tool use, and scheduled automation. Here, “Hermes” means the agent application; the Hermes model family is a separate choice. See [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/) and [the model distinction in its provider guide](https://hermes-agent.nousresearch.com/docs/integrations/nous-portal). | Week 10: teach, inspect, and evaluate a recurring procedure |
| **Grok Bot / Grokbot** | The product documented by Cursor provides persistent Bots working on a cloud computer with tools, files, and browser access. It is distinct from the Grok chat app. See [Grok Bot's overview](https://cursor.com/docs/grok-bot) and [official FAQ](https://cursor.com/help/grok-bot/faqs). | Week 11: delegate a bounded business task and inspect the result |
| Model APIs and structured outputs | A route to integrating AI into software with explicit input and output contracts. The [OpenAI structured-output guide](https://developers.openai.com/api/docs/guides/structured-outputs) supplies one implementation reference; exercises keep business validation separate from schema validation. | Week 5 and subsequent engineering labs |
| Model Context Protocol (MCP) | A standard interface for connecting AI applications to tools and context. See [the official MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro). | Week 8: connect and inspect one restricted tool |
| Local inference | [Ollama](https://docs.ollama.com/) is an optional runtime for exploring local models. | Compare one local configuration with a hosted model when hardware permits |

**Interpretation:** OpenClaw, Hermes Agent, and Grok Bot are useful teaching cases for different operating choices, not a ranking of which product is best. Learners investigate control, convenience, maintenance, and portability through experiments.

Self-hosting an agent does not establish that its data stays local: model calls, search, plugins, and other services may still send data elsewhere. Each project diagrams its actual data flow. Pricing, supported platforms, subscriptions, and administrative controls must be checked before each cohort; the course does not require a subscription to every product.

## 5. Sixteen-week sequence

| Week | Focus | Main evidence |
|---:|---|---|
| 1 | AI foundations and opportunity selection | Workflow baseline and ranked opportunity list |
| 2 | Prompting, context, research, and verification | Reusable task briefs and initial evaluation cases |
| 3 | Data, documents, spreadsheets, and multimodal work | Checked analysis or document-processing workflow |
| 4 | AI-assisted engineering and prototyping | Reviewed software change or tested internal-tool prototype |
| 5 | Model APIs and structured outputs | Validated extraction or classification service |
| 6 | Private knowledge and retrieval | Cited knowledge assistant with evidence tests |
| 7 | Business workflow automation | Recoverable workflow with a review step |
| 8 | Agents, tools, MCP, skills, and memory | Bounded agent with observable tool activity |
| 9 | OpenClaw | Restricted messaging assistant and deployment record |
| 10 | Hermes Agent | Reviewed skill and evidence of behaviour across sessions |
| 11 | Grok Bot and platform comparison | Supervised cloud workflow and comparative scorecard |
| 12 | Evaluation, security, and governance | Regression results, failure analysis, and release decision |
| 13 | Deployment, economics, and adoption | Operational runbook and pilot plan |
| 14 | Capstone implementation | Working end-to-end pilot candidate |
| 15 | Capstone pilot and improvement | Observed results, user feedback, and failure fixes |
| 16 | Capstone demonstration and handover | Final system, evidence pack, and adoption decision |

## 6. Module outlines

### Week 1 — Understand AI and choose useful work

**Learn:** generative AI versus prediction and rules; models versus assistants and agents; tokens, context limits, training versus inference, and why plausible output can be wrong. Compare tasks involving judgement with those needing exact computation. Introduce data permissions and responsibility for decisions.

**Engineering lab:** compare a simple script and an AI-assisted approach to one repetitive engineering task, such as classifying issue reports or preparing release notes.

**Business-owner lab:** map one process, identify delays and errors, and shortlist five opportunities using value, frequency, data readiness, implementation effort, and consequences of failure.

**Evidence:** select one project with a process owner, ten timed baseline examples, a quality measure, an initial budget, and a reason to use AI. Include one task that should remain a conventional process.

### Week 2 — Prompting, context, and reliable research

**Learn:** task briefs, examples, constraints, context selection, source quality, and output formats. Separate facts from assumptions; open cited sources and verify that they support the claim. Distinguish source content from instructions. Introduce prompt versioning and repeatable evaluations.

**Engineering lab:** build reusable briefs for repository investigation, debugging, and technical research; compare two configurations against saved examples.

**Business-owner lab:** create reusable briefs for a customer-response draft, a supplier comparison, and an operating procedure, each with an explicit review checklist.

**Evidence:** a prompt/context library and at least ten scored cases, including missing information and a misleading source. Explain one failed output and the evidence used to correct it.

### Week 3 — Work with data, documents, and media

**Learn:** cleaning CSVs, querying tables, checking spreadsheet formulas, extracting document fields, interpreting charts, and summarising recordings. Preserve page, region, or timestamp references where useful. Check arithmetic with code or spreadsheet formulas. Discuss consent and permitted use of recorded or supplied material.

**Engineering lab:** process a small set of PDFs or support transcripts into validated records; analyse the result with Python or SQL and investigate extraction errors.

**Business-owner lab:** analyse a sales or operations spreadsheet and turn a sample meeting transcript into checked actions with owners and deadlines. Optionally produce a customer-facing draft from approved source material.

**Evidence:** a reproducible report showing its inputs, calculations, references, and corrections. Include a poor-quality input that requires human review.

### Week 4 — Build software with AI assistance

**Learn:** turn a problem into acceptance criteria; inspect an existing repository; supply project instructions; plan a small change; review diffs; run meaningful tests; debug; and revert a change. Treat generated dependencies and commands as items to inspect.

**Engineering lab:** use the selected coding tool to deliver a small feature or fix. Reproduce the original issue, inspect the implementation, and show a test that would catch a plausible regression.

**Business-owner lab:** specify and build a small internal-tool prototype using a guided starter, such as a quote-preparation screen or request intake form. Test it with realistic examples and explain the remaining work before operational use.

**Evidence:** requirements, a working change or prototype, test results, and a short explanation of the AI's contribution and the learner's decisions.

### Week 5 — Integrate model APIs and structured outputs

**Learn:** HTTP requests, authentication, JSON schemas, tool inputs, refusals, incomplete responses, timeouts, rate limits, and usage accounting. A schema-valid response still needs checks for factual and business correctness. Use the [structured-output documentation](https://developers.openai.com/api/docs/guides/structured-outputs) for the selected API implementation.

**Engineering lab:** implement a typed extraction or classification service with input validation, bounded retries, logging, and a manual-review path. Keep credentials out of source code and logs.

**Business-owner lab:** configure the equivalent process in a supplied workflow template, define the required fields and business rules, and test how rejected or incomplete requests are handled.

**Evidence:** at least 20 cases covering typical inputs, missing fields, invalid values, and service failure. Report accuracy, review frequency, processing time, and cost per completed item.

### Week 6 — Build a useful private knowledge assistant

**Learn:** retrieval-augmented generation (RAG); document preparation; keyword and embedding search; chunking; metadata; freshness; permissions; citations; and abstaining when evidence is insufficient. Introduce the difference between retrieval, memory, and fine-tuning.

**Engineering lab:** build retrieval over a small approved document collection, measure retrieval separately from answer quality, and preserve access restrictions when querying.

**Business-owner lab:** curate a policy or product knowledge set in a guided environment. Define who owns updates, which questions are supported, and when an answer must be escalated.

**Evidence:** a cited assistant tested on at least 20 questions, including conflicting sources, an outdated document, an unanswerable question, and an access-restricted item. Demonstrate a source update and removal.

### Week 7 — Automate a business process

**Learn:** triggers, APIs, webhooks, schedules, branching, human review, retry limits, and idempotency: repeating an event without duplicating its business effect. Assign ownership for failed and overdue items. Use [n8n's tool-review mechanism](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/) as one concrete implementation option.

**Engineering lab:** connect an intake source, an AI processing step, a state store, and a review queue. Simulate duplicate delivery and interruption between steps.

**Business-owner lab:** build a lead qualification, support triage, or invoice-extraction workflow with an explicit reviewer and exception procedure.

**Evidence:** a working flow, an approved-action record, a rejected-action record, a failure recovery, and a before/after process map. Replaying a request must not create a duplicate business action.

### Week 8 — Understand agents, tools, MCP, skills, and memory

**Learn:** the agent loop; tool descriptions and schemas; tool-result validation; step, time, and spend limits; task state; procedural skills; and persistent memory. Use the [MCP architecture](https://modelcontextprotocol.io/docs/getting-started/intro) to distinguish the application, client, and server. Discuss when multiple agents add useful separation and when they add overhead.

**Engineering lab:** implement or configure a bounded agent with two restricted tools, connect one approved MCP server, and record its actions. Demonstrate cancellation and a failed tool call.

**Business-owner lab:** write an agent operating brief covering its job, input sources, allowed actions, spending limit, review points, and escalation owner; exercise it in a prepared environment.

**Evidence:** an action trace and a permissions map. Demonstrate that malicious text in a retrieved document cannot authorise an external action. Written instructions alone do not satisfy this test.

### Week 9 — Operate an assistant with OpenClaw

**Learn:** gateway operation, one messaging integration, agent configuration, tool access, and operational ownership. Consult the official [tool-permission guide](https://docs.openclaw.ai/gateway/security/tool-permissions) and [sandboxing guide](https://docs.openclaw.ai/gateway/sandboxing) when configuring the lab.

**Engineering lab:** deploy a restricted OpenClaw environment and connect one test channel. Configure its model access, permitted workspace, limited tools, and approved users. Prepare a daily project or service-status briefing from fixture data.

**Business-owner lab:** use an instructor-prepared instance to specify and operate a daily operations briefing. Review the information it used, the actions it attempted, and the support responsibilities of running it.

**Evidence:** configuration record, redacted logs, and a restart demonstration. Test an unauthorised sender and an out-of-scope tool request. Document what is locally hosted and what still calls an external service.

### Week 10 — Build repeatable procedures with Hermes Agent

**Learn:** how [persistent memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) and [reusable skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) affect later tasks. Distinguish saving a procedure from changing a model's weights. Use the [security documentation](https://hermes-agent.nousresearch.com/docs/user-guide/security) to select the execution environment and tool access.

**Engineering lab:** run a recurring analysis task in an isolated environment, inspect the skill it creates or uses, version the procedure, and evaluate it in a fresh session.

**Business-owner lab:** teach a repeatable weekly operations report using approved inputs. Inspect the saved procedure, correct a mistaken preference, and rerun the task with changed data.

**Evidence:** a reviewed skill, confirmation of what was actually persisted, and a before/after evaluation. Include stale memory and changed source data; remove or correct an unsuitable memory. Any claimed improvement must appear in the results.

### Week 11 — Delegate work with Grok Bot and compare platforms

**Learn:** persistent Bots, connected tools, skills, routines, and visible handoffs. Grok Bot's documentation says Bots on one account share the cloud computer's files and sign-ins; separate Bot names do not provide separate security boundaries. See [working with Grok Bot](https://cursor.com/docs/grok-bot/work).

**Engineering lab:** configure a Bot to assemble a weekly engineering-status brief from test inputs, inspect its work, and exercise a stop or approval boundary. Assess what is observable and exportable.

**Business-owner lab:** configure a Bot to prepare a weekly operational brief and draft follow-up actions. Review the evidence before authorising any action outside the exercise.

**Evidence:** a reviewed output, a tested routine, and the comparison described below. Check account-level controls against [Grok Bot's security documentation](https://cursor.com/docs/grok-bot/security); some organisational controls require Enterprise access.

### Week 12 — Evaluate quality, security, and readiness

**Learn:** development versus held-out cases, end-to-end success, error severity, groundedness, intervention rate, regression testing, and judge calibration. Model-based graders must be checked against human labels; [OpenAI's evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices#llm-as-a-judge-and-model-graders) describes limitations such as response-order and verbosity bias.

Cover prompt injection, overbroad credentials, sensitive logs, unsafe outputs, third-party skills, retention, and access revocation. Identify organisation-specific privacy, licensing, and approval requirements with the appropriate owner.

**Engineering lab:** run the regression set and adversarial cases, inspect traces, fix the most consequential failure, and repeat the affected evaluation.

**Business-owner lab:** conduct an acceptance review, classify unacceptable failures, and define which work needs a human. Assess vendor terms, data flow, exit options, and incident responsibility.

**Evidence:** a release decision supported by test results, residual limitations, access controls, and a failure-response exercise.

### Week 13 — Operate the system and lead adoption

**Learn:** environments, deployment, secrets, monitoring, alerts, service ownership, dependency updates, backups, recovery, and rollback. Track total operating cost. Design user feedback, training, manual fallback, and a limited rollout with clear stop conditions.

**Engineering lab:** deploy the capstone candidate to a controlled environment, record model and configuration versions, add quality/cost/latency monitoring, and rehearse rollback.

**Business-owner lab:** complete a pilot charter, staff procedure, training demonstration, vendor or implementation brief, and budget. Explain how staff report errors and who can pause the workflow.

**Evidence:** an operational runbook, a named owner, a tested recovery path, and a pilot plan with measurable acceptance criteria.

## 7. Agent-platform comparison exercise

Use the same fictional company, source documents, reporting period, and output requirements across OpenClaw, Hermes Agent, and Grok Bot. The task is to produce a weekly operations brief from support tickets, a sales CSV, and an operating policy, with source references and proposed actions saved for review.

Include a missing input, a conflicting policy, a request outside the allowed scope, and an instruction embedded in a source document. Keep live customers and production systems out of the exercise.

| Dimension | Evidence to collect |
|---|---|
| Task quality | Correct facts, useful prioritisation, complete output, and supported references |
| Human effort | Setup minutes, review minutes, corrections, and interventions |
| Permissions | Actions allowed or blocked, available enforcement, and identity used by tools |
| State | Behaviour after a fresh session, stale memory, and changed source data |
| Reliability | Missing-input handling, restart or interrupted-run recovery, and stop behaviour |
| Economics | Observed usage, elapsed time, hosting or subscription allocation, and maintenance effort |
| Operability | Logs, version visibility, troubleshooting, and upgrade responsibilities |
| Portability | Ability to recover instructions, skills, source data, outputs, and process documentation |

Run a common set of at least five cases per platform. Where model choice is exposed, record it and hold it constant when possible. Grok Bot currently does not expose per-request model selection or the model used; its [model-routing FAQ](https://cursor.com/help/grok-bot/models) makes this explicit. Treat the results as comparisons of complete systems rather than controlled model benchmarks.

Every learner completes the comparison. Implement one platform deeply; use guided runs or instructor-provided outputs and action records for the other two if access or cost prevents hands-on use. Label observed, replayed, and unavailable capabilities separately. End with a recommendation for the chosen workflow, including the option to use a simpler automation.

## 8. Capstone: deliver one useful AI system

The capstone grows from the workflow chosen in Week 1. Scope it to one process, one accountable owner, a small user group, and a bounded set of actions.

| Project | Engineering emphasis | Business-owner emphasis |
|---|---|---|
| Support triage and response drafting | Classification, knowledge retrieval, tool integration, and evaluation | Service procedure, escalation rules, response quality, and handling time |
| Engineering knowledge and incident assistant | Permission-aware retrieval, log analysis, and reviewed runbook suggestions | Operational continuity, escalation ownership, and response coordination |
| Sales research and proposal preparation | CRM fixtures, source retrieval, document generation, and traceability | Qualification criteria, proposal accuracy, and review workflow |
| Document intake and exception handling | Extraction, schema/business validation, and recoverable processing | Review queues, exception ownership, and processing cost |
| Weekly operations reporting | Data ingestion, checked calculations, grounded synthesis, and scheduling | Decision usefulness, staff time, report ownership, and adoption |

**Week 14 — Implement:** complete the narrow end-to-end workflow and freeze its initial acceptance criteria and held-out evaluation cases.

**Week 15 — Pilot:** run with a small authorised group or a clearly labelled simulation. Capture success, errors, human corrections, time, and cost. Fix the most consequential failure before expanding scope.

**Week 16 — Demonstrate and hand over:** show the successful path, a failure, a blocked action, and recovery. Defend the measured results and a decision to adopt, revise, or stop.

Required deliverables:

1. A problem statement, manual baseline, workflow map, and success criteria.
2. A working application, automation, or configured assistant, with reproducible setup.
3. Versioned prompts, source configuration, code or workflow export, and reviewed skills where used.
4. An evaluation set of at least 30 cases: at least 20 for development and 10 held out until final assessment. Cover ordinary cases, ambiguity, missing data, and boundary violations.
5. Results for task success, consequential errors, interventions, elapsed time, and cost, with the denominator and data source for each metric.
6. A permissions and data-flow record, human-review rules, and evidence of enforced boundaries.
7. A runbook covering ownership, monitoring, stopping, recovery, updates, and manual fallback.
8. A business case, a short user guide, and a five-minute demonstration.

Thirty cases are a classroom minimum for finding problems, not evidence of production safety or statistical certainty. Higher-consequence uses need a larger, appropriately designed evaluation before release. A simulated pilot must not be reported as measured workplace impact.

## 9. Assessment and progression gates

| Assessment | Weight | What earns credit |
|---|---:|---|
| Weekly practical portfolio | 30% | Working artifacts, verified outputs, and explanations of failures |
| Agent-platform comparison | 15% | Consistent inputs, transparent constraints, and a supported selection decision |
| Capstone | 45% | Functional delivery, evaluation, controls, recoverability, and credible value |
| Demonstration and handover | 10% | Independent understanding and a usable operating procedure |

The completion threshold is 70% overall **and** all applicable progression gates:

- **After Week 4:** verify an AI-produced artifact independently and explain a substantive correction.
- **After Week 7:** demonstrate validation, a human decision point, and recovery without duplicate actions.
- **After Week 11:** explain and demonstrate an agent's access boundaries and stop mechanism.
- **At graduation:** pass the capstone's pre-agreed quality thresholds, show no unauthorised actions in the boundary tests, and demonstrate the manual fallback.

The engineering route requires implementation evidence and meaningful automated tests. The business-owner route requires a functioning configured workflow, acceptance results, and an operating procedure; a slide-only strategy submission is insufficient. AI assistance is permitted, but learners must explain and revise their own submission.

## 10. Measure business value honestly

Collect the manual baseline before introducing automation. Measure both total elapsed time and active staff time: a faster machine run may still require substantial checking.

Use a simple monthly model:

```text
Capacity value = monthly case volume
                 × (baseline staff minutes − pilot staff minutes) / 60
                 × loaded hourly staff cost

Net monthly value = capacity value
                    + separately evidenced benefits
                    − model, subscription, hosting, and tool costs
                    − ongoing maintenance and training costs

Payback period = one-off implementation cost / positive net monthly value
```

Pilot staff minutes include review, corrections, and exceptions. Avoid counting the same benefit or expense twice. Report released staff capacity separately from cash savings, and treat unmeasured revenue or quality benefits as hypotheses. Test low, expected, and high volumes before making the adoption decision.

## 11. Delivery requirements and cost control

- Provide one shared case-study pack containing fictional tickets, documents, a sales CSV, expected outputs, and intentional failure cases.
- Give engineers a Git repository, one language/runtime, a model interface, and test fixtures. Use existing [setup material](SETUP.md) where it matches the chosen lab.
- Give business owners guided templates, prepared agent environments, and worked examples of good and bad outputs.
- Require one general assistant and one implementation route. Introduce additional accounts only when a lab needs them.
- Set a course budget and usage limit before model or agent runs. Check both subscription entitlements and API billing; they may be separate.
- Offer instructor-led platform demonstrations and recorded runs when a service is unavailable. Use mocked responses for interface and recovery tests; actual model-quality claims require actual model outputs.
- Treat local inference as an optional experiment. Check hardware requirements and model/tool compatibility before offering it as a substitute.
- Provide a teardown procedure: stop schedules, revoke lab credentials, remove test integrations, and retain only approved portfolio evidence.

## 12. Optional engineering extensions

After completing the practical core, choose an extension that addresses a measured limitation:

| Extension | Useful when | Deliverable |
|---|---|---|
| Classical ML and forecasting | The task involves structured prediction and labelled outcomes | A leakage-aware baseline and comparison with the existing process |
| Model internals | Tokenisation, context, or inference behaviour limits the application | An experiment explaining the observed constraint |
| Advanced retrieval | The basic knowledge assistant misses important evidence | A controlled retrieval comparison with failure analysis |
| Fine-tuning and adaptation | Adequate data and evaluation show a persistent behaviour gap | A justified training experiment compared with prompting and retrieval |
| Local models and inference optimisation | Privacy, offline use, latency, or unit cost motivates investigation | A measured deployment trade-off report |
| Multiple agents | A task has separable responsibilities that might benefit from coordination | A comparison against a single-agent or fixed-workflow baseline |
| Voice and real-time interaction | Users need speech input/output and timely handoff | A tested interaction with interruption, latency, and escalation handling |

## 13. Research and curriculum maintenance

The linked product descriptions above are based on official documentation checked on **11 October 2026**. The course structure, lab assignments, evaluation thresholds, and teaching comparisons are curriculum design recommendations, not vendor claims or promises of outcomes. The research is documentary; it does not claim that these labs have already been run against the products.

Before each cohort, verify installation instructions, account access, model compatibility, tool permissions, administrative controls, billing, and the ability to export or recover work. Record the versions actually used and rerun the fixture cases after significant upgrades. Preserve the learning objective when replacing a tool.

When implementing this replacement curriculum, revise [COURSE.md](COURSE.md), [ASSESSMENTS.md](ASSESSMENTS.md), [CAPSTONE.md](CAPSTONE.md), [TEACHING.md](TEACHING.md), and the [module guides](modules/README.md) to match this sequence. Reuse suitable lessons as source material, move deeper theory into the extensions, and align platform navigation and assessments with the new order. The replacement is now implemented in the [weekly chapters](course/README.md), rewritten course guides, and active site curriculum. Older theory lessons are retained as optional references. See [maintenance notes](course/maintenance.md) for publishing and existing-learner considerations.
