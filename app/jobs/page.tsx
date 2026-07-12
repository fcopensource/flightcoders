import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import Link from "next/link";
import { getDb } from "../../lib/db";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Careers and open roles",description:"Join FlightCoders and help build the world's strongest community for flight-software engineers."};
interface Job extends RowDataPacket{id:number;slug:string;title:string;team:string;location:string;employment_type:string;summary:string}
export default async function JobsPage(){const [jobs]=await getDb().execute<Job[]>("SELECT id,slug,title,team,location,employment_type,summary FROM jobs WHERE is_open=TRUE ORDER BY created_at DESC");return <main><SiteHeader/><section className="content-hero jobs-hero shell"><span>// CAREERS / OPEN FLIGHT PLAN</span><h1>Do work that<br/><em>moves systems.</em></h1><p>Join a focused team building the learning infrastructure, community, and tools behind the next generation of flight-software engineers.</p></section><section className="jobs-list shell"><div className="jobs-summary"><b>{String(jobs.length).padStart(2,"0")}</b><span>OPEN ROLES<br/>REMOTE-FIRST TEAM</span></div>{jobs.map((job,index)=><article className="job-row" key={job.id}><span>{String(index+1).padStart(2,"0")}</span><div><small>{job.team}</small><h2>{job.title}</h2><p>{job.summary}</p></div><div className="job-meta"><b>{job.location}</b><span>{job.employment_type}</span></div><Link href={`/jobs/${job.slug}`} aria-label={`View ${job.title}`}>↗</Link></article>)}</section><SiteFooter/></main>}
