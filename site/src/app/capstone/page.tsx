import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { attestAction } from "./actions";

export const metadata = { title: "Capstone attestation" };

const CHECKLIST = [
  "My capstone is a working application, workflow, or configured assistant with reproducible setup.",
  "It includes at least 20 development and 10 held-out cases, with results and failure evidence.",
  "I demonstrated enforced action boundaries, review, and no unauthorised actions in the required tests.",
  "I tested misleading inputs, restricted access, and tool misuse, and documented remaining limits.",
  "It has an owner, cost and quality evidence, a tested runbook, and a working manual fallback.",
  "I can explain the implementation and distinguish measured results from simulations.",
];

export default async function CapstonePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const existing = getDb()
    .prepare("SELECT payload, submitted_at FROM attestations WHERE user_id = ?")
    .get(user.id) as { payload: string; submitted_at: string } | undefined;
  const payload = existing ? (JSON.parse(existing.payload) as { title?: string; summary?: string; url?: string }) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Capstone attestation</h1>
      <p className="muted mb-6">
        Complete the capstone beginning in{" "}
        <Link href="/course/practical-capstone-build" className="text-accent underline">Week 14</Link>,
        then record your declaration here. This self-attestation contributes to the site completion
        record. It does not replace independent assessment of the practical course rubric.
      </p>
      {existing && (
        <div className="card p-4 mb-6 border-ok/50 text-sm">
          ✓ Submitted on {existing.submitted_at?.slice(0, 10)}: <strong>{payload?.title}</strong>. You can update it below.
        </div>
      )}
      <form action={attestAction} className="card p-6 space-y-4">
        <fieldset className="space-y-2">
          <legend className="font-medium mb-1">I confirm that:</legend>
          {CHECKLIST.map((item, i) => (
            <label key={i} className="flex items-start gap-2 text-sm">
              <input type="checkbox" name={`check_${i}`} required defaultChecked={!!existing} className="mt-1" />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Project title</label>
          <input id="title" name="title" required maxLength={120} defaultValue={payload?.title ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-1">What it does (2–3 sentences)</label>
          <textarea id="summary" name="summary" required maxLength={600} rows={3}
            defaultValue={payload?.summary ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">Repo or demo URL (optional)</label>
          <input id="url" name="url" type="url" maxLength={300} defaultValue={payload?.url ?? ""} className="input" />
        </div>
        <button type="submit" className="btn-primary w-full">
          {existing ? "Update attestation" : "Submit attestation"}
        </button>
      </form>
    </div>
  );
}
