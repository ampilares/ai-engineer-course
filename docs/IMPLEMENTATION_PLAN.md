# Implementation Plan: Practical AI Engineer (Learning Platform)

**Status:** Draft v1 · **Related:** [PRD.md](PRD.md) · [SPEC.md](SPEC.md)

Assumes one builder working part-time (~10–15 h/week) with heavy AI-assisted development. Two parallel tracks throughout: **Platform** (code) and **Content** (lesson authoring: the larger total effort). Phase durations are calendar estimates at that pace; full-time roughly halves them.

---

## Phase overview

| Phase | Weeks | Outcome | Release gate |
|---|---|---|---|
| 0. Foundations & scaffold | 1–2 | Repo restructured, stack running, design tokens, CI |: |
| 1. Content pipeline & course shell | 3–5 | Course/module/lesson pages render from MDX; embeds work |: |
| 2. Accounts & progress | 6–7 | Register/sign-in, lesson completion, continue-card |: |
| 3. Assessment engine | 8–10 | Exams end-to-end with grading, attempts, results |: |
| 4. Tier-1 widgets + Modules 1–2 content | 8–13 (parallel) | 10 core widgets; Modules 1–2 fully authored | **Private alpha** |
| 5. Graduation, graduates page, certificates | 14–15 | Grade computation, consent, public pages, emails |: |
| 6. Admin, polish, hardening | 16–17 | Admin dashboard, a11y/perf pass, security review |: |
| 7. VPS deployment & ops | 17–18 | Production on VPS, backups, monitoring, runbook | **Public beta** (Modules 1–4 authored) |
| 8. Content build-out & v1 | 19–30 | Modules 5–15 authored + Tier-2 widgets | **v1 launch** |

---

## Phase 0: Foundations & scaffold (wk 1–2)

**Platform**
- [ ] Decide names/domain; create `app/` in this repo (monorepo: existing markdown stays at root as curriculum source; platform lives in `app/`; authored content in `content/`).
- [ ] Scaffold Next.js 15 + TypeScript + Tailwind + Drizzle + SQLite; strict tsconfig, ESLint, Prettier, Vitest, Playwright.
- [ ] Design tokens: type scale, neutral palette + 7 phase accents, light/dark, spacing; build the 6 base components (module card, lesson stepper, progress ring, check card, widget frame, embed card) in a throwaway styleguide page.
- [ ] GitHub Actions: lint, typecheck, unit tests, build on PR.
- [ ] `.env` contract (session secret, SMTP, base URL); config module with zod validation.

**Content**
- [ ] Write the content style guide (voice, lesson skeleton per SPEC §5.2, question-writing guide with examples of good/bad items).
- [ ] Finalize the lesson breakdown (SPEC §5.3) into `content/course.yaml` + 12 `module.yaml` stubs.

**Exit criteria:** `pnpm dev` shows styleguide; CI green; content structure agreed.

## Phase 1: Content pipeline & course shell (wk 3–5)

- [ ] MDX compilation (Velite or Content Collections): front-matter schemas, build-time validation, typed content access.
- [ ] Routes: landing, `/course` (phase map), `/course/[module]`, `/course/[module]/[lesson]` with sidebar, prev/next, mobile layout.
- [ ] MDX component kit: callouts, figures, code blocks (Shiki), `<Check>` inline question, `<VideoEmbed>` facade, `<LinkCard>`, `<WidgetFrame>` wrapper with lazy hydration.
- [ ] Migrate two modules' existing outline content into placeholder lessons to exercise the pipeline (real authoring comes in Phase 4).
- [ ] Content CI: schema validation, link check (internal), MDX compile check.
- [ ] SEO: metadata, sitemap, OG images for module pages.

**Exit criteria:** anonymous visitor can browse the full course structure and read placeholder lessons with working embeds and inline checks (client-side, unpersisted).

## Phase 2: Accounts & progress (wk 6–7)

- [ ] Drizzle schema + migrations: users, auth_tokens, sessions, lesson_progress.
- [ ] Magic-link auth per SPEC §4.1 (register, sign-in, verify, sign-out, rate limits); Nodemailer + dev mailbox (Mailpit) locally.
- [ ] Session middleware; profile page (name edit, consent toggles, sign-out-all, delete account w/ cascade).
- [ ] Lesson completion API + UI (check marks, module progress bars, continue-card); preview gating for anonymous users.
- [ ] Integration tests: auth lifecycle, deletion cascade, rate limits.

**Exit criteria:** E2E test passes: register → verify → complete a lesson → progress survives sign-out/in → delete account.

## Phase 3: Assessment engine (wk 8–10)

- [ ] Question YAML schema + zod validation + build-time pool checks against blueprints (SPEC §7.2–7.4).
- [ ] Grading library (pure functions per question type): exhaustive unit tests first; property test for the blueprint selector.
- [ ] Attempt lifecycle APIs: start (server-side selection + sanitization), autosave, resume, submit, attempt limit, history (SPEC §4.4, §9).
- [ ] Exam UI: entry card, one-question-per-screen flow, review screen, results with explanations, retake.
- [ ] Answer-leak test: automated check that exam payloads/pages never contain `correct` fields.
- [ ] Author a real 40-question pool for Module 1 (doubles as the schema's shakedown).

**Exit criteria:** full exam cycle works with randomized draws; 3-attempt limit enforced; grading tests exhaustive and green.

## Phase 4: Tier-1 widgets + first real content (wk 8–13, parallel with Phase 3)

Widget order (teaching value ÷ effort; each time-boxed to ~2–4 days incl. tests):

- [ ] 1. TokenizerExplorer  2. SamplingSimulator  3. SplitAndThreshold  4. CostLatencyCalculator (simplest four: establish the widget pattern)
- [ ] 5. EmbeddingMap  6. ChunkAndRetrieve  7. GradientDescentPlayground
- [ ] 8. AttentionHeatmap  9. AgentLoopStepper  10. PromptInjectionDemo (hardest three)
- [ ] Precompute data assets (embeddings, logits, attention weights) via a `scripts/` notebook; commit as static JSON.
- [ ] Widget interaction tests (math correctness per SPEC §13).

**Content (the long pole: start here and never stop):**
- [ ] Author Modules 1–2 completely: 8 lessons, guided builds, inline checks, and exam pools, using the style guide. Budget ≈ 0.5–1 day per lesson plus 1–2 days per exam pool.
- [ ] Recruit 10–20 alpha testers (existing course users, colleagues).

**🚩 Milestone: Private alpha**: deployed to VPS under basic auth/beta flag; alpha testers run Modules 1–2 end-to-end incl. exams. Collect: confusing lessons, miskeyed questions, widget bugs, drop-off points. 1–2 weeks of fixes.

## Phase 5: Graduation, graduates, certificates (wk 14–15)

- [ ] Grade computation + denormalization; per-module ≥70 rule (SPEC §7.5).
- [ ] Capstone attestation form from CAPSTONE.md checklist.
- [ ] Graduation trigger, congratulations email, certificate page with OG image, `/graduates` page with consent filtering, search, pagination.
- [ ] Consent revocation + deletion propagate immediately (tests).
- [ ] Seed a fake-graduate fixture for styling; remove before launch.

**Exit criteria:** E2E golden path from SPEC §13 passes, including graduates listing and certificate verification.

## Phase 6: Admin, polish, hardening (wk 16–17)

- [ ] Admin dashboard: funnel, exam stats, per-question difficulty, recent activity, hide-graduate flag.
- [ ] Accessibility pass: axe on all page types, keyboard walkthrough of every widget, reduced-motion, screen-reader spot check.
- [ ] Performance pass: bundle analysis, widget chunk budgets, Lighthouse ≥ 90 perf/a11y on lesson + exam pages.
- [ ] Security review: run `/security-review` on the branch; verify CSP, rate limits, cookie flags, answer-leak test, dependency audit.
- [ ] Privacy page, terms, about; error pages; empty states.

## Phase 7: VPS deployment & ops (wk 17–18)

- [ ] Dockerfile (standalone Next build) + docker-compose (app, Caddy, Litestream); volumes for `/data`.
- [ ] Caddyfile: domain, auto-TLS, HSTS, compression, security headers.
- [ ] GitHub Actions deploy job: build → GHCR → SSH pull/up; image tag rollback documented.
- [ ] Backups: Litestream to B2/S3-compatible free tier (or nightly `sqlite3 .backup` + rclone offsite); **perform and document a test restore**.
- [ ] External uptime ping on `/api/health`; log rotation; ops runbook (restore, rollback, abuse handling, secret rotation).
- [ ] Load sanity check (a few hundred concurrent readers + 20 concurrent exam submits: trivial, but verify WAL behavior).

**🚩 Milestone: Public beta**: requires the first four modules fully authored, all 15 exams live, data/multimodal/product modules included in the content validator, and the graduates page live. Announce to the existing course audience only after the expanded path passes content and grading checks.

## Phase 8: Content build-out & v1 (wk 19–30)

Cadence: **one module authored every ~1.5 weeks** (5–7 lessons + 40-question pool), informed by beta analytics (author next what learners are approaching).

- [ ] Modules 5–10 (wk 19–24): including Tier-2 widgets needed by them: SQLSandbox/HTTPExplorer (M1 backfill), RerankerCompare (M7), multimodal evidence viewer (M9), and product state-flow lab (M10).
- [ ] Modules 11–15 (wk 25–29): WorkflowBuilder (M11), EvalScoreboard (M12), QuantizationTradeoff (M15), and NeuralNetPlayground (M4 backfill).
- [ ] Question quality pass using admin difficulty stats (rewrite items <30% or >95% correct).
- [ ] Weekly external-link checker cron + fix cycle.
- [ ] v1 checklist: all 15 modules authored, all Tier-1 + committed Tier-2 widgets live, first real graduates on the board, README of this repo updated to point to the site.

**🚩 Milestone: v1 launch**: announce broadly (the site replaces the repo as the primary way to take the course; repo remains the open curriculum source).

---

## Effort summary

| Track | Estimate |
|---|---|
| Platform code (Phases 0–3, 5–7) | ~9 calendar weeks part-time |
| Widgets (17 total) | ~7 weeks spread across phases |
| **Content authoring (~70 lessons + 12 pools)** | **~12–16 weeks: the dominant cost; runs in parallel from week 8 onward** |
| Total to v1 | ~30 weeks part-time (≈ 15 weeks full-time) |

## Standing risks to watch during execution

1. **Content velocity**: if authoring falls below ~4 lessons/week in Phase 8, cut lesson count per module (merge topics) before cutting interactivity; a shorter excellent course beats a long thin one.
2. **Widget rabbit holes**: the 2–4 day time-box is a hard rule; ship the simple version and iterate from alpha feedback.
3. **Question quality**: miskeyed exam questions destroy trust fastest; every pool gets a second-pass review and the difficulty dashboard is checked weekly post-beta.
4. **Scope creep toward non-goals** (forums, code runners, OAuth): park requests in a v2 list; revisit only after v1.

## v2 candidates (explicitly parked)

Mentor/peer review of projects · sandboxed code-exercise runner · cohort mode with deadlines · OAuth sign-in · spaced-repetition review decks · localization · downloadable PDF certificates · public API for progress badges.
