"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";

const destinations=[
 {href:"/flight-lab",code:"LAB",title:"Open Flight Operations Lab",hint:"Run advanced aircraft-system code"},
 {href:"/dashboard",code:"DECK",title:"Mission dashboard",hint:"Progress, AI mentor, and telemetry"},
 {href:"/tracks",code:"PATH",title:"Learning tracks",hint:"Flight systems, autonomy, and data"},
 {href:"/projects",code:"SHIP",title:"FlightCoders projects",hint:"Production case studies"},
 {href:"/blog",code:"NOTE",title:"Engineering library",hint:"Deep technical flight notes"},
 {href:"/jobs",code:"CREW",title:"Open roles",hint:"Join the engineering crew"},
];
const themes=["runway","midnight","aurora"] as const;
export function GlobalControls(){
 const [open,setOpen]=useState(false),[query,setQuery]=useState("");const themeButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();setOpen(v=>!v)}if(event.key==="Escape")setOpen(false)};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[]);
 function cycleTheme(){const current=(document.documentElement.dataset.theme||"runway") as typeof themes[number];const next=themes[(themes.indexOf(current)+1)%themes.length];document.documentElement.dataset.theme=next;localStorage.setItem("fc_theme",next);if(themeButton.current)themeButton.current.title=`Theme: ${next}`;}
 const filtered=destinations.filter(x=>(x.title+x.hint+x.code).toLowerCase().includes(query.toLowerCase()));
 return <><div className="global-controls"><button ref={themeButton} onClick={cycleTheme} title="Change visual theme" aria-label="Change visual theme"><i/><span>Theme</span></button><button onClick={()=>setOpen(true)} aria-label="Open command navigation"><b>⌘</b><span>Navigate</span><kbd>⌘ K</kbd></button></div>{open&&<div className="command-layer" role="dialog" aria-modal="true" aria-label="Command navigation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><section className="command-palette"><header><span>F/C</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where do you want to fly?" aria-label="Search destinations"/><kbd>ESC</kbd></header><div>{filtered.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)}><b>{item.code}</b><span><strong>{item.title}</strong><small>{item.hint}</small></span><i>↗</i></Link>)}{!filtered.length&&<p>No matching flight path.</p>}</div><footer><span>FLIGHTCODERS COMMAND SYSTEM</span><small>{filtered.length} ROUTES AVAILABLE</small></footer></section></div>}</>;
}
