import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

let db: DatabaseSync | null = null;

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner',
  email_verified_at TEXT,
  consent_public_listing INTEGER NOT NULL DEFAULT 0,
  consent_show_score INTEGER NOT NULL DEFAULT 0,
  final_grade_pct REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS auth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, module_slug, lesson_slug)
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  question_set TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  score_pct REAL,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_module ON exam_attempts(user_id, module_slug);

CREATE TABLE IF NOT EXISTS attestations (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  payload TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS graduations (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  graduated_at TEXT NOT NULL DEFAULT (datetime('now')),
  grade_pct REAL NOT NULL,
  hidden_by_admin INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);
`;

export function getDb(): DatabaseSync {
  if (db) return db;
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });
  db = new DatabaseSync(path.join(dataDir, "app.db"));
  db.exec(SCHEMA);
  return db;
}

export type UserRow = {
  id: number;
  email: string;
  display_name: string;
  role: string;
  email_verified_at: string | null;
  consent_public_listing: number;
  consent_show_score: number;
  final_grade_pct: number | null;
  created_at: string;
};

/** Simple fixed-window rate limiter. Returns true if allowed. */
export function rateLimit(key: string, limit: number, windowSeconds: number): boolean {
  const d = getDb();
  const now = Math.floor(Date.now() / 1000);
  const row = d.prepare("SELECT window_start, count FROM rate_limits WHERE key = ?").get(key) as
    | { window_start: number; count: number }
    | undefined;
  if (!row || now - row.window_start >= windowSeconds) {
    // Opportunistically drop stale windows so the table can't grow unbounded.
    d.prepare("DELETE FROM rate_limits WHERE window_start < ?").run(now - 86400);
    d.prepare(
      "INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET window_start = ?, count = 1"
    ).run(key, now, now);
    return true;
  }
  if (row.count >= limit) return false;
  d.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").run(key);
  return true;
}
