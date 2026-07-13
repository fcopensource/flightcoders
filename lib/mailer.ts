import "server-only";
import nodemailer from "nodemailer";

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) throw new Error("SMTP is not configured");
  return { host, user, pass, port: Number(process.env.SMTP_PORT || 465), secure: (process.env.SMTP_SECURE || "true") === "true" };
}

export async function sendVerificationEmail(input: { email:string; name:string; token:string }) {
  const config = smtpConfig();
  const appUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://flightcoders.com").replace(/\/+$/, "");
  const verificationUrl = `${appUrl}/api/auth/verify-email?token=${encodeURIComponent(input.token)}`;
  const transporter = nodemailer.createTransport({ host:config.host, port:config.port, secure:config.secure, auth:{ user:config.user, pass:config.pass } });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `FlightCoders <${config.user}>`, to:input.email,
    subject:"Verify your FlightCoders account",
    text:`Hi ${input.name}, verify your FlightCoders account: ${verificationUrl} This link expires in 24 hours.`,
    html:`<div style="font-family:Arial,sans-serif;background:#f5f3ed;padding:32px;color:#101727"><div style="max-width:600px;margin:auto;background:white;padding:36px;border:1px solid #d7d9dc"><b style="color:#3159f5">FLIGHTCODERS / EMAIL CLEARANCE</b><h1 style="font-size:36px">Verify your flight deck access.</h1><p>Hi ${input.name}, confirm your email to activate your account and enter the dashboard.</p><p><a href="${verificationUrl}" style="display:inline-block;background:#3159f5;color:white;padding:15px 22px;text-decoration:none;font-weight:bold">Verify email →</a></p><p style="color:#687381;font-size:13px">This secure link expires in 24 hours. If you did not create this account, ignore this email.</p></div></div>`
  });
}
