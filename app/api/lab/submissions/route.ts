import type {RowDataPacket} from "mysql2";
import {NextResponse} from "next/server";
import {getCurrentUser} from "../../../../lib/auth";
import {getDb} from "../../../../lib/db";
import {flightChallenges} from "../../../../lib/flightChallenges";
import {radarMission} from "../../../../lib/flightMission";
import {isJudgeLanguage} from "../../../../lib/judge0";

const validSlugs=new Set([...flightChallenges.map(challenge=>challenge.slug),radarMission.slug]);

export async function GET(){
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:"Unauthenticated"},{status:401});
 const [rows]=await getDb().execute<RowDataPacket[]>("SELECT challenge_slug,language,passed,tests_passed,total_tests,runtime_ms,created_at FROM code_submissions WHERE user_id=? ORDER BY created_at DESC LIMIT 50",[user.id]);
 const [attemptRows]=await getDb().execute<RowDataPacket[]>("SELECT COUNT(*) AS failed_attempts FROM code_submissions WHERE user_id=? AND challenge_slug=? AND passed=FALSE",[user.id,radarMission.slug]);
 const failedAttempts=Number(attemptRows[0]?.failed_attempts||0);
 return NextResponse.json({submissions:rows,failedAttempts,hintUnlocked:failedAttempts>=5});
}

export async function POST(request:Request){
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:"Unauthenticated"},{status:401});
 const body=await request.json().catch(()=>null) as Record<string,unknown>|null;
 const slug=String(body?.challengeSlug||""),language=String(body?.language||"");
 if(!validSlugs.has(slug)||!isJudgeLanguage(language))return NextResponse.json({error:"Invalid challenge or language"},{status:400});
 const code=String(body?.code||"");
 if(!code||code.length>50000)return NextResponse.json({error:"Code must be between 1 and 50,000 characters"},{status:400});
 const total=Math.max(0,Math.min(100,Number(body?.totalTests)||0));
 const passedTests=Math.max(0,Math.min(total,Number(body?.testsPassed)||0));
 const passed=body?.passed===true&&total>0&&passedTests===total;
 const runtime=Math.max(0,Math.min(10000,Number(body?.runtimeMs)||0));
 await getDb().execute("INSERT INTO code_submissions (user_id,challenge_slug,language,source_code,passed,tests_passed,total_tests,runtime_ms) VALUES (?,?,?,?,?,?,?,?)",[user.id,slug,language,code,passed,passedTests,total,runtime]);
 const [attemptRows]=await getDb().execute<RowDataPacket[]>("SELECT COUNT(*) AS failed_attempts FROM code_submissions WHERE user_id=? AND challenge_slug=? AND passed=FALSE",[user.id,slug]);
 const failedAttempts=Number(attemptRows[0]?.failed_attempts||0);
 return NextResponse.json({saved:true,passed,failedAttempts,hintUnlocked:failedAttempts>=5},{status:201});
}
