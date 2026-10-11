# Product Requirements Document: Practical AI Engineer (Learning Platform)

**Status:** Draft v1
**Owner:** AMP (amp@rethink-tech.com)
**Date:** 2026-07-18
**Related docs:** [SPEC.md](SPEC.md) · [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

---

## 1. Summary

Turn the markdown-based "Practical AI Engineer" course (15 modules, project ladder, capstone) into a free, self-hosted, Brilliant.org-style learning website. Learners register with name and email, work through interactive lessons, pass graded module exams, and (on completing the course) appear on a public **Graduates** page with their grade.

The differentiator is *interactive understanding*: instead of a wall of links and text, each lesson teaches one concept through short narrative steps, embedded visual/interactive widgets (tokenizer explorers, attention heatmaps, sampling simulators), and inline knowledge checks: the Brilliant model applied to AI engineering.

## 2. Problem statement

Today the course is a GitHub repository of markdown files that mostly curates external resources. This works for disciplined self-learners but:

- there is no feedback loop: learners can't verify they understood a concept;
- there is no progress model: no sense of position, momentum, or completion;
- concepts like attention, embeddings, sampling, and retrieval are inherently visual/dynamic and are poorly served by static text;
- there is no recognition: nothing durable to show for finishing;
- link-out learning has high drop-off: every external resource is an exit ramp.

## 3. Goals

| # | Goal | Signal |
|---|---|---|
| G1 | Anyone can go from beginner to competent AI engineer through the site alone (external resources become optional deepeners, not the core path) | Lesson content is self-contained; course completable without leaving the site except for hands-on labs |
| G2 | Concepts are learned interactively, not passively | ≥1 interactive element or knowledge check per lesson; median lesson has 3+ |
| G3 | Understanding is measured and graded | Every module ends in an auto-graded exam; a final grade is computed |
| G4 | Completion is recognized publicly | Graduates page lists consenting finishers with name, date, and grade |
| G5 | Free to run and free to use | Self-hosted on owner's VPS; no paid SaaS dependencies required to operate; no charge to learners |
| G6 | Maintainable by one person | Content lives in versioned files (git), not a CMS database; deploys are one command |

## 4. Non-goals (v1)

- **No paid tiers, payments, or subscriptions.** The course is free.
- **No human grading of projects/capstone.** The repo's rubric-based project grading needs a human; v1 grades exams automatically and treats project work as self-attested checklists. (Future: mentor/peer review.)
- **No in-browser code execution grading** (running learner Python against test suites). Labs remain "do this on your machine"; the site checks *understanding*, not code submissions. (Future: optional sandboxed runner.)
- **No discussion forum / community features.** Link to an external community (e.g., GitHub Discussions) instead.
- **No mobile app.** Responsive web only.
- **No multi-language content.** English only.
- **No OAuth / social login.** Name + email registration with magic-link sign-in.

## 5. Users and personas

1. **Career-switcher Sam**: non-CS background, learning nights/weekends. Needs: clear path, motivation via visible progress, concepts explained from zero, low cost. Success: finishes Foundations→LLM modules, lands on the graduates page.
2. **Developer Dana**: working software engineer upskilling into AI. Needs: skip-ahead via diagnostic, dense interactive content, credible grade to reference. Success: fast-tracks from Module 5, distinction grade.
3. **Owner/Instructor (AMP)**: authors content, monitors learners, maintains the VPS. Needs: content-as-code workflow, admin dashboard, near-zero ops burden.

## 6. Product scope and requirements

### 6.1 Registration and accounts

- **R1.** Users register with **name + email** only. No passwords: sign-in is via emailed magic link (removes password storage/reset burden and satisfies "register with name and email").
- **R2.** Email verification is inherent to magic-link sign-in.
- **R3.** Profile page: display name (editable), email (private), progress summary, exam scores, and a **public-listing consent toggle** for the graduates page (default: asked explicitly at registration, changeable anytime).
- **R4.** Account deletion (self-service) removes personal data; a graduate may remain listed only while consent is on.
- **R5.** Anonymous visitors can browse the course structure and the first lesson of each module (preview), but progress tracking, checks, and exams require an account.

### 6.2 Learning experience (Brilliant-style)

- **R6.** Course → Module → Lesson hierarchy. 15 modules, each split into **3–5 lessons** (~20–30 min each). Lessons are authored as MDX: narrative sections interleaved with interactive widgets, inline checks, production scenarios, and guided builds.
- **R7.** Every lesson contains at least one **inline knowledge check** (formative, unlimited retries, instant feedback with explanation, not graded).
- **R8.** **Interactive widgets** teach the dynamic concepts: BPE tokenizer explorer, attention heatmap, temperature/top-p sampling simulator, embedding-similarity map, train/test split + threshold sliders, gradient descent visualizer, chunking/retrieval explorer, agent-loop stepper, prompt-injection demo, cost/latency calculator, and more (full catalog in SPEC §6).
- **R9.** **Third-party content embedding**: YouTube/3Blue1Brown videos, external articles, papers, and Colab notebooks are embedded or link-carded properly, with lazy loading, no third-party cookies before click (privacy-friendly facades), attribution, and license compliance (external content is referenced/embedded, never copied into our content).
- **R10.** **Progress model**: per-lesson completion, per-module progress bars, a course map showing the 7 phases, "continue where you left off," and streak-free, pressure-free pacing (no dark patterns; this is a professional course, not a habit app).
- **R11.** Labs and projects from the repo remain part of the course as guided "Build" lessons with self-attestation checklists (learner ticks acceptance criteria; stored, shown on profile, not graded).
- **R12.** Sleek, clean, engaging UI: light/dark themes, generous whitespace, one accent color per phase, keyboard-navigable, WCAG 2.1 AA, fast (interactive widgets code-split; target LCP < 2 s on mid-range hardware).

### 6.3 Assessment and grading

- **R13.** Each module ends with a **module exam**: 15–25 questions drawn from a larger pool, auto-graded server-side, randomized question and option order.
- **R14.** Question types: single choice, multiple select, numeric (with tolerance), ordering, matching, short answer (normalized/pattern match), and code-output prediction. No essays in v1.
- **R15.** Exam rules: pass mark **70%**; up to **3 attempts** per exam (highest score counts); each attempt draws a fresh randomized set; answers + per-question feedback shown after submission.
- **R16.** **Final grade** = weighted mean of the 12 module exam best-scores (weights in SPEC §7.5). Grade bands: **Pass ≥ 70 · Merit ≥ 80 · Distinction ≥ 90**.
- **R17.** **Graduation** = all 15 exams passed + capstone self-attestation checklist submitted. Triggers a congratulations email, a shareable certificate page (unique URL, verifiable), and (with consent) a graduates-page entry.
- **R18.** Integrity stance: open-book, honor-based (free course, no credential fraud incentive worth an arms race). Mitigations limited to question pools, randomization, attempt limits, and server-side grading (correct answers never shipped to the client for exams).

### 6.4 Graduates page

- **R19.** Public page listing graduates: display name, graduation date, grade band (and optional score %), ordered newest first, with count ("312 graduates"). Search by name.
- **R20.** Listing is **opt-in consent only**; entries disappear immediately if consent is revoked or account deleted. No emails ever shown.
- **R21.** Each entry links to a public certificate page (unique ID) that a graduate can share with employers; certificate shows name, grade, date, and module-level scores.

### 6.5 Instructor/admin

- **R22.** Admin dashboard (owner only): learner counts, progression funnel per module, exam pass rates and per-question difficulty stats (to fix bad questions), recent graduates, and consent/deletion audit.
- **R23.** Content is authored in git (MDX + question YAML); a build/sync step publishes it. No in-browser content editor in v1.

### 6.6 Operations

- **R24.** Runs on the owner's VPS via Docker Compose; single app container + reverse proxy with automatic TLS; SQLite database with automated backups. One-command deploy from CI.
- **R25.** Transactional email (magic links, graduation) via configurable SMTP.
- **R26.** Privacy: minimal data (name, email, progress, scores), clear privacy page, no ads, no third-party analytics by default (self-hosted, cookieless analytics optional).

## 7. Success metrics

| Metric | Target (first 6 months) |
|---|---|
| Registered learners | 500 |
| Lesson completion rate (started → finished, median lesson) | ≥ 60% |
| Module 1 → Module 5 progression | ≥ 25% of registrants |
| Graduates | ≥ 20 |
| Median exam attempt count per pass | ≤ 1.5 (questions are fair) |
| Uptime | ≥ 99.5% |
| Monthly running cost | ≤ existing VPS cost + domain |

## 8. Constraints and assumptions

- Solo builder/maintainer; budget ≈ $0 beyond the VPS.
- Existing markdown modules are **outlines that curate external resources**: the largest cost of this project is **authoring original, self-contained lesson content** (est. 60–100 lessons). External resources cannot be copied (license note in repo README), only embedded/linked.
- VPS: assumed Linux, Docker-capable, modest specs (2 vCPU / 4 GB is plenty at this scale).
- Traffic assumption: low thousands of users; SQLite + one node is sufficient. Nothing in the design blocks a later Postgres migration.

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Content authoring effort underestimated (biggest risk) | Launch slips or lessons stay link-farms | Phased launch: publish modules 1–4 first ("early access"), keep later modules as enhanced outlines until rewritten; measure engagement to prioritize |
| Interactive widgets balloon in scope | Endless polish, no launch | Fixed v1 widget catalog (SPEC §6); each widget time-boxed; ship with fewer rather than later |
| Public grades discourage weaker learners | Reduced completions | Consent is opt-in; grade band (not %) is the default display; learners can retake exams before graduating |
| Personal data obligations (GDPR-style) | Legal exposure | Minimal data, explicit consent, self-service deletion, privacy page, EU-friendly defaults |
| Exam answer leakage (shared online) | Grades lose meaning | Question pools + honor-based framing; accept residual risk for a free course |
| VPS failure / data loss | Lost learner progress | Nightly off-site SQLite backups + restore runbook; test restores quarterly |
| External embeds break or change license | Broken lessons | Link-cards with graceful fallback; quarterly link check (already a course habit) |

## 10. Release strategy

1. **Private alpha**: modules 1–2 fully interactive, auth, exams, on VPS behind a beta flag; 10–20 invited testers.
2. **Public beta**: modules 1–4 complete; modules 5–12 published as enhanced outlines with exams; graduates page live (empty).
3. **v1 launch**: all 15 modules interactive, capstone attestation, certificates.

Detailed sequencing in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
