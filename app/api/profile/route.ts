import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { getDb } from "../../../lib/db";

export async function GET() {
  const user = await getCurrentUser();
  return user ? NextResponse.json({ profile: user }) : NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const body = await request.json().catch(() => null) as { name?: string; role?: string; track?: string; goal?: string } | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const name = String(body.name ?? user.name).trim().slice(0, 80);
  const role = String(body.role ?? user.role ?? "").trim().slice(0, 80);
  const track = String(body.track ?? user.track ?? "").trim().slice(0, 80);
  const goal = String(body.goal ?? user.goal ?? "").trim().slice(0, 1000);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const db = getDb();
  await db.execute("UPDATE users SET name=? WHERE id=?", [name, user.id]);
  await db.execute("INSERT INTO profiles (user_id, role, track, goal) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role=VALUES(role), track=VALUES(track), goal=VALUES(goal)", [user.id, role || null, track || null, goal || null]);
  return NextResponse.json({ ok: true });
}
