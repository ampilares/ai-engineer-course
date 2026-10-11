import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { attestAction } from "./actions";

export const metadata = { title: "Capstone attestation" };

const CHECKLIST = [
  "My capstone is a working system that runs end to end (not a notebook demo).",
  "It includes an evaluation set with measured results, including failure cases.",
  "Consequential actions require human approval or are otherwise guarded.",
  "I threat-modeled it: prompt injection, data exposure, and tool misuse are addressed.",
  "It is deployed (or deployable) with monitoring, cost/latency notes, and a rollback path.",
  "I can explain every design decision and at least one rejected alternative.",
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
        The final requirement for graduation. Build the production capstone described in{" "}
        <Link href="/course/expert-topics" className="text-accent underline">Module 15</Link>, then
        attest to it here on your honor. This is self-certified: it appears on your certificate, and
        your name stands behind it.
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
