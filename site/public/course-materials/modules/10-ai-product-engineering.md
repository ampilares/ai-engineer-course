# Module 10: AI product engineering and UX

**Time:** 2 weeks

**Outcome:** Turn a bounded AI capability into an evidence-backed product design with understandable uncertainty, meaningful human authority, explicit architecture trade-offs, and a measurable pilot.

## Why this module exists

A technically impressive system can fail because it solves the wrong bottleneck, shifts work to another team, hides uncertainty, or never earns user trust. Product engineering connects model behavior to a user decision and a business or public outcome while preserving safety, accessibility, and an exit path.

## Learn

- Workflow observation, user/job framing, eligibility, non-goals, value hypotheses, baselines, and counter-metrics.
- Value trees connecting component quality to product behavior and downstream outcomes.
- AI interaction patterns: suggestion, draft, evidence-backed answer, ranked options, review queue, and guarded action.
- Visible state, evidence, correction, abstention, uncertainty, cancellation, approval, escalation, and accessibility.
- Trust boundaries, stable internal interfaces, provider portability, build/buy analysis, and architecture decision records.
- Offline, shadow, internal, pilot, and controlled-rollout evidence stages.
- Experiment design, exposure/version tracking, adoption, override, abandonment, shifted work, lifecycle ownership, and sunset criteria.

## Lesson sequence

1. **Problem discovery:** define a falsifiable outcome around observed work.
2. **AI UX and human control:** prototype success, uncertainty, error, and recovery states.
3. **Architecture and build/buy:** choose components using quality attributes and total lifecycle cost.
4. **Experiments and adoption:** stage exposure and make a stop/redesign/continue/scale decision.

## Core resources

- [People + AI Guidebook](https://pair.withgoogle.com/guidebook-v2/): practical patterns, case studies, and workshop material for user control, calibrated trust, feedback, and failure recovery.
- [W3C WAI accessibility resources](https://www.w3.org/WAI/): use accessibility requirements while prototyping, not as a launch-day audit.

## Labs

1. Observe three users or structured workflow sessions and sample 20 cases.
2. Test a prototype with at least five representative users, including error and escalation paths.
3. Run a 30-case architecture/vendor/component bake-off and write a decision record.
4. Simulate or run a 30-case limited pilot with exposure, outcome, guardrail, and adoption events.

## Module project: pilot decision pack

Deliver an opportunity brief, prototype/state map, architecture and data-flow diagrams, decision record, evaluation plan, event taxonomy, pilot evidence, and final recommendation. Include a deterministic or process-only alternative so AI must earn selection.

## Project acceptance

- the hypothesis names population, intervention, outcome, magnitude, and guardrails;
- eligibility and non-goals are visible in product behavior;
- users can verify evidence, correct output, cancel, and reach a person;
- approvals expose the exact effect and support independent judgment;
- architecture shows where authorization, privacy, evaluation, and fallback are enforced;
- the build/buy decision includes review, operations, incident, and exit cost;
- pilot results report task outcomes and non-use/abandonment, not only model scores or clicks;
- a named owner and measurable trigger govern scale, redesign, or sunset.

## Stretch

Run a phased or randomized pilot with a predeclared analysis, conduct an accessibility review with assistive technology, or build a provider-exit rehearsal and measure the real migration cost.
