import Link from "next/link";
import styles from "./page.module.css";

const hackathons = [
  {
    tag: "OPEN",
    format: "ONLINE",
    title: "FlightCoders AI Build Sprint",
    description:
      "Build an AI-first developer tool, workflow, or product and ship a working demo with a public repo.",
    meta: ["48 hours", "Solo or teams", "Coming soon"],
    accent: "mint",
  },
  {
    tag: "NEXT",
    format: "OPEN SOURCE",
    title: "Open Source Flight Challenge",
    description:
      "Find a real issue, contribute to an open project, and turn your pull request into a portfolio-quality story.",
    meta: ["Global", "Mentor reviews", "Season 01"],
    accent: "lavender",
  },
  {
    tag: "SOON",
    format: "HYBRID",
    title: "Autonomous Systems Weekend",
    description:
      "Prototype software for robotics, drones, navigation, computer vision, telemetry, or simulation.",
    meta: ["Builder teams", "Demo day", "Season 01"],
    accent: "coral",
  },
];

const tracks = [
  {
    number: "01",
    title: "AI + Agents",
    text: "Build useful AI systems, copilots, agents, evaluation tools, and developer infrastructure.",
  },
  {
    number: "02",
    title: "Open Source",
    text: "Fix real issues, ship pull requests, collaborate in public, and earn proof of work.",
  },
  {
    number: "03",
    title: "Developer Tools",
    text: "Create IDE extensions, APIs, automation, observability, testing, or engineering workflows.",
  },
  {
    number: "04",
    title: "Autonomous Systems",
    text: "Explore robotics, computer vision, drones, telemetry, simulation, and intelligent control.",
  },
];

const steps = [
  ["01", "Join", "Create your FlightCoders profile and choose the hackathon you want to enter."],
  ["02", "Build", "Pick a track, form a team, use the resources, and turn your idea into working software."],
  ["03", "Ship", "Publish the project, document the engineering decisions, and submit a live demo."],
  ["04", "Show", "Present what you built, meet other developers, and keep the project moving after demo day."],
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.announcement}>
        <span>⚡ FLIGHTCODERS HACKATHON SEASON 01</span>
        <span className={styles.announcementDesktop}>Build something real. Ship it in public.</span>
        <Link href="/register">Join the community ↗</Link>
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="FlightCoders home">
          <span className={styles.brandMark}>&lt;/&gt;</span>
          <span>FlightCoders</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#hackathons">Hackathons</a>
          <a href="#tracks">Tracks</a>
          <Link href="/community">Community</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link href="/login" className={styles.loginLink}>Sign in</Link>
          <Link href="/register" className={styles.navButton}>Join FlightCoders ↗</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroNoise} aria-hidden="true" />
        <div className={styles.cityRail} aria-hidden="true">
          <span>DELHI</span><i />
          <span>BANGALORE</span><i />
          <span>LONDON</span><i />
          <span>NEW YORK</span><i />
          <span>ONLINE</span>
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroPills} aria-label="FlightCoders values">
            <span className={styles.pillCoral}>CODE</span>
            <span className={styles.pillMint}>CREATE</span>
            <span className={styles.pillLavender}>CONNECT</span>
          </div>

          <p className={styles.heroEyebrow}>Hackathons for developers who would rather build than just watch tutorials.</p>
          <h1>
            Build bold ideas.<br />
            <span>Ship real projects.</span>
          </h1>
          <p className={styles.heroText}>
            FlightCoders is a builder community for hackathons, open-source challenges, technical
            meetups, and projects that turn skills into visible proof of work.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className={styles.primaryButton}>Enter the next hackathon ↗</Link>
            <a href="#hackathons" className={styles.secondaryButton}>Explore events ↓</a>
          </div>

          <div className={styles.heroStats}>
            <div><strong>01</strong><span>Hackathon season</span></div>
            <div><strong>04</strong><span>Builder tracks</span></div>
            <div><strong>∞</strong><span>Ideas worth shipping</span></div>
          </div>
        </div>

        <div className={styles.heroSticker} aria-hidden="true">
          <span>BUILD</span>
          <strong>→</strong>
          <span>SHIP</span>
        </div>
      </section>

      <section className={styles.impact}>
        <div className={styles.sectionLabel}>01 / WHY FLIGHTCODERS</div>
        <div className={styles.impactGrid}>
          <div>
            <h2>Where ideas become<br /><span>working software.</span></h2>
          </div>
          <div className={styles.impactCopy}>
            <p>
              Skip passive learning. Every FlightCoders event is designed around a deadline,
              a real problem, a public build, and feedback from people who care about engineering.
            </p>
            <Link href="/community">Meet the community ↗</Link>
          </div>
        </div>

        <div className={styles.metricGrid}>
          <article><span>BUILD</span><strong>Real projects</strong><p>Leave with something you can demo, explain, and continue improving.</p></article>
          <article><span>LEARN</span><strong>By shipping</strong><p>Use constraints, feedback, code review, and deadlines to learn faster.</p></article>
          <article><span>CONNECT</span><strong>With builders</strong><p>Find collaborators across software, AI, open source, and emerging tech.</p></article>
          <article><span>PROVE</span><strong>Your skills</strong><p>Turn repositories, demos, and technical decisions into visible proof of work.</p></article>
        </div>
      </section>

      <section className={styles.hackathons} id="hackathons">
        <div className={styles.sectionTop}>
          <div>
            <div className={styles.sectionLabel}>02 / HACKATHONS</div>
            <h2>Pick a challenge.<br />Start building.</h2>
          </div>
          <p>New hackathons will rotate through AI, open source, developer tooling, autonomous systems, and experimental software.</p>
        </div>

        <div className={styles.eventGrid}>
          {hackathons.map((event, index) => (
            <article
              key={event.title}
              className={[styles.eventCard, styles[event.accent as keyof typeof styles]].join(" ")}
            >
              <div className={styles.eventTop}>
                <span className={styles.eventIndex}>0{index + 1}</span>
                <span className={styles.eventTag}>{event.tag}</span>
              </div>
              <div className={styles.eventFormat}>{event.format}</div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className={styles.eventMeta}>
                {event.meta.map((item) => <span key={item}>{item}</span>)}
              </div>
              <Link href="/register" className={styles.eventLink}>View challenge <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.marquee} aria-label="FlightCoders hackathon topics">
        <div>
          AI &amp; AGENTS <i>✦</i> OPEN SOURCE <i>✦</i> DEVELOPER TOOLS <i>✦</i>
          ROBOTICS <i>✦</i> COMPUTER VISION <i>✦</i> CLOUD <i>✦</i> FULL STACK <i>✦</i>
          AUTONOMOUS SYSTEMS <i>✦</i>
        </div>
      </section>

      <section className={styles.tracks} id="tracks">
        <div className={styles.sectionTop}>
          <div>
            <div className={styles.sectionLabel}>03 / TRACKS</div>
            <h2>Build in the area<br />you want to own.</h2>
          </div>
          <p>Each hackathon can combine multiple tracks, so builders can work on problems that match their skills—or stretch beyond them.</p>
        </div>

        <div className={styles.trackList}>
          {tracks.map((track) => (
            <Link href="/tracks" className={styles.trackRow} key={track.number}>
              <span className={styles.trackNumber}>{track.number}</span>
              <h3>{track.title}</h3>
              <p>{track.text}</p>
              <span className={styles.trackArrow}>↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.sectionLabel}>04 / HOW IT WORKS</div>
        <div className={styles.howHeading}>
          <h2>From zero to<br /><span>demo day.</span></h2>
          <p>One simple loop: join, build, ship, show. Then do it again with a harder problem.</p>
        </div>

        <div className={styles.steps}>
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.communityBlock}>
        <div className={styles.communityShape} aria-hidden="true">FC</div>
        <div className={styles.communityCopy}>
          <div className={styles.sectionLabel}>05 / COMMUNITY</div>
          <h2>Don&apos;t build alone.</h2>
          <p>
            Share progress, find teammates, review projects, exchange ideas, and stay around after
            the hackathon. FlightCoders is designed to be a community of people who keep shipping.
          </p>
          <div className={styles.communityActions}>
            <Link href="/community" className={styles.darkButton}>Enter the community ↗</Link>
            <Link href="/projects" className={styles.textLink}>See builder projects ↗</Link>
          </div>
        </div>
      </section>

      <section className={styles.partner}>
        <div>
          <div className={styles.sectionLabel}>06 / FOR TEAMS &amp; PARTNERS</div>
          <h2>Put a real problem<br />in front of builders.</h2>
        </div>
        <div>
          <p>
            Run a technical challenge with FlightCoders, give developers a meaningful problem,
            and turn your product, API, open-source project, or engineering brief into something people can build with.
          </p>
          <a href="mailto:hello@flightcoders.com" className={styles.partnerButton}>Partner with FlightCoders ↗</a>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.ctaBadge}>SEASON 01</div>
        <h2>Your next project<br />needs a deadline.</h2>
        <p>Join FlightCoders and build something worth putting at the top of your GitHub profile.</p>
        <Link href="/register" className={styles.finalButton}>Join the next build ↗</Link>
        <div className={styles.ctaOrbit} aria-hidden="true" />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.brandMark}>&lt;/&gt;</span>
          <strong>FlightCoders</strong>
          <p>Build. Ship. Connect.</p>
        </div>
        <div className={styles.footerLinks}>
          <div><span>BUILDERS</span><a href="#hackathons">Hackathons</a><Link href="/tracks">Tracks</Link><Link href="/projects">Projects</Link></div>
          <div><span>COMMUNITY</span><Link href="/community">Community</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link></div>
          <div><span>ACCOUNT</span><Link href="/register">Join</Link><Link href="/login">Sign in</Link><Link href="/dashboard">Dashboard</Link></div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 FlightCoders</span>
          <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </div>
      </footer>
    </main>
  );
}
