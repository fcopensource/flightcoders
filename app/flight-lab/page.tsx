import {requireUser} from "../../lib/auth";
import {FlightIDE} from "../components/FlightIDE";
export const dynamic="force-dynamic";
export default async function FlightLabPage(){const user=await requireUser("/flight-lab");return <main className="flight-lab-page"><div className="lab-topbar"><a href="/dashboard"><span>F/C</span><b>FREE-FLIGHT CODE DECK</b></a><div><i/> PILOT ONLINE · {user.name.toUpperCase()}</div><a href="/dashboard">Exit cockpit ↗</a></div><FlightIDE/></main>}
