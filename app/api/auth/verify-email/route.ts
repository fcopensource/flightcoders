import { createHash, randomBytes } from "node:crypto";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { sendVerificationEmail } from "../../../../lib/mailer";

function origin(request:Request){ return (process.env.APP_URL||process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin).replace(/\/+$/,""); }
const digest=(value:string)=>createHash("sha256").update(value).digest("hex");

export async function GET(request:Request){
  const token=new URL(request.url).searchParams.get("token")||"";
  const redirectUrl=new URL("/verify-email",origin(request));
  if(!token){redirectUrl.searchParams.set("error","Verification token is missing.");return NextResponse.redirect(redirectUrl,303);}
  const db=getDb();
  const [rows]=await db.execute<RowDataPacket[]>("SELECT id,user_id FROM email_verification_tokens WHERE token_hash=? AND expires_at>NOW() LIMIT 1",[digest(token)]);
  const record=rows[0];
  if(!record){redirectUrl.searchParams.set("error","This verification link is invalid or expired.");return NextResponse.redirect(redirectUrl,303);}
  const connection=await db.getConnection();
  try{await connection.beginTransaction();await connection.execute("UPDATE users SET email_verified_at=COALESCE(email_verified_at,NOW()) WHERE id=?",[record.user_id]);await connection.execute("DELETE FROM email_verification_tokens WHERE user_id=?",[record.user_id]);await connection.commit();}
  catch(error){await connection.rollback();throw error;}finally{connection.release();}
  return NextResponse.redirect(new URL("/login?verified=1",origin(request)),303);
}

export async function POST(request:Request){
  const form=await request.formData(); const email=String(form.get("email")||"").trim().toLowerCase().slice(0,190);
  const page=new URL("/verify-email",origin(request));
  const [users]=await getDb().execute<RowDataPacket[]>("SELECT id,name,email_verified_at FROM users WHERE email=? LIMIT 1",[email]); const user=users[0];
  if(user&&!user.email_verified_at){const token=randomBytes(32).toString("base64url");await getDb().execute("DELETE FROM email_verification_tokens WHERE user_id=?",[user.id]);await getDb().execute("INSERT INTO email_verification_tokens (user_id,token_hash,expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL 24 HOUR))",[user.id,digest(token)]);await sendVerificationEmail({email,name:user.name,token});}
  page.searchParams.set("resent","1");page.searchParams.set("email",email);return NextResponse.redirect(page,303);
}
