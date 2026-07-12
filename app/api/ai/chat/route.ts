import Groq from "groq-sdk";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";

interface MessageRow extends RowDataPacket { role: "user" | "assistant"; content: string; created_at: string; }

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const [rows] = await getDb().execute<MessageRow[]>("SELECT role, content, created_at FROM ai_messages WHERE user_id=? ORDER BY id DESC LIMIT 20", [user.id]);
  return NextResponse.json({ messages: rows.reverse() });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "AI mentor is waiting for the GROQ_API_KEY environment variable." }, { status: 503 });
  const body = await request.json().catch(() => null) as { message?: string } | null;
  const message = String(body?.message ?? "").trim().slice(0, 2000);
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const db = getDb();
  const [usage] = await db.execute<RowDataPacket[]>("SELECT COUNT(*) AS total FROM ai_messages WHERE user_id=? AND role='user' AND created_at>=CURDATE()", [user.id]);
  if (Number(usage[0]?.total ?? 0) >= 30) return NextResponse.json({ error: "Daily mentor limit reached. Try again tomorrow." }, { status: 429 });
  const [history] = await db.execute<MessageRow[]>("SELECT role, content, created_at FROM ai_messages WHERE user_id=? ORDER BY id DESC LIMIT 10", [user.id]);
  await db.execute("INSERT INTO ai_messages (user_id, role, content) VALUES (?, 'user', ?)", [user.id, message]);

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      temperature: 0.45,
      max_completion_tokens: 700,
      messages: [
        { role: "system", content: `You are Vector, the FlightCoders AI mentor. Help ${user.name} learn aviation software, autonomy, robotics, Python, C++, data systems, and safety engineering. Be accurate, practical, concise, and encouraging. Never present educational guidance as certified operational aviation advice. Use code blocks when useful.` },
        ...history.reverse().map(item => ({ role: item.role, content: item.content })),
        { role: "user", content: message },
      ],
    });
    const reply = completion.choices[0]?.message?.content?.trim() || "I could not generate a useful answer. Please try again.";
    await db.execute("INSERT INTO ai_messages (user_id, role, content) VALUES (?, 'assistant', ?)", [user.id, reply]);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "The AI mentor is temporarily unavailable." }, { status: 502 });
  }
}
