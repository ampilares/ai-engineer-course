# Evidence log

Create one record per run. Keep original outputs before human corrections.

| Field | What to record |
|---|---|
| Run and case IDs | Stable IDs, including a link to source inputs |
| Mode | Live model, offline fixture, instructor replay, or manual baseline |
| Versions | Code, prompt, model if visible, corpus, skill, and configuration |
| Expected outcome | Predefined acceptance criteria and mandatory boundaries |
| Observed outcome | What actually happened, with artifact or trace references |
| Quality | Correctness, unsupported claims, invalid output, and error severity |
| Human work | Review minutes, corrections, interventions, and waiting time |
| Cost and duration | Observed usage and timing; identify estimates separately |
| Decision | Accept, correct, reject, retry safely, or investigate |
| Limitation | Missing observation, simulation, or uncontrolled difference |

Example: Run H-001, case S010, offline fixture, reporting contract v1. Expected: missing amount remains unknown. Observed: record excluded from subtotal and visible in the review list. Evidence: saved report JSON. Cost: no model call. Limitation: does not measure model extraction quality.
