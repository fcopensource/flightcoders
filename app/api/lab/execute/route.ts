import {NextResponse} from "next/server";
import {getCurrentUser} from "../../../../lib/auth";
import {executeWithJudge,isJudgeLanguage} from "../../../../lib/judge0";
import {validateRadarMission} from "../../../../lib/flightMission";

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
  if (!stdin.trim() || stdin.length > 50000) {
    return NextResponse.json({error: "Mission input must be between 1 and 50,000 characters"}, {status: 400});
  }

  try {
    const execution=await executeWithJudge(language, sourceCode, stdin);
    return NextResponse.json({
      ...execution,
      mission:execution.accepted
        ? validateRadarMission(execution.stdout,stdin)
        : {passed:false,completed:0,total:1,progress:0,nextCheckpoint:"Fix compiler or runtime errors first"},
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution service unavailable";
    return NextResponse.json({error: message}, {status: 502});
  }
}
