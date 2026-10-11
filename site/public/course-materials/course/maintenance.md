# Curriculum maintenance

The October 2026 course is a replacement core. Canonical sources are `course/manifest.json`, `course/weeks/01.md` through `16.md`, and `course/assessments/questions.mjs`. Edit those first.

Each chapter must contain exactly three level-two headings. The publisher turns them into concepts, worked-example, and studio lesson URLs, inserts practice checks, and creates module metadata and exam pools. Other chapter headings use level three or lower.

## Publish locally

```sh
node course/tools/publish.mjs
node course/tools/publish.mjs --check
node --test course/labs/reference.test.mjs
cd site
npm test
npx tsc --noEmit
```

The publisher validates local Markdown targets and copies an explicit set of course materials to `site/public/course-materials/`. It does not copy runtime databases, virtual environments, credentials, or arbitrary repository files. Generated lessons should not be edited directly.

The fixture generator `course/tools/create-evaluation-fixtures.mjs` recreates authored case variants and mock predictions. Run it only when deliberately revising instructional fixtures; keep new held-out assessments separate.

## Existing learners and deployment

The new active manifest uses distinct `practical-*` slugs. Original lessons are retained as optional references and the previous manifest is saved as `site/content/legacy-course.json`. Existing database rows are not deleted or rewritten.

The platform currently has no curriculum-edition field on progress or graduation. Changing the active manifest changes current completion requirements, while previously issued graduation records remain. Before deploying to an existing cohort, decide how to preserve their completion path and certificates. This content update does not implement or claim a cohort migration.

The practical rubric is reviewer-assessed. The site still computes knowledge-quiz results plus self-attestation. Do not present the latter as independent capstone assessment.

## Before a cohort

Recheck primary sources, account entitlements, runtime requirements, supported models, tool permissions, billing, and export/recovery. Run the actual platform labs in test accounts and retain authentic outputs for learners without access. Record versions and distinguish observed facts from documentation claims.

Recheck lesson links and regenerate after edits. Replace a product when it no longer supports the learning objective; preserve the task contract and evaluation cases so the change remains comparable.
