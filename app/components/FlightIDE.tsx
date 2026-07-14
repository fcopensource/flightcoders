"use client";
import {useMemo,useState} from "react";
import {flightChallenges} from "../../lib/flightChallenges";

type TestResult={name:string;passed:boolean;message:string;duration:number};
function execute(code:string,tests:{name:string;code:string}[]):Promise<TestResult[]>{
 return new Promise((resolve)=>{
  const source=`self.onmessage=async(e)=>{const {code,tests}=e.data;const out=[];try{(0,eval)(code);for(const t of tests){const s=Date.now();try{const fn=new Function(t.code);await fn();out.push({name:t.name,passed:true,message:'Nominal',duration:Date.now()-s})}catch(x){out.push({name:t.name,passed:false,message:String(x&&x.message||x),duration:Date.now()-s})}}self.postMessage({out})}catch(x){self.postMessage({error:String(x&&x.message||x)})}}`;
  const worker=new Worker(URL.createObjectURL(new Blob([source],{type:"text/javascript"}))); const timer=setTimeout(()=>{worker.terminate();resolve(tests.map(t=>({name:t.name,passed:false,message:"Execution exceeded 2000ms",duration:2000})))},2000);
  worker.onmessage=(event)=>{clearTimeout(timer);worker.terminate();resolve(event.data.out||tests.map(t=>({name:t.name,passed:false,message:event.data.error||"Runtime fault",duration:0})))};
  worker.postMessage({code,tests});
 });
}
export function FlightIDE({initialSolved}:{initialSolved:string[]}){
 const [index,setIndex]=useState(0), challenge=flightChallenges[index];
 const [code,setCode]=useState(challenge.starter),[results,setResults]=useState<TestResult[]>([]),[running,setRunning]=useState(false),[consoleText,setConsoleText]=useState("Awaiting flight program…"),[solved,setSolved]=useState(new Set(initialSolved));
 const lines=useMemo(()=>code.split("\n").length,[code]);
 function selectMission(i:number){setIndex(i);setCode(flightChallenges[i].starter);setResults([]);setConsoleText("Mission loaded. Complete the flight program, then run validation.")}
 async function run(submit=false){setRunning(true);setConsoleText("Compiling isolated flight program…");const r=await execute(code,challenge.tests);setResults(r);const passed=r.every(x=>x.passed);setConsoleText(passed?"ALL SYSTEMS NOMINAL — every validation gate passed.":"VALIDATION ABORTED — inspect failed systems below.");setRunning(false);if(submit){await fetch("/api/lab/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challengeSlug:challenge.slug,language:"javascript",code,passed,testsPassed:r.filter(x=>x.passed).length,totalTests:r.length,runtimeMs:r.reduce((n,x)=>n+x.duration,0)})});if(passed)setSolved(s=>new Set([...s,challenge.slug]));}}
 return <div className="flight-ide">
  <aside className="mission-rail"><div className="rail-heading"><span>MISSION BANK</span><b>{solved.size}/{flightChallenges.length}</b></div>{flightChallenges.map((item,i)=><button key={item.slug} className={i===index?"active":""} onClick={()=>selectMission(i)}><i>{solved.has(item.slug)?"✓":String(i+1).padStart(2,"0")}</i><span><b>{item.title}</b><small>{item.system}</small></span><em>{item.difficulty}</em></button>)}<div className="rail-signal"><i/><span>JUDGE ONLINE</span><small>Browser-isolated · 2s limit</small></div></aside>
  <section className="mission-brief"><header><span>MISSION {String(index+1).padStart(2,"0")} / {challenge.system}</span><b>{challenge.difficulty} · {challenge.xp} XP</b></header><h1>{challenge.title}</h1><p>{challenge.brief}</p><h2>Flight contract</h2><code>{challenge.contract}</code><h2>Operational constraints</h2><ul>{challenge.constraints.map(x=><li key={x}>{x}</li>)}</ul><div className="architecture-map" aria-label="System architecture"><span>SENSORS</span><i>→</i><span>FLIGHT CORE</span><i>→</i><span>ACTUATORS</span><b>REDUNDANCY BUS / LIVE</b></div></section>
  <section className="ide-panel"><header><div><i/><i/><i/><span>flight_solution.js</span></div><nav><button className="active">JavaScript</button><button disabled title="Coming soon">Python</button><button disabled title="Coming soon">C++</button></nav><div className="ide-actions"><button onClick={()=>{setCode(challenge.starter);setResults([])}}>Reset</button><button onClick={()=>run(false)} disabled={running}>▶ Run</button><button className="submit-code" onClick={()=>run(true)} disabled={running}>{running?"Validating…":"Submit flight plan"}</button></div></header><div className="editor-shell"><pre aria-hidden>{Array.from({length:lines},(_,i)=><span key={i}>{i+1}</span>)}</pre><textarea spellCheck={false} aria-label="Flight code editor" value={code} onChange={e=>setCode(e.target.value)}/></div><div className="judge-console"><header><span>VALIDATION CONSOLE</span><b>{results.filter(x=>x.passed).length}/{results.length||challenge.tests.length} GATES</b></header><p>{consoleText}</p>{results.map(r=><div key={r.name} className={r.passed?"pass":"fail"}><b>{r.passed?"PASS":"FAIL"}</b><span>{r.name}</span><small>{r.message} · {r.duration}ms</small></div>)}</div></section>
 </div>
}
