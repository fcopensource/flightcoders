import { hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import type { ResultSetHeader } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { NextResponse } from "next/server";

import { sendVerificationEmail } from "../../../../lib/mailer";
import {
  DatabaseConfigurationError,
  getDb,
} from "../../../../lib/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

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

function redirectWithError(request: Request, message: string) {
  const url = new URL("/register", getPublicOrigin(request));
  url.searchParams.set("error", message);

  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  let connection: PoolConnection | undefined;

  try {
    const form = await request.formData();

    const name = String(form.get("name") ?? "")
      .trim()
      .slice(0, 80);

    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 190);

    const password = String(form.get("password") ?? "");
    const confirmPassword = String(
      form.get("confirmPassword") ?? ""
    );

    const role = String(form.get("role") ?? "")
      .trim()
      .slice(0, 80);

    const track = String(form.get("track") ?? "")
      .trim()
      .slice(0, 80);

    if (!name || !emailPattern.test(email)) {
      return redirectWithError(
        request,
        "Enter a valid name and email address."
      );
    }

    if (!strongPasswordPattern.test(password)) {
      return redirectWithError(
        request,
        "Use 8+ characters with uppercase, lowercase, and a number."
      );
    }

    if (password !== confirmPassword) {
      return redirectWithError(request, "Passwords do not match.");
    }

    if (form.get("terms") !== "on") {
      return redirectWithError(
        request,
        "Please accept the Terms and Privacy Policy."
      );
    }

    connection = await getDb().getConnection();
    await connection.beginTransaction();

    const passwordHash = await hash(password, 12);

    const [result] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `,
      [name, email, passwordHash]
    );

    await connection.execute(
      `
        INSERT INTO profiles (user_id, role, track)
        VALUES (?, ?, ?)
      `,
      [result.insertId, role || null, track || null]
    );

    await connection.execute(
      `
        INSERT INTO learning_progress (user_id)
        VALUES (?)
      `,
      [result.insertId]
    );

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await connection.execute(
      "INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))",
      [result.insertId, tokenHash]
    );

    await connection.commit();

    try {
      await sendVerificationEmail({ email, name, token });
    } catch (mailError) {
      console.error("Verification email failed:", mailError);
      return redirectWithError(request, "Your account was created, but we could not send the verification email. Check the production SMTP settings and try resending it.");
    }

    const destination = new URL(
      `/register?sent=1&email=${encodeURIComponent(email)}`,
      getPublicOrigin(request)
    );

    return NextResponse.redirect(destination, 303);
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Registration transaction rollback failed:",
          rollbackError
        );
      }
    }

    console.error("Registration error:", error);

    const code = (error as { code?: string }).code;

    if (code === "ER_DUP_ENTRY") {
      return redirectWithError(
        request,
        "An account already exists for this email."
      );
    }

    if (
      error instanceof DatabaseConfigurationError ||
      [
        "ECONNREFUSED",
        "ETIMEDOUT",
        "ENOTFOUND",
        "ER_ACCESS_DENIED_ERROR",
        "ER_BAD_DB_ERROR",
        "ER_NO_SUCH_TABLE",
      ].includes(code ?? "")
    ) {
      return redirectWithError(
        request,
        "Registration is temporarily unavailable. Please try again later."
      );
    }

    return redirectWithError(
      request,
      "Registration failed. Please try again."
    );
  } finally {
    connection?.release();
  }
}
