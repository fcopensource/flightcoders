import { pageMetadata } from "../../lib/seo";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Portfolio, HireCTA } from "../components/CompanySections";
export const metadata=pageMetadata({title:"Our projects — AI and intelligent software",description:"Explore Veyra Editor, Daemon, CareerFit, and HireLens: selected software projects from FlightCoders.",path:"/projects"});
export default function ProjectsPage(){return <main className="studio-site"><SiteHeader/><section className="studio-section studio-container"><header className="studio-intro"><span className="studio-eyebrow">SOFTWARE PORTFOLIO / BUILT BY FLIGHTCODERS</span><h1>Software built for<br/><em>real work.</em></h1><p>Explore our software portfolio. Contact us to discuss suitability for your organization, customization, deployment, and available commercial terms.</p></header><Portfolio/></section><HireCTA/><SiteFooter/></main>}
