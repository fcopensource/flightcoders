import Link from "next/link";
import styles from "./page.module.css";

const pillars = [
  {
    number: "01",
    title: "Build real products",
    text: "Work against a clear challenge and finish with software you can demo, explain, and keep improving.",
  },
  {
    number: "02",
    title: "Work with strong builders",
    text: "Meet developers who care about engineering quality, speed, collaboration, and shipping.",
  },
  {
    number: "03",
    title: "Create proof of work",
    text: "Turn your code, product decisions, and final demo into visible evidence of what you can do.",
  },
];

const process = [
  ["01", "Join", "Create your FlightCoders account."],
  ["02", "Choose", "Select a challenge or build track."],
  ["03", "Build", "Design, code, test, and iterate."],
  ["04", "Ship", "Submit a working product and demo."],
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logoMark}>F</span>
          <span>FlightCoders</span>
        </Link>

        <nav className={styles.nav}>
          <a href="#about">About</a>
          <a href="#challenge">Hackathon</a>
          <a href="#process">How it works</a>
        </nav>

        <div className={styles.headerActions}>
          <Link href="/login" className={styles.login}>Log in</Link>
          <Link href="/register" className={styles.join}>Join FlightCoders</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span />
            FLIGHTCODERS BUILD SEASON 01
          </div>

          <h1>
            Build software that
            <span> deserves to ship.</span>
          </h1>

          <p className={styles.heroLead}>
            A focused developer community for hackathons and build sprints.
            Work on real problems, collaborate with serious builders, and finish
            with products that prove what you can do.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className={styles.primaryButton}>Join the next build</Link>
            <a href="#challenge" className={styles.secondaryButton}>Explore the challenge</a>
          </div>

          <div className={styles.heroMeta}>
            <div><strong>48H</strong><span>build sprint format</span></div>
            <div><strong>GLOBAL</strong><span>remote participation</span></div>
            <div><strong>SHIP</strong><span>working demo required</span></div>
          </div>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.panelHeader}>
            <span>build_001</span>
            <span className={styles.live}><i /> open soon</span>
          </div>

          <div className={styles.panelBody}>
            <p className={styles.panelLabel}>NEXT CHALLENGE</p>
            <h2>AI-native<br />developer tools</h2>
            <p className={styles.panelText}>
              Build something useful for developers: agents, tooling, automation,
              evaluation systems, workflows, or infrastructure.
            </p>

            <div className={styles.panelCode}>
              <div><span>01</span><code>idea.select(problem)</code></div>
              <div><span>02</span><code>team.build(product)</code></div>
              <div><span>03</span><code>demo.ship()</code></div>
            </div>
          </div>

          <div className={styles.panelFooter}>
            <span>AI</span><span>DEVTOOLS</span><span>OPEN SOURCE</span>
          </div>
        </div>
      </section>

      <section className={styles.signalStrip}>
        <span>BUILD WITH PURPOSE</span>
        <span>SHIP IN PUBLIC</span>
        <span>LEARN THROUGH DELIVERY</span>
        <span>MEET GREAT BUILDERS</span>
      </section>

      <section className={styles.about} id="about">
        <div className={styles.sectionTag}>01 — WHY FLIGHTCODERS</div>

        <div className={styles.aboutIntro}>
          <h2>Less passive learning.<br />More real engineering.</h2>
          <p>
            FlightCoders is built around execution. Every challenge creates a
            reason to make decisions, write code, debug under pressure, communicate
            trade-offs, and finish something tangible.
          </p>
        </div>

        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <article key={pillar.number}>
              <span className={styles.pillarNumber}>{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.challenge} id="challenge">
        <div className={styles.challengeCopy}>
          <div className={styles.sectionTag}>02 — UPCOMING HACKATHON</div>
          <h2>One weekend.<br />One product.</h2>
          <p>
            The first FlightCoders build sprint focuses on AI-native software,
            developer tooling, and practical automation. Solo builders and small
            teams are welcome.
          </p>
          <Link href="/register" className={styles.challengeLink}>Register interest →</Link>
        </div>

        <div className={styles.challengeDetail}>
          <div className={styles.detailTop}>
            <span>BUILD SPRINT 001</span>
            <span>ONLINE</span>
          </div>

          <div className={styles.detailMain}>
            <span className={styles.detailLabel}>FORMAT</span>
            <strong>48 hours</strong>
            <p>From idea to working demo.</p>
          </div>

          <div className={styles.detailGrid}>
            <div><span>TEAM</span><strong>1–4 builders</strong></div>
            <div><span>FOCUS</span><strong>AI + DevTools</strong></div>
            <div><span>OUTPUT</span><strong>Live demo</strong></div>
            <div><span>ACCESS</span><strong>Global</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.process} id="process">
        <div className={styles.sectionTag}>03 — HOW IT WORKS</div>

        <div className={styles.processIntro}>
          <h2>A simple process.<br />A serious result.</h2>
          <p>No bloated platform and no endless curriculum. The system is designed to move you toward a finished product.</p>
        </div>

        <div className={styles.processGrid}>
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <span className={styles.sectionTag}>FLIGHTCODERS / 2026</span>
          <h2>Build something worth showing.</h2>
          <p>Join the community before the first build sprint opens.</p>
          <Link href="/register" className={styles.ctaButton}>Create your account</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logoMark}>F</span>
          <span>FlightCoders</span>
        </Link>
        <p>Developer hackathons and build sprints.</p>
        <div>
          <Link href="/login">Log in</Link>
          <Link href="/register">Register</Link>
        </div>
      </footer>
    </main>
  );
}
