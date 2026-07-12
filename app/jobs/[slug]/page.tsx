import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import { notFound } from "next/navigation";
import { getDb } from "../../../lib/db";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
export const dynamic="force-dynamic";
interface Job extends RowDataPacket{title:string;team:string;location:string;employment_type:string;summary:string;description:string;apply_url:string|null}
async function job(slug:string){const [rows]=await getDb().execute<Job[]>("SELECT title,team,location,employment_type,summary,description,apply_url FROM jobs WHERE slug=? AND is_open=TRUE LIMIT 1",[slug]);return rows[0]}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const j=await job((await params).slug);return j?{title:`${j.title} — Careers`,description:j.summary}:{title:"Role not found"}}
export default async function JobPage({params}:{params:Promise<{slug:string}>}){const j=await job((await params).slug);if(!j)notFound();const mail=`mailto:careers@flightcoders.com?subject=${encodeURIComponent(`Application: ${j.title}`)}`;return <main><SiteHeader/><article className="job-detail shell"><header><span>{j.team} / OPEN ROLE</span><h1>{j.title}</h1><p>{j.summary}</p><div><b>{j.location}</b><b>{j.employment_type}</b></div></header><div className="job-description">{j.description.split(/\n\n+/).map((p,i)=><p key={i}>{p}</p>)}<a className="button" href={j.apply_url||mail}>Apply for this role <span>↗</span></a></div></article><SiteFooter/></main>}
