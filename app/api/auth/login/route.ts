import { compare } from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { createSession, sessionCookie } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";

interface LoginUser extends RowDataPacket {
  id: number;
  password_hash: string;
}

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

function loginError(request: Request, message: string) {
  return NextResponse.redirect(
    new URL(
      `/login?error=${encodeURIComponent(message)}`,
      getBaseUrl(request)
    ),
    303
  );
}

export async function POST(request: Request) {
  const form = await request.formData();

  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/dashboard"));

  const ip = (
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
    .trim()
    .slice(0, 64);

  try {
    const db = getDb();

    const [attempts] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM auth_attempts
       WHERE success = FALSE
       AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
       AND (email = ? OR ip_address = ?)`,
      [email, ip]
    );

    if (Number(attempts[0]?.total ?? 0) >= 10) {
      return loginError(
        request,
        "Too many attempts. Wait 15 minutes and try again."
      );
    }

    const [rows] = await db.execute<LoginUser[]>(
      "SELECT id, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = rows[0];

    if (!user || !(await compare(password, user.password_hash))) {
      await db.execute(
        "INSERT INTO auth_attempts (email, ip_address, success) VALUES (?, ?, FALSE)",
        [email.slice(0, 190), ip]
      );

      return loginError(request, "Incorrect email or password.");
    }

    await db.execute(
      "INSERT INTO auth_attempts (email, ip_address, success) VALUES (?, ?, TRUE)",
      [email.slice(0, 190), ip]
    );

    const token = await createSession(user.id);

    const response = NextResponse.redirect(
      new URL(next, getBaseUrl(request)),
      303
    );

    response.cookies.set(sessionCookie(token));

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return loginError(
      request,
      "Login is temporarily unavailable because the database is not connected."
    );
  }
}