import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAllModules, getCourse, phaseColor } from "@/lib/content";
import { getProgress, nextLesson } from "@/lib/progress";
import { Sort } from "@/components/lesson/Interactions";

export default async function LandingPage() {
  const user = await getCurrentUser();
  const modules = getAllModules();
  const course = getCourse();
  const cont = user ? nextLesson(getProgress(user.id)) : null;
  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  const phases = course.phases
    .map((p) => ({ ...p, modules: modules.filter((m) => m.phase === p.id) }))
    .filter((p) => p.modules.length);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-14 grid lg:grid-cols-[1fr_480px] gap-10 lg:gap-14 items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-tint text-accent px-3 py-1 text-[13px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden /> Free · {modules.length} weeks · October 2026 edition
          </p>
          <h1 className="mt-5 text-[38px] sm:text-[54px] font-extrabold tracking-tighter leading-[1.04] text-pretty">
            Make AI do useful work you can{" "}
            <span className="whitespace-nowrap" style={{ background: "linear-gradient(transparent 62%, #FBDC8E 62%)" }}>actually trust</span>.
          </h1>
          <p className="mt-5 text-[18px] sm:text-[19px] leading-relaxed muted max-w-[540px] text-pretty">
            Short, interactive lessons that take you from everyday AI tasks to tested apps, automated
            workflows, and supervised agents — for engineers and business owners alike.
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            {user ? (
              cont ? (
                <Link href={`/course/${cont.module}/${cont.lesson}`} className="btn-primary px-6! py-3.5! text-base! max-w-full">
                  <span className="truncate">Continue: {cont.title}</span> →
                </Link>
              ) : (
                <Link href="/course" className="btn-primary px-6! py-3.5! text-base!">Open the course</Link>
              )
            ) : (
              <>
                <Link href="/course/practical-foundations/concepts" className="btn-primary px-6! py-3.5! text-base!">
                  Try the first lesson
                </Link>
                <Link href="/course" className="btn-ghost px-6! py-3.5! text-base!">See the course map</Link>
              </>
            )}
          </div>
          <p className="mt-4 text-sm faint">
            {lessonCount} lessons · 200+ interactive steps · no password, just your email
          </p>
        </div>

        <div className="relative">
          <span aria-hidden className="absolute w-[54px] h-[54px] rounded-[14px] -top-5 -right-2 rotate-12 animate-[floaty_5s_ease-in-out_infinite] hidden sm:block" style={{ background: "oklch(0.7 0.13 70)" }} />
          <span aria-hidden className="absolute w-[34px] h-[34px] rounded-full -bottom-3 -left-3 animate-[floaty_6s_ease-in-out_1s_infinite] hidden sm:block" style={{ background: "oklch(0.6 0.13 145)" }} />
          <div className="relative [&_.interaction]:my-0 [&_.interaction]:shadow-[0_24px_60px_rgba(38,32,25,0.12)]">
            <Sort
              prompt="Try one: who should handle each part of Harbour's weekly report?"
              buckets={["Plain code", "AI model", "Permissions"]}
              items={[
                { text: "Add up this week's transactions", bucket: 0 },
                { text: "Tell if a mixed request is billing or scheduling", bucket: 1 },
                { text: "Decide who may issue a refund", bucket: 2 },
                { text: "Count tickets per category", bucket: 0 },
                { text: "Draft a polite reply for review", bucket: 1 },
              ]}
              explanation="Give fully specified calculations to code, use a model where language must be interpreted, and enforce authority in application permissions — a smarter model doesn't remove these distinctions."
            />
          </div>
        </div>
      </section>

      {/* How a lesson works */}
      <section className="border-y line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-center">Learn by doing, one step at a time</h2>
          <p className="muted text-center mt-2 max-w-xl mx-auto">Every lesson is a sequence of bite-sized steps. You read a little, then you try it.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { icon: "◐", t: "Bite-sized steps", d: "Ideas arrive a paragraph or two at a time, so nothing overwhelms." },
              { icon: "⇄", t: "Hands-on checks", d: "Sort, order, calculate, and predict — with instant feedback and explanations." },
              { icon: "⚙", t: "Two routes", d: "Switch between engineering and business-owner exercises in every studio." },
              { icon: "★", t: "Real evidence", d: "Graded exams, a working capstone, and a verifiable certificate." },
            ].map((f) => (
              <div key={f.t} className="card p-5">
                <span className="w-11 h-11 rounded-xl bg-accent-tint text-accent grid place-items-center text-lg font-bold" aria-hidden>{f.icon}</span>
                <h3 className="font-bold text-[17px] mt-3.5">{f.t}</h3>
                <p className="mt-1.5 text-[15px] muted leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Path */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
          <div>
            <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight">From first task to working system</h2>
            <p className="muted mt-1.5">Six stages over {modules.length} weeks, ending in a three-week capstone.</p>
          </div>
          <Link href="/course" className="text-[15px] font-semibold text-accent hover:text-accent-deep">Full course map →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((p, i) => {
            const col = phaseColor(p.id, 0.55, 0.13);
            return (
              <div key={p.id} className="card p-5 relative overflow-hidden">
                <span aria-hidden className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-15" style={{ background: col }} />
                <p className="kicker" style={{ color: col }}>Stage {i + 1}</p>
                <h3 className="font-extrabold text-lg mt-1">{p.title}</h3>
                <ul className="mt-3 grid gap-1.5">
                  {p.modules.map((m) => (
                    <li key={m.slug}>
                      <Link href={`/course/${m.slug}`} className="flex items-baseline gap-2 text-[15px] hover:text-accent group">
                        <span className="text-xs font-bold tabular-nums faint w-6 shrink-0">W{m.number}</span>
                        <span className="group-hover:underline underline-offset-2">{m.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Routes */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6 sm:p-7">
            <p className="kicker text-accent!">⚙ Engineering route</p>
            <h3 className="text-xl font-extrabold mt-2">Implement, test, deploy</h3>
            <p className="muted mt-2 leading-relaxed">For software, data and systems engineers. Typed interfaces, automated tests, retrieval evaluation, bounded tools and an operational runbook. About 8–10 hours a week.</p>
          </div>
          <div className="card p-6 sm:p-7">
            <p className="kicker" style={{ color: phaseColor("production", 0.55, 0.14) }}>◆ Business-owner route</p>
            <h3 className="text-xl font-extrabold mt-2">Specify, evaluate, adopt</h3>
            <p className="muted mt-2 leading-relaxed">For owners, founders and managers. Process design, vendor assessment, acceptance testing, staff training and an evidence-based adoption decision. About 5–7 hours a week.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <div className="rounded-[28px] bg-[#262019] text-[#FBF8F2] px-6 py-12 sm:px-12 text-center">
          <h2 className="text-[28px] sm:text-[36px] font-extrabold tracking-tight">Start with a five-minute lesson.</h2>
          <p className="mt-3 mx-auto max-w-[480px] text-[17px] text-[#B9B0A0] leading-relaxed">
            The first lesson of every week is open to try. Sign up free to save progress, take the exams ({course.passPct}% to pass) and earn your certificate.
          </p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Link href={user ? "/course" : "/register"} className="btn-primary px-8! py-4! text-[17px]!">
              {user ? "Go to the course" : "Start learning free"}
            </Link>
            {!user && <Link href="/placement" className="btn-ghost px-6! py-4! text-[17px]! text-[#FBF8F2]! border-[#5a5246]! hover:border-[#FBF8F2]!">Take the placement quiz</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
