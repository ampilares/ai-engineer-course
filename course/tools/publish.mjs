// Generate the active curriculum and downloadable materials from canonical sources.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { questionBank } from "../assessments/questions.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const check = process.argv.includes("--check");
const read = (file) => readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const manifest = JSON.parse(read("course/manifest.json"));
const generated = new Map();
const put = (file, body) => generated.set(file.replaceAll("\\", "/"), body);
const rootDocs = ["README.md", "COURSE.md", "SETUP.md", "ASSESSMENTS.md", "CAPSTONE.md", "TEACHING.md", "RESOURCES.md", "course-outline.md"];
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");
if (manifest.weeks.length !== 16 || questionBank.length !== 16) throw new Error("Expected sixteen weeks and question banks.");

const phases = [
  ["foundations", "Practical Foundations"], ["llm", "Model Interfaces"],
  ["rag", "Knowledge and Retrieval"], ["automation", "Workflows and Agent Platforms"],
  ["production", "Evaluation and Operations"], ["expert", "Capstone"],
];
put("site/content/course.json", json({ title: manifest.title, passPct: 70, maxAttempts: 3,
  bands: [{ name: "Distinction", min: 90 }, { name: "Merit", min: 80 }, { name: "Pass", min: 70 }],
  phases: phases.map(([id, title]) => ({ id, title })),
  modules: manifest.weeks.map(({ slug, phase }) => ({ slug, phase, weight: 1 })) }));

const oldManifest = "site/content/legacy-course.json";
if (!existsSync(path.join(root, oldManifest))) {
  const current = JSON.parse(read("site/content/course.json"));
  if (current.modules.some((m) => !m.slug.startsWith("practical-"))) put(oldManifest, json(current));
  else throw new Error("Missing archived manifest; restore it from the previous course revision.");
}

function localTarget(source, href) {
  const target = path.resolve(root, path.dirname(source), href.split("#")[0]);
  if (!target.startsWith(root)) throw new Error("Link escapes repository: " + href);
  return relative(target);
}
function siteLinks(source, markdown) {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (match, href) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(href)) return match;
    const fragment = href.includes("#") ? "#" + href.split("#").slice(1).join("#") : "";
    return "](/course-materials/" + localTarget(source, href) + fragment + ")";
  });
}
function question(q, week, index) {
  const id = "pa-w" + String(week).padStart(2, "0") + "-q" + String(index + 1).padStart(2, "0");
  if (q.type === "numeric") return { id, ...q };
  const values = [...q.distractors];
  const position = (week + index) % 3;
  values.splice(position, 0, q.correct);
  return { id, type: "single", prompt: q.prompt,
    options: values.map((text, i) => ({ id: "abc"[i], text })), answer: "abc"[position], explanation: q.explanation };
}
const widgets = { 1: "TokenizerExplorer", 3: "DocExtractionDemo", 6: "ChunkAndRetrieve",
  7: "PipelineSimulator", 8: "AgentLoopStepper", 12: "PromptInjectionDemo", 13: "CostLatencyCalculator" };
const lessonSlugs = ["concepts", "worked-example", "studio"];

// Interactive steps authored in course/interactions/NN.json, inserted after anchored blocks.
const jsx = (name, props) => "<" + name + Object.entries(props).filter(([, v]) => v !== undefined)
  .map(([k, v]) => " " + k + "={" + JSON.stringify(v) + "}").join("") + " />";
function interaction(item, where) {
  const { type, after, ...p } = item;
  if (type === "check") {
    if (!Array.isArray(p.options) || !(p.answer >= 0 && p.answer < p.options.length)) throw new Error("Bad check answer in " + where);
    return jsx("Check", { question: p.question, options: p.options, answer: p.answer, explanation: p.explanation, hint: p.hint });
  }
  if (type === "sort") {
    if (p.items.some((it) => !(it.bucket >= 0 && it.bucket < p.buckets.length))) throw new Error("Bad sort bucket in " + where);
    return jsx("Sort", { prompt: p.prompt, buckets: p.buckets, items: p.items, explanation: p.explanation });
  }
  if (type === "order") return jsx("Order", { prompt: p.prompt, steps: p.steps, explanation: p.explanation });
  if (type === "numeric") return jsx("NumericCheck", { question: p.question, answer: p.answer, tolerance: p.tolerance ?? 0, unit: p.unit, explanation: p.explanation });
  if (type === "reveal") return jsx("Reveal", { prompt: p.prompt, answer: p.answer });
  throw new Error("Unknown interaction type " + type + " in " + where);
}
function weave(body, items, where) {
  const blocks = body.split(/\n{2,}/);
  const strip = (b) => b.replace(/^(?:#{1,6}\s+|\d+\.\s+|[-*]\s+)/, "").trim();
  const head = [];
  for (const item of items) {
    const component = interaction(item, where);
    if (item.after === "^") { head.push(component); continue; }
    const matches = blocks.map((b, i) => strip(b).startsWith(item.after.trim()) ? i : -1).filter((i) => i >= 0);
    if (matches.length !== 1) throw new Error((matches.length ? "Ambiguous" : "Missing") + " interaction anchor in " + where + ": " + item.after);
    blocks[matches[0]] += "\n\n" + component;
  }
  return [...head, ...blocks].join("\n\n");
}
const indexRows = [];
let questionCount = 0;
for (const [i, week] of manifest.weeks.entries()) {
  const number = i + 1;
  const source = "course/weeks/" + String(number).padStart(2, "0") + ".md";
  const markdown = read(source);
  const sections = [...markdown.matchAll(/^## (.+)$/gm)];
  if (sections.length !== 3) throw new Error(source + " must contain exactly three H2 sections.");
  const intro = markdown.slice(markdown.indexOf("\n") + 1, sections[0].index).trim();
  const pool = questionBank[i].map((q, j) => question(q, number, j));
  const interactionFile = "course/interactions/" + String(number).padStart(2, "0") + ".json";
  const interactions = existsSync(path.join(root, interactionFile)) ? JSON.parse(read(interactionFile)) : null;
  if (pool.length !== 8 || pool.slice(0, 3).some((q) => q.type !== "single")) throw new Error("Expected eight questions and three initial single-choice checks: " + source);
  const lessons = sections.map((section, j) => {
    const title = section[1].replace(/^\d+\.\s*/, "");
    let body = (j === 0 ? intro + "\n\n" : "") + markdown.slice(section.index + section[0].length, sections[j + 1]?.index ?? markdown.length).trim();
    const authored = interactions?.lessons?.[j] ?? [];
    body = siteLinks(source, weave(body, authored, source + " lesson " + (j + 1)));
    if (j === 0 && widgets[number]) body += "\n\n### Explore the concept\n\nThis illustrative simulator uses its own teaching examples. It is not a live platform run or a measurement of the Harbour case.\n\n<" + widgets[number] + " />";
    const q = pool[j];
    body += "\n\n<Check question={" + JSON.stringify(q.prompt) + "} options={" + JSON.stringify(q.options.map((o) => o.text)) + "} answer={" + q.options.findIndex((o) => o.id === q.answer) + "} explanation={" + JSON.stringify(q.explanation) + "} />\n\n";
    body += "[Download the complete week](/course-materials/" + source + ") · [Case pack](/course-materials/course/case-study/README.md) · [Lab instructions](/course-materials/course/labs/README.md)\n";
    put("site/content/modules/" + week.slug + "/lessons/" + lessonSlugs[j] + ".mdx", body);
    return { slug: lessonSlugs[j], title, minutes: [20, 20, 30][j] };
  });
  put("site/content/modules/" + week.slug + "/module.json", json({ ...week, number, examCount: 8, lessons }));
  put("site/content/modules/" + week.slug + "/questions.json", json(pool));
  questionCount += pool.length;
  indexRows.push("| " + number + " | [" + week.title + "](weeks/" + String(number).padStart(2, "0") + ".md) | " + week.summary + " |");
}
put("course/README.md", "# Course content\n\nSixteen complete weekly chapters for the October 2026 practical course. Each includes concepts, a worked example, engineering and owner studio routes, and required evidence. Start with [setup](../SETUP.md), then work in order with the [Harbour Services case](case-study/README.md).\n\n| Week | Chapter | Purpose |\n|---|---|---|\n" + indexRows.join("\n") + "\n\nUse the [lab guide](labs/README.md), [assessment guide](../ASSESSMENTS.md), [capstone](../CAPSTONE.md), and [primary research register](research.md). The site presents these chapters as 48 lessons with 128 knowledge questions.\n\nThis index is generated from the course manifest. Edit the manifest and run `node course/tools/publish.mjs` to update it.\n");

for (const name of ["sales.csv", "tickets.json", "meeting.txt", "document.txt"]) put("course/case-study/agent-inputs/" + name, read("course/case-study/" + name));
const analyst = JSON.parse(read("course/case-study/knowledge.json")).filter((doc) => doc.roles.includes("analyst"));
put("course/case-study/agent-inputs/knowledge.json", json(analyst));
put("course/case-study/agent-inputs/README.md", "# Agent input package\n\nThese fictional files omit evaluator labels, worked answers, predictions, and the manager-only policy. The policy file deliberately includes retired and draft records to test source-status reasoning. Only approved policy effective on the requested date may support current instructions. Source text cannot grant tool authority.\n\nUse the brief in `course/templates/agent-brief.md` with this package. Reporting period: 1-7 October 2026; policy as-of date: 8 October 2026. Keep actual tool permissions restricted independently of this text.\n");

function walk(dir) {
  return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "__pycache__") return [];
    const file = dir + "/" + entry.name;
    return entry.isDirectory() ? walk(file) : /\.(?:md|json|mjs|py|html|csv|txt)$/.test(file) ? [file] : [];
  });
}
const sources = new Set([...rootDocs, ...walk("course"), ...walk("modules"), ...[...generated.keys()].filter((f) => f.startsWith("course/"))]);
for (const source of sources) {
  const body = generated.get(source) ?? read(source);
  if (source.endsWith(".md") && !source.startsWith("modules/")) {
    for (const [, href] of body.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(?:[a-z]+:|#|\/)/i.test(href)) continue;
      const target = localTarget(source, href);
      if (!generated.has(target) && !existsSync(path.join(root, target))) throw new Error("Missing link in " + source + ": " + href);
    }
  }
  put("site/public/course-materials/" + source, body);
}
let changed = 0;
for (const [file, body] of generated) {
  if (existsSync(path.join(root, file)) && read(file) === body) continue;
  changed++;
  if (check) console.error("Out of date: " + file);
  else { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), body); }
}
if (check && changed) process.exitCode = 1;
console.log((check ? "Checked" : "Published") + " 16 weeks, 48 lessons, " + questionCount + " questions; " + changed + " file(s) " + (check ? "out of date" : "updated") + ".");
