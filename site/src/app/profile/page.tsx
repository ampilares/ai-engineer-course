import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAllModules, getCourse, phaseColor } from "@/lib/content";
import { bestScores, computeFinalGrade, gradeBand } from "@/lib/grading";
import { getProgress } from "@/lib/progress";
import { getDb } from "@/lib/db";
import { deleteAccountAction, signoutAction, updateProfileAction } from "./actions";

export const metadata = { title: "Your profile" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; attested?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const { saved, attested } = await searchParams;
  const course = getCourse();
  const modules = getAllModules();
  const progress = getProgress(user.id);
  const scores = bestScores(user.id);
  const { pct } = computeFinalGrade(user.id);
  const grad = getDb().prepare("SELECT id FROM graduations WHERE user_id = ?").get(user.id) as
    | { id: string }
    | undefined;
  const hasAttestation = !!getDb().prepare("SELECT user_id FROM attestations WHERE user_id = ?").get(user.id);

  const lessonsDone = Object.values(progress).reduce((a, s) => a + s.size, 0);
  const lessonsTotal = modules.reduce((a, m) => a + m.lessons.length, 0);
  const examsPassed = modules.filter((m) => (scores[m.slug] ?? 0) >= course.passPct).length;
  const gradSteps = 2;
  const gradDone = (examsPassed === modules.length ? 1 : 0) + (hasAttestation ? 1 : 0);

  return (
    <div className="mx-auto max-w-[680px] px-6 py-11">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full grid place-items-center text-[22px] font-extrabold text-white shrink-0"
            style={{ background: "oklch(0.6 0.12 300)" }}>
            {user.display_name[0]?.toUpperCase()}
          </span>
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">{user.display_name}</h1>
            <p className="faint text-sm">{user.email} · never shown publicly</p>
          </div>
        </div>
        <form action={signoutAction}>
          <button type="submit" className="btn-ghost text-sm">Sign out</button>
        </form>
      </div>
      {(saved || attested) && (
        <p className="mt-3 text-sm text-ok-deep font-semibold" role="status">
          ✓ {attested ? "Capstone attestation saved." : "Profile saved."}
        </p>
      )}

      <div className="grid grid-cols-3 gap-3 mt-7 text-center">
        <div className="card p-4.5">
          <div className="text-[26px] font-extrabold">
            {lessonsDone}<span className="text-[#C9C0B0]">/{lessonsTotal}</span>
          </div>
          <div className="text-xs font-bold tracking-[0.06em] faint uppercase">Lessons</div>
        </div>
        <div className="card p-4.5">
          <div className="text-[26px] font-extrabold">
            {examsPassed}<span className="text-[#C9C0B0]">/{modules.length}</span>
          </div>
          <div className="text-xs font-bold tracking-[0.06em] faint uppercase">Exams passed</div>
        </div>
        <div className="card p-4.5">
          <div className="text-[26px] font-extrabold text-ok-deep">{pct !== null ? `${pct}%` : "—"}</div>
          <div className="text-xs font-bold tracking-[0.06em] faint uppercase">
            {pct !== null ? `${gradeBand(pct)} · so far` : "Grade · so far"}
          </div>
        </div>
      </div>

      {grad ? (
        <div className="mt-4 bg-ok-tint border-[1.5px] border-ok/50 rounded-2xl px-5 py-4.5 flex items-center gap-3.5">
          <span aria-hidden className="w-10 h-10 rounded-xl bg-ok grid place-items-center text-white text-lg shrink-0">★</span>
          <div className="flex-1 text-[15px]">
            <strong>You&apos;re a graduate.</strong> Every exam passed, capstone shipped.
          </div>
          <Link href={`/certificate/${grad.id}`} className="font-bold text-sm text-accent hover:text-accent-deep shrink-0">
            View certificate →
          </Link>
        </div>
      ) : (
        <div className="card mt-4 px-5 py-4.5">
          <p className="font-bold text-[15px]">Path to graduation</p>
          <ul className="mt-2.5 space-y-2 text-[14.5px] muted">
            <li className="flex items-center gap-2.5">
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] shrink-0 ${
                examsPassed === modules.length ? "bg-ok text-white font-extrabold" : "border-[1.5px] border-line-strong faint"}`}>
                {examsPassed === modules.length ? "✓" : "○"}
              </span>
              Pass all {modules.length} module exams (≥{course.passPct}% each) — {examsPassed} done
            </li>
            <li className="flex items-center gap-2.5">
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] shrink-0 ${
                hasAttestation ? "bg-ok text-white font-extrabold" : "border-[1.5px] border-line-strong faint"}`}>
                {hasAttestation ? "✓" : "○"}
              </span>
              <span>
                Submit the{" "}
                <Link href="/capstone" className="text-accent hover:text-accent-deep font-semibold">capstone attestation</Link>
              </span>
            </li>
          </ul>
          <div className="mt-3 h-[7px] rounded-full bg-track">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${Math.max(Math.round(((gradDone + examsPassed / modules.length) / (gradSteps + 1)) * 100), 4)}%` }}
            />
          </div>
        </div>
      )}

      <h2 className="kicker mt-9 mb-3">Exam scores</h2>
      <div className="card overflow-hidden">
        {modules.map((m) => {
          const s = scores[m.slug];
          return (
            <div key={m.slug} className="flex items-center justify-between px-4.5 py-2.5 text-[14.5px] border-b border-track last:border-b-0">
              <span className="flex items-center gap-2.5">
                <span aria-hidden className="w-2 h-2 rounded-full shrink-0" style={{ background: phaseColor(m.phase, 0.6) }} />
                {m.number}. {m.title}
              </span>
              <span className={`font-bold ${
                s !== undefined ? (s >= course.passPct ? "text-ok-deep" : "text-bad-deep") : "text-[#C9C0B0] font-normal"}`}>
                {s !== undefined ? `${s}%` : "not taken"}
              </span>
            </div>
          );
        })}
      </div>

      <h2 className="kicker mt-9 mb-3">Settings</h2>
      <form action={updateProfileAction} className="card px-6 py-5.5 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold muted mb-1.5">
            Display name (as shown on the graduates page)
          </label>
          <input id="name" name="name" defaultValue={user.display_name} required maxLength={80} className="input" />
        </div>
        <label className="flex items-start gap-2.5 text-[14.5px] cursor-pointer">
          <input type="checkbox" name="consent_listing" defaultChecked={!!user.consent_public_listing} className="mt-1 accent-[var(--color-accent)]" />
          <span>List me publicly on the graduates page when I graduate.</span>
        </label>
        <label className="flex items-start gap-2.5 text-[14.5px] cursor-pointer">
          <input type="checkbox" name="consent_score" defaultChecked={!!user.consent_show_score} className="mt-1 accent-[var(--color-accent)]" />
          <span>Also show my exact score (otherwise only the grade band is shown).</span>
        </label>
        <button type="submit" className="btn-primary shadow-none!">Save settings</button>
      </form>

      <details className="mt-7">
        <summary className="text-sm text-bad-deep cursor-pointer">Delete my account…</summary>
        <form action={deleteAccountAction} className="card p-5 mt-3 space-y-3 border-bad/40">
          <p className="text-sm muted">
            This permanently removes your account, progress, exam history, and any graduates-page
            entry. Type <strong>DELETE</strong> to confirm.
          </p>
          <input name="confirm" className="input" placeholder="DELETE" />
          <button type="submit" className="btn bg-bad text-white hover:bg-bad-deep">Delete everything</button>
        </form>
      </details>
    </div>
  );
}
