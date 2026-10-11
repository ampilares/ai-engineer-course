# Practical AI Engineer: learning platform

The active October 2026 curriculum contains 16 modules, 48 lessons, and 128 knowledge questions.
Canonical content lives in [../course/](../course/README.md). Run
`node course/tools/publish.mjs` from the repository root after editing chapters or questions;
`node course/tools/publish.mjs --check` verifies generated files. Practical portfolio and
capstone grading require a reviewer; the platform records quizzes and capstone self-attestation.
See [curriculum maintenance](../course/maintenance.md) before deploying to an existing cohort.

A free interactive course website for practical AI engineering and business automation.

- **Active path**: 48 lessons across 16 modules, from task selection through model interfaces,
  retrieval, workflows, OpenClaw, Hermes, Grok Bot, evaluation, operations, and a capstone.
- **Practice**: inline checks, selected concept simulators, two studio routes, downloadable
  fictional inputs, runnable reference labs, and an interactive draft-review prototype.
- **Graded knowledge exams**: eight questions per module (128 total), server-side grading,
  70% pass mark, best of three attempts, open book.
- **Site completion**: pass all 16 exams and submit capstone self-attestation for a verifiable
  completion record and optional public listing. Practical assessment requires a reviewer.
- **Optional references**: the earlier 69 lessons and their questions remain available outside
  the active core. Historical numbering and prerequisites do not apply to the new path.
- **Placement quiz**: /placement recommends where to begin reviewing; required evidence still applies.
- **Accounts**: register with name + email; passwordless magic-link sign-in.

## Tech stack

Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · SQLite via `node:sqlite` · MDX content
compiled at request time · Docker + Caddy for deployment. No paid services required.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

No configuration needed. Without SMTP configured, the app runs in **dev-mail mode**: sign-in
magic links are printed to the server console *and* shown on the "check your email" page, so you
can register and sign in without an email provider.

Notes: the in-browser Python/SQL practice widgets load their runtimes (Pyodide ~10 MB, sql.js ~1 MB)
from public CDNs on first use, so those exercises need internet access. The footer's
"Community & source" link is a placeholder: point it at your real repository/Discussions URL in
`src/app/layout.tsx` before launch.

Validate content and grading anytime:

```bash
node scripts/validate-content.mjs   # schema + blueprint checks on all lessons/questions
node scripts/test-grading.mjs       # every question grades correctly (correct→pass, wrong→fail)
```

## Content

All course content is data, versioned in `content/`:

```
content/course.json                     # phases, module order, exam weights, grade bands
content/modules/<slug>/module.json      # module metadata + lesson list
content/modules/<slug>/lessons/*.mdx    # lessons (prose + <Check> + widget components)
content/modules/<slug>/questions.json   # exam question pool
```

The practical modules are generated: edit `course/weeks/NN.md`, the exam bank in
`course/assessments/questions.mjs`, or the in-lesson exercises in `course/interactions/NN.json`, then run
`node course/tools/publish.mjs`. Hand edits to generated `.mdx` files are overwritten. Widgets available in
MDX are registered in `src/components/mdx-components.tsx`. Run the validator after edits.

### Interactive lessons

Lessons play Brilliant-style: `src/lib/steps.ts` splits each lesson into short steps (at headings, at each
exercise, and roughly every 650 characters of prose), and `LessonPlayer` reveals them one at a time with a
progress bar. A step that contains an exercise must be answered before **Continue** unlocks. Steps under
`### Engineering route` / `### Business-owner route` headings follow the route switch in the top bar.

Each item in `course/interactions/NN.json` sits in `lessons[0..2]` (concepts, worked example, studio). Its
`after` field is `"^"` (opens the lesson) or the verbatim start of a paragraph in that week's chapter. Types:

| `type` | Fields | Renders |
|---|---|---|
| `check` | `question`, `options`, `answer` (index), `explanation`, `hint?` | multiple choice |
| `sort` | `prompt`, `buckets`, `items: [{text, bucket}]`, `explanation` | tap-to-sort into groups |
| `order` | `prompt`, `steps` (correct order), `explanation` | arrange steps |
| `numeric` | `question`, `answer`, `tolerance`, `unit`, `explanation` | number entry |
| `reveal` | `prompt`, `answer` | ungraded "think first, then reveal" |

Keep these different from the exam bank so lessons don't give away exam answers.

## Deploy to a VPS

### amp-vps deployment

Live URL: https://course.allenpilares.com

The production checkout is `/home/deploy/apps/ai-engineer-course` on `amp-vps`.
Run `docker compose -f compose.production.yml up -d --build` there after uploading
the source. This deployment uses the host's existing Caddy proxy and exposes the
app only on `127.0.0.1:3025`. The `app-data` Docker volume preserves the database.
Keep `.env.production` on the server, mode 600; it contains the SMTP settings used
for passwordless sign-in. Production refuses to display sign-in links without SMTP.

`scripts/ensure-caddy-route.py` adds only the course's HTTPS route and HTTP redirect
through Caddy's local admin API. The deploy user's crontab runs it every minute,
following this VPS's existing route recovery convention. It saves the original
runtime configuration to `caddy-before-course.json` before the first change.
Do not reload the older `/etc/caddy/Caddyfile`; it does not contain all live routes.

Check status with `docker compose -f compose.production.yml ps` and logs with
`docker compose -f compose.production.yml logs --tail=100 app`.
Verify SMTP authentication without sending mail with
`docker compose -f compose.production.yml exec app node scripts/verify-smtp.mjs`.
Admin promotion uses `docker compose -f compose.production.yml exec app node
scripts/make-admin.mjs you@example.com` after that account has registered.

The deployment updates compatible security patches. The remaining dependency
audit findings concern `next-mdx-remote` v5 and Next.js's bundled PostCSS. Course MDX
and CSS must remain trusted repository content; accepting user-authored MDX or CSS
requires resolving those findings first.

### Standalone VPS with its own Caddy

1. Point your domain's DNS at the VPS and set it in `Caddyfile` (replace `learn.example.com`).
2. Set `BASE_URL` and (for real emails) the `SMTP_*` vars: see `.env.example`.
3. Build and start:

   ```bash
   BASE_URL=https://learn.example.com docker compose up -d --build
   ```

   Caddy obtains and renews TLS automatically; the app container serves on the internal network,
   and the SQLite database persists in the `app-data` volume.
4. Promote yourself to admin (for the `/admin` dashboard):

   ```bash
   docker compose exec app node scripts/make-admin.mjs you@example.com
   ```

### Backups

The entire database is one file in the `app-data` volume (`/data/app.db`). Back it up with a nightly
cron, e.g. `docker compose exec app sh -c "sqlite3 /data/app.db '.backup /data/backup.db'"` copied
off-box, or stream it continuously with Litestream to any S3-compatible bucket.

## Admin

`/admin` (admin role only) shows registrations, the module funnel, per-exam pass rates and average
scores, and recent activity.

## Privacy & data

Minimal data by design: name, email, progress, exam scores, and the capstone attestation. Email is
never shown publicly. Graduates-page listing and score display are both opt-in. Users can delete
their account (and all data) from their profile. See `/privacy`.
