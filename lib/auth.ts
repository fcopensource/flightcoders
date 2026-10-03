import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { getDb } from "./db";

export const SESSION_COOKIE = "fc_session";
export const SESSION_DAYS = 30;

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string | null;
  track: string | null;
  goal: string | null;
}

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: number, connection?: PoolConnection) {
  const token = randomBytes(32).toString("base64url");
  await (connection ?? getDb()).execute<ResultSetHeader>(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))",
    [userId, tokenHash(token)],
  );
  return token;
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [rows] = await getDb().execute<UserRow[]>(
    `SELECT u.id, u.name, u.email, p.role, p.track, p.goal
     FROM sessions s JOIN users u ON u.id=s.user_id
     LEFT JOIN profiles p ON p.user_id=u.id
     WHERE s.token_hash=? AND s.expires_at>NOW() LIMIT 1`,
    [tokenHash(token)],
  );
  return rows[0] ?? null;
}

export async function requireUser(returnTo = "/profile") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function deleteCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await getDb().execute("DELETE FROM sessions WHERE token_hash=?", [tokenHash(token)]);
}

export function sessionCookie(token: string) {
  return { name: SESSION_COOKIE, value: token, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_DAYS * 86400 };
}
