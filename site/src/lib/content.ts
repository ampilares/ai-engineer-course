import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PhaseId =
  | "onramp"
  | "foundations"
  | "ml"
  | "llm"
  | "rag"
  | "automation"
  | "production"
  | "expert"
  | "career";

export type CourseManifest = {
  title: string;
  phases: { id: PhaseId; title: string }[];
  passPct: number;
  maxAttempts: number;
  bands: { name: string; min: number }[];
  modules: { slug: string; phase: PhaseId; weight: number }[];
};

export type LessonMeta = { slug: string; title: string; minutes: number };

export type ModuleMeta = {
  slug: string;
  number: number;
  title: string;
  phase: PhaseId;
  summary: string;
  outcomes: string[];
  examCount: number;
  lessons: LessonMeta[];
};

export type Question =
  | {
      id: string;
      type: "single";
      prompt: string;
      code?: string;
      options: { id: string; text: string }[];
      answer: string;
      explanation: string;
    }
  | {
      id: string;
      type: "multi";
      prompt: string;
      code?: string;
      options: { id: string; text: string }[];
      answer: string[];
      explanation: string;
    }
  | {
      id: string;
      type: "numeric";
      prompt: string;
      code?: string;
      answer: number;
      tolerance: number;
      unit?: string;
      explanation: string;
    }
  | {
      id: string;
      type: "short";
      prompt: string;
      code?: string;
      accept: string[];
      explanation: string;
    };

/** Read a UTF-8 file, tolerating a leading BOM (Windows editors add them). */
function readText(file: string): string {
  const raw = readFileSync(file, "utf8");
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

let courseCache: CourseManifest | null = null;
const moduleCache = new Map<string, ModuleMeta>();
const poolCache = new Map<string, Question[]>();
const isProd = process.env.NODE_ENV === "production";

export function getCourse(): CourseManifest {
  if (isProd && courseCache) return courseCache;
  const c = JSON.parse(readText(path.join(CONTENT_DIR, "course.json"))) as CourseManifest;
  courseCache = c;
  return c;
}

export function getModuleSlugs(): string[] {
  return getCourse().modules.map((m) => m.slug);
}

export function getModule(slug: string): ModuleMeta | null {
  if (isProd && moduleCache.has(slug)) return moduleCache.get(slug)!;
  const file = path.join(CONTENT_DIR, "modules", slug, "module.json");
  if (!existsSync(file)) return null;
  const m = JSON.parse(readText(file)) as ModuleMeta;
  moduleCache.set(slug, m);
  return m;
}

export function getAllModules(): ModuleMeta[] {
  return getModuleSlugs()
    .map((s) => getModule(s))
    .filter((m): m is ModuleMeta => m !== null);
}

export function getLessonSource(moduleSlug: string, lessonSlug: string): string | null {
  if (!/^[a-z0-9-]+$/.test(moduleSlug) || !/^[a-z0-9-]+$/.test(lessonSlug)) return null;
  const file = path.join(CONTENT_DIR, "modules", moduleSlug, "lessons", `${lessonSlug}.mdx`);
  if (!existsSync(file)) return null;
  return readText(file);
}

export function getQuestionPool(moduleSlug: string): Question[] {
  if (isProd && poolCache.has(moduleSlug)) return poolCache.get(moduleSlug)!;
  const file = path.join(CONTENT_DIR, "modules", moduleSlug, "questions.json");
  if (!existsSync(file)) return [];
  const pool = JSON.parse(readText(file)) as Question[];
  poolCache.set(moduleSlug, pool);
  return pool;
}

export function getPhaseTitle(id: PhaseId): string {
  return getCourse().phases.find((p) => p.id === id)?.title ?? id;
}

/* Per-phase hue (oklch), matching the design system's phase palette. */
export const PHASE_HUES: Record<PhaseId, number> = {
  onramp: 210,
  foundations: 175,
  ml: 300,
  llm: 70,
  rag: 250,
  automation: 145,
  production: 25,
  expert: 285,
  career: 330,
};

export function phaseColor(id: PhaseId, l = 0.5, c = 0.12): string {
  return `oklch(${l} ${c} ${PHASE_HUES[id]})`;
}

export const PHASE_COLORS: Record<PhaseId, string> = Object.fromEntries(
  (Object.keys(PHASE_HUES) as PhaseId[]).map((id) => [id, phaseColor(id)]),
) as Record<PhaseId, string>;
