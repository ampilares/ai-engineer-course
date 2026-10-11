"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { refreshGradeAndGraduation } from "@/lib/grading";

export async function attestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const summary = String(formData.get("summary") || "").trim().slice(0, 600);
  const url = String(formData.get("url") || "").trim().slice(0, 300);
  for (let i = 0; i < 6; i++) {
    if (formData.get(`check_${i}`) !== "on") redirect("/capstone");
  }
  if (!title || !summary) redirect("/capstone");

  getDb()
    .prepare(
      `INSERT INTO attestations (user_id, payload) VALUES (?, ?)
       ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, submitted_at = datetime('now')`
    )
    .run(user.id, JSON.stringify({ title, summary, url }));

  const certId = refreshGradeAndGraduation(user.id);
  redirect(certId ? `/certificate/${certId}` : "/profile?attested=1");
}
