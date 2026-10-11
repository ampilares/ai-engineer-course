# Assessment guide

Assess what learners can verify, build, and operate. AI assistance is allowed; learners must explain the work, diagnose a changed input, and make a correction during review.

## Entry diagnostic

Ask learners to distinguish input from instruction, check a calculation, describe a familiar workflow, identify a review point, and verify a factual claim. Engineers additionally read JSON, run a command, inspect a diff, and explain a failing test. Use [preparation](course/preparation.md) for gaps.

The site's ten-question placement exercise recommends where to begin reviewing. It does not waive earlier practical evidence or completion requirements.

## Practical grading

| Component | Weight | Marking method |
|---|---:|---|
| Weekly portfolio, Weeks 1-13 | 30% | Average 13 weekly scores using the rubric below |
| Platform comparison | 15% | Common cases, controls, honest limits, supported selection |
| Capstone implementation and pilot | 45% | Five dimensions in the capstone guide |
| Demonstration and handover | 10% | Success/failure/recovery and independent operator use |

Calculate `0.30 × portfolio + 0.15 × comparison + 0.45 × capstone + 0.10 × handover`, with components scored out of 100. Scores of 80, 72, 76, and 90 give 78 overall. Completion requires 70 plus all gates. Correct failed gates even if the numerical total is high.

Weeks 9-11 portfolio marks assess individual exercises; the comparison mark assesses the common-case method and selection decision. Weeks 14-16 count through capstone and handover, not the portfolio average.

### Weekly rubric

Award up to 25 points each for correctness, independently checked evidence, failure/boundary handling, and clarity/reproducibility. Use anchors: 0 absent; 10 materially incomplete; 18 meets the task with minor gaps; 25 complete, reproducible, and robust to a changed case. Explain intermediate marks.

Give one verified strength, one consequential gap, and one next experiment. An evidence-based stop decision can receive full credit.

### Platform comparison rubric

Score consistent task/cases (25), access/control evidence (25), output and operating-effort measurement (25), and justified choice with limitations (25).

Use the five common cases from Week 11: the baseline report, missing input, changed data, conflicting policy, and an embedded instruction attack. The baseline already includes dirty transaction rows. Test interruption and recovery separately as part of the platform's operational evidence. Distinguish observed runs, authentic replays, documentary evidence, and unknowns. Where access is unavailable, reviewers may accept documentary comparison plus a complete demonstration on the selected implementation route; missing live measurements must remain unreported.

## Progression gates

| Gate | Required demonstration |
|---|---|
| After Week 4 | Independently verify an AI artifact and explain a substantive correction |
| After Week 7 | Validate inputs, show a human decision, recover the tested action without duplication |
| After Week 11 | Demonstrate access boundaries and a working stop mechanism |
| At completion | Meet agreed quality thresholds, show no unauthorised action in boundary tests, and use the manual fallback |

A prompt promising good behaviour is not an enforced boundary. Zero unauthorised actions in a finite test set does not prove every future attack will fail.

## Evaluation evidence

Use at least 20 development and 10 held-out capstone cases. Cover ordinary requests, ambiguity, missing data, conflicting sources, restricted access, and action misuse. Freeze thresholds and held-out cases before final assessment. Public course answers are available to learners; instructors should author fresh variants for independent assessment.

Save case ID, expected behaviour, raw response/action trace, result, reviewer, configuration versions, duration, and usage. Report denominators and missing runs. A timeout remains a failed task unless a pre-agreed metric explicitly measures another population.

`node course/labs/reference.mjs evaluate course/case-study/recorded-predictions.json` scores 18/20 authored predictions. This is not a model benchmark. Structural validity and semantic correctness require separate checks.

## Site knowledge checks

The 128 original questions include explanations and numerical exercises: eight per week, plus one inline practice check per lesson. They are open book, with a 70% pass threshold and three attempts. Eight equally weighted questions require at least six correct to exceed 70%.

The platform grades knowledge questions and accepts capstone self-attestation. It does not grade the practical 30/15/45/10 rubric. An instructor or independent reviewer records that separately. A site certificate confirms recorded quizzes and a declaration, not an independent workplace proficiency audit.
