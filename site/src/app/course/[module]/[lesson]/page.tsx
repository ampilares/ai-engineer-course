import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCurrentUser } from "@/lib/auth";
import { getLessonSource, getModule, getPhaseTitle, PHASE_COLORS } from "@/lib/content";
import { getProgress } from "@/lib/progress";
import { mdxComponents } from "@/components/mdx-components";
import { LessonInteractionsProvider } from "@/components/lesson/LessonInteractions";
import { CompleteLesson } from "@/components/lesson/CompleteLesson";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const mod = getModule(moduleSlug);
  if (!mod) notFound();
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1) notFound();
  const lesson = mod.lessons[idx];
  const source = getLessonSource(moduleSlug, lessonSlug);
  if (!source) notFound();

  const user = await getCurrentUser();
  const progress = user ? getProgress(user.id) : {};
  const done = progress[mod.slug] ?? new Set<string>();

  // Preview gating: anonymous visitors can read only the first lesson of each module.
  if (!user && idx > 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">“{lesson.title}” is one click away</h1>
        <p className="muted mt-3">
          Create a free account to unlock all lessons, save your progress, and take the graded exams.
          Just a name and an email: nothing else.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/register" className="btn-primary">Start free</Link>
          <Link href="/signin" className="btn-ghost">Sign in</Link>
        </div>
      </div>
    );
  }

  const prev = idx > 0 ? mod.lessons[idx - 1] : null;
  const next = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
  const nextHref = next ? `/course/${mod.slug}/${next.slug}` : `/course/${mod.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 flex gap-10">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20">
          <Link href={`/course/${mod.slug}`} className="text-[15px] font-extrabold"
            style={{ color: PHASE_COLORS[mod.phase] }}>
            ← {mod.title}
          </Link>
          <ol className="mt-4 space-y-1 text-sm">
            {mod.lessons.map((l, i) => (
              <li key={l.slug}>
                <Link href={`/course/${mod.slug}/${l.slug}`}
                  className={`flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 hover:bg-track transition-colors ${
                    l.slug === lessonSlug ? "font-bold bg-track text-ink" : done.has(l.slug) ? "muted" : "faint"}`}>
                  <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-extrabold shrink-0 ${
                    done.has(l.slug)
                      ? "bg-ok text-white"
                      : l.slug === lessonSlug
                        ? "text-white bg-phase-ml"
                        : "border-[1.5px] border-line-strong"}`}
                    style={l.slug === lessonSlug ? { background: PHASE_COLORS[mod.phase] } : undefined}>
                    {done.has(l.slug) ? "✓" : i + 1}
                  </span>
                  <span className="truncate">{l.title}</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link href={`/course/${mod.slug}/exam`}
            className="mt-2 pt-3.5 border-t border-dashed border-line flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm faint hover:text-ink transition-colors">
            <span className="w-5 h-5 rounded-full border-[1.5px] border-line-strong grid place-items-center text-[10px] shrink-0">★</span>
            Module exam
          </Link>
        </div>
      </aside>

      <article className="min-w-0 flex-1 max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] mb-1"
          style={{ color: PHASE_COLORS[mod.phase] }}>
          {getPhaseTitle(mod.phase)} · {lesson.minutes} min
        </p>
        <LessonInteractionsProvider>
          <div className="prose-custom">
            <h1>{lesson.title}</h1>
            <MDXRemote source={source} components={mdxComponents} />
          </div>
          <CompleteLesson
            moduleSlug={mod.slug}
            lessonSlug={lesson.slug}
            nextHref={nextHref}
            alreadyDone={done.has(lesson.slug)}
            signedIn={!!user}
          />
        </LessonInteractionsProvider>
        <nav className="mt-9 pt-5 border-t line flex items-center justify-between gap-4 text-[15px]">
          {prev ? (
            <Link href={`/course/${mod.slug}/${prev.slug}`} className="font-semibold muted hover:text-ink transition-colors truncate">
              ← {prev.title}
            </Link>
          ) : (
            <Link href={`/course/${mod.slug}`} className="font-semibold muted hover:text-ink transition-colors">
              ← Module overview
            </Link>
          )}
          {next ? (
            <Link href={`/course/${mod.slug}/${next.slug}`} className="font-semibold muted hover:text-ink transition-colors truncate text-right">
              {next.title} →
            </Link>
          ) : (
            <Link href={`/course/${mod.slug}/exam`} className="btn-primary shrink-0">Module exam →</Link>
          )}
        </nav>
      </article>
    </div>
  );
}
