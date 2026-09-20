"use client";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open,setOpen]=useState(false);
  return (
    <><nav className="nav shell fc-nav" aria-label="Main navigation">
      <Link className="brand" href="/" aria-label="FlightCoders home"><span className="brand-mark">F/C</span> FlightCoders</Link>
      <div className={`nav-links ${open?"nav-open":""}`}>
        <Link onClick={()=>setOpen(false)} href="/projects">Find Projects</Link>
        <Link onClick={()=>setOpen(false)} href="/community">Developers</Link>
        <Link onClick={()=>setOpen(false)} href="/jobs">Opportunities</Link>
        <Link onClick={()=>setOpen(false)} href="/blog">Insights</Link>
        <Link onClick={()=>setOpen(false)} href="/about">How it works</Link>
        <div className="mobile-nav-actions"><Link href="/login">Log in</Link><Link href="/register">Join FlightCoders ↗</Link></div>
      </div>
      <div className="nav-actions"><Link className="nav-login" href="/login">Log in</Link><Link className="button button-small fc-nav-cta" href="/register">Post a project <span>↗</span></Link></div>
      <button className="nav-toggle" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/></button>
    </nav>{open&&<button className="nav-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}</>
  );
}
