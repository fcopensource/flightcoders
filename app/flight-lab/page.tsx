import type {RowDataPacket} from "mysql2";
import {requireUser} from "../../lib/auth";
import {getDb} from "../../lib/db";
import {FlightIDE} from "../components/FlightIDE";
export const dynamic="force-dynamic";
interface SolvedRow extends RowDataPacket{challenge_slug:string}
export default async function FlightLabPage(){const user=await requireUser("/flight-lab");const [rows]=await getDb().execute<SolvedRow[]>("SELECT DISTINCT challenge_slug FROM code_submissions WHERE user_id=? AND passed=TRUE",[user.id]);return <main className="flight-lab-page"><div className="lab-topbar"><a href="/dashboard"><span>F/C</span><b>FLIGHT OPERATIONS LAB</b></a><div><i/> SECURE SESSION · {user.name.toUpperCase()}</div><a href="/dashboard">Exit lab ↗</a></div><FlightIDE initialSolved={rows.map(r=>r.challenge_slug)}/></main>}
