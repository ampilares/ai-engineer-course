// Promote a user to admin: node scripts/make-admin.mjs you@example.com
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const email = process.argv[2];
if (!email) { console.error("Usage: node scripts/make-admin.mjs <email>"); process.exit(1); }
const dbPath = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "app.db");
const db = new DatabaseSync(dbPath);
const res = db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(email.toLowerCase());
console.log(res.changes ? `✓ ${email} is now an admin.` : `No user found with email ${email}.`);
