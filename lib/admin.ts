import "server-only";
import { getCurrentUser } from "./auth";

export async function isCurrentUserAdmin(){
  const user=await getCurrentUser();
  if(!user) return false;
  const admins=(process.env.ADMIN_EMAILS||"").split(",").map(v=>v.trim().toLowerCase()).filter(Boolean);
  return admins.includes(user.email.toLowerCase());
}
