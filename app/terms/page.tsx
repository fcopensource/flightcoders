import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const sections=[
  ["01", "Your account", "You must provide accurate information, keep access to your sign-in identity secure, and notify us if you believe your account is being misused. You are responsible for activity performed through your account."],
  ["02", "Learning content", "FlightCoders grants you a personal, limited, non-transferable license to use course materials while your access is active. You may showcase your own project work, but may not redistribute paid curriculum or assessments."],
  ["03", "Community conduct", "Build openly and critique generously. Harassment, plagiarism, deliberate disruption, unsafe experimentation, and attempts to access another member’s data are not permitted."],
  ["04", "Safety", "Coursework is educational and must not be treated as certified aviation guidance. Do not deploy code to operational aircraft or conduct physical flight tests without appropriate supervision, authorization, and safety controls."],
  ["05", "Service changes", "We may improve, add, or retire features and learning content. When a material change affects paid access, we will provide reasonable notice and a practical transition where possible."],
  ["06", "Liability and contact", "The service is provided as available to the extent permitted by law. For questions about these terms, contact legal@flightcoders.dev."],
];

export default function TermsPage(){return <main><SiteHeader/><article className="legal shell"><div className="legal-head"><div><span>LEGAL / 02</span><h1>Terms of<br/><em>use.</em></h1></div><p>Effective July 12, 2026<br/>Last updated July 12, 2026</p></div><div className="legal-intro">These terms are the operating agreement between you and FlightCoders. By using the site, you agree to follow them.</div><div className="legal-sections">{sections.map(([no,title,text])=><section key={no}><span>{no}</span><div><h2>{title}</h2><p>{text}</p></div></section>)}</div></article><SiteFooter/></main>}
