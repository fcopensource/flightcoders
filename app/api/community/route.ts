import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { getCurrentUser } from "../../../lib/auth";
import { getDb } from "../../../lib/db";

export async function GET() {
 try {
  const [posts] = await getDb().execute<RowDataPacket[]>(`SELECT c.id,c.user_id,c.kind,c.content,c.project_url,c.created_at,u.name,p.role FROM community_posts c JOIN users u ON u.id=c.user_id LEFT JOIN profiles p ON p.user_id=u.id ORDER BY c.created_at DESC,c.id DESC LIMIT 100`);
  return NextResponse.json({posts}, {headers:{"Cache-Control":"no-store"}});
 } catch { return NextResponse.json({error:"The community feed is temporarily unavailable. Please try again shortly."},{status:503}); }
}
export async function POST(request:Request) {
 if(request.headers.get("origin")!==new URL(request.url).origin) return NextResponse.json({error:"Invalid request origin."},{status:403});
 try {
  const user=await getCurrentUser();
  if(!user) return NextResponse.json({error:"Please sign in to share with the community."},{status:401});
  const body=await request.json().catch(()=>null);
  if(!body || typeof body.content!=="string" || !["project","question","collaboration"].includes(body.kind) || !body.content.trim() || body.content.trim().length>2000) return NextResponse.json({error:"Choose a post type and write between 1 and 2,000 characters."},{status:400});
  const url=typeof body.project_url==="string"?body.project_url.trim():"";
  if(url){try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol)||parsed.username||parsed.password||url.length>500)throw Error();}catch{return NextResponse.json({error:"Use a valid http or https project link."},{status:400});}}
  const connection=await getDb().getConnection();
  try {
   await connection.beginTransaction();
   await connection.execute("SELECT id FROM users WHERE id=? FOR UPDATE",[user.id]);
   const [recent]=await connection.execute<RowDataPacket[]>("SELECT id FROM community_posts WHERE user_id=? AND created_at>DATE_SUB(NOW(), INTERVAL 1 MINUTE) LIMIT 1",[user.id]);
   if(recent.length){await connection.rollback();return NextResponse.json({error:"Please wait a minute before posting again."},{status:429});}
   await connection.execute("INSERT INTO community_posts (user_id,kind,content,project_url) VALUES (?,?,?,?)",[user.id,body.kind,body.content.trim(),url||null]);
   await connection.commit();
  } catch(error){await connection.rollback();throw error;} finally{connection.release();}
  return NextResponse.json({ok:true},{status:201});
 } catch {return NextResponse.json({error:"Your post could not be saved. Please try again."},{status:503});}
}
