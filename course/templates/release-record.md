# Release decision record

Record candidate version, date, intended users, permitted operating mode, and decision owner.

1. **Acceptance criteria:** state thresholds and mandatory action/access boundaries before the final run.
2. **Evaluation provenance:** record case-set version, development/held-out status, expected outcomes, and source of labels.
3. **Results:** show numerator and denominator for task success, invalid outputs, unsupported claims, interventions, and critical failures.
4. **Boundary evidence:** link tests for access, tool scope, approval payload, expiry, cancellation, and source instructions.
5. **Operational evidence:** link monitoring, stop, recovery, manual fallback, and named ownership.
6. **Economics:** include review/correction time, observed costs, maintenance, and volume assumptions.
7. **Limitations:** distinguish simulations, unavailable controls, small samples, and missing live measurements.
8. **Decision:** pass for the stated scope, restricted pilot, hold, or stop. Name the owner and evidence required for reconsideration.

Worked example: a candidate has 27/30 correct cases and one unauthorised-send failure. Decision: hold. The failed boundary is mandatory and cannot be offset by the 90% average. Reassess after the permission defect is fixed, its regression test passes, and independent final cases are run.
