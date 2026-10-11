import "server-only";
import { getDb } from "./db";
import { getAllModules } from "./content";

export type ProgressMap = Record<string, Set<string>>;

export function getProgress(userId: number): ProgressMap {
  const rows = getDb()
    .prepare("SELECT module_slug, lesson_slug FROM lesson_progress WHERE user_id = ?")
    .all(userId) as { module_slug: string; lesson_slug: string }[];
  const map: ProgressMap = {};
  for (const r of rows) (map[r.module_slug] ??= new Set()).add(r.lesson_slug);
  return map;
}

export function nextLesson(progress: ProgressMap): { module: string; lesson: string; title: string; moduleTitle: string } | null {
  for (const m of getAllModules()) {
    for (const l of m.lessons) {
      if (!progress[m.slug]?.has(l.slug)) {
        return { module: m.slug, lesson: l.slug, title: l.title, moduleTitle: m.title };
      }
    }
  }
  return null;
}
