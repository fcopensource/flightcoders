import Link from "next/link";
import {notFound} from "next/navigation";
import {requireUser} from "../../../lib/auth";
import {flightChallenges} from "../../../lib/flightChallenges";
import {radarMission} from "../../../lib/flightMission";
import {FlightIDE} from "../../components/FlightIDE";
import {ChallengeIDE} from "../../components/ChallengeIDE";

export const dynamic="force-dynamic";
type PageProps={params:Promise<{slug:string}>};

export default async function FlightProblemPage({params}:PageProps){
 const {slug}=await params;
 const user=await requireUser(`/flight-lab/${slug}`);
 const topbar=<div className="lab-topbar"><Link href="/flight-lab"><span>F/C</span><b>← ALL PROBLEMS</b></Link><div><i/> PILOT ONLINE · {user.name.toUpperCase()}</div><Link href="/dashboard">Exit cockpit ↗</Link></div>;
 if(slug===radarMission.slug)return <main className="flight-lab-page">{topbar}<FlightIDE/></main>;
 const problem=flightChallenges.find(item=>item.slug===slug);
 if(!problem)notFound();
 return <main className="flight-lab-page">{topbar}<ChallengeIDE problem={problem}/></main>;
}
