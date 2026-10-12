"use client";
import Link from "next/link";
import { Brand } from "./Brand";
import { useState } from "react";

export function SiteHeader(){
 const [open,setOpen]=useState(false);
 return <><nav className="nav shell" aria-label="Main navigation"><Link className="brand" href="/" aria-label="FlightCoders home"><Brand/></Link><div className={`nav-links ${open?"nav-open":""}`}><Link onClick={()=>setOpen(false)} href="/services">Services</Link><Link onClick={()=>setOpen(false)} href="/about">About us</Link><Link onClick={()=>setOpen(false)} href="/community">Community</Link><Link onClick={()=>setOpen(false)} href="/projects">Projects</Link><Link onClick={()=>setOpen(false)} href="/hire-us">Hire us</Link><div className="mobile-nav-actions"><Link href="/login">Log in</Link><Link href="/hire-us">Start a project ↗</Link></div></div><div className="nav-actions"><Link className="nav-login" href="/login">Log in</Link><Link className="button button-small" href="/hire-us">Start a project <span>↗</span></Link></div><button className="nav-toggle" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/></button></nav>{open&&<button className="nav-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}</>;
}
