import { compare } from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { createSession, sessionCookie } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";

interface LoginUser extends RowDataPacket { id: number; password_hash: string; }
const safeNext = (value: string) => value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/dashboard"));
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
  const db = getDb();
  const [attempts] = await db.execute<RowDataPacket[]>("SELECT COUNT(*) AS total FROM auth_attempts WHERE success=FALSE AND created_at>DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND (email=? OR ip_address=?)", [email, ip]);
  if (Number(attempts[0]?.total ?? 0) >= 10) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Too many attempts. Wait 15 minutes and try again.")}`, request.url), 303);
  const [rows] = await db.execute<LoginUser[]>("SELECT id, password_hash FROM users WHERE email=? LIMIT 1", [email]);
  const user = rows[0];
  if (!user || !(await compare(password, user.password_hash))) {
    await db.execute("INSERT INTO auth_attempts (email, ip_address, success) VALUES (?, ?, FALSE)", [email.slice(0, 190), ip]);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Incorrect email or password.")}`, request.url), 303);
  }
  await db.execute("INSERT INTO auth_attempts (email, ip_address, success) VALUES (?, ?, TRUE)", [email.slice(0, 190), ip]);
  const token = await createSession(user.id);
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(sessionCookie(token));
  return response;
}
