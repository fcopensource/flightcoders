import Link from "next/link";
import { Brand } from "./Brand";

export function SiteFooter(){
 return <footer className="shell hf-footer"><Link className="brand" href="/"><Brand/></Link><p>AI systems. Intelligent software. Thoughtful engineering.</p><div><Link href="/services">Services</Link><Link href="/about">About us</Link><Link href="/hire-us">Hire us</Link><Link href="/projects">Projects</Link><Link href="/community">Community</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 FLIGHTCODERS / BUILT GLOBALLY</small></footer>;
}
