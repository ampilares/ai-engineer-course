export const metadata = { title: "Resources" };

const SECTIONS: { title: string; items: { name: string; href: string; why: string }[] }[] = [
  {
    title: "Foundations & Python",
    items: [
      { name: "Automate the Boring Stuff with Python", href: "https://automatetheboringstuff.com/", why: "Free book that turns Python basics into useful programs." },
      { name: "Kaggle Learn: Python", href: "https://www.kaggle.com/learn/python", why: "Interactive notebook drills for extra reps." },
      { name: "The Missing Semester", href: "https://missing.csail.mit.edu/", why: "Shell, Git, and editor fluency from MIT." },
      { name: "SQLite Tutorial", href: "https://www.sqlitetutorial.net/", why: "Hands-on SQL against the engine this course uses." },
    ],
  },
  {
    title: "Math & Machine Learning",
    items: [
      { name: "3Blue1Brown: Essence of Linear Algebra", href: "https://www.3blue1brown.com/topics/linear-algebra", why: "The visual intuition behind vectors and matrices." },
      { name: "Seeing Theory", href: "https://seeing-theory.brown.edu/", why: "Beautiful interactive probability and statistics." },
      { name: "Google ML Crash Course", href: "https://developers.google.com/machine-learning/crash-course", why: "Free, exercise-driven classical ML." },
      { name: "fast.ai: Practical Deep Learning", href: "https://course.fast.ai/", why: "The best free hands-on deep learning course." },
      { name: "scikit-learn User Guide", href: "https://scikit-learn.org/stable/user_guide.html", why: "A reference that doubles as an ML textbook." },
    ],
  },
  {
    title: "LLMs & Transformers",
    items: [
      { name: "3Blue1Brown: Neural Networks & Transformers", href: "https://www.3blue1brown.com/topics/neural-networks", why: "The visual series behind Modules 6–7." },
      { name: "Karpathy: Neural Networks Zero to Hero", href: "https://karpathy.ai/zero-to-hero.html", why: "Build tokenizers, backprop, and GPT from scratch: the expert route." },
      { name: "The Illustrated Transformer", href: "https://jalammar.github.io/illustrated-transformer/", why: "The classic visual walkthrough of attention." },
      { name: "Hugging Face LLM Course", href: "https://huggingface.co/learn/llm-course/chapter1/1", why: "Free transformers/NLP course with runnable code." },
      { name: "Stanford CS336: Language Modeling from Scratch", href: "https://cs336.stanford.edu/", why: "Implementation-heavy expert route for Module 7." },
    ],
  },
  {
    title: "Building with LLMs",
    items: [
      { name: "Anthropic: Building Effective Agents", href: "https://www.anthropic.com/engineering/building-effective-agents", why: "The workflow-vs-agent taxonomy Module 10 teaches." },
      { name: "Prompt Engineering Guide", href: "https://www.promptingguide.ai/", why: "Provider-neutral survey with research references." },
      { name: "Model Context Protocol", href: "https://modelcontextprotocol.io/", why: "The tool-integration standard: build one small server." },
      { name: "Pydantic docs", href: "https://docs.pydantic.dev/latest/", why: "The validation library at the center of structured outputs." },
      { name: "Ollama", href: "https://github.com/ollama/ollama", why: "Run open models locally for free lab work." },
    ],
  },
  {
    title: "Evaluation, Safety & Production",
    items: [
      { name: "Hamel Husain: Your AI Product Needs Evals", href: "https://hamel.dev/blog/posts/evals/", why: "The essay that made eval discipline standard practice." },
      { name: "Ragas", href: "https://docs.ragas.io/", why: "Open-source RAG evaluation framework." },
      { name: "Langfuse", href: "https://langfuse.com/docs", why: "Self-hostable LLM tracing and cost tracking." },
      { name: "OWASP Top 10 for LLM Applications", href: "https://genai.owasp.org/llm-top-10/", why: "The standard AI-security taxonomy behind Module 15." },
      { name: "Simon Willison: Prompt injection series", href: "https://simonwillison.net/series/prompt-injection/", why: "The clearest chronicle of the attack class." },
      { name: "Google SRE Book", href: "https://sre.google/sre-book/table-of-contents/", why: "SLOs, error budgets, and postmortems: Module 16's backbone." },
      { name: "n8n docs & courses", href: "https://docs.n8n.io/", why: "The self-hostable workflow tool for Module 13 labs." },
    ],
  },
  {
    title: "Staying Current",
    items: [
      { name: "Anthropic Engineering blog", href: "https://www.anthropic.com/engineering", why: "Primary-source applied technique." },
      { name: "Simon Willison's blog", href: "https://simonwillison.net/", why: "Hype-resistant running commentary on applied LLMs." },
      { name: "Artificial Analysis", href: "https://artificialanalysis.ai/", why: "Independent cross-provider price/latency/quality benchmarks." },
      { name: "The Pragmatic Engineer", href: "https://newsletter.pragmaticengineer.com/", why: "How engineering careers and hiring actually work." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Resources</h1>
      <p className="muted mb-8 max-w-2xl">
        The best free external material, curated per phase. Everything here is optional: lessons are
        self-contained, but these are the places to go deeper. All links open in a new tab.
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
