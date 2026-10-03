import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { CommunityFeed } from "../components/CommunityFeed";
import "./network.css";
export const metadata={title:"Developer community",description:"Share projects, ask questions, and find collaborators in the FlightCoders developer community."};
export default function CommunityPage(){return <main className="hf-site"><SiteHeader/><div className="network-public shell"><section className="network-welcome"><span className="network-eyebrow">DIFFERENT PLACES. SHARED POSSIBILITY.</span><h1>Great things start<br/><em>with a conversation.</em></h1><p>A gathering place for curious developers. Share what you’re making, explore ideas, and find people to build with.</p></section><CommunityFeed/></div><SiteFooter/></main>;}
