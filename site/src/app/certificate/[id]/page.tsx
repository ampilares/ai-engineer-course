import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { bestScores, gradeBand } from "@/lib/grading";
import { getAllModules, getCourse, phaseColor } from "@/lib/content";

export const metadata = { title: "Certificate" };
export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const row = getDb()
    .prepare(
      `SELECT g.graduated_at, g.grade_pct, g.hidden_by_admin, u.id AS user_id, u.display_name
       FROM graduations g JOIN users u ON u.id = g.user_id WHERE g.id = ?`
    )
    .get(id) as
    | { graduated_at: string; grade_pct: number; hidden_by_admin: number; user_id: number; display_name: string }
    | undefined;
  if (!row || row.hidden_by_admin) notFound();

  const attestation = getDb()
    .prepare("SELECT payload FROM attestations WHERE user_id = ?")
    .get(row.user_id) as { payload: string } | undefined;
  const capstone = attestation ? (JSON.parse(attestation.payload) as { title?: string; summary?: string; url?: string }) : null;
  const scores = bestScores(row.user_id);
  const modules = getAllModules();
  const course = getCourse();
  const band = gradeBand(row.grade_pct);

  const dotHues = [175, 300, 70, 250, 145, 25, 285];

  return (
    <div className="mx-auto max-w-[680px] px-6 py-12">
      <div className="bg-card border-2 border-accent rounded-[22px] p-2">
        <div className="border border-line rounded-2xl px-10 py-11 text-center">
          <div
            aria-hidden
            className="w-10 h-10 rounded-xl mx-auto"
            style={{ background: "conic-gradient(from 40deg, #3B5BDB, oklch(0.6 0.13 145), #F5B840, #3B5BDB)" }}
          />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] faint mt-4.5">
            Certificate of completion
          </p>
          <h1 className="text-lg font-bold mt-3.5">{course.title}</h1>
          <p className="faint text-[13.5px] mt-0.5">A free, open, project-based AI engineering course</p>
          <p className="text-[40px] font-extrabold tracking-tight mt-6 leading-tight">{row.display_name}</p>
          <p className="mt-3.5 text-[15.5px] muted">
            completed all {modules.length} modules and graduated with
          </p>
          <p className="text-2xl font-extrabold mt-1 text-accent">{band} · {row.grade_pct}%</p>
          <div className="flex justify-center gap-2 mt-5" aria-hidden>
            {dotHues.map((h) => (
              <span key={h} className="w-2.5 h-2.5 rounded-full" style={{ background: `oklch(0.6 0.12 ${h})` }} />
            ))}
          </div>
          <p className="text-[13.5px] faint mt-5">Graduated {row.graduated_at.slice(0, 10)}</p>
          {capstone?.title && (
            <p className="mt-2.5 text-sm">
              <span className="faint">Capstone (self-certified):</span> <strong>{capstone.title}</strong>
              {capstone.url && (
                <>
                  {" "}·{" "}
                  <a href={capstone.url} className="text-accent hover:text-accent-deep" rel="noopener noreferrer" target="_blank">
                    project link
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      <h2 className="kicker mt-9 mb-3">Module exam scores</h2>
      <div className="card overflow-hidden">
        {modules.map((m) => (
          <div key={m.slug} className="flex items-center justify-between px-4.5 py-2.5 text-[14.5px] border-b border-track last:border-b-0">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="w-2 h-2 rounded-full shrink-0" style={{ background: phaseColor(m.phase, 0.6) }} />
              {m.number}. {m.title}
            </span>
            <strong>{scores[m.slug] !== undefined ? `${scores[m.slug]}%` : "—"}</strong>
          </div>
        ))}
      </div>
      <p className="text-[13px] faint mt-6 leading-relaxed">
        Verification: this page, at this URL, is the certificate. If it loads on this site with this
        name, it is genuine. ID: <code className="text-[11.5px] font-mono">{id}</code>
      </p>
    </div>
  );
}
