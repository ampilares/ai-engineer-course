import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCurrentUser } from "@/lib/auth";
import { getLessonSource, getModule, phaseColor } from "@/lib/content";
import { getProgress } from "@/lib/progress";
import { splitLesson } from "@/lib/steps";
import { mdxComponents } from "@/components/mdx-components";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export async function generateMetadata({ params }: { params: Promise<{ module: string; lesson: string }> }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const lesson = getModule(moduleSlug)?.lessons.find((l) => l.slug === lessonSlug);
  return { title: lesson?.title ?? "Lesson" };
}

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
  const done = user ? (getProgress(user.id)[mod.slug] ?? new Set<string>()) : new Set<string>();

  // Preview gating: anonymous visitors can try only the first lesson of each module.
  if (!user && idx > 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="text-5xl" aria-hidden>🔓</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-4 text-pretty">“{lesson.title}” is one click away</h1>
        <p className="muted mt-3 text-pretty">
          Create a free account to unlock every lesson, save your progress, and take the graded exams.
          Just a name and an email — no password.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary px-6! py-3!">Start free</Link>
          <Link href="/signin" className="btn-ghost px-6! py-3!">Sign in</Link>
        </div>
        <Link href={`/course/${mod.slug}`} className="inline-block mt-6 text-sm muted hover:text-ink">← Back to {mod.title}</Link>
      </div>
    );
  }

  const { steps, footer } = splitLesson(source);
  const next = mod.lessons[idx + 1];
  const nextHref = next ? `/course/${mod.slug}/${next.slug}` : `/course/${mod.slug}/exam`;
  const nextLabel = next ? `Next: ${next.title}` : "Take the module exam";

  return (
    <LessonPlayer
      steps={steps.map((s) => ({
        interactive: s.interactive,
        route: s.route,
        node: <MDXRemote source={s.source} components={mdxComponents} />,
      }))}
      footer={footer ? <MDXRemote source={footer} components={mdxComponents} /> : null}
      moduleSlug={mod.slug}
      moduleTitle={mod.title}
      lessonSlug={lesson.slug}
      lessonTitle={lesson.title}
      lessonNumber={idx + 1}
      lessonCount={mod.lessons.length}
      minutes={lesson.minutes}
      color={phaseColor(mod.phase, 0.55, 0.13)}
      nextHref={nextHref}
      nextLabel={nextLabel}
      alreadyDone={done.has(lesson.slug)}
      signedIn={!!user}
    />
  );
}
