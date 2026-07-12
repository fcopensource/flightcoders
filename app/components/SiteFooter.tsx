import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="shell">
      <Link className="brand" href="/"><span className="brand-mark">F/C</span> FlightCoders</Link>
      <p>Code the future of flight.</p>
      <div><Link href="/tracks">Tracks</Link><Link href="/community">Community</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      <small>© 2026 FlightCoders</small>
    </footer>
  );
}
