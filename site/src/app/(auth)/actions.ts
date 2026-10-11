"use server";

import { redirect } from "next/navigation";
import { getDb, rateLimit, type UserRow } from "@/lib/db";
import { createSigninToken, normalizeEmail } from "@/lib/auth";
import { baseUrl, mailConfigured, sendMail } from "@/lib/mail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function issueLink(user: UserRow): Promise<never> {
  const token = createSigninToken(user.id);
  const link = `${baseUrl()}/auth/verify?token=${token}`;
  await sendMail(
    user.email,
    "Your sign-in link: Practical AI Engineer",
    `Hi ${user.display_name},\n\nSign in here (valid 15 minutes):\n${link}\n\nIf you didn't request this, ignore this email.`,
    `<p>Hi ${user.display_name},</p><p><a href="${link}">Sign in to Practical AI Engineer</a> (valid 15 minutes).</p><p>If you didn't request this, ignore this email.</p>`
  );
  if (!mailConfigured()) {
    // Dev-mail mode: surface the link on screen so the flow is testable without SMTP.
    redirect(`/signin/sent?dev=${encodeURIComponent(token)}`);
  }
  redirect("/signin/sent");
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const email = normalizeEmail(String(formData.get("email") || ""));
  const consentListing = formData.get("consent_listing") === "on";
  const terms = formData.get("terms") === "on";

  if (!name || !EMAIL_RE.test(email)) redirect("/register?error=invalid");
  if (!terms) redirect("/register?error=terms");
  if (!rateLimit(`reg:${email}`, 3, 3600) || !rateLimit("reg:all", 100, 3600)) redirect("/register?error=rate");

  const d = getDb();
  d.prepare(
    "INSERT OR IGNORE INTO users (email, display_name, consent_public_listing) VALUES (?, ?, ?)"
  ).run(email, name, consentListing ? 1 : 0);
  const user = d.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow;
  await issueLink(user);
}

export async function signinAction(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") || ""));
  if (!EMAIL_RE.test(email)) redirect("/signin?error=invalid");
  if (!rateLimit(`signin:${email}`, 3, 3600)) redirect("/signin?error=rate");

  const user = getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  // Do not reveal whether the email exists.
  if (!user) redirect("/signin/sent");
  await issueLink(user);
}
