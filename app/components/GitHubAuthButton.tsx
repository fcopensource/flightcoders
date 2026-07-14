import Link from "next/link";
export function GitHubAuthButton({next="/dashboard",label="Continue with GitHub"}:{next?:string;label?:string}){return <Link className="github-auth-button" href={`/api/auth/github?next=${encodeURIComponent(next)}`}><span className="github-auth-mark">GH</span><b>{label}</b><span>↗</span></Link>}
