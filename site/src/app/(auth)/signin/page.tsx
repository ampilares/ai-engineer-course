import Link from "next/link";
import { signinAction } from "../actions";

export const metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  invalid: "Please enter a valid email address.",
  rate: "Too many attempts: please wait a while and try again.",
  badtoken: "That sign-in link is invalid or has expired. Request a new one below.",
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Sign in</h1>
      <p className="muted mb-8">We&apos;ll email you a one-time sign-in link. No passwords.</p>
      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-bad/40 bg-bad/5 text-bad px-3 py-2 text-sm">
          {ERRORS[error] ?? "Something went wrong."}
        </p>
      )}
      <form action={signinAction} className="card p-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
        <button type="submit" className="btn-primary w-full">Send sign-in link</button>
      </form>
      <p className="mt-4 text-sm muted">
        New here? <Link href="/register" className="text-accent underline">Create an account</Link>
      </p>
    </div>
  );
}
