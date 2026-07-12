import Link from "next/link";

export function SiteHeader() {
  return (
    <nav className="nav shell" aria-label="Main navigation">
      <Link className="brand" href="/" aria-label="FlightCoders home"><span className="brand-mark">F/C</span> FlightCoders</Link>
      <div className="nav-links">
        <Link href="/tracks">Tracks</Link><Link href="/community">Community</Link><Link href="/about">About</Link>
      </div>
      <div className="nav-actions"><Link className="nav-login" href="/login">Log in</Link><Link className="button button-small" href="/register">Join the crew <span>↗</span></Link></div>
    </nav>
  );
}
