import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAllModules, getCourse, getPhaseTitle, phaseColor } from "@/lib/content";
import { getProgress, nextLesson } from "@/lib/progress";
import { bestScores } from "@/lib/grading";

export const metadata = { title: "Course" };

export default async function CoursePage() {
  const user = await getCurrentUser();
  const course = getCourse();
  const modules = getAllModules();
  const progress = user ? getProgress(user.id) : {};
  const scores = user ? bestScores(user.id) : {};
  const cont = user ? nextLesson(progress) : null;

  return (
    <div className="mx-auto max-w-[820px] px-6 py-11">
      {user ? (
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight">Welcome back, {user.display_name.split(" ")[0]}</h1>
          <p className="muted mt-1.5 text-base">
            {cont ? <>Up next: {cont.moduleTitle} → {cont.title}. Keep it rolling.</> : "Every lesson done. Time for the capstone."}
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight">The course</h1>
          <p className="muted mt-1.5 max-w-2xl text-base">
            {modules.length} modules from absolute zero through production AI systems. Finish each
            module&apos;s lessons, pass its exam (≥{course.passPct}%), ship your capstone, and graduate.
          </p>
          <p className="text-sm mt-2 muted">
            Not sure where to begin?{" "}
            <Link href="/placement" className="text-accent hover:text-accent-deep font-semibold">
              Take the 2-minute placement quiz
            </Link>.
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col">
        {modules.map((m, i) => {
          const done = progress[m.slug]?.size ?? 0;
          const total = m.lessons.length;
          const score = scores[m.slug];
          const passed = score !== undefined && score >= course.passPct;
          const isCurrent = cont ? cont.module === m.slug : !user && i === 0;
          const upcoming = user ? !passed && !isCurrent && done === 0 : i !== 0;
          const col = phaseColor(m.phase, 0.6);
          const colDark = phaseColor(m.phase, 0.5);
          const showPhase = i === 0 || modules[i - 1].phase !== m.phase;
          const next = modules[i + 1];
          const nextActive =
            next && (scores[next.slug] !== undefined || (progress[next.slug]?.size ?? 0) > 0 || cont?.module === next.slug);

          return (
            <div key={m.slug}>
              {showPhase && (
                <div className="text-xs font-extrabold tracking-[0.1em] uppercase mt-2.5 mb-3" style={{ color: colDark }}>
                  {getPhaseTitle(m.phase)}
                </div>
              )}
              <div className="flex gap-4.5" style={{ opacity: upcoming ? 0.55 : 1 }}>
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-[52px] h-[52px] rounded-full grid place-items-center"
                    style={{
                      background: passed
                        ? col
                        : isCurrent
                          ? `conic-gradient(${col} 0 ${total ? Math.round((done / total) * 100) : 0}%, var(--color-line) 0 100%)`
                          : "var(--color-line-soft)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full grid place-items-center font-extrabold text-lg"
                      style={{
                        background: passed ? col : "var(--color-paper)",
                        color: passed ? "#fff" : isCurrent ? colDark : "var(--color-ink-faint)",
                      }}
                    >
                      {passed ? "✓" : m.number}
                    </div>
                  </div>
                  <div
                    className="w-[3px] flex-1 min-h-5"
                    style={{
                      background:
                        passed && next && nextActive
                          ? `linear-gradient(${col}, ${phaseColor(next.phase, 0.6)})`
                          : "var(--color-line)",
                    }}
                  />
                </div>
                <div className="pb-5 flex-1 min-w-0">
                  <Link
                    href={`/course/${m.slug}`}
                    className="block bg-card rounded-[14px] px-4.5 py-3.5 text-ink transition-colors hover:border-[#C9BFA9]"
                    style={{
                      border: isCurrent ? `2px solid ${col}` : "1px solid var(--color-line)",
                      boxShadow: isCurrent ? "0 8px 24px rgba(120,80,190,0.12)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base">{m.number}. {m.title}</div>
                        <div className="text-[13px] faint mt-0.5 truncate">
                          {user
                            ? `${done}/${total} lessons${score !== undefined ? ` · exam ${score}%` : ""}`
                            : m.summary}
                        </div>
                      </div>
                      {passed ? (
                        <span className="shrink-0 text-[13px] font-bold text-ok-deep">Passed</span>
                      ) : isCurrent ? (
                        <span
                          className="shrink-0 text-[13px] font-bold text-white px-4.5 py-2 rounded-full"
                          style={{ background: col }}
                        >
                          {user ? "Continue" : "Start here"}
                        </span>
                      ) : null}
                    </div>
                    {isCurrent && total > 0 && (
                      <div className="mt-3 h-[7px] rounded-full bg-track">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.max((done / total) * 100, 4)}%`, background: col }}
                        />
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex gap-4.5">
          <div className="w-[52px] shrink-0 grid place-items-center">
            <div className="w-11 h-11 rounded-xl grid place-items-center text-xl font-extrabold bg-[#262019] text-gold">★</div>
          </div>
          <Link href="/capstone" className="flex-1 rounded-[14px] px-4.5 py-4 bg-[#262019] text-[#FBF8F2] block hover:opacity-95 transition-opacity">
            <div className="font-bold text-base">Capstone &amp; graduation</div>
            <div className="text-[13px] mt-0.5 text-[#B9B0A0]">
              Pass all {modules.length} exams, ship your capstone, earn the certificate.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
