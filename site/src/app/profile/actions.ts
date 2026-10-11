"use server";

import { redirect } from "next/navigation";
import { destroySession, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function updateProfileAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const listing = formData.get("consent_listing") === "on" ? 1 : 0;
  const showScore = formData.get("consent_score") === "on" ? 1 : 0;
  if (!name) redirect("/profile");
  getDb()
    .prepare(
      "UPDATE users SET display_name = ?, consent_public_listing = ?, consent_show_score = ? WHERE id = ?"
    )
    .run(name, listing, showScore, user.id);
  redirect("/profile?saved=1");
}

export async function signoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (String(formData.get("confirm") || "") !== "DELETE") redirect("/profile?error=confirm");
  getDb().prepare("DELETE FROM users WHERE id = ?").run(user.id);
  await destroySession();
  redirect("/?deleted=1");
}
