"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./Brand";
export function SiteHeader(){const [open,setOpen]=useState(false);const path=usePathname();return <header className="studio-header"><div className="studio-nav"><Link className="studio-brand" href="/" aria-label="FlightCoders home"><Brand/></Link><button className="studio-menu" aria-expanded={open} aria-controls="studio-navigation" onClick={()=>setOpen(!open)}>{open?'Close ✕':'Menu ☰'}</button><nav id="studio-navigation" className={open?'is-open':''} aria-label="Main navigation">{[['/projects','Software'],['/services','Development'],['/hire-developers','Hire developers'],['/about','Company']].map(([url,label])=><Link key={url} href={url} aria-current={path===url?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link className="studio-button" href="/hire-us" onClick={()=>setOpen(false)}>Contact sales <span>↗</span></Link></nav></div></header>}
