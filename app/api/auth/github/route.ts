import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

function appOrigin(request:Request){return (process.env.APP_URL||process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin).replace(/\/+$/,"")}
function safeNext(value:string|null){return value?.startsWith("/")&&!value.startsWith("//")?value:"/profile"}

export async function GET(request:Request){
  const clientId=process.env.GITHUB_CLIENT_ID?.trim();
  if(!clientId)return NextResponse.redirect(new URL("/login?error=GitHub+sign-in+is+not+configured.",appOrigin(request)),303);
  const state=randomBytes(32).toString("base64url");
  const next=safeNext(new URL(request.url).searchParams.get("next"));
  const callback=`${appOrigin(request)}/api/auth/github/callback`;
  const authorize=new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id",clientId);authorize.searchParams.set("redirect_uri",callback);authorize.searchParams.set("scope","read:user user:email");authorize.searchParams.set("state",state);authorize.searchParams.set("allow_signup","true");
  const response=NextResponse.redirect(authorize,303);
  const secure=process.env.NODE_ENV==="production";
  response.cookies.set("fc_github_state",state,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:600});
  response.cookies.set("fc_github_next",next,{httpOnly:true,secure,sameSite:"lax",path:"/",maxAge:600});
  return response;
}
