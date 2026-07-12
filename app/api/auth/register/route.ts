import { hash } from "bcryptjs";
import type { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import { createSession, sessionCookie } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;
const fail = (request: Request, message: string) => NextResponse.redirect(new URL(`/register?error=${encodeURIComponent(message)}`, request.url), 303);

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 190);
  const password = String(form.get("password") ?? "");
  const confirmPassword = String(form.get("confirmPassword") ?? "");
  const role = String(form.get("role") ?? "").trim().slice(0, 80);
  const track = String(form.get("track") ?? "").trim().slice(0, 80);
  if (!name || !emailPattern.test(email)) return fail(request, "Enter a valid name and email address.");
  if (!strongPassword.test(password)) return fail(request, "Use 8+ characters with uppercase, lowercase, and a number.");
  if (password !== confirmPassword) return fail(request, "Passwords do not match.");
  if (form.get("terms") !== "on") return fail(request, "Please accept the Terms and Privacy Policy.");

  const db = getDb();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const passwordHash = await hash(password, 12);
    const [result] = await connection.execute<ResultSetHeader>("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, passwordHash]);
    await connection.execute("INSERT INTO profiles (user_id, role, track) VALUES (?, ?, ?)", [result.insertId, role || null, track || null]);
    const token = await createSession(result.insertId, connection);
    await connection.commit();
    const response = NextResponse.redirect(new URL("/dashboard?welcome=1", request.url), 303);
    response.cookies.set(sessionCookie(token));
    return response;
  } catch (error) {
    await connection.rollback();
    const code = (error as { code?: string }).code;
    return fail(request, code === "ER_DUP_ENTRY" ? "An account already exists for this email." : "Registration failed. Please try again.");
  } finally { connection.release(); }
}
