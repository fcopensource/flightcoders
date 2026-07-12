import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const sections=[
  ["01", "What we collect", "When you create an account, we store your name, email address, securely hashed password, role, learning goal, and track preferences. We also store session and AI mentor conversation records needed to provide the service."],
  ["02", "How we use it", "We use this information to operate your account, personalize learning recommendations, record program progress, support the community, prevent abuse, and improve FlightCoders."],
  ["03", "How information is stored", "Member data is stored in our protected application database. Passwords are one-way hashed and session cookies are HTTP-only. We apply access controls and keep data only as long as it supports the purposes described here."],
  ["04", "Sharing", "We do not sell personal information. We share limited data with infrastructure providers that run FlightCoders. When you use Vector, your prompt is sent to our configured AI provider, Groq, to generate the response. We may also disclose data when required by law."],
  ["05", "Your choices", "You may request access, correction, export, or deletion of your profile. You can also leave optional profile fields blank and sign out at any time."],
  ["06", "Contact", "For privacy questions or account requests, email privacy@flightcoders.dev. We aim to acknowledge privacy requests within seven business days."],
];

export default function PrivacyPage(){return <main><SiteHeader/><article className="legal shell"><div className="legal-head"><div><span>LEGAL / 01</span><h1>Privacy<br/><em>policy.</em></h1></div><p>Effective July 12, 2026<br/>Last updated July 12, 2026</p></div><div className="legal-intro">This policy explains what FlightCoders collects, why we use it, and the choices you have. It is written for humans, not just lawyers.</div><div className="legal-sections">{sections.map(([no,title,text])=><section key={no}><span>{no}</span><div><h2>{title}</h2><p>{text}</p></div></section>)}</div></article><SiteFooter/></main>}
