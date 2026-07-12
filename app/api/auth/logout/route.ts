import { NextResponse } from "next/server";
import {
  deleteCurrentSession,
  SESSION_COOKIE,
} from "../../../../lib/auth";

function getPublicOrigin(request: Request): string {
  const configuredUrl =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }

  const requestUrl = new URL(request.url);

  if (
    process.env.NODE_ENV === "production" &&
    ["0.0.0.0", "localhost", "127.0.0.1"].includes(
      requestUrl.hostname
    )
  ) {
    return "https://flightcoders.com";
  }

  return requestUrl.origin;
}

export async function POST(request: Request) {
  try {
    await deleteCurrentSession();
  } catch (error) {
    console.error("Logout session deletion failed:", error);
  }

  const response = NextResponse.redirect(
    new URL("/", getPublicOrigin(request)),
    303
  );

  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}