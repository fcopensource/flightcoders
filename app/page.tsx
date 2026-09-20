import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

const projects = [
  { tag:"AI / SaaS", title:"Build an AI support agent for a B2B dashboard", budget:"$2.5k–$4k", time:"2–3 weeks", stack:["Next.js","Python","OpenAI"] },
  { tag:"Mobile", title:"Ship a production-ready marketplace app", budget:"$4k–$7k", time:"4–6 weeks", stack:["React Native","Node.js","Postgres"] },
  { tag:"Automation", title:"Automate lead qualification + CRM workflows", budget:"$1.5k–$3k", time:"1–2 weeks", stack:["Salesforce","APIs","AI"] },
];

const steps = [
  ["01","Post the mission","Tell us what you need, your timeline, stack preferences, and budget."],
  ["02","Meet the right crew","FlightCoders matches the project with developers who have relevant shipping experience."],
  ["03","Build in public","Milestones, reviews, communication, and delivery stay visible from kickoff to launch."],
];

const skills = ["AI Engineering","Full-stack","Mobile","Salesforce","Cloud","Data","DevOps","Automation","UI Engineering"];

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="fc-home">
      <SiteHeader />

      <section className="fc-hero shell">
        <div className="fc-grid-noise" aria-hidden="true" />
        <div className="fc-hero-copy">
          <div className="fc-badge"><span /> Developer network is open</div>
          <h1>Great software gets built by the <em>right crew.</em></h1>
          <p>FlightCoders is a developer community where companies bring real projects and proven builders team up to design, build, and ship them.</p>
          <div className="fc-actions">
            <Link className="fc-primary" href="/register">Post a project <span>↗</span></Link>
            <Link className="fc-secondary" href="/projects">Find projects <span>→</span></Link>
          </div>
          <div className="fc-proof">
            <div><strong>600+</strong><span>developers</span></div>
            <div><strong>24+</strong><span>skill domains</span></div>
            <div><strong>Global</strong><span>remote delivery</span></div>
          </div>
        </div>

        <div className="fc-command">
          <div className="fc-command-top"><span>LIVE PROJECT FEED</span><i>● ONLINE</i></div>
          <div className="fc-terminal-line"><small>CLIENT REQUEST</small><b>Need a senior full-stack team for an AI analytics product.</b></div>
          <div className="fc-match-row"><span>01</span><div><b>Backend Architect</b><small>Python · FastAPI · PostgreSQL</small></div><strong>98% MATCH</strong></div>
          <div className="fc-match-row"><span>02</span><div><b>AI Engineer</b><small>LLMs · RAG · Evaluations</small></div><strong>96% MATCH</strong></div>
          <div className="fc-match-row"><span>03</span><div><b>Frontend Engineer</b><small>Next.js · TypeScript · Design systems</small></div><strong>94% MATCH</strong></div>
          <div className="fc-command-foot"><span>CREW ASSEMBLED</span><b>Ready for kickoff →</b></div>
        </div>
      </section>

      <section className="fc-ticker">
        <div>{skills.concat(skills).map((skill,i)=><span key={i}>{skill}<i>✦</i></span>)}</div>
      </section>

      <section className="fc-projects shell" id="projects">
        <div className="fc-section-head">
          <div><span className="fc-kicker">// PROJECT MARKETPLACE</span><h2>Real work.<br/>Real budgets.<br/><em>Real shipping.</em></h2></div>
          <p>No tutorial projects and no endless bidding race. Clients post meaningful work; developers join projects where their skills actually fit.</p>
        </div>
        <div className="fc-project-grid">
          {projects.map((project,index)=>(
            <article className="fc-project-card" key={project.title}>
              <div className="fc-project-top"><span>0{index+1}</span><b>{project.tag}</b></div>
              <h3>{project.title}</h3>
              <div className="fc-project-meta"><span><small>BUDGET</small>{project.budget}</span><span><small>DELIVERY</small>{project.time}</span></div>
              <div className="fc-tags">{project.stack.map(x=><i key={x}>{x}</i>)}</div>
              <Link href="/projects">View mission <span>↗</span></Link>
            </article>
          ))}
        </div>
        <div className="fc-project-cta"><span>Have something that needs to be built?</span><Link href="/register">Post your project →</Link></div>
      </section>

      <section className="fc-how">
        <div className="shell">
          <div className="fc-section-head fc-light">
            <div><span className="fc-kicker">// HOW FLIGHTCODERS WORKS</span><h2>From brief to<br/><em>production.</em></h2></div>
            <p>A focused workflow for serious client work: strong scoping, the right engineering crew, transparent milestones, and accountable delivery.</p>
          </div>
          <div className="fc-steps">
            {steps.map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="fc-community shell">
        <div className="fc-community-copy">
          <span className="fc-kicker">// BUILT FOR DEVELOPERS</span>
          <h2>Your network should create <em>opportunity.</em></h2>
          <p>Build a reputation around shipped work, not follower counts. Meet developers across stacks, join high-quality teams, learn from production code, and grow through real client outcomes.</p>
          <div className="fc-checks"><span>✓ Verified developer profiles</span><span>✓ Project-based collaboration</span><span>✓ Peer code review & mentorship</span><span>✓ Portfolio-worthy delivery</span></div>
          <Link className="fc-primary dark" href="/community">Explore the community <span>↗</span></Link>
        </div>
        <div className="fc-network-card">
          <div className="fc-network-head"><span>FLIGHTCODERS NETWORK</span><b>LIVE</b></div>
          <div className="fc-orbit">
            <span className="fc-node n1">AI</span><span className="fc-node n2">BE</span><span className="fc-node n3">FE</span><span className="fc-node n4">UX</span><span className="fc-node n5">DO</span>
            <div className="fc-core">F/C<small>CREW</small></div>
          </div>
          <div className="fc-network-stats"><span><b>42</b> online now</span><span><b>18</b> active missions</span></div>
        </div>
      </section>

      <section className="fc-client-cta">
        <div className="shell">
          <span className="fc-kicker">// BUILD WITH FLIGHTCODERS</span>
          <h2>You bring the problem.<br/><em>We bring the crew.</em></h2>
          <p>From MVPs to production systems, assemble engineers who can move from idea to deployment without the agency overhead.</p>
          <div className="fc-actions center"><Link className="fc-primary white" href="/register">Start a project <span>↗</span></Link><Link className="fc-secondary light" href="/about">How we work <span>→</span></Link></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
