const tracks = [
  { number: "01", title: "Coding Foundations", text: "Strengthen programming fundamentals through guided challenges and practical projects.", meta: "12 modules · Beginner" },
  { number: "02", title: "Data Structures & Algorithms", text: "Advance from core patterns to confident problem solving with structured practice.", meta: "9 modules · Intermediate" },
  { number: "03", title: "Software Engineering Projects", text: "Apply your skills in portfolio-ready projects using modern developer tools.", meta: "8 modules · Advanced" },
];

const features = [
  ["⌁", "Learn by building", "Every flight level turns concepts into working code and portfolio-ready projects."],
  ["↗", "Progress with purpose", "A structured path helps computer science and engineering students know what to learn next."],
  ["◎", "Practice with feedback", "Solve focused challenges, test your code, and learn from a community of builders."],
];

interface HomePost extends RowDataPacket { slug:string; title:string; excerpt:string; category:string; published_at:Date }
interface HomeProject extends RowDataPacket { slug:string; name:string; tagline:string; technologies:string; accent_color:string }

// Keep the homepage HTML tied to the current build. Long-lived CDN caching can
// otherwise leave visitors with an old HTML document that references deleted
// hashed CSS assets after a deployment.
export const metadata: Metadata = {
  title: "FlightCoders | Coding Practice for CS & Engineering Students",
  description:
    "Level up your coding skills through structured challenges and practical projects for computer science and engineering students.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const db=getDb();
  const [[posts],[projects]]=await Promise.all([
    db.execute<HomePost[]>("SELECT slug,title,excerpt,category,published_at FROM blog_posts WHERE published=TRUE ORDER BY published_at DESC,id DESC LIMIT 3"),
    db.execute<HomeProject[]>("SELECT slug,name,tagline,technologies,accent_color FROM projects WHERE featured=TRUE ORDER BY launched_at DESC,id DESC LIMIT 2"),
  ]);
  return (
    <main>
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="hero-atmosphere" aria-hidden="true"><span className="flight-arc arc-one"><i>✦</i></span><span className="flight-arc arc-two"/><span className="hero-coordinate">37.7749° N / 122.4194° W</span></div>
        <div className="eyebrow"><span className="pulse" /> Enrollment open · Cohort 04</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Level up your<br />coding <em>skills.</em></h1>
            <p>Advance through structured flight levels built for computer science and engineering students. Practice real coding, complete projects, and build skills you can prove.</p>
            <div className="hero-actions"><a className="button" href="#tracks">Explore learning tracks <span>↗</span></a><a className="text-link" href="#method">See how it works <span>↓</span></a></div>
          </div>
          <div className="flight-card" aria-label="Flight code example">
            <div className="card-top"><span><i className="dot red" /><i className="dot amber" /><i className="dot green" /></span><span>autopilot.py</span><span>•••</span></div>
            <pre><code><span className="muted">01</span>  <span className="pink">class</span> <span className="blue">FlightController</span>:<br /><span className="muted">02</span>    <span className="pink">def</span> <span className="blue">navigate</span>(self, waypoint):<br /><span className="muted">03</span>      heading = self.<span className="yellow">calculate</span>(waypoint)<br /><span className="muted">04</span>      self.autopilot.<span className="yellow">engage</span>(heading)<br /><span className="muted">05</span><br /><span className="muted">06</span>  craft = <span className="blue">FlightController</span>(<span className="green-text">"FC-04"</span>)<br /><span className="muted">07</span>  craft.<span className="yellow">navigate</span>(<span className="green-text">"37.7749° N"</span>)<br /><span className="muted">08</span>  <span className="comment"># ready for takeoff_</span></code></pre>
            <div className="radar"><span className="radar-ring r1"/><span className="radar-ring r2"/><span className="radar-cross horizontal"/><span className="radar-cross vertical"/><span className="plane">✦</span></div>
            <div className="telemetry"><span><small>ALTITUDE</small>12,400 <b>FT</b></span><span><small>AIRSPEED</small>268 <b>KT</b></span><span><small>HEADING</small>074 <b>°</b></span></div>
          </div>
        </div>
        <div className="trusted"><span>THE CODING PLATFORM FOR</span><b>COMPUTER SCIENCE</b><b>ENGINEERING STUDENTS</b><b>CODING PRACTICE</b><b>REAL PROJECTS</b></div>
      </section>

      <CodeLab/>

      <section className="dark-section" id="method">
        <div className="shell">
          <div className="section-kicker">// WHY FLIGHTCODERS</div>
          <div className="section-heading"><h2>Not another coding course.<br /><em>A flight plan.</em></h2><p>Follow a clear progression from fundamentals to practical developer skills, one flight level at a time.</p></div>
          <div className="feature-grid">
            {features.map(([icon,title,text], i) => <article className="feature" key={title}><span className="feature-no">0{i+1}</span><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="tracks shell" id="tracks">
        <div className="section-kicker dark">// CHOOSE YOUR CODING FLIGHT PATH</div>
        <div className="section-heading light"><h2>Start where<br />curiosity takes you.</h2><p>Focused learning tracks. Practical challenges. A portfolio that proves you can build.</p></div>
        <div className="track-list">
          {tracks.map(track => <a className="track" href="/tracks" key={track.number}><span className="track-no">{track.number}</span><div><h3>{track.title}</h3><p>{track.text}</p></div><span className="track-meta">{track.meta}</span><span className="track-arrow">↗</span></a>)}
        </div>
      </section>

      <section className="engineering-proof">
        <div className="shell proof-head"><div><span>// PRACTICE, NOT PASSIVE WATCHING</span><h2>Build skills through<br/><em>real code.</em></h2></div><p>FlightCoders helps CS and engineering learners progress through hands-on challenges, measurable outcomes, deliberate debugging, and projects that stand up to review.</p></div>
        <div className="shell proof-stats"><article><strong>24+</strong><span>BUILD SYSTEMS<br/>IN THE LAB</span></article><article><strong>600+</strong><span>GLOBAL<br/>DEVELOPERS</span></article><article><strong>18</strong><span>EXPERT-LED<br/>REVIEWS</span></article><article><strong>92%</strong><span>SHIP A<br/>CAPSTONE</span></article></div>
        <div className="tech-marquee" aria-label="Technology coverage"><div>PYTHON <i/> TYPESCRIPT <i/> JAVASCRIPT <i/> C++ <i/> SQL <i/> DATA STRUCTURES <i/> ALGORITHMS <i/> GIT <i/> DEBUGGING <i/> SOFTWARE PROJECTS</div></div>
      </section>

      <section className="home-projects shell">
        <div className="home-section-intro"><span>// SHIPPED BY FLIGHTCODERS</span><h2>We teach builders.<br/>We build, too.</h2><Link href="/projects">Explore all products ↗</Link></div>
        <div className="home-project-grid">{projects.map((project,index)=><Link href={`/projects/${project.slug}`} className="home-project" key={project.slug} style={{"--project-accent":project.accent_color} as React.CSSProperties}><span>0{index+1} / LIVE PRODUCT</span><div className="home-project-mark">{project.name.slice(0,1)}</div><h3>{project.name}</h3><p>{project.tagline}</p><div>{project.technologies.split(",").slice(0,4).map(item=><b key={item}>{item.trim()}</b>)}</div><strong>View case study ↗</strong></Link>)}</div>
      </section>

      <section className="home-notes">
        <div className="shell home-notes-inner"><div className="home-section-intro"><span>// LATEST FLIGHT NOTES</span><h2>Engineering signals<br/>worth keeping.</h2><Link href="/blog">Browse the technical library ↗</Link></div><div className="home-note-list">{posts.map((post,index)=><article key={post.slug}><span>{String(index+1).padStart(2,"0")}</span><div><small>{post.category} · {new Date(post.published_at).toLocaleDateString("en",{month:"short",day:"2-digit"})}</small><h3>{post.title}</h3><p>{post.excerpt}</p></div><Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>↗</Link></article>)}</div></div>
      </section>

      <section className="community" id="community">
        <div className="shell community-grid">
          <div className="quote-mark">“</div>
          <blockquote>FlightCoders gave me a clear path from learning concepts to building working projects. I always knew which skill to tackle next.</blockquote>
          <div className="person"><span className="avatar">AK</span><span><b>Arjun Kapoor</b><small>Cohort 02 · Engineering student</small></span></div>
          <div className="community-stat"><strong>600+</strong><span>builders<br />worldwide</span></div>
        </div>
      </section>

      <section className="cta" id="join">
        <div className="shell cta-inner"><span className="orbit one"/><span className="orbit two"/><div className="section-kicker">// YOUR NEXT MISSION</div><h2>Ready for<br /><em>takeoff?</em></h2><p>Join Cohort 04. Applications close August 24.</p><a className="button white" href="/register">Apply to FlightCoders <span>↗</span></a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import Link from "next/link";
import { getDb } from "../lib/db";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CodeLab } from "./components/CodeLab";
