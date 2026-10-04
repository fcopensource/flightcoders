import Link from "next/link";
import { Brand } from "./Brand";

export function SiteFooter(){
 return <footer className="shell hf-footer"><Link className="brand" href="/"><Brand/></Link><p>Where ambitious builders meet what’s next.</p><div><Link href="/#hackathons">Hackathons</Link><Link href="/#radar">Tech Radar</Link><Link href="/#builders">Builders</Link><Link href="/#projects">Projects</Link><Link href="/register">Join</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 FLIGHTCODERS / BUILT GLOBALLY</small></footer>;
}
