import {NextResponse} from "next/server";
import {getCurrentUser} from "../../../../lib/auth";
import {getDb} from "../../../../lib/db";
import {flightChallenges} from "../../../../lib/flightChallenges";
import {executeWithJudge} from "../../../../lib/judge0";

export const runtime="nodejs";

function buildHarness(sourceCode:string,tests:{name:string;code:string}[]){
 const harness=tests.map((test,index)=>`
try {
  (() => { ${test.code} })();
  console.log("__FC_TEST_${index}_PASS__");
} catch (error) {
  console.log("__FC_TEST_${index}_FAIL__" + String(error && error.message ? error.message : error));
}`).join("\n");
 return `${sourceCode}\n\n// FlightCoders judge harness\n${harness}`;
}

export async function POST(request:Request){
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:"Unauthenticated"},{status:401});
 const body=await request.json().catch(()=>null) as Record<string,unknown>|null;
 const challengeSlug=String(body?.challengeSlug||"");
 const language=String(body?.language||"");
 const sourceCode=String(body?.sourceCode||"");
 const submit=body?.submit===true;
 const challenge=flightChallenges.find(item=>item.slug===challengeSlug);
 if(!challenge)return NextResponse.json({error:"Unknown Flight Lab problem"},{status:404});
 if(language!=="javascript")return NextResponse.json({error:"These function-contract missions currently use the JavaScript judge"},{status:400});
 if(!sourceCode.trim()||sourceCode.length>50000)return NextResponse.json({error:"Code must be between 1 and 50,000 characters"},{status:400});
 try{
  const execution=await executeWithJudge("javascript",buildHarness(sourceCode,challenge.tests),"");
  const output=execution.stdout.split(/\r?\n/);
  const testResults=challenge.tests.map((test,index)=>{
   const passToken=`__FC_TEST_${index}_PASS__`;
   const failToken=`__FC_TEST_${index}_FAIL__`;
   const passed=output.some(line=>line.trim()===passToken);
   const failure=output.find(line=>line.startsWith(failToken));
   return {name:test.name,passed,error:failure?failure.slice(failToken.length):passed?"":"Test did not complete"};
  });
  const testsPassed=testResults.filter(test=>test.passed).length;
  const passed=execution.accepted&&testsPassed===challenge.tests.length;
  let saved=false;
  if(submit){
   await getDb().execute("INSERT INTO code_submissions (user_id,challenge_slug,language,source_code,passed,tests_passed,total_tests,runtime_ms) VALUES (?,?,?,?,?,?,?,?)",[user.id,challenge.slug,"javascript",sourceCode,passed,testsPassed,challenge.tests.length,execution.runtimeMs]);
   saved=true;
  }
  return NextResponse.json({...execution,accepted:passed,stdout:output.filter(line=>!line.startsWith("__FC_TEST_")).join("\n"),testsPassed,totalTests:challenge.tests.length,testResults,saved});
 }catch(error){
  return NextResponse.json({error:error instanceof Error?error.message:"Flight judge unavailable"},{status:502});
 }
}
