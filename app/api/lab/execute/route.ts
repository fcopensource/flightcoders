import {NextResponse} from "next/server";
import {getCurrentUser} from "../../../../lib/auth";
import {executeWithJudge,isJudgeLanguage} from "../../../../lib/judge0";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({error: "Unauthenticated"}, {status: 401});

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const language = String(body?.language || "");
  const sourceCode = String(body?.sourceCode || "");
  const stdin = String(body?.stdin || "");

  if (!isJudgeLanguage(language)) {
    return NextResponse.json({error: "Unsupported language"}, {status: 400});
  }
  if (!sourceCode.trim() || sourceCode.length > 50000) {
    return NextResponse.json({error: "Code must be between 1 and 50,000 characters"}, {status: 400});
  }
  if (stdin.length > 10000) {
    return NextResponse.json({error: "Standard input cannot exceed 10,000 characters"}, {status: 400});
  }

  try {
    return NextResponse.json(await executeWithJudge(language, sourceCode, stdin));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution service unavailable";
    return NextResponse.json({error: message}, {status: 502});
  }
}
