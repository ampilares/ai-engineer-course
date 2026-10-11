/**
 * Splits a lesson's MDX source into short, one-screen "steps" for the
 * Brilliant-style lesson player. Splitting happens on block boundaries
 * (blank lines outside fenced code) so every step is valid MDX on its own.
 */

export type Route = "eng" | "owner";

export type LessonStep = {
  source: string;
  /** Step ends in something the learner must answer before continuing. */
  interactive: boolean;
  /** Step belongs to one route of the studio (engineering or business owner). */
  route?: Route;
  /** Nearest heading, used as a small label above the step. */
  label?: string;
};

export type SplitLesson = { steps: LessonStep[]; footer: string | null };

const INTERACTIVE = /^<(Check|Sort|Order|NumericCheck|Reveal)\b/;
const COMPONENT = /^<[A-Z]/;
const FOOTER = /^\[Download the complete week\]/;
const PROSE_BUDGET = 650;

function blocks(source: string): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  let fenced = false;
  for (const line of source.replace(/\r\n/g, "\n").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (!fenced && line.trim() === "") {
      if (cur.length) out.push(cur.join("\n"));
      cur = [];
    } else cur.push(line);
  }
  if (cur.length) out.push(cur.join("\n"));
  return out;
}

function routeOf(heading: string): Route | undefined {
  if (/^engineering route$/i.test(heading)) return "eng";
  if (/^business[- ]owner route$/i.test(heading)) return "owner";
  return undefined;
}

export function splitLesson(source: string): SplitLesson {
  const steps: LessonStep[] = [];
  let footer: string | null = null;
  let cur: string[] = [];
  let prose = 0;
  let label: string | undefined;
  let route: Route | undefined;

  const push = (interactive: boolean) => {
    if (!cur.length) return;
    steps.push({ source: cur.join("\n\n"), interactive, route, label });
    cur = [];
    prose = 0;
  };

  for (const block of blocks(source)) {
    const trimmed = block.trim();
    if (FOOTER.test(trimmed)) {
      footer = trimmed;
      continue;
    }
    const heading = /^#{1,6}\s+(.+)$/.exec(trimmed.split("\n")[0]);
    if (heading && !trimmed.includes("\n")) {
      push(false);
      label = heading[1].trim();
      // Any heading other than a route heading ends the current route section.
      route = routeOf(label);
      // Route headings are shown by the route switcher, not repeated as prose.
      if (!routeOf(label)) cur.push(trimmed);
      continue;
    }
    if (INTERACTIVE.test(trimmed)) {
      cur.push(trimmed);
      push(true);
      continue;
    }
    if (COMPONENT.test(trimmed)) {
      cur.push(trimmed);
      push(false);
      continue;
    }
    if (prose > 0 && prose + trimmed.length > PROSE_BUDGET) push(false);
    cur.push(trimmed);
    prose += trimmed.length;
  }
  push(false);

  // Fold a very short trailing prose step into its predecessor.
  const last = steps[steps.length - 1];
  const prev = steps[steps.length - 2];
  if (last && prev && !last.interactive && !prev.interactive && last.route === prev.route && last.source.length < 160) {
    prev.source += "\n\n" + last.source;
    steps.pop();
  }
  return { steps, footer };
}
