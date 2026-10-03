import Link from "next/link";
import HackerGlobe from "./components/HackerGlobe";
import { BuildJourney, CommunityFeature } from "./components/CommunityFeature";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

const hackathons = [
  { date:"COMING SOON", mode:"GLOBAL · ONLINE", title:"Agentic AI Build Week", text:"Ship an autonomous workflow that turns intent into action.", tags:["OpenAI","Agents","TypeScript"], accent:"violet" },
  { date:"COMING SOON", mode:"FORMAT TO BE ANNOUNCED", title:"Zero Knowledge Sprint", text:"Build private, verifiable products for an open digital world.", tags:["ZK","Rust","Web3"], accent:"lime" },
  { date:"COMING SOON", mode:"GLOBAL · ONLINE", title:"Edge Intelligence Jam", text:"Take computer vision off the cloud and into the real world.", tags:["Edge AI","Python","Vision"], accent:"orange" },
];

const developers = [
  { initials:"AM", name:"Aanya Mehta", role:"AI Systems Engineer", location:"Bengaluru, IN", stack:"PYTHON · LANGGRAPH · RUST", wins:"AI & automation", color:"#c9ff3d" },
  { initials:"JL", name:"Jonas Lind", role:"Creative Technologist", location:"Stockholm, SE", stack:"THREE.JS · WEBGPU · REACT", wins:"Creative coding", color:"#8c6cff" },
  { initials:"SK", name:"Sofia Kim", role:"Protocol Engineer", location:"Seoul, KR", stack:"RUST · SOLIDITY · ZK", wins:"Protocol design", color:"#ff6d45" },
  { initials:"DO", name:"Diego Ortiz", role:"Product Engineer", location:"Mexico City, MX", stack:"NEXT.JS · GO · POSTGRES", wins:"Product development", color:"#42d7ff" },
];

const projects = [
  { no:"01", title:"Synapse", category:"AI / PRODUCTIVITY", text:"A local-first thinking partner that turns scattered research into connected knowledge.", stack:"Tauri · Rust · Local LLM", metric:"AI WORKSPACE" },
  { no:"02", title:"Proofline", category:"IDENTITY / ZK", text:"Portable proof-of-skill credentials that reveal ability without exposing identity.", stack:"Noir · Next.js · Polygon", metric:"PRIVACY BY DESIGN" },
  { no:"03", title:"TerraScope", category:"CLIMATE / VISION", text:"Open satellite intelligence for detecting environmental change in near real time.", stack:"Python · PyTorch · Mapbox", metric:"OPEN SCIENCE" },
];

export default function Home() {
  return <main className="hf-site"><SiteHeader/>
    <section className="hf-hero shell"><div className="hf-hero-top"><span><i/> THE GLOBAL BUILDER NETWORK</span><span>EST. 2026 — OPEN TO ALL</span></div><div className="hf-hero-grid"><div className="hf-hero-copy"><h1>Big ideas.<br/>Brilliant people.<br/><em>Built together.</em></h1><p>Your next project starts with the right people. Explore emerging tech, find your next challenge, and build with a community that shares your ambition.</p><div className="hf-actions"><Link className="hf-primary" href="/register">Join the network <span>↗</span></Link><a href="#hackathons">Explore hackathons <span>↓</span></a></div><div className="fc-hero-notes"><span>Open to every builder</span><span>Projects over titles</span><span>Build in public</span></div></div><HackerGlobe/></div><div className="hf-ticker"><span>NOW TRENDING</span><div>AGENTIC AI <i/> WEBGPU <i/> ZERO KNOWLEDGE <i/> RUST <i/> EDGE COMPUTING <i/> SPATIAL WEB <i/> LOCAL-FIRST</div></div></section>

    <BuildJourney/>
    <section className="hf-hackathons shell" id="hackathons"><header className="hf-section-head"><div><span>01 / CHALLENGE CONCEPTS</span><h2>A new challenge.<br/><em>A new possibility.</em></h2></div><p>Compete with exceptional builders, learn emerging technology, and turn a weekend prototype into your next breakthrough.</p></header><div className="hf-event-grid">{hackathons.map((event,index)=><article className={`hf-event ${event.accent}`} key={event.title}><div className="hf-event-meta"><span>{event.date}</span><span>{event.mode}</span></div><div className={`fc-event-poster poster-${index}`} aria-hidden="true"><div className="fc-poster-label">FLIGHTCODERS / BUILD SERIES</div><strong>{[<>AGENT<br/>BUILDERS.</>,<>ZERO<br/>LIMITS.</>,<>BEYOND<br/>THE CLOUD.</>][index]}</strong><div className="fc-poster-art"><i/><i/><i/></div><small>{["AUTOMATE THE EXTRAORDINARY","PRIVACY. PROOF. POSSIBILITY.","INTELLIGENCE, EVERYWHERE."][index]}</small></div><h3>{event.title}</h3><p>{event.text}</p><div className="hf-tags">{event.tags.map(tag=><b key={tag}>{tag}</b>)}</div><Link href="/register">Join the community <span>↗</span></Link></article>)}</div></section>

    <section className="hf-radar" id="radar"><div className="shell hf-radar-grid"><div><span>02 / FRONTIER RADAR</span><h2>The stacks<br/>shaping <em>tomorrow.</em></h2><p>Cut through the noise. Follow practical signals, learning paths, and open-source projects across technologies moving from experimental to essential.</p><Link href="/register">Build with these stacks ↗</Link></div><div className="hf-radar-visual" aria-label="Technology radar"><i className="rr r1"/><i className="rr r2"/><i className="rr r3"/><span className="radar-axis x"/><span className="radar-axis y"/><b className="tech t1">AI AGENTS</b><b className="tech t2">WEBGPU</b><b className="tech t3">RUST</b><b className="tech t4">ZK</b><b className="tech t5">EDGE AI</b><strong>2026<br/><small>RADAR</small></strong></div></div></section>

    <section className="hf-builders shell" id="builders"><header className="hf-section-head"><div><span>03 / EXAMPLE BUILDER PROFILES</span><h2>World-class builders.<br/><em>Open profiles.</em></h2></div><p>Discover the people pushing technology forward. Follow their work, study their stacks, and find the right collaborators.</p></header><div className="hf-builder-grid">{developers.map((dev,index)=><article className="hf-builder" key={dev.name}><div className="hf-avatar" style={{"--avatar":dev.color} as React.CSSProperties}><span>{dev.initials}</span><i/></div><div className="hf-builder-index">0{index+1}</div><h3>{dev.name}</h3><p>{dev.role}</p><small>{dev.location}</small><div>{dev.stack}</div><footer><b>{dev.wins}</b><Link href="/register" aria-label={`View ${dev.name}'s profile`}>↗</Link></footer></article>)}</div></section>

    <section className="hf-projects" id="projects"><div className="shell"><header className="hf-project-head"><span>04 / PROJECT INSPIRATION</span><h2>Ideas become<br/><em>real products.</em></h2><Link href="/register">Share your project ↗</Link></header><div className="hf-project-list">{projects.map(project=><article key={project.title}><span>{project.no}</span><div><small>{project.category}</small><h3>{project.title}</h3><p>{project.text}</p></div><div><b>{project.stack}</b><strong>{project.metric}</strong></div><Link href="/register" aria-label={`View ${project.title}`}>↗</Link></article>)}</div></div></section>

    <CommunityFeature/>
    <section className="hf-join shell"><span>THE NEXT BIG THING ISN’T FOUND.</span><h2>It’s <em>built.</em></h2><p>Create your profile. Meet your people. Ship something impossible.</p><Link className="hf-primary" href="/register">Create your builder profile <span>↗</span></Link><div className="hf-join-grid" aria-hidden="true"/></section><SiteFooter/></main>;
}
