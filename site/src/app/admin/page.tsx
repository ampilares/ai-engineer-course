import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getAllModules, getCourse } from "@/lib/content";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") notFound();
  const d = getDb();
  const modules = getAllModules();

  const users = (d.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number }).c;
  const grads = (d.prepare("SELECT COUNT(*) AS c FROM graduations").get() as { c: number }).c;
  const attempts = (d.prepare("SELECT COUNT(*) AS c FROM exam_attempts WHERE status='submitted'").get() as { c: number }).c;

  const perModule = modules.map((m) => {
    const started = (d.prepare("SELECT COUNT(DISTINCT user_id) AS c FROM lesson_progress WHERE module_slug = ?").get(m.slug) as { c: number }).c;
    const stats = d.prepare(
      "SELECT COUNT(*) AS n, AVG(score_pct) AS avg, SUM(CASE WHEN score_pct >= ? THEN 1 ELSE 0 END) AS passed FROM exam_attempts WHERE module_slug = ? AND status = 'submitted'"
    ).get(getCourse().passPct, m.slug) as { n: number; avg: number | null; passed: number | null };
    return { m, started, ...stats };
  });

  const recent = d.prepare(
    "SELECT display_name, email, created_at FROM users ORDER BY id DESC LIMIT 10"
  ).all() as { display_name: string; email: string; created_at: string }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin</h1>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="card p-4"><div className="text-2xl font-bold">{users}</div><div className="text-xs muted">registered</div></div>
        <div className="card p-4"><div className="text-2xl font-bold">{attempts}</div><div className="text-xs muted">exam attempts</div></div>
        <div className="card p-4"><div className="text-2xl font-bold">{grads}</div><div className="text-xs muted">graduates</div></div>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider muted mt-10 mb-3">Module funnel & exam stats</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b line">
              <th className="p-3">Module</th><th className="p-3">learners started</th>
              <th className="p-3">attempts</th><th className="p-3">avg score</th><th className="p-3">pass rate</th>
            </tr>
          </thead>
          <tbody>
            {perModule.map(({ m, started, n, avg, passed }) => (
              <tr key={m.slug} className="border-b line last:border-0">
                <td className="p-3">{m.number}. {m.title}</td>
                <td className="p-3">{started}</td>
                <td className="p-3">{n}</td>
                <td className="p-3">{avg !== null ? `${avg.toFixed(1)}%` : "N/A"}</td>
                <td className="p-3">{n > 0 ? `${Math.round(((passed ?? 0) / n) * 100)}%` : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider muted mt-10 mb-3">Recent registrations</h2>
      <div className="card divide-y divide-[var(--color-line)] dark:divide-[#2a2e38]">
        {recent.map((r, i) => (
          <div key={i} className="flex justify-between px-4 py-2 text-sm">
            <span>{r.display_name} <span className="muted">({r.email})</span></span>
            <span className="muted">{r.created_at.slice(0, 16)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
