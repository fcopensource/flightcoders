"use client";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { fetch("/api/ai/chat").then(r => r.ok ? r.json() : null).then(data => data?.messages && setMessages(data.messages)).catch(() => {}); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    const message = text.trim(); if (!message || loading) return;
    setText(""); setError(""); setMessages(current => [...current, { role: "user", content: message }]); setLoading(true);
    try { const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Mentor unavailable"); setMessages(current => [...current, { role: "assistant", content: data.reply }]); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Mentor unavailable"); }
    finally { setLoading(false); }
  }
  return <section className="ai-mentor"><div className="ai-head"><div><span className="ai-orb">✦</span><span><b>VECTOR</b><small>FLIGHTCODERS AI MENTOR</small></span></div><i><span/> ONLINE</i></div><div className="ai-messages">{messages.length===0&&<div className="ai-welcome"><b>Mission control is ready.</b><p>Ask about flight software, autonomy, robotics, data, debugging, or your next project.</p><div><button onClick={()=>setText("Explain sensor fusion like I’m a junior developer.")}>Explain sensor fusion</button><button onClick={()=>setText("Give me a starter drone telemetry project.")}>Plan a project</button></div></div>}{messages.map((m,i)=><div className={`ai-message ${m.role}`} key={i}><small>{m.role==="user"?"YOU":"VECTOR"}</small><p>{m.content}</p></div>)}{loading&&<div className="ai-thinking"><span/><span/><span/></div>}{error&&<div className="ai-error">{error}</div>}<div ref={end}/></div><form className="ai-input" onSubmit={send}><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ask Vector about flight code..." maxLength={2000} rows={2}/><button type="submit" disabled={loading||!text.trim()} aria-label="Send to Vector">↗</button></form><small className="ai-note">Educational guidance only · 30 messages/day</small></section>;
}
