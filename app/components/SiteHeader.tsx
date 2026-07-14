"use client";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open,setOpen]=useState(false);
  return (
    <><nav className="nav shell" aria-label="Main navigation">
      <Link className="brand" href="/" aria-label="FlightCoders home"><span className="brand-mark">F/C</span> FlightCoders</Link>
      <div className={`nav-links ${open?"nav-open":""}`}>
        <Link onClick={()=>setOpen(false)} href="/tracks">Tracks</Link><Link onClick={()=>setOpen(false)} href="/projects">Projects</Link><Link onClick={()=>setOpen(false)} href="/blog">Blog</Link><Link onClick={()=>setOpen(false)} href="/jobs">Jobs</Link><Link onClick={()=>setOpen(false)} href="/community">Community</Link><Link onClick={()=>setOpen(false)} href="/about">About</Link>
        <div className="mobile-nav-actions"><Link href="/login">Log in</Link><Link href="/register">Join the crew ↗</Link></div>
      </div>
      <div className="nav-actions"><Link className="nav-login" href="/login">Log in</Link><Link className="button button-small" href="/register">Join the crew <span>↗</span></Link></div>
      <button className="nav-toggle" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/></button>
    </nav>{open&&<button className="nav-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}</>
  );
}
