import { pageMetadata } from "../../lib/seo";
import { AuthFrame } from "../components/AuthFrame";
import { AccountForm } from "../components/AccountForm";
export const metadata=pageMetadata({title:"Create your account",description:"Create your FlightCoders account to build your profile, share your projects, and connect with developers.",path:"/register"});
export default async function RegisterPage({searchParams}:{searchParams:Promise<{error?:string}>}){
 const params=await searchParams;
 return <AuthFrame mode="register"><AccountForm mode="register" error={params.error}/></AuthFrame>;
}
