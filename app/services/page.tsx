import { pageMetadata } from "../../lib/seo";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Services, HireCTA } from "../components/CompanySections";
export const metadata=pageMetadata({title:"Software development services",description:"Artificial intelligence systems, intelligent software systems, web applications, SaaS products, and desktop development by FlightCoders.",path:"/services"});
export default function ServicesPage(){return <main className="studio-site"><SiteHeader/><section className="studio-section studio-container"><header className="studio-intro"><span className="studio-eyebrow">SOFTWARE THAT SOLVES SOMETHING</span><h1>Built around<br/><em>your business.</em></h1><p>We take on software development projects from discovery and product design through implementation, testing, and delivery.</p></header><Services/></section><HireCTA/><SiteFooter/></main>}
