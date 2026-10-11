# Practical AI Engineering and Business Automation

A 16-week course for engineers and business owners who want to use AI to complete useful work, build dependable workflows, and measure the result. The October 2026 edition replaces the earlier 32-week core with a practical sequence, shared cases, and two implementation routes.

Engineers build and test integrations. Business owners configure workflows, verify outputs, and establish operating responsibility. Both routes cover research, data, coding assistants, model APIs, retrieval, automation, agents, evaluation, economics, and a working capstone.

**Start with [Week 1](course/weeks/01.md)** or read the [course guide](COURSE.md). Allow 8-10 hours per week for engineers or 5-7 for business owners, plus optional preparation. Course materials are free; external accounts, hosting, and model usage may cost money.

## Materials

| Material | Purpose |
|---|---|
| [Course index](course/README.md) | Sixteen complete chapters, split into 48 site lessons |
| [Setup](SETUP.md) | Offline labs, optional services, and account boundaries |
| [Harbour Services case](course/case-study/README.md) | Fictional inputs, failure cases, and worked answers |
| [Reference labs](course/labs/README.md) | Runnable reporting, retrieval, validation, evaluation, workflow, and agent exercises |
| [Assessment guide](ASSESSMENTS.md) | Weekly evidence, progression gates, and practical grading |
| [Capstone](CAPSTONE.md) | Implementation, pilot, demonstration, and handover |
| [Teaching guide](TEACHING.md) | Session plans, feedback, and access alternatives |
| [Research register](course/research.md) | Primary sources, verification date, and research limitations |
| [Extensions](course/extensions.md) | Deeper engineering work after the core |

OpenClaw, Hermes Agent, and Cursor's Grok Bot each have a dedicated week. Learners compare them on the same task, inputs, and failure cases. Product capabilities are based on official documentation checked on 11 October 2026; access and versions must be checked before each cohort.

## Run and maintain

From the repository root, using Node.js 24.12 or newer compatible with `node:sqlite`:

```sh
node course/labs/reference.mjs report
node --test course/labs/reference.test.mjs
node course/tools/publish.mjs
node course/tools/publish.mjs --check
```

Edit canonical chapters in `course/weeks/` and questions in `course/assessments/questions.mjs`, then regenerate the site. See [site instructions](site/README.md) and [curriculum maintenance](course/maintenance.md).

The platform provides open-book knowledge checks and capstone self-attestation. The practical 30/15/45/10 assessment requires a reviewer; it is not implemented by the quiz engine. Older lessons remain optional references outside the active core.

External resources retain their owners' terms and licences. These materials explain and link to those sources rather than reproducing their tutorials.
