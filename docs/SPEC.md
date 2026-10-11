# Specifications: Practical AI Engineer (Learning Platform)

**Status:** Draft v1 · **Related:** [PRD.md](PRD.md) · [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

This document covers the functional spec (what each part does), the technical spec (how it is built), and the content spec (how lessons and questions are authored).

---

## 1. Technology stack

Chosen for: solo maintainer, $0 budget, single VPS, content-as-code, heavy client-side interactivity.

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15+ (App Router, TypeScript)** | One codebase for SSR pages, API routes, and rich client widgets; huge ecosystem; static-renders content pages |
| Content | **MDX** (lessons) + **YAML** (question banks), compiled at build time via Content Collections/Velite | Content stays in git; widgets are React components used directly in prose |
| Styling | **Tailwind CSS** + Radix UI primitives | Fast to build a clean design system; accessible primitives for free |
| Database | **SQLite** (WAL mode) via **Drizzle ORM** | Zero-ops on a VPS; ample for thousands of users; typed schema + migrations; clean later path to Postgres |
| Auth | Custom **magic-link** (signed one-time token via email) + httpOnly session cookie | No passwords; matches "register with name and email"; no third-party auth dependency |
| Email | **Nodemailer over SMTP** (any provider: Brevo/Resend free tier, or VPS Postfix) | Configurable via env; transactional only |
| Charts/viz | **D3 (scales/shapes only) + React**, SVG/Canvas | Widgets are bespoke; no heavyweight chart lib |
| Runtime extras | `js-tiktoken` (client-side BPE), `sql.js` (in-browser SQLite for Module 1 widget), small ONNX/precomputed data for embedding demos | All client-side, no inference server needed |
| Deploy | **Docker Compose**: app container + **Caddy** (auto-TLS) | One-command deploy; TLS handled |
| Backups | **Litestream** (SQLite streaming replication to S3-compatible/B2 free tier) or nightly `sqlite3 .backup` + offsite rsync | Continuous or nightly; restore runbook |
| CI/CD | GitHub Actions: lint, typecheck, test, build image, SSH deploy | Push-to-deploy on `main` |
| Analytics (optional) | Self-hosted **Umami** or none | Cookieless, privacy-clean |

Explicitly avoided: separate backend service, Postgres/Redis containers, paid auth (Clerk/Auth0), CMS (content lives in git), Kubernetes.

## 2. Information architecture

```
/                         Landing: pitch, course map, sample widget, CTA
/course                   Course overview: 7 phases → 15 modules, progress overlay when signed in
/course/[module]          Module page: intro, lesson list, exam entry, progress
/course/[module]/[lesson] Lesson page (the core experience)
/course/[module]/exam     Module exam (auth required)
/graduates                Public graduates list
/certificate/[id]         Public verifiable certificate
/profile                  Progress, scores, consent toggle, delete account
/register, /signin        Name+email registration; magic-link sign-in
/auth/verify?token=...    Magic-link landing
/about, /privacy, /terms  Static
/admin/*                  Owner dashboard (role-gated)
/api/*                    Route handlers (below)
```

Navigation: persistent slim top bar (logo, Course, Graduates, profile/sign-in); within a lesson, a collapsible module sidebar (lesson list with check marks) + prev/next footer. Mobile: bottom prev/next bar, sidebar becomes a sheet.

## 3. Design system

- **Layout:** content column max-width ~68ch for prose; widgets may break out to ~900px. Generous vertical rhythm; one idea per screen.
- **Type:** Inter (UI/prose) + JetBrains Mono (code). Base 17px/1.7.
- **Color:** near-white/near-black neutral base, light + dark themes (`prefers-color-scheme` + toggle). Each course phase gets one accent hue (e.g., Foundations = teal, ML = violet, LLM = amber, RAG/Agents = blue, Automation = green, Production = rose, Expert = indigo) used for progress, module cards, and widget accents: makes the map legible and pages feel distinct without being loud.
- **Components:** module card, lesson stepper, progress ring, check-question card (idle/correct/incorrect states with explanation reveal), widget frame (title, reset button, consistent border), embed facade card, exam timer-less header, certificate layout.
- **Motion:** micro-transitions only (150–250 ms); check feedback animates (shake on wrong, settle on right); `prefers-reduced-motion` respected.
- **Accessibility:** WCAG 2.1 AA. All widgets keyboard-operable with a text alternative describing the takeaway; checks announce results via `aria-live`; contrast ≥ 4.5:1; focus visible.

## 4. Functional specification by area

### 4.1 Registration and auth

Flow:
1. `/register`: name + email + two checkboxes: [required] accept terms/privacy; [optional] "List me on the public graduates page when I finish."
2. Server creates `users` row (unverified), generates single-use token (32-byte random, SHA-256 stored, 15-min expiry), emails magic link.
3. `/auth/verify?token=` validates + consumes token, marks email verified, sets session cookie (httpOnly, Secure, SameSite=Lax, 30-day rolling), redirects to `/course`.
4. `/signin` = same flow for existing emails. Unknown email on sign-in → prompt to register (do not reveal whether an email exists in error messages).

Rules: rate-limit token requests (3/email/hour, 10/IP/hour); tokens single-use; sessions revocable (sign out everywhere on profile); admin = `users.role='admin'`, assigned manually via seed/SQL to the owner's email.

### 4.2 Lesson experience

A lesson page renders compiled MDX server-side; interactive widgets hydrate as client islands (code-split, lazy on scroll).

- **Progress:** a lesson is *complete* when the learner has (a) scrolled through the content and (b) answered all inline checks correctly at least once (retries unlimited). Completion posts to the server; UI shows a check mark and advances the module progress bar.
- **Inline checks:** rendered from the lesson's question front-matter/YAML; instant client-side feedback for formative checks (their answers ship to the client: acceptable, they're ungraded); each wrong answer reveals a hint, correct reveals a full explanation.
- **Continue:** `/course` and the landing page (when signed in) show a "Continue: Module 4 · Lesson 3" card from the latest `lesson_progress` row.
- **Preview mode:** anonymous users see lesson 1 of each module; further lessons show a blurred teaser + register CTA.

### 4.3 Third-party embeds

Policy (implements PRD R9):
- **Videos (YouTube/Vimeo):** privacy facade: thumbnail + play button rendered locally; iframe (`youtube-nocookie.com`) injected only on click. Attribution caption (creator, title, link).
- **Articles/papers/docs:** styled **link cards** (title, source, favicon, our own 1-sentence "why read this"), open in new tab. Never scraped or reproduced.
- **Colab/notebooks:** link card with "Open in Colab" badge.
- **Fallback:** every embed has a plain link fallback if the provider blocks framing or the resource dies; a CI link-checker (weekly cron) flags dead URLs.
- **Placement:** external resources appear in a "Go deeper" section at lesson end: the lesson must teach the concept itself (PRD G1); embeds supplement, not substitute.

### 4.4 Module exam

- Entry card on the module page: rules, attempt count remaining, best score.
- Exam start (server): select N questions from the module's pool per blueprint (§7.4), shuffle questions and options, create `exam_attempts` row storing the selected question IDs + option permutations, return *sanitized* questions (no correct answers to client).
- One question per screen with a progress dots bar; answers autosaved to the attempt (`attempt_answers`) as the learner moves; free navigation between questions; no time limit (open-book stance).
- Submit → server grades against the stored selection, writes score, returns per-question results with explanations.
- Attempt lifecycle: an attempt left mid-way stays `in_progress` and resumes on return; a fourth attempt is refused; best score is the module's exam score.
- Results screen: score ring, pass/fail, per-question review, "retake" (if attempts remain), link onward.

### 4.5 Grading, graduation, certificates

- Final grade computed per §7.5 whenever an exam score changes; stored denormalized on `users` for the graduates page.
- **Capstone attestation:** a special "lesson" in Module 15/Capstone renders the CAPSTONE.md checklist as required checkboxes + free-text fields (project title, 3-sentence summary, optional repo/demo URL). Submitting stores it and marks the requirement met. Displayed on the certificate ("Capstone: <title>") but not graded (PRD non-goal).
- **Graduation event:** on the transition to "all 15 exams passed + attestation submitted," the server creates a `graduations` row (grade frozen? **No**: grade recomputes if they retake within attempt limits; the certificate always shows current best), generates certificate ID (`crypto.randomUUID`), sends congratulations email, and (if consent) the graduate appears on `/graduates`.
- **Certificate page** `/certificate/[id]`: public, indexable, shows name, grade band + %, graduation date, per-module scores table, capstone title, and a "Verify" note explaining the URL is the verification. Open Graph image generated for sharing.

### 4.6 Graduates page

- Server-rendered list from `graduations` joined to consenting users: display name, grade band, date; optional score % shown only if the user enables "show my score" (separate toggle, default band-only).
- Newest first, paginated (50/page), client-side name filter, total count headline.
- Revoked consent or deleted account → row excluded by query (no cached copies; page revalidates on change).

### 4.7 Profile and privacy

- Profile: editable display name; progress map; exam scores table; consent toggles (public listing, show %); "email me a sign-in link" device management (sign out all); **Delete account** (type-to-confirm) → hard-deletes user, progress, attempts, graduation row.
- `/privacy`: plain-language policy: what's stored (name, email, progress, scores), why, retention, deletion path, no ads/trackers, contact email.

### 4.8 Admin dashboard

`/admin` (role-gated): totals (registered, active 7d, graduates); funnel chart (learners reaching each module); per-exam stats (attempts, pass rate, mean score); **per-question difficulty** (% correct: flags miskeyed/bad questions); recent registrations and graduations; button to trigger content re-validation report. Read-only in v1 except a "hide graduate" moderation flag (abuse/impersonation cases).

## 5. Content specification

### 5.1 Repository layout

```
content/
  course.yaml                    # phases, module order, exam weights
  modules/
    04-llm-foundations/
      module.yaml                # title, slug, phase, summary, outcomes, time
      lessons/
        01-next-token.mdx
        02-tokenization.mdx      # front-matter: title, slug, minutes, order
        ...
      questions/
        pool.yaml                # exam question pool (see §7.2)
```

Existing repo markdown (modules/, ASSESSMENTS.md, CAPSTONE.md) remains the curriculum source; content/ is the *authored platform version*. Build step validates: every lesson compiles, every question schema-valid, every module pool satisfies its exam blueprint, all internal links resolve. CI fails on violations.

### 5.2 Lesson authoring rules

- 10–20 minutes; one concept; structure: hook → build intuition (widget) → formalize → check → recap → "Go deeper" (external embeds).
- ≥1 inline check; target 3+ interaction points (widget or check) per lesson.
- Original prose only: external resources are embedded/linked per §4.3, never copied (repo license note).
- Widgets are imported MDX components: `<TokenizerExplorer corpus="..." />`.

### 5.3 Module → lesson breakdown (initial plan, ~70 lessons)

| Module | Lessons (working titles) |
|---|---|
| 1 Engineering foundations | Python for data work · Files & formats · HTTP APIs · SQL & SQLite · Testing & Git · Build: data worker |
| 2 Data & classical ML | Framing a prediction · Splits & leakage · Metrics beyond accuracy · Baselines & trees · Error analysis · Build: predictive baseline |
| 3 Deep learning | Neurons & layers · Loss & gradient descent · Training dynamics · Representations · Build: trained model |
| 4 How LLMs work | Next-token prediction · Tokenization (BPE) · Embeddings · Attention · The transformer block · Sampling & inference · Pretraining→post-training · Limits & hallucination |
| 5 LLM app primitives | Calling model APIs · Prompt design · Structured outputs · Context & cost · Caching & latency · Build: extraction service |
| 6 RAG | Why retrieval · Chunking · Embedding search · Hybrid retrieval & reranking · Citations & abstention · Evaluating retrieval · Build: knowledge assistant |
| 7 Agents & tools | Tool calling · State & loops · Workflow vs agent · MCP · Approvals & bounds · Build: bounded agent |
| 8 Business automation | Process mapping · Triggers/queues/webhooks · n8n patterns · Idempotency & retries · ROI baseline · Build: guarded workflow |
| 9 Evaluation | Why evals · Datasets & graders · LLM-as-judge · Regression suites · Traces & observability · Build: eval harness |
| 10 Safety & security | Threat modeling · Prompt injection · Least privilege · Privacy & governance · Red-teaming · Build: threat model |
| 11 Production & LLMOps | Deployment shapes · Reliability patterns · Monitoring & SLOs · Cost engineering · Incidents & rollback · Build: deployed service |
| 12 Expert topics | Fine-tuning: when & how · Local inference & quantization · Advanced retrieval · Reading research · Capstone attestation |

## 6. Interactive widget catalog (v1)

Each widget: self-contained React client component, no server calls, deterministic seed option, reset button, keyboard operable, text summary for screen readers, ≤ 50 KB gzipped JS budget each (heavier ones lazy-load data).

**Tier 1: core teaching value (build first):**
1. **TokenizerExplorer** (M4): live BPE via js-tiktoken: type text, see token boundaries/IDs/count, compare code vs prose vs other languages, cost estimate.
2. **AttentionHeatmap** (M4): precomputed attention weights for sample sentences; hover a token to see what it attends to; single-head walkthrough mode with the QKV arithmetic shown step by step.
3. **SamplingSimulator** (M4): next-token probability bar chart for fixed contexts (precomputed logits); temperature/top-k/top-p sliders reshape the distribution; "sample 100×" shows outcome diversity.
4. **EmbeddingMap** (M4/M6): 2-D projection of ~200 precomputed word/sentence embeddings; search & nearest-neighbor highlighting; similarity slider.
5. **SplitAndThreshold** (M2): draggable train/test split on a scatter dataset; classification threshold slider live-updating precision/recall/F1 and the confusion matrix.
6. **GradientDescentPlayground** (M3): loss surface, learning-rate slider, watch steps converge/diverge/oscillate.
7. **ChunkAndRetrieve** (M6): sample document, chunk-size/overlap sliders, query box ranking chunks by (precomputed) similarity; shows how chunking changes what's retrievable.
8. **AgentLoopStepper** (M7): step-through of a scripted agent trace: model "thought" → tool call → result → next step; branch points show what a bad loop looks like; approval-gate toggle.
9. **PromptInjectionDemo** (M10): a canned, sandboxed simulation in which an assistant with tools processes a document containing an embedded instruction. Learners toggle privilege, approval, and spotlighting controls to compare outcomes. The exercise is entirely scripted and calls no real model.
10. **CostLatencyCalculator** (M5/M11): tokens × price × volume with provider presets; caching and batching toggles; monthly cost + p95 latency estimate.

**Tier 2: build after beta:**
11. NeuralNetPlayground (M3): tiny trainable-in-browser 2-layer net on toy 2-D data.
12. SQLSandbox (M1): sql.js in-browser SQLite with seeded tables for query exercises.
13. HTTPExplorer (M1): request builder against a built-in mock API; status codes, headers, timeouts.
14. RerankerCompare (M6): keyword vs semantic vs hybrid ranking side-by-side.
15. WorkflowBuilder (M8): drag nodes (trigger/step/LLM/approval) into a small DAG; simulate a run with injected failures to show retries/idempotency.
16. EvalScoreboard (M9): flip grader strictness/judge prompts and watch a fixed system's "score" move: metrics are constructed.
17. QuantizationTradeoff (M12): model-size/quality/speed curves; pick a device, see what fits.

**Check-widget hybrid:** any widget can embed a checkpoint question ("set temperature so the top token wins ~50% of the time"): validated client-side from widget state and counted as an inline check.

## 7. Assessment engine specification

### 7.1 Question types

| Type | Answer payload | Grading |
|---|---|---|
| `single` | option id | exact |
| `multi` | option id set | exact-set (no partial credit v1) |
| `numeric` | number | `abs(x-answer) ≤ tolerance` |
| `ordering` | ordered ids | exact sequence |
| `matching` | pair map | exact map |
| `short` | string | normalize (trim/case/whitespace) → match against accepted list or anchored regex |
| `code-output` | rendered as `single`/`short` with a code block stimulus | as underlying type |

### 7.2 Question YAML schema

```yaml
- id: m4-q017            # stable, never reused
  type: single
  difficulty: 2          # 1 easy · 2 core · 3 stretch
  objective: sampling    # maps to lesson/blueprint topic
  prompt: |
    With temperature → 0, sampling from a language model becomes…
  code: null             # optional code/figure stimulus
  options:
    - {id: a, text: "…uniform over the vocabulary"}
    - {id: b, text: "…greedy argmax of the logits", correct: true}
    - {id: c, text: "…a database lookup of the training data"}
    - {id: d, text: "…independent of the context"}
  explanation: |
    Low temperature sharpens the softmax; at the limit only the highest-logit
    token has probability mass. It is still decoding, not retrieval.
  hint: Think about what dividing logits by a tiny number does to softmax.
```

Validation (CI): unique ids; ≥1 correct; explanations required; pool satisfies blueprint; formative-check questions live in the lesson file, exam questions only in `pool.yaml` (never bundled client-side).

### 7.3 Storage of authored questions

Pools are compiled into the server bundle at build time (content-as-code); the DB stores only references (question ids) inside attempts. Editing a question mid-flight: attempts store the question id **and a content hash**; grading uses the version compiled at grade time, and the admin difficulty report flags hash drift so live attempts can be voided/regraded manually if a fix was material.

### 7.4 Exam blueprint

Per module (`module.yaml`): total questions N (15–25), composition constraints, e.g. `{difficulty: {1: 30%, 2: 50%, 3: 20%}, objectives: ≥1 per lesson}`. Pool target ≈ 2.5–3× N so three attempts see substantially different sets. Selection: constraint-satisfying random draw, seeded per attempt.

### 7.5 Grade computation

- Module exam score = best attempt % (0–100).
- Weights (`course.json`): software/ML foundations are 0.7–0.8, core application and production modules are 1.0, multimodal and expert modules are 0.9. The manifest is authoritative and the grade calculation normalizes by the current total.
- Final % = Σ(wᵢ·scoreᵢ)/Σwᵢ, rounded half-up. Bands: Pass ≥ 70, Merit ≥ 80, Distinction ≥ 90.
- Graduation requires every module ≥ 70 individually (a 95 average can't paper over a failed safety module).

## 8. Data model (SQLite via Drizzle)

```
users            id, email (unique, citext-normalized), display_name, role ('learner'|'admin'),
                 email_verified_at, consent_public_listing (bool), consent_show_score (bool),
                 final_grade_pct (nullable, denormalized), created_at
auth_tokens      id, user_id, token_hash, purpose ('signin'), expires_at, consumed_at
sessions         id, user_id, token_hash, expires_at, created_at, last_seen_at
lesson_progress  user_id, module_slug, lesson_slug, completed_at, checks_state (json)
                 PK (user_id, module_slug, lesson_slug)
exam_attempts    id, user_id, module_slug, status ('in_progress'|'submitted'),
                 question_set (json: [{qid, hash, option_order}]), score_pct (nullable),
                 started_at, submitted_at
attempt_answers  attempt_id, question_id, answer (json), is_correct (nullable)
                 PK (attempt_id, question_id)
attestations     user_id (PK), payload (json: checklist, title, summary, urls), submitted_at
graduations      id (uuid, = certificate id), user_id (unique), graduated_at,
                 grade_pct_at_graduation, hidden_by_admin (bool)
rate_limits      key, window_start, count            # or in-memory with periodic persistence
```

Content (modules, lessons, questions) is **not** in the DB: it is compiled from `content/` at build time; slugs/ids are the join keys. Deleting a user cascades to all rows.

## 9. API surface (Next.js route handlers / server actions)

```
POST /api/auth/register        {name, email, consents}     → sends magic link
POST /api/auth/signin          {email}                     → sends magic link
GET  /api/auth/verify?token=                               → session cookie + redirect
POST /api/auth/signout

POST /api/progress/lesson      {module, lesson, checksState} → upsert completion
GET  /api/progress/me                                        → map for course UI

POST /api/exam/start           {module}                    → attempt id + sanitized questions
PUT  /api/exam/answer          {attemptId, questionId, answer}   (autosave)
POST /api/exam/submit          {attemptId}                 → score + per-question results
GET  /api/exam/history?module=                             → attempts + best

POST /api/attestation          {payload}
GET  /api/certificate/[id]                                 → public JSON (page is SSR anyway)

PATCH /api/profile             {displayName, consents}
DELETE /api/profile                                        → account deletion

GET  /api/admin/stats, /api/admin/questions/difficulty     → role-gated
```

All mutating routes: session required (except auth), CSRF-safe (SameSite=Lax + origin check), zod-validated bodies, rate-limited. Grading exclusively server-side.

## 10. Security requirements

- Correct answers for exam questions never serialized to the client (verified by an automated test that greps rendered payloads).
- Session cookies httpOnly/Secure; magic-link tokens hashed at rest, single-use, 15-min TTL.
- Rate limits: auth email endpoints (per email + per IP), exam start (per user), profile mutation.
- Input validation everywhere (zod); output encoding by React defaults; CSP (`default-src 'self'`, frame-src allowlist for youtube-nocookie, img-src self+data+i.ytimg.com); no inline scripts.
- Admin routes: role check server-side per request.
- Dependency audit in CI; Caddy handles TLS 1.2+; HSTS.
- No secrets in the repo; `.env` on VPS only (SMTP creds, session secret, backup credentials).

## 11. Performance requirements

- Lesson pages statically rendered where possible (progress fetched client-side); LCP < 2.0 s, CLS < 0.1 on mid-range laptop, TTI < 3.5 s on module pages.
- Widget code-splitting: each widget its own chunk, loaded on approach (intersection observer); base lesson JS < 120 KB gzipped.
- SQLite in WAL mode; all queries indexed (user_id, module_slug paths); expected load trivial (< 10 rps).

## 12. Deployment architecture (VPS)

```
[Internet] → Caddy (443, auto-TLS, HSTS, gzip/brotli)
              → app (Next.js standalone, node:22-alpine, port 3000)
                 ↳ /data/app.db  (SQLite, WAL, docker volume)
                 ↳ Litestream sidecar → offsite bucket (or nightly backup cron)
```

- `docker-compose.yml`: `caddy`, `app`, optional `litestream`, optional `umami`.
- Deploy: GitHub Actions builds image → pushes to GHCR → SSH `docker compose pull && up -d` (or a `deploy.sh`). Rollback = previous image tag.
- Health: `/api/health` (checks DB open); uptime monitoring via a free external pinger; Caddy access logs rotated.
- Runbook (in repo): restore-from-backup, rotate session secret, block abusive IP, void an exam attempt.

## 13. Testing strategy

- **Unit:** grading functions per question type (the highest-stakes logic: exhaustive cases incl. tolerance edges, normalization, permutation handling); grade/band computation; blueprint selector (property test: constraints always satisfied, no duplicate questions per attempt).
- **Integration:** auth flow (register→link→session), exam lifecycle (start→autosave→resume→submit→retake→attempt limit), graduation trigger, consent revocation removes graduate row, account deletion cascade.
- **Content CI:** MDX compiles, question schema/blueprint validation, internal links, answer-leak grep test.
- **E2E (Playwright):** the golden path: register, complete a lesson (checks), sit an exam, fail, retake, pass, graduate, appear on graduates page, verify certificate; plus a11y smoke (axe) on lesson/exam/graduates pages.
- **Widget tests:** each Tier-1 widget gets interaction tests (state math, e.g., softmax/temperature correctness in SamplingSimulator): the widgets teach; they must not teach wrong numbers.
