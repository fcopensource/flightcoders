"use client";
export default function DashboardError({reset}:{reset:()=>void}){return <main style={{maxWidth:600,margin:"100px auto",padding:24}}><h1>Your workspace is temporarily unavailable.</h1><p>We couldn’t connect to your account. Please try again shortly.</p><button onClick={reset}>Try again</button></main>;}
