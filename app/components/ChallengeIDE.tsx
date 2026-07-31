"use client";

import {useMemo,useState} from "react";
import Editor from "@monaco-editor/react";
import type {FlightChallenge} from "../../lib/flightChallenges";

type JudgeResult={
 accepted:boolean;
 status:string;
 stdout:string;
 stderr:string;
 compileOutput:string;
 message:string;
 runtimeMs:number;
 memoryKb:number;
 testsPassed:number;
 totalTests:number;
 testResults:{name:string;passed:boolean;error:string}[];
 saved?:boolean;
};

export function ChallengeIDE({problem}:{problem:FlightChallenge}){
 const storageKey=`fc_challenge_${problem.slug}_javascript`;
 const [code,setCode]=useState(problem.starter);
 const [result,setResult]=useState<JudgeResult|null>(null);
 const [running,setRunning]=useState(false);
 const [notice,setNotice]=useState("READY FOR MISSION");
 const metrics=useMemo(()=>({lines:code.split("\n").length,characters:code.length}),[code]);

 function saveDraft(){
  localStorage.setItem(storageKey,code);
  setNotice("DRAFT SAVED ON THIS DEVICE");
 }
 function loadDraft(){
  const saved=localStorage.getItem(storageKey);
  if(saved){setCode(saved);setNotice("DRAFT RESTORED");}
  else setNotice("NO SAVED DRAFT FOUND");
 }
 function reset(){
  setCode(problem.starter);
  setResult(null);
  setNotice("STARTER CODE RESTORED");
 }
 async function execute(submit:boolean){
  setRunning(true);setResult(null);setNotice(submit?"SUBMITTING TO FLIGHT JUDGE":"RUNNING TEST FLIGHT");
  try{
   const response=await fetch("/api/lab/challenge",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challengeSlug:problem.slug,language:"javascript",sourceCode:code,submit})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Flight judge unavailable");
   setResult(data);
   setNotice(data.testsPassed===data.totalTests?"MISSION PASSED":"MISSION FAILED · CHECK TEST TELEMETRY");
  }catch(error){
   setNotice(error instanceof Error?error.message.toUpperCase():"FLIGHT JUDGE UNAVAILABLE");
  }finally{setRunning(false)}
 }

 return <div className="challenge-ide-shell">
  <aside className="challenge-brief-panel">
   <span className="challenge-system">{problem.system}</span>
   <h1>{problem.title}</h1>
   <div className="challenge-badges"><b>{problem.difficulty}</b><b>{problem.xp} XP</b></div>
   <p>{problem.brief}</p>
   <h2>Flight contract</h2><div className="challenge-contract">{problem.contract}</div>
   <h2>Operational constraints</h2><ul>{problem.constraints.map(item=><li key={item}>{item}</li>)}</ul>
  </aside>
  <main className="challenge-workspace">
   <header className="challenge-toolbar">
    <div><span>JS</span><section><b>flight_solution.js</b><small>{notice}</small></section></div>
    <nav><button onClick={loadDraft}>Load draft</button><button onClick={saveDraft}>Save</button><button onClick={reset}>Reset</button><button onClick={()=>execute(false)} disabled={running}>▶ Run</button><button className="challenge-submit" onClick={()=>execute(true)} disabled={running}>{running?"Judging…":"Submit solution"}</button></nav>
   </header>
   <div className="challenge-editor"><Editor height="100%" language="javascript" value={code} onChange={value=>{setCode(value||"");setNotice("UNSAVED CHANGES")}} theme="vs-dark" options={{fontSize:15,lineHeight:24,minimap:{enabled:true},automaticLayout:true,scrollBeyondLastLine:false,tabSize:2,padding:{top:16,bottom:16}}}/></div>
   <section className="challenge-results">
    <header><span>FLIGHT JUDGE TELEMETRY</span><b>{result?`${result.testsPassed}/${result.totalTests} TESTS · ${result.runtimeMs} MS · ${result.memoryKb} KB`:`${metrics.lines} LINES · ${metrics.characters} CHARACTERS`}</b></header>
    {!result?<p>Run or submit your solution to execute the mission tests.</p>:<div className="test-result-list">{result.testResults.map((test,index)=><article key={test.name} className={test.passed?"passed":"failed"}><i>{test.passed?"✓":"×"}</i><div><b>Test {index+1}: {test.name}</b>{test.error&&<small>{test.error}</small>}</div></article>)}</div>}
    {result&&(result.compileOutput||result.stderr)&&<pre>{result.compileOutput||result.stderr}</pre>}
    {result?.saved&&<em>Submission saved to your FlightCoders history.</em>}
   </section>
  </main>
  <style>{`
   .challenge-ide-shell{min-height:calc(100vh - 68px);display:grid;grid-template-columns:390px minmax(0,1fr);background:#07101d;color:#e8f1ff}.challenge-brief-panel{padding:34px 28px;border-right:1px solid #22334b;background:linear-gradient(180deg,#0c1728,#08111d);overflow:auto}.challenge-system{color:#72a0ff;font-size:10px;font-weight:900;letter-spacing:.13em}.challenge-brief-panel h1{font-size:32px;line-height:1.12;margin:12px 0}.challenge-badges{display:flex;gap:8px;margin-bottom:20px}.challenge-badges b{padding:6px 9px;border:1px solid #304866;border-radius:6px;color:#a9c4ec;font-size:10px;letter-spacing:.08em}.challenge-brief-panel p,.challenge-brief-panel li{color:#8fa1b8;font-size:13px;line-height:1.65}.challenge-brief-panel h2{font-size:14px;margin:27px 0 10px}.challenge-contract{padding:14px;border:1px solid #2b4160;border-left:3px solid #668fff;border-radius:7px;background:#091321;color:#aec1dd;font-size:12px;line-height:1.65}.challenge-brief-panel ul{padding-left:19px;display:grid;gap:8px}.challenge-workspace{min-width:0;display:grid;grid-template-rows:64px minmax(430px,1fr) auto}.challenge-toolbar{display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid #263850;background:#0c1625;gap:15px}.challenge-toolbar>div{display:flex;align-items:center;gap:10px}.challenge-toolbar>div>span{display:grid;place-items:center;width:34px;height:34px;border-radius:7px;background:#f0c34e;color:#111827;font-size:11px;font-weight:950}.challenge-toolbar section b,.challenge-toolbar section small{display:block}.challenge-toolbar section b{font-size:12px}.challenge-toolbar section small{margin-top:3px;color:#7186a3;font-size:8px;font-weight:900;letter-spacing:.09em}.challenge-toolbar nav{display:flex;gap:7px;flex-wrap:wrap}.challenge-toolbar button{border:1px solid #30445f;background:#111e30;color:#afc0d8;padding:8px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer}.challenge-toolbar button:disabled{opacity:.45}.challenge-toolbar .challenge-submit{background:#315ff4;border-color:#315ff4;color:white}.challenge-editor{min-height:430px}.challenge-results{border-top:1px solid #253750;background:#070d17;padding:0 18px 18px}.challenge-results>header{height:48px;display:flex;align-items:center;justify-content:space-between;color:#7186a3;font-size:9px;font-weight:900;letter-spacing:.1em}.challenge-results>header b{color:#96a9c3}.challenge-results>p{color:#71839b;font-size:12px}.test-result-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px}.test-result-list article{display:flex;gap:10px;padding:11px;border:1px solid #293a51;border-radius:8px;background:#0d1725}.test-result-list article i{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;font-style:normal;font-weight:900}.test-result-list article.passed i{background:rgba(59,210,133,.13);color:#58dc94}.test-result-list article.failed i{background:rgba(255,91,105,.13);color:#ff6a78}.test-result-list article b{font-size:11px}.test-result-list article small{display:block;margin-top:5px;color:#ff8791;font-size:10px;line-height:1.45}.challenge-results pre{white-space:pre-wrap;color:#ff9aa3;background:#130b10;border:1px solid #4b2530;padding:10px;border-radius:7px;font-size:11px}.challenge-results em{display:block;margin-top:10px;color:#55d994;font-size:11px;font-style:normal}@media(max-width:980px){.challenge-ide-shell{grid-template-columns:1fr}.challenge-brief-panel{border-right:0;border-bottom:1px solid #22334b}.challenge-workspace{grid-template-rows:auto 520px auto}.challenge-toolbar{padding:12px;align-items:flex-start;flex-direction:column}.challenge-toolbar nav{width:100%}}`}</style>
 </div>;
}
