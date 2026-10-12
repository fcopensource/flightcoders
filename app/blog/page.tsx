import { pageMetadata } from "../../lib/seo";
import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import Link from "next/link";
import { getDb } from "../../lib/db";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const dynamic="force-dynamic";
export const metadata:Metadata=pageMetadata({title:"Insights — AI and software engineering",description:"Engineering notes on AI systems, custom software, and product development from FlightCoders.",path:"/blog"});
interface Post extends RowDataPacket{id:number;slug:string;title:string;excerpt:string;category:string;author:string;published_at:Date}
export default async function BlogPage(){const [posts]=await getDb().execute<Post[]>("SELECT id,slug,title,excerpt,category,author,published_at FROM blog_posts WHERE published=TRUE ORDER BY published_at DESC, id DESC");return <main><SiteHeader/><section className="content-hero shell"><span>// ENGINEERING INSIGHTS</span><h1>Ideas built for<br/><em>real impact.</em></h1><p>Practical perspectives on building useful AI systems, reliable software, and thoughtful digital products.</p></section><section className="editorial-grid shell">{posts.map((post,index)=><article className={index===0?"editorial-card featured":"editorial-card"} key={post.id}><div><span>{String(index+1).padStart(2,"0")} / {post.category}</span><time>{new Date(post.published_at).toLocaleDateString("en",{day:"2-digit",month:"short",year:"numeric"})}</time></div><h2>{post.title}</h2><p>{post.excerpt}</p><footer><b>By {post.author}</b><Link href={`/blog/${post.slug}`}>Read field note ↗</Link></footer></article>)}</section><SiteFooter/></main>}
