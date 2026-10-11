import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAllModules, getCourse, getPhaseTitle, PHASE_COLORS } from "@/lib/content";
import { getProgress, nextLesson } from "@/lib/progress";
import { SamplingSimulator } from "@/components/widgets/SamplingSimulator";

export default async function LandingPage() {
  const user = await getCurrentUser();
  const modules = getAllModules();
  const course = getCourse();
  const cont = user ? nextLesson(getProgress(user.id)) : null;

  // One representative module per major phase, like the design's path row.
  const pathPicks = [0, 3, 4, 6].map((i) => modules[i]).filter(Boolean);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 grid lg:grid-cols-[1fr_440px] gap-14 items-center">
        <div>
          <h1 className="text-[40px] sm:text-[52px] font-extrabold tracking-tighter leading-[1.06] text-pretty">
            Learn AI engineering by{" "}
            <span style={{ background: "linear-gradient(transparent 62%, #FBDC8E 62%)" }}>doing</span>, not watching.
          </h1>
          <p className="mt-5 text-[19px] leading-relaxed muted max-w-[520px] text-pretty">
            From Python foundations to RAG, agents, and production — every lesson is a thing you
            play with, not a video you sit through.
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            {user ? (
              cont ? (
                <Link href={`/course/${cont.module}/${cont.lesson}`} className="btn-primary px-6! py-3.5! text-base!">
                  Continue: {cont.moduleTitle} → {cont.title}
                </Link>
              ) : (
                <Link href="/course" className="btn-primary px-6! py-3.5! text-base!">Open the course</Link>
              )
            ) : (
              <>
                <Link href="/register" className="btn-primary px-6! py-3.5! text-base!">
                  Start learning — it&apos;s free
                </Link>
                <Link href="/course" className="btn-ghost px-6! py-3.5! text-base!">Browse the course</Link>
              </>
            )}
          </div>
          <p className="mt-4 text-sm faint">
            {course.modules.length} modules · graded exams · verifiable certificate · 100% free
          </p>
          <p className="mt-1.5 text-sm muted">
            Already know some of this?{" "}
            <Link href="/placement" className="text-accent hover:text-accent-deep font-semibold">
              Take the placement quiz
            </Link>{" "}
            to skip ahead.
          </p>
        </div>
        <div className="relative hidden lg:block">
          <span aria-hidden className="absolute w-[54px] h-[54px] rounded-[14px] -top-6 -right-3 rotate-12 animate-[floaty_5s_ease-in-out_infinite]" style={{ background: "oklch(0.7 0.13 70)" }} />
          <span aria-hidden className="absolute w-[34px] h-[34px] rounded-full -bottom-3 -left-4 animate-[floaty_6s_ease-in-out_1s_infinite]" style={{ background: "oklch(0.6 0.13 145)" }} />
          <span aria-hidden className="absolute w-6 h-6 top-[38%] -left-8 rotate-45 animate-[floaty_7s_ease-in-out_0.5s_infinite]" style={{ background: "oklch(0.6 0.12 300)" }} />
          <div className="relative shadow-[0_16px_40px_rgba(38,32,25,0.08)] rounded-2xl">
            <SamplingSimulator />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px] font-extrabold tracking-tight">Your path, start to shipped</h2>
          <Link href="/course" className="text-[15px] font-semibold text-accent hover:text-accent-deep">
            See all {course.modules.length} modules →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {pathPicks.map((m) => (
            <Link key={m.slug} href={`/course/${m.slug}`}
              className="card p-4.5 rounded-[14px] block hover:border-accent transition-colors">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: PHASE_COLORS[m.phase] }}>
                {getPhaseTitle(m.phase)}
              </span>
              <h3 className="font-bold mt-1.5 text-[15px] leading-snug">{m.number}. {m.title}</h3>
              <p className="text-[13px] faint mt-1 line-clamp-2 leading-normal">{m.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-[22px] font-extrabold tracking-tight text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <div className="text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-tint grid place-items-center mx-auto">
                <span aria-hidden className="w-[22px] h-[22px] rounded-full bg-accent" />
              </div>
              <h3 className="font-bold text-[17px] mt-3.5">Play with every concept</h3>
              <p className="mt-1.5 text-[15px] muted leading-relaxed">
                Every lesson has sliders, simulators, and sandboxes — tokenizers, attention maps,
                gradient descent, agent loops.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 h-14 rounded-2xl grid place-items-center mx-auto" style={{ background: "oklch(0.96 0.03 70)" }}>
                <span aria-hidden className="w-[22px] h-[22px] rotate-45" style={{ background: "oklch(0.7 0.13 70)" }} />
              </div>
              <h3 className="font-bold text-[17px] mt-3.5">Prove it in graded exams</h3>
              <p className="mt-1.5 text-[15px] muted leading-relaxed">
                Every module ends in an auto-graded exam. {course.passPct}% to pass, best of{" "}
                {course.maxAttempts} attempts, open book.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-ok-tint grid place-items-center mx-auto">
                <span aria-hidden className="w-[22px] h-[22px] rounded-md bg-ok" />
              </div>
              <h3 className="font-bold text-[17px] mt-3.5">Graduate with proof</h3>
              <p className="mt-1.5 text-[15px] muted leading-relaxed">
                Pass all {course.modules.length} exams, ship your capstone, and earn a verifiable
                certificate — plus a spot on the graduates board.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="text-[34px] font-extrabold tracking-tight">Curious? That&apos;s the only prerequisite.</h2>
        <p className="mt-3 mx-auto max-w-[480px] text-[17px] muted leading-relaxed">
          A name and an email — that&apos;s all it takes. No card, no catch, no videos.
        </p>
        <div className="mt-6">
          <Link href={user ? "/course" : "/register"} className="btn-primary px-8! py-4! text-[17px]!">
            Start learning free
          </Link>
        </div>
      </section>
    </div>
  );
}
