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
    subject:"Verify your FlightCoders builder profile",
    text:`Hi ${input.name}, verify your FlightCoders builder profile: ${verificationUrl} This link expires in 24 hours.`,
    html:`<div style="font-family:Arial,sans-serif;background:#0b0b0d;padding:32px;color:#0b0b0d"><div style="max-width:600px;margin:auto;background:#f1f0e9;padding:38px;border:1px solid #c9ff3d"><b style="color:#6847ef">FLIGHTCODERS / BUILDER IDENTITY</b><h1 style="font-size:38px;line-height:1.05">One click from the network.</h1><p>Hi ${input.name}, confirm your email to activate your builder profile and enter FlightCoders.</p><p><a href="${verificationUrl}" style="display:inline-block;background:#c9ff3d;color:#0b0b0d;border:1px solid #0b0b0d;padding:15px 22px;text-decoration:none;font-weight:bold">Verify email →</a></p><p style="color:#68665f;font-size:13px">This secure link expires in 24 hours. If you did not create this profile, ignore this email.</p></div></div>`
  });
}
