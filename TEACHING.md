# Teaching and cohort guide

## Recommended format

For a cohort, use one 90-minute concept session, one 90-minute studio, and optional office hours each week. Keep lectures short; spend live time reading traces, debugging failed cases, reviewing architectures, and defending decisions.

The standard path runs 32 weeks including a four-week capstone. A cohort may combine adjacent lessons, but do not compress the evidence gates: learners should demonstrate reliable software/data foundations before LLM applications, grounded and guarded applications before automation, and evaluation/security/operations before the capstone pilot.

## Pacing checkpoints

- **After Module 4:** reproducible data/ML/deep-learning experiment with honest splits and error analysis.
- **After Module 8:** typed LLM service, cited retrieval, safe tools, and a crash-recovery test.
- **After Module 11:** evidence-preserving media path, tested user-control states, workflow baseline, and ROI hypothesis.
- **After Module 14:** regression gate, threat model, impact/data assessment, deployment SLO, rollback, and incident rehearsal.
- **Module 15:** one controlled advanced experiment followed by the four-week capstone studio.

## Studio pattern

1. Show one realistic artifact and its failure.
2. Ask learners to predict the cause.
3. Inspect data, prompts, retrieval, tools, and traces in order.
4. Fix one variable.
5. Rerun the fixed evaluation set.
6. record whether quality, latency, cost, or risk moved.

## Feedback rules

- Review the eval set before polishing the UI.
- Ask for the simplest acceptable architecture.
- Require explicit data and permission boundaries.
- Treat “works in my demo” as the start of evaluation.
- Give feedback on decisions and evidence, not allegiance to a framework.
- Never let a slick generative demo compensate for weak controls.

## Group roles

Rotate four roles in project reviews:

- **Product owner:** states user, workflow, metric, and adoption risk.
- **AI engineer:** explains model/data/system choices.
- **Evaluator:** challenges datasets, graders, and claims.
- **Risk/operations reviewer:** challenges permissions, failure modes, costs, and recovery.

## Using AI while learning

AI assistants are encouraged for explanation, code review, test generation, and debugging. Learners remain accountable for every submitted decision and must be able to:

- explain generated code line by line at the relevant level;
- reproduce the core behavior without hidden chat context;
- verify claims against primary documentation;
- show tests that would catch plausible AI-generated mistakes;
- identify which parts of the work were AI-assisted.

## Resource maintenance

Before each cohort:

1. sample-check all required links;
2. confirm courses still offer free access;
3. update provider-specific API links;
4. preserve vendor-neutral outcomes when replacing resources;
5. archive rather than silently rewrite prior cohort requirements;
6. add a “checked on” date to the resource catalog.
