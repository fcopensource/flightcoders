"use client";
import Link from "next/link";
import { useState } from "react";

export function DashboardSidebar({name,email}:{name:string;email:string}){
 const [open,setOpen]=useState(false);
 return <><button className="sidebar-toggle" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Toggle dashboard navigation">{open?"×":"☰"}</button><aside className={`dashboard-sidebar ${open?"open":""}`}><Link className="sidebar-brand" href="/"><span>F/C</span><b>FlightCoders</b></Link><div className="sidebar-status"><i/><span>FLIGHT DECK ONLINE</span></div><nav aria-label="Dashboard navigation"><Link className="active" href="/dashboard"><span>01</span>Overview</Link><Link href="/tracks"><span>02</span>Learning tracks</Link><a href="#ai-mentor"><span>03</span>AI mentor</a><Link href="/projects"><span>04</span>Built projects</Link><Link href="/blog"><span>05</span>Flight notes</Link><Link href="/jobs"><span>06</span>Open roles</Link><Link href="/community"><span>07</span>Crew network</Link><Link href="/profile"><span>08</span>Profile settings</Link></nav><div className="sidebar-user"><span>{name.split(" ").map(v=>v[0]).join("").slice(0,2)}</span><div><b>{name}</b><small>{email}</small></div></div><form action="/api/auth/logout" method="post"><button type="submit">Sign out <span>↗</span></button></form></aside>{open&&<button className="sidebar-backdrop" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}</>;
}
