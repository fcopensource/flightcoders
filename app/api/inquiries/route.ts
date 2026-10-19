import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createHash } from "node:crypto";
const attempts=new Map<string,number>();
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>16000)return NextResponse.json({error:'Project brief is too large.'},{status:413});
 const raw=await request.text();if(raw.length>16000)return NextResponse.json({error:'Project brief is too large.'},{status:413});
 let body;try{body=JSON.parse(raw);}catch{return NextResponse.json({error:'Invalid request.'},{status:400});}
 if(!body||typeof body!=='object')return NextResponse.json({error:'Invalid request.'},{status:400});
 if(body.website)return NextResponse.json({ok:true});
 const fields=['name','email','company','service','budget','timeline','brief'] as const;
 const data=Object.fromEntries(fields.map(key=>[key,typeof body[key]==='string'?body[key].trim():'']));
 if(!data.name||data.name.length>80||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.email.length>190||!data.service||data.service.length>100||data.company.length>120||data.brief.length<20||data.brief.length>4000||data.budget.length>80||data.timeline.length>80||body.consent!=='on')return NextResponse.json({error:'Please complete the required fields and include a project description of 20–4,000 characters.'},{status:400});
 const host=process.env.SMTP_HOST,user=process.env.SMTP_USER,pass=process.env.SMTP_PASSWORD;
 if(!host||!user||!pass)return NextResponse.json({error:'Online inquiries are temporarily unavailable. Please send your brief to hire@flightcoders.com.'},{status:503});
 const key=createHash('sha256').update(data.email.toLowerCase()).digest('hex');const now=Date.now();for(const [k,t]of attempts)if(now-t>60000)attempts.delete(k);
 if(attempts.has(key))return NextResponse.json({error:'Please wait a minute before sending another inquiry.'},{status:429});attempts.set(key,now);
 try{const transporter=nodemailer.createTransport({host,port:Number(process.env.SMTP_PORT||465),secure:(process.env.SMTP_SECURE||'true')==='true',auth:{user,pass},connectionTimeout:10000,socketTimeout:15000});await transporter.sendMail({from:process.env.SMTP_FROM||`FlightCoders <${user}>`,to:'hire@flightcoders.com',replyTo:{name:data.name,address:data.email},subject:'New FlightCoders project inquiry',text:fields.map(key=>`${key.toUpperCase()}: ${data[key]}`).join('\n\n')});return NextResponse.json({ok:true});}catch{attempts.delete(key);return NextResponse.json({error:'Your brief could not be delivered. Please email hire@flightcoders.com directly.'},{status:503});}
}
