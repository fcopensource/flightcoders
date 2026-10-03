import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default async function VerifyEmailPage({searchParams}:{searchParams:Promise<{sent?:string;resent?:string;email?:string;error?:string;token?:string}>}){
 const p=await searchParams;

 // Support verification links generated before the email URL was corrected.
 if(p.token){
  redirect(`/api/auth/verify-email?token=${encodeURIComponent(p.token)}`);
 }

 return <main className="hf-auth-page"><SiteHeader/><section className="auth-shell shell"><div className="auth-aside hf-auth-aside"><div className="section-kicker dark">// VERIFY YOUR IDENTITY</div><h1>One click<br/><em>from the network.</em></h1><p>Email verification keeps builder profiles, teams, and shipped projects connected to real people.</p></div><div className="auth-card verification-card"><span className="auth-code">VERIFY / FC-02</span><h2>Check your inbox</h2>{p.error?<div className="form-error" role="alert">{p.error}</div>:<p>{p.resent?"A fresh verification link was sent.":"We sent a secure verification link to your email."} The link expires in 24 hours.</p>}<form action="/api/auth/verify-email" method="post"><label>Email address<input type="email" name="email" defaultValue={p.email||""} required placeholder="builder@example.com"/></label><button className="auth-button auth-submit" type="submit">Resend verification email <b>↗</b></button></form><p className="auth-switch"><Link href="/login">Return to login</Link></p></div></section><SiteFooter/></main>;
}
