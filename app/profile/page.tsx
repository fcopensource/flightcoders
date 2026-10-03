import { requireUser } from "../../lib/auth";
import { getSocialLinks } from "../../lib/profile";
import { ProfileForm } from "../components/ProfileForm";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import "./profile.css";
export default async function ProfilePage() {
 const user=await requireUser("/profile");
 const links=await getSocialLinks(user.id);
 return <main className="hf-site"><SiteHeader/><section className="builder-profile shell"><header><span className="fc-section-label">YOUR SPACE / YOUR STORY</span><h1>Make it <em>yours.</em></h1><p>A little about you. A few links to your work. That’s all you need.</p></header><ProfileForm user={{name:user.name,email:user.email,role:user.role,goal:user.goal}} links={links}/><form action="/api/auth/logout" method="post"><button className="profile-signout">Sign out ↗</button></form></section><SiteFooter/></main>;
}
