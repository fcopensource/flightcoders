import { hash } from "bcryptjs";
import { randomBytes,timingSafeEqual } from "node:crypto";
import type { ResultSetHeader,RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { createSession,sessionCookie } from "../../../../../lib/auth";
import { getDb } from "../../../../../lib/db";

type GitHubUser={id:number;login:string;name:string|null;email:string|null;avatar_url:string|null};
type GitHubEmail={email:string;primary:boolean;verified:boolean};
function origin(request:Request){return (process.env.APP_URL||process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin).replace(/\/+$/,"")}
function same(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
function fail(request:Request,message:string){const url=new URL("/login",origin(request));url.searchParams.set("error",message);return NextResponse.redirect(url,303)}

export async function GET(request:Request){
  const url=new URL(request.url),code=url.searchParams.get("code")||"",state=url.searchParams.get("state")||"";
  const cookie=request.headers.get("cookie")||"";
  const stateCookie=decodeURIComponent(cookie.match(/(?:^|; )fc_github_state=([^;]+)/)?.[1]||"");
  const nextCookie=decodeURIComponent(cookie.match(/(?:^|; )fc_github_next=([^;]+)/)?.[1]||"/profile");
  if(!code||!state||!stateCookie||!same(state,stateCookie))return fail(request,"GitHub sign-in expired or was cancelled. Please try again.");
  const clientId=process.env.GITHUB_CLIENT_ID?.trim(),clientSecret=process.env.GITHUB_CLIENT_SECRET?.trim();
  if(!clientId||!clientSecret)return fail(request,"GitHub sign-in is not configured.");
  try{
    const tokenResponse=await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:clientId,client_secret:clientSecret,code,redirect_uri:`${origin(request)}/api/auth/github/callback`}),cache:"no-store"});
    const tokenData=await tokenResponse.json() as {access_token?:string;error?:string};
    if(!tokenResponse.ok||!tokenData.access_token)throw new Error(tokenData.error||"Token exchange failed");
    const ghHeaders={Accept:"application/vnd.github+json",Authorization:`Bearer ${tokenData.access_token}`,"User-Agent":"FlightCoders"};
    const userResponse=await fetch("https://api.github.com/user",{headers:ghHeaders,cache:"no-store"});
    if(!userResponse.ok)throw new Error("GitHub profile request failed");
    const github=await userResponse.json() as GitHubUser;
    let email="";
    const emailsResponse=await fetch("https://api.github.com/user/emails",{headers:ghHeaders,cache:"no-store"});
    if(!emailsResponse.ok)throw new Error("GitHub did not return a verified email address.");
    const emails=await emailsResponse.json() as GitHubEmail[];const verified=emails.find(item=>item.primary&&item.verified)||emails.find(item=>item.verified);email=verified?.email.toLowerCase()||"";
    if(!email)throw new Error("A verified GitHub email is required");
    const db=getDb(),connection=await db.getConnection();let userId:number;
    try{await connection.beginTransaction();
      const [linked]=await connection.execute<RowDataPacket[]>("SELECT user_id FROM social_accounts WHERE provider='github' AND provider_user_id=? LIMIT 1",[String(github.id)]);
      if(linked[0])userId=Number(linked[0].user_id);else{
        const [existing]=await connection.execute<RowDataPacket[]>("SELECT id FROM users WHERE email=? LIMIT 1",[email]);
        if(existing[0])userId=Number(existing[0].id);else{const passwordHash=await hash(randomBytes(48).toString("base64url"),12);const [created]=await connection.execute<ResultSetHeader>("INSERT INTO users (name,email,password_hash,email_verified_at) VALUES (?,?,?,NOW())",[github.name||github.login,email,passwordHash]);userId=created.insertId;await connection.execute("INSERT INTO profiles (user_id,role,track) VALUES (?,'Developer','Flight Systems')",[userId]);await connection.execute("INSERT INTO learning_progress (user_id) VALUES (?)",[userId]);}
        await connection.execute("INSERT INTO social_accounts (user_id,provider,provider_user_id,provider_username,avatar_url) VALUES (?,'github',?,?,?)",[userId,String(github.id),github.login,github.avatar_url]);
      }
      await connection.execute("UPDATE users SET email_verified_at=COALESCE(email_verified_at,NOW()) WHERE id=?",[userId]);
      await connection.execute("UPDATE social_accounts SET provider_username=?,avatar_url=? WHERE provider='github' AND provider_user_id=?",[github.login,github.avatar_url,String(github.id)]);
      const token=await createSession(userId,connection);await connection.commit();
      const destination=nextCookie.startsWith("/")&&!nextCookie.startsWith("//")?nextCookie:"/profile";const response=NextResponse.redirect(new URL(destination,origin(request)),303);response.cookies.set(sessionCookie(token));response.cookies.set("fc_github_state","",{path:"/",maxAge:0});response.cookies.set("fc_github_next","",{path:"/",maxAge:0});return response;
    }catch(error){await connection.rollback();throw error}finally{connection.release()}
  }catch(error){console.error("GitHub OAuth error:",error);return fail(request,error instanceof Error&&error.message.includes("verified GitHub email")?error.message:"GitHub sign-in failed. Please try again.")}
}
