import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { getDb } from "../../../lib/db";
import { ensureSocialLinks, getSocialLinks, socialKeys } from "../../../lib/profile";

export async function GET() {
  const user = await getCurrentUser();
  return user ? NextResponse.json({ profile: user, links: await getSocialLinks(user.id) }) : NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const name = String(body.name ?? user.name).trim().slice(0, 80);
  const role = String(body.role ?? user.role ?? "").trim().slice(0, 80);
  const track = String(body.track ?? user.track ?? "").trim().slice(0, 80);
  const goal = String(body.goal ?? user.goal ?? "").trim().slice(0, 1000);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const links: string[] = [];
  for (const key of socialKeys) {
    const value = String(body[key] ?? "").trim();
    if (value) {
      try {
        const url = new URL(value);
        if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || value.length > 500) throw new Error();
      } catch { return NextResponse.json({ error: `Enter a valid http:// or https:// link for ${key}.` }, { status: 400 }); }
    }
    links.push(value);
  }
  await ensureSocialLinks();
  const db = getDb();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("UPDATE users SET name=? WHERE id=?", [name, user.id]);
    await connection.execute("INSERT INTO profiles (user_id, role, track, goal) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role=VALUES(role), track=VALUES(track), goal=VALUES(goal)", [user.id, role || null, track || null, goal || null]);
    await connection.execute("INSERT INTO profile_social_links (user_id,github,linkedin,website,x) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE github=VALUES(github),linkedin=VALUES(linkedin),website=VALUES(website),x=VALUES(x)", [user.id, ...links]);
    await connection.commit();
  } catch {
    await connection.rollback();
    return NextResponse.json({error:"Could not save your profile. Please try again."},{status:500});
  } finally { connection.release(); }
  return NextResponse.json({ ok: true });
}
