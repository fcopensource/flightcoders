import Link from "next/link";
import {notFound} from "next/navigation";
import {requireUser} from "../../../lib/auth";
import {flightChallenges} from "../../../lib/flightChallenges";
import {radarMission} from "../../../lib/flightMission";
import {FlightIDE} from "../../components/FlightIDE";

export const dynamic="force-dynamic";

type PageProps={params:Promise<{slug:string}>};

export default async function FlightProblemPage({params}:PageProps){
 const {slug}=await params;
 const user=await requireUser(`/flight-lab/${slug}`);
 if(slug===radarMission.slug){
  return <main className="flight-lab-page"><div className="lab-topbar"><Link href="/flight-lab"><span>F/C</span><b>← ALL PROBLEMS</b></Link><div><i/> PILOT ONLINE · {user.name.toUpperCase()}</div><Link href="/dashboard">Exit cockpit ↗</Link></div><FlightIDE/></main>;
 }
 const problem=flightChallenges.find(item=>item.slug===slug);
 if(!problem)notFound();
 return <main className="problem-detail-page">
  <div className="problem-detail-topbar"><Link href="/flight-lab"><span>F/C</span><b>← ALL PROBLEMS</b></Link><div><i/> PILOT ONLINE · {user.name.toUpperCase()}</div><Link href="/dashboard">Dashboard ↗</Link></div>
  <section className="problem-detail-shell">
   <header><div><small>{problem.system}</small><h1>{problem.title}</h1><p>{problem.brief}</p></div><aside><span>DIFFICULTY</span><b>{problem.difficulty}</b><span>REWARD</span><b>{problem.xp} XP</b><em>MISSION PREVIEW</em></aside></header>
   <div className="problem-detail-grid"><article><h2>Flight contract</h2><p className="contract">{problem.contract}</p><h2>Operational constraints</h2><ul>{problem.constraints.map(item=><li key={item}>{item}</li>)}</ul><h2>Starter implementation</h2><pre><code>{problem.starter}</code></pre></article><aside><div className="preview-panel"><span>COMPILER STATUS</span><b>MISSION INTEGRATION PENDING</b><p>This problem specification is available now. Its dedicated automated judge and cockpit simulation will be connected in a future Flight Lab update.</p></div><Link href="/flight-lab/radar-blackout-recovery">Open live radar mission <i>→</i></Link></aside></div>
  </section>
  <style>{`
   .problem-detail-page{min-height:100vh;background:#060b14;color:#edf4ff;padding-bottom:70px}.problem-detail-topbar{height:68px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1d2b42;background:#09111f}.problem-detail-topbar a{color:#dbe8ff;text-decoration:none;display:flex;align-items:center;gap:10px;font-size:13px}.problem-detail-topbar a span{display:grid;place-items:center;width:34px;height:34px;border:1px solid #34527d;border-radius:8px;color:#75a8ff;font-weight:900}.problem-detail-topbar div{color:#7890af;font-size:11px;font-weight:800;letter-spacing:.1em}.problem-detail-topbar div i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#58dc94;box-shadow:0 0 12px #58dc94;margin-right:7px}.problem-detail-shell{max-width:1320px;margin:auto;padding:65px 5vw}.problem-detail-shell>header{display:grid;grid-template-columns:1fr 230px;gap:60px;padding-bottom:45px;border-bottom:1px solid #20314a}.problem-detail-shell>header small{color:#719cff;font-weight:900;letter-spacing:.14em}.problem-detail-shell h1{font-size:clamp(38px,5vw,68px);line-height:1.05;margin:14px 0 18px}.problem-detail-shell>header p{color:#8a9ab1;font-size:18px;line-height:1.75;max-width:850px}.problem-detail-shell>header aside{border:1px solid #263b59;border-radius:14px;padding:22px;background:#0c1524;display:grid;gap:7px;align-content:start}.problem-detail-shell>header aside span{color:#667b98;font-size:9px;font-weight:900;letter-spacing:.13em;margin-top:7px}.problem-detail-shell>header aside b{font-size:15px;color:#cfe0ff}.problem-detail-shell>header aside em{font-style:normal;color:#dfb15d;border:1px solid rgba(223,177,93,.3);background:rgba(223,177,93,.08);font-size:9px;font-weight:900;letter-spacing:.1em;padding:8px;border-radius:7px;text-align:center;margin-top:12px}.problem-detail-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:42px;padding-top:45px}.problem-detail-grid article h2{font-size:18px;margin:0 0 14px;color:#dbe8ff}.problem-detail-grid article h2:not(:first-child){margin-top:38px}.contract{padding:18px;border:1px solid #29415f;border-left:3px solid #6e9eff;border-radius:8px;background:#0b1524;color:#aebed5;line-height:1.7}.problem-detail-grid ul{display:grid;gap:11px;padding-left:20px;color:#91a2b9}.problem-detail-grid pre{overflow:auto;padding:22px;border:1px solid #213552;border-radius:12px;background:#050a12;color:#a9c7ff;line-height:1.7}.problem-detail-grid>aside{display:grid;align-content:start;gap:15px}.preview-panel{padding:22px;border:1px solid #293c58;border-radius:12px;background:linear-gradient(145deg,#0e192a,#09111d)}.preview-panel span{color:#7389a7;font-size:9px;font-weight:900;letter-spacing:.13em}.preview-panel b{display:block;color:#e2b967;font-size:13px;margin:10px 0}.preview-panel p{color:#8294ad;font-size:13px;line-height:1.65}.problem-detail-grid>aside>a{padding:15px 17px;border-radius:9px;background:#315ff2;color:white;text-decoration:none;font-size:13px;font-weight:850;display:flex;justify-content:space-between}.problem-detail-grid>aside>a i{font-style:normal;font-size:18px}@media(max-width:850px){.problem-detail-topbar{padding:0 18px}.problem-detail-topbar div{display:none}.problem-detail-shell{padding:45px 20px}.problem-detail-shell>header,.problem-detail-grid{grid-template-columns:1fr}.problem-detail-shell>header{gap:25px}.problem-detail-grid{gap:25px}}
  `}</style>
 </main>;
}
