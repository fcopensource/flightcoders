"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AIMentor } from "./AIMentor";

type Progress = { completed_modules:number; total_modules:number; streak_days:number; minutes_this_week:number; projects_shipped:number };

export function DashboardCockpit({ name, track, initialProgress }: { name:string; track:string; initialProgress:Progress }) {
  const [progress, setProgress] = useState(initialProgress);
  const [updating, setUpdating] = useState(false);
  const [notice, setNotice] = useState("");
  const percent = Math.round((progress.completed_modules / progress.total_modules) * 100);
  const firstName = name.split(" ")[0];
  const focusHours = `${Math.floor(progress.minutes_this_week/60)}h ${progress.minutes_this_week%60}m`;
  const moduleTitle = useMemo(() => ["Telemetry foundations","Coordinate frames","Control loops","State estimation","Sensor fusion","Fault handling","Mission planning","Flight data pipelines","Simulation","Safety review","Systems integration","Capstone launch"][Math.min(progress.completed_modules,11)], [progress.completed_modules]);
  async function completeModule(){ setUpdating(true); setNotice(""); try { const response=await fetch("/api/progress",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"complete_module"})}); const data=await response.json(); if(!response.ok) throw new Error(data.error||"Could not update progress"); setProgress(data.progress); setNotice("Module logged. Flight path updated."); } catch(error){setNotice(error instanceof Error?error.message:"Update failed");} finally{setUpdating(false);} }
  return <>
    <div className="cockpit-welcome"><div><span className="cockpit-label"><i/> FLIGHT DECK / ONLINE</span><h1>Good to see you,<br/><em>{firstName}.</em></h1><p>Your systems are synced. Continue the mission or explore a new signal.</p></div><div className="cockpit-actions"><Link href="/tracks">Explore tracks ↗</Link></div></div>

    <section className="stat-strip" aria-label="Learning overview"><article><span>ACTIVE TRACK</span><b>{track}</b><small>Intermediate flight path</small></article><article><span>MISSION STREAK</span><b>{progress.streak_days} <em>days</em></b><small>Personal best: 12 days</small></article><article><span>FOCUS THIS WEEK</span><b>{focusHours}</b><small>+42 min vs last week</small></article><article><span>PROJECTS SHIPPED</span><b>{String(progress.projects_shipped).padStart(2,"0")}</b><small>Next review in 3 days</small></article></section>

    <div className="cockpit-grid">
      <Link className="cockpit-card lab-launch-card" href="/flight-lab"><div className="card-label"><span>00 / FLIGHT OPERATIONS LAB</span><b>JUDGE ONLINE</b></div><div className="lab-launch-radar"><i/><i/><span>✦</span></div><h2>Engineer the entire aircraft ecosystem.</h2><p>Solve jet-level systems problems in a browser-isolated code workspace with validation gates and persistent submissions.</p><strong>Enter coding lab <span>↗</span></strong></Link>
      <article className="cockpit-card primary-mission"><div className="card-label"><span>01 / CURRENT MISSION</span><b>LIVE</b></div><div className="mission-main"><div className="progress-dial" style={{"--mission-progress":`${percent*3.6}deg`} as React.CSSProperties}><span>{percent}<small>%</small></span></div><div><small>MODULE {String(progress.completed_modules+1).padStart(2,"0")} OF {progress.total_modules}</small><h2>{moduleTitle}</h2><p>Combine noisy IMU and GPS signals into a stable estimate your controller can trust.</p></div></div><div className="mission-footer"><div><span>EST. TIME</span><b>35 minutes</b></div><div><span>REWARD</span><b>+240 XP</b></div><button onClick={completeModule} disabled={updating||progress.completed_modules>=progress.total_modules}>{progress.completed_modules>=progress.total_modules?"Track complete":updating?"Updating flight path...":"Complete next module ↗"}</button></div>{notice&&<p className="mission-notice" role="status">{notice}</p>}</article>

      <article className="cockpit-card skill-card"><div className="card-label"><span>02 / SKILL TELEMETRY</span><b>LIVE DATA</b></div><h3>Readiness profile</h3><div className="skill-meter"><span><b>Python systems</b><i><em style={{width:"84%"}}/></i><small>84</small></span><span><b>Control theory</b><i><em style={{width:"66%"}}/></i><small>66</small></span><span><b>Flight data</b><i><em style={{width:"72%"}}/></i><small>72</small></span><span><b>Safety testing</b><i><em style={{width:"48%"}}/></i><small>48</small></span></div><Link href="/tracks">Open skill map ↗</Link></article>

      <article className="cockpit-card weekly-card"><div className="card-label"><span>03 / WEEKLY SIGNAL</span><b>186 MIN</b></div><div className="week-chart"><span style={{height:"36%"}}/><span style={{height:"68%"}}/><span style={{height:"48%"}}/><span style={{height:"86%"}}/><span style={{height:"62%"}}/><span style={{height:"24%"}}/><span style={{height:"12%"}}/></div><div className="week-days"><b>M</b><b>T</b><b>W</b><b>T</b><b>F</b><b>S</b><b>S</b></div><p>Strongest focus window: <b>Tuesday, 20:00</b></p></article>

      <article className="cockpit-card session-card"><div className="card-label"><span>04 / NEXT LIVE SESSION</span><b>IN 2 DAYS</b></div><div className="session-date"><strong>18</strong><span>AUG<br/>20:00 IST</span></div><h3>Inside an autopilot</h3><p>Systems teardown with avionics engineer Maya Chen.</p><button type="button">Add to mission plan +</button></article>

      <article className="cockpit-card crew-card"><div className="card-label"><span>05 / CREW TRANSMISSIONS</span><b>12 ONLINE</b></div><div className="crew-feed"><div><span>MC</span><p><b>Maya shipped</b><br/>Swarm mission planner</p><small>08m</small></div><div><span>IB</span><p><b>Idris requested review</b><br/>Turbulence prediction API</p><small>24m</small></div><div><span>AR</span><p><b>Ananya earned</b><br/>Fault Hunter badge</p><small>41m</small></div></div><Link href="/community">Enter the flight deck ↗</Link></article>

      <article className="cockpit-card project-card"><div className="project-radar"><i/><i/><span>✦</span></div><div className="card-label"><span>06 / PROJECT LAUNCHPAD</span><b>CAPSTONE</b></div><h3>Build a live telemetry console.</h3><p>Turn ADS-B signals into a production-ready flight intelligence interface.</p><div><span>Python</span><span>WebSockets</span><span>Maps</span></div><Link href="/tracks">View project brief ↗</Link></article>

      <article className="cockpit-card achievement-card"><div className="card-label"><span>07 / CLEARANCES</span><b>3 OF 12</b></div><div className="badge-row"><span><i>✦</i><b>First Flight</b><small>Earned</small></span><span><i>⌁</i><b>7-Day Signal</b><small>Earned</small></span><span><i>◎</i><b>Code Reviewer</b><small>Earned</small></span><span className="locked"><i>◇</i><b>Autonomy Ace</b><small>Locked</small></span></div></article>
    </div>
    <div className="mentor-heading" id="ai-mentor"><span>08 / AI MISSION SUPPORT</span><h2>Ask Vector when you’re stuck.</h2><p>Debug code, unpack concepts, or shape your next flight-tech project.</p></div><AIMentor/>
  </>;
}
