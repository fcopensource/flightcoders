const tracks = [
  { number: "01", title: "Flight Systems", text: "Model navigation, telemetry, and the software behind modern aircraft.", meta: "12 modules · Intermediate" },
  { number: "02", title: "Drone Autonomy", text: "Build perception and control loops that take an autonomous vehicle airborne.", meta: "9 modules · Advanced" },
  { number: "03", title: "Aviation Data", text: "Turn real flight data into reliable decisions with Python and modern tooling.", meta: "8 modules · Beginner" },
];

const features = [
  ["⌁", "Learn by shipping", "Every path ends in a working flight-tech project, not another forgotten certificate."],
  ["↗", "Built with experts", "Curriculum shaped by aerospace engineers, pilots, and developers in the field."],
  ["◎", "Find your crew", "Get feedback, pair with peers, and meet builders who speak your language."],
];

// Keep the homepage HTML tied to the current build. Long-lived CDN caching can
// otherwise leave visitors with an old HTML document that references deleted
// hashed CSS assets after a deployment.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="eyebrow"><span className="pulse" /> Enrollment open · Cohort 04</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Where code<br />learns to <em>fly.</em></h1>
            <p>Learn the software powering modern aviation. Build real systems, guided by engineers who ship them.</p>
            <div className="hero-actions"><a className="button" href="#tracks">Explore learning tracks <span>↗</span></a><a className="text-link" href="#method">See how it works <span>↓</span></a></div>
          </div>
          <div className="flight-card" aria-label="Flight code example">
            <div className="card-top"><span><i className="dot red" /><i className="dot amber" /><i className="dot green" /></span><span>autopilot.py</span><span>•••</span></div>
            <pre><code><span className="muted">01</span>  <span className="pink">class</span> <span className="blue">FlightController</span>:<br /><span className="muted">02</span>    <span className="pink">def</span> <span className="blue">navigate</span>(self, waypoint):<br /><span className="muted">03</span>      heading = self.<span className="yellow">calculate</span>(waypoint)<br /><span className="muted">04</span>      self.autopilot.<span className="yellow">engage</span>(heading)<br /><span className="muted">05</span><br /><span className="muted">06</span>  craft = <span className="blue">FlightController</span>(<span className="green-text">"FC-04"</span>)<br /><span className="muted">07</span>  craft.<span className="yellow">navigate</span>(<span className="green-text">"37.7749° N"</span>)<br /><span className="muted">08</span>  <span className="comment"># ready for takeoff_</span></code></pre>
            <div className="radar"><span className="radar-ring r1"/><span className="radar-ring r2"/><span className="radar-cross horizontal"/><span className="radar-cross vertical"/><span className="plane">✦</span></div>
            <div className="telemetry"><span><small>ALTITUDE</small>12,400 <b>FT</b></span><span><small>AIRSPEED</small>268 <b>KT</b></span><span><small>HEADING</small>074 <b>°</b></span></div>
          </div>
        </div>
        <div className="trusted"><span>BUILT FOR THE NEXT GENERATION OF</span><b>AEROSPACE</b><b>AUTONOMY</b><b>ROBOTICS</b><b>FLIGHT DATA</b></div>
      </section>

      <section className="dark-section" id="method">
        <div className="shell">
          <div className="section-kicker">// WHY FLIGHTCODERS</div>
          <div className="section-heading"><h2>Not another coding course.<br /><em>A runway.</em></h2><p>We connect software fundamentals to the machines and missions that make them matter.</p></div>
          <div className="feature-grid">
            {features.map(([icon,title,text], i) => <article className="feature" key={title}><span className="feature-no">0{i+1}</span><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="tracks shell" id="tracks">
        <div className="section-kicker dark">// CHOOSE YOUR FLIGHT PATH</div>
        <div className="section-heading light"><h2>Start where<br />curiosity takes you.</h2><p>Focused learning tracks. Practical challenges. A portfolio that proves you can build.</p></div>
        <div className="track-list">
          {tracks.map(track => <a className="track" href="/tracks" key={track.number}><span className="track-no">{track.number}</span><div><h3>{track.title}</h3><p>{track.text}</p></div><span className="track-meta">{track.meta}</span><span className="track-arrow">↗</span></a>)}
        </div>
      </section>

      <section className="community" id="community">
        <div className="shell community-grid">
          <div className="quote-mark">“</div>
          <blockquote>FlightCoders gave me the bridge between loving aviation and actually building for it. Three months later, I shipped my first telemetry dashboard.</blockquote>
          <div className="person"><span className="avatar">AK</span><span><b>Arjun Kapoor</b><small>Cohort 02 · Avionics developer</small></span></div>
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
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
