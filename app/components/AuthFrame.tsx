import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "./Brand";
import { Icon } from "./Icon";
export function AuthFrame({children}:{mode:"login"|"register";children:ReactNode}){return <main className="auth-experience auth-focused"><header className="auth-top"><Link className="brand" href="/" aria-label="FlightCoders home"><Brand/></Link><Link className="auth-home" href="/"><Icon name="layers"/>Back to website</Link></header><section className="auth-stage"><div className="auth-form-side">{children}</div></section><div className="auth-company-caption"><span>SOFTWARE PRODUCTS · CUSTOM DEVELOPMENT · AI SYSTEMS</span><a href="mailto:hire@flightcoders.com">Looking for a development partner? Talk to us.</a></div><footer className="auth-bottom"><span>© {new Date().getFullYear()} FlightCoders</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:hire@flightcoders.com">Contact us</a></div></footer></main>}
