import "server-only";
import type { RowDataPacket } from "mysql2";
import { getDb } from "./db";
export const socialKeys = ["github","linkedin","website","x"] as const;
export type SocialLinks = Record<typeof socialKeys[number],string>;
export async function ensureSocialLinks(){
 await getDb().execute("CREATE TABLE IF NOT EXISTS profile_social_links (user_id INT UNSIGNED NOT NULL PRIMARY KEY, github VARCHAR(500) NOT NULL DEFAULT '', linkedin VARCHAR(500) NOT NULL DEFAULT '', website VARCHAR(500) NOT NULL DEFAULT '', x VARCHAR(500) NOT NULL DEFAULT '')");
}
export async function getSocialLinks(id:number):Promise<SocialLinks>{
 await ensureSocialLinks();
 const [rows]=await getDb().execute<RowDataPacket[]>("SELECT github,linkedin,website,x FROM profile_social_links WHERE user_id=?",[id]);
 return {github:rows[0]?.github||"",linkedin:rows[0]?.linkedin||"",website:rows[0]?.website||"",x:rows[0]?.x||""};
}
