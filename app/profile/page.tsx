import { requireUser } from "../../lib/auth";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileForm } from "../components/ProfileForm";
export const dynamic="force-dynamic";
export default async function ProfilePage(){const user=await requireUser("/profile");return <main><SiteHeader/><section className="form-page shell"><div className="form-copy"><span>// PILOT PROFILE</span><h1>Your mission,<br/><em>calibrated.</em></h1><p>Keep your role, learning path, and career target current so FlightCoders can personalize your dashboard and AI guidance.</p></div><ProfileForm user={{name:user.name,email:user.email,role:user.role,track:user.track,goal:user.goal}}/></section><SiteFooter/></main>}
