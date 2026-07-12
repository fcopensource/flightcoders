import { compare } from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

import { createSession, sessionCookie } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";

interface LoginUser extends RowDataPacket {
  id: number;
  password_hash: string;
  email_verified_at: Date | null;
}

function getPublicOrigin(request: Request): string {
  const configuredUrl =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost) {
    return `${forwardedProtocol || "https"}://${forwardedHost}`;
  }

  const requestUrl = new URL(request.url);

  if (
    process.env.NODE_ENV === "production" &&
    ["0.0.0.0", "localhost", "127.0.0.1"].includes(requestUrl.hostname)
  ) {
    return "https://flightcoders.com";
  }

  return requestUrl.origin;
}

function getSafeDestination(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function redirectWithError(request: Request, message: string) {
  const url = new URL("/login", getPublicOrigin(request));
  url.searchParams.set("error", message);

  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 190);

    const password = String(form.get("password") ?? "");

    const destination = getSafeDestination(
      String(form.get("next") ?? "/dashboard")
    );

    if (!email || !password) {
      return redirectWithError(
        request,
        "Enter your email address and password."
      );
    }

    const forwardedIp = request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();

    const ipAddress = (
      forwardedIp ||
      request.headers.get("x-real-ip") ||
      "unknown"
    ).slice(0, 64);

    const db = getDb();

    const [attemptRows] = await db.execute<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS total
        FROM auth_attempts
        WHERE success = FALSE
          AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
          AND (email = ? OR ip_address = ?)
      `,
      [email, ipAddress]
    );

    const failedAttempts = Number(
      attemptRows[0]?.total ?? 0
    );

    if (failedAttempts >= 10) {
      return redirectWithError(
        request,
        "Too many login attempts. Wait 15 minutes and try again."
      );
    }

    const [users] = await db.execute<LoginUser[]>(
      `
        SELECT id, password_hash, email_verified_at
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    );

    const user = users[0];

    const passwordMatches =
      user &&
      typeof user.password_hash === "string" &&
      (await compare(password, user.password_hash));

    if (!user || !passwordMatches) {
      await db.execute(
        `
          INSERT INTO auth_attempts
            (email, ip_address, success)
          VALUES (?, ?, FALSE)
        `,
        [email, ipAddress]
      );

      return redirectWithError(
        request,
        "Incorrect email or password."
      );
    }

    if (!user.email_verified_at) {
      return redirectWithError(request, "Verify your email before logging in. You can request a fresh verification link below.");
    }

    await db.execute(
      `
        INSERT INTO auth_attempts
          (email, ip_address, success)
        VALUES (?, ?, TRUE)
      `,
      [email, ipAddress]
    );

    const token = await createSession(user.id);

    const redirectUrl = new URL(
      destination,
      getPublicOrigin(request)
    );

    const response = NextResponse.redirect(
      redirectUrl,
      303
    );

    response.cookies.set(sessionCookie(token));

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return redirectWithError(
      request,
      "Login is temporarily unavailable. Please try again later."
    );
  }
}
