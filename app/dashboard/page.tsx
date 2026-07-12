import Link from "next/link";
import { requireUser } from "../../lib/auth";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { AIMentor } from "../components/AIMentor";

export const dynamic = "force-dynamic";

export default async function DashboardPage(){const user=await requireUser("/dashboard");return <main><SiteHeader/><section className="dashboard shell"><div className="dash-head"><div><span>FLIGHT DECK / ACTIVE</span><h1>Good to see you,<br/><em>{user.name.split(" ")[0]}.</em></h1></div><form action="/api/auth/logout" method="post"><button className="signout-button" type="submit">Sign out ↗</button></form></div><div className="dash-grid"><article className="mission-card"><span>CURRENT MISSION</span><div className="mission-visual"><i/><b>42%</b></div><h2>{user.track || "Flight Systems"}</h2><p>Module 05 · Sensor fusion under uncertainty</p><Link className="button" href="/tracks">Continue learning ↗</Link></article><article className="dash-panel"><span>THIS WEEK</span><h3>3 focused sessions</h3><div className="week-bars"><i style={{height:"45%"}}/><i style={{height:"70%"}}/><i/><i style={{height:"55%"}}/><i style={{height:"85%"}}/><i style={{height:"35%"}}/><i style={{height:"20%"}}/></div><small>M T W T F S S</small></article><article className="dash-panel"><span>CREW SIGNAL</span><h3>12 builders online</h3><p>Maya shipped a swarm planner. Idris is reviewing telemetry tools.</p><Link href="/community">Open community ↗</Link></article></div><AIMentor/></section><SiteFooter/></main>}
