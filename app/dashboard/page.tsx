import type { RowDataPacket } from "mysql2";
import { requireUser } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { DashboardCockpit } from "../components/DashboardCockpit";
import { DashboardSidebar } from "../components/DashboardSidebar";

export const dynamic = "force-dynamic";

interface ProgressRow extends RowDataPacket { completed_modules:number; total_modules:number; streak_days:number; minutes_this_week:number; projects_shipped:number; }

export default async function DashboardPage(){
  const user=await requireUser("/dashboard");
  const [rows]=await getDb().execute<ProgressRow[]>("SELECT completed_modules,total_modules,streak_days,minutes_this_week,projects_shipped FROM learning_progress WHERE user_id=? LIMIT 1",[user.id]);
  const progress=rows[0]??{completed_modules:4,total_modules:12,streak_days:7,minutes_this_week:186,projects_shipped:1};
  return <main className="dashboard-page"><DashboardSidebar name={user.name} email={user.email}/><section className="dashboard"><DashboardCockpit name={user.name} track={user.track||"Flight Systems"} initialProgress={progress}/></section></main>;
}
