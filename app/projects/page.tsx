import { pageMetadata } from "../../lib/seo";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Portfolio, HireCTA } from "../components/CompanySections";
export const metadata=pageMetadata({title:"Our projects — AI and intelligent software",description:"Explore Veyra Editor, Daemon, CareerFit, and HireLens: selected software projects from FlightCoders.",path:"/projects"});
export default function ProjectsPage(){return <main className="hf-site"><SiteHeader/><section className="company-section shell"><header className="company-intro"><span className="fc-section-label">OUR WORK / FOUR SELECTED PROJECTS</span><h1>Ideas, engineered<br/><em>into products.</em></h1><p>Our own products and engineering projects demonstrate the kinds of systems we can build with you. Explore the work and the code behind it.</p></header><Portfolio/></section><HireCTA/><SiteFooter/></main>}
