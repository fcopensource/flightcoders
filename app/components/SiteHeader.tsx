"use client";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader(){
 const [open,setOpen]=useState(false);
 return <><nav className="nav shell" aria-label="Main navigation"><Link className="brand" href="/" aria-label="FlightCoders home"><img className="fc-logo-mark" src="/flightcoders-mark.svg" width="42" height="42" alt=""/><span>Flight<span className="fc-word-accent">Coders</span></span></Link><div className={`nav-links ${open?"nav-open":""}`}><Link onClick={()=>setOpen(false)} href="/#hackathons">Hackathons</Link><Link onClick={()=>setOpen(false)} href="/#radar">Tech Radar</Link><Link onClick={()=>setOpen(false)} href="/community">Community</Link><Link onClick={()=>setOpen(false)} href="/projects">Projects</Link><Link onClick={()=>setOpen(false)} href="/dashboard">Workspace</Link><div className="mobile-nav-actions"><Link href="/login">Log in</Link><Link href="/register">Join FlightCoders ↗</Link></div></div><div className="nav-actions"><Link className="nav-login" href="/login">Log in</Link><Link className="button button-small" href="/register">Join the network <span>↗</span></Link></div><button className="nav-toggle" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/></button></nav>{open&&<button className="nav-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}</>;
}
