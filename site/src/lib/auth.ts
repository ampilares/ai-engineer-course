import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { getDb, type UserRow } from "./db";

const SESSION_COOKIE = "paie_session";
const SESSION_DAYS = 30;
const TOKEN_MINUTES = 15;

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function isoIn(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Create a single-use sign-in token for a user; returns the raw token for the magic link. */
export function createSigninToken(userId: number): string {
  const raw = randomBytes(32).toString("base64url");
  const d = getDb();
  d.prepare("DELETE FROM auth_tokens WHERE expires_at < datetime('now') OR consumed_at IS NOT NULL").run();
  d.prepare("INSERT INTO auth_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
    .run(userId, sha256(raw), isoIn(TOKEN_MINUTES * 60 * 1000));
  return raw;
}

/** Consume a sign-in token. Returns the user id if valid, else null. */
export function consumeSigninToken(raw: string): number | null {
  const d = getDb();
  const row = d
    .prepare("SELECT id, user_id, expires_at, consumed_at FROM auth_tokens WHERE token_hash = ?")
    .get(sha256(raw)) as { id: number; user_id: number; expires_at: string; consumed_at: string | null } | undefined;
  if (!row || row.consumed_at || new Date(row.expires_at).getTime() < Date.now()) return null;
  d.prepare("UPDATE auth_tokens SET consumed_at = datetime('now') WHERE id = ?").run(row.id);
  d.prepare("UPDATE users SET email_verified_at = COALESCE(email_verified_at, datetime('now')) WHERE id = ?").run(
    row.user_id
  );
  return row.user_id;
}

export async function createSession(userId: number): Promise<void> {
  const raw = randomBytes(32).toString("base64url");
  const d = getDb();
  d.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  d.prepare("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
    .run(userId, sha256(raw), isoIn(SESSION_DAYS * 24 * 3600 * 1000));
  const jar = await cookies();
  jar.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 3600,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(raw));
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<UserRow | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const row = getDb()
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > datetime('now')`
    )
    .get(sha256(raw)) as UserRow | undefined;
  return row ?? null;
}

export async function requireUser(): Promise<UserRow> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}
