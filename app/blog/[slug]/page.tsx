import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import { notFound } from "next/navigation";
import { getDb } from "../../../lib/db";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
export const dynamic="force-dynamic";
interface Post extends RowDataPacket{title:string;excerpt:string;content:string;category:string;author:string;published_at:Date}
async function post(slug:string){const [rows]=await getDb().execute<Post[]>("SELECT title,excerpt,content,category,author,published_at FROM blog_posts WHERE slug=? AND published=TRUE LIMIT 1",[slug]);return rows[0]}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=await post((await params).slug);return p?{title:p.title,description:p.excerpt}:{title:"Article not found"}}
export default async function BlogArticle({params}:{params:Promise<{slug:string}>}){const p=await post((await params).slug);if(!p)notFound();return <main><SiteHeader/><article className="article-page shell"><header><span>{p.category} / FLIGHTCODERS</span><h1>{p.title}</h1><p>{p.excerpt}</p><div>By {p.author} · {new Date(p.published_at).toLocaleDateString("en",{day:"numeric",month:"long",year:"numeric"})}</div></header><div className="article-body">{p.content.split(/\n\n+/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div></article><SiteFooter/></main>}
