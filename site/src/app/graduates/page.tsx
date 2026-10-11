import Link from "next/link";
import { getDb } from "@/lib/db";
import { gradeBand } from "@/lib/grading";

export const metadata = { title: "Graduates" };
export const dynamic = "force-dynamic";

const TILE_HUES = [250, 300, 145, 70, 25, 175];

function bandStyles(band: string): { background: string; color: string } {
  if (band === "Distinction") return { background: "var(--color-accent-tint)", color: "var(--color-accent)" };
  if (band === "Merit") return { background: "var(--color-ok-tint)", color: "var(--color-ok-deep)" };
  return { background: "var(--color-track)", color: "var(--color-ink-soft)" };
}

export default async function GraduatesPage() {
  const rows = getDb()
    .prepare(
      `SELECT g.id, g.graduated_at, g.grade_pct, u.display_name, u.consent_show_score
       FROM graduations g JOIN users u ON u.id = g.user_id
       WHERE u.consent_public_listing = 1 AND g.hidden_by_admin = 0
       ORDER BY g.graduated_at DESC, g.id DESC LIMIT 500`
    )
    .all() as { id: string; graduated_at: string; grade_pct: number; display_name: string; consent_show_score: number }[];

  return (
    <div className="mx-auto max-w-[720px] px-6 py-11">
      <h1 className="text-[32px] font-extrabold tracking-tight">Graduates</h1>
      <p className="muted mt-2 text-base max-w-[520px]">
        {rows.length === 0
          ? "The board is waiting for its first name. It could be yours."
          : `${rows.length} ${rows.length === 1 ? "person has" : "people have"} completed every module, passed every exam, and shipped a capstone. Each entry links to a verifiable certificate.`}
      </p>
      <div className="mt-7 flex flex-col gap-2.5">
        {rows.map((r, i) => {
          const band = gradeBand(r.grade_pct);
          const pill = bandStyles(band);
          return (
            <a key={r.id} href={`/certificate/${r.id}`}
              className="card px-5 py-4 flex items-center gap-4 hover:border-accent transition-colors text-ink">
              <span
                aria-hidden
                className="w-[42px] h-[42px] rounded-xl grid place-items-center text-white font-extrabold shrink-0"
                style={{ background: `oklch(0.6 0.12 ${TILE_HUES[i % TILE_HUES.length]})` }}
              >
                {r.display_name[0]?.toUpperCase()}
              </span>
              <span className="flex-1 font-bold text-base truncate">{r.display_name}</span>
              <span className="text-[13px] font-bold rounded-full px-3.5 py-1" style={pill}>
                {band}{r.consent_show_score ? ` · ${r.grade_pct}%` : ""}
              </span>
              <span className="text-sm faint w-[88px] text-right shrink-0">{r.graduated_at.slice(0, 10)}</span>
            </a>
          );
        })}
      </div>
      <p className="text-[13px] faint mt-7">
        Listing is opt-in; graduates control whether their name and score appear.
      </p>
      <div className="mt-9 rounded-[18px] px-7 py-6 flex flex-wrap items-center gap-5 bg-[#262019] text-[#FBF8F2]">
        <div className="flex-1 min-w-[200px]">
          <div className="font-extrabold text-lg">Your name goes here.</div>
          <div className="text-[14.5px] mt-1 text-[#B9B0A0]">
            15 exams and one capstone between you and the board.
          </div>
        </div>
        <Link
          href="/course"
          className="rounded-full px-6 py-3 font-bold text-[15px] shrink-0 bg-gold text-[#262019] hover:brightness-95 transition-[filter]"
        >
          Keep going →
        </Link>
      </div>
    </div>
  );
}
