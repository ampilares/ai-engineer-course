# Practical AI Engineer: learning platform

A free, Brilliant.org-style interactive course website that takes learners from beginner to
working AI engineer. Built from the curriculum in the parent repository.

- **Complete path**: 69 lessons across 18 modules, from absolute zero (Python and math on-ramp,
  no coding assumed) through LLMs, RAG, agents, multimodal, product, security, and production, to
  getting hired.
- **Interactive lessons**: inline knowledge checks, production scenarios, guided builds, and 16
  hands-on widgets (tokenizer explorer, attention heatmap, sampling simulator, vector explorer,
  pipeline simulator, A/B test simulator, prompt-injection sandbox, and more), including **in-browser
  Python (Pyodide) and SQL (sql.js) coding exercises** with checked solutions.
- **Graded exams**: every module ends in a 10-question auto-graded exam drawn from a randomized pool
  (348 questions total), server-side grading, 70% pass mark, best of 3 attempts.
- **Graduation**: pass all 18 exams + submit the capstone attestation to graduate, earn a verifiable
  certificate, and (opt-in) appear on the public graduates page.
- **Placement quiz**: /placement recommends a starting module so experienced learners skip ahead.
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

To edit a lesson, edit its `.mdx`; to change an exam, edit `questions.json`. Widgets available in
MDX are registered in `src/components/mdx-components.tsx`. Run the validator after edits.

## Deploy to a VPS

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
