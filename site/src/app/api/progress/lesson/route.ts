import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getModule } from "@/lib/content";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  let body: { module?: string; lesson?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const mod = body.module ? getModule(body.module) : null;
  const lesson = mod?.lessons.find((l) => l.slug === body.lesson);
  if (!mod || !lesson) return NextResponse.json({ error: "unknown lesson" }, { status: 400 });
  getDb()
    .prepare(
      "INSERT OR IGNORE INTO lesson_progress (user_id, module_slug, lesson_slug) VALUES (?, ?, ?)"
    )
    .run(user.id, mod.slug, lesson.slug);
  return NextResponse.json({ ok: true });
}
