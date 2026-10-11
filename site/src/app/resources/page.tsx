export const metadata = { title: "Resources" };

const SECTIONS: { title: string; items: { name: string; href: string; why: string }[] }[] = [
  {
    title: "Course materials",
    items: [
      { name: "Complete course guide", href: "/course-materials/COURSE.md", why: "The 16-week sequence, outcomes, and engineering and owner routes." },
      { name: "Harbour Services case pack", href: "/course-materials/course/case-study/README.md", why: "Fictional task inputs, deliberate failure cases, and worked answers." },
      { name: "Agent input package", href: "/course-materials/course/case-study/agent-inputs/README.md", why: "Use these files with an agent; keep evaluator answers outside its context." },
      { name: "Reference lab instructions", href: "/course-materials/course/labs/README.md", why: "Run the offline reporting, retrieval, approval, and evaluation examples." },
      { name: "Open the review prototype", href: "/course-materials/course/labs/review-prototype.html", why: "Practise draft review and approval in a local simulation with no AI or network calls." },
      { name: "Assessment and capstone", href: "/course-materials/ASSESSMENTS.md", why: "Practical grading and progression gates, separate from site knowledge quizzes." },
      { name: "Primary-source research register", href: "/course-materials/course/research.md", why: "Documentation checked on 11 October 2026, with capability and research limitations." },
    ],
  },
  {
    title: "Tools, interfaces, and workflows",
    items: [
      { name: "Building effective agents", href: "https://www.anthropic.com/engineering/building-effective-agents", why: "Distinguish fixed workflows from agent-selected actions." },
      { name: "Codex learning resources", href: "https://developers.openai.com/learn/codex", why: "Working with a coding agent and reviewing its output." },
      { name: "Structured outputs", href: "https://developers.openai.com/api/docs/guides/structured-outputs", why: "JSON-schema interfaces and response failure handling." },
      { name: "Model Context Protocol", href: "https://modelcontextprotocol.io/docs/getting-started/intro", why: "Hosts, clients, servers, and tool integration." },
      { name: "n8n human review", href: "https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/", why: "Reviewing agent tool calls within an automation." },
    ],
  },
  {
    title: "Agent platforms",
    items: [
      { name: "OpenClaw getting started", href: "https://docs.openclaw.ai/start/getting-started", why: "Current setup requirements and gateway operation." },
      { name: "OpenClaw security audit", href: "https://docs.openclaw.ai/cli/security", why: "Inspect the configured access and security posture." },
      { name: "Hermes Agent quickstart", href: "https://hermes-agent.nousresearch.com/docs/getting-started/quickstart", why: "Set up the agent application and its provider." },
      { name: "Hermes memory", href: "https://hermes-agent.nousresearch.com/docs/user-guide/features/memory", why: "Check what persists across sessions and how to correct it." },
      { name: "Cursor Grok Bot", href: "https://cursor.com/docs/grok-bot", why: "The Grok Bot product studied in Week 11." },
      { name: "Grok Bot security", href: "https://cursor.com/docs/grok-bot/security", why: "Understand account-wide shared files, computer, and signed-in sessions." },
      { name: "Grok Bot model routing", href: "https://cursor.com/help/grok-bot/models", why: "Limits on model selection and visibility when comparing systems." },
    ],
  },
  {
    title: "Evaluation and operation",
    items: [
      { name: "Evaluation best practices", href: "https://developers.openai.com/api/docs/guides/evaluation-best-practices", why: "Plan representative cases and calibrate graders." },
      { name: "OWASP prompt injection", href: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/", why: "Understand instruction attacks and application boundaries." },
      { name: "Google SRE objectives", href: "https://sre.google/sre-book/service-level-objectives/", why: "Define useful service indicators, objectives, and measurement windows." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Resources</h1>
      <p className="muted mb-8 max-w-2xl">
        Course files and primary references for the practical curriculum. Markdown files can be
        saved locally. External services may require accounts or paid usage. Links open in a new tab.
      </p>
      <div className="space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-sm font-bold uppercase tracking-wider muted mb-3">{s.title}</h2>
            <div className="space-y-2">
              {s.items.map((r) => (
                <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer"
                  className="card p-3.5 block hover:border-accent/60 transition-colors">
                  <span className="font-medium">{r.name}</span>
                  <span className="block text-sm muted mt-0.5">{r.why}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
