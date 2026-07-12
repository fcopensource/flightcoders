"use client";
import { useEffect, useState } from "react";

export function SystemStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then(response => setStatus(response.ok ? "online" : "offline"))
      .catch(() => setStatus("offline"));
  }, []);
  return <div className={`system-status ${status}`} role="status"><span/>{status === "checking" ? "Checking registration systems..." : status === "online" ? "Registration systems online" : "Registration systems offline — connect MySQL to continue"}</div>;
}
