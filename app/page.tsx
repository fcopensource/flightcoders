import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import Link from "next/link";
import { getDb } from "../lib/db";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CodeLab } from "./components/CodeLab";

interface HomePost extends RowDataPacket {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: Date;
}

interface HomeProject extends RowDataPacket {
  slug: string;
  name: string;
  tagline: string;
  technologies: string;
  accent_color: string;
}

const levels = [
  {
    number: "01",
    label: "Foundations",
    title: "Learn the language of code",
    text: "Build fluency with syntax, logic, functions, data, and the habits that make programs reliable.",
    skills: ["Python", "JavaScript", "Git"],
  },
  {
    number: "02",
    label: "Problem solving",
    title: "Turn concepts into solutions",
    text: "Practice data structures, algorithms, debugging, and deliberate problem decomposition.",
    skills: ["DSA", "Testing", "Debugging"],
  },
  {
    number: "03",
    label: "Build & ship",
    title: "Create work you can prove",
    text: "Combine your skills in portfolio-ready software projects that stand up to review.",
    skills: ["Projects", "APIs", "Deployment"],
  },
];

const outcomes = [
  ["01", "A path, not a playlist", "Know your current level, the next skill to unlock, and why it matters."],
  ["02", "Practice that responds", "Write code, test an idea, see the result, and improve through tight feedback loops."],
  ["03", "Proof over promises", "Finish with working projects and a visible record of the skills you used."],
];

export const metadata: Metadata = {
  title: "FlightCoders | Coding Practice for CS & Engineering Students",
  description:
    "Level up your coding skills through structured challenges and practical projects for computer science and engineering students.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const db = getDb();
  const [[posts], [projects]] = await Promise.all([
    db.execute<HomePost[]>(
      "SELECT slug,title,excerpt,category,published_at FROM blog_posts WHERE published=TRUE ORDER BY published_at DESC,id DESC LIMIT 3",
    ),
    db.execute<HomeProject[]>(
      "SELECT slug,name,tagline,technologies,accent_color FROM projects WHERE featured=TRUE ORDER BY launched_at DESC,id DESC LIMIT 2",
    ),
  ]);

  return (
    <main className="fc-home">
      <div className="fc-nav-wrap"><SiteHeader /></div>

      <section className="fc-hero shell">
        <div className="fc-hero-copy">
          <div className="fc-status"><i /> Structured coding progression for CS & engineering students</div>
          <h1>Build coding skills<br />that <em>go somewhere.</em></h1>
          <p>Move from fundamentals to problem-solving to shipping real projects—one focused flight level at a time.</p>
          <div className="fc-hero-actions">
            <Link className="fc-primary" href="/register">Start your flight plan <span>↗</span></Link>
            <a className="fc-secondary" href="#flight-levels">Explore the levels <span>↓</span></a>
          </div>
          <div className="fc-hero-proof">
            <span><b>3</b> clear stages</span>
            <span><b>1</b> practical path</span>
            <span><b>∞</b> room to grow</span>
          </div>
        </div>

        <div className="fc-hero-visual" aria-label="Coding skill progression from foundations to shipped projects">
          <div className="fc-orbit orbit-a" aria-hidden="true" />
          <div className="fc-orbit orbit-b" aria-hidden="true" />
          <div className="fc-terminal">
            <header><span><i /><i /><i /></span><b>progress.ts</b><small>FLIGHT / 03</small></header>
            <pre aria-hidden="true"><code><span className="fc-purple">const</span> journey = [<br />
              &nbsp;&nbsp;<span className="fc-green">&quot;foundations&quot;</span>,<br />
              &nbsp;&nbsp;<span className="fc-green">&quot;problem-solving&quot;</span>,<br />
              &nbsp;&nbsp;<span className="fc-green">&quot;build-and-ship&quot;</span><br />
              ];<br /><br />
              journey.<span className="fc-blue">map</span>(skill =&gt; <span className="fc-purple">learn</span>(skill));<br />
              <span className="fc-muted">// next level unlocked_</span></code></pre>
            <footer><span><i /> BUILD PASSED</span><b>03 / 03</b></footer>
          </div>
          <div className="fc-level-stack" aria-hidden="true">
            <span className="is-done"><i>01</i><b>FOUNDATIONS</b><em>COMPLETE</em></span>
            <span className="is-done"><i>02</i><b>PROBLEM SOLVING</b><em>COMPLETE</em></span>
            <span className="is-live"><i>03</i><b>BUILD & SHIP</b><em>ACTIVE</em></span>
          </div>
          <svg className="fc-route" viewBox="0 0 520 170" aria-hidden="true">
            <path d="M18 142 C145 142 116 38 252 55 S383 154 502 31" />
            <circle cx="18" cy="142" r="5" /><circle cx="252" cy="55" r="5" /><circle cx="502" cy="31" r="5" />
          </svg>
        </div>
      </section>

      <div className="fc-signal">
        <div><span>PYTHON</span><i /> <span>JAVASCRIPT</span><i /> <span>DATA STRUCTURES</span><i /> <span>ALGORITHMS</span><i /> <span>GIT</span><i /> <span>REAL PROJECTS</span></div>
      </div>

      <section className="fc-levels shell" id="flight-levels">
        <div className="fc-section-intro">
          <span>THE FLIGHT PLAN</span>
          <h2>A clear route from<br /><em>learning to building.</em></h2>
          <p>No random tutorials. Each level connects what you learn to what you can do next.</p>
        </div>
        <div className="fc-level-grid">
          {levels.map((level, index) => (
            <article className="fc-level-card" key={level.number}>
              <div className="fc-level-top"><span>{level.number}</span><i>{String(index + 1).padStart(2, "0")} / 03</i></div>
              <small>{level.label}</small>
              <h3>{level.title}</h3>
              <p>{level.text}</p>
              <div>{level.skills.map(skill => <b key={skill}>{skill}</b>)}</div>
              <Link href="/tracks">Explore level <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <CodeLab />

      <section className="fc-method">
        <div className="shell">
          <div className="fc-section-intro fc-section-intro-dark">
            <span>WHY FLIGHTCODERS</span>
            <h2>Momentum you<br /><em>can measure.</em></h2>
            <p>The platform turns learning into a visible sequence of practice, feedback, and proof.</p>
          </div>
          <div className="fc-outcome-grid">
            {outcomes.map(([number, title, text]) => (
              <article key={number}><span>{number}</span><div className="fc-outcome-icon" aria-hidden="true"><i /><i /><i /></div><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <div className="fc-progress-map" aria-hidden="true">
            <span className="complete"><i />LEARN</span><b /><span className="complete"><i />PRACTICE</span><b /><span className="active"><i />BUILD</span><b /><span><i />SHIP</span>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="fc-projects shell">
          <div className="fc-section-intro fc-section-row">
            <div><span>PROOF OF WORK</span><h2>Projects that make<br /><em>progress visible.</em></h2></div>
            <Link href="/projects">View every project ↗</Link>
          </div>
          <div className="fc-project-grid">
            {projects.map((project, index) => (
              <Link href={`/projects/${project.slug}`} className="fc-project-card" key={project.slug} style={{ "--fc-accent": project.accent_color } as React.CSSProperties}>
                <header><span>0{index + 1} / CASE STUDY</span><b>↗</b></header>
                <div className="fc-project-mark">{project.name.slice(0, 1)}</div>
                <h3>{project.name}</h3>
                <p>{project.tagline}</p>
                <div>{project.technologies.split(",").slice(0, 4).map(item => <b key={item}>{item.trim()}</b>)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="fc-notes">
          <div className="shell">
            <div className="fc-section-intro fc-section-row">
              <div><span>FIELD NOTES</span><h2>Ideas worth adding<br /><em>to your toolkit.</em></h2></div>
              <Link href="/blog">Browse all notes ↗</Link>
            </div>
            <div className="fc-note-list">
              {posts.map((post, index) => (
                <article key={post.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{post.category} · {new Date(post.published_at).toLocaleDateString("en", { month: "short", day: "2-digit" })}</small><h3>{post.title}</h3><p>{post.excerpt}</p></div>
                  <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>↗</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="fc-final shell">
        <div className="fc-final-card">
          <div className="fc-final-route" aria-hidden="true"><i /><i /><i /><i /></div>
          <span>YOUR NEXT LEVEL IS READY</span>
          <h2>Stop collecting tutorials.<br /><em>Start building momentum.</em></h2>
          <p>Join FlightCoders and follow a practical path from coding fundamentals to projects you can share.</p>
          <Link className="fc-primary fc-primary-light" href="/register">Create your flight plan <span>↗</span></Link>
        </div>
      </section>

      <div className="fc-footer-wrap"><SiteFooter /></div>
    </main>
  );
}
