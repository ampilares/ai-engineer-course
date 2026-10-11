import { NextRequest, NextResponse } from "next/server";
import { consumeSigninToken, createSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // In production BASE_URL is set explicitly (correct scheme/host behind the
  // proxy); in dev, fall back to whatever origin the request actually used.
  const base = process.env.BASE_URL || req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("token");
  const userId = token ? consumeSigninToken(token) : null;
  if (!userId) {
    return NextResponse.redirect(new URL("/signin?error=badtoken", base));
  }
  await createSession(userId);
  return NextResponse.redirect(new URL("/course", base));
}
