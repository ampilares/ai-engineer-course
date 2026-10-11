import Link from "next/link";

export const metadata = { title: "Check your email" };

export default async function SentPage({
  searchParams,
}: {
  searchParams: Promise<{ dev?: string }>;
}) {
  const { dev } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Check your email</h1>
      <p className="muted">
        If that address is registered, a one-time sign-in link is on its way. It&apos;s valid for
        15 minutes.
      </p>
      {process.env.NODE_ENV !== "production" && dev && (
        <div className="card p-5 mt-6 border-amber-400/60">
          <p className="text-sm font-semibold mb-2">⚠ Development mode: no SMTP configured</p>
          <p className="text-sm muted mb-3">
            In production this link is emailed. For local testing, click it here:
          </p>
          <Link href={`/auth/verify?token=${encodeURIComponent(dev)}`} className="btn-primary">
            Open sign-in link
          </Link>
        </div>
      )}
    </div>
  );
}
