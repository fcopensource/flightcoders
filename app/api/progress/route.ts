import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { getDb } from "../../../lib/db";

interface ProgressRow extends RowDataPacket {
  completed_modules: number;
  total_modules: number;
  streak_days: number;
  minutes_this_week: number;
  projects_shipped: number;
}

async function readProgress(userId: number) {
  const db = getDb();
  await db.execute("INSERT IGNORE INTO learning_progress (user_id) VALUES (?)", [userId]);
  const [rows] = await db.execute<ProgressRow[]>("SELECT completed_modules, total_modules, streak_days, minutes_this_week, projects_shipped FROM learning_progress WHERE user_id=? LIMIT 1", [userId]);
  return rows[0];
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  return NextResponse.json({ progress: await readProgress(user.id) });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const body = await request.json().catch(() => null) as { action?: string } | null;
  if (body?.action !== "complete_module") return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  const db = getDb();
  await db.execute("INSERT IGNORE INTO learning_progress (user_id) VALUES (?)", [user.id]);
  await db.execute("UPDATE learning_progress SET completed_modules=LEAST(total_modules, completed_modules+1), minutes_this_week=minutes_this_week+35, streak_days=GREATEST(streak_days, 1) WHERE user_id=?", [user.id]);
  return NextResponse.json({ progress: await readProgress(user.id) });
}
