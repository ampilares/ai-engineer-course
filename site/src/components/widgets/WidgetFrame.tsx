"use client";

export function WidgetFrame({
  title,
  onReset,
  children,
  srSummary,
}: {
  title: string;
  onReset?: () => void;
  children: React.ReactNode;
  srSummary?: string;
}) {
  return (
    <section className="widget-frame not-prose" aria-label={title}>
      <div className="widget-title">
        <span>Try it — {title}</span>
        <span className="flex items-center gap-2 normal-case tracking-normal">
          {onReset && (
            <button type="button" onClick={onReset} className="text-xs underline muted cursor-pointer font-medium">
              reset
            </button>
          )}
          <span className="text-xs bg-accent-tint text-accent px-2.5 py-0.5 rounded-full font-semibold">live</span>
        </span>
      </div>
      {srSummary && <p className="sr-only">{srSummary}</p>}
      {children}
    </section>
  );
}
