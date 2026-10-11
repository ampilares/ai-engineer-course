export function LinkCard({
  href,
  title,
  source,
  why,
}: {
  href: string;
  title: string;
  source: string;
  why: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card p-4 my-3 flex items-start gap-3 no-underline hover:border-accent/60 transition-colors not-prose block"
    >
      <span aria-hidden className="text-xl leading-none mt-0.5">🔗</span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-xs muted mt-0.5">{source} · opens in a new tab</span>
        <span className="block text-sm muted mt-1">{why}</span>
      </span>
    </a>
  );
}

export function GoDeeper({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-10 not-prose">
      <h2 className="text-sm font-semibold uppercase tracking-wider muted mb-2">Go deeper (optional)</h2>
      {children}
    </section>
  );
}
