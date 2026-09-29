import Link from "next/link";
import styles from "./page.module.css";

const principles = [
  { number: "01", title: "Build under pressure", text: "A clear brief, a real deadline, and enough constraint to force good decisions." },
  { number: "02", title: "Ship something visible", text: "Finish with a working product, public demo, and repository you can actually show." },
  { number: "03", title: "Meet serious builders", text: "Work around developers who care about craft, momentum, and finishing what they start." },
];

const flow = [
  ["01", "Join", "Create your FlightCoders account."],
  ["02", "Choose", "Pick a challenge worth solving."],
  ["03", "Build", "Turn an idea into working software."],
  ["04", "Ship", "Demo it, publish it, improve it."],
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark}>FC</span>
          <span>FlightCoders</span>
        </Link>
        <nav className={styles.nav}>
          <a href="#why">Why</a>
          <a href="#challenge">Challenge</a>
          <a href="#how">How it works</a>
        </nav>
        <div className={styles.authLinks}>
          <Link href="/login" className={styles.login}>Login</Link>
          <Link href="/register" className={styles.join}>Join now ↗</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <div className={styles.status}><i /> FLIGHTCODERS / BUILD SEASON 01</div>
          <h1>Built for builders<br /><span>who finish.</span></h1>
          <p>FlightCoders is a focused developer community for hackathons and build sprints. Less watching. More making, shipping, and proving what you can do.</p>
          <div className={styles.heroActions}>
            <Link href="/register" className={styles.primary}>Enter FlightCoders ↗</Link>
            <a href="#challenge" className={styles.secondary}>See the next mission ↓</a>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="FlightCoders build board">
          <div className={styles.visualTop}><span>MISSION_CONTROL</span><span>LIVE / 01</span></div>
          <div className={styles.visualCore}>
            <span className={styles.visualLabel}>NEXT BUILD</span>
            <strong>48H</strong>
            <p>IDEA → CODE → DEMO</p>
            <div className={styles.progress}><i /></div>
          </div>
          <div className={styles.visualFooter}><span>AI / OPEN SOURCE / DEVTOOLS</span><b>READY_</b></div>
          <span className={styles.orbitOne} />
          <span className={styles.orbitTwo} />
          <span className={styles.spark}>✦</span>
        </div>

        <div className={styles.heroStamp} aria-hidden="true"><span>MAKE</span><b>↘</b><span>SHIP</span></div>
      </section>

      <div className={styles.marquee}>
        <div>BUILD FAST <i>✦</i> THINK CLEARLY <i>✦</i> SHIP PUBLICLY <i>✦</i> FIND YOUR PEOPLE <i>✦</i> REPEAT</div>
      </div>

      <section className={styles.why} id="why">
        <div className={styles.sectionMeta}>01 / THE POINT</div>
        <div className={styles.whyIntro}>
          <h2>Turn skill into<br /><span>proof of work.</span></h2>
          <p>Tutorials can teach syntax. Building teaches judgment. FlightCoders creates the environment where developers have to decide, implement, debug, present, and finish.</p>
        </div>
        <div className={styles.principles}>
          {principles.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.challenge} id="challenge">
        <div className={styles.challengeIntro}>
          <div className={styles.sectionMeta}>02 / NEXT MISSION</div>
          <h2>One weekend.<br />One thing worth shipping.</h2>
          <p>The first FlightCoders build sprint is designed around AI-native software, developer tools, and useful automation. Bring an idea or find a teammate.</p>
        </div>

        <div className={styles.challengeCard}>
          <div className={styles.cardHeader}><span>BUILD SPRINT / 001</span><b>OPEN SOON</b></div>
          <div className={styles.cardBody}>
            <span className={styles.cardEyebrow}>GLOBAL · ONLINE</span>
            <h3>Build something<br />people would use.</h3>
            <p>48 hours. Solo or team. Working demo required.</p>
          </div>
          <div className={styles.cardTags}><span>AI + AGENTS</span><span>DEVTOOLS</span><span>OPEN SOURCE</span></div>
          <Link href="/register" className={styles.cardCta}>Claim your spot <span>↗</span></Link>
        </div>
      </section>

      <section className={styles.how} id="how">
        <div className={styles.sectionMeta}>03 / HOW IT WORKS</div>
        <div className={styles.howTitle}>
          <h2>Simple loop.<br /><span>Serious output.</span></h2>
          <p>No bloated platform. No endless curriculum. Join, pick a challenge, build, and ship.</p>
        </div>
        <div className={styles.flow}>
          {flow.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.finalBadge}>FC / 2026</div>
        <h2>Your next project<br />needs a deadline.</h2>
        <p>Create an account. We will handle the pressure.</p>
        <Link href="/register" className={styles.finalButton}>Join FlightCoders ↗</Link>
        <span className={styles.finalRing} aria-hidden="true" />
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}><span className={styles.mark}>FC</span><span>FlightCoders</span></Link>
        <p>Build. Ship. Repeat.</p>
        <div><Link href="/login">Login</Link><Link href="/register">Register</Link></div>
      </footer>
    </main>
  );
}
