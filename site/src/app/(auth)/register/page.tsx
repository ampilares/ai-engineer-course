import Link from "next/link";
import { registerAction } from "../actions";

export const metadata = { title: "Register" };

const ERRORS: Record<string, string> = {
  invalid: "Please enter a valid name and email address.",
  terms: "You need to accept the terms to register.",
  rate: "Too many attempts: please wait a while and try again.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
      <p className="muted mb-8">
        Free forever. Your name and email are only used to track your progress and, if you
        choose, to recognize you on the graduates page.
      </p>
      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-bad/40 bg-bad/5 text-bad px-3 py-2 text-sm">
          {ERRORS[error] ?? "Something went wrong."}
        </p>
      )}
      <form action={registerAction} className="card p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Full name</label>
          <input id="name" name="name" required maxLength={80} className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="consent_listing" className="mt-1" />
          <span>List me on the public <Link className="text-accent underline" href="/graduates">graduates page</Link> when I finish the course (you can change this anytime).</span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" required className="mt-1" />
          <span>I accept the <Link className="text-accent underline" href="/privacy">privacy policy</Link>.</span>
        </label>
        <button type="submit" className="btn-primary w-full">Send me a sign-in link</button>
      </form>
      <p className="mt-4 text-sm muted">
        Already registered? <Link href="/signin" className="text-accent underline">Sign in</Link>
      </p>
    </div>
  );
}
