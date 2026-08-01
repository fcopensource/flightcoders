import {requireUser} from "../../../lib/auth";
import {DashboardSidebar} from "../../components/DashboardSidebar";
import {PracticeIDE} from "../../components/PracticeIDE";
export const dynamic="force-dynamic";
export default async function PracticePage(){const user=await requireUser("/dashboard/ide");return <main className="dashboard-page"><DashboardSidebar name={user.name} email={user.email}/><section className="dashboard" style={{paddingTop:32}}><PracticeIDE/></section></main>}
