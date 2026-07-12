import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default async function VerifyEmailPage({searchParams}:{searchParams:Promise<{sent?:string;resent?:string;email?:string;error?:string}>}){
 const p=await searchParams;
 return <main><SiteHeader/><section className="auth-shell shell"><div className="auth-aside"><div className="section-kicker dark">// IDENTITY CHECK</div><h1>Clearance<br/><em>awaiting.</em></h1><p>Email verification protects every project, progress record, and crew profile connected to FlightCoders.</p></div><div className="auth-card verification-card"><span className="auth-code">VERIFY / FC-02</span><h2>Check your inbox</h2>{p.error?<div className="form-error" role="alert">{p.error}</div>:<p>{p.resent?"A fresh verification link was sent.":"We sent a secure verification link to your email."} The link expires in 24 hours.</p>}<form action="/api/auth/verify-email" method="post"><label>Email address<input type="email" name="email" defaultValue={p.email||""} required placeholder="pilot@example.com"/></label><button className="auth-button auth-submit" type="submit">Resend verification email <b>↗</b></button></form><p className="auth-switch"><Link href="/login">Return to login</Link></p></div></section><SiteFooter/></main>;
}
