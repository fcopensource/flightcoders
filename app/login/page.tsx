import type { Metadata } from "next";
import { noIndexMetadata } from "../../lib/seo";
import { AuthFrame } from "../components/AuthFrame";
import { AccountForm } from "../components/AccountForm";
export const metadata:Metadata={title:"Sign in",...noIndexMetadata};
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string;next?:string;verified?:string}>}){
 const params=await searchParams;
 const next=params.next?.startsWith("/")&&!params.next.startsWith("//")?params.next:"/dashboard";
 return <AuthFrame mode="login"><AccountForm githubEnabled={Boolean(process.env.GITHUB_CLIENT_ID?.trim())} mode="login" next={next} error={params.error} verified={Boolean(params.verified)}/></AuthFrame>;
}
