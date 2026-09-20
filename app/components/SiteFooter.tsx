import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="shell fc-footer">
      <div className="fc-footer-brand"><Link className="brand" href="/"><span className="brand-mark">F/C</span> FlightCoders</Link><p>A developer community that turns client problems into shipped software.</p></div>
      <div className="fc-footer-links"><Link href="/projects">Projects</Link><Link href="/community">Developers</Link><Link href="/jobs">Opportunities</Link><Link href="/blog">Insights</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      <small>© 2026 FlightCoders · Built by developers, for builders.</small>
    </footer>
  );
}
