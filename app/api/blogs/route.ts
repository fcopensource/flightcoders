import type { ResultSetHeader,RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { isCurrentUserAdmin } from "../../../lib/admin";
export async function GET(){const [rows]=await getDb().execute<RowDataPacket[]>("SELECT id,slug,title,excerpt,category,author,published_at FROM blog_posts WHERE published=TRUE ORDER BY published_at DESC");return NextResponse.json({posts:rows})}
export async function POST(request:Request){if(!await isCurrentUserAdmin())return NextResponse.json({error:"Forbidden"},{status:403});const b=await request.json();const [r]=await getDb().execute<ResultSetHeader>("INSERT INTO blog_posts (slug,title,excerpt,content,category,author,published,published_at) VALUES (?,?,?,?,?,?,?,IF(?,NOW(),NULL))",[b.slug,b.title,b.excerpt,b.content,b.category,b.author,b.published!==false,b.published!==false]);return NextResponse.json({id:r.insertId},{status:201})}
