import { cache } from "react";
import { JsonLd, breadcrumbs, pageMetadata, siteUrl } from "../../../lib/seo";
import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import { notFound } from "next/navigation";
import { getDb } from "../../../lib/db";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
export const dynamic="force-dynamic";
interface Post extends RowDataPacket{title:string;excerpt:string;content:string;category:string;author:string;published_at:Date;updated_at:Date}
const post=cache(async function post(slug:string){const [rows]=await getDb().execute<Post[]>("SELECT title,excerpt,content,category,author,published_at,updated_at FROM blog_posts WHERE slug=? AND published=TRUE LIMIT 1",[slug]);return rows[0]});
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=await post((await params).slug);if(!p)return{title:"Article not found"};const m=pageMetadata({title:p.title,description:p.excerpt,path:`/blog/${(await params).slug}`,type:"article"});return{...m,authors:[{name:p.author}],openGraph:{...m.openGraph,type:"article",publishedTime:p.published_at?new Date(p.published_at).toISOString():undefined,modifiedTime:new Date(p.updated_at).toISOString(),authors:[p.author],section:p.category}}}
export default async function BlogArticle({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug;const p=await post(slug);if(!p)notFound();const url=`${siteUrl}/blog/${slug}`;return <main><JsonLd data={[{"@context":"https://schema.org","@type":"BlogPosting",headline:p.title,description:p.excerpt,articleSection:p.category,author:{"@type":"Person",name:p.author},publisher:{"@id":`${siteUrl}/#organization`},datePublished:p.published_at?new Date(p.published_at).toISOString():undefined,dateModified:new Date(p.updated_at).toISOString(),mainEntityOfPage:url,url,image:`${siteUrl}/brand/flightcoders-banner.png`},breadcrumbs([["Home","/"],["Blog","/blog"],[p.title,`/blog/${slug}`]])]}/><SiteHeader/><article className="article-page shell"><header><span>{p.category} / FLIGHTCODERS</span><h1>{p.title}</h1><p>{p.excerpt}</p><div>By {p.author} · {new Date(p.published_at).toLocaleDateString("en",{day:"numeric",month:"long",year:"numeric"})}</div></header><div className="article-body">{p.content.split(/\n\n+/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div></article><SiteFooter/></main>}
